import { expandQuery, promotedResults, type PromotedResult } from './vocabulary';

/**
 * Browser-side search engine shared by the header type-ahead and the full results page.
 *
 * One implementation serves both surfaces (site-product-specification.md v1.0, section 7:
 * "Each component must have one reusable implementation"). The engine combines two sources:
 *
 *   1. The maintained search vocabulary, which handles beginner language, abbreviations,
 *      alternate names, and misspellings that Pagefind cannot match on its own.
 *   2. Pagefind's static index, which supplies full-text results and — through its
 *      sub-results — the major headings inside long section pages, each with its own anchor.
 */

export interface SearchResultItem {
  /** Destination including the heading anchor, when the match is a heading. */
  url: string;
  /** Page title. */
  page: string;
  /** Matching heading within the page, when the match is heading-level. */
  heading: string | null;
  /** Short context around the match. May contain Pagefind's <mark> markup. */
  excerpt: string;
  kind: 'promoted' | 'page' | 'heading';
  /** Why a promoted result was promoted, shown to the reader rather than hidden. */
  reason?: string;
}

export interface SearchResponse {
  results: SearchResultItem[];
  /** True when Pagefind could not be loaded, e.g. in `astro dev` before a build. */
  indexUnavailable: boolean;
  /** The query actually sent to Pagefind after vocabulary expansion. */
  effectiveQuery: string;
}

interface PagefindSubResult {
  title: string;
  url: string;
  excerpt: string;
  anchor?: { id?: string };
}

interface PagefindData {
  url: string;
  excerpt: string;
  meta?: { title?: string };
  sub_results?: PagefindSubResult[];
}

interface PagefindResult {
  id: string;
  data: () => Promise<PagefindData>;
}

interface PagefindApi {
  options: (options: Record<string, unknown>) => Promise<void>;
  search: (query: string) => Promise<{ results: PagefindResult[] }>;
}

let pagefindPromise: Promise<PagefindApi | null> | null = null;

/** Load Pagefind once, lazily, and tolerate its absence rather than breaking the page. */
async function loadPagefind(): Promise<PagefindApi | null> {
  if (!pagefindPromise) {
    pagefindPromise = (async () => {
      try {
        // A runtime asset path, not a module: Pagefind is written into the output directory
        // by the build, so it cannot be resolved at type-check or bundle time. Held in a
        // variable so neither TypeScript nor Vite tries to follow it.
        const indexUrl = '/pagefind/pagefind.js';
        const api = (await import(/* @vite-ignore */ indexUrl)) as unknown as PagefindApi;
        await api.options({ excerptLength: 24 });
        return api;
      } catch {
        return null;
      }
    })();
  }
  return pagefindPromise;
}

/** Warm the index on first interaction so the first keystroke is not the slow one. */
export function preloadSearchIndex(): void {
  void loadPagefind();
}

function describePromotion(result: PromotedResult): string {
  switch (result.matchKind) {
    case 'misspelling':
      return `Common misspelling of “${result.canonical}”`;
    case 'abbreviation':
      return `Abbreviation for “${result.canonical}”`;
    case 'alternate':
      return `Also called “${result.canonical}”`;
    case 'beginner':
      return `Matches “${result.canonical}”`;
    case 'glossary':
      return 'Glossary definition';
    default:
      return `Matches “${result.canonical}”`;
  }
}

export async function search(query: string, maxResults = 12): Promise<SearchResponse> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { results: [], indexUnavailable: false, effectiveQuery: trimmed };
  }

  const promoted: SearchResultItem[] = promotedResults(trimmed).map((result) => ({
    url: result.destination.url,
    page: result.destination.page,
    heading: result.destination.heading,
    excerpt: '',
    kind: 'promoted' as const,
    reason: describePromotion(result),
  }));

  const effectiveQuery = expandQuery(trimmed);
  const pagefind = await loadPagefind();

  if (!pagefind) {
    return { results: promoted, indexUnavailable: true, effectiveQuery };
  }

  const { results } = await pagefind.search(effectiveQuery);
  const seen = new Set(promoted.map((item) => item.url));
  const fullText: SearchResultItem[] = [];

  for (const result of results.slice(0, maxResults)) {
    const data = await result.data();
    const page = data.meta?.title ?? data.url;

    // Heading-level results first: they link directly to the matching anchor, which is what
    // makes a long section page navigable (spec section 6).
    const subResults = data.sub_results ?? [];
    for (const sub of subResults) {
      if (seen.has(sub.url)) continue;
      seen.add(sub.url);
      fullText.push({
        url: sub.url,
        page,
        heading: sub.title,
        excerpt: sub.excerpt,
        kind: 'heading',
      });
    }

    if (subResults.length === 0 && !seen.has(data.url)) {
      seen.add(data.url);
      fullText.push({ url: data.url, page, heading: null, excerpt: data.excerpt, kind: 'page' });
    }

    if (promoted.length + fullText.length >= maxResults) break;
  }

  return {
    results: [...promoted, ...fullText].slice(0, maxResults),
    indexUnavailable: false,
    effectiveQuery,
  };
}

/** Escape untrusted text before inserting it into result markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Pagefind excerpts arrive as HTML containing only `<mark>` highlighting. Everything else is
 * escaped, then the highlight markup is restored, so an excerpt can never inject markup.
 */
export function renderExcerpt(excerpt: string): string {
  return escapeHtml(excerpt).replace(/&lt;mark&gt;/g, '<mark>').replace(/&lt;\/mark&gt;/g, '</mark>');
}

/** Shared result-list markup for the dialog and the full results page. */
export function renderResults(results: SearchResultItem[]): string {
  return results
    .map((result) => {
      const context = result.heading
        ? `${escapeHtml(result.page)} › ${escapeHtml(result.heading)}`
        : escapeHtml(result.page);

      const badge =
        result.kind === 'promoted' && result.reason
          ? `<span class="search-result__badge">${escapeHtml(result.reason)}</span>`
          : '';

      const excerpt = result.excerpt
        ? `<p class="search-result__excerpt">${renderExcerpt(result.excerpt)}</p>`
        : '';

      return `<li class="search-result" data-kind="${result.kind}">
        <a class="search-result__link" href="${escapeHtml(result.url)}">
          <span class="search-result__context">${context}</span>
          ${badge}
          ${excerpt}
        </a>
      </li>`;
    })
    .join('');
}
