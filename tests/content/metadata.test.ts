import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { guideMetadataSchema } from '@/lib/content/schema';

/**
 * Content-schema and publication-boundary checks that must not depend on a build having
 * run, so a broken page is caught before Astro is invoked.
 *
 * These cover the rules a per-page schema cannot see: uniqueness across pages, the approval
 * boundary, agreement between metadata and file location, and non-duplication between the
 * two possible search-vocabulary homes.
 */

const root = join(import.meta.dirname, '../..');
const DOCS = join(root, 'src/content/docs');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

interface Page {
  file: string;
  raw: string;
  frontmatter: Record<string, unknown>;
}

const pages: Page[] = walk(DOCS)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => {
    const raw = readFileSync(file, 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) throw new Error(`${relative(root, file)} has no frontmatter`);
    return {
      file: relative(root, file),
      raw,
      frontmatter: (parseYaml(match[1]) ?? {}) as Record<string, unknown>,
    };
  });

/** Routes that legitimately carry no guide metadata: they hold no canonical guide content. */
const CHROME_PAGES = new Set([
  'src/content/docs/index.mdx',
  'src/content/docs/404.mdx',
  'src/content/docs/table-of-contents.mdx',
]);

const guidePages = pages.filter((page) => !CHROME_PAGES.has(page.file));

describe('page metadata', () => {
  it('finds the pages it expects to check', () => {
    expect(pages.length).toBeGreaterThanOrEqual(4);
    expect(guidePages.length).toBeGreaterThanOrEqual(2);
  });

  it('satisfies the approved page schema in full', () => {
    // page-template.md v1.4 defines every field; the schema mirrors it exactly.
    for (const page of guidePages) {
      const result = guideMetadataSchema.safeParse(page.frontmatter);
      expect(
        result.success,
        `${page.file}: ${result.success ? '' : JSON.stringify(result.error.issues, null, 2)}`
      ).toBe(true);
    }
  });

  it('gives every guide page a description for search and social preview', () => {
    // site-product-specification.md v1.1 section 12: unique titles and descriptions.
    for (const page of guidePages) {
      expect(page.frontmatter.description, `${page.file} has no description`).toBeTruthy();
    }
  });

  it('publishes only content whose state is Approved', () => {
    for (const page of guidePages) {
      expect(page.frontmatter.status, `${page.file} is published but not marked Approved`).toBe(
        'Approved'
      );
    }
  });

  it('uses a unique stable page id', () => {
    const ids = guidePages.map((p) => p.frontmatter.page_id);
    expect(new Set(ids).size, `duplicate page_id among ${ids.join(', ')}`).toBe(ids.length);
  });

  it('uses a unique permanent slug that matches the file location', () => {
    const slugs = guidePages.map((p) => p.frontmatter.permanent_slug);
    expect(new Set(slugs).size, `duplicate permanent_slug among ${slugs.join(', ')}`).toBe(slugs.length);

    for (const page of guidePages) {
      const expected = '/' + page.file.replace('src/content/docs/', '').replace(/\.mdx?$/, '') + '/';
      expect(page.frontmatter.permanent_slug, `${page.file} slug does not match its route`).toBe(expected);
    }
  });

  it('agrees with the section registry on route and publication state', () => {
    const registry = JSON.parse(
      readFileSync(join(root, 'src/data/section-registry.json'), 'utf8')
    );

    for (const page of guidePages) {
      const section = Number(page.frontmatter.section);
      if (!Number.isInteger(section)) continue; // reference pages are not in the sequence

      const entry = registry.sections.find((s: { number: number }) => s.number === section);
      expect(entry, `section ${section} is not in the registry`).toBeTruthy();
      expect(entry.published, `section ${section} is published but the registry says otherwise`).toBe(
        true
      );

      const group = registry.groups.find((g: { id: string }) => g.id === entry.group);
      const registryUrl = entry.route ?? `/${group.urlSegment}/${entry.slug}/`;
      expect(registryUrl, `${page.file} route disagrees with the registry`).toBe(
        page.frontmatter.permanent_slug
      );
    }
  });

  it('lets the vocabulary refine an approved page term, never restate it', () => {
    /*
     * site-product-specification.md v1.1 section 6 allows aliases in page metadata *or* the
     * single vocabulary file, and forbids scattering synonym lists. Both homes are in use
     * here, so the rule enforced is one of granularity rather than blanket exclusivity:
     *
     *   - An approved page's `search_terms` own the page-level destination.
     *   - The vocabulary file may repeat one of those terms only to point at a *more
     *     precise* destination — a specific heading anchor within that page.
     *
     * That keeps "recruit a friend" landing on the exact heading instead of the top of a
     * ten-minute page, while making it impossible to keep two competing page-level lists
     * that could silently drift apart.
     */
    const vocabulary = JSON.parse(
      readFileSync(join(root, 'src/data/search-vocabulary.json'), 'utf8')
    );

    interface VocabEntry {
      canonical: string;
      beginner: string[];
      abbreviations: string[];
      alternates: string[];
      misspellings: string[];
      destination: { url: string };
    }

    const aliasDestinations = new Map<string, string[]>();
    for (const entry of vocabulary.entries as VocabEntry[]) {
      const aliases = [
        ...entry.beginner,
        ...entry.abbreviations,
        ...entry.alternates,
        ...entry.misspellings,
      ];
      for (const alias of aliases) {
        const key = alias.toLowerCase();
        aliasDestinations.set(key, [...(aliasDestinations.get(key) ?? []), entry.destination.url]);
      }
    }

    for (const page of guidePages) {
      const pageUrl = page.frontmatter.permanent_slug as string;
      for (const term of (page.frontmatter.search_terms as string[] | undefined) ?? []) {
        const destinations = aliasDestinations.get(term.toLowerCase());
        if (!destinations) continue;

        for (const destination of destinations) {
          expect(
            destination.startsWith(`${pageUrl}#`),
            `${page.file}: search term "${term}" is restated in search-vocabulary.json ` +
              `pointing at ${destination}. The vocabulary may only refine an approved page ` +
              `term with a heading anchor on the same page.`
          ).toBe(true);
        }
      }
    }
  });

  it('never publishes a hand-maintained body table of contents', () => {
    for (const page of pages) {
      expect(page.raw, `${page.file} reintroduced a body table of contents`).not.toMatch(
        /^##\s+Table of Contents\s*$/m
      );
    }
  });

  it('publishes no reader-facing checklist', () => {
    // page-template.md v1.4 and guide-production-handbook.md v1.8 prohibit reader-facing
    // checklists, self-checks, readiness confirmations, and completion gates.
    for (const page of pages) {
      const body = page.raw.replace(/^---\n[\s\S]*?\n---\n/, '');
      expect(body, `${page.file} contains a reader-facing checklist`).not.toMatch(
        /^\s*[-*+]\s+\[[ xX]\]\s/m
      );
    }
  });
});
