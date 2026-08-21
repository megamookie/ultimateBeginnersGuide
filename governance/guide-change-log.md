# Ultimate Beginner's Guide to EVE Online — Change Log

> **Created:** August 18, 2026  
> **Status:** Governing project source

This file records approved material changes to the guide's structure, editorial model, terminology, and canonical content. Editorial changes update document versions when material, but do not imply that factual claims were directly tested or independently reviewed.

---

## August 18, 2026 — Approve the site product and technical model

**Decision:** Promote `site-product-specification.md` to a governing Project Source and establish the guide as a content-first static destination with isolated interactive components rather than a traditional account-based application.

**Approved product model:**

- Use Astro with Starlight, durable Markdown or MDX, isolated Astro-style interactive components, and Pagefind as the initial static search baseline.
- Use globally distributed static hosting, with Cloudflare Pages as the preferred starting option.
- Keep the initial product free of reader accounts, saved progress, EVE SSO, ESI, reader-profile storage, and a permanent application backend.
- Process advisor inputs locally and do not store advisor inputs or search queries by default.
- Target WCAG 2.2 Level AA, preserve desktop-first responsive design, and require keyboard, focus, tap, and progressive-enhancement behavior.
- Launch with English as the canonical edition while making the content schema, search, navigation, metadata, and visuals translation-ready.
- Require machine-readable page metadata, stable URLs and identifiers, structured search vocabulary, preview builds, automated validation, rollback, public corrections, privacy boundaries, and site-level release checks.
- Require a later approved `interactive-tools-specification.md` before implementing either of the two already approved advisors.

**Governance changes:**

- Made `site-product-specification.md` the single authority for site behavior, technical architecture, global delivery, accessibility conformance, search implementation, interactive boundaries, deployment, and site-level quality assurance.
- Replaced the roadmap's tentative MkDocs Material direction with the approved Astro/Starlight foundation and moved product-foundation work before additional approved page production.
- Added schema-compatible machine-readable metadata to the canonical page template.
- Added site-product review points to the production and multiboxing standards without duplicating the specification.
- Left `before-you-launch.md` and `glossary.md` unchanged. Section 0 will be converted structurally when the product foundation is implemented; that conversion alone will not change its factual last-updated date.

**Affected files:**

- `site-product-specification.md` — version 1.0; promoted from proposed to governing
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
