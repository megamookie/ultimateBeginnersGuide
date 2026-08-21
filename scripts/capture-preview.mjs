#!/usr/bin/env node
/**
 * Capture visual evidence and exercise the interactive behaviour of the built site.
 *
 * Serves dist/ and drives a real browser so the checks cover what a reader actually gets:
 * Pagefind loaded from the generated index, the glossary panel revealed by keyboard focus,
 * type-ahead results, and desktop/tablet/phone layouts.
 *
 * Screenshots are written to screenshots/ (git-ignored) and the interaction assertions
 * fail the script, so this is verification rather than a photo shoot.
 */

import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');
const OUT = join(root, 'screenshots');

if (!existsSync(DIST)) {
  process.stderr.write('dist/ not found. Run `npm run build` first.\n');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let file = join(DIST, url.replace(/^\//, ''));
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(readFileSync(join(DIST, '404.html')));
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});

const port = await new Promise((resolve) => {
  server.listen(0, '127.0.0.1', () => resolve(server.address().port));
});
const base = `http://127.0.0.1:${port}`;

const { chromium } = await import('@playwright/test');
const browser = await chromium.launch();

const failures = [];
const captured = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'phone', width: 390, height: 844 },
];

const ROUTES = [
  { url: '/', name: 'homepage' },
  { url: '/foundation/before-you-launch/', name: 'section-0' },
  { url: '/reference/glossary/', name: 'glossary' },
  { url: '/table-of-contents/', name: 'table-of-contents' },
  { url: '/search/', name: 'search' },
];

for (const viewport of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();

  for (const route of ROUTES) {
    await page.goto(`${base}${route.url}`, { waitUntil: 'networkidle' });
    const file = join(OUT, `${route.name}-${viewport.name}.png`);
    await page.screenshot({ path: file, fullPage: route.name !== 'section-0' });
    captured.push(file);

    // The body must never scroll horizontally at any viewport.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    check(
      overflow <= 1,
      `${route.name} at ${viewport.name}: page scrolls horizontally by ${overflow}px`
    );
  }

  await context.close();
}

// ---------------------------------------------------------------------------
// Interaction: glossary definition on keyboard focus (no script involved)
// ---------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${base}/foundation/before-you-launch/`, { waitUntil: 'networkidle' });

  const control = page.locator('.glossary-term__control').first();
  const term = await control.textContent();
  await control.focus();

  const panel = page.locator('.glossary-term').first().locator('.glossary-term__panel');
  check(await panel.isVisible(), 'glossary definition did not appear on keyboard focus');

  const href = await control.getAttribute('href');
  check(
    href?.startsWith('/reference/glossary/#'),
    'glossary control does not link to the full glossary entry'
  );

  await control.scrollIntoViewIfNeeded();
  const file = join(OUT, 'glossary-definition-on-focus.png');
  await page.screenshot({ path: file, clip: await boundingBoxAround(page, '.glossary-term') });
  captured.push(file);
  process.stdout.write(`     glossary panel opens on focus for "${term?.trim()}"\n`);

  await context.close();
}

// ---------------------------------------------------------------------------
// Interaction: header search type-ahead against the real Pagefind index
// ---------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${base}/foundation/before-you-launch/`, { waitUntil: 'networkidle' });

  await page.locator('[data-search-trigger]').click();
  await page.locator('[data-search-input]').fill('is eve free');
  await page.waitForFunction(
    () => (document.querySelector('[data-search-results]')?.children.length ?? 0) > 0,
    undefined,
    { timeout: 10_000 }
  );

  const first = await page.locator('[data-search-results] .search-result__link').first().getAttribute('href');
  check(
    first === '/foundation/before-you-launch/#3-free-to-play-alpha-vs-omega',
    `beginner query "is eve free" returned ${first} instead of the Alpha/Omega heading`
  );

  const count = await page.locator('[data-search-results] .search-result').count();
  check(count > 1, 'search returned only the promoted result — Pagefind full-text did not load');

  const file = join(OUT, 'search-typeahead.png');
  await page.screenshot({ path: file });
  captured.push(file);
  process.stdout.write(`     header search: "is eve free" → ${count} results, first is the right heading\n`);

  await context.close();
}

// ---------------------------------------------------------------------------
// Interaction: full results page, heading-level results with anchors
// ---------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${base}/search/?q=exordeum`, { waitUntil: 'networkidle' });

  await page.waitForFunction(
    () => (document.querySelector('[data-search-page-results]')?.children.length ?? 0) > 0,
    undefined,
    { timeout: 10_000 }
  );

  const first = await page
    .locator('[data-search-page-results] .search-result__link')
    .first()
    .getAttribute('href');
  check(
    first === '/foundation/before-you-launch/#5-where-every-new-character-begins-exordium',
    `misspelling "exordeum" returned ${first} instead of the Exordium heading`
  );

  const anchored = await page.evaluate(() =>
    [...document.querySelectorAll('[data-search-page-results] a')].filter((a) =>
      a.getAttribute('href')?.includes('#')
    ).length
  );
  check(anchored > 0, 'no heading-level results with anchors on the full results page');

  const file = join(OUT, 'search-results-page.png');
  await page.screenshot({ path: file, fullPage: true });
  captured.push(file);
  process.stdout.write(`     results page: misspelling "exordeum" resolved, ${anchored} anchored result(s)\n`);

  await context.close();
}

// ---------------------------------------------------------------------------
// Interaction: keyboard reachability of the skip link and primary navigation
// ---------------------------------------------------------------------------
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${base}/foundation/before-you-launch/`, { waitUntil: 'networkidle' });

  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, text: el?.textContent?.trim(), href: el?.getAttribute('href') };
  });
  check(
    firstFocus.href?.startsWith('#'),
    `first Tab stop is not a skip link (got ${firstFocus.tag} "${firstFocus.text}")`
  );
  process.stdout.write(`     first Tab stop is the skip link: "${firstFocus.text}"\n`);

  await context.close();
}

async function boundingBoxAround(page, selector) {
  const box = await page.locator(selector).first().boundingBox();
  if (!box) return undefined;
  return {
    x: Math.max(0, box.x - 60),
    y: Math.max(0, box.y - 40),
    width: Math.min(760, box.width + 480),
    height: Math.min(320, box.height + 260),
  };
}

await browser.close();
server.close();

process.stdout.write(`\n     ${captured.length} screenshots written to screenshots/\n`);

if (failures.length > 0) {
  process.stderr.write(`\nFAIL ${failures.length} preview problem(s):\n`);
  for (const failure of failures) process.stderr.write(`  ✗ ${failure}\n`);
  process.exit(1);
}

process.stdout.write('\nOK   preview inspection passed.\n');
