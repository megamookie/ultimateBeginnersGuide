#!/usr/bin/env node
/**
 * Promote approved content from content-source/ into the publication directory.
 *
 * Two phases, in this order and never the other way round:
 *
 *   1. TRANSPORT INTEGRITY. The received bytes are checked for encoding and Markdown
 *      corruption. Any integrity failure is a stop condition: the import aborts and the
 *      defect goes back to ChatGPT for a corrected artifact.
 *
 *   2. IMPLEMENTATION TRANSFORMATION (project-workflow.md v1.1 section 8). Only reached once
 *      integrity passes.
 *
 * This script does not repair approved content. Earlier versions silently fixed transport
 * damage — blank lines inside tables, emphasis markers displaced into a link target, blank
 * lines throughout the YAML. Workflow v1.1 makes that damage a reportable defect instead, so
 * those repairs have been removed and reimplemented as detectors in
 * src/lib/content/integrity.ts. Nothing in phase 2 alters prose, punctuation, or structure.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateReleaseFile, formatFailures } from '../src/lib/content/integrity.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(root, 'content-import.json');

/** The approved callout vocabulary, from page-template.md v1.4. Not extensible here. */
const APPROVED_CALLOUTS = new Map([
  ['Critical', 'critical'],
  ['Warning', 'warning'],
  ['Alpha note', 'alpha-note'],
  ['Cost note', 'cost-note'],
  ['Fleet note', 'fleet-note'],
  ['Multibox note', 'multibox-note'],
  ['Rules note', 'rules-note'],
  ['Patch-sensitive', 'patch-sensitive'],
]);

/** Split a file into its YAML frontmatter and Markdown body. */
export function splitFrontmatter(raw, source) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`${source}: no YAML frontmatter found. The approved release must carry it.`);
  }
  return { frontmatter: match[1], body: match[2] };
}

/**
 * Rename `slug` to `permanent_slug`.
 *
 * A schema-integration transformation permitted by workflow section 8.1, not a corruption
 * repair. `slug` is reserved by Astro's content layer: Starlight resolves a route by it, so
 * `slug: "/before-you-launch/"` hijacked routing and made both Section 0 and the glossary
 * render as the not-found page. page-template v1.4 mandates the field name `slug`, so the
 * approved source keeps it and only the publication copy is renamed. The value is preserved
 * character-for-character, and tests/content/metadata.test.ts asserts that the route it
 * declares is the route the page is published at.
 */
function renameReservedSlug(frontmatter, findings) {
  return frontmatter
    .split('\n')
    .map((line) => {
      const match = line.match(/^slug:(\s*.*)$/);
      if (!match) return line;
      findings.push(
        'Renamed frontmatter field `slug` to `permanent_slug` in the publication copy. ' +
          "`slug` is reserved by Astro's routing; the value is unchanged."
      );
      return `permanent_slug:${match[1]}`;
    })
    .join('\n');
}

/** Convert approved callout blockquotes; leave every other blockquote untouched. */
export function convertCallouts(body, findings) {
  const lines = body.split('\n');
  const output = [];
  let used = false;

  for (let i = 0; i < lines.length; i++) {
    const opener = lines[i].match(/^>\s+\*\*([^*]+):\*\*\s*(.*)$/);
    if (!opener) {
      output.push(lines[i]);
      continue;
    }

    const label = opener[1].trim();
    const type = APPROVED_CALLOUTS.get(label);

    const block = [opener[2]];
    let j = i + 1;
    while (j < lines.length && lines[j].startsWith('>')) {
      block.push(lines[j].replace(/^>\s?/, ''));
      j++;
    }

    if (!type) {
      findings.push(
        `Left blockquote "${label}" unconverted: not in the approved callout vocabulary ` +
          `(page-template.md v1.4). Reported as an editorial finding.`
      );
      output.push(...lines.slice(i, j));
      i = j - 1;
      continue;
    }

    findings.push(`Converted "${label}" blockquote to <Callout type="${type}">.`);
    used = true;
    output.push(
      `<Callout type="${type}">`,
      '',
      ...block.filter((line) => line.trim() !== ''),
      '',
      '</Callout>'
    );
    i = j - 1;
  }

  return { body: output.join('\n'), usedCallout: used };
}

