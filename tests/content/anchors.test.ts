import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseHTML } from 'linkedom';
import GithubSlugger from 'github-slugger';

/**
 * Heading anchors are permanent addresses. Search results, the On This Page list, the
 * homepage entry points, and the search vocabulary all deep-link to them, and CLAUDE.md
 * requires stable anchors to be preserved.
 *
 * Guide version 1.5 removed the source's hand-maintained table of contents, so there is no
 * longer a list of declared anchors to compare against. Instead the test derives the anchor
 * every approved heading should produce and asserts the build produces exactly that — which
 * also catches a heading whose anchor silently changes.
 */

const root = join(import.meta.dirname, '../..');
const SOURCE = join(root, 'content-source/before-you-launch.md');
const BUILT = join(root, 'dist/before-you-launch/index.html');

describe('Section 0 heading anchors', () => {
  const source = readFileSync(SOURCE, 'utf8');
  const { document } = parseHTML(readFileSync(BUILT, 'utf8'));

  const slugger = new GithubSlugger();
  const expectedAnchors = source
    .split('\n')
    .filter((line) => /^###?\s/.test(line))
    .map((line) => slugger.slug(line.replace(/^#+\s+/, '').trim()));

  const renderedIds = new Set(
    [...document.querySelectorAll('h2[id], h3[id], h4[id]')].map((heading) => heading.id)
  );

  it('gives every approved heading a stable anchor', () => {
    expect(expectedAnchors.length).toBeGreaterThan(10);
    for (const anchor of expectedAnchors) {
      expect(renderedIds.has(anchor), `heading anchor #${anchor} is not generated`).toBe(true);
    }
  });

  it('exposes every anchor the search vocabulary points at', () => {
    const vocabulary = JSON.parse(
      readFileSync(join(root, 'src/data/search-vocabulary.json'), 'utf8')
    );

    for (const entry of vocabulary.entries) {
      const [path, fragment] = entry.destination.url.split('#');
      if (path !== '/before-you-launch/' || !fragment) continue;
      expect(
        renderedIds.has(fragment),
        `search vocabulary "${entry.canonical}" points at #${fragment}, which does not exist`
      ).toBe(true);
    }
  });

  it('exposes every anchor the homepage entry points link to', () => {
    const entryPoints = JSON.parse(readFileSync(join(root, 'src/data/entry-points.json'), 'utf8'));

    for (const entry of entryPoints.secondary) {
      if (!entry.href) continue;
      const [path, fragment] = entry.href.split('#');
      if (path !== '/before-you-launch/' || !fragment) continue;
      expect(
        renderedIds.has(fragment),
        `entry point "${entry.label}" points at #${fragment}, which does not exist`
      ).toBe(true);
    }
  });

  it('generates On This Page from major headings only', () => {
    // master roadmap v1.8 section 8: "generated from major headings only".
    const toc = document.querySelector('starlight-toc');
    expect(toc, 'On This Page navigation is missing').not.toBeNull();

    const linked = [...toc!.querySelectorAll('a')]
      .map((a) => a.getAttribute('href')?.replace('#', ''))
      .filter((id): id is string => Boolean(id) && id !== '_top');

    const h2Ids = new Set(
      [...document.querySelectorAll('h2[id]')]
        .map((h) => h.id)
        .filter((id) => id !== 'starlight__on-this-page')
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
    const glossary = JSON.parse(
      readFileSync(join(root, 'src/data/glossary.generated.json'), 'utf8')
    );
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
