#!/usr/bin/env node
/**
 * Promote approved content from content-source/ into the publication directory.
 *
 * Implements project-workflow.md v1.0 step 4 ("Promote the Release to the Repository") and
 * is limited to the mechanical transformations permitted by section 8.1 and by the release
 * record:
 *
 *   1. Pass the approved frontmatter through unchanged (the source now carries complete
 *      metadata matching page-template.md v1.4).
 *   2. Restore block contiguity destroyed in transport — see `restoreBlockContiguity`.
 *   3. Repair broken Markdown link syntax, without changing link text.
 *   4. Correct internal paths to the repository's routes.
 *   5. Convert approved callout notation into the supported callout component.
 *
 * What it deliberately cannot do: reword, shorten, expand, reorder, retitle, or delete
 * prose. Every prose word reaches the output unchanged, which
 * tests/content/wording.test.ts proves against the approved source.
 *
 * A blockquote whose label is not in the approved callout vocabulary is left exactly as
 * written and reported, never coerced into an approved type.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`${source}: no YAML frontmatter found. The approved release must carry it.`);
  }
  return { frontmatter: match[1], body: match[2] };
}

const isTableRow = (line) => /^\s*\|/.test(line);
const isListItem = (line) => /^\s*(?:[-*+]|\d+\.)\s/.test(line);

/**
 * Remove blank lines that transport inserted *inside* a block construct.
 *
 * The approved file arrived with a blank line after every single line — 184 content lines
 * and 183 blank lines, never two in a row. Between paragraphs that is correct Markdown and
 * is left alone. Inside a table it is fatal: a table whose rows are separated by blank lines
 * does not parse at all, and all three tables in Section 0 would render as literal rows of
 * pipe characters. Inside a list it silently turns a tight list into a loose one, changing
 * the spacing the author intended.
 *
 * So a blank line is removed only when the non-blank lines on both sides belong to the same
 * construct. Paragraph separation is never touched, and no word is altered.
 */
export function restoreBlockContiguity(body, findings) {
  const lines = body.split('\n');
  const output = [];
  let tablesRepaired = 0;
  let listsRepaired = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === '') {
      // Look back to the last emitted non-blank line and forward to the next one.
      let previous = null;
      for (let j = output.length - 1; j >= 0; j--) {
        if (output[j].trim() !== '') {
          previous = output[j];
          break;
        }
      }
      let next = null;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() !== '') {
          next = lines[j];
          break;
        }
        // Two blank lines in a row means a genuine block break; stop looking.
        if (j > i + 1) break;
      }

      if (previous && next) {
        if (isTableRow(previous) && isTableRow(next)) {
          tablesRepaired++;
          continue; // drop the blank line
        }
        if (isListItem(previous) && isListItem(next)) {
          listsRepaired++;
          continue;
        }
      }
    }

    output.push(line);
  }

  if (tablesRepaired > 0) {
    findings.push(
      `Removed ${tablesRepaired} blank line(s) separating table rows. Without this the ` +
        `tables do not parse as tables and render as literal pipe-delimited text.`
    );
  }
  if (listsRepaired > 0) {
    findings.push(
      `Removed ${listsRepaired} blank line(s) separating list items, restoring the intended ` +
        `tight-list rendering.`
    );
  }

  return output.join('\n');
}

/**
 * Repair emphasis markers that leaked into a link destination.
 *
 * The approved file's closing line arrived as `[…](*../index*)`. Asterisks are not valid in
 * a link target; Markdown renders the destination literally and the link breaks. Stripping
 * them restores the author's target and leaves the visible link text untouched.
 */
export function repairLinkTargets(body, findings) {
  let repaired = 0;
  const output = body.replace(/\]\(\s*\*+([^)*]+)\*+\s*\)/g, (_match, target) => {
    repaired++;
    return `](${target})`;
  });

  if (repaired > 0) {
    findings.push(
      `Repaired ${repaired} link target(s) with emphasis markers inside the destination ` +
        `(for example \`](*../index*)\` → \`](../index)\`). Link text unchanged.`
    );
  }
  return output;
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
    output.push(`<Callout type="${type}">`, '', ...block.filter((l) => l.trim() !== ''), '', '</Callout>');
    i = j - 1;
  }

  return { body: output.join('\n'), usedCallout: used };
}

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

