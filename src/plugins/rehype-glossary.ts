/**
 * Link the first occurrence of each eligible glossary term to its canonical definition.
 *
 * This is the mechanism that satisfies "Show glossary definitions on hover, keyboard focus,
 * tap, or activation and link to the full glossary" (site-product-specification.md v1.0,
 * section 4) without editing approved prose by hand.
 *
 * It is a permitted mechanical transformation — project-workflow.md v1.0, section 8.1,
 * "Connecting existing approved labels to glossary definitions" — and it is strictly
 * non-destructive: a matched run of text is wrapped, never reworded, reordered, or removed.
 * `tests/content/wording.test.ts` asserts that the rendered text of Section 0 is identical
 * to the approved source, which is what keeps that guarantee honest.
 *
 * Scope limits, all deliberate:
 *   - Only terms flagged in src/data/glossary-autolink.json are considered, so ordinary
 *     English words that happen to be glossary entries (Main, Point, Grid, Tank) are left
 *     alone.
 *   - Headings, links, code, and the glossary page itself are skipped.
 *   - One link per term per page, so prose is not peppered with repeated controls.
 */

import { visit, SKIP } from 'unist-util-visit';
import type { Element, Root, RootContent, Text } from 'hast';
import { autoLinkTerms, glossaryControl } from '../lib/glossary/markup';

/** Elements whose text must never be rewrapped. */
const SKIPPED_ELEMENTS = new Set([
  'a',
  'code',
  'pre',
  'kbd',
  'samp',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'script',
  'style',
]);

const isWordChar = (char: string | undefined): boolean =>
  char !== undefined && /[\p{Letter}\p{Number}]/u.test(char);

export interface Match {
  index: number;
  /** Length of the matched run, which may exceed the term when a plural "s" is absorbed. */
  length: number;
}

/**
 * First whole-word occurrence of `term` in `text`.
 *
 * Matching ignores case, because approved prose writes "multiboxing" mid-sentence and
 * "Multiboxing" in a heading for the same canonical term. A trailing plural "s" is absorbed
 * into the match so "Omega accounts" links cleanly instead of leaving a stray letter outside
 * the control.
 *
 * Neither behaviour rewrites anything: the caller wraps the exact characters found.
 */
export function findMatch(text: string, term: string, from = 0): Match | null {
  const haystack = text.toLowerCase();
  const needle = term.toLowerCase();

  for (let index = haystack.indexOf(needle, from); index !== -1; index = haystack.indexOf(needle, index + needle.length)) {
    if (isWordChar(text[index - 1])) continue;

    const afterTerm = index + needle.length;
    const next = text[afterTerm];

    // Exact whole-word hit.
    if (!isWordChar(next)) return { index, length: needle.length };

    // Regular plural: absorb the "s" so the whole word sits inside the control.
    if ((next === 's' || next === 'S') && !isWordChar(text[afterTerm + 1])) {
      return { index, length: needle.length + 1 };
    }
  }

  return null;
}

export default function rehypeGlossary() {
  return (tree: Root, file: { path?: string }) => {
    // The glossary page already shows every definition; linking terms to themselves there
    // would be noise.
    if (String(file?.path ?? '').includes('/reference/glossary')) return;

    const terms = autoLinkTerms();
    const linked = new Set<string>();
    let panelCounter = 0;

    visit(tree, 'element', (node: Element) => {
      if (SKIPPED_ELEMENTS.has(node.tagName)) return SKIP;

      const className = node.properties?.className;
      if (Array.isArray(className) && className.includes('glossary-term')) return SKIP;

      const children = node.children as RootContent[];
      if (!children) return undefined;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child?.type !== 'text') continue;

        const text = (child as Text).value;

        for (const entry of terms) {
          if (linked.has(entry.term)) continue;

          const match = findMatch(text, entry.term);
          if (!match) continue;

          const before = text.slice(0, match.index);
          const matched = text.slice(match.index, match.index + match.length);
          const after = text.slice(match.index + match.length);

          const control = glossaryControl(
            entry,
            matched,
            `glossary-def-${entry.anchor}-${panelCounter++}`
          );

          const replacement: RootContent[] = [];
          if (before) replacement.push({ type: 'text', value: before });
          replacement.push(control);
          if (after) replacement.push({ type: 'text', value: after });

          children.splice(i, 1, ...replacement);
          linked.add(entry.term);

          // Resume scanning at the trailing text so other terms in the same node still match.
          i += replacement.length - 2;
          break;
        }
      }

      return undefined;
    });
  };
}
