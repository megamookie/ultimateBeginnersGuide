# Ultimate Beginner's Guide to EVE Online — Site Product Specification

> **Specification version:** 1.1  
> **Created:** August 18, 2026  
> **Approved:** August 18, 2026  
> **Status:** Governing project source  
> **Purpose:** Govern the product, publishing, technical, accessibility, international, and operational model for turning the guide into a maintainable worldwide reader destination.

---

## 1. Purpose and Authority

This specification defines how the *Ultimate Beginner's Guide to EVE Online* should become a public digital product without abandoning its durable Markdown content model.

It supplements rather than replaces:

- `ultimate-beginners-guide-master-roadmap.md`, which controls what the guide teaches and in what order
- `guide-production-handbook.md`, which controls research, writing, review, and maintenance
- `page-template.md`, which controls the instructional structure of guide pages
- `multiboxing-content-framework.md`, which controls alt, account, MCT, and multiboxing guidance
- Approved section files, which remain the canonical reader content

This file is the single governing source for site behavior, technical architecture, global delivery, accessibility conformance, search implementation, interactive-component boundaries, deployment, and site-level quality assurance. Other governing files should reference it instead of duplicating its rules.

---

## 2. Product Definition

The destination should be a **content-first guide with a thin interactive layer**, not a traditional account-based web application.

The site must continue to function in the three roles established by the roadmap:

1. **Progressive guide:** A new reader can follow the complete path from Section 0 through Section 17.
2. **Reference destination:** A reader can search for and open a specific mechanic, fit, skill plan, role, or decision.
3. **Decision guide:** A reader can compare choices and use the two approved guide-native advisors.

The core content must be rendered as durable, indexable static HTML. JavaScript should be added only where it materially improves interaction.

### Product boundaries

The first public product should not require:

- Reader accounts or authentication
- Saved progress or completion tracking
- EVE SSO or ESI access
- A reader-profile database
- Personalized skill or asset claims
- A permanent application server
- Comments on every guide page
- A troubleshooting or real-time emergency system
- A generic calculator library
- A native mobile application
- An installable Progressive Web App unless a later demonstrated need justifies it

The absence of these features is intentional. It protects privacy, reduces maintenance, improves worldwide performance, and preserves the guide's approved scope.

---

## 3. Approved Decision Summary

| Area | Approved decision |
|---|---|
| Product model | Static guide with small interactive components |
| Durable content | Markdown or MDX stored in version control |
| Site framework | Astro with Starlight |
| Interaction model | Astro islands or equivalent isolated client-side components |
| Search | Pagefind-generated static index with a customized reader interface |
| Hosting | Globally distributed static hosting; Cloudflare Pages is the preferred starting option |
| Reader login | None |
| EVE SSO or ESI | None for the two approved advisors |
| Data storage | No storage of advisor inputs or search queries by default |
| Accessibility | WCAG 2.2 Level AA target |
| Initial language | English canonical edition |
| International model | Translation-ready from the first implementation; human-reviewed translations added later |
| Analytics | Optional, privacy-preserving, and nonessential to site operation |
| Application backend | None for the initial product; add only for a later approved requirement |

Astro and Starlight are the approved platform because the destination remains predominantly documentation while needing reusable interactive components. This replaces the roadmap's former tentative MkDocs Material recommendation.

Material for MkDocs remains a viable static documentation platform, but Astro and Starlight better fit the guide's required advisor interfaces, copy actions, expandable fit references, glossary interactions, structured content, and specialized search experience.

---

## 4. Reader Experience

Preserve the approved reader experience:

- Make **Begin the Complete Guided Path** the homepage's primary action.
- Offer Alpha, returning-player, career-selection, and alt or multiboxing entry points into the same canonical content.
- Publish one page per major section.
- Allow free navigation without gates, shaming, or progress tracking.
- Do not present reader-facing checklists, self-checks, readiness confirmations, completion controls, or mastery states. The site is an information source, not a training product.
- Group global navigation as **Foundation**, **Career Academies**, and **Veteran Path**.
- Expand only the current navigation group.
- Provide a sticky desktop **On This Page** list generated from major headings.
- Keep search prominent in the header on every page.
- Provide previous, next, prerequisite, parent-topic, and related navigation according to the approved roadmap model.
- Show glossary definitions on hover, keyboard focus, tap, or activation and link to the full glossary.
- Use one canonical source for every explanation, fit, skill plan, recommendation, definition, and advisor rule.

