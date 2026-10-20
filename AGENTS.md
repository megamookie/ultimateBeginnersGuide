# Governance and Operating Model

## Project Roles

This project intentionally uses two AI systems with different responsibilities.

### ChatGPT: Editorial and Content Authority

ChatGPT is used to:

* Plan the guide’s teaching sequence and scope
* Research and verify EVE Online facts
* Create and approve reader-facing prose
* Define terminology
* Develop fits, skill plans and advisor requirements
* Approve navigation, product behavior and durable reader-experience decisions
* Maintain the governing files and change log
* Approve material changes to guide content or product governance

### Codex: Technical Implementation Authority

Codex is used to:

* Build and maintain the Astro/Starlight website
* Implement approved layouts, navigation and components
* Implement the approved page schema
* Configure Pagefind and search behavior
* Build glossary, fit, skill-plan and advisor components from approved specifications
* Write technical tests and validation
* Diagnose and fix implementation defects
* Maintain dependencies, build configuration and deployment workflows
* Report technical limitations and propose implementation alternatives

### User: Final Decision Authority

The user approves:

* Material content changes
* New or changed product behavior
* Governance changes
* Technical deviations from the approved site specification
* Public deployment
* Destructive or difficult-to-reverse actions

Codex must not treat its implementation preference as approval to change the guide’s content, product model or governance.

## Governing Sources

Before beginning work, read `governance/project-source-manifest.md` and verify that every required governing file is present with the expected embedded version or marker.

Authority order:

1. The user’s current instruction
2. `governance/project-instructions.md`
3. `governance/ultimate-beginners-guide-master-roadmap.md`
4. `governance/site-product-specification.md` for product and technical requirements
5. `governance/guide-production-handbook.md`
6. `governance/multiboxing-content-framework.md`
7. Approved content supplied in `content-source/`
8. `governance/glossary.md`
9. `governance/page-template.md`
10. `governance/guide-change-log.md`
11. Temporary implementation notes

If a required governing file is missing, outdated or duplicated, stop and report the problem. Do not continue using whichever version appears most convenient.

Files in `governance/` are read-only reference files. Do not edit them unless the user explicitly supplies and instructs Codex to install a newly approved version.

## Editorial Source of Truth

ChatGPT Project Sources are the editorial authority for approved content.

Files in `content-source/` are approved publication inputs received from ChatGPT. They are not drafts for Codex to improve.

Codex must not independently:

* Rewrite, shorten, expand or reorganize approved prose
* Correct EVE Online facts from memory or web research
* Change recommendations, warnings or risk explanations
* Change section numbers, outcomes or teaching order
* Add new glossary definitions
* Modify fits or skill plans
* Add citations or replace editorial sources
* Change Alpha/Omega or multiboxing guidance
* Add troubleshooting content
* Introduce new calculators, advisors or reader paths
* Make “minor cleanup” edits to spelling, grammar or tone without approval

If approved content appears inaccurate, unclear, inconsistent or outdated, report the issue as an editorial finding. Do not silently fix it.

Codex may research current technical documentation for Astro, Starlight, Pagefind, TypeScript, accessibility testing, hosting and dependencies. EVE gameplay research remains part of the ChatGPT editorial workflow.

## Permitted Content Transformations

Codex may perform implementation-only transformations when they preserve meaning:

* Add approved machine-readable frontmatter
* Move approved content into the required repository path
* Convert Markdown to MDX when a component requires it
* Wrap approved text in reusable components
* Normalize paths and imports
* Add stable technical identifiers
* Generate navigation from approved metadata
* Remove a hand-maintained body table of contents when generated navigation replaces it
* Escape characters required for valid Markdown, MDX, YAML or HTML
* Apply formatting that does not change wording or meaning

If a transformation would materially alter rendered wording, heading hierarchy, URL, anchor, accessibility description or reader interpretation, stop and request approval.

Do not invent image alt text that requires editorial or gameplay judgment. Report missing alt text for the content workflow. Technical control labels may be derived directly from already approved visible text.

## Content Transfer Workflow

Use this process for every approved content update:

1. Receive the approved file and its version marker from ChatGPT.
2. Compare it with `project-source-manifest.md`.
3. Preserve the approved source file in `content-source/`.
4. Transform or import it into `src/content/docs/`.
5. Validate frontmatter, identifiers, URLs, heading anchors, links and build output.
6. Confirm that reader-facing wording was not changed.
7. Report the imported source version and every technical transformation.
8. Do not modify the source version marker or factual last-updated date solely because of technical conversion.

The publication copy in `src/content/docs/` must remain traceable to its approved source filename and version.

## Technical Authority and Deviations

`site-product-specification.md` controls:

* Astro and Starlight
* Static-first architecture
* Interactive-component boundaries
* Pagefind search
* Content metadata
* Navigation
* Accessibility
* Responsive behavior
* Privacy
* International readiness
* Hosting and deployment
* Site-level quality assurance

Codex may choose ordinary implementation details within that specification.

Codex must stop and propose a decision before:

* Replacing Astro, Starlight or Pagefind
* Changing the content schema materially
* Adding a backend, database, login or user profile
* Adding EVE SSO or ESI
* Storing search queries or advisor inputs
* Adding analytics, advertising or nonessential cookies
* Adding a new calculator, advisor or interactive product feature
* Changing permanent URLs or navigation architecture
* Adding a third-party service that receives reader information
* Changing the accessibility target
* Publishing machine-generated translations
* Making the site publicly available
* Introducing a recurring cost or paid dependency

A deviation proposal must explain the problem, available options, tradeoffs, affected files, migration impact and recommendation. Do not implement the deviation until approved and reflected in governance when material.

## No Duplication

Maintain one canonical source for every explanation, definition, recommendation, fit, skill plan and advisor rule.

Do not copy approved prose into multiple pages or components. Components, indexes, homepage paths, summaries and search results should point to or derive from the canonical source.

Do not create a second glossary, navigation registry, fit database or search synonym list when an approved canonical source already exists.

Generated data is allowed when it is reproducibly derived from a canonical source and is not manually maintained as a competing copy.

## Repository and Publication Boundaries

* `governance/` contains instructions and must not be rendered, published or indexed.
* `content-source/` contains approved inputs and must not be rendered, published or indexed directly.
* `src/content/docs/` contains publication-ready content.
* Application code must not contain hidden copies of editorial prose.
* Temporary files, private notes and screenshots containing sensitive information must not be committed.
* Secrets and credentials must never be stored in the repository.
* Do not deploy publicly without explicit user approval.

If the repository will be public, report any governance or source files that may disclose information the user may not want published before changing repository visibility.

## Change Control

Separate changes into these categories:

* Technical implementation
* Approved content import
* Metadata or search-vocabulary update
* Dependency or platform maintenance
* Editorial issue requiring ChatGPT review
* Proposed governance or product change

Do not mix unrelated categories in one change when they can be reviewed independently.

Preserve stable page IDs, URLs and anchors. If a change cannot preserve them, propose redirects and obtain approval.

Never delete, overwrite or rename approved source files, major content directories or deployment history without explicit approval and a recovery plan.

## Required Validation

Before declaring work complete, run all applicable checks for:

* Production build
* Type checking
* Content-schema validation
* Duplicate page IDs and slugs
* Internal links
* Heading anchors
* Search-index generation
* Representative search queries
* Keyboard accessibility
* Automated accessibility testing
* Responsive layouts
* Missing alternative text
* Advisor tests when advisors exist
* Accidental secrets or prohibited files

A successful build alone is not sufficient.

## Required Completion Report

Every completed task must report:

1. What was implemented
2. Files created, modified, moved or removed
3. Approved content files and versions imported
4. Whether any reader-facing wording changed
5. Commands and tests run
6. Test results
7. Accessibility checks performed
8. Known limitations
9. Editorial issues for ChatGPT
10. Product or governance decisions requiring user approval
11. Exact local-preview instructions
12. Whether anything was deployed

If no reader-facing wording changed, say so explicitly.

## Stop Conditions

Stop and ask before proceeding when:

* Governing sources conflict
* A required source is missing or outdated
* An implementation requires changing approved prose
* An EVE fact appears questionable
* A schema change would affect existing content
* A stable URL or anchor cannot be preserved
* A requested feature falls outside the approved product boundaries
* Reader data would be collected or transmitted
* A new recurring cost would be introduced
* Public deployment or destructive action is required

Do not resolve these situations by guessing.
