#!/usr/bin/env node
/**
 * Prove that governance and unapproved material never reach the public site or the search
 * index.
 *
 * CLAUDE.md: "`governance/` contains instructions and must not be rendered, published or
 * indexed"; "`content-source/` contains approved inputs and must not be rendered, published
 * or indexed directly." project-workflow.md v1.0 section 10.4 repeats the requirement.
 *
 * Checking the built output rather than the config is the point: a future integration,
 * copy step, or misplaced import could publish these files without anyone changing a
 * setting, and only the artefact tells the truth.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist');

if (!existsSync(DIST)) {
  process.stderr.write('dist/ not found. Run `npm run build` first.\n');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const failures = [];

// 1. No governance or source file may exist as a route or asset in the output.
{
  const files = walk(DIST).map((file) => relative(DIST, file));
  const forbidden = files.filter((file) => /^(governance|content-source)\b/.test(file));
  for (const file of forbidden) failures.push(`dist/${file} publishes a non-public file`);
}

// 2. Distinctive governance phrases must not appear anywhere in the rendered HTML.
//    Each is verbatim from a governing file and appears in no approved reader content.
{
  const fingerprints = [
    'Governing project source',
    'Status: Governing project source',
    'Project Source Manifest',
    'Claude must not',
    'ChatGPT owns',
    'Technical Implementation Authority',
    'Do not attach yet',
    'Publication gate',
    'Blueprint / Working draft / Review candidate',
  ];

  for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    for (const phrase of fingerprints) {
      if (html.includes(phrase)) {
        failures.push(`dist/${relative(DIST, file)} contains governance text: "${phrase}"`);
      }
    }
  }
}

// 3. The Pagefind index must not contain governance text either. Pagefind stores content in
//    compressed fragments, so scan the whole index directory for the fingerprints as bytes.
{
  const pagefindDir = join(DIST, 'pagefind');
  if (!existsSync(pagefindDir)) {
    failures.push('dist/pagefind/ is missing — the search index was not generated.');
  } else {
    const indexed = walk(pagefindDir)
      .map((file) => relative(pagefindDir, file))
      .filter((file) => /^(governance|content-source)/.test(file));
    for (const file of indexed) failures.push(`search index contains ${file}`);
  }
}

// 4. No unapproved section may have been published.
{
  const registry = JSON.parse(readFileSync(join(root, 'src/data/section-registry.json'), 'utf8'));
  for (const section of registry.sections) {
    if (section.published) continue;
    const group = registry.groups.find((g) => g.id === section.group);
    const route = join(DIST, group.urlSegment, section.slug, 'index.html');
    if (existsSync(route)) {
      failures.push(
        `Section ${section.number} (${section.title}) is published but is not approved. ` +
          `Approval comes from the editorial workflow, not from a file existing.`
      );
    }
  }
}

// 5. No secrets or local environment files.
{
  const risky = walk(DIST)
    .map((file) => relative(DIST, file))
    .filter((file) => /(^|\/)\.env|\.pem$|id_rsa|credentials/.test(file));
  for (const file of risky) failures.push(`dist/${file} looks like a secret or credential file`);
}

// 6. The dev server must not serve them either.
//
//    Vite serves arbitrary project-root files in development, so these paths were reachable
//    at localhost:4321 until `vite.server.fs.deny` was configured. Probing the running
//    server is the only way to know the rule still holds — reading the config would only
//    prove the setting exists, not that it works.
{
  const { execFileSync, spawn } = await import('node:child_process');

  const PORT = 4399;
  // The dev daemon binds `localhost`, which resolves to ::1 — 127.0.0.1 gets no answer.
  const base = `http://localhost:${PORT}`;

  /**
   * Astro 7 runs the dev server as a daemon: `astro dev` returns immediately and no-ops if
   * one is already running, and killing the spawned process does not stop it. Stop any
   * existing daemon first, and stop ours afterwards, or this probe silently tests nothing.
   */
  const stopDaemon = () => {
    try {
      execFileSync('npx', ['astro', 'dev', 'stop'], { cwd: root, stdio: 'ignore' });
    } catch {
      /* none running */
    }
  };

  stopDaemon();

  // Invoke Astro directly: `npm run dev` chains the generate step and swallows the port flag.
  const dev = spawn('npx', ['astro', 'dev', '--port', String(PORT)], {
    cwd: root,
    stdio: 'ignore',
    detached: false,
  });
  const deadline = Date.now() + 60_000;
  let ready = false;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${base}/`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* not up yet */
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (!ready) {
    // A check that could not run is not a check that passed
    // (project-workflow.md v1.0, section 13).
    failures.push(
      'the dev-server probe could not run: the dev server did not start on port 4399. ' +
        'The governance boundary in development is therefore unverified.'
    );
  } else {
    let served = 0;
    for (const path of [
      '/governance/project-workflow.md',
      '/governance/site-product-specification.md',
      '/content-source/before-you-launch.md',
      '/content-source/glossary.md',
    ]) {
      const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(5000) });
      if (response.ok) {
        served++;
        failures.push(`the dev server serves ${path} (HTTP ${response.status})`);
      }
    }
    if (served === 0) {
      process.stdout.write('     dev server does not serve governance or content-source files\n');
    }
  }

  dev.kill('SIGTERM');
  stopDaemon();
}

if (failures.length > 0) {
  process.stderr.write(`FAIL ${failures.length} publication-boundary violation(s):\n`);
  for (const failure of failures) process.stderr.write(`  ✗ ${failure}\n`);
  process.exit(1);
}

process.stdout.write(
  'OK   no governance, unapproved content, or secrets in the published output, search index, or dev server.\n'
);
