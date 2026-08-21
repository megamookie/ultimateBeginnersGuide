# Ultimate Beginner's Guide to EVE Online — Production Handbook

> **Handbook version:** 1.7  
> **Created:** August 18, 2026  
> **Status:** Governing project source  
> **Applies to:** Every section, reference page, fit, skill plan, example, visual asset, and revision

---

## 1. Purpose

This handbook defines how the *Ultimate Beginner's Guide to EVE Online* is researched, written, reviewed, approved, and maintained.

The guide's mission is to turn an overwhelmed new capsuleer into an **independent, socially connected, economically sustainable, and strategically aware player**. It must work as a progressive beginner-to-veteran guide, reference wiki, and decision guide without pretending that every EVE career shares one endgame.

The guide is not a course, certification program, consumer training curriculum, troubleshooting knowledge base, or substitute for specialist EVE tools. Do not assign tests, required exercises, mastery gates, homework, or pass/fail criteria. Teach through clear explanations, step-by-step procedures, practical examples, preventive warnings, advisory context, concise recaps, purposeful visuals, and links to related topics. Readers may follow the complete sequence or consult individual pages as needed.

Author-side walkthroughs and outside review are encouraged when practical because they can reveal unclear labels, hidden prerequisites, confusing transitions, and preventable mistakes. They are quality-improvement methods, not publication gates, and no page or fit requires formal validation status.

This handbook contains durable production rules. It should prevent each new section or contributor from inventing a different process, format, research standard, or definition of completion.

---

## 2. Governing Sources and Authority

Use the following priority when instructions appear to conflict:

1. The user's current request
2. ChatGPT Project Instructions
3. `ultimate-beginners-guide-master-roadmap.md`
4. `site-product-specification.md` for product, publishing, technical, accessibility, international, and operational requirements
5. This production handbook
6. `multiboxing-content-framework.md` for alt, MCT, account, and multiboxing coverage
7. Approved section files, beginning with `before-you-launch.md`
8. `glossary.md`, `page-template.md`, and the change log
9. Temporary blueprints and research notes
10. External sources

The master roadmap controls the teaching sequence, section outcomes, scope, and prerequisites. The site product specification controls how the destination is built, delivered, searched, accessed, and operated. This handbook controls reader-content production. Approved section files control what the reader has already been taught.

Section 0 is both published guide content and the initial benchmark for tone, explanations, warnings, step-by-step guidance, concise recaps, currency metadata, and navigation.

Do not silently change a governing decision. If a better approach is discovered, identify the proposed change, explain why it is needed, list affected files, and record the approved decision.

---

## 3. Content Architecture

Preserve the roadmap's three-part structure:

- **Sections 0–8 — Universal foundation:** Knowledge every capsuleer needs.
- **Sections 9–13 — Career academies:** Structured career paths readers may take in different orders.
- **Sections 14–17 — Veteran path:** Dangerous-space living, advanced roles, strategy, leadership, and self-directed progression.

Author sections in roadmap order whenever practical. Never teach an advanced procedure before the reader has the required vocabulary, skills, interfaces, assets, or risk knowledge.

Publish one page per major section. Use descriptive major headings, stable heading anchors, the generated **On This Page** list, and search to make long sections easy to navigate. Do not fragment a section into many small publication pages unless the user later approves a material change to this model.

The guide should describe progress in terms of growing capability, judgment, resilience, and independence—not ship size, skill points, account age, wallet balance, scores, tests, or certifications.

### 3.1 Required multiboxing progression

The guide must intentionally develop the reader from single-character fundamentals toward useful alts, specialized characters, multiple Omega accounts, and legal multiboxing. This is a required cross-cutting thread, not a topic deferred until the veteran material.

The editorial progression is:

1. Learn each interface, ship, activity, and risk model with one character.
2. Learn the difference between a character, account, clone state, MCT queue, and simultaneously logged-in client.
3. Identify a specific bottleneck or corporation role before adding a character or account.
4. Build complementary roles for careers such as PI, industry, mining, hauling, scouting, boosting, logistics, and dangerous-space support.
5. Measure net value after account cost, attention, capital, taxes, logistics, expected losses, and burnout risk.
6. Optimize a sustainable multi-character operation as part of established and veteran play.

Single-character play should be presented as the correct learning foundation, but not as the assumed long-term endpoint for readers seeking scalable ISK, corporation usefulness, or broader operational capacity.

---

## 4. File and Source Strategy

### 4.1 Permanent Project Sources

Keep these files available across project chats:

- Master roadmap
- Site product specification
- Production handbook
- Multiboxing content framework
- `glossary.md`
- Change log
- `page-template.md`
- Section 0
- Every later approved section file

These sources form the project's cumulative institutional memory.

### 4.2 Temporary Working Material

Keep the following in the active section chat or working area unless it contains a durable decision:

