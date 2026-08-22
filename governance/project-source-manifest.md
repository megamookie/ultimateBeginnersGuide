# Ultimate Beginner's Guide to EVE Online — Project Source Manifest

> **Manifest version:** 1.8  
> **Updated:** August 22, 2026  
> **Status:** Governing project source  
> **Purpose:** Identify the exact files and embedded document versions that should be attached to the ChatGPT project.

---

## How to Use This Manifest

The filename alone does not prove that a Project Source contains the newest approved content. Use the embedded version or identifying marker listed below.

When a governing file is updated:

1. Open the file in Library and confirm its embedded version or identifying marker.
2. Remove the older copy of that file from the project's Sources.
3. Use **Add from Library** and select the same stable filename.
4. Do not leave two Project Sources with the same filename attached.
5. Start a new project chat after refreshing sources.
6. Ask the new chat to compare its source headers with this manifest before beginning work.

Do not add a duplicate Library file merely because its content changed. The existing Library file should be updated while retaining its stable filename. Re-adding it to Project Sources is the refresh step.

## Required Project Sources

| Filename | Expected version or marker | Purpose | Required now? |
|---|---|---|---|
| `project-source-manifest.md` | Manifest version 1.8 | Defines the approved Project Source set and provides the source-audit procedure | Yes |
| `ultimate-beginners-guide-master-roadmap.md` | Roadmap version 1.8 | Controls section sequence, scope, outcomes, prerequisites, publication milestones, and site-foundation work | Yes |
| `guide-production-handbook.md` | Handbook version 1.8 | Controls research, writing, editorial style, sourcing, QA, maintenance, and implementation-facing content standards | Yes |
| `multiboxing-content-framework.md` | Framework version 1.4 | Controls alt, MCT, multi-account, legal multiboxing, and advisor coverage | Yes |
| `site-product-specification.md` | Specification version 1.1 | Controls approved product behavior, technical architecture, page schema, search, accessibility, and system boundaries | Yes |
| `project-workflow.md` | Workflow version 1.1 | Controls ChatGPT–Claude ownership, content handoffs, repository interaction, approval, and publication workflow | Yes |
| `guide-change-log.md` | Newest heading: `August 22, 2026 — Expand Recruit a Friend procedures and establish the value of multiboxing in Section 0` | Records approved structural, editorial, terminology, product, and governance changes | Yes |
| `before-you-launch.md` | Guide version 1.6; last updated August 22, 2026 | Approved Section 0 and tone benchmark | Yes |
| `page-template.md` | Template version 1.4 | Provides the single canonical reusable page structure and approved machine-readable page schema | Yes |
| `glossary.md` | Glossary version 1.0 | Provides canonical beginner-readable terminology | Yes |

## Project Settings — Do Not Add as a Project Source

| Filename | Expected version | Required action |
|---|---|---|
| `project-instructions.md` | Version 1.5; updated August 21, 2026; fewer than 8,000 characters | Paste its complete contents into the Project Instructions box, replacing prior instructions and addenda. Do not also attach it as a Project Source. |

Keeping the Project Instructions only in the settings box avoids maintaining the same governing instructions in two active locations.

## Future Approved Section Files

Add each later section only after it reaches **Approved** status. At that time, add a row here with its stable filename, approved guide version, last-updated date, and purpose.

| Filename | Expected version or marker | Purpose | Status |
|---|---|---|---|
| `section-01-your-first-session.md` | Not yet approved | Section 1 canonical content | Do not attach yet |
| `section-02-graduate-from-starter-space.md` | Not yet approved | Section 2 canonical content | Do not attach yet |
| `section-03-skills-and-character-development.md` through `section-17-the-veteran-capsuleer.md` | Not yet approved | Later canonical sections | Add individually after approval |

Temporary blueprints, research notes, test logs, alternate outlines, and incomplete drafts should not be attached as governing Project Sources.

## Quick Source Audit Prompt

After refreshing Project Sources, begin a new project chat and use this prompt:

> Read `project-source-manifest.md` and every required Project Source listed in it. Report a table containing each filename, the version or identifying marker actually present, the expected marker from the manifest, and Pass or Fail. Also confirm whether duplicate filenames or unapproved section drafts are present. Do not begin guide production until every required source passes.

## Maintenance Rule

Whenever an approved governing file changes:

1. Update that file's embedded document version or identifying marker.
2. Record the material change in `guide-change-log.md`.
3. Update this manifest in the same change set.
4. Increase the manifest version.
5. Report exactly which Project Sources must be removed and re-added.

The manifest should be updated last so it describes the final approved state of the complete source set.

---

*This manifest identifies the approved Project Source set. It does not replace the authority, production, terminology, product, or content rules contained in the files it lists.*
