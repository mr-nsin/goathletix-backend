---
id: GA-023
type: task
status: done
priority: P2
owner: ingestion-scripts
branch: codex/ga-023-python-requirements
worktree: D:\project\goathletix-wt\be-ga-023-python-requirements
scope: [goathletix-backend/scripts/requirements.txt, goathletix-backend/scripts/README.md]
acceptance: []
depends_on: []
related: [GA-009]
---

# GA-023 Pinned `requirements.txt` for the Python scripts

## Goal

`CLAUDE.md` §8: there is no dependency manifest for `scripts/` and `scratch/`; the real imports are `bs4`,
`psycopg2`, `playwright` plus the standard library. Create a pinned manifest so a fresh machine can run
the scripts, and document the run commands.

## Scope and ownership

- Owned files: new `scripts/requirements.txt`, new `scripts/README.md`.
- Explicitly out of scope: editing any `.py` file, `src/**`, `package.json`, running any script that
  writes to the database (`generate_*`, `crawler`, `test_db_write`), installing packages globally.
- Coordination: none.

## Acceptance criteria

- [ ] Every third-party import found by scanning `scripts/*.py` and `scratch/**/*.py` (with `grep`, not
      guessing) is listed, each pinned to a version taken from what is actually installed
      (`python -m pip show <pkg>`); anything not installed is listed unpinned with a comment saying why.
- [ ] `psycopg2` vs `psycopg2-binary` is decided from what is installed and the choice is commented.
- [ ] `scripts/README.md` lists each script, what it does, whether it **writes** to the database, and
      the env var names it needs (names only, never values; `db_utils.connect()` is the only sanctioned
      connection).
- [ ] Verified with `python -I -c "import bs4, psycopg2"` (and playwright if installed); results recorded.

## Implementation notes

Run Python with `-I` when reading untrusted input. Do not run any script that connects to the database.
Never open or print `.env`.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| import scan | pass | grep over scripts/*.py and scratch/*.py in the worktree: third-party = psycopg2 (db_utils.py), bs4 (crawler.py, scratch/scrape_text.py), playwright (scratch/layout_analyzer.py); rest stdlib |
| pip list (Python 3.14.6, -I) | partial | psycopg2-binary 2.9.12 installed and pinned; beautifulsoup4 and playwright NOT installed, listed unpinned with comments |
| import check | partial | `python -I -c "import bs4, psycopg2"` fails: ModuleNotFoundError bs4; `import psycopg2` OK (2.9.12); `import playwright` fails (not installed). Not installed by design (no pip install) |
| git status | pass | exactly scripts/requirements.txt and scripts/README.md added |

## Outcome

merged 2026-10-16; beautifulsoup4 and playwright still unpinned until first install.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
