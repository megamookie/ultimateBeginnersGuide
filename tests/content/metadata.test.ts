import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';

/**
 * Content-schema and publication-boundary checks that must not depend on a build having
 * run, so a broken page is caught before Astro is invoked.
 *
 * The Zod schema in src/content.config.ts already fails the build on an invalid record.
 * These tests cover the rules a per-page schema cannot see: uniqueness across pages, the
 * approval boundary, and non-duplication between the two search-vocabulary homes.
 */

const root = join(import.meta.dirname, '../..');
const DOCS = join(root, 'src/content/docs');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

interface GuideMetadata {
  page_id: string;
  status: string;
  section: number | string;
  navigation_group: string;
  order: number;
  permanent_slug: string;
  guide_version: string;
  last_updated: string;
  applies_to: string;
  patch_sensitivity: string;
  review_trigger: string;
  estimated_reading_time: string;
  search_terms?: string[];
  [key: string]: unknown;
}

interface Page {
  file: string;
  raw: string;
  frontmatter: Record<string, unknown>;
  guide: GuideMetadata | null;
}

const pages: Page[] = walk(DOCS)
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => {
    const raw = readFileSync(file, 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n/);
    if (!match) throw new Error(`${relative(root, file)} has no frontmatter`);

    const frontmatter = (parseYaml(match[1]) ?? {}) as Record<string, unknown>;
    return {
      file: relative(root, file),
      raw,
      frontmatter,
      guide: (frontmatter.guide as GuideMetadata | undefined) ?? null,
    };
  });

/** Routes that legitimately carry no guide metadata: they hold no canonical guide content. */
const CHROME_PAGES = new Set([
  'src/content/docs/index.mdx',
  'src/content/docs/404.mdx',
  'src/content/docs/table-of-contents.mdx',
]);

describe('page metadata', () => {
  it('finds the pages it expects to check', () => {
    expect(pages.length).toBeGreaterThanOrEqual(4);
  });

  it('gives every guide page the required machine-readable metadata', () => {
    for (const page of pages) {
      if (CHROME_PAGES.has(page.file)) continue;
      expect(page.guide, `${page.file} is missing its guide metadata block`).not.toBeNull();

      for (const field of [
        'page_id',
        'status',
        'section',
        'navigation_group',
        'order',
        'permanent_slug',
        'guide_version',
        'last_updated',
        'applies_to',
        'patch_sensitivity',
        'review_trigger',
        'estimated_reading_time',
      ]) {
        expect(page.guide?.[field], `${page.file} is missing guide.${field}`).toBeDefined();
      }
    }
  });

  it('publishes only content whose state is Approved', () => {
    for (const page of pages) {
      if (CHROME_PAGES.has(page.file)) continue;
      expect(page.guide?.status, `${page.file} is published but not marked Approved`).toBe('Approved');
    }
  });

  it('uses a unique stable page id', () => {
    const ids = pages.filter((p) => p.guide).map((p) => p.guide!.page_id);
    expect(new Set(ids).size, `duplicate page_id among ${ids.join(', ')}`).toBe(ids.length);
  });

  it('uses a unique permanent slug that matches the file location', () => {
    const slugs = pages.filter((p) => p.guide).map((p) => p.guide!.permanent_slug);
    expect(new Set(slugs).size, `duplicate permanent_slug among ${slugs.join(', ')}`).toBe(slugs.length);

    for (const page of pages) {
      if (!page.guide) continue;
      const expected =
        '/' + page.file.replace('src/content/docs/', '').replace(/\.mdx?$/, '') + '/';
      expect(page.guide.permanent_slug, `${page.file} slug does not match its route`).toBe(expected);
    }
  });

  it('records last_updated as an ISO date', () => {
    for (const page of pages) {
      if (!page.guide) continue;
      expect(page.guide.last_updated, `${page.file}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('keeps search aliases in one place, not duplicated into page metadata', () => {
    // site-product-specification.md v1.0 section 6: aliases live in page metadata *or* the
    // single vocabulary file. This build chose the vocabulary file, so page-level
    // search_terms must stay empty rather than becoming a competing synonym list.
    for (const page of pages) {
      if (!page.guide) continue;
      expect(page.guide.search_terms ?? [], `${page.file} duplicates the search vocabulary`).toEqual([]);
    }
  });

  it('never publishes a hand-maintained body table of contents', () => {
    for (const page of pages) {
      expect(page.raw, `${page.file} reintroduced a body table of contents`).not.toMatch(
        /^##\s+Table of Contents\s*$/m
      );
    }
  });
});