The site should be desktop-first because most readers are expected to use a desktop or laptop beside the EVE client. Responsive behavior must still be accessible and fully functional on tablets and phones without requiring separate editorial decisions for ordinary mobile patterns.

No essential explanation or procedure may be available only through an interaction. A reader who cannot use a tooltip, expandable panel, or JavaScript component must still be able to reach the equivalent content or explanation.

---

## 5. Content Architecture and Metadata

Markdown remains the durable source format. Site components may use MDX or structured data when an interaction cannot be expressed safely in plain Markdown.

Every published page should contain machine-readable metadata. The final field names will be implemented in the site schema, but the schema must support:

- Stable page identifier
- Title and search description
- Publication status
- Section number or reference type
- Navigation group and order
- Permanent slug or URL
- Guide version
- Last material update date
- Alpha, Omega, or both applicability
- Patch sensitivity
- Review trigger
- Estimated reading time
- Estimated in-game time when relevant
- Approximate cost when relevant
- Risk level and concise reason
- Search terms, aliases, abbreviations, and tags
- Language or locale
- Translation relationship when applicable
- Previous, next, prerequisite, parent, and related-page relationships when they cannot be derived reliably

The visible page orientation block should be generated from this metadata rather than maintained separately. The page body should not contain a second hand-maintained table of contents when the site generates an **On This Page** list.

The implementation must validate required metadata during the build. Invalid, duplicate, or incomplete records should fail the preview or production build rather than silently publishing inconsistent pages.

### Canonical structured information

When a feature requires structured information, derive it from the canonical content or establish one explicit structured source. Do not manually maintain the same information in prose, JavaScript, search data, and tooltips.

Examples:

- Generate glossary interactions and the full glossary page from the canonical glossary source.
- Generate navigation and indexes from page metadata where practical.
- Keep fit and skill-plan copy blocks in the same canonical source as their explanations.
- Keep search aliases in page metadata or one maintained search-vocabulary data file.

---

## 6. Search Product

Search is a primary navigation system, not a convenience feature.

### Required behavior

Search must:

- Appear in the header on every page.
- Provide useful type-ahead results.
- Provide a complete results page.
- Index major headings within long pages.
- Link directly to the matching heading anchor.
- Return the page title, matching heading, concise context, section or reference type, and Alpha/Omega relevance when useful.
- Recognize beginner language, EVE terminology, abbreviations, alternate names, former names when relevant, glossary terms, and common misspellings.
- Avoid ranking navigation chrome, repeated metadata, or boilerplate above the canonical explanation.
- Work without a hosted search service for the initial release.

Pagefind is the approved baseline because it creates a static search index after the site build, supports section-level results and custom browser interfaces, and can maintain separate language indexes.

### Search vocabulary

Create one maintainable search vocabulary containing, where applicable:

- Canonical term
- Beginner-language equivalent
- Abbreviation
- Alternate or older name
- Common misspelling
- Preferred destination page and heading
- Ranking or promotion guidance

Do not scatter synonym lists across page components. Search vocabulary is operational source data and should be versioned with the site.

### Search acceptance testing

Before public release, maintain representative search queries for:

- Beginner questions
- Exact EVE terminology
- Abbreviations
- Misspellings
- Ship, fit, and skill-plan names
- Account, MCT, and multiboxing terminology
- Headings deep within long section pages

Each representative query should have an expected first result or acceptable result set. Search quality must be tested after material navigation or content changes.

Search queries should remain in the reader's browser by default. Recording search terms requires a later explicit privacy and analytics decision.

---

## 7. Interactive Components

The initial site may include these bounded interactions:

- Search type-ahead and results
- **Can I Afford to Undock This?**
- **Character and Account Value Advisor**
- Glossary definitions
- Copy Fit
- Copy Entire Plan
- Copy This Milestone
- Expandable fit variants and reference details
- Decision trees, comparison filters, and reference cards when they improve understanding

Each component must have one reusable implementation rather than custom page-specific versions.

### Advisor boundaries

Preserve the approved advisor rules from the production handbook and multiboxing framework:

- Build only the two approved guide-native advisors unless the user later approves another.
- Keep both tools anonymous.
- Do not require login, ESI, or saved character data.
- Do not claim knowledge of the reader's actual skills, assets, or account portfolio.
- Explain results in non-shaming language.
- Show assumptions and the reasons behind the recommendation.
- Keep economic, operational, and personal value distinct.
- Provide a clear next guide step.