/**
 * Prepare the approved frontmatter for the publication copy.
 *
 * Two mechanical changes, both required for the file to load at all:
 *
 *  1. Collapse the blank lines transport inserted between YAML entries. YAML never needs
 *     them and no field name or value is touched.
 *
 *  2. Rename `slug` to `permanent_slug`. `slug` is reserved by Astro's content layer:
 *     Starlight resolves a route by it, so `slug: "/before-you-launch/"` hijacked routing
 *     and made both Section 0 and the glossary render as the not-found page. page-template
 *     v1.4 mandates the field name `slug`, so the approved source keeps it and only the
 *     publication copy is renamed. The value is preserved character-for-character, and the
 *     route it declares is the route the page is actually published at — asserted by
 *     tests/content/metadata.test.ts.
 */
function normalizeFrontmatter(frontmatter, findings) {
  const lines = frontmatter.split('\n');
  const kept = lines.filter((line) => line.trim() !== '');
  if (kept.length !== lines.length) {
    findings.push(
      `Removed ${lines.length - kept.length} blank line(s) from the YAML frontmatter. ` +
        `Field names and values are unchanged.`
    );
  }

  const renamed = kept.map((line) => {
    const match = line.match(/^slug:(\s*.*)$/);
    if (!match) return line;
    findings.push(
      `Renamed frontmatter field \`slug\` to \`permanent_slug\` in the publication copy. ` +
        `\`slug\` is reserved by Astro's routing; the value is unchanged.`
    );
    return `permanent_slug:${match[1]}`;
  });

  return renamed.join('\n');
}

export function importOne(entry, { root: rootDir = root } = {}) {
  const findings = [];
  const sourcePath = join(rootDir, entry.source);
  const raw = readFileSync(sourcePath, 'utf8');

  const { frontmatter, body: rawBody } = splitFrontmatter(raw, entry.source);

  // Confirm the release matches what was approved, against the source's own field names,
  // before any normalisation renames them.
  for (const [field, expected] of Object.entries(entry.expect ?? {})) {
    const found = frontmatter.match(new RegExp(`^${field}:\\s*"?([^"\\n]*)"?\\s*$`, 'm'));
    if (!found || found[1].trim() !== expected) {
      throw new Error(
        `${entry.source}: frontmatter ${field} is "${found?.[1] ?? '(absent)'}" but the release ` +
          `record specifies "${expected}". A mismatch is an editorial question, not an import detail.`
      );
    }
  }

  const normalizedFrontmatter = normalizeFrontmatter(frontmatter, findings);

  let body = rawBody;
  body = restoreBlockContiguity(body, findings);
  body = repairLinkTargets(body, findings);
  body = rewriteLinks(body, entry.linkRewrites ?? {}, findings);

  const { body: withCallouts, usedCallout } = convertCallouts(body, findings);
  body = withCallouts.replace(/^\n+/, '').replace(/\n+$/, '\n');

  const imports = usedCallout ? `\nimport Callout from '@/components/callouts/Callout.astro';\n` : '';

  const banner =
    `{/* Publication copy. Source: ${entry.source} (${entry.sourceVersion}), state ${entry.state}.\n` +
    `    Generated by scripts/import-content.mjs — edit the approved source, not this file. */}\n`;

  const output = `---\n${normalizedFrontmatter}\n---\n` + imports + '\n' + banner + '\n' + body;

  return { output, findings, targetPath: join(rootDir, entry.target) };
}

export function loadConfig(configPath = CONFIG) {
  return JSON.parse(readFileSync(configPath, 'utf8'));
}

function main() {
  const config = loadConfig();
  const check = process.argv.includes('--check');
  let failed = false;

  for (const entry of config.imports) {
    const { output, findings, targetPath } = importOne(entry);

    if (check) {
      const existing = existsSync(targetPath) ? readFileSync(targetPath, 'utf8') : null;
      if (existing !== output) {
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

    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, output);
    process.stdout.write(`Imported ${entry.source} → ${entry.target}\n`);
    for (const finding of findings) process.stdout.write(`  · ${finding}\n`);
  }

  if (failed) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
