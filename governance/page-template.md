# Ultimate Beginner's Guide to EVE Online — Canonical Page Template

> **Template version:** 1.3  
> **Created:** August 18, 2026  
> **Status:** Governing project source  
> **Purpose:** Provide one reusable structure for guide pages without forcing irrelevant or empty sections.

---

## Template Rules

- Preserve the normal teaching sequence: orientation → prerequisites → terminology → mental model → procedure or application → preventive warnings and advisory context → recap → navigation.
- Required elements may be combined under clearer headings, but they may not be silently omitted.
- Optional elements should appear only when they materially help the reader.
- Guided activities and self-checks are optional, non-graded, and skippable. They are not homework, tests, certification, or mastery gates.
- A substantial structural departure must be justified in the approved section blueprint.
- Do not create another governing page template. Propose changes to this file instead.
- This is the standard instructional template. Fit references, skill plans, and approved decision advisors use their purpose-designed structures from the production handbook while preserving compatible metadata, sourcing, accessibility, and navigation rules.
- Do not add troubleshooting pages or recurring diagnostic sections. Prevent foreseeable confusion through complete prerequisites, accurate instructions, and warnings before consequential decisions.
- Use the machine-readable page metadata required by `site-product-specification.md`. Generate the visible title, orientation block, navigation, indexes, and **On This Page** list from canonical metadata or headings where practical; do not repeat them as hand-maintained body content.

## Reusable Markdown Template

```markdown
---
page_id: "[Stable unique identifier]"
title: "[Page title]"
description: "[Concise search and page description]"
status: "[Blueprint / Working draft / Review candidate / Approved / Superseded]"
section: "[Section number or reference type]"
navigation_group: "[Foundation / Career Academies / Veteran Path / Reference]"
order: 0
slug: "[Permanent URL path]"
guide_version: "[X.Y]"
last_updated: "[YYYY-MM-DD for the last material content change]"
applies_to: "[Alpha / Omega / Both]"
patch_sensitivity: "[Stable concept / Recheck after identified trigger]"
review_trigger: "[Event or cadence requiring review]"
estimated_reading_time: "[Range]"
estimated_in_game_time: "[Range or Not applicable]"
approximate_cost: "[Range or None]"
risk: "[Low / Moderate / High, with a short reason]"
search_terms:
  - "[Beginner term, abbreviation, alternate name, or common misspelling]"
tags:
  - "[Controlled topic tag]"
language: "en"
translation_of: null
---

[The site renders the page title and compact orientation block from this metadata. Do not duplicate them manually in the page body.]

[One or two sentences stating what this page helps the reader do and why it matters.]

[The site generates **On This Page** from major headings. Do not add a hand-maintained table of contents to the page body.]

## What You Will Learn

- [Specific capability or decision]
- [Specific capability or decision]

## Prerequisites

- [Required prior knowledge, skill, asset, location, account state, or linked page]
- [State "None" when the page genuinely has no prerequisites.]

## Essential Terminology

[Define only the terms needed now. Use the canonical glossary wording and link to `glossary.md`. Omit if no new terms are introduced.]

## The Mental Model

[Explain the simplest accurate model before procedures, optimizations, or rare exceptions.]

## Step-by-Step Instructions

1. [Action using the current exact interface label.]
2. [Action.]
3. [Action.]

[Omit or rename this section when the page is conceptual or decision-oriented rather than procedural, but still provide a practical application.]

## Recommended Starter Fit or Setup

[Optional. State purpose, limitations, Alpha/Omega status, skills, approximate dated cost, operation, failure conditions, escape plan, and upgrade path.]

## Worked Example

[Optional. Use a realistic, inexpensive situation and explain the decision process rather than presenting unexplained numbers.]

## Important Mistakes to Avoid

### [Mistake or failure]

**Why it matters:** [Consequence.]  
**How to prevent it:** [Prevention.]  
**If it happens:** [Optional concise gameplay recovery only when materially useful; omit technical troubleshooting.]

## Optional Guided Activity or Self-Check

[Optional and non-graded. Give the reader a safe way to apply the material and recognize whether the result is correct. Never make completion a gate to further reading.]

## Visual Aid

[Optional. Include only when it teaches better than prose or a small table. Supply alt text, caption, source/ownership, relevant date or version, and update trigger. Explain in the surrounding text what the reader should notice.]

## Alt and Multiboxing Progression

[Include when the blueprint marks coverage foundational, applicable, or advanced. Identify the bottleneck, roles, account placement, simultaneous-login assumptions, attention, cost, risk, legal-control boundary, resilience, and diminishing returns. Omit when not materially relevant and record that decision in the blueprint.]

## Key Takeaways

- [Three to five concise points.]

## Where to Go Next

- **Previous or prerequisite:** [Link]
- **Next:** [Link and reason]
- **Related:** [Only links that materially help a decision or provide useful depth]

## External Resources and Sources

- [Direct source supporting the claim or procedure]

> **Uncertainty note:** [Identify anything unresolved or especially volatile. Omit when unnecessary.]
```

## Approved Callouts

- **Critical:** A mistake could cause major or irreversible loss.
- **Warning:** A common trap, scam, or dangerous assumption.
- **Alpha note:** The feature or procedure differs for Alpha accounts.
- **Cost note:** Prices are volatile and should be checked locally.
- **Fleet note:** Corporation doctrine or FC instructions override generic advice.
- **Multibox note:** An alt, MCT, or additional Omega account changes the activity's roles, attention, cost, or risk.
- **Rules note:** Current policy limits or legal-control boundaries must be understood.
- **Patch-sensitive:** The claim should be rechecked after an identified update.

## Page Completion Check

- [ ] The reader outcome and prerequisites are explicit.
- [ ] Machine-readable metadata is complete, schema-valid, and consistent with the visible page.
- [ ] Terms are defined before use and agree with `glossary.md`.
- [ ] Facts, recommendations, preferences, meta, and doctrine are distinguishable.
- [ ] Important actions explain why they matter.
- [ ] Procedures use current labels and executable order.
- [ ] Consequential beginner mistakes are anticipated with preventive guidance.
- [ ] Alpha/Omega and character/account assumptions are visible.
- [ ] Applicable multiboxing coverage is substantive rather than an empty heading.
- [ ] Visuals, if any, have purpose, accessibility text, provenance, relevant dates or versions, and update triggers.
- [ ] Sources directly support the associated claims.
- [ ] The last-updated date reflects a material content change.
- [ ] Key takeaways and next-step navigation are concise and useful.
- [ ] Search terms, heading anchors, navigation relationships, and reusable-component needs satisfy applicable site product requirements.

---

*The production handbook governs how this template is researched, written, audited, and maintained.*
