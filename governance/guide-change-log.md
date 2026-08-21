# Ultimate Beginner's Guide to EVE Online — Change Log

> **Created:** August 18, 2026  
> **Status:** Governing project source

This file records approved material changes to the guide's structure, editorial model, terminology, and canonical content. Editorial changes update document versions when material, but do not imply that factual claims were directly tested or independently reviewed.

---

## August 21, 2026 — Correct the governance manifest and restore the product approval record

**Decision:** Correct a governance regression introduced when the ChatGPT–Claude workflow was adopted. Restore the approved August 18 product-approval record, restore `site-product-specification.md` to the required Project Source set, add `project-workflow.md` to that set, and align the manifest with the current approved versions of every affected governing file.

**Authority clarification:** The approved governing files are authoritative at their embedded versions. The regressed manifest did not supersede or roll back those files. The authoritative set is `ultimate-beginners-guide-master-roadmap.md` version 1.7, `guide-production-handbook.md` version 1.7, `multiboxing-content-framework.md` version 1.4, `page-template.md` version 1.3, `project-instructions.md` version 1.4, `site-product-specification.md` version 1.0, and `project-workflow.md` version 1.0, together with the unaffected approved Section 0 and glossary versions identified by the corrected manifest.

**Corrections:**

- Advanced `project-source-manifest.md` to version 1.5.
- Corrected the manifest's expected versions for the roadmap, production handbook, multiboxing framework, page template, and Project Instructions.
- Restored `site-product-specification.md` version 1.0 to the manifest's required Project Sources.
- Added `project-workflow.md` version 1.0 to the manifest's required Project Sources.
- Restored the missing August 18 product-approval entry to this change log in reverse-chronological order.
- Confirmed that `before-you-launch.md` version 1.4 and `glossary.md` version 1.0 were unaffected.

**Affected files:**

- `project-source-manifest.md` — version 1.5
- `guide-change-log.md` — this entry and the restored August 18 product-approval entry

## August 21, 2026 — Establish the ChatGPT–Claude project workflow

**Decision:** Adopt a tool-neutral operating workflow that separates editorial authority from technical implementation while keeping the user as the final decision-maker. Use the Git repository as the controlled bridge between approved ChatGPT content and Claude's site implementation.

**Operating model:**

- ChatGPT owns research, factual synthesis, guide prose, editorial governance, content audits, and preparation of approved content releases.
- Claude owns repository architecture, Astro/Starlight implementation, components, search, calculators, technical validation, and implementation reporting.
- The user approves governing decisions, content promotion, material product deviations, repository merges, and publication.
- Approved content moves to the repository through a versioned release record. Claude may apply bounded mechanical transformations but must return factual, editorial, or meaning-changing issues to ChatGPT.
- Repository copies of governing files are read-only inputs for Claude and do not silently supersede their editorial sources.
- Version mismatches, missing governance, unapproved content, cross-domain conflicts, and material deviations are explicit stop conditions.
- Standardized content-release and implementation-report templates provide traceable handoffs between the two AI tools.

**Affected files:**

- `project-workflow.md` — version 1.0; new governing project source
- `project-source-manifest.md` — version 1.4
- `guide-change-log.md` — this entry

## August 18, 2026 — Approve the site product and technical model

**Decision:** Approve `site-product-specification.md` version 1.0 as the governing product and technical specification for the published guide. Establish a static-first Astro/Starlight architecture, Pagefind search, a machine-readable page schema, WCAG 2.2 AA as the accessibility target, and an implementation boundary that does not require a permanent application backend, reader accounts, saved progress, EVE SSO or ESI authorization, or stored character profiles.

**Product and architecture:**

