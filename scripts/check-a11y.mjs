#!/usr/bin/env node
/**
 * Automated accessibility testing against the built site.
 *
 * site-product-specification.md v1.0 section 8 sets WCAG 2.2 Level AA as the target and is
 * explicit that "Automated accessibility testing is required but does not replace keyboard,
 * screen-reader, zoom, contrast, and responsive manual review". This script is the
 * automated half only; the manual review is reported separately.
 *
 * Beyond the axe rule set, it asserts the specific structural guarantees the specification
 * calls out by name: a skip link, a logical heading hierarchy, glossary definitions that do
 * not depend on hover, labelled controls, and alternative text on every image.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { parseHTML } from 'linkedom';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');

if (!existsSync(DIST)) {
  process.stderr.write('dist/ not found. Run `npm run build` first.\n');
  process.exit(1);
}

/** Representative pages: the homepage, a long instructional page, a reference page, search. */
const PAGES = [
  { url: '/', label: 'homepage' },
  { url: '/foundation/before-you-launch/', label: 'Section 0 (long instructional page)' },
  { url: '/reference/glossary/', label: 'glossary' },
  { url: '/table-of-contents/', label: 'table of contents' },
  { url: '/search/', label: 'search results' },
  { url: '/404.html', label: 'not found' },
];

/** Desktop-first, but tablet and phone must remain usable (spec section 8). */
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 834, height: 1112 },
  { name: 'phone', width: 390, height: 844 },
];

const failures = [];
const notes = [];

// ---------------------------------------------------------------------------
// Static structural checks. These run with no browser, so they always execute.
// ---------------------------------------------------------------------------

function staticChecks() {
  for (const page of PAGES) {
    const file = page.url.endsWith('.html')
      ? join(DIST, page.url.replace(/^\//, ''))
      : join(DIST, page.url.replace(/^\//, ''), 'index.html');

    if (!existsSync(file)) {
      failures.push(`${page.label}: ${page.url} was not built`);
      continue;
    }

    const { document } = parseHTML(readFileSync(file, 'utf8'));

    // Skip link (spec section 8: "A skip link must allow readers to bypass repeated navigation").
    const skip = document.querySelector('a[href="#_top"], a[href^="#"][class*="skip"], .skip-link');
    if (!skip) failures.push(`${page.label}: no skip link found`);

    // Document language (spec section 9: "Use the page language in the document markup").
    const lang = document.documentElement.getAttribute('lang');
    if (!lang) failures.push(`${page.label}: <html> has no lang attribute`);

    // Exactly one h1, and no skipped heading levels.
    const h1s = document.querySelectorAll('h1');
    if (h1s.length !== 1) failures.push(`${page.label}: expected exactly one <h1>, found ${h1s.length}`);

    const levels = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) =>
      Number(h.tagName[1])
    );
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        failures.push(
          `${page.label}: heading level jumps from h${levels[i - 1]} to h${levels[i]}`
        );
        break;
      }
    }

    // Every image needs alt text (spec section 8; roadmap "missing alternative text" check).
    for (const img of document.querySelectorAll('img')) {
      if (img.getAttribute('alt') === null) {
        failures.push(`${page.label}: <img src="${img.getAttribute('src')}"> has no alt attribute`);
      }
    }

    // Every form control needs a persistent label — whether by `for`, by ARIA, or by being
    // wrapped in a <label>, which is how Starlight labels its theme picker.
    for (const control of document.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
      if (control.closest('[aria-hidden="true"]')) continue;

      const id = control.getAttribute('id');
      const labelled =
        control.getAttribute('aria-label') ||
        control.getAttribute('aria-labelledby') ||
        control.closest('label') ||
        (id && document.querySelector(`label[for="${id}"]`));

      if (!labelled) {
        failures.push(
          `${page.label}: form control has no accessible label — ${control.outerHTML.slice(0, 120)}`
        );
      }
    }

    // Glossary definitions must not depend on hover alone.
    for (const control of document.querySelectorAll('.glossary-term__control')) {
      const href = control.getAttribute('href');
      if (!href || !href.startsWith('/reference/glossary/#')) {
        failures.push(`${page.label}: a glossary control is not keyboard-reachable as a link`);
        break;
      }
    }
  }

  // The hover-independence guarantee lives in CSS: :focus-within must reveal the panel.
  const cssFiles = (function walk(dir) {
    return readdirSync(dir).flatMap((name) => {
      const path = join(dir, name);
      return statSync(path).isDirectory() ? walk(path) : [path];
    });
  })(DIST).filter((file) => extname(file) === '.css');

  const allCss = cssFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
  if (!allCss.includes(':focus-within')) {
    failures.push('no :focus-within rule found — glossary definitions would depend on hover alone');
  } else {
    notes.push('glossary definitions reveal on focus as well as hover');
  }
  if (!allCss.includes('prefers-reduced-motion')) {
    failures.push('no prefers-reduced-motion rule found (spec section 8)');
  } else {
    notes.push('reduced-motion preference respected');
  }
}

// ---------------------------------------------------------------------------
// axe-core, run in a real browser over a local static server.
// ---------------------------------------------------------------------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.pf_fragment': 'application/octet-stream',
  '.pf_index': 'application/octet-stream',
  '.pf_meta': 'application/octet-stream',
  '.wasm': 'application/wasm',
};

function serveDist() {
  const server = createServer((req, res) => {
    const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
    let file = join(DIST, url.replace(/^\//, ''));
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(readFileSync(join(DIST, '404.html')));
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function axeChecks() {
  let chromium;
  let AxeBuilder;
  try {
    ({ chromium } = await import('@playwright/test'));
    ({ default: AxeBuilder } = await import('@axe-core/playwright'));
  } catch {
    notes.push('SKIPPED axe run: @playwright/test or @axe-core/playwright is not installed');
    return false;
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (error) {
    notes.push(
      `SKIPPED axe run: no browser binary available (${String(error).split('\n')[0]}). ` +
        `Install with \`npx playwright install chromium\`.`
    );
    return false;
  }

  const { server, port } = await serveDist();
  const base = `http://127.0.0.1:${port}`;
  let violationCount = 0;

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      for (const target of PAGES) {
        await page.goto(`${base}${target.url}`, { waitUntil: 'networkidle' });

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
          .analyze();

        for (const violation of results.violations) {
          violationCount++;
          failures.push(
            `${viewport.name} ${target.label}: [${violation.impact}] ${violation.id} — ` +
              `${violation.help} (${violation.nodes.length} node(s))`
          );
        }
      }

      await context.close();
      notes.push(`axe: ${viewport.name} (${viewport.width}×${viewport.height}) checked across ${PAGES.length} pages`);
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (violationCount === 0) notes.push('axe: no WCAG 2.2 AA violations across all viewports');
  return true;
}

staticChecks();
const axeRan = await axeChecks();

for (const note of notes) process.stdout.write(`     ${note}\n`);

if (failures.length > 0) {
  process.stderr.write(`\nFAIL ${failures.length} accessibility problem(s):\n`);
  for (const failure of failures) process.stderr.write(`  ✗ ${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  `\nOK   automated accessibility checks passed${axeRan ? '' : ' (structural only — axe did not run)'}.\n`
);