- Section blueprints awaiting approval
- Research questions
- Raw notes and quotations
- Fit experiments and working variants
- Test logs
- Incomplete drafts
- Alternative outlines

Do not add every working note to shared Project Sources. Excess source material creates duplication, ambiguity, and outdated instructions.

When temporary work produces a durable decision, place that decision in the appropriate permanent file: roadmap, handbook, glossary, change log, or approved section.

### 4.3 Canonical Section Files

During authoring, maintain one canonical Markdown file for each section:

```text
before-you-launch.md
section-01-your-first-session.md
section-02-graduate-from-starter-space.md
...
section-17-the-veteran-capsuleer.md
```

A section remains one publication page. Bounded fit, skill-plan, tool, and reference material may use purpose-designed reference pages when it would otherwise overwhelm the major section, but each recommendation or explanation must still have one canonical home.

Use these document states:

- **Blueprint:** Scope and sequence proposed; no prose draft yet.
- **Working draft:** Content incomplete or still being researched.
- **Review candidate:** Complete enough for accuracy and usability review.
- **Approved:** Canonical source for later sections.
- **Superseded:** Retained only for history; not authoritative.

Only approved section files should be treated as governing Project Sources.

### 4.4 Separate Chats

Use a separate project chat for each major section or distinct deliverable. Examples include section blueprinting, section drafting, accuracy review, glossary maintenance, and site publication.

At the beginning of a new section chat, inspect the Project Instructions, roadmap, handbook, multiboxing content framework, Section 0, prerequisite sections, and relevant reference files before proposing content.

When the deliverable affects page metadata, navigation, search, interactive components, accessibility behavior, worldwide delivery, privacy, deployment, or the public correction experience, inspect `site-product-specification.md` as well.

---

## 5. Section Production Workflow

Use this lifecycle:

**Review prerequisites → Blueprint → Research → Outline → Draft → Audit → Approve → Promote → Maintain**

### Step 1: Review prerequisites

Before planning a section:

- Read its roadmap specification.
- Read every section the reader must have completed first.
- Identify terminology and skills already taught.
- Identify promises, links, or deferred topics pointing into the new section.
- Check the change log for decisions affecting its scope.

### Step 2: Create the section blueprint

The blueprint must define:

- Reader starting state
- Intended reader benefit
- Required knowledge and assets
- Proposed major-heading sequence within the section page
- Concepts and terminology to introduce
- Step-by-step procedures and practical examples
- Common risks, consequential mistakes, and preventive guidance
- Alpha/Omega distinctions
- Applicable alt, same-account MCT, additional-account, and multiboxing progression
- Legal-control, attention, hardware, security, and cost constraints
- Patch-sensitive subjects requiring research
- Currency, maintenance, and optional walkthrough needs
- Required fits, skill plans, tables, approved decision advisors, screenshots, diagrams, maps, charts, decision aids, or reference cards
- Competing coverage already available and the section's distinct contribution
- Visual purpose, source or creation method, accessibility needs, provenance, and update triggers
- Site metadata, search vocabulary, structured-data, or reusable-component needs governed by `site-product-specification.md`
- Coverage boundary, key takeaways, and connection to the next section

Obtain approval before drafting when the scope, structure, or sequence introduces a new decision.

### Step 3: Create a research plan

Convert patch-sensitive outline items into explicit factual questions. For example:

- What does the current interface call this control?
- What restrictions apply to Alpha accounts?
- What skill, ship, module, or standings requirements apply?
- What changed in the most recent relevant patch?
- What risks, exceptions, timers, costs, or limitations must a beginner understand?

Do not begin factual drafting from memory and attempt to add sources afterward. Research first.

### Step 4: Walk through the procedures and reader journey when practical

Walk through beginner procedures on a fresh or low-skill character whenever practical. Capture exact labels, prerequisites, confusing transitions, and preventable mistakes when doing so. A direct walkthrough is encouraged but is not required for publication.

An optional author-side walkthrough should consider:

- Can the intended reader actually perform every step?
- Does the UI use the terminology in the draft?
- Does the reader own or understand every required item?
- What happens if the reader skips a step, loses a ship, lacks ISK, or closes the wrong window?
- Does the procedure differ for Alpha and Omega accounts?
- If multiboxing is applicable, can every client be operated independently and can the procedure be followed without prohibited automation or input duplication?
- Does the proposed role combination remain understandable, usable, and economically defensible at the stated client count?

Never claim that a walkthrough, test, or outside review occurred when it did not. No formal tested/untested label is required.

### Step 5: Draft in dependency order

Write the central mental model before the detailed procedure. Define terms before using them. Put essential actions before optimizations and advanced exceptions.

Every recommendation must explain its purpose, assumptions, compromises, and conditions for choosing something else. Draft in information layers: orientation, mental model, procedure or application, preventive warnings and advisory context, key takeaways, then deeper references.

### Step 6: Audit and review

Complete the quality checks in Section 16. Correct factual, structural, and accessibility problems before requesting approval.