- Use Astro with Starlight as the static content and documentation foundation.
- Use Markdown or MDX as the canonical publication format, with interactive behavior isolated in purpose-built components.
- Use Pagefind for static search, including type-ahead results, a complete results page, major-heading indexing, direct heading anchors, beginner terminology, EVE terminology, abbreviations, alternate names, common misspellings, and glossary terms.
- Keep one canonical source for every explanation or recommendation. Derive navigation, indexes, search data, and other generated outputs from canonical content or approved structured data.
- Establish a machine-readable page schema for page identity, status, navigation, version, currency, access, patch sensitivity, review triggers, time, cost, risk, search terms, tags, language, and translation relationships.
- Use static or client-side components for the two approved anonymous advisors and other bounded interactions unless a later approved requirement demonstrates the need for a backend.
- Do not add reader login, saved progress, EVE SSO or ESI authorization, profile storage, or a permanent backend without a later approved product decision.

**Reader experience and quality:**

- Preserve the approved one-page-per-major-section model, homepage paths into canonical content, grouped navigation, desktop On This Page sidebar, previous/next behavior, glossary interactions, and prominent heading-level search.
- Treat desktop and laptop use as primary while applying established responsive behavior on smaller screens.
- Target WCAG 2.2 AA and require keyboard access, visible focus, sufficient contrast, semantic structure, non-color cues, responsive content, and accessible interactive components.
- Use preview builds, schema validation, link and anchor checks, accessibility checks, responsive review, performance checks, and search validation as site-level quality controls.

**Affected files:**

- `site-product-specification.md` — version 1.0; new governing Project Source
- `project-instructions.md` — version 1.4
- `ultimate-beginners-guide-master-roadmap.md` — version 1.7
- `guide-production-handbook.md` — version 1.7
- `multiboxing-content-framework.md` — version 1.4
- `page-template.md` — version 1.3
- `project-source-manifest.md` — version 1.4
- `guide-change-log.md` — this entry

## August 18, 2026 — Finalize Priority 1 reader experience and specialized-reference standards

**Decision:** Finalize the guide's reader experience, navigation, search, fit-reference, skill-plan, and decision-advisor model. Keep the product focused on gameplay teaching and advisory judgment rather than progress tracking, duplicated paths, generic calculators, or troubleshooting coverage.

**Reader experience and navigation:**

- Make **Begin the Complete Guided Path** the homepage's primary action.
- Offer Alpha, returning-player, career-selection, and alt or multiboxing entry points that link into the same canonical guide content. Do not create duplicate guide versions or an urgent-recovery homepage path.
- Publish one page per major section, allow free navigation without gates or shaming, and provide no progress tracking.
- Group global navigation as **Foundation**, **Career Academies**, and **Veteran Path**, expanding only the current group.
- Provide a sticky desktop **On This Page** sidebar generated from major headings. Treat the site as desktop-first and apply established responsive and accessibility practices without requiring separate editorial decisions for routine mobile behavior.
- Use the approved previous/next model for the foundation, career branches, veteran path, and specialized references.
- Show glossary definitions on hover or tap and link to the full glossary.

**Search:**

- Keep search prominent in the header on every page.
- Provide type-ahead results and a complete results page.
- Index major headings and link directly to heading anchors within long section pages.
- Recognize plain-language terms, EVE terminology, abbreviations, alternate names, common misspellings, and glossary terms.

**Specialized references:**

- Preserve the approved fit-reference standard: one recommended default, compact variant comparison, full-width fit sections lower on the page, skill requirements, broad complete-ship cost bands, relevant implant costs, **If This Doesn't Fit**, and the central Pyfa adaptation guide.
- Use one cumulative skill plan with capability milestones, **Copy Entire Plan**, **Copy This Milestone**, current in-game import and tracking instructions, conditional **What This Milestone Enables** guidance, functional skill groups, explicit level-V justification, and training order optimized for playability rather than serial completion.
- Limit guide-native calculation tools to **Can I Afford to Undock This?** and the **Character and Account Value Advisor**. Delegate deeper calculation to specialist tools, worked examples, worksheets, or decision aids.
- Make the Character and Account Value Advisor anonymous and advisory. Compare current-character, same-account, MCT, separate-Omega, and group-support options; evaluate economic, operational, and personal value separately; and return one recommendation, one alternative, qualitative Fun Value, what the option unlocks or improves, drawbacks, change conditions, and the next guide step.

