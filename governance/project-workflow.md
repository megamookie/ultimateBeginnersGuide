# Ultimate Beginner's Guide to EVE Online — Project Workflow

> **Workflow version:** 1.1  
> **Created:** August 21, 2026  
> **Updated:** August 22, 2026  
> **Status:** Governing project source  
> **Purpose:** Define how the user, ChatGPT, Claude, and the code repository exchange, approve, implement, and maintain project work without creating conflicting sources of truth.

---

## 1. Purpose and Scope

This file governs the operating relationship between the project's editorial work and its technical implementation.

It exists to ensure that:

- ChatGPT can research, draft, review, and maintain the guide without also becoming the coding authority.
- Claude can build, test, and maintain the website without silently becoming the editorial authority.
- The user remains the final decision-maker for content, governance, product scope, code, and publication.
- Approved content reaches the website without uncontrolled rewriting, duplication, or version drift.
- Technical findings can return to the editorial workflow without Claude directly changing guide meaning.
- Every published result can be traced to an approved content version and an identifiable implementation change.

This workflow does not replace the production handbook, master roadmap, page template, multiboxing framework, glossary, site product specification, or repository-specific `CLAUDE.md`. It defines how those sources are used together.

---

## 2. Operating Principles

1. **One owner per decision domain.** Editorial and technical authority are separate.
2. **One canonical home per rule or passage.** Do not maintain competing active versions.
3. **Approval precedes promotion.** Draft material does not become a published source merely because it exists.
4. **Implementation does not imply editorial permission.** A technical obstacle is not permission to rewrite content.
5. **Findings travel back to their authority.** Claude reports editorial issues; ChatGPT reports technical requirements; the user decides unresolved conflicts.
6. **Versions make handoffs traceable.** Filenames alone do not establish currency.
7. **The repository is the implementation bridge.** It records approved releases, code changes, reviews, and deployable history.
8. **Automation must preserve governance.** A faster transfer process is acceptable only when it retains approval, version, validation, and audit controls.
9. **No duplication.** Paths, summaries, indexes, components, and references must point to canonical content instead of reproducing it.
10. **Stop when authority is unclear.** Neither AI should invent approval or resolve a material cross-domain conflict silently.

---

## 3. Roles and Decision Rights

### 3.1 The User — Project Owner and Final Authority

The user:

- Approves or rejects governing decisions, content releases, product changes, and publication.
- Resolves conflicts between editorial goals and technical constraints.
- Decides when a draft becomes approved.
- Authorizes material deviations from the site product specification.
- Approves repository merges and production deployment, unless a later written rule delegates a bounded class of changes.
- May override any project rule through an explicit current instruction.

No AI may infer final approval from silence, technical completion, or the existence of a draft.

### 3.2 ChatGPT — Editorial and Content Authority

ChatGPT owns:

- Section blueprinting and guide-wide content planning.
- Current research, factual synthesis, citations, and uncertainty notes.
- Guide prose, teaching sequence, examples, warnings, recaps, and navigation language.
- Terminology and glossary consistency.
- Editorial application of the roadmap, production handbook, page template, and multiboxing framework.
- Content audits for accuracy, currency, beginner usability, scope, sourcing, and non-duplication.
- Proposed updates to governing editorial files.
- Preparation of approved, versioned content releases for implementation.
- Resolution of editorial findings returned by Claude.

ChatGPT does not independently approve publication, make unapproved product decisions, or treat repository formatting as permission to alter editorial meaning.

### 3.3 Claude — Technical Implementation Authority

Claude owns:

- Repository architecture and maintainable implementation within the approved product specification.
- Astro/Starlight configuration and site structure.
- Components, layouts, styles, search, calculators, data handling, build tooling, tests, and deployment configuration.
- Transformation of approved Markdown or MDX into the structure required by the approved machine-readable page schema.
- Technical validation, accessibility checks, performance checks, responsive behavior, link validation, and build verification.
- Identification and reporting of content that is incomplete, contradictory, structurally incompatible, duplicated, inaccessible, or technically ambiguous.
- Implementation reports and technical documentation.

Claude does not own EVE facts, guide voice, teaching sequence, recommendations, governing editorial decisions, or approval of content.

### 3.4 Shared Responsibilities

Both AI tools must:

- Follow the current approved governing sources.
- Distinguish fact, recommendation, assumption, preference, and unresolved question.
- Preserve canonical filenames, version markers, and change history.
- Identify contradictions rather than choosing a convenient instruction silently.
- Make the smallest justified change.
- Avoid duplicating content or rules.
- State what was changed, what was not changed, and what still requires user approval.

