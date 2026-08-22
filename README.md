# Ultimate Beginner's Guide to EVE Online

Site implementation for the *Ultimate Beginner's Guide to EVE Online*, built with Astro and
Starlight per `governance/site-product-specification.md` v1.0.

Editorial authority for guide content sits outside this repository. See `CLAUDE.md` and
`governance/project-workflow.md` before changing anything under `content-source/` or
`src/content/docs/`.

## Requirements

Node 20+ and npm. No other package manager is configured.

```sh
npm install
```

## Local preview

```sh
npm run dev       # http://localhost:4321 — fast, but no search index
npm run build     # production build into dist/
npm run preview   # serve dist/ with working search
```

Search is powered by Pagefind, whose index is generated **after** the build. In `npm run dev`
the header search still returns vocabulary-promoted destinations and tells you full-text
search needs a build. Use `npm run build && npm run preview` to exercise real search.

## Verification

```sh
npm run verify           # the full gate: generated data, types, tests, build, links,
                         # governance boundary, search index, accessibility
npm run preview:inspect  # drives a real browser: screenshots, search, glossary, keyboard
```

Individual checks:

| Command | Checks |
| --- | --- |
| `npm run validate:source` | Release-file encoding and Markdown integrity |
| `npm run check:generated` | Generated data and publication copies still match their approved sources |
| `npm run typecheck` | `astro check` |
| `npm test` | Wording preservation, metadata, anchors, navigation, glossary, search vocabulary |
| `npm run check:links` | Internal links and heading anchors; reports deferred destinations |
| `npm run check:governance` | No governance, unapproved content, or secrets in the output or search index |
| `npm run check:search` | Search index generated with heading-level anchors; acceptance queries resolve |
| `npm run check:a11y` | axe-core WCAG 2.2 AA across desktop, tablet, and phone, plus structural checks |

`npm run check:a11y` and `npm run preview:inspect` need a browser binary:

```sh
npx playwright install chromium
```

## Content

Approved content arrives in `content-source/` and is promoted to `src/content/docs/` by
`scripts/import-content.mjs`, driven by `content-import.json`.

```sh
npm run validate:source  # transport integrity only
npm run import           # regenerate publication copies from approved sources
npm run generate         # validate + glossary data + publication copies (runs before build)
```

**Do not hand-edit anything in `src/content/docs/` or `src/data/*.generated.json`.**
All are generated, and `npm run check:generated` fails if they drift. Edit the approved
source, or return an editorial finding.

### Transport integrity

Approved content must arrive as a byte-preserving artifact, never text copied out of a
rendered chat response. Before any transformation runs, the import checks the received bytes
for corruption:

| Check | Rejects |
| --- | --- |
| Encoding | Non-UTF-8, byte-order mark, CRLF, missing trailing newline |
| Mojibake | `â€"`, `â€"`, `â€œ`, `â†'` and similar double-encoded punctuation |
| Replacement characters | U+FFFD, where characters were lost outright |
| Markdown tables | A blank line between table rows, which stops the table parsing |
| Markdown links | Empty, unclosed, or emphasis-corrupted destinations |
| Blank-line insertion | A blank line after every source line |

**Any integrity failure is a stop condition.** The import aborts and reports the defect. It
does not repair approved content — the corrected artifact comes from ChatGPT. Rules live in
`src/lib/content/integrity.ts` and are covered by `tests/content/integrity.test.ts` and
`tests/content/import-gate.test.ts`.

Release-record SHA-256 checksums were removed on August 22, 2026 by user decision. They
verified only when a release record happened to carry one, and a missing checksum then
halted files that were provably clean. Every defect that has actually reached this
repository was caught by the byte checks above, which need no cooperation from the sender.

An entry may carry `awaitingCorrectedRelease` to hold a release whose artifact failed
validation. Its publication copy is frozen, pinned by `publicationSha256`, and not
re-imported until a corrected release arrives. That digest is internal drift detection over
a file this repository already owns, not a release-record checksum.

## Adding an approved section

1. Place the approved file in `content-source/` by direct file transfer, not copy-paste.
2. Add an entry to `content-import.json` including its version marker and any link
   rewrites.
3. Run `npm run validate:source` and resolve any defect with ChatGPT before going further.
4. Flip `published` to `true` for that section in `src/data/section-registry.json`.
5. Add vocabulary entries in `src/data/search-vocabulary.json` and acceptance queries in
   `tests/fixtures/search-acceptance.json`.
6. Run `npm run verify`.

Navigation, previous/next links, the table of contents, and the sidebar all derive from the
section registry, so no navigation file needs editing.

## Layout

```text
content-source/          Approved editorial inputs. Never rendered directly.
governance/              Read-only governing files. Never published or indexed.
src/content/docs/        Publication copies (generated) and site pages.
src/components/          Callouts, glossary, navigation, search, page chrome.
src/data/                Section registry, search vocabulary, entry points, generated glossary.
src/lib/                 Navigation, glossary, search, and content-integrity logic.
src/plugins/             Build-time rehype transformations.
scripts/                 Import, generation, and verification scripts.
tests/                   Vitest suites and the search acceptance fixture.
```