Advisor inputs should be processed locally in the browser for the initial release. Inputs must not be transmitted or retained by default.

Before either advisor is implemented, create and approve `interactive-tools-specification.md` containing its exact inputs, help text, validation, decision rules, calculations, result precedence, edge cases, disclosures, accessibility behavior, and expected test cases. That future specification must not expand the approved tool count.

### Progressive enhancement

Guide content must remain readable if JavaScript fails. Where an interactive tool provides a unique advisory result, the surrounding page must still explain:

- What decision the tool helps make
- What inputs matter
- The underlying mental model
- The tool's limitations
- A reasonable noninteractive worksheet, example, or specialist alternative when appropriate

---

## 8. Accessibility and Responsive Design

The site should target **WCAG 2.2 Level AA**.

At minimum:

- All navigation and interactive controls must work with a keyboard.
- Focus must be visible and follow a logical order.
- Glossary definitions must not depend on hover alone.
- Form controls must have persistent labels and useful instructions.
- Validation errors must identify the problem and how to correct it.
- Meaning must not depend on color alone.
- Text and controls must meet appropriate contrast requirements.
- Touch targets must remain usable on smaller screens.
- Headings must preserve a logical hierarchy.
- A skip link must allow readers to bypass repeated navigation.
- Images and instructional visuals must include useful alternative text.
- Required video or audio must provide equivalent text.
- Motion and animation must be restrained and respect reduced-motion preferences.
- Advisor results and search updates must be announced appropriately to assistive technology.
- Zoom and text resizing must not hide content or controls.

Automated accessibility testing is required but does not replace keyboard, screen-reader, zoom, contrast, and responsive manual review of representative pages and every interactive component.

---

## 9. Worldwide Delivery and International Readiness

The initial canonical edition should be English. The site architecture must be translation-ready from the beginning without requiring translations for the first public release.

### Global delivery

The site should:

- Use a stable custom domain and HTTPS.
- Be served through a global content-delivery network.
- Minimize JavaScript and third-party requests.
- Optimize responsive images and avoid unnecessarily large downloads.
- Remain useful on slower or less reliable connections.
- Use durable URLs that do not change merely because navigation or filenames change.
- Provide a useful not-found page with search and major-path links.
- Display the Tranquility server context when a claim could be confused with another environment.
- Avoid assuming a reader's country, time zone, currency, subscription price, keyboard layout, or date convention.

### Translation model

When translations begin:

- Keep English as the canonical source unless a later governance decision changes that model.
- Require human review for gameplay procedures, policy, skills, ships, fits, and patch-sensitive mechanics.
- Track which English source version each translation represents.
- Mark or withdraw a translation when a material English-source update makes it unreliable.
- Provide language-specific navigation, metadata, search indexes, and canonical relationships.
- Use the page language in the document markup.
- Avoid placing translatable instructional labels permanently inside images.
- Maintain a translation terminology list derived from the canonical glossary.

Machine translation may assist a reviewer but must not silently publish patch-sensitive guide content as approved.

---

## 10. Performance and Resilience

The guide should be fast because readers may keep it open beside the game, use older hardware, or access it through distant or constrained networks.

The implementation should:

- Render content to static HTML at build time.
- Send JavaScript only for components that require it.
- Lazy-load nonessential media and interaction code.
- Optimize and size images to prevent layout movement.
- Use system or efficiently delivered fonts.
- Avoid third-party scripts that block rendering.
- Cache immutable assets safely and replace them through versioned builds.
- Meet current recommended Core Web Vitals thresholds for most real reader visits on both desktop and mobile.
- Preserve a readable page when a component, analytics service, or optional external resource fails.

Performance budgets and representative test pages should be established during implementation. The homepage, a long instructional section, a screenshot-heavy page, a fit reference, search results, and each advisor should be tested separately.

---

## 11. Privacy and Security

The site should collect as little reader information as practical.

### Default privacy posture

- No reader login
- No EVE SSO or ESI
- No storage of advisor inputs
- No storage of search queries
- No advertising trackers
- No sale or sharing of reader profiles
- No requirement to accept nonessential cookies to read the guide

If analytics are added, use a privacy-preserving service or aggregated self-hosted measurement where practical. Document what is collected, why it is collected, how long it is retained, and how readers can learn more or opt out where required.