---

## 4. Authority and Conflict Resolution

### 4.1 Project-Wide Authority

When instructions conflict, use this order:

1. The user's explicit current instruction
2. ChatGPT Project Instructions
3. The authority order defined in `guide-production-handbook.md`
4. This workflow for cross-tool ownership, handoff, approval, and repository interaction
5. Temporary plans, prompts, implementation notes, and AI suggestions

This workflow does not change the editorial authority order inside the production handbook.

### 4.2 Technical Authority

For website implementation decisions, use this order:

1. The user's explicit current instruction
2. The approved `site-product-specification.md`
3. This workflow
4. Repository `CLAUDE.md`
5. Approved page schema and component contracts
6. Existing implementation patterns and technical documentation
7. Temporary implementation plans or AI suggestions

`CLAUDE.md` may provide more specific repository instructions, but it may not contradict a higher authority.

### 4.3 Conflict Procedure

When a material conflict is discovered:

1. Stop the affected work.
2. Quote or identify the conflicting instructions and their sources.
3. Explain the practical impact of each interpretation.
4. Recommend one resolution.
5. List every governing file, content file, schema, component, or test that would be affected.
6. Obtain user approval before applying the material decision.
7. Record the approved change in the correct authoritative source and change log.

Routine mechanical choices that do not change meaning, scope, reader experience, or approved product behavior do not require escalation.

---

## 5. Canonical Workspaces and Sources of Truth

### 5.1 ChatGPT Project

The ChatGPT project is the editorial working environment. It contains the current Project Instructions and the approved Project Sources identified by `project-source-manifest.md`.

Working drafts, research notes, alternatives, and unapproved blueprints may remain in their active project chats or temporary working files. They are not governing merely because ChatGPT produced them.

### 5.2 ChatGPT Library

The Library stores the durable editorial files and their version history. Stable filenames should be preserved when those files are updated.

The Project Sources attached to the ChatGPT project must match the versions and markers in `project-source-manifest.md`.

### 5.3 Git Repository

The Git repository is the technical implementation and publication record. It contains:

- Read-only working copies of the approved governing files needed by Claude.
- Approved content promoted for publication.
- Site source code, components, schema, tests, and configuration.
- Implementation reports and technical decisions.
- Version-control history showing what changed and when.

A repository copy does not silently supersede its editorial source. Editorial changes begin in the editorial workflow, receive approval, and are then promoted to the repository.

### 5.4 Production Website

The production website is a published output, not an authoring source. Corrections made directly in a hosting interface or generated output must be brought back through the appropriate editorial or technical source before they are treated as durable.

---

## 6. Document States

Use these states consistently:

| State | Meaning | Eligible for implementation? |
|---|---|---:|
| Blueprint | Scope and sequence proposed; prose not drafted | No |
| Working draft | Incomplete or under research | No |
| Review candidate | Ready for editorial and accuracy review | No |
| Approved | User-approved canonical content | Yes |
| Implemented | Approved content incorporated into a tested repository change | Already implemented; awaiting merge approval |
| Published | Approved implementation deployed to the production site | Already published |
| Superseded | Retained for history but no longer authoritative | No |

Technical prototypes may use clearly labeled placeholder content. Placeholder content must never be mistaken for an approved guide release or published as canonical prose.

---

## 7. Standard Operating Loop

Every content section, specialized reference, calculator, search change, or material site feature follows this loop.

### Step 1: Define the Deliverable

The user and ChatGPT identify:

- The intended reader or technical outcome.
- The governing sources that apply.
- Whether the work is editorial, technical, or cross-domain.
- The approval point before implementation begins.

### Step 2: Produce and Review Editorial Material

ChatGPT follows the production handbook lifecycle:

**Review prerequisites → Blueprint → Research → Outline → Draft → Audit → Approve**

The user explicitly approves material before it is promoted as canonical content.

### Step 3: Prepare the Content Release

ChatGPT prepares the exact approved Markdown or MDX file and a concise release record containing:

- Filename and page identifier.
- Document state: Approved.
- Guide version and last-updated date.
- Applicable governing-source versions.
- Summary of material changes.
- Patch-sensitivity or unresolved uncertainty.
- Required links, visuals, data, components, or interactive elements.
- Permitted mechanical transformations, if any.
- Explicit statement of anything Claude must not infer or alter.
- File encoding and line-ending standard.
- SHA-256 checksum of the validated release file.
- File-integrity and Markdown-validation results.
- Approved transfer method.