**Troubleshooting boundary:**

- Remove troubleshooting as a page type, reference section, template requirement, search index, or real-time gameplay companion.
- Prevent foreseeable problems through complete prerequisites, accurate procedures, clear fits and skill milestones, warnings before consequential decisions, and links to specialist tools.
- Retain proactive risk, loss, and resilience teaching where it is part of gameplay guidance, without building a technical-support knowledge base.

**Affected files:**

- `project-instructions.md` — version 1.3; remains below the 8,000-character settings limit
- `ultimate-beginners-guide-master-roadmap.md` — version 1.6
- `guide-production-handbook.md` — version 1.6
- `multiboxing-content-framework.md` — version 1.3
- `page-template.md` — version 1.2
- `project-source-manifest.md` — version 1.3
- `guide-change-log.md` — this entry

## August 18, 2026 — Condense Project Instructions for the settings limit

**Decision:** Condense the Project Instructions below the 8,000-character settings limit without removing any governing requirement, including the newly approved fit-reference and no-hard-validation rules.

**Affected files:**

- `project-instructions.md` — version 1.2
- `project-source-manifest.md` — version 1.2
- `guide-change-log.md` — this entry

## August 18, 2026 — Remove hard validation gates and establish the fit-reference standard

**Decision:** Remove mandatory direct testing, independent review, tested/untested labels, and formal validation status as publication requirements. Preserve strong sourcing, patch-sensitivity notices, last-updated dates, transparent uncertainty, and optional hands-on walkthroughs as quality aids.

**Fit-reference standard:** Treat every published fit as a useful starting point rather than a guarantee for every character. Group related variants on one page, lead with one recommended default, compare variants in a compact table, and link to complete fit sections lower on the page. Keep the default expanded and other variants collapsed until selected.

Every fit reference must include minimum required skills, recommended supporting skills, an import-ready block with a Copy Fit action, concise module explanations, purpose-relevant metrics only, limitations, escape guidance, upgrades, and an **If This Doesn't Fit** section. Link to one central **Using Pyfa to Test and Adapt Fits** guide for character-specific experimentation.

Use broad complete-ship cost bands: Very low (under 10 million ISK), Low (10–50 million), Moderate (50–250 million), High (250 million–1 billion), Very high (1–5 billion), and Major investment (over 5 billion). List materially relevant implant costs separately.

**Affected files:**

- `project-instructions.md` — version 1.1
- `ultimate-beginners-guide-master-roadmap.md` — version 1.5
- `guide-production-handbook.md` — version 1.5
- `multiboxing-content-framework.md` — version 1.2
- `page-template.md` — version 1.1
- `before-you-launch.md` — version 1.4; metadata terminology only
- `project-source-manifest.md` — version 1.1
- `guide-change-log.md` — this entry

## August 18, 2026 — Governance consolidation and foundation files

**Decision:** Resolve the conflict between project instructions and the production handbook, consolidate duplicated production guidance, correct the canonical Section 0 filename, and create the missing glossary and reusable page template.

**Changes:**

- Replaced the Project Instructions with a complete paste-ready version aligned to the governing files.
- Established optional guided activities and self-checks as permitted teaching aids while retaining the prohibition on homework, tests, pass/fail criteria, certification, and mandatory mastery gates.
- Confirmed `before-you-launch.md` as the canonical Section 0 filename and corrected current and historical references.
- Made the production handbook the single home for editorial style and source-policy rules rather than creating redundant style-guide and source-policy files.
- Made `page-template.md` the single canonical reusable page template and removed duplicated template blocks from the roadmap and handbook.
- Added `glossary.md` as the governing terminology source and initial core-term register.
- Deferred broader page-archetype design and claim-type-specific source hierarchies for later decisions.

