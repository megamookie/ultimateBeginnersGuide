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
npm run import     # regenerate publication copies from approved sources
npm run generate   # glossary data + publication copies (runs automatically before build)
```

**Do not hand-edit anything in `src/content/docs/` or `src/data/glossary.generated.json`.**
Both are generated, and `npm run check:generated` fails if they drift. Edit the approved
source, or return an editorial finding.

## Adding an approved section

1. Place the approved file in `content-source/`.
2. Add an entry to `content-import.json` with its frontmatter and any link rewrites.
3. Flip `published` to `true` for that section in `src/data/section-registry.json`.
4. Add vocabulary entries in `src/data/search-vocabulary.json` and acceptance queries in
   `tests/fixtures/search-acceptance.json`.
5. Run `npm run verify`.

Navigation, previous/next links, the table of contents, and the sidebar all derive from the
section registry, so no navigation file needs editing.

## Layout

```text
content-source/          Approved editorial inputs. Never rendered directly.
governance/              Read-only governing files. Never published or indexed.
src/content/docs/        Publication copies (generated) and site pages.
src/components/          Callouts, glossary, navigation, search, page chrome.
src/data/                Section registry, search vocabulary, entry points, generated glossary.
src/lib/                 Navigation, glossary, and search logic — unit-testable, no DOM.
src/plugins/             Build-time rehype transformations.
scripts/                 Import, generation, and verification scripts.
tests/                   Vitest suites and the search acceptance fixture.
```
