import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { guideMetadataSchema } from './lib/content/schema';

/**
 * Content collection definition.
 *
 * The approved page schema lives in src/lib/content/schema.ts so it can be unit-tested
 * directly. It is enforced at build time: an invalid or incomplete record fails the build
 * rather than publishing silently (site-product-specification.md v1.1, section 5).
 */
export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      /**
       * Approved metadata sits at the top level, matching page-template.md v1.4. Every field
       * is optional at the schema level because site chrome — the homepage, the not-found
       * page, the table of contents — carries no canonical guide content and therefore no
       * guide metadata. tests/content/metadata.test.ts enforces that only those three routes
       * may omit it, and that any page carrying it carries all of it.
       */
      extend: guideMetadataSchema.partial(),
    }),
  }),
};
