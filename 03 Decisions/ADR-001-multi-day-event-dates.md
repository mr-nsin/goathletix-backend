---
id: ADR-001
type: decision
status: accepted
date: 2026-09-09
owners: [human, data-schema]
related: [GA-002, GA-016, GA-017, ADR-003, ADR-004]
tags: [adr, schema]
---

# ADR-001 Keep separate start and end dates for multi-day events

## Context

The live `events` table has a single `event_date` column. `prisma/schema.prisma` and migration
`20260710000003_multiday_events.sql` both declare `start_date` + `end_date`, but **that migration was
never applied** — verified 2026-09-09 by querying the live project over Supabase REST (21 columns, no
`start_date`, no `end_date`). The schema has been ahead of the database ever since, which is the
GA-002 drift.

A decision was required because tournaments and stage races legitimately span multiple days, and a
single date cannot represent them.

## Decision

**Keep `start_date` and `end_date`.** Apply migration `20260710000003_multiday_events.sql` to the live
project, with its backfill, and make `schema.prisma` the source of truth. Reject the alternative of
reverting the schema to one `event_date`.

## Alternatives considered

- **Revert schema + migration to a single `event_date`** — the smallest change and it matches today's
  database, but it cannot represent a multi-day tournament at all. Rejected on product grounds.
- **Keep `event_date` and add a separate `duration_days` integer** — avoids a rename, but every range
  query becomes arithmetic on two columns and no index helps. Rejected.

## Consequences

- Positive: multi-day events become representable; range-overlap search
  (`start_date <= rangeEnd AND end_date >= rangeStart`) becomes possible, which unblocks the date-range
  picker deferred in GA-017 and the calendar work in GA-016. `seed.ts` — which already writes
  `startDate`/`endDate` — becomes correct rather than broken.
- Cost/risk: `events.service.ts` currently queries `event_date` and is correct *only against today's
  database*. The moment the migration lands, that service breaks. **The migration and the service
  change must ship together.** `event_requests` is renamed too, so anything reading that table follows.
- Cost/risk: the migration is **not re-runnable**. `ALTER TABLE IF EXISTS ... RENAME COLUMN event_date
  TO start_date` guards only the table's existence, not the column's, so a second run errors. Check
  before applying.
- **Execution is blocked in this environment.** Postgres 5432 is firewalled here, so neither Prisma
  nor `psql` can reach the database; Supabase REST cannot run DDL. The migration must be applied from
  the Supabase dashboard SQL editor or from an unfiltered network.
- **Prerequisite:** do not apply this via `prisma migrate`. `schema.prisma` still declares 7 phantom
  models that do not exist in the live database, and Prisma would try to create them — see
  [[03 Decisions/ADR-003-phantom-trading-models|ADR-003]]. Apply the hand-written SQL instead, per
  `CLAUDE.md` §5.

## Follow-up tasks

1. Apply the SQL from the Supabase dashboard; confirm `start_date`/`end_date` exist and `end_date` is
   fully backfilled on both `events` and `event_requests`.
2. Update `events.service.ts`: `EVENT_SELECT`, the month/year filters, and the sort — switch to
   range-overlap semantics rather than equality on one column.
3. Add a `date_from`/`date_to` pair to `GetEventsQueryDto` (the global `ValidationPipe({whitelist:true})`
   strips undeclared params, so the DTO change is mandatory).
4. Update `scripts/*.py` and `events_seed.json`, which still emit `event_date`.
5. `normalizeEvent` already tolerates all three shapes — verify, then simplify.
6. Update `CLAUDE.md` §9 and `memory-bank/activeContext.md` once applied.