If a correction or feedback form collects contact information, make it optional unless a reply is requested. Collect only the information needed to evaluate and respond to the submission. Add spam protection that does not create an unreasonable privacy or accessibility burden.

Do not embed secrets, private API credentials, unpublished correction reports, sensitive test data, or private character, corporation, wallet, location, or account details in the public repository or built site.

Third-party dependencies must be pinned through the package lockfile, monitored for important security updates, and removed when abandoned or unnecessary.

---

## 12. Discoverability, Trust, and Public Corrections

The site must be understandable to readers and search engines without compromising editorial quality.

Provide:

- Unique page titles and descriptions
- Canonical URLs
- XML sitemap
- Appropriate robots directives
- Meaningful heading hierarchy
- Social-sharing metadata and preview images where useful
- Breadcrumbs or equivalent path context
- Descriptive internal link text
- A complete table of contents and required indexes
- A visible **What Changed?** page
- A visible correction link on every page
- An About or methodology page explaining authority, sourcing, neutrality, and update practices
- Clear last-updated and patch-sensitivity information

Do not create pages merely to capture search traffic. Search-facing summaries must match the actual page content and reader outcome.

### Correction intake

The public correction workflow should request:

- Affected page or URL
- Disputed statement, procedure, fit, visual, or link
- Why it may be wrong or outdated
- Supporting source or evidence when available
- Optional contact information

Correction submissions are inputs to the established research and change-control process. They do not automatically alter published content.

Site-wide comments are not part of the initial product. Discussion should not obscure the canonical guide or create a second body of unmaintained advice.

---

## 13. Repository and Site Structure

The final implementation may adjust exact directory names, but it should separate content, structured data, reusable components, logic, tests, and static assets.

```text
src/
  content/
    docs/
      foundation/
      career-academies/
      veteran-path/
      reference/
      fits/
      skill-plans/
      multiboxing/
      glossary/
  components/
    advisors/
    fits/
    skill-plans/
    glossary/
    navigation/
    search/
  data/
    search-vocabulary/
    navigation/
  lib/
    advisors/
    search/
    validation/
  styles/
public/
  assets/
tests/
  content/
  search/
  advisors/
  accessibility/
```

The repository should also contain site configuration, dependency locks, build scripts, contribution guidance, correction guidance, and automated test configuration.

Generated site output, generated search indexes, temporary research, screenshots containing sensitive information, and local environment files should not become canonical content sources.

---

## 14. Build, Preview, and Release Workflow

Use version control as the canonical publication history.

Every proposed change should produce a preview build before production publication. The automated workflow should check:

- Site build success
- Content-schema and metadata validity
- Duplicate stable identifiers, slugs, or URLs
- Internal links and heading anchors
- External links according to the approved review cadence
- Missing required metadata
- Missing image alternative text
- Search-index generation
- Representative search-result expectations
- Advisor unit and scenario tests
- Automated accessibility checks
- Formatting and source validation
- Sitemap and canonical URL generation
- Accidental inclusion of secrets or prohibited files

Publishing should be an explicit action from a known-good revision. The previous known-good production build must remain available for rollback.

The production process should distinguish:

- Content update
- Data or search-vocabulary update
- Interactive-component update
- Dependency or platform update
- Emergency factual correction

Material content updates continue to follow the handbook's sourcing, approval, versioning, and change-log rules. Technical releases must not silently alter editorial claims.

---

## 15. Site-Level Quality Assurance

Before a public milestone is released, confirm:

### Reader journey

- [ ] The homepage presents the approved primary and secondary entry paths.
- [ ] Global navigation matches the roadmap groups.
- [ ] Long pages have stable heading anchors and a generated **On This Page** list.
- [ ] Previous, next, parent, prerequisite, and related links behave according to the approved model.
- [ ] Essential guidance remains available without login or saved progress.

### Search

- [ ] Major headings are indexed and link to the correct anchor.
- [ ] Representative beginner, EVE-term, abbreviation, alternate-name, and misspelling queries were tested.
- [ ] Search results identify their page and heading context clearly.
- [ ] Repeated navigation and boilerplate do not dominate ranking.

### Interactive components