The release file must be an actual file artifact produced from the approved source. Rendered chat text, writing-block text, rich-text copies, and reconstructed prose are not release artifacts and must not be used to populate the repository.

### Step 4: Promote the Release to the Repository

The approved file is placed in the repository using its canonical publication path. Its version and metadata must match the approved editorial release.

Unless a later approved technical requirement establishes a different standard, text release files must use UTF-8 without a byte-order mark and LF line endings. Before delivery, ChatGPT must validate the actual file bytes and confirm:

- The file decodes strictly as UTF-8.
- Common mojibake sequences and the Unicode replacement character are absent.
- Markdown tables contain consecutive rows without intervening blank lines.
- Markdown links and images are structurally valid.
- Heading structure, fenced blocks, lists, and other consequential Markdown constructs parse as intended.
- No transport artifact has inserted systematic blank lines, altered punctuation, or changed visible approved wording.

After validation, ChatGPT must calculate the file's SHA-256 checksum and include it in the content release record. The user should transfer the file itself by direct download or another byte-preserving file operation. Copying content from a rendered chat response into an editor is not an approved promotion method.

Before import or transformation, Claude must calculate the repository file's SHA-256 checksum and compare it with the approved release record. A missing or mismatched checksum, invalid encoding, broken Markdown structure, or detected transport corruption is a stop condition. Claude must report the defect and request a corrected release artifact rather than silently repair the approved source. Implementation transformations permitted by Section 8 begin only after transport integrity passes.

The transfer must not create a second independently maintained copy inside the repository. Build-time indexes, generated data, and rendered outputs must be derived from the canonical publication file or approved structured data.

### Step 5: Validate Before Implementation

Before changing code or integrating content, Claude must:

1. Read `CLAUDE.md`.
2. Read this workflow.
3. Read `site-product-specification.md`.
4. Validate the governing files against `project-source-manifest.md`.
5. Confirm the content release is marked Approved and its version matches the handoff.
6. Verify the received file's SHA-256 checksum against the content release record.
7. Run the required encoding and Markdown-integrity checks on the received file.
8. Identify missing, conflicting, stale, or corrupted requirements or artifacts.
9. Stop and report failures before implementation.

### Step 6: Implement and Test

Claude implements the smallest complete change that satisfies the approved release and product specification.

Claude must preserve content meaning and report any unavoidable editorial impact before applying it. The implementation should include the relevant build, schema, search, component, accessibility, responsive, performance, and link checks.

### Step 7: Return an Implementation Report

Claude returns a report containing:

- Source content filename and version implemented.
- Governing-source versions validated.
- Branch or change identifier.
- Files created, changed, moved, or removed.
- Components, schema, or generated data affected.
- Tests and checks run, with results.
- Source checksum verified, with the expected and received SHA-256 values.
- Preview location or screenshots when available.
- Confirmation that approved wording was unchanged, or an exact list of mechanical transformations.
- Editorial findings requiring ChatGPT review.
- Technical deviations or unresolved decisions requiring user approval.
- Deployment or maintenance considerations.

### Step 8: Resolve Findings

- Editorial and factual findings return to ChatGPT.
- Technical findings remain with Claude.
- Cross-domain conflicts go to the user.
- Any material content correction creates a new editorial version and repeats the release process.
- Claude must not patch an approved factual claim or recommendation directly merely to close an implementation finding.

### Step 9: Review, Approve, and Merge

The user reviews the preview, implementation report, tests, and unresolved findings. The user then approves, rejects, or requests revisions.

Only approved changes are merged into the publication branch.

### Step 10: Publish and Record

After publication:

- Confirm the deployed version matches the approved repository state.
- Record material editorial changes in `guide-change-log.md`.
- Record technical decisions in the repository's designated technical record when needed.
- Update the manifest when governing Project Sources change.
- Preserve superseded versions through Library and Git history instead of leaving multiple active copies.

---

## 8. Content Transformation Rules for Claude

### 8.1 Permitted Without Editorial Approval

Claude may perform mechanical transformations that do not change meaning, including:

- Adding or normalizing approved frontmatter and machine-readable metadata.
- Converting approved callout notation into supported site components.
- Correcting internal paths after a file move when visible wording is unchanged.
- Adding stable heading identifiers or generated anchors.
- Applying formatting required by the approved Markdown or MDX renderer.
- Connecting existing approved labels to glossary definitions.
- Registering approved aliases, abbreviations, and misspellings in search data.
- Extracting approved structured values into typed data when the rendered meaning remains identical.
- Fixing code-formatting or escaping problems that do not alter visible prose.

