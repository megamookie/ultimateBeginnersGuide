#!/usr/bin/env node
/**
 * Derive structured glossary data from the approved canonical source.
 *
 * Canonical source: content-source/glossary.md (Glossary version 1.0)
 * Generated output: src/data/glossary.generated.json
 *
 * This exists so the glossary page and the hover/tap definition control render from one
 * source instead of a hand-maintained second copy (site-product-specification.md v1.0,
 * section 5, "Canonical structured information"; CLAUDE.md, "No Duplication").
 *
 * The transformation is mechanical and lossless: term strings and definition strings are
 * copied byte-for-byte out of the source tables. Nothing is reworded, reordered, added, or
 * omitted. `npm run check:generated` re-runs this and fails if the committed output has
 * drifted from the source.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = join(root, 'content-source/glossary.md');
const AUTOLINK = join(root, 'src/data/glossary-autolink.json');
const OUTPUT = join(root, 'src/data/glossary.generated.json');

/** Stable anchor id for a term. Must stay stable: these become permanent URL fragments. */
export function termAnchor(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Unescape the pipe escaping that Markdown tables require inside cells. */
function unescapeCell(cell) {
  return cell.replace(/\\\|/g, '|').trim();
}

export function parseGlossary(markdown) {
  const lines = markdown.split('\n');

  const versionMatch = markdown.match(/\*\*Glossary version:\*\*\s*([0-9.]+)/);
  if (!versionMatch) throw new Error('Glossary source is missing its version marker');

  const categories = [];
  let current = null;
  let inTable = false;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.*?)\s*$/);
    if (heading) {
      const label = heading[1];
      inTable = false;
      // "Usage Rules" is editorial guidance for authors, not a term category.
      current = label === 'Usage Rules' ? null : { label, anchor: termAnchor(label), terms: [] };
      if (current) categories.push(current);
      continue;
    }

    if (!current) continue;

    // Table header and separator rows.
    if (/^\|\s*Term\s*\|/.test(line)) {
      inTable = true;
      continue;
    }
    if (/^\|[\s:\-|]+\|$/.test(line)) continue;

    if (inTable && line.startsWith('|')) {
      const cells = line.slice(1, -1).split(/(?<!\\)\|/);
      if (cells.length < 2) continue;
      const term = unescapeCell(cells[0]);
      const definition = unescapeCell(cells[1]);
      if (!term || !definition) continue;
      current.terms.push({ term, definition, anchor: termAnchor(term) });
    } else if (inTable && line.trim() === '') {
      inTable = false;
    }
  }

  return { version: versionMatch[1], categories };
}

function main() {
  const markdown = readFileSync(SOURCE, 'utf8');
  const { version, categories } = parseGlossary(markdown);
  const { autoLink } = JSON.parse(readFileSync(AUTOLINK, 'utf8'));

  const allTerms = categories.flatMap((c) => c.terms);

  // Fail loudly rather than silently dropping a term that was renamed in the source.
  const known = new Set(allTerms.map((t) => t.term));
  const unknown = autoLink.filter((t) => !known.has(t));
  if (unknown.length > 0) {
    throw new Error(
      `glossary-autolink.json lists terms that no longer exist in the canonical glossary: ${unknown.join(', ')}`
    );
  }

  const anchors = new Set();
  for (const { anchor, term } of allTerms) {
    if (anchors.has(anchor)) throw new Error(`Duplicate glossary anchor "${anchor}" for term "${term}"`);
    anchors.add(anchor);
  }

  const autoLinkSet = new Set(autoLink);
  const output = {
    $comment:
      'GENERATED FILE — do not edit. Run `npm run generate` after content-source/glossary.md changes. Source of truth: content-source/glossary.md.',
    sourceFile: 'content-source/glossary.md',
    glossaryVersion: version,
    termCount: allTerms.length,
    categories: categories.map((category) => ({
      ...category,
      terms: category.terms.map((t) => ({ ...t, autoLink: autoLinkSet.has(t.term) })),
    })),
  };

  writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');
  process.stdout.write(
    `Generated ${OUTPUT.replace(root + '/', '')}: ${allTerms.length} terms in ${categories.length} categories (glossary v${version}).\n`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
