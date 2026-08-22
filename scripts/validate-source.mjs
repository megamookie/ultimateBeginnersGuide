#!/usr/bin/env node
/**
 * Transport-integrity gate for approved content release files.
 *
 * Enforces `project-workflow.md` v1.1: every release file is verified against the SHA-256 in
 * its release record and checked for encoding and Markdown corruption *before* any
 * normalisation, transformation, or import runs.
 *
 * A missing checksum, a checksum mismatch, an encoding failure, or a Markdown-integrity
 * failure is a stop condition. This script never repairs anything — the defect goes back to
 * ChatGPT for a corrected release artifact.
 *
 * Usage:
 *   node scripts/validate-source.mjs            validate every entry in content-import.json
 *   node scripts/validate-source.mjs <file...>  validate specific files (checksum optional)
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { validateReleaseFile, formatFailures, sha256 } from '../src/lib/content/integrity.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = join(root, 'content-import.json');

const args = process.argv.slice(2);
let failed = false;
let verified = 0;
let held = 0;

function report(label, result, { quarantined = false, reason = '' } = {}) {
  if (result.ok) {
    verified++;
    process.stdout.write(`OK   ${label}\n     sha256 ${result.sha256}\n`);
    return;
  }

  if (quarantined) {
    held++;
    process.stdout.write(
      `HELD ${label} — awaiting a corrected release artifact\n` +
        `     ${reason}\n` +
        `     sha256 ${result.sha256}\n` +
        formatFailures(label, result.failures) +
        '\n'
    );
    return;
  }

  failed = true;
  process.stderr.write(
    `FAIL ${label}\n     sha256 ${result.sha256}\n` + formatFailures(label, result.failures) + '\n'
  );
}

if (args.length > 0) {
  // Ad-hoc mode: validate named files. Useful for checking a new artifact before it is
  // wired into content-import.json.
  for (const arg of args) {
    const path = join(root, arg);
    if (!existsSync(path)) {
      failed = true;
      process.stderr.write(`FAIL ${arg} does not exist\n`);
      continue;
    }
    const bytes = readFileSync(path);
    const result = validateReleaseFile(bytes, { expectedSha256: sha256(bytes) });
    report(arg, result);
  }
} else {
  const config = JSON.parse(readFileSync(CONFIG, 'utf8'));

  for (const entry of config.imports) {
    const path = join(root, entry.source);
    if (!existsSync(path)) {
      failed = true;
      process.stderr.write(`FAIL ${entry.source} does not exist\n`);
      continue;
    }

    const bytes = readFileSync(path);
    const result = validateReleaseFile(bytes, { expectedSha256: entry.sha256 ?? null });

    report(relative(root, path), result, {
      quarantined: Boolean(entry.awaitingCorrectedRelease),
      reason: entry.awaitingCorrectedRelease ?? '',
    });
  }
}

if (failed) {
  process.stderr.write(
    '\nFAIL transport integrity. Per project-workflow.md v1.1 this is a stop condition:\n' +
      '     return the defect to ChatGPT and request a corrected release artifact.\n' +
      '     Do not repair the approved source here.\n'
  );
  process.exit(1);
}

// A held release is a known, recorded defect awaiting a corrected artifact — not a pass.
// Saying "verified" here would misreport it (project-workflow.md v1.1 section 13: a failed
// or unavailable check must not be described as passed).
const summary = [
  verified > 0 ? `${verified} verified` : null,
  held > 0 ? `${held} held for a corrected release` : null,
].filter(Boolean);

process.stdout.write(
  `\n${held > 0 ? 'HELD' : 'OK  '} transport integrity: ${summary.join(', ') || 'nothing to check'}.\n`
);
