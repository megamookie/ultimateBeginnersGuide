// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';

import rehypeGlossary from './src/plugins/rehype-glossary';
import rehypeAccessibility from './src/plugins/rehype-accessibility';
import registry from './src/data/section-registry.json' with { type: 'json' };

/**
 * Build the grouped sidebar required by the master roadmap v1.7 section 8:
 * Foundation, Career Academies, Veteran Path — generated from the section registry
 * rather than hand-maintained, so a newly approved section appears by flipping
 * `published` in one place.
 *
 * Unpublished sections are listed with their roadmap title and a "Soon" badge but are
 * not linked. This satisfies the grouped-navigation requirement without publishing a
 * placeholder page for content that has not been editorially approved.
 */
function buildSidebar() {
  const bySlug = new Map(registry.sections.map((s) => [s.slug, s]));

  const groups = registry.groups.map((group) => ({
    label: group.label,
    collapsed: group.id !== 'foundation',
    items: group.sections.map((number) => {
      const section = registry.sections.find((s) => s.number === number);
      if (!section) throw new Error(`Section ${number} missing from registry`);
      const label = `${section.number}. ${section.title}`;
      return section.published
        ? { label, link: `/${group.urlSegment}/${section.slug}/` }
        : {
            // Not yet approved for publication. The entry stays visible so readers can see
            // the whole path, but it points at the table of contents — which states its
            // status — rather than at a page that does not exist.
            //
            // No `#section-N` fragment here: with `trailingSlash: 'always'` Astro appends
            // the slash after the fragment, producing `/table-of-contents/#section-1/`,
            // which resolves to nothing.
            label,
            link: '/table-of-contents/',
            attrs: { 'data-unpublished': 'true' },
            badge: { text: 'Soon', variant: /** @type {const} */ ('default') },
          };
    }),
  }));

  if (bySlug.size !== registry.sections.length) {
    throw new Error('Duplicate slug in section registry');
  }

  return [
    ...groups,
    {
      // The remaining indexes required by master roadmap v1.7 section 8, and the About,
      // What Changed, and correction pages required by site-product-specification.md v1.0
      // section 12, are deferred: each needs approved editorial content that does not exist
      // yet. They are reported as deferred destinations rather than shipped as placeholders.
      label: 'Reference',
      items: [
        { label: 'Complete Table of Contents', link: '/table-of-contents/' },
        ...registry.referencePages
          .filter((page) => page.published)
          .map((page) => ({ label: page.title, link: page.url })),
      ],
    },
  ];
}

export default defineConfig({
  // Placeholder origin. A stable custom domain is required before public deployment
  // (site-product-specification.md v1.0, section 9). Not yet approved for deployment.
  site: 'https://example.invalid',
  trailingSlash: 'always',

  build: { format: 'directory' },

  vite: {
    server: {
      fs: {
        /*
         * Vite's dev server serves arbitrary files from the project root, so
         * `/governance/project-workflow.md` and `/content-source/before-you-launch.md` were
         * both reachable at localhost:4321. The production build never contains them —
         * scripts/check-governance-leak.mjs verifies that — but `astro dev --host` would
         * expose them on the local network.
         *
         * CLAUDE.md: governance "must not be rendered, published or indexed"; content-source
         * "must not be rendered, published or indexed directly".
         */
        deny: ['**/governance/**', '**/content-source/**'],
      },
    },
  },

  markdown: {
    // Wraps approved terms in their canonical glossary definition. Non-destructive:
    // see src/plugins/rehype-glossary.ts. Inherited by MDX via extendMarkdownConfig.
    processor: unified({ rehypePlugins: [rehypeGlossary, rehypeAccessibility] }),
  },

  integrations: [
    starlight({
      title: "Ultimate Beginner's Guide to EVE Online",
      description:
        'A progressive launch-to-veteran guide, reference, and decision guide for EVE Online.',

      // English canonical edition, architected for later locales
      // (site-product-specification.md v1.0, section 9).
      defaultLocale: 'root',
      locales: { root: { label: 'English', lang: 'en' } },

      // "On This Page" is generated from major headings only
      // (master roadmap v1.7, section 8).
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 2 },

      // Previous/next is generated from the section registry by our Pagination
      // override, not from sidebar adjacency.
      pagination: false,

      // No public repository yet, so there is no edit URL to offer.
      editLink: undefined,

      lastUpdated: false,

      customCss: ['./src/styles/custom.css'],

      components: {
        Search: './src/components/search/Search.astro',
        Pagination: './src/components/navigation/Pagination.astro',
        PageTitle: './src/components/page/PageTitle.astro',
      },

      sidebar: buildSidebar(),

      head: [
        {
          tag: 'meta',
          attrs: { name: 'robots', content: 'index, follow' },
        },
      ],
    }),
  ],
});
