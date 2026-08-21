#!/usr/bin/env node
/**
 * Promote approved content from content-source/ into the publication directory.
 *
 * Implements project-workflow.md v1.0 step 4 ("Promote the Release to the Repository") and
 * is limited to the mechanical transformations permitted by section 8.1:
 *
 *   1. Add approved machine-readable frontmatter.
 *   2. Remove the source H1 — the site renders the title from metadata (page-template.md v1.3).
 *   3. Remove the hand-maintained orientation blockquote — regenerated from metadata.
 *   4. Remove the hand-maintained body table of contents — replaced by generated
 *      "On This Page" navigation (CLAUDE.md, Permitted Content Transformations).
 *   5. Convert approved callout notation into the supported callout component.
 *   6. Correct internal paths, leaving visible link text untouched.
 *
 * What it deliberately cannot do: reword, shorten, expand, reorder, retitle, or delete
 * prose. Every prose line reaches the output byte-for-byte. A blockquote whose label is not
 * in the approved callout vocabulary is left exactly as written and reported, never coerced
 * into an approved type.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(root, 'content-import.json');

/** The approved callout vocabulary, from page-template.md v1.3. Not extensible here. */
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

/** Minimal YAML emitter. Enough for the page schema, and quotes anything ambiguous. */
function toYaml(value, indent = 0) {
  const pad = '  '.repeat(indent);

  if (value === null) return 'null';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  if (typeof value === 'string') {
    const needsQuotes = /^[\s>|&*!%@`{}[\]#,?:-]|[:#]\s|\s$|^$|^(true|false|null|~|\d)/i.test(value);
    return needsQuotes ? `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : value;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return '\n' + value.map((item) => `${pad}  - ${toYaml(item, indent + 1)}`).join('\n');
  }

  return (
    '\n' +
    Object.entries(value)
      .map(([key, item]) => {
        const rendered = toYaml(item, indent + 1);
        return `${pad}  ${key}:${rendered.startsWith('\n') ? '' : ' '}${rendered}`;
      })
      .join('\n')
  );
}

function buildFrontmatter(frontmatter) {
  const body = Object.entries(frontmatter)
    .map(([key, value]) => {
      const rendered = toYaml(value, 0);
      return `${key}:${rendered.startsWith('\n') ? '' : ' '}${rendered}`;
    })
    .join('\n');
  return `---\n${body}\n---\n`;
}

/** Remove the leading H1 and confirm it matches the frontmatter title. */
function stripHeading(lines, expected, findings, source) {
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;

  const match = lines[i]?.match(/^#\s+(.*)$/);
  if (!match) throw new Error(`${source}: expected a level-1 heading at the top of the file`);
  if (match[1].trim() !== expected) {
    throw new Error(
      `${source}: source H1 is "${match[1].trim()}" but content-import.json expects "${expected}". ` +
        `A changed title is an editorial change, not an import detail.`
    );
  }

  findings.push(`Removed source H1 "${match[1].trim()}" (rendered from frontmatter title).`);
  return lines.slice(i + 1);
}

/** Remove the hand-maintained orientation blockquote and the rule that follows it. */
function stripOrientation(lines, findings) {
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (!lines[i]?.startsWith('>')) return lines;

  const start = i;
  while (i < lines.length && (lines[i].startsWith('>') || lines[i].trim() === '')) {
    if (lines[i].trim() === '' && !lines[i + 1]?.startsWith('>')) break;
    i++;
  }

  const captured = lines.slice(start, i).join('\n');
  findings.push(
    `Removed the hand-maintained orientation blockquote (${captured.split('\n').filter(Boolean).length} lines); ` +
      `regenerated from metadata by Orientation.astro.`
  );

  let rest = lines.slice(i);
  let j = 0;
  while (j < rest.length && rest[j].trim() === '') j++;
  if (rest[j]?.trim() === '---') {
    findings.push('Removed the horizontal rule that separated the orientation block.');
    rest = rest.slice(j + 1);
  }

  return rest;
}

/** Remove the hand-maintained body table of contents, up to and including its trailing rule. */
function stripTableOfContents(lines, findings) {
  const start = lines.findIndex((line) => /^##\s+Table of Contents\s*$/.test(line));
  if (start === -1) return lines;

  let end = start + 1;
  while (end < lines.length && lines[end].trim() !== '---' && !/^##\s/.test(lines[end])) end++;

  const removed = end - start;
  if (lines[end]?.trim() === '---') end++;

  findings.push(
    `Removed the hand-maintained "Table of Contents" section (${removed} lines); replaced by the ` +
      `generated On This Page navigation.`
  );

  return [...lines.slice(0, start), ...lines.slice(end)];
}

/** Convert approved callout blockquotes; leave every other blockquote untouched. */
function convertCallouts(lines, findings) {
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

    // Gather the whole blockquote.
    const block = [opener[2]];
    let j = i + 1;
    while (j < lines.length && lines[j].startsWith('>')) {
      block.push(lines[j].replace(/^>\s?/, ''));
      j++;
    }

    if (!type) {
      findings.push(
        `Left blockquote "${label}" unconverted: not in the approved callout vocabulary ` +
          `(page-template.md v1.3). Reported as an editorial finding.`
      );
      output.push(...lines.slice(i, j));
      i = j - 1;
      continue;
    }

    findings.push(`Converted "${label}" blockquote to <Callout type="${type}">.`);
    used = true;
    output.push(`<Callout type="${type}">`, '', ...block, '', '</Callout>');
    i = j - 1;
  }

  return { lines: output, usedCallout: used };
}

function rewriteLinks(text, rewrites, findings) {
  let output = text;
  // Longest first so a prefix rule cannot pre-empt a more specific one.
  for (const [from, to] of Object.entries(rewrites).sort((a, b) => b[0].length - a[0].length)) {
    const pattern = new RegExp(`\\]\\(${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    const count = (output.match(pattern) || []).length;
    if (count > 0) {
      output = output.replace(pattern, `](${to})`);
      findings.push(`Rewrote ${count} internal link target${count === 1 ? '' : 's'}: ${from} → ${to} (link text unchanged).`);
    }
  }
  return output;
}

export function importOne(entry, { root: rootDir = root } = {}) {
  const findings = [];
  const sourcePath = join(rootDir, entry.source);
  const raw = readFileSync(sourcePath, 'utf8');

  let lines = raw.split('\n');
  lines = stripHeading(lines, entry.expectedHeading, findings, entry.source);
  lines = stripOrientation(lines, findings);
  lines = stripTableOfContents(lines, findings);

  const { lines: withCallouts, usedCallout } = convertCallouts(lines, findings);

  let body = withCallouts.join('\n');
  body = rewriteLinks(body, entry.linkRewrites ?? {}, findings);
  body = body.replace(/^\n+/, '').replace(/\n+$/, '\n');

  const imports = usedCallout ? `\nimport Callout from '@/components/callouts/Callout.astro';\n` : '';

  const banner =
    `{/* Publication copy. Source: ${entry.source} (${entry.sourceVersion}), state ${entry.state}.\n` +
    `    Generated by scripts/import-content.mjs — edit the approved source, not this file. */}\n`;

  const output = buildFrontmatter(entry.frontmatter) + imports + '\n' + banner + '\n' + body;

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