Every transformation must be traceable and reproducible. Prefer build logic or reusable components over manual repetition.

### 8.2 Requires Editorial Approval

Claude must report and wait before:

- Rewriting, shortening, expanding, or reorganizing guide prose.
- Changing a factual claim, recommendation, warning, example, fit, skill plan, price band, or conclusion.
- Adding EVE knowledge from memory or external research to fill a gap.
- Removing content because it is difficult to implement.
- Changing heading meaning or instructional sequence.
- Introducing new reader-facing terminology.
- Creating a duplicate explanation for search, navigation, a landing page, or a tool.
- Changing Alpha/Omega, risk, cost, patch-sensitivity, or multiboxing guidance.
- Publishing placeholder or AI-generated prose as approved content.

### 8.3 Typographical Errors

Claude may identify an obvious typographical error, but should report it as an editorial finding unless an approved repository rule explicitly permits bounded typo corrections. Factual names, interface labels, capitalization, numbers, and EVE terminology must never be assumed to be typographical errors.

---

## 9. Editorial Findings Protocol

Claude should record each editorial finding with:

- A unique finding identifier.
- File and heading or page identifier.
- Finding type: factual, contradictory, missing, ambiguous, duplicated, inaccessible, schema-related, or implementation-blocking.
- The exact affected passage or metadata field.
- Why it matters to the reader or implementation.
- A proposed question or resolution, clearly labeled as a proposal rather than approved text.
- Whether implementation can continue safely without the answer.

ChatGPT reviews the finding against current sources and governing rules, proposes the editorial correction, and obtains user approval when the change is material. The corrected content is released as a new version.

Implementation reports and issue trackers are communication records, not alternate content sources.

---

## 10. Repository Workflow

### 10.1 Branches and Changes

- Protect the publication branch from unreviewed direct changes.
- Use a focused branch for each material feature, section integration, or maintenance change.
- Keep unrelated changes separate.
- Do not combine a broad editorial rewrite with an unrelated technical refactor.
- Preserve user-authored or unrelated repository changes.

Recommended branch patterns include:

```text
feature/site-foundation
feature/search
feature/account-value-advisor
content/section-01-v1.0
fix/accessibility-navigation
maintenance/dependency-update
```

### 10.2 Commit and Pull-Request Information

Material changes should identify:

- The outcome delivered.
- The approved source version implemented.
- Governing requirements satisfied.
- Tests performed.
- Known limitations or follow-up decisions.
- Whether reader-facing wording changed.

### 10.3 Generated Files

Generated indexes, search data, navigation structures, feeds, and other build outputs must be reproducible from canonical content or approved data. Do not edit generated files as the primary means of changing published meaning.

### 10.4 Governance Files in the Repository

Repository copies of governing files are read-only inputs for Claude. They should be excluded from public search and publication unless a file is intentionally reader-facing.

Claude may propose governance changes but must not silently modify governance files as part of a coding task.

---

## 11. Version and Manifest Control

### 11.1 Governing Files

When an approved governing file changes, follow the maintenance rule in `project-source-manifest.md`:

1. Update the file's embedded version or marker.
2. Record the material change in `guide-change-log.md`.
3. Update affected cross-references.
4. Update the manifest last so it describes the completed source set.
5. Refresh the corresponding ChatGPT Project Source.
6. Synchronize the approved repository copy before Claude begins dependent work.

### 11.2 Content Files

Every approved content release must use its stable canonical filename and current guide version. Do not create filenames such as `final`, `final-new`, `latest`, or `revised-copy`.

### 11.3 Version Mismatch

If ChatGPT, the Library, a Project Source, the repository, or an implementation report shows a different expected version:

- Stop dependent work.
- Identify every version present and its location.
- Use the manifest and approval history to determine the expected version.
- Do not merge content from different versions by intuition.
- Ask the user when the authoritative version cannot be established.

---

## 12. Product and Scope Control

The approved site product specification governs the implemented destination. Claude must not expand the site into a materially different product without approval.

Examples requiring approval include:

- Adding accounts, login, ESI integration, personalized storage, or a backend.
- Adding calculators or interactive tools beyond the approved set.
- Turning the guide into a real-time gameplay companion or troubleshooting system.
- Adding progress tracking, gates, tests, scoring, certification, or reader shaming.
- Splitting canonical major sections into many publication pages.
- Duplicating content for alternate homepage paths or audiences.
- Replacing the approved search, navigation, accessibility, localization, or content-schema approach.
- Introducing a new framework, hosting model, database, or content-management system.

