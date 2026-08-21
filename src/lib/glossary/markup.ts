import { h } from 'hastscript';
import { toHtml } from 'hast-util-to-html';
import type { Element } from 'hast';
import glossary from '../../data/glossary.generated.json';

/**
 * The one implementation of the inline glossary definition control.
 *
 * Two callers share it: the build-time rehype plugin that links terms inside approved prose,
 * and the `<Term>` component available to MDX. Keeping the markup in a single function is
 * what stops the control from drifting into two subtly different versions
 * (site-product-specification.md v1.0, section 7).
 *
 * Behaviour is documented on the CSS in src/styles/custom.css. In summary: hover and
 * keyboard focus reveal the definition with no JavaScript at all, and the control is a real
 * anchor, so activation or a tap always reaches the canonical glossary entry.
 */

export interface GlossaryEntry {
  term: string;
  definition: string;
  anchor: string;
  autoLink: boolean;
}

export const GLOSSARY_URL = '/reference/glossary/';

export const allTerms: GlossaryEntry[] = glossary.categories.flatMap((category) => category.terms);

export function findTerm(term: string): GlossaryEntry | undefined {
  return allTerms.find((entry) => entry.term === term);
}

/**
 * Terms eligible for automatic linking, longest first so "Alpha account" wins over
 * "Account" when both could match at the same position.
 */
export function autoLinkTerms(): GlossaryEntry[] {
  return allTerms
    .filter((entry) => entry.autoLink)
    .sort((a, b) => b.term.length - a.term.length || a.term.localeCompare(b.term));
}

export function glossaryControl(entry: GlossaryEntry, label: string, panelId: string): Element {
  return h('span', { class: 'glossary-term' }, [
    h(
      'a',
      {
        class: 'glossary-term__control',
        href: `${GLOSSARY_URL}#${entry.anchor}`,
        'aria-describedby': panelId,
        'data-glossary-term': '',
      },
      label
    ),
    h('span', { class: 'glossary-term__panel', id: panelId, role: 'tooltip' }, [
      h('span', { class: 'glossary-term__name' }, entry.term),
      h('span', { class: 'glossary-term__definition' }, entry.definition),
      h('span', { class: 'glossary-term__more' }, 'Full glossary entry'),
    ]),
  ]);
}

export function glossaryControlHtml(entry: GlossaryEntry, label: string, panelId: string): string {
  return toHtml(glossaryControl(entry, label, panelId));
}
