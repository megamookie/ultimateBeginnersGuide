#!/usr/bin/env node
/**
 * Validate every internal link and heading anchor in the built site.
 *
 * Required by site-product-specification.md v1.0 section 14 and project-workflow.md v1.0
 * section 13. External links are not fetched here — the roadmap puts those on a monthly
 * automated cadence rather than in the build.
 *
 * Deferred destinations are treated as a distinct outcome, not a pass and not a silent
 * failure. Approved Section 0 prose links forward to Section 1, whose content is not yet
 * approved. That link cannot resolve and must not be invented, so it is reported explicitly
 * and reconciled against the section registry: a broken link to a *registered, unpublished*
 * section is deferred; anything else is a defect.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { parseHTML } from 'linkedom';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');

if (!existsSync(DIST)) {
  process.stderr.write('dist/ not found. Run `npm run build` first.\n');
  process.exit(1);
}

const registry = JSON.parse(readFileSync(join(root, 'src/data/section-registry.json'), 'utf8'));

/** Canonical URLs of sections that exist in the roadmap but are not yet approved. */
const deferredUrls = new Set(
  registry.sections
    .filter((section) => !section.published)
    .map((section) => {
      const group = registry.groups.find((g) => g.id === section.group);
      return `/${group.urlSegment}/${section.slug}/`;
    })
);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(DIST).filter((file) => file.endsWith('.html'));

/** Map every routable URL to the set of element ids on that page. */
const idsByUrl = new Map();
for (const file of htmlFiles) {
  const rel = relative(DIST, file);
  const url = '/' + rel.replace(/index\.html$/, '').replace(/\\/g, '/');
  const { document } = parseHTML(readFileSync(file, 'utf8'));
  idsByUrl.set(url, new Set([...document.querySelectorAll('[id]')].map((node) => node.id)));
}

const broken = [];
const deferred = [];
let checked = 0;

for (const file of htmlFiles) {
  const rel = relative(DIST, file);
  const { document } = parseHTML(readFileSync(file, 'utf8'));

  for (const anchor of document.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href');
    if (!href) continue;
    if (/^(https?:|mailto:|tel:|#|javascript:)/.test(href)) {
      // Same-page anchors still need to resolve.
      if (href.startsWith('#') && href.length > 1) {
        checked++;
        const pageUrl = '/' + rel.replace(/index\.html$/, '');
        const ids = idsByUrl.get(pageUrl);
        if (ids && !ids.has(decodeURIComponent(href.slice(1)))) {
          broken.push(`${rel}: same-page anchor ${href} has no matching id`);
        }
      }
      continue;
    }
    if (!href.startsWith('/')) continue;

    checked++;
    const [path, fragment] = href.split('#');
    const normalized = path.endsWith('/') || path.includes('.') ? path : `${path}/`;

    if (!idsByUrl.has(normalized)) {
      // Asset paths resolve on disk rather than as routes.
      if (existsSync(join(DIST, normalized.replace(/^\//, '')))) continue;

      if (deferredUrls.has(normalized)) {
        deferred.push(`${rel}: ${href} → Section content not yet approved for publication`);
      } else {
        broken.push(`${rel}: ${href} does not resolve to a built page`);
      }
      continue;
    }

    if (fragment && !idsByUrl.get(normalized).has(decodeURIComponent(fragment))) {
      broken.push(`${rel}: ${href} — page exists but has no #${fragment}`);
    }
  }
}

process.stdout.write(`Checked ${checked} internal links and anchors across ${htmlFiles.length} pages.\n`);

if (deferred.length > 0) {
  process.stdout.write(`\nDeferred destinations (${deferred.length}) — expected, reported, not invented:\n`);
  for (const item of [...new Set(deferred)]) process.stdout.write(`  · ${item}\n`);
}

if (broken.length > 0) {
  process.stderr.write(`\nFAIL ${broken.length} broken internal link(s):\n`);
  for (const item of broken) process.stderr.write(`  ✗ ${item}\n`);
  process.exit(1);
}

process.stdout.write('\nOK   no broken internal links or anchors.\n');
