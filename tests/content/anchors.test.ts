import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseHTML } from 'linkedom';

/**
 * Heading anchors are permanent addresses. Search results, the On This Page list, the
 * homepage entry points, and the search vocabulary all deep-link to them, and CLAUDE.md
 * requires stable anchors to be preserved.
 *
 * The approved source shipped its own table of contents with explicit anchor targets. This
 * test asserts the site reproduces exactly those anchors, so every link the editorial team
 * already wrote continues to resolve.
 */

const root = join(import.meta.dirname, '../..');
const SOURCE = join(root, 'content-source/before-you-launch.md');
const BUILT = join(root, 'dist/foundation/before-you-launch/index.html');

describe('Section 0 heading anchors', () => {
  const source = readFileSync(SOURCE, 'utf8');
  const { document } = parseHTML(readFileSync(BUILT, 'utf8'));

  /** Anchors the approved source's own table of contents points at. */
  const declaredAnchors = [...source.matchAll(/\]\(#([a-z0-9-]+)\)/g)].map((match) => match[1]);

  const renderedIds = new Set(
    [...document.querySelectorAll('h2[id], h3[id], h4[id]')].map((heading) => heading.id)
  );

  it('reproduces every anchor the approved table of contents declared', () => {
    expect(declaredAnchors.length).toBeGreaterThan(15);
    for (const anchor of declaredAnchors) {
      expect(renderedIds.has(anchor), `approved anchor #${anchor} is no longer generated`).toBe(true);
    }
  });

  it('generates On This Page from major headings only', () => {
    // master roadmap v1.7 section 8: "generated from major headings only".
    const toc = document.querySelector('starlight-toc');
    expect(toc, 'On This Page navigation is missing').not.toBeNull();

    const linked = [...toc!.querySelectorAll('a')]
      .map((a) => a.getAttribute('href')?.replace('#', ''))
      .filter((id): id is string => Boolean(id) && id !== '_top');

    const h2Ids = new Set(
      [...document.querySelectorAll('h2[id]')].map((h) => h.id).filter((id) => id !== 'starlight__on-this-page')
    );
    const h3Ids = new Set([...document.querySelectorAll('h3[id]')].map((h) => h.id));

    expect(linked.length).toBeGreaterThan(10);
    for (const id of linked) {
      expect(h2Ids.has(id), `On This Page links #${id}, which is not a major heading`).toBe(true);
      expect(h3Ids.has(id)).toBe(false);
    }
  });
});

describe('glossary anchors', () => {
  it('gives every glossary term a linkable id on the published page', () => {
    const glossary = JSON.parse(readFileSync(join(root, 'src/data/glossary.generated.json'), 'utf8'));
    const { document } = parseHTML(
      readFileSync(join(root, 'dist/reference/glossary/index.html'), 'utf8')
    );

    for (const category of glossary.categories) {
      for (const entry of category.terms) {
        expect(
          document.getElementById(entry.anchor),
          `glossary anchor #${entry.anchor} is missing from the published page`
        ).not.toBeNull();
      }
    }
  });
});
