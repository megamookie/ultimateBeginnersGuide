#!/usr/bin/env node
/**
 * Prove that every generated artefact still matches its canonical source.
 *
 * Generated data is permitted only when it is "reproducibly derived from a canonical source
 * and is not manually maintained as a competing copy" (CLAUDE.md, "No Duplication"). This
 * check is what makes that claim verifiable: it regenerates the glossary data and the
 * publication copies and fails if the committed files differ, which is exactly what a
 * hand-edit would cause.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let failed = false;

function fail(message) {
  failed = true;
  process.stderr.write(`FAIL ${message}\n`);
}

function ok(message) {
  process.stdout.write(`OK   ${message}\n`);
}

// 1. Glossary data must match content-source/glossary.md.
{
  const output = join(root, 'src/data/glossary.generated.json');
  const before = existsSync(output) ? readFileSync(output, 'utf8') : null;
  execFileSync('node', [join(root, 'scripts/generate-glossary.mjs')], { cwd: root, stdio: 'pipe' });
  const after = readFileSync(output, 'utf8');

  if (before !== after) {
    fail('src/data/glossary.generated.json is out of date. Run `npm run generate`.');
  } else {
    ok('glossary.generated.json matches content-source/glossary.md');
  }
}

// 2. Publication copies must match their approved sources.
{
  const result = execFileSync('node', [join(root, 'scripts/import-content.mjs'), '--check'], {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
  });
  process.stdout.write(result);
}

// 3. Every approved source in content-source/ is either imported or deliberately excluded.
{
  const config = JSON.parse(readFileSync(join(root, 'content-import.json'), 'utf8'));
  const imported = new Set(config.imports.map((entry) => entry.source));

  // glossary.md is published through generated data rather than a direct import.
  const derivedInstead = new Set(['content-source/glossary.md']);

  const sources = execFileSync('ls', ['content-source'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .map((name) => `content-source/${name}`);

  for (const source of sources) {
    if (!imported.has(source) && !derivedInstead.has(source)) {
      fail(
        `${source} exists in content-source/ but is not listed in content-import.json. ` +
          `An unimported source is either an unapproved release or a missed import — do not ` +
          `infer approval from its presence.`
      );
    }
  }
  if (!failed) ok('every content-source file is accounted for');
}

process.exit(failed ? 1 : 0);
