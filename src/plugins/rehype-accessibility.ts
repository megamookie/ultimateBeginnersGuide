/**
 * Accessibility repairs applied to rendered Markdown output.
 *
 * Both fixes address defects introduced by Markdown *rendering*, not by the approved prose,
 * and neither changes a reader-visible word. They were found by the automated axe run in
 * scripts/check-a11y.mjs against Section 0.
 */

import { visit } from 'unist-util-visit';
import type { Element, Root } from 'hast';

export default function rehypeAccessibility() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      /**
       * GitHub-flavoured task lists render `- [ ] …` as a disabled checkbox with no label,
       * which axe reports as a critical `label` violation (11 nodes in the Pre-Launch
       * Checklist).
       *
       * The checkbox carries no information: it is always unchecked, always disabled, and
       * the list item's own text is the content. Hiding it from assistive technology gives
       * screen-reader users the checklist as a plain list, which is what it is, while
       * sighted readers keep the visual checkbox. The input is disabled, so hiding it
       * cannot strand keyboard focus.
       */
      if (
        node.tagName === 'input' &&
        node.properties?.type === 'checkbox' &&
        node.properties?.disabled
      ) {
        node.properties['aria-hidden'] = 'true';
      }

      /**
       * A wide table scrolls horizontally on a phone. A scrolling region must be reachable
       * by keyboard, or a keyboard-only reader cannot read the columns that overflow
       * (axe `scrollable-region-focusable`; spec section 8 requires keyboard access to all
       * content).
       *
       * Starlight styles the table element itself as `display: block; overflow: auto`, so
       * the table *is* the scroll container and making it focusable is the direct fix — a
       * wrapper would sit outside the element that actually scrolls. No ARIA role is added:
       * a `region` would need an accessible name, and inventing a caption for an approved
       * table is an editorial act, not a technical one.
       */
      if (node.tagName === 'table') {
        node.properties = { ...node.properties, tabIndex: 0 };
      }
    });
  };
}
