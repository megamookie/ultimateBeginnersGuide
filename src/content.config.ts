import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Machine-readable page metadata required by `site-product-specification.md` v1.0 section 5
 * and defined field-by-field in `page-template.md` v1.3.
 *
 * Every field below maps to a template field. The schema is enforced at build time: an
 * invalid, incomplete, or duplicate record fails the build rather than publishing silently
 * (site-product-specification.md v1.0, section 5).
 */

const documentState = z.enum([
  'Blueprint',
  'Working draft',
  'Review candidate',
  'Approved',
  'Superseded',
]);

const navigationGroup = z.enum([
  'Foundation',
  'Career Academies',
  'Veteran Path',
  'Reference',
]);

const appliesTo = z.enum(['Alpha', 'Omega', 'Both']);

const riskLevel = z.enum(['Low', 'Moderate', 'High', 'Not applicable']);

/** ISO 8601 calendar date, e.g. 2026-08-18. */
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be an ISO date in YYYY-MM-DD form');

/** Semantic-style guide version, e.g. 1.4. */
const guideVersion = z
  .string()
  .regex(/^\d+\.\d+$/, 'Must be a guide version in X.Y form');

/** Permanent URL path. Absolute, lowercase, and trailing-slashed so URLs stay durable. */
const permanentSlug = z
  .string()
  .regex(
    /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/,
    'Must be an absolute, lowercase, trailing-slashed URL path'
  );

const guideMetadata = z.object({
  /** Stable page identifier. Never reused, never changed after publication. */
  page_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  /** Publication status. Only `Approved` content is eligible for canonical publication. */
  status: documentState,

  /** Section number, or a reference type for non-section pages. */
  section: z.union([z.number().int().min(0).max(17), z.string().min(1)]),

  /** Navigation group and ordering within it. */
  navigation_group: navigationGroup,
  order: z.number().int().min(0),

  /** Permanent URL. Duplicate slugs fail validation in scripts/check-generated.mjs. */
  permanent_slug: permanentSlug,

  guide_version: guideVersion,

  /** Date of the last *material content* change, not the date of a technical conversion. */
  last_updated: isoDate,

  applies_to: appliesTo,

  patch_sensitivity: z.string().min(1),
  review_trigger: z.string().min(1),

  estimated_reading_time: z.string().min(1),
  estimated_in_game_time: z.string().min(1).default('Not applicable'),
  approximate_cost: z.string().min(1).default('None'),

  risk: z.object({
    level: riskLevel,
    reason: z.string().min(1),
  }),

  /**
   * Beginner terms, abbreviations, alternate names, and common misspellings that should
   * reach this page. Registered into the search vocabulary at build time.
   */
  search_terms: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),

  language: z.string().default('en'),
  /** Page identifier of the source-language page when this is a translation. */
  translation_of: z.string().nullable().default(null),

  /**
   * Navigation relationships that cannot be derived from the section registry.
   * Ordinary previous/next links are generated; only overrides belong here.
   */
  prerequisite: z.array(z.string()).default([]),
  parent: z.string().nullable().default(null),
  related: z.array(z.string()).default([]),

  /**
   * Verbatim orientation-block text carried over from the approved source where the
   * source states something the schema cannot express. Rendered unchanged.
   */
  orientation_note: z.string().nullable().default(null),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        /**
         * Required on every guide and reference page. Splash/landing routes that carry no
         * canonical guide content omit it; check-generated.mjs enforces that only the
         * homepage and 404 route may do so.
         */
        guide: guideMetadata.optional(),
      }),
    }),
  }),
};