**Affected files:**

- `project-instructions.md` — version 1.0; new paste-ready governing instructions
- `ultimate-beginners-guide-master-roadmap.md` — version 1.4
- `guide-production-handbook.md` — version 1.4
- `multiboxing-content-framework.md` — version 1.1; terminology definitions consolidated into the glossary
- `glossary.md` — version 1.0; new governing source
- `page-template.md` — version 1.0; new governing source
- `guide-change-log.md` — this entry

## August 18, 2026 — Multiboxing as a guide-wide progression

**Decision:** Make alts, Multiple Character Training, multiple Omega accounts, and legal multiboxing a required progression woven through the guide rather than an optional veteran-only topic.

**Guiding position:** Single-character competence remains the correct learning foundation. The guide should deliberately lead beyond that foundation because multi-character and multi-account play can substantially increase corporation value, industrial and harvesting scale, logistical independence, and access to EVE's broader operational capacity.

**Changes:**

- Added multiboxing to the guide's core goals and content architecture.
- Established Section 3 as the formal account-planning foundation: character versus account, MCT, separate Omega accounts, role placement, security, and first-alt timing.
- Added applicable multiboxing progression to fitting, flight, safety, economy, corporations, every career branch, dangerous-space living, advanced roles, strategy, and veteran optimization.
- Expanded mining coverage from individual hull progression to miners, boosts, compression, hauling, scouting, attention management, and diminishing returns.
- Expanded Planetary Industry and industry coverage to same-account and multi-account role architectures, supply chains, bottlenecks, bookkeeping, and incremental profit.
- Adopted a net-value standard that includes account or MCT cost, taxes, hauling, fuel, expected losses, capital opportunity cost, attention, and break-even time.
- Required current official verification of clone-state, concurrent-client, MCT, input-broadcasting, automation, account-sharing, launcher, and SSO rules.
- Required visuals for account topology, account decisions, legal-control boundaries, role plans, industrial chains, mining fleets, attention, and break-even.
- Updated **Before You Launch** to preview the guide's long-term multiboxing destination without encouraging premature account creation.
- Corrected the roadmap and handbook to use **section** terminology and the approved guide/reference model consistently.
- Added `multiboxing-content-framework.md` as a governing Project Source.

**Affected files:**

- `ultimate-beginners-guide-master-roadmap.md` — version 1.3
- `guide-production-handbook.md` — version 1.3
- `before-you-launch.md` — version 1.3; multiboxing orientation added
- `multiboxing-content-framework.md` — version 1.0; new governing source
- `project-instructions-addendum.md` — multiboxing governance added
- `guide-change-log.md` — this entry

## August 18, 2026 — Guide model and section terminology

**Decision:** Present the project as a comprehensive, progressive beginner-to-veteran guide and consolidated reference—not a course, certification program, or consumer training curriculum.

**Changes:**

- Adopted **section** as the project-wide label for each major unit of the guide.
- Removed consumer-facing assessments, assigned activities, mastery gates, homework, and pass/fail framing.
- Replaced assessment-oriented elements with step-by-step procedures, guided examples, practical coverage, warnings, recovery guidance, concise recaps, key takeaways, and connections to related topics.
- Retained author-side research, mechanic verification, fresh-character walkthroughs, and usability testing as production requirements.
- Confirmed **Before You Launch** as the approved opening section.
- Updated the next planned deliverable to the **Your First Session** blueprint, followed by research and author-side verification.

**Affected files:**

- `ultimate-beginners-guide-master-roadmap.md` — version 1.1
- `guide-production-handbook.md` — version 1.1
- `before-you-launch.md` — version 1.2; editorial changes only, factual verification date unchanged
- `your-first-session` blueprint — revised in the working chat; not yet promoted to a governing Project Source
