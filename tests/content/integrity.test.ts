import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  checkEncoding,
  checkMojibake,
  checkReplacementCharacter,
  checkMarkdownTables,
  checkMarkdownLinks,
  checkSystematicBlankLines,
  validateReleaseFile,
  type IntegrityCode,
} from '@/lib/content/integrity';

/**
 * Transport-integrity rules required by `project-workflow.md` v1.1.
 *
 * Each case below is a corruption class that actually reached this repository, or one the
 * workflow names explicitly. The fixtures are built inline so a test proves the *rule*
 * rather than the current state of any particular file.
 */

const root = join(import.meta.dirname, '../..');
const codes = (failures: { code: IntegrityCode }[]) => failures.map((f) => f.code);
const bytes = (text: string) => Buffer.from(text, 'utf8');

/** A minimal well-formed release file: frontmatter, prose, a table, and a link. */
const CLEAN = `---
page_id: "example"
title: "Example"
---

Some approved prose that a reader will see.

| Column | Meaning |
|---|---|
| One | First |
| Two | Second |

A [valid link](/somewhere/) and a list:

- first item
- second item
`;

describe('valid UTF-8 Markdown', () => {
  it('accepts a clean release file', () => {
    const result = validateReleaseFile(bytes(CLEAN));
    expect(result.failures).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('accepts the real approved glossary source', () => {
    const file = readFileSync(join(root, 'content-source/glossary.md'));
    const result = validateReleaseFile(file);
    expect(codes(result.failures)).toEqual([]);
  });

  it('rejects bytes that are not valid UTF-8', () => {
    // 0xC3 starts a two-byte sequence; 0x28 cannot continue it.
    const invalid = Buffer.from([0x68, 0x69, 0xc3, 0x28, 0x0a]);
    expect(codes(checkEncoding(invalid))).toContain('encoding-not-utf8');
  });
});

describe('mojibake detection', () => {
  it('detects a double-encoded em dash', () => {
    // The exact sequence found in four governance files: UTF-8 read as Windows-1252.
    const failures = checkMojibake('Ultimate Guide â€” Master Roadmap\n');
    expect(codes(failures)).toContain('mojibake');
    expect(failures[0].line).toBe(1);
  });

  it('detects a double-encoded arrow', () => {
    expect(codes(checkMojibake('Blueprint â†’ Research\n'))).toContain('mojibake');
  });

  it('does not flag correctly encoded punctuation', () => {
    expect(checkMojibake('An em dash — an arrow → a quote "like this"\n')).toEqual([]);
  });
});

describe('Unicode replacement characters', () => {
  it('detects U+FFFD', () => {
    // Written as an escape so the character survives any editor or transport.
    const failures = checkReplacementCharacter('Some text with a lost \uFFFD char\n');
    expect(codes(failures)).toContain('replacement-character');
  });

  it('does not flag clean text', () => {
    expect(checkReplacementCharacter(CLEAN)).toEqual([]);
  });
});

describe('CRLF and BOM rejection', () => {
  it('rejects a UTF-8 byte-order mark', () => {
    const withBom = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), bytes(CLEAN)]);
    expect(codes(checkEncoding(withBom))).toContain('encoding-bom');
  });

  it('rejects CRLF line endings', () => {
    expect(codes(checkEncoding(bytes(CLEAN.replace(/\n/g, '\r\n'))))).toContain('encoding-crlf');
  });

  it('rejects a file with no trailing newline', () => {
    expect(codes(checkEncoding(bytes('no newline at end')))).toContain('trailing-newline-missing');
  });

  it('accepts LF without a BOM', () => {
    expect(codes(checkEncoding(bytes(CLEAN)))).toEqual([]);
  });
});

describe('blank lines interrupting Markdown tables', () => {
  it('detects a blank line between table rows', () => {
    const broken = `| Column | Meaning |\n\n|---|---|\n\n| One | First |\n`;
    const failures = checkMarkdownTables(broken);
    expect(codes(failures)).toContain('markdown-table-interrupted');
    expect(failures.length).toBe(2);
  });

  it('accepts a contiguous table', () => {
    expect(checkMarkdownTables(CLEAN)).toEqual([]);
  });

  it('accepts a blank line that genuinely ends a table', () => {
    const fine = `| Column | Meaning |\n|---|---|\n| One | First |\n\nA following paragraph.\n`;
    expect(checkMarkdownTables(fine)).toEqual([]);
  });
});

describe('malformed Markdown links', () => {
  it('detects emphasis markers inside a link destination', () => {
    // The exact defect in Section 0 v1.5's closing line.
    const failures = checkMarkdownLinks(`See the [guide](*../index*).\n`);
    expect(codes(failures)).toContain('markdown-link-malformed');
    expect(failures[0].evidence).toContain('*../index*');
  });

  it('detects an empty link destination', () => {
    expect(codes(checkMarkdownLinks(`An [empty]() link.\n`))).toContain('markdown-link-malformed');
  });

  it('detects an unclosed link destination', () => {
    expect(codes(checkMarkdownLinks(`A [broken](/somewhere\n`))).toContain('markdown-link-malformed');
  });

  it('accepts valid links, including a quoted title', () => {
    expect(checkMarkdownLinks(`[a](/x/) and [b](https://example.com "Title")\n`)).toEqual([]);
  });
});

describe('systematic alternating blank-line insertion', () => {
  it('detects a blank line after every source line', () => {
    const lines = Array.from({ length: 40 }, (_, i) => `Line ${i} of approved prose.`);
    const doubled = lines.join('\n\n') + '\n';
    const failures = checkSystematicBlankLines(doubled);
    expect(codes(failures)).toContain('systematic-blank-lines');
  });

  it('does not flag ordinary Markdown spacing', () => {
    const file = readFileSync(join(root, 'content-source/glossary.md'), 'utf8');
    expect(checkSystematicBlankLines(file)).toEqual([]);
  });

  it('does not flag a short file by coincidence', () => {
    expect(checkSystematicBlankLines('One\n\nTwo\n\nThree\n')).toEqual([]);
  });
});

describe('reporting every defect at once', () => {
  it('collects all failures so one round-trip can fix them', () => {
    const nasty = `---\r\ntitle: "x"\r\n---\r\n\r\nAn em dash â€” here.\r\n\r\n| A | B |\r\n\r\n|---|---|\r\n\r\nA [link](*bad*).\r\n`;
    const result = validateReleaseFile(bytes(nasty));
    const found = new Set(codes(result.failures));

    expect(found.has('encoding-crlf')).toBe(true);
    expect(found.has('mojibake')).toBe(true);
    expect(found.has('markdown-table-interrupted')).toBe(true);
    expect(found.has('markdown-link-malformed')).toBe(true);
  });
});
