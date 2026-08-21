import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { promotedResults, expandQuery, normalize, entries } from '@/lib/search/vocabulary';
import searchAcceptance from '../fixtures/search-acceptance.json';

/**
 * Search acceptance testing required by site-product-specification.md v1.0, section 6:
 * representative queries for beginner questions, exact EVE terminology, abbreviations,
 * misspellings, and headings deep inside long section pages, each with an expected result.
 *
 * These run without a build or a browser, so a vocabulary regression is caught immediately.
 * scripts/check-search-index.mjs runs the same fixture against the real Pagefind index.
 */

const root = join(import.meta.dirname, '../..');

describe('query normalisation', () => {
  it('folds case, punctuation, and spacing so surface forms agree', () => {
    expect(normalize('D-Scan')).toBe('d scan');
    expect(normalize('  Alpha   vs. Omega  ')).toBe('alpha vs omega');
    expect(normalize('PLEX!')).toBe('plex');
  });
});

describe('vocabulary coverage', () => {
  it('folds in every canonical glossary term automatically', () => {
    const glossary = JSON.parse(
      readFileSync(join(root, 'src/data/glossary.generated.json'), 'utf8')
    );
    const glossaryTerms = glossary.categories.flatMap((c: { terms: { term: string }[] }) =>
      c.terms.map((t) => t.term)
    );

    const known = new Set(entries.map((entry) => entry.canonical));
    for (const term of glossaryTerms) {
      expect(known.has(term), `glossary term "${term}" is not reachable through search`).toBe(true);
    }
  });

  it('only points at content that has been published', () => {
    // A vocabulary entry aimed at an unpublished page would send readers to a 404.
    const published = ['/foundation/before-you-launch/', '/reference/glossary/'];
    for (const entry of entries) {
      const url = entry.destination.url;
      expect(
        published.some((prefix) => url.startsWith(prefix)),
        `vocabulary entry "${entry.canonical}" points at unpublished content: ${url}`
      ).toBe(true);
    }
  });
});

describe('search acceptance queries', () => {
  for (const testCase of searchAcceptance.queries) {
    it(`${testCase.kind}: "${testCase.query}" → ${testCase.expectedUrl}`, () => {
      const results = promotedResults(testCase.query);
      expect(results.length, `no promoted result for "${testCase.query}"`).toBeGreaterThan(0);
      expect(results[0].destination.url).toBe(testCase.expectedUrl);
    });
  }
});

describe('query expansion', () => {
  it('adds the canonical term so Pagefind can rank the real content', () => {
    // "is eve free" shares no words with the Alpha/Omega heading; unexpanded it finds nothing.
    expect(expandQuery('is eve free')).toContain('Alpha and Omega');
  });

  it('leaves an already-canonical query alone', () => {
    expect(expandQuery('Exordium')).toBe('Exordium');
  });

  it('ranks an exact term above a beginner phrase that mentions it', () => {
    const results = promotedResults('PLEX');
    expect(results[0].canonical).toBe('PLEX');
  });
});