- [ ] The two approved advisors match their approved specification and tests.
- [ ] Advisor inputs are not transmitted or retained by default.
- [ ] Copy actions provide accessible success or failure feedback.
- [ ] Expandable content remains reachable by keyboard and assistive technology.
- [ ] JavaScript failure does not make the underlying guide unreadable.

### Accessibility and responsive design

- [ ] Representative pages and every interactive component were reviewed against WCAG 2.2 AA.
- [ ] Keyboard, focus, zoom, contrast, reduced motion, and screen-reader behavior were checked.
- [ ] Desktop, tablet, and phone layouts remain usable.
- [ ] No glossary or instructional meaning depends solely on hover or color.

### Global quality

- [ ] Pages are delivered through HTTPS and a global CDN.
- [ ] Performance was tested on representative desktop, mobile, and slower-network conditions.
- [ ] Locale, language, dates, prices, and server context do not create misleading regional assumptions.
- [ ] Sitemap, canonical URLs, page descriptions, and not-found behavior are correct.

### Operations

- [ ] Preview builds and production builds are reproducible.
- [ ] A known-good rollback is available.
- [ ] Correction intake and change history are visible.
- [ ] No secret, private data, or sensitive screenshot content is present.

---

## 16. Recommended Implementation Sequence

Complete the product foundation before producing many additional approved pages:

1. Complete the controlled updates to the roadmap, handbook, page template, Project Instructions, manifest, and change log.
2. Establish the repository and Astro/Starlight foundation.
3. Define and validate the page metadata schema.
4. Migrate Section 0 without changing its factual content merely for technical conversion.
5. Implement the approved navigation and responsive layout.
6. Prototype heading-level Pagefind search and the search vocabulary.
7. Establish preview builds, automated validation, accessibility checks, and rollback.
8. Create and approve `interactive-tools-specification.md` before implementing the advisors.
9. Prototype the two advisors and their tests before later sections depend on them.
10. Continue the blueprint, research, draft, review, and approval cycle for guide content.
11. Soft-launch Sections 0–2 for reader usability feedback.
12. Promote the site broadly after Sections 0–8 form the complete beginner foundation.
13. Add career branches, veteran material, specialized references, and carefully governed translations through later milestones.

Section blueprinting and research may continue while the product foundation is established. Avoid approving many additional final page files under the old metadata and publication model because that would create preventable migration work.

---

## 17. Governance and Change Control

As part of promotion and later implementation:

- Add this file to `project-source-manifest.md` with its stable filename and approved version.
- Add it to the governing-source list in the ChatGPT Project Instructions.
- Record the product-architecture decision in `guide-change-log.md`.
- Replace the tentative platform language and repository structure in the roadmap with references to this specification.
- Update the production handbook to reference this specification for site implementation and site-level QA.
- Update `page-template.md` to require schema-compatible machine-readable metadata and remove the hand-maintained body table of contents.
- Update `before-you-launch.md` structurally when the site foundation is implemented, without changing its factual last-updated date unless material content also changes.
- Update the multiboxing framework only where necessary to reference the future interactive-tools specification.

Do not copy this complete specification into other governing sources. Keep each rule in the smallest authoritative home and use references for cross-cutting application.

Material changes to the approved product model, platform, data collection, accessibility target, language governance, advisor boundaries, authentication model, ESI use, or hosting architecture require an explicit proposal, affected-file analysis, approval, version update, and change-log entry.

---

## 18. Research Basis

The approved direction was assessed against the governing files and the following primary documentation on August 18, 2026:

- [Astro — Islands architecture](https://docs.astro.build/en/concepts/islands/)
- [Astro — Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Starlight — Site search](https://starlight.astro.build/guides/site-search/)
- [Starlight — Internationalization](https://starlight.astro.build/guides/i18n/)
- [Starlight — Pages](https://starlight.astro.build/guides/pages/)
- [Pagefind — Documentation](https://pagefind.app/docs/)
- [Pagefind — Search API](https://pagefind.app/docs/api/)
- [Pagefind — Multilingual search](https://pagefind.app/docs/multilingual/)
- [Cloudflare Pages — Overview](https://developers.cloudflare.com/pages/)
- [W3C — Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)
- [Google — Web Vitals](https://web.dev/articles/vitals)

These sources support the platform assessment. They do not override the guide's governing content, research, or approval hierarchy.

---

*This specification governs the guide's site product, publishing, technical, accessibility, international, and operational model. The roadmap governs what the guide teaches; the production handbook governs how reader content is produced.*