### Step 7: Approve and promote

After approval:

- Assign the correct version and last-updated date.
- Record material changes.
- Add the canonical file to Project Sources.
- Treat it as prerequisite knowledge for later sections.
- Update roadmap status and cross-links when applicable.

---

## 6. Mandatory Current Research

Perform current web research before writing, revising, or approving information that may have changed.

Patch-sensitive subjects include:

- Game mechanics and UI procedures
- Ships, modules, ammunition, drones, implants, structures, and attributes
- Skill names, prerequisites, bonuses, training requirements, and skill plans
- Alpha/Omega capabilities and restrictions
- Character and account limits, Multiple Character Training, concurrent-client rules, launcher behavior, and character transfers
- Multiboxing policy, input broadcasting, automation, botting, account sharing, and permitted third-party tools
- Fits, fitting resources, capacitor, tank, range, and damage application
- Missions, sites, anomalies, escalations, events, triggers, and rewards
- Markets, prices, taxes, fees, industry costs, and income estimates
- Crimewatch, aggression, CONCORD, wars, security, sovereignty, and structures
- Exploration, wormholes, filaments, travel, and navigation
- Third-party tools, corporation services, external links, and ESI behavior
- Expansion, patch, balance, and economy changes

Purely editorial work may skip new research only when it changes no factual claims.

### Research Procedure

1. Identify the claim or question.
2. Search current sources.
3. Open and inspect the actual pages; never rely only on search snippets.
4. Check dates, applicable patches, server context, and scope.
5. Compare multiple sources when the issue is complex, disputed, or consequential.
6. Prefer current Tranquility behavior over older descriptions.
7. Cite the source near the claim it supports.
8. Record the research or update date when it helps readers judge currency.
9. Label unresolved uncertainty.

If reliable sources conflict, do not guess. Explain the disagreement, prefer the strongest current evidence, and state what remains uncertain.

### Source Hierarchy

Use sources in this order:

1. Official CCP patch notes, expansion notes, and announcements
2. Official EVE Online Support documentation
3. Official EVE Developer and ESI documentation
4. Current in-game behavior observed on Tranquility
5. EVE University Wiki
6. Reputable specialist databases, tools, and established community guides
7. Corporation or alliance documentation
8. Forums, Reddit, videos, streams, and anecdotes

Use community sources for context, examples, alternative approaches, and warnings. Do not use anecdotal evidence as the sole authority for an exact mechanic when official or directly testable evidence exists.

---

## 7. Citations, Currency, and Links

Every page containing current factual claims must include:

- `Last updated: YYYY-MM-DD`
- Guide version
- Alpha/Omega applicability
- Relevant patch or expansion when useful
- Citations or links close to important claims
- An `External Resources and Sources` section
- A note for anything uncertain or especially volatile

Link directly to the page supporting the claim, not to a search-results page or generic homepage when a specific page exists.

Use sources to support facts, not to replace explanation. Avoid long quotations; paraphrase accurately and link the source.

Check links before approval. Do not recommend obsolete, abandoned, unavailable, or insecure tools.

Use the last-updated date to indicate the latest material content change. A spelling or formatting edit does not justify a new content-update date.

---

## 8. Standard Page Design

`page-template.md` is the single canonical page template. Do not maintain a competing template in this handbook or in individual section blueprints.

Published pages must use the machine-readable metadata model governed by `site-product-specification.md` and expressed through `page-template.md`. Generate the visible orientation block, navigation, indexes, and **On This Page** list from canonical metadata or headings where practical; do not maintain duplicate body data merely for presentation.

The template distinguishes required elements from optional elements. Use the normal teaching order—orientation, prerequisites, terminology, mental model, procedure or application, preventive warnings and decision guidance, recap, and navigation—while omitting headings that would be empty or artificial. A justified variation must preserve the reader outcome, prerequisites, material risks, currency metadata, and next-step navigation.

Each substantial guide page begins with a compact orientation block showing the intended outcome, prerequisites, Alpha/Omega applicability, estimated reading time, estimated in-game time when relevant, approximate cost when relevant, and risk level. Specialized fit, skill-plan, and advisor references use purpose-designed layouts governed below rather than forcing irrelevant instructional headings.

Guided activities and self-checks may be offered when they help a reader apply the material. They must be optional, practical, and non-graded. Do not describe them as homework, tests, certification, pass/fail gates, or mandatory mastery requirements.

The required page questions, approved callout vocabulary, metadata block, optional elements, and completion check are maintained only in `page-template.md`.

---

## 9. Editorial Style

Write as a patient veteran teaching a genuine beginner.

Use:

- Plain English and short paragraphs
- Descriptive headings and numbered procedures
- Tables for exact comparisons
- Concrete, inexpensive beginner examples
- Explicit reasons behind actions and recommendations
- Practical warnings paired with prevention or a clear next decision
- Encouragement grounded in achievable actions

Avoid:

- Unexplained jargon or veteran shorthand
- Empty motivational filler
- Pretending every reader needs the same number of accounts or the same multibox roles
- Presenting preferences or meta choices as universal facts
- Promising guaranteed safety, income, or success
- Assuming corporation, alliance, or doctrine membership
- Overloading the reader with rare exceptions before teaching the central rule
- Equating bigger ships, more SP, or more ISK with competence

Clearly distinguish verified fact, general recommendation, situational recommendation, personal preference, and organization doctrine.

Introduce the simplest accurate mental model first. Add nuance after the reader understands the core rule. Teach readers how to make decisions rather than merely copying instructions.

The guide may take a clear editorial position. Its position on multiboxing is that one-character play is the learning foundation, while multi-character and multi-account play is a major long-term source of economic scale, corporation value, logistical independence, and access to EVE's broader operational capacity. State that position openly, then disclose costs, constraints, and situations where adding another account would be premature or unprofitable.

---

## 10. Terminology and Navigation

Define every EVE-specific term at first use. Use the approved glossary definition thereafter rather than creating competing explanations.

When introducing a term:

- Bold it on first use when helpful.
- Give a plain-language definition.
- Explain why the reader needs it now.
- Link to the glossary when available.

Every instructional page must link backward to prerequisite material and forward to the next logical step. Add related links only when they help the reader make a decision or access useful depth.

Do not make readers follow a link to understand the main procedure. The page should remain usable on its own while links provide depth.

Use this site-navigation model:

- Make **Begin the Complete Guided Path** the homepage's primary action.
- Offer secondary homepage paths for Alpha readers, returning players, career selection, and alts or multiboxing. Each path links into canonical guide content; never create a duplicate version of the guide. Do not offer an urgent-recovery path.
- Group global navigation as **Foundation**, **Career Academies**, and **Veteran Path**, expanding only the current group.
- Provide a sticky desktop **On This Page** sidebar generated from major headings only. Follow the WCAG 2.2 AA, responsive, keyboard, focus, and progressive-enhancement requirements in `site-product-specification.md`; do not turn routine mobile choices into separate editorial decisions.
- Use previous and next links through Sections 0–7. Section 8 leads to career selection. Career Academies link back to career selection and forward to Section 14. Sections 14–17 resume previous and next navigation. Specialized references return to their parent topic.
- Do not gate pages, shame readers for skipping prerequisites, or implement progress tracking.
- Make search prominent in the header on every page. Support type-ahead results plus a complete results page, index major headings, link directly to heading anchors, and recognize plain-language synonyms, EVE terminology, abbreviations, alternate names, common misspellings, and glossary terms.
- Show glossary definitions on hover, keyboard focus, tap, or activation and link to the full glossary.

---

## 11. Fits and Skill Plans

Every recommended fit must state:

- Intended purpose and suitable content
- Important limitations and likely failure conditions
- Alpha/Omega status
- Minimum and recommended skills
- Broad replacement-cost level and its defined ISK range
- Tank type and expected incoming damage
- Weapon or utility role and engagement range
- Capacitor behavior
- Escape or disengagement plan
- Upgrade path
- Whether corporation doctrine should override the fit
- Its role in a multibox composition when the fit is intended to complement other clients
- An **If This Doesn't Fit** section explaining common skill-related fitting problems and safe adjustment principles
- A short link to the central **Using Pyfa to Test and Adapt Fits** guide

Treat fits as recommended starting points, not guarantees that they will fit every character. Do not require formal validation, direct testing, independent review, or validation-status labels. Explain each important module's function and the fit's compromises. Readers should use Pyfa with their character skills to diagnose CPU, powergrid, capacitor, and performance differences.

Group related variants on one page. Lead with one clearly identified default fit, then provide a compact comparison table linking to full-width fit sections lower on the page. Keep the default fit expanded and variants collapsed until selected. Every complete fit section must provide an import-ready block with a **Copy Fit** action plus a concise plain-language explanation.

List **Minimum Required Skills** separately from **Recommended Supporting Skills**. Show only the few performance metrics that explain the fit's purpose, and note that results vary by skills. Use these broad cost levels for the complete fitted ship, including hull, modules, rigs, typical drones, ammunition, and required cargo:

| Cost level | Approximate total |
|---|---:|
| Very low | Under 10 million ISK |
| Low | 10–50 million ISK |
| Moderate | 50–250 million ISK |
| High | 250 million–1 billion ISK |
| Very high | 1–5 billion ISK |
| Major investment | Over 5 billion ISK |

List implant costs separately when implants materially affect the activity or recommendation, including mining fits.

Skill plans must:

- Prioritize immediate capability before long specialization
- Explain what each skill group unlocks
- Separate requirements from useful improvements
- Avoid unnecessary level-V recommendations
- Identify Alpha restrictions
- Offer logical stopping points
- Train toward a functional fit or activity, not merely a hull
- Avoid telling readers to wait for training before participating
- Identify the intended character and account role
- State whether the plan assumes a main queue, same-account MCT, or a separate Omega account
- Show useful stopping points for short MCT periods and minimum viable multibox roles
- Use one cumulative plan with capability milestones rather than duplicating short, medium, and long plans
- Provide **Copy Entire Plan** and **Copy This Milestone** actions
- Include current instructions in Section 3 for copying, importing, naming, saving, and tracking a plan in EVE; other pages link to that canonical procedure
- Use broad time estimates in the guide and direct readers to the imported in-game plan for character-specific timing
- Group skills by function and call out unusual, expensive, or level-V requirements individually
- Explain **Why train this to V?** for every level-V recommendation and classify it as a hard prerequisite, meaningful upgrade, or deferable optimization
- Optimize for playability: train useful skills to III or IV, interleave support skills, delay most level-V training, and teach readers to play while training
- Describe each milestone conditionally as **What This Milestone Enables**, based on the guide progression and linked fit or activity rather than assumed knowledge of the visitor's actual skills
- Distinguish **Unlocked**, **Ready to Begin**, and **Advanced Performance** when those states differ
- Use one core plan with Alpha, Omega, main-character support, specialized-alt, and multibox branches; create a separate plan only when the training order materially differs

---

## 12. Economy, Prices, and Income

Treat economic figures as volatile.

Whenever presenting costs or income:

- Include the date checked.
- Identify the market, region, or location when relevant.
- State whether the figure is an estimate, example, observed result, or live lookup.
- Explain skill, ship, setup, travel, tax, loss, and market assumptions.
- Prefer honest ranges over false precision.
- Separate revenue from profit.
- Include replacement risk and opportunity cost.
- Never guarantee ISK per hour.

Whenever recommending an additional character, MCT period, or Omega account, use this economic model in the supporting analysis:

> **Incremental net value = additional revenue − Omega or MCT cost − taxes and fees − hauling and fuel − expected losses − capital opportunity cost**

Also report attention demand and evaluate ISK per active hour, ISK per attention hour, ISK per account-month, break-even time, capital at risk, and operational complexity. Do not treat theoretical yield, installed job count, or colony count as profit.

Recommend sustainable replacement budgets rather than maximum theoretical earning or spending.

Keep highly volatile fits, prices, statistics, and income tables separate from stable narrative when practical so they can be updated without rewriting many pages.

### Approved decision advisors

Build only two guide-native decision tools unless the user later approves another:

1. **Can I Afford to Undock This?** Use full fitted-ship cost, desired replacement count, and operating capital. Give non-shaming advisory results such as comfortable, manageable but risky, fragile, or unable to replace readily. Keep insurance and reimbursement out of the calculation; explain insurance separately only where it materially helps the gameplay decision.
2. **Character and Account Value Advisor.** Compare continuing the current character, adding a same-account character, using temporary MCT, adding a separate Omega account, and using corporation services or another player. Ask first whether roles must operate simultaneously, then consider primary goal, frequency or duration, attention compatibility, readiness, affordability, and only the financial depth relevant to the reader's goal.

The Character and Account Value Advisor returns one primary recommendation and one alternative. Explain why the recommendation fits, what it **unlocks**, **improves**, or merely **adds convenience**, its costs and commitments, attention and enjoyment impact, main drawback, qualitative **Fun Value**, what could change the recommendation, and the next guide step. Present economic, operational, and personal value separately; never collapse them into a fabricated score. Use descriptive input help, no login or ESI, and no claim to know the reader's actual skills.

Do not create a generic calculator section or compete with Pyfa, Fuzzwork, Janice, EVE Tycoon, or other specialist tools. Use checklists, worksheets, worked examples, decision trees, or direct specialist links for deeper calculations.

Before implementing either guide-native advisor, create and approve `interactive-tools-specification.md` as required by `site-product-specification.md`. It must define exact inputs, help text, validation, rules, calculations, result precedence, edge cases, disclosures, accessibility behavior, privacy behavior, and expected test scenarios without expanding the approved tool count.

---

## 13. Risk, Loss, and Resilience

Teach that ship loss is normal without dismissing avoidable frustration.

For dangerous activities, explain:

- What can be lost
- How the threat works
- Warning signs
- Risk-reduction methods
- Escape options
- Sensible financial reserves
- Recovery steps
- What lesson to extract from failure

This is proactive gameplay teaching, not a troubleshooting system. Do not create troubleshooting pages, symptom indexes, diagnostic templates, real-time emergency instructions, or recurring support blocks. Technical edge cases can be researched elsewhere. The guide should prevent foreseeable confusion through complete prerequisites, accurate procedures, clear fits and skill milestones, warnings before consequential decisions, and links to specialist tools.

Explain “never fly what you cannot afford to lose” in practical terms: the reader should retain enough ISK, ships, and access to continue their chosen activity after an ordinary loss.

