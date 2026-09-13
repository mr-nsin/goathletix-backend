---
id: ADR-003
type: decision
status: accepted
date: 2026-09-09
owners: [human, data-schema]
related: [GA-010, ADR-001]
tags: [adr, schema]
---

# ADR-003 Remove the phantom trading-app models from schema.prisma

## Context

`prisma/schema.prisma` declares 7 models that clearly belong to a stock-trading product:
`alembic_version`, `auditlog`, `brokercredential` (with `fyers_app_id`, `fyers_access_token`),
`order`, `user`, `virtualportfolio`, `virtualtrade`. (`spatial_ref_sys` is PostGIS's own table and is
legitimate.) `CLAUDE.md` §5 and GA-010 framed this as "the database is shared with an unrelated
product", and the standing rule never to run `prisma migrate` was justified on that basis.

**That framing was wrong.** Verified 2026-09-09 against the live project over Supabase REST with the
service-role key (which bypasses RLS, so an existing `public` table would return 200):

| Table | HTTP |
| --- | --- |
| `events` | 200 |
| `organizers` | 200 |
| `order` | 404 |
| `brokercredential` | 404 |
| `virtualtrade` | 404 |
| `virtualportfolio` | 404 |
| `auditlog` | 404 |
| `alembic_version` | 404 |

The models declare no `@@schema` and the generator has no `multiSchema` preview feature, so they all
target `public`. They are simply **not in the database**.

## Decision

**There is no shared database.** GoAthletix has its own Supabase project. The trading models are dead
cruft — almost certainly the residue of a `prisma db pull` run against a different database, committed
by accident. **Remove all 7 from `schema.prisma`**, keeping `spatial_ref_sys`.

GA-010 ("should GoAthletix share that database at all") is **closed as based on a false premise**.

## Alternatives considered

- **Leave them in place** — zero effort, but they are actively dangerous: any Prisma-managed migration
  would try to *create* seven tables belonging to another product, and they mislead every reader
  (including this project's own `CLAUDE.md`, which built a rule around them).
- **Move them behind a second Prisma schema** — pointless; there is no second database to point at.

## Consequences

- Positive: the schema stops lying about what the database contains. `CLAUDE.md` §5's warning can be
  re-grounded on the real reason (migrations are hand-written SQL, and the schema is currently ahead
  of the database) rather than on a non-existent tenant.
- Positive: removing them is a **prerequisite** for any Prisma-based migration path, including
  [[03 Decisions/ADR-001-multi-day-event-dates|ADR-001]].
- Cost/risk: the removal must be schema-only. Do **not** generate a migration from it — a diff would
  emit `DROP TABLE` statements for tables that do not exist here but may exist in whichever database
  they were originally pulled from.
- Cost/risk: `npx prisma generate` must be re-run; anything importing those model types breaks
  (expected to be nothing — they are unreferenced in `src/`).
- Still keep the "never `prisma migrate dev` / `migrate reset` / `db push`" rule. The reason changes,
  the rule does not: migrations here are hand-written SQL and the schema is ahead of the database.

## Follow-up tasks

1. Delete the 7 models from `schema.prisma` (everything above the `// GoAthletix Event Discovery Models`
   banner except `spatial_ref_sys`). `data-schema` barrier task — serialise it.
2. `npx prisma validate && npx prisma generate`.
3. Rewrite `CLAUDE.md` §5's first bullet and close GA-010 in `PROGRESS.md` with a pointer here.
4. Investigate separately whether the service-role key in `.env` ever pointed at the trading database
   (relevant to GA-001 key rotation).
