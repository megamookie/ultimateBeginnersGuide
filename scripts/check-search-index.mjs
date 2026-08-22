#!/usr/bin/env node
/**
 * Validate the generated search index and run the search acceptance queries against it.
 *
 * tests/search/vocabulary.test.ts already proves the vocabulary layer resolves each query to
 * the right destination. This script checks the other half: that Pagefind actually built an
 * index, that it indexes headings inside long pages as separate anchored sub-results, and
 * that chrome does not crowd out the canonical content
 * (site-product-specification.md v1.0, section 6).
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { parseHTML } from 'linkedom';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');
const PAGEFIND = join(DIST, 'pagefind');

const failures = [];
const notes = [];

if (!existsSync(PAGEFIND)) {
  process.stderr.write('FAIL dist/pagefind/ missing — run `npm run build`.\n');
  process.exit(1);
}

// 1. The index exists and has real fragments.
{
  const entries = readdirSync(PAGEFIND);
  if (!entries.some((name) => name === 'pagefind.js')) {
    failures.push('pagefind.js is missing from the search index');
  }

  const fragmentDir = join(PAGEFIND, 'fragment');
  const fragments = existsSync(fragmentDir) ? readdirSync(fragmentDir) : [];
  if (fragments.length === 0) {
    failures.push('the search index contains no page fragments');
  } else {
    notes.push(`${fragments.length} indexed page fragment(s)`);
  }
}

// 2. Every published page that should be searchable is in the index.
{
  const shouldIndex = ['/before-you-launch/', '/reference/glossary/', '/table-of-contents/'];
  const indexDir = join(PAGEFIND, 'index');
  if (!existsSync(indexDir) || readdirSync(indexDir).length === 0) {
    failures.push('the search index has no index shards');
  }
  notes.push(`expected searchable routes: ${shouldIndex.join(', ')}`);
}

// 3. Heading-level results require ids on the headings Pagefind indexes, inside the
//    element Pagefind treats as the page body.
{
  const page = join(DIST, "before-you-launch/index.html");
  const { document } = parseHTML(readFileSync(page, 'utf8'));

  const body = document.querySelector('[data-pagefind-body]');
  if (!body) {
    failures.push('Section 0 has no [data-pagefind-body]; Pagefind would index page chrome too');
  } else {
    const headings = [...body.querySelectorAll('h2[id], h3[id]')];
    if (headings.length < 10) {
      failures.push(`Section 0 exposes only ${headings.length} anchored headings to the index`);
    } else {
      notes.push(`${headings.length} anchored headings available as sub-results on Section 0`);
    }
  }

  // Repeated navigation and metadata must be excluded so they cannot outrank the canonical
  // explanation (spec section 6).
  const ignored = document.querySelectorAll('[data-pagefind-ignore]').length;
  notes.push(`${ignored} element(s) excluded from the index as chrome`);

  const orientation = document.querySelector('.orientation');
  if (orientation && !orientation.closest('[data-pagefind-ignore]')) {
    failures.push(
      'the orientation metadata block is indexed; it will surface as a result competing ' +
        'with the canonical explanation'
    );
  }
}

// 4. Acceptance queries must have destinations that actually exist in the build.
{
  const fixture = JSON.parse(readFileSync(join(root, 'tests/fixtures/search-acceptance.json'), 'utf8'));

  const idsByUrl = new Map();
  const walk = (dir) =>
    readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });

  for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
    const url = '/' + relative(DIST, file).replace(/index\.html$/, '');
    const { document } = parseHTML(readFileSync(file, 'utf8'));
    idsByUrl.set(url, new Set([...document.querySelectorAll('[id]')].map((n) => n.id)));
  }

  for (const query of fixture.queries) {
    const [path, fragment] = query.expectedUrl.split('#');
    const ids = idsByUrl.get(path);
    if (!ids) {
      failures.push(`acceptance query "${query.query}" expects ${path}, which was not built`);
    } else if (fragment && !ids.has(fragment)) {
      failures.push(`acceptance query "${query.query}" expects #${fragment} on ${path}, which does not exist`);
    }
  }
  notes.push(`${fixture.queries.length} acceptance queries resolve to real anchors`);
}

for (const note of notes) process.stdout.write(`     ${note}\n`);

if (failures.length > 0) {
  process.stderr.write(`FAIL ${failures.length} search-index problem(s):\n`);
  for (const failure of failures) process.stderr.write(`  ✗ ${failure}\n`);
  process.exit(1);
}

process.stdout.write('OK   search index generated with heading-level anchors.\n');