/** Correct internal paths after a file move. Visible link text is never touched. */
export function rewriteLinks(body, rewrites, findings) {
  let output = body;
  // Longest first so a prefix rule cannot pre-empt a more specific one.
  for (const [from, to] of Object.entries(rewrites).sort((a, b) => b[0].length - a[0].length)) {
    const pattern = new RegExp(`\\]\\(${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    const count = (output.match(pattern) || []).length;
    if (count > 0) {
      output = output.replace(pattern, `](${to})`);
      findings.push(
        `Rewrote ${count} internal link target${count === 1 ? '' : 's'}: ${from} → ${to} (link text unchanged).`
      );
    }
  }
  return output;
}

export class TransportIntegrityError extends Error {
  constructor(source, result) {
    super(
      `${source}: transport integrity failed.\n` +
        formatFailures(source, result.failures) +
        '\n\nproject-workflow.md v1.1 makes this a stop condition. Request a corrected release ' +
        'artifact from ChatGPT; do not repair the approved source.'
    );
    this.name = 'TransportIntegrityError';
    this.result = result;
  }
}

export function importOne(entry, { root: rootDir = root } = {}) {
  const findings = [];
  const sourcePath = join(rootDir, entry.source);
  const bytes = readFileSync(sourcePath);

  // ---- Phase 1: transport integrity, before anything touches the content ----
  const integrity = validateReleaseFile(bytes);
  if (!integrity.ok) throw new TransportIntegrityError(entry.source, integrity);

  findings.push('Transport integrity verified: encoding and Markdown structure intact.');

  // ---- Phase 2: implementation transformations ----
  const raw = new TextDecoder('utf-8').decode(bytes);
  const { frontmatter, body: rawBody } = splitFrontmatter(raw, entry.source);

  // Confirm the release matches what was approved, against the source's own field names.
  for (const [field, expected] of Object.entries(entry.expect ?? {})) {
    const found = frontmatter.match(new RegExp(`^${field}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'));
    if (!found || found[1].trim() !== expected) {
      throw new Error(
        `${entry.source}: frontmatter ${field} is "${found?.[1] ?? '(absent)'}" but the release ` +
          `record specifies "${expected}". A mismatch is an editorial question, not an import detail.`
      );
    }
  }

  const publishedFrontmatter = renameReservedSlug(frontmatter, findings);

  let body = rewriteLinks(rawBody, entry.linkRewrites ?? {}, findings);
  const { body: withCallouts, usedCallout } = convertCallouts(body, findings);
  body = withCallouts.replace(/^\n+/, '').replace(/\n+$/, '\n');

  const imports = usedCallout ? `\nimport Callout from '@/components/callouts/Callout.astro';\n` : '';

  const banner =
    `{/* Publication copy. Source: ${entry.source} (${entry.sourceVersion}), state ${entry.state}.\n` +
    `    Generated by scripts/import-content.mjs — edit the approved source, not this file. */}\n`;

  const output = `---\n${publishedFrontmatter}\n---\n` + imports + '\n' + banner + '\n' + body;

  return { output, findings, targetPath: join(rootDir, entry.target) };
}

export function loadConfig(configPath = CONFIG) {
  return JSON.parse(readFileSync(configPath, 'utf8'));
}

/**
 * A held entry's publication copy is frozen: the source failed transport integrity, so it
 * cannot be regenerated, and workflow v1.1 forbids repairing it here. Instead the frozen
 * file is digested so a hand-edit is still caught.
 *
 * This digest is internal drift detection over a file this repository already owns, not a
 * release-record checksum — nothing here is compared against a value from ChatGPT, so the
 * August 22, 2026 removal of release checksums does not apply to it.
 */
function verifyHeldEntry(entry, check) {
  const targetPath = join(root, entry.target);
  if (!existsSync(targetPath)) {
    process.stderr.write(`FAIL ${entry.target} is held but missing from the repository.\n`);
    return false;
  }

  const digest = createHash('sha256').update(readFileSync(targetPath)).digest('hex');
  const expected = entry.publicationSha256;

  if (!expected) {
    process.stderr.write(
      `FAIL ${entry.target} is held but content-import.json records no publicationSha256.\n`
    );
    return false;
  }

  if (digest !== expected) {
    process.stderr.write(
      `FAIL ${entry.target} has been modified while held.\n` +
        `     expected ${expected}\n     received ${digest}\n`
    );
    return false;
  }

  process.stdout.write(
    `HELD ${entry.target} frozen and unmodified (sha256 ${digest})\n` +
      `     ${entry.awaitingCorrectedRelease}\n`
  );
  if (!check) {
    process.stdout.write(`     Not re-imported: awaiting a corrected release artifact.\n`);
  }
  return true;
}

function main() {
  const config = loadConfig();
  const check = process.argv.includes('--check');
  let failed = false;

  for (const entry of config.imports) {
    if (entry.awaitingCorrectedRelease) {
      if (!verifyHeldEntry(entry, check)) failed = true;
      continue;
    }

    let result;
    try {
      result = importOne(entry);
    } catch (error) {
      failed = true;
      process.stderr.write(`FAIL ${error.message}\n`);
      continue;
    }

    if (check) {
      const existing = existsSync(result.targetPath)
        ? readFileSync(result.targetPath, 'utf8')
        : null;
      if (existing !== result.output) {
        failed = true;
        process.stderr.write(
          `FAIL ${entry.target} has drifted from ${entry.source}.\n` +
            `     Run \`npm run import\` to regenerate it, or restore the approved source.\n`
        );
      } else {
        process.stdout.write(`OK   ${entry.target} matches ${entry.source}\n`);
      }
      continue;
    }

    mkdirSync(dirname(result.targetPath), { recursive: true });
    writeFileSync(result.targetPath, result.output);
    process.stdout.write(`Imported ${entry.source} → ${entry.target}\n`);
    for (const finding of result.findings) process.stdout.write(`  · ${finding}\n`);
  }

  if (failed) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
