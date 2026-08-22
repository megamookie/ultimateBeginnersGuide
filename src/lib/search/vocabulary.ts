import vocabulary from '../../data/search-vocabulary.json';
import glossary from '../../data/glossary.generated.json';
import pageTerms from '../../data/page-search-terms.generated.json';

/**
 * Search vocabulary lookup (site-product-specification.md v1.0, section 6).
 *
 * Pagefind indexes the words that actually appear on the page. It cannot, on its own, take
 * a reader who types "is eve free", "omeaga", or "which race should i pick" to the right
 * heading. This module supplies that layer: it maps beginner language, abbreviations,
 * alternate names, and common misspellings onto a preferred destination heading, and
 * expands the query so Pagefind's own ranking improves too.
 *
 * Everything here is a pure function over two data files so it can be unit-tested without a
 * build, a browser, or a search index.
 */

export interface VocabularyDestination {
  url: string;
  page: string;
  heading: string | null;
}

export interface VocabularyEntry {
  /**
   * Where this entry came from. Determines how strongly it matches and whether its
   * canonical term is worth appending to a Pagefind query.
   */
  source?: 'vocabulary' | 'page' | 'glossary';
  canonical: string;
  beginner: string[];
  abbreviations: string[];
  alternates: string[];
  misspellings: string[];
  destination: VocabularyDestination;
  promote: boolean;
}

export interface PromotedResult {
  canonical: string;
  destination: VocabularyDestination;
  /** Which surface form matched, so the UI can explain the promotion honestly. */
  matched: string;
  matchKind:
    | 'canonical'
    | 'beginner'
    | 'abbreviation'
    | 'alternate'
    | 'misspelling'
    | 'glossary'
    | 'page';
  score: number;
}

const GLOSSARY_URL = '/reference/glossary/';

/** Fold case, strip punctuation, and collapse whitespace so "d-scan" and "d scan" agree. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Glossary terms become vocabulary entries automatically — never duplicated by hand. */
function glossaryEntries(): VocabularyEntry[] {
  return glossary.categories.flatMap((category) =>
    category.terms.map((term) => ({
      canonical: term.term,
      beginner: [],
      abbreviations: [],
      alternates: [],
      misspellings: [],
      destination: {
        url: `${GLOSSARY_URL}#${term.anchor}`,
        page: 'Glossary',
        heading: term.term,
      },
      promote: false,
      source: 'glossary' as const,
    }))
  );
}

/**
 * Approved page-level `search_terms` become vocabulary entries automatically, from data
 * generated out of each page's own frontmatter. They are never retyped into the hand
 * maintained file, so an approved term cannot drift from the release that owns it
 * (site-product-specification.md v1.1, section 6).
 */
function approvedPageEntries(): VocabularyEntry[] {
  return pageTerms.pages.map((page) => ({
    canonical: page.page,
    beginner: page.terms,
    abbreviations: [],
    alternates: [],
    misspellings: [],
    destination: { url: page.url, page: page.page, heading: null },
    promote: false,
    source: 'page' as const,
  }));
}

export const entries: VocabularyEntry[] = [
  ...(vocabulary.entries as VocabularyEntry[]),
  ...approvedPageEntries(),
  ...glossaryEntries(),
];

interface IndexedForm {
  form: string;
  entry: VocabularyEntry;
  kind: PromotedResult['matchKind'];
  score: number;
}

/**
 * Match weights. An exact canonical hit outranks a beginner phrase, which outranks a
 * misspelling, so a reader who types the real term is never pushed to a fuzzy match.
 */
const WEIGHTS: Record<PromotedResult['matchKind'], number> = {
  canonical: 100,
  abbreviation: 85,
  alternate: 80,
  beginner: 70,
  glossary: 60,
  misspelling: 50,
  // Page-level terms are the weakest signal: they name a whole page, so a heading-level
  // entry pointing at the exact section always wins.
  page: 30,
};

function buildIndex(source: VocabularyEntry[]): IndexedForm[] {
  const index: IndexedForm[] = [];

  for (const entry of source) {
    const canonicalKind: PromotedResult['matchKind'] =
      entry.source === 'glossary' ? 'glossary' : entry.source === 'page' ? 'page' : 'canonical';

    const add = (forms: string[], kind: PromotedResult['matchKind']) => {
      for (const form of forms) {
        const normalized = normalize(form);
        if (normalized) index.push({ form: normalized, entry, kind, score: WEIGHTS[kind] });
      }
    };

    add([entry.canonical], canonicalKind);
    add(entry.abbreviations, 'abbreviation');
    add(entry.alternates, 'alternate');
    // An approved page's own search_terms are page-level, not beginner phrasings.
    add(entry.beginner, entry.source === 'page' ? 'page' : 'beginner');
    add(entry.misspellings, 'misspelling');
  }

  return index;
}

const index = buildIndex(entries);

/**
 * Promoted results for a query, best first.
 *
 * A form matches when the normalized query equals it, or when the query contains it as a
 * whole-word run. Substring matches are damped so that typing a long question does not
 * outrank an exact term.
 */
export function promotedResults(query: string, limit = 4): PromotedResult[] {
  const normalized = normalize(query);
  if (normalized.length < 2) return [];

  const best = new Map<string, PromotedResult>();

  for (const { form, entry, kind, score } of index) {
    let effective: number;

    if (normalized === form) {
      effective = score + 20;
    } else if (containsWholeWordRun(normalized, form)) {
      effective = score;
    } else if (form.startsWith(normalized) && normalized.length >= 3) {
      // Type-ahead: the reader is part-way through typing the term.
      effective = score - 15;
    } else {
      continue;
    }

    const key = entry.destination.url;
    const existing = best.get(key);
    if (!existing || effective > existing.score) {
      best.set(key, {
        canonical: entry.canonical,
        destination: entry.destination,
        matched: form,
        matchKind: kind,
        score: effective,
      });
    }
  }

  return [...best.values()].sort((a, b) => b.score - a.score || a.canonical.localeCompare(b.canonical)).slice(0, limit);
}

/** True when `needle` appears in `haystack` on whole-word boundaries. */
function containsWholeWordRun(haystack: string, needle: string): boolean {
  if (needle.length === 0) return false;
  const haystackWords = haystack.split(' ');
  const needleWords = needle.split(' ');
  if (needleWords.length > haystackWords.length) return false;

  for (let i = 0; i <= haystackWords.length - needleWords.length; i++) {
    if (needleWords.every((word, j) => haystackWords[i + j] === word)) return true;
  }
  return false;
}

/**
 * Rewrite a reader's query into terms Pagefind can actually find on the page.
 *
 * "is eve free" contains no words from the Alpha/Omega heading, so the raw query returns
 * nothing useful. Appending the canonical term lets Pagefind rank the real content.
 */
export function expandQuery(query: string, limit = 2): string {
  const promoted = promotedResults(query, limit);
  if (promoted.length === 0) return query;

  const words = new Set(normalize(query).split(' '));
  const additions = promoted
    // A page title is not a search term; appending it only dilutes the query.
    .filter((result) => result.matchKind !== 'page')
    .map((result) => result.canonical)
    .filter((canonical) => !normalize(canonical).split(' ').every((word) => words.has(word)));

  return additions.length > 0 ? `${query} ${additions.join(' ')}` : query;
}
