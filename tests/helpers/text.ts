import { readFileSync, existsSync } from 'node:fs';
import { parseHTML } from 'linkedom';

/**
 * Helpers for proving that a published page says exactly what its approved source says.
 *
 * The comparison is done on word sequences rather than raw strings, because Markdown
 * syntax, HTML structure, and whitespace all legitimately differ between the two. What may
 * not differ is the words a reader actually sees, in the order they see them.
 */

/** Normalise typography so a smart-quote pass cannot be mistaken for a wording change. */
export function normalizeTypography(value: string): string {
  return value
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    .replace(/[\u2013\u2014\u2012]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00A0/g, ' ');
}

/** Reduce text to a comparable sequence of words. */
export function words(value: string): string[] {
  return normalizeTypography(value)
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

/**
 * Strip Markdown syntax down to the text a reader sees.
 *
 * Deliberately conservative: it removes markers and leaves every word alone.
 */
export function markdownToText(markdown: string): string {
  const stripped = markdown
    .split('\n')
    .map((line) => {
      // Table alignment rows and horizontal rules carry no reader-visible text.
      if (/^\|[\s:\-|]+\|$/.test(line)) return '';
      if (/^\s*---+\s*$/.test(line)) return '';

      // A heading keeps its full text — including a leading "1." that is part of the
      // approved title, not a list marker.
      const heading = line.match(/^#{1,6}\s+(.*)$/);
      if (heading) return heading[1];

      return line
        .replace(/^>\s?/, '')
        .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/, '')
        .replace(/^\s*[-*+]\s+/, '')
        .replace(/^\s*\d+\.\s+/, '');
    })
    .join('\n');

  return (
    stripped
      // Links and images: keep the visible label, drop the target.
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Emphasis and code markers.
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      // Table cell separators.
      .replace(/\|/g, ' ')
  );
}

/**
 * Reader-visible text of a built page.
 *
 * Excludes chrome and anything the site adds on top of the approved prose: the generated
 * orientation block, glossary definition panels, and screen-reader-only anchor labels.
 */
export function renderedText(htmlPath: string): string {
  if (!existsSync(htmlPath)) {
    throw new Error(`${htmlPath} does not exist. Run \`npm run build\` before this test.`);
  }

  const { document } = parseHTML(readFileSync(htmlPath, 'utf8'));
  const main = document.querySelector('.sl-markdown-content');
  if (!main) throw new Error(`No .sl-markdown-content found in ${htmlPath}`);

  for (const selector of [
    '.glossary-term__panel',
    '.sr-only',
    '[data-pagefind-ignore]',
    // Decorative only — callout icons carry no meaning beyond the label beside them.
    '[aria-hidden="true"]',
  ]) {
    for (const node of main.querySelectorAll(selector)) node.remove();
  }

  // `textContent` runs adjacent blocks together ("AreaAlpha limitation"). Separate the
  // block-level boundaries so the word sequence matches how the page actually reads.
  for (const node of main.querySelectorAll('td, th, li, p, h1, h2, h3, h4, h5, h6, dt, dd, tr, div')) {
    node.appendChild(document.createTextNode(' '));
  }

  return main.textContent ?? '';
}
