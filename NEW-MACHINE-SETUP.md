# New Machine Setup

Steps to restore development of this project after a computer upgrade or wipe.

## Before wiping the old computer

These files are **not** in GitHub. Back them up manually (USB drive, cloud storage, etc.):

| Item | Notes | Save it? |
|---|---|---|
| `~/.claude/CLAUDE.md` | Global Claude Code instructions | **Yes** |
| `~/EveApps/.claude/settings.local.json` | Claude Code permissions for the EveApps folder | Yes, to keep permission setup |
| `~/EveApps/.gitignore` | Parent-folder ignore rules | Yes |
| `~/EveApps/ammoPlanner/` | **Not a git repository** — nothing is on GitHub | **Yes** |
| `~/EveApps/skillDump/` | **Not a git repository** — nothing is on GitHub | **Yes** |
| `screenshots/` (this repo) | QA screenshots, ignored on purpose; can be regenerated | Optional |
| `node_modules/`, `dist/`, `.astro/` | Rebuilt by `npm install` / `npm run build` | No |

`~/EveApps/industryAdvisor/` is in sync with GitHub. `~/EveApps/scenarioPlanner/` is empty.

## Restoring on the new computer

1. Install prerequisites: Git, Node 20+ (the old machine used Node 24) and npm.
2. Clone and switch to the working branch. Current work is on `feature/site-foundation`,
   **not** `main`:

   ```sh
   mkdir -p ~/EveApps && cd ~/EveApps
   git clone https://github.com/megamookie/ultimateBeginnersGuide.git ultimateBeginnerGuide
   cd ultimateBeginnerGuide
   git checkout feature/site-foundation
   ```

3. Install dependencies, plus the Playwright browser used by the accessibility and preview checks:

   ```sh
   npm install
   npx playwright install chromium
   ```

4. Start the local preview:

   ```sh
   npm run dev       # http://localhost:4321 (no full-text search)
   npm run build && npm run preview   # production build with working search
   ```

5. Confirm everything works:

   ```sh
   npm run verify
   ```

6. Restore the backed-up files from the table above to the same paths.