Claude may recommend a deviation, but the recommendation must state the reader benefit, technical cost, maintenance burden, migration impact, and affected governance files.

---

## 13. Quality Gates Before Merge

Claude must run the relevant available checks and report their actual results. At minimum, a material change should consider:

- Successful dependency installation and production build.
- Schema and frontmatter validation.
- Internal-link and heading-anchor validation.
- Search indexing and heading-level result behavior.
- Calculator logic and boundary tests when applicable.
- Keyboard navigation and visible focus.
- Semantic heading structure.
- Color contrast and non-color communication.
- Desktop-primary layout and responsive mobile behavior.
- Accessible labels, tables, callouts, images, and interactive controls.
- No unintended publication or indexing of governance files.
- No duplicated canonical content.
- No unapproved reader-facing wording changes.

A failed or unavailable check must be reported. It must not be described as passed.

---

## 14. Stop Conditions

ChatGPT or Claude must stop the affected work and request direction when:

- A required governing source is missing or stale.
- The manifest audit fails.
- A release file is missing its required checksum, does not match its approved checksum, or fails encoding or Markdown-integrity validation.
- The site product specification is unavailable for a material technical decision.
- Content is not explicitly approved for publication.
- Two apparently current canonical versions exist.
- A requested change conflicts with a higher governing source.
- Implementation requires a material editorial rewrite.
- Editorial intent requires a material product or architecture deviation.
- A factual or patch-sensitive gap would require Claude to invent EVE guidance.
- A destructive repository or publication action is outside the user's clear authorization.
- Tests expose a risk that cannot be corrected within the approved scope.
- The responsible authority cannot be determined.

Stopping one blocked part does not prevent safe, independent work from continuing elsewhere.

---

## 15. Standard Handoff Records

### 15.1 ChatGPT Content Release

```markdown
# Content Release

- Deliverable:
- Canonical filename:
- Page identifier:
- State: Approved
- Guide version:
- Last updated:
- Governing-source versions:
- Material changes:
- Patch-sensitive items:
- Encoding and line endings: UTF-8 without BOM; LF
- SHA-256:
- File-integrity and Markdown-validation results:
- Approved transfer method: Direct file transfer; no rendered-text copy/paste
- Required components or structured data:
- Permitted mechanical transformations:
- Unresolved items:
- Explicit restrictions:
- User approval reference:
```

### 15.2 Claude Implementation Report

```markdown
# Implementation Report

- Deliverable:
- Source filename and version:
- Governing-source versions validated:
- Branch or change identifier:
- Files changed:
- Components or schema affected:
- Tests and checks run:
- Expected source SHA-256:
- Received source SHA-256:
- Source integrity verified: Yes / No
- Preview evidence:
- Mechanical content transformations:
- Reader-facing wording changed: No / Yes, with exact details
- Editorial findings:
- Technical deviations requiring approval:
- Known limitations:
- Deployment or maintenance notes:
```

These records may be included in a pull request, issue, or designated handoff file. Do not create multiple permanent records containing conflicting status.

---

## 16. Initial Repository Adoption Checklist

Before Claude begins the site foundation:

- [ ] Add the approved `site-product-specification.md` to the governing source set and repository.
- [ ] Add this file to `project-source-manifest.md` and increase the manifest version.
- [ ] Record adoption of the cross-tool workflow in `guide-change-log.md`.
- [ ] Refresh the affected ChatGPT Project Sources.
- [ ] Create or finalize repository `CLAUDE.md` and make it reference this workflow.
- [ ] Place approved governance copies under the repository's designated governance directory.
- [ ] Exclude governance files from the public site and search index.
- [ ] Establish the canonical content publication directory.
- [ ] Establish the approved machine-readable page schema.
- [ ] Protect the publication branch or require an equivalent review step.
- [ ] Have Claude run and report the first manifest audit before implementation.

---

## 17. Maintenance Rule

Update this workflow only when ownership, approval, handoff, repository interaction, or cross-tool governance changes materially.

Do not place editorial style, EVE facts, page structures, detailed component behavior, or framework configuration here when those rules already have a canonical home.

When this workflow changes:

1. Increase its version.
2. Record the decision in `guide-change-log.md`.
3. Update `project-source-manifest.md` last.
4. Refresh the ChatGPT Project Source.
5. Synchronize the repository copy.
6. Confirm that `CLAUDE.md` still references the correct path and version.

---

*This workflow governs how approved editorial work becomes a tested, reviewable, and publishable technical implementation. It does not transfer editorial authority to Claude or technical implementation authority to ChatGPT.*
