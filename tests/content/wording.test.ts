import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { markdownToText, renderedText, words } from '../helpers/text';

/**
 * The guarantee this build rests on: the published Section 0 says exactly what the approved
 * source says.
 *
 * Claude may not reword, shorten, expand, or reorganise approved prose (CLAUDE.md,
 * "Editorial Source of Truth"; project-workflow.md v1.0, section 8.2). Comments in the
 * import script assert that; this test proves it, and will fail if any future change —
 * a rehype plugin, a component, a "small cleanup" — alters a single reader-visible word.
 */

const root = join(import.meta.dirname, '../..');
const SOURCE = join(root, 'content-source/before-you-launch.md');
const BUILT = join(root, 'dist/foundation/before-you-launch/index.html');

/**
 * The three removals the import performs, each explicitly permitted:
 *   - the H1, re-rendered from frontmatter
 *   - the orientation blockquote, regenerated from metadata
 *   - the hand-maintained table of contents, replaced by generated On This Page navigation
 */
function approvedBodyText(): string {
  const raw = readFileSync(SOURCE, 'utf8');
  const lines = raw.split('\n');

  const start = lines.findIndex((line) => /^#\s/.test(line));
  let cursor = start + 1;

  // Orientation blockquote.
  while (cursor < lines.length && lines[cursor].trim() === '') cursor++;
  while (cursor < lines.length && lines[cursor].startsWith('>')) cursor++;

  const body = lines.slice(cursor);

  const tocStart = body.findIndex((line) => /^##\s+Table of Contents\s*$/.test(line));
  if (tocStart === -1) throw new Error('Source no longer has a Table of Contents section');
  let tocEnd = tocStart + 1;
  while (tocEnd < body.length && body[tocEnd].trim() !== '---') tocEnd++;

  const withoutToc = [...body.slice(0, tocStart), ...body.slice(tocEnd + 1)];
  return markdownToText(withoutToc.join('\n'));
}

describe('Section 0 publication copy', () => {
  const expected = words(approvedBodyText());
  const actual = words(renderedText(BUILT));

  it('renders every approved word, in order, with nothing added or removed', () => {
    // Report the first divergence with context rather than dumping 4,000 words.
    const limit = Math.min(expected.length, actual.length);
    let firstDifference = -1;
    for (let i = 0; i < limit; i++) {
      if (expected[i] !== actual[i]) {
        firstDifference = i;
        break;
      }
    }

    if (firstDifference !== -1) {
      const from = Math.max(0, firstDifference - 12);
      throw new Error(
        `Reader-visible wording diverges at word ${firstDifference}.\n` +
          `  approved: …${expected.slice(from, firstDifference + 12).join(' ')}…\n` +
          `  rendered: …${actual.slice(from, firstDifference + 12).join(' ')}…`
      );
    }

    expect(actual.length).toBe(expected.length);
  });

  it('preserves the approved heading sequence and teaching order', () => {
    const source = readFileSync(SOURCE, 'utf8');
    const sourceHeadings = source
      .split('\n')
      .filter((line) => /^###?\s/.test(line))
      .map((line) => line.replace(/^#+\s+/, '').trim())
      .filter((heading) => heading !== 'Table of Contents');

    const rendered = renderedText(BUILT);
    // Every approved heading must still appear, and in the same relative order.
    let cursor = 0;
    for (const heading of sourceHeadings) {
      const index = rendered.indexOf(heading, cursor);
      expect(index, `heading "${heading}" missing or out of order`).toBeGreaterThan(-1);
      cursor = index;
    }
  });

  it('keeps every external source link from the approved page', () => {
    const source = readFileSync(SOURCE, 'utf8');
    const sourceLinks = [...source.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]);
    const built = readFileSync(BUILT, 'utf8');

    expect(sourceLinks.length).toBeGreaterThan(15);
    for (const link of new Set(sourceLinks)) {
      expect(built, `external source link dropped: ${link}`).toContain(link);
    }
  });
});
