import { describe, it, expect } from 'vitest';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { importOne, TransportIntegrityError } from '../../scripts/import-content.mjs';
import { sha256 } from '@/lib/content/integrity';

/**
 * The behavioural change required by `project-workflow.md` v1.1 section 10.
 *
 * Under v1.0 the import silently repaired transport damage — it stitched interrupted tables
 * back together and stripped emphasis out of link targets. Those repairs are gone. This
 * suite proves the import now *refuses* corrupt input instead, and that no repair can run
 * ahead of the integrity gate.
 */

function workspace(sourceText: string) {
  const dir = mkdtempSync(join(tmpdir(), 'ubg-import-'));
  mkdirSync(join(dir, 'content-source'), { recursive: true });
  mkdirSync(join(dir, 'src/content/docs'), { recursive: true });
  const sourcePath = join(dir, 'content-source/example.md');
  writeFileSync(sourcePath, sourceText);
  return { dir, sourcePath, digest: sha256(readFileSync(sourcePath)) };
}

const FRONTMATTER = `---
page_id: "example"
title: "Example"
status: "Approved"
slug: "/example/"
---
`;

const CLEAN_BODY = `
Some approved prose.

| Column | Meaning |
|---|---|
| One | First |

A [valid link](/somewhere/).
`;

function entryFor(sourceText: string, overrides: Record<string, unknown> = {}) {
  const { dir, digest } = workspace(sourceText);
  return {
    dir,
    digest,
    entry: {
      source: 'content-source/example.md',
      target: 'src/content/docs/example.mdx',
      sourceVersion: 'test',
      state: 'Approved',
      sha256: digest,
      ...overrides,
    },
  };
}

describe('import transport gate', () => {
  it('imports a clean, correctly checksummed release', () => {
    const { dir, entry } = entryFor(FRONTMATTER + CLEAN_BODY);
    const result = importOne(entry, { root: dir });

    expect(result.output).toContain('Some approved prose.');
    expect(result.findings.some((f) => f.startsWith('Transport integrity verified'))).toBe(true);
  });

  it('refuses a release with no checksum in the record', () => {
    const { dir, entry } = entryFor(FRONTMATTER + CLEAN_BODY, { sha256: null });
    expect(() => importOne(entry, { root: dir })).toThrow(TransportIntegrityError);
    expect(() => importOne(entry, { root: dir })).toThrow(/checksum-missing/);
  });

  it('refuses a release whose checksum does not match', () => {
    const { dir, entry } = entryFor(FRONTMATTER + CLEAN_BODY, { sha256: 'b'.repeat(64) });
    expect(() => importOne(entry, { root: dir })).toThrow(/checksum-mismatch/);
  });

  it('refuses an interrupted table instead of stitching it back together', () => {
    const broken = FRONTMATTER + `\nProse.\n\n| A | B |\n\n|---|---|\n\n| One | First |\n`;
    const { dir, entry } = entryFor(broken);

    expect(() => importOne(entry, { root: dir })).toThrow(/markdown-table-interrupted/);
    // The old behaviour would have produced output with the table repaired.
    expect(existsSync(join(dir, 'src/content/docs/example.mdx'))).toBe(false);
  });

  it('refuses a malformed link target instead of stripping the emphasis', () => {
    const broken = FRONTMATTER + `\nSee the [guide](*../index*).\n`;
    const { dir, entry } = entryFor(broken);
    expect(() => importOne(entry, { root: dir })).toThrow(/markdown-link-malformed/);
  });

  it('refuses systematic blank-line insertion instead of collapsing it', () => {
    const lines = Array.from({ length: 40 }, (_, i) => `Line ${i} of prose.`);
    const doubled = FRONTMATTER + '\n' + lines.join('\n\n') + '\n';
    const { dir, entry } = entryFor(doubled);
    expect(() => importOne(entry, { root: dir })).toThrow(/systematic-blank-lines/);
  });

  it('refuses mojibake instead of re-encoding it', () => {
    const broken = FRONTMATTER + `\nAn em dash â€” here.\n`;
    const { dir, entry } = entryFor(broken);
    expect(() => importOne(entry, { root: dir })).toThrow(/mojibake/);
  });

  it('refuses CRLF line endings', () => {
    const { dir, entry } = entryFor((FRONTMATTER + CLEAN_BODY).replace(/\n/g, '\r\n'));
    expect(() => importOne(entry, { root: dir })).toThrow(/encoding-crlf/);
  });

  it('names the stop condition and points at the corrected-artifact route', () => {
    const { dir, entry } = entryFor(FRONTMATTER + CLEAN_BODY, { sha256: null });
    try {
      importOne(entry, { root: dir });
      throw new Error('expected the import to refuse this release');
    } catch (error) {
      const message = String(error);
      expect(message).toContain('project-workflow.md v1.1');
      expect(message).toContain('corrected release artifact');
      expect(message).toContain('do not repair the approved source');
    }
  });

  it('still applies permitted transformations once integrity passes', () => {
    const { dir, entry } = entryFor(FRONTMATTER + CLEAN_BODY);
    const result = importOne(entry, { root: dir });

    // `slug` is reserved by Astro's routing; renaming it is a schema-integration
    // transformation, not a corruption repair, and runs only after the gate.
    expect(result.output).toContain('permanent_slug: "/example/"');
    expect(result.output).not.toMatch(/^slug:/m);
  });

  it('records the verified source checksum in the publication copy', () => {
    const { dir, entry, digest } = entryFor(FRONTMATTER + CLEAN_BODY);
    expect(importOne(entry, { root: dir }).output).toContain(`Source SHA-256: ${digest}`);
  });
});

describe('no repair helpers remain in the import path', () => {
  const script = readFileSync(join(import.meta.dirname, '../../scripts/import-content.mjs'), 'utf8');

  it('has removed the table and blank-line repair functions', () => {
    for (const removed of ['restoreBlockContiguity', 'repairLinkTargets', 'normalizeFrontmatter']) {
      expect(script, `${removed} must not be reintroduced`).not.toContain(`function ${removed}`);
    }
  });

  it('validates before it transforms', () => {
    const gate = script.indexOf('validateReleaseFile');
    const transform = script.indexOf('renameReservedSlug(frontmatter');
    expect(gate).toBeGreaterThan(-1);
    expect(transform).toBeGreaterThan(gate);
  });
});
