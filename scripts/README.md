# scripts/

Python data scripting for event ingestion. Not a service; no tests (test_*.py are connectivity probes).

## Setup

    python -m venv .venv
    pip install -r goathletix-backend/scripts/requirements.txt

Pins were taken from Python 3.14.6. beautifulsoup4 and playwright are unpinned until installed once
(see comments in requirements.txt). Behind the corporate proxy, set HTTPS_PROXY / HTTP_PROXY for pip
and urllib.

## Environment variable names (values never go in this repo)

- DATABASE_URL: required by every script that connects to the database, via db_utils.connect(),
  which raises when it is unset. connect() is the only sanctioned connection path.
- ALLOW_DB_WRITE_TEST: must equal 1 for test_db_write.py to run.
- SUPABASE_PROJECT_REF: required by test_supabase_regions.py.

## Scripts

Run from the repo root as `python goathletix-backend/scripts/<name>.py`.

| Script | What it does | Writes to DB? | Env vars |
| --- | --- | --- | --- |
| db_utils.py | Shared connect() helper, not run directly | No | DATABASE_URL |
| check_tables.py | Lists public tables (SELECT) | No | DATABASE_URL |
| check_october_events.py | Counts October 2026 events per city (SELECT on events.start_date, which only exists after migration 0003) | No | DATABASE_URL |
| list_dbs.py | Lists non-template databases (SELECT) | No | DATABASE_URL |
| test_db_login.py | Runs SELECT 1 | No | DATABASE_URL |
| test_db_conn.py | TCP reachability check of the DATABASE_URL host | No | DATABASE_URL |
| test_supabase_regions.py | DNS resolution of Supabase pooler hosts | No | SUPABASE_PROJECT_REF |
| apply_extensions.py | CREATE EXTENSION IF NOT EXISTS postgis and pgcrypto (DDL, autocommit) | YES (DDL) | DATABASE_URL |
| test_db_write.py | CREATE TABLE then DROP TABLE of public.test_write_table. DANGEROUS: issues DROP; guarded by ALLOW_DB_WRITE_TEST=1 | YES (DDL) | DATABASE_URL, ALLOW_DB_WRITE_TEST |
| crawler.py | Staging shim: returns a hand-curated list of 2026 events, does not crawl live. Writes a JSON file | No (file only) | none |
| generate_100_events.py | Synthetic events, writes events_seed.json | No (file only) | none |
| generate_1000_events.py | Synthetic events, writes events_seed.json | No (file only) | none |
| generate_10000_events.py | Synthetic events (10,100 records), writes events_seed.json | No (file only) | none |

Warnings:

- crawler.py and the three generators hardcode an absolute output path under another developer's
  macOS home directory. They will fail or write to the wrong place on this machine. Not changed here
  (this task does not edit .py files).
- They still emit event_date; the schema expects start_date/end_date (see ADR-001). Generated data is
  test data only; mock data is ruled out for production.
- Database loading is done by `npm run db:seed --prefix goathletix-backend` (src/seed.ts), not Python.
- Port 5432 is firewalled on the corporate network, so DB-connecting scripts will not connect from there.

## scratch/

scratch/ is throwaway competitor research (scrape_text.py uses bs4 and urllib; layout_analyzer.py uses
Playwright). Nothing there may become a runtime dependency.