Never describe highsec, lowsec, nullsec, wormhole space, Pochven, or a protected starter environment with language that creates a false guarantee of safety.

---

## 14. Alpha and Omega Accessibility

Label account-state requirements wherever they affect a procedure, skill, fit, ship, module, activity, or income path.

Whenever an Omega recommendation appears, provide an Alpha-accessible starting alternative when one reasonably exists. If no useful Alpha alternative exists, explain the limitation plainly. The guide should also identify the point at which Omega or additional Omega accounts materially unlock the stated career goal rather than concealing that value behind generic free-to-play reassurance.

Do not describe Omega as automatic competence or Alpha as useless. Connect upgrading and adding accounts to specific capabilities, career bottlenecks, corporation roles, or economic opportunities.

---

## 15. Alts, MCT, and Multiboxing Standards

Every section blueprint must explicitly mark multiboxing coverage as **foundational**, **applicable**, **advanced**, or **not materially relevant**. Silence is not sufficient.

### Required distinctions

Use the definitions in `glossary.md`. Never use *alt*, *account*, *character*, *MCT*, and *client* as interchangeable terms. Make these operational distinctions explicit where relevant:

- Multiple Character Training enables additional simultaneous training queues; it does not permit same-account characters to log in together.
- A separate Omega account is required when two characters must be logged in simultaneously.
- Clone-state and concurrent-client restrictions must be verified against current official documentation.
- Manual multiboxing requires the player to control each client independently.

### Required role and account decision

For every multibox recommendation, identify:

1. The bottleneck being removed.
2. The role performed by each character.
3. Whether each role belongs on the same account or a separate Omega account.
4. Minimum and recommended skills, ships, assets, and training time.
5. Whether temporary MCT, ongoing MCT, or independent training queues are appropriate.
6. Startup capital, recurring account cost, expected incremental value, and break-even assumptions.
7. Attention demand, failure modes, recovery, and diminishing returns.
8. Corporation or alliance services that may change the recommendation.

### Legal and security boundaries

Multiboxing material must:

- Require independent manual control of every active client.
- Prohibit input broadcasting or duplication, botting, macros that automate gameplay, and account sharing.
- Distinguish permitted window or launcher organization from prohibited gameplay automation.
- Use current official sources for rules claims and display a last-updated date.
- Teach unique credentials, two-factor authentication, approved EVE SSO, permission review, and account-recovery hygiene.

### Required visuals

Use visuals when they materially reduce confusion. The multiboxing progression should eventually include:

- Account–character–training topology
- MCT-versus-additional-Omega decision tree
- Legal manual-control boundary
- Role and skill matrix
- Break-even and diminishing-returns chart
- PI and industrial supply-chain diagrams
- Mining fleet layouts at increasing client counts
- Attention and bottleneck map
- Account, wallet, asset, and ESI-permission organization diagram

---

## 16. Quality Assurance

### Accuracy Audit

- [ ] Patch-sensitive claims were researched using current sources.
- [ ] Exact mechanics are supported by current authoritative evidence.
- [ ] Conflicting evidence is disclosed rather than guessed through.
- [ ] Alpha/Omega differences are accurate and visible.
- [ ] Fits, skills, prices, and rewards include assumptions and dates.
- [ ] Every cited link opens and supports the associated claim.
- [ ] The last-updated date reflects a material content change.
- [ ] Current MCT, clone-state, concurrent-client, automation, input-broadcasting, and account-sharing rules are supported by current official documentation when applicable.

### Beginner Journey Audit

- [ ] The reader's starting state and outcome are explicit.
- [ ] Prerequisites were taught earlier or are linked.
- [ ] Terms are defined before use.
- [ ] Steps use current UI labels and occur in executable order.
- [ ] The reader is told why important actions matter.
- [ ] Consequential beginner mistakes are anticipated with preventive guidance.
- [ ] A practical example or step-by-step procedure is included when useful.
- [ ] The page ends with a concise recap or key takeaways.
- [ ] The next step is clear.

### Multiboxing Progression Audit

- [ ] The section marks multiboxing coverage as foundational, applicable, advanced, or not materially relevant.
- [ ] Applicable alt and multibox roles are integrated into the main explanation rather than isolated in an afterthought.
- [ ] Character, account, MCT, Omega, and active-client assumptions are explicit.
- [ ] The recommendation identifies the bottleneck it removes and its corporation or career value.
- [ ] Net value includes account cost, capital, taxes, logistics, expected losses, and attention.
- [ ] Independent manual control and prohibited methods are stated where misunderstanding is plausible.
- [ ] Required diagrams, decision trees, matrices, and fleet layouts are included or assigned.

### Consistency Audit

- [ ] Content agrees with the roadmap and approved sections.
- [ ] Previously defined terms are used consistently.
- [ ] Repeated explanations are linked or summarized rather than unnecessarily duplicated.
- [ ] Navigation, filenames, headings, and section numbers are consistent.
- [ ] Facts and recommendations are clearly separated.
- [ ] Material changes are recorded.

