import { z } from 'astro/zod';

/**
 * Machine-readable page metadata required by `site-product-specification.md` v1.1 section 5
 * and defined field-by-field in `page-template.md` v1.4.
 *
 * Field names and value shapes mirror the approved template, so an approved source file can
 * be promoted with its frontmatter carried over unchanged. The one exception is documented
 * on `permanent_slug`.
 *
 * This lives outside src/content.config.ts so the same schema can be asserted from tests
 * without pulling in the `astro:content` virtual module, which only exists during a build.
 */

const documentState = z.enum([
  'Blueprint',
  'Working draft',
  'Review candidate',
  'Approved',
  'Superseded',
]);

const navigationGroup = z.enum(['Foundation', 'Career Academies', 'Veteran Path', 'Reference']);

const appliesTo = z.enum(['Alpha', 'Omega', 'Both']);

/** ISO 8601 calendar date, e.g. 2026-08-21. */
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be an ISO date in YYYY-MM-DD form');

/** Semantic-style guide version, e.g. 1.5. */
const guideVersion = z.string().regex(/^\d+\.\d+$/, 'Must be a guide version in X.Y form');

/** Permanent URL path. Absolute, lowercase, and trailing-slashed so URLs stay durable. */
const permanentSlug = z
  .string()
  .regex(
    /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/,
    'Must be an absolute, lowercase, trailing-slashed URL path'
  );

/**
 * The approved template states risk as one string — "[Low / Moderate / High, with a short
 * reason]" — rather than as separate fields, so it is validated as written and rendered as
 * written. Splitting it would be a schema change requiring approval.
 */
const risk = z
  .string()
  .regex(
    /^(Low|Moderate|High|Not applicable)\b/,
    'Must begin with Low, Moderate, High, or Not applicable, followed by a short reason'
  );

export const guideMetadataSchema = z.object({
  /** Stable page identifier. Never reused, never changed after publication. */
  page_id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  /** Publication status. Only `Approved` content is eligible for canonical publication. */
  status: documentState,

  /** Section number, or a reference type for non-section pages. */
  section: z.union([z.string().min(1), z.number()]),

  navigation_group: navigationGroup,
  order: z.number().int().min(0),

  /**
   * Permanent URL. Named `slug` in page-template.md v1.4 and in the approved source;
   * renamed here because `slug` is reserved by Astro's content routing. The value is
   * carried over unchanged by scripts/import-content.mjs.
   * Duplicate values fail validation in tests/content/metadata.test.ts.
   */
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

  risk,

  /**
   * Beginner terms, abbreviations, alternate names, and common misspellings that should
   * reach this page.
   */
  search_terms: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).default([]),

  language: z.string().default('en'),
  /** Page identifier of the source-language page when this is a translation. */
  translation_of: z.string().nullable().default(null),
});
