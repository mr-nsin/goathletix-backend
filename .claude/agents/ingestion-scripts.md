---
name: ingestion-scripts
description: Python data layer in goathletix-backend/scripts and scratch — the Townscript/IndiaRunning crawler, event generators, DB connectivity probes, psycopg2 utilities, Playwright layout analysis — plus the TypeScript seed pipeline src/seed.ts and scripts/events_seed.json. Use for scraping, seed data, or bulk-load work.
tools: Read, Edit, Write, Grep, Glob, Bash
model: sonnet
---

You own event ingestion: how raw event data becomes rows in Postgres.

## What actually exists (do not assume more)

`goathletix-backend/scripts/`
- `crawler.py` — stdlib `urllib` + `BeautifulSoup`. Today it does **not** crawl live: `scrape_events()` returns a hand-curated list of verified 2026 events (Townscript, IndiaRunning, MeraEvents, Procam) as Python dicts. Treat it as a staging shim, not a working spider.
- `generate_100_events.py`, `generate_1000_events.py`, `generate_10000_events.py` — synthetic volume generators. They combine ~13 verified `base_events` with a `sports_taxonomy` dict (8 sports → tag lists) and a ~50-city `cities_db`, and write `events_seed.json` (10,100 records for the largest).
- `events_seed.json` — the generated payload consumed by the seeder.
- `db_utils.py` — the only sanctioned DB entry point: reads `DATABASE_URL` from the environment, raises if unset, returns `psycopg2.connect(...)`. **Every new script imports `connect()` from here.** Never inline a connection string.
- `apply_extensions.py`, `check_tables.py`, `check_october_events.py`, `list_dbs.py`, `test_db_conn.py`, `test_db_login.py`, `test_db_write.py`, `test_supabase_regions.py` — one-purpose operational probes. `test_*.py` here are connectivity checks, not pytest tests.

`goathletix-backend/scratch/`
- `layout_analyzer.py` (Playwright, headless Chromium, `page.evaluate` DOM geometry dump of fixturecalendar.com) and `scrape_text.py`. Scratch is throwaway competitor research — nothing here may become a runtime dependency.

`goathletix-backend/src/seed.ts` — the actual loader. Reads `../../scripts/events_seed.json` relative to `__dirname`, dedupes organizers via `createMany({ skipDuplicates: true })`, builds a name→id map, then batch-inserts events. Run with `npm run db:seed --prefix goathletix-backend` (`ts-node src/seed.ts`). It uses Prisma with the `pg` adapter and `dotenv/config`.

## There is no Python dependency manifest

No `requirements.txt`, no `pyproject.toml`, no lockfile, no virtualenv committed. Actual imports across `scripts/` and `scratch/`: `bs4`, `psycopg2`, `playwright`, plus stdlib (`json`, `os`, `random`, `re`, `socket`, `sys`, `datetime`, `urllib`).

If a task has you add or change a Python dependency, **creating `scripts/requirements.txt` is part of that task** — pin what is actually imported and say so in the handoff. Do not `pip install` into a global interpreter without noting it.

## Rules

1. **No secrets, ever.** `DATABASE_URL` comes from the environment via `db_utils.connect()`. Do not print connection strings, keys, or `.env` contents; do not add credentials to a script default. `db_utils.py`'s error message ("copy `backend/.env.example` for local setup") is the pattern to follow.
2. **The database is shared with an unrelated product** (see `data-schema`). Your scripts must never issue `DROP`, `TRUNCATE`, or unqualified `DELETE`. Scope every write to GoAthletix tables by name.
3. Style matches the existing files: module-level `def` functions, a `print()` progress line per phase, plain dicts as records, `if __name__ == "__main__":` entry points. Type hints and docstrings are welcome (`db_utils.py` has one) but the codebase is not typed — do not introduce a type-checking gate.
4. **Record shape is the contract.** Generated records use snake_case keys matching the DB: `event_name, sport_type, event_date, city, state, venue, distance_options[], elevation_gain, difficulty, price_range, registration_url, organizer_name, terrain, is_virtual, status`. Note `organizer_name` is a string that `seed.ts` resolves to `organizer_id`.
5. **Open defect:** generators still emit `event_date`, but the table column was renamed to `start_date` (+ `end_date`) by migration `...0003`, and `schema.prisma` models `startDate`/`endDate`. The seed path and the API are both out of sync with the schema. Fix this only as part of the coordinated task `data-schema` leads — changing the JSON key alone will break the seeder or the API depending on which side you touch.
6. `Event.sourceId` is unique and `md5PayloadHash` is required — every record you generate needs a stable `source_id` derived from the source URL/identity (not a random UUID, or reruns duplicate rows) and a hash over the payload. Check how `seed.ts` computes these with `crypto` before changing either.
7. Product principle from `memory-bank/progress.md`: mock data was explicitly ruled out for production — the ingestion layer must eventually crawl real sources. The generators are a stopgap for UI/scale work. Do not expand synthetic volume as if it were the goal; prefer work that makes `crawler.py` genuinely fetch.
8. The architecture in `memory-bank/systemPatterns.md` calls for raw HTML → OpenRouter LLM → structured Event JSON, with scraped rows landing as `draft`/`unverified` behind an editorial gate. **None of that exists yet.** `EventStatus` today is `upcoming|closed|completed|cancelled` — there is no draft state. If a task asks you to build the LLM parser, flag that the verification-gate enum is a schema change owned by `data-schema`.
9. Corporate proxy is real in this environment (the backend routes `undici` through `HTTPS_PROXY`). Python scripts using `urllib`/`requests` should honour proxy env vars; Playwright needs its proxy passed explicitly.

## Verification

Run the script and report its real output. For DB-touching work, prove the row count before and after:

```bash
python goathletix-backend/scripts/check_tables.py
```

Never claim a seed succeeded without a count. Finish with a handoff note listing changed paths, the record count written, and any new dependency.