### Procedure Usability Audit

- [ ] Beginner procedures are written for a fresh or low-skill character.
- [ ] Optional hands-on walkthrough findings are incorporated when available.
- [ ] Hidden prerequisites, confusing transitions, and preventable mistakes were considered.
- [ ] Required assets, ISK, skills, and account state were confirmed.

### Visual Audit

- [ ] Every visual has a defined teaching purpose.
- [ ] The selected format communicates the concept better than prose or a small table.
- [ ] Interface screenshots show current labels and behavior.
- [ ] Annotations direct attention to the relevant element without obscuring it.
- [ ] Diagrams are accurate at the level claimed and label meaningful simplifications.
- [ ] Text remains legible at mobile widths and normal zoom.
- [ ] Meaning does not depend on color alone.
- [ ] Alt text and a useful caption are present.
- [ ] Source, ownership, creation date, relevant game version, and update trigger are recorded.
- [ ] The surrounding text explains what the reader should notice.
- [ ] Exact interfaces, game icons, maps, mechanics, and data were not replaced with generated imagery.

### Site Product Audit

Apply the site-level quality checks in `site-product-specification.md` whenever a page or release affects metadata, search, navigation, interactive components, accessibility behavior, worldwide delivery, privacy, discoverability, corrections, or deployment. Content approval does not by itself prove that the published implementation meets the product standard.

---

## 17. Change Control and Maintenance

When correcting or restructuring content:

1. Identify the reason and supporting evidence.
2. List every affected page, link, definition, example, procedure, fit, visual, and recap.
3. Update the smallest authoritative source rather than creating a competing rule.
4. Preserve useful content that remains correct.
5. Record material changes in the change log.
6. Update the roadmap when sequence, section scope, or outcomes change.
7. Update last-updated dates only for material content changes.

Use these review triggers:

| Content | Review trigger |
|---|---|
| NPE, starter-space, and first-session guidance | Any onboarding expansion or redesign |
| Ships, modules, fits, and skill plans | Relevant balance pass |
| Prices, rewards, taxes, and income estimates | Quarterly or after major economic change |
| Clone states, MCT, concurrent clients, launcher behavior, and multiboxing policy | Any official policy, account-service, launcher, or clone-state change |
| Sovereignty, structures, and capitals | Relevant expansion or major patch |
| Stable concepts and glossary pages | Annual review |
| External links | Monthly automated check |
| Interface screenshots and annotated procedures | Relevant UI or onboarding change |
| Diagrams, maps, charts, and reference cards | Relevant mechanic, balance, data, or branding change |
| Site framework, search, interactive components, dependencies, accessibility, privacy, and deployment | Relevant platform, dependency, security, standards, or product-model change |

Do not silently renumber sections, remove approved outcomes, or introduce contradictions. Mark obsolete material as superseded rather than allowing multiple apparently current versions to circulate.

---

## 18. Definition of Done

A section or page is complete only when it is:

- Accurate and current
- Properly sourced
- Beginner-readable and actionable
- Supported by current sources appropriate to the claim
- Consistent with prerequisite material
- Clear about Alpha/Omega requirements
- Clear about material risks and preventive guidance
- Connected to the wider learning path
- Equipped with realistic examples or step-by-step procedures when useful
- Concluded with a concise recap or key takeaways
- Equipped with purposeful, current, accessible visuals when they materially improve understanding
- Explicit about applicable alt and multiboxing progression
- Compatible with the machine-readable metadata and applicable site product requirements
- Versioned and dated
- Approved as the canonical source

Publication quality means another contributor could maintain the page without relying on the original author's memory.

---

## 19. Reusable Section Prompts

### Begin a Section

> Begin the next roadmap section. First review the Project Instructions, master roadmap, production handbook, site product specification, multiboxing content framework, Section 0, prerequisite sections, glossary, and change log. Do not draft the guide yet. Create a section blueprint defining the reader's starting state, intended benefit, major-heading order, terminology, step-by-step procedures, practical examples, risks, research questions, currency and maintenance needs, competing coverage, visual plan, site metadata or component needs, deliverables, key takeaways, and connection to the next section. Mark the section's multiboxing coverage as foundational, applicable, advanced, or not materially relevant and identify all appropriate alt, MCT, and additional-account integration points. Identify any proposed departure from the roadmap.

### Research and Draft

> Using the approved blueprint, research every patch-sensitive claim and draft the complete canonical section Markdown file. Follow the production handbook and established Section 0 style. Cite current sources, distinguish fact from recommendation, label Alpha/Omega and character/account assumptions, anticipate consequential mistakes with preventive guidance, and integrate applicable multiboxing progression and visuals. Optional hands-on walkthroughs may improve the draft but are not publication gates.

### Review a Section

