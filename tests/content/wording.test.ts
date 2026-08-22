import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { markdownToText, normalizeTypography, renderedText, words } from '../helpers/text';

/**
 * The guarantee this build rests on: the published Section 0 says exactly what the approved
 * source says.
 *
 * Claude may not reword, shorten, expand, or reorganise approved prose (CLAUDE.md,
 * "Editorial Source of Truth"; project-workflow.md v1.0, section 8.2). The import script's
 * comments assert that; this test proves it, and will fail if any future change — a rehype
 * plugin, a component, a "small cleanup" — alters a single reader-visible word.
 *
 * Guide version 1.5 ships its own frontmatter and no body heading, orientation block, or
 * table of contents, so the whole Markdown body below the frontmatter is reader-facing and
 * must survive intact.
 */

const root = join(import.meta.dirname, '../..');
const SOURCE = join(root, 'content-source/before-you-launch.md');
const BUILT = join(root, 'dist/before-you-launch/index.html');

/** The approved body: everything after the closing frontmatter delimiter. */
function approvedBodyText(): string {
  const raw = readFileSync(SOURCE, 'utf8');
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Approved source has no frontmatter');
  return markdownToText(match[1]);
}

describe('Section 0 publication copy', () => {
  const expected = words(approvedBodyText());
  const actual = words(renderedText(BUILT));

  it('renders every approved word, in order, with nothing added or removed', () => {
    const limit = Math.min(expected.length, actual.length);
    let firstDifference = -1;
    for (let i = 0; i < limit; i++) {
      if (expected[i] !== actual[i]) {
        firstDifference = i;
        break;
      }
    }

    if (firstDifference !== -1) {
      const from = Math.max(0, firstDifference - 12);
      throw new Error(
        `Reader-visible wording diverges at word ${firstDifference}.\n` +
          `  approved: …${expected.slice(from, firstDifference + 12).join(' ')}…\n` +
          `  rendered: …${actual.slice(from, firstDifference + 12).join(' ')}…`
      );
    }

    expect(actual.length, 'word count differs from the approved source').toBe(expected.length);
  });

  it('preserves the approved heading sequence and teaching order', () => {
    const source = readFileSync(SOURCE, 'utf8');
    const sourceHeadings = source
      .split('\n')
      .filter((line) => /^###?\s/.test(line))
      .map((line) => normalizeTypography(line.replace(/^#+\s+/, '').trim()));

    expect(sourceHeadings.length).toBeGreaterThan(10);

    const rendered = normalizeTypography(renderedText(BUILT));
    let cursor = 0;
    for (const heading of sourceHeadings) {
      const index = rendered.indexOf(heading, cursor);
      expect(index, `heading "${heading}" missing or out of order`).toBeGreaterThan(-1);
      cursor = index;
    }
  });

  it('keeps every external source link from the approved page', () => {
    const source = readFileSync(SOURCE, 'utf8');
    const sourceLinks = [...source.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
    const built = readFileSync(BUILT, 'utf8');

    expect(sourceLinks.length).toBeGreaterThan(14);
    for (const link of new Set(sourceLinks)) {
      expect(built, `external source link dropped: ${link}`).toContain(link);
    }
  });

  it('renders the approved tables as tables, not as literal pipe text', () => {
    // Transport inserted a blank line between every table row, which stops Markdown from
    // parsing them at all. scripts/import-content.mjs repairs that; this proves the repair
    // holds and that no row was lost.
    const source = readFileSync(SOURCE, 'utf8');
    const sourceRows = source
      .split('\n')
      .filter((line) => /^\s*\|/.test(line) && !/^\s*\|[\s:\-|]+\|\s*$/.test(line));

    const built = readFileSync(BUILT, 'utf8');
    const renderedRows = (built.match(/<tr>/g) ?? []).length;

    expect(renderedRows, 'a table row was lost or failed to parse').toBe(sourceRows.length);
    expect(renderedText(BUILT), 'a table rendered as literal pipe text').not.toMatch(/\|\s*---/);
  });
});
