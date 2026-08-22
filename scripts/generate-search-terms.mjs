#!/usr/bin/env node
/**
 * Derive search data from the approved `search_terms` on each published page.
 *
 * Approved pages carry their own `search_terms` (page-template.md v1.4). The site also keeps
 * one hand-maintained vocabulary for the things page metadata cannot express: common
 * misspellings, plain-language questions, and the specific *heading* a query should land on.
 *
 * site-product-specification.md v1.1 section 6 allows either home but forbids maintaining
 * the same alias in both. Generating the page-level half means an approved term is never
 * retyped into the vocabulary file, so it can never drift from the release that owns it.
 *
 * Output: src/data/page-search-terms.generated.json
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(root, 'src/content/docs');
const OUTPUT = join(root, 'src/data/page-search-terms.generated.json');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function main() {
  const pages = [];

  for (const file of walk(DOCS).filter((f) => /\.mdx?$/.test(f))) {
    const raw = readFileSync(file, 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) continue;

    const frontmatter = parseYaml(match[1]) ?? {};
    const terms = frontmatter.search_terms ?? [];

    // Only approved pages with a permanent route and at least one term contribute.
    if (frontmatter.status !== 'Approved' || !frontmatter.permanent_slug || terms.length === 0) {
      continue;
    }

    pages.push({
      page: frontmatter.title,
      url: frontmatter.permanent_slug,
      source: relative(root, file),
      terms,
    });
  }

  pages.sort((a, b) => a.url.localeCompare(b.url));

  const output = {
    $comment:
      'GENERATED FILE — do not edit. Run `npm run generate`. Derived from the approved ' +
      '`search_terms` in each published page\'s frontmatter. Hand-maintained aliases belong ' +
      'in src/data/search-vocabulary.json and must not repeat anything listed here.',
    pageCount: pages.length,
    termCount: pages.reduce((total, page) => total + page.terms.length, 0),
    pages,
  };

  writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');
  process.stdout.write(
    `Generated src/data/page-search-terms.generated.json: ${output.termCount} approved term(s) across ${pages.length} page(s).\n`
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