> Audit this section against the production handbook, site product specification, and multiboxing content framework. Check accuracy, source quality, patch sensitivity, prerequisites, terminology, Alpha/Omega accessibility, character/account assumptions, beginner usability, step-by-step clarity, examples, preventive guidance, visuals, key takeaways, economic assumptions, legal-control boundaries, metadata, search and component needs, navigation, accessibility, and consistency with approved sections. Report findings before making structural changes.

### Approve and Promote

> Apply the approved corrections, complete the quality-assurance checklists, update version and last-updated metadata where justified, summarize material changes, and prepare the canonical Markdown file to become a governing Project Source for later sections.

---

## 20. Competitive Synthesis and Non-Duplication

Treat existing guides as competitive references with different strengths:

- **EVE University Wiki:** Encyclopedic mechanics, established terminology, formulas, tables, specialist references, and coverage checks.
- **Wiki Circa Kismeteer's Guide:** Practical beginner questions, community warnings, opinionated recommendations, and examples of where players commonly become confused.
- **Vladimir Memento's Comprehensive Guide:** Breadth, cultural context, and an omission check across the range of EVE activities.

These sources are not governing authorities and do not outrank current official sources or clearly observed current behavior. Do not copy their prose, page structure, visuals, or unsupported opinions. Research patch-sensitive claims using the strongest current sources available.

Before drafting a section:

1. Identify what these resources already explain well.
2. Identify gaps in sequence, currentness, neutrality, accessibility, visual explanation, or beginner usability.
3. State the new section's distinct contribution.
4. Link to maintained specialist depth instead of duplicating exhaustive tables, catalogs, formulas, or historical archives.
5. Preserve the guide's corporation-neutral perspective and label recommendations, doctrine, opinion, and temporary meta separately from fact.

Maintain one canonical source for every explanation, procedure, fit, skill plan, recommendation, and definition. Homepage paths, recaps, callouts, indexes, and related links point to that source instead of restating it. Short contextual summaries are allowed only when they help the reader decide whether to follow the link.

The project's competitive advantage is not the greatest volume of information. It is a maintained, dependency-ordered, visually taught path from first launch to independent veteran.

---

## 21. Visual Standards and Asset Maintenance

### 21.1 Select visuals by teaching purpose

Use a visual only when it materially improves understanding:

- **Annotated screenshot:** Exact interface location, label, state, or click sequence.
- **Diagram:** Mental model, dependency, hierarchy, flow, sequence, or spatial relationship.
- **Decision tree:** Choice with several conditions or meaningful tradeoffs.
- **Comparison table:** Exact mappings, alternatives, restrictions, or repeated fields.
- **Chart:** Quantitative relationship, trend, range, or tradeoff supported by dated data.
- **Map:** Geography, routes, system relationships, wormhole chains, deployment, or territorial concepts.
- **Reference card:** Frequently needed icons, effects, timers, ranges, warnings, or shortcuts.

Do not add decorative visuals merely to make a page look complete. Prefer prose or a small table when they are clearer.

### 21.2 Screenshot standards

- Capture screenshots from the current Tranquility client at a readable resolution.
- Crop to the smallest context that preserves orientation.
- Show the unmodified interface before presenting optional customization.
- Use numbered callouts or restrained highlights; do not cover the control being explained.
- State the client version or capture date and the UI element that would trigger replacement.
- Avoid embedding sensitive chat, character, corporation, wallet, location, or account information.

### 21.3 Diagram, map, and chart standards

- Prefer maintainable vector or code-native diagrams for durable concepts.
- Use consistent names, icons, colors, line meanings, and direction conventions.
- Label conceptual simplifications and avoid implying scale or precision that is not present.
- Put assumptions, dates, units, and data sources next to charts.
- Never use generated imagery for exact interfaces, maps, game icons, layouts, mechanics, or data visualizations.

### 21.4 Accessibility and presentation

- Do not communicate meaning by color alone.
- Use high contrast, readable type, and labels that survive mobile display.
- Supply concise alt text describing the instructional information, not merely the appearance.
- Use captions to tell the reader what to notice and why it matters.
- Provide a text explanation for every essential visual concept.
- Provide transcripts or equivalent text for required audio or video material.

### 21.5 Provenance, licensing, and maintenance

Record for every visual asset:

- Asset name and page
- Teaching purpose
- Creator and ownership
- Source URL or source file
- License or permission status
- Creation and update dates
- Relevant expansion, patch, UI version, or data date
- Alt text and caption
- Update trigger

Do not copy competitor graphics without permission or a compatible license. Attribute external assets as required. Treat an outdated screenshot, diagram, map, or chart as a factual defect rather than a cosmetic issue.

Store reusable visual assets separately from prose, use stable descriptive filenames, and maintain a visual asset inventory once publication work begins.

---

*This handbook governs production of the Ultimate Beginner's Guide to EVE Online. The roadmap defines what to teach; this handbook defines how to build and maintain it. The multiboxing content framework defines how the required alt and multi-account progression is applied across the guide.*
