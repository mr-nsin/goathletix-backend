---
id: GA-047
type: task
status: ready
priority: P1
owner: data-schema
branch: codex/ga-047-migration-0026
worktree: D:\project\goathletix-wt\be-ga-047-migration-0026
scope: [goathletix-backend/supabase/migrations/<new 0026 file>, goathletix-backend/prisma/schema.prisma, goathletix-backend/03 Decisions/ADR-009-event-page-fields.md]
acceptance: []
depends_on: [GA-046]
related: [GA-048, GA-049]
---

# GA-047 Draft migration 0026: the event-page fields the database does not have yet

## Goal

`01 Product/Event detail fields by sport.md` (GA-046) lists what organisers publish, marks what already exists (`HAVE`) and what is
missing (`NEW col`, `NEW table`, `JSON`). Write the migration for the missing pieces only. **Do not apply it**: the database is only
reachable through the Supabase dashboard (port 5432 is firewalled); the owner applies it manually. Mirror it in `schema.prisma`.

## What to add (from the GA-046 report; check each against the migrations first and skip anything that already exists)

- `events`: `sport_details jsonb`, `mandatory_gear text[]`, `recommended_gear text[]`, `fitness_requirement text`,
  `changes_allowed_until timestamptz`, `kit_collection_mandatory boolean`, `race_day_collection boolean`, `gpx_url text`,
  `sanction_reference text`, `elevation_gain_m integer`, `edition_number smallint`, `women_safety text[]` (or fold into the
  amenities vocabulary: decide and record in the ADR), `sponsorship_contact text`, `closes_when_sold_out boolean`.
- `event_categories`: `sport_details jsonb`, `is_timed boolean`, `compare_at_price_inr integer`, `excludes text[]`,
  `team_composition text`, `ticket_kind text` (participant, team, spectator, add_on; CHECK constraint), `session_starts_on date`,
  `session_ends_on date`, `deposit_inr integer`, `balance_due_days integer`, `course_map_url text`.
- New tables, each with RLS on and a public-read policy limited to rows whose event is public and published (follow the existing
  policy style in 0022/0023): `event_awards`, `event_checkpoints`, `event_resources` (public documents and links: rules, athlete guide,
  circular, waiver PDF, GPX), `event_offers` (public audience offers, separate from private `coupons`), `event_itinerary_days`.
  Columns as in the research note; foreign keys with ON DELETE CASCADE; indexes on (event_id, sort order).
- A short documented shape (JSON schema in a SQL comment and in the ADR) for `events.sport_details` and
  `event_categories.sport_details` per sport (racquet format and ball, trek itinerary pointer, triathlon legs, fitness divisions,
  combat weight and belt classes, skating skate type and discipline, athletics events and standards).

## Rules (CLAUDE.md section 5)

Hand-written SQL, idempotent (`ADD COLUMN IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS` before `CREATE POLICY`),
wrapped in a transaction, no DROP of data, no TRUNCATE, no unqualified DELETE. File name
`supabase/migrations/<timestamp>_event_page_fields.sql` with the next number after 0025. Mirror every column and table in
`schema.prisma` below the GoAthletix banner with `@map`/`@@map` (snake_case DB, camelCase Prisma); run `npx prisma validate` (and
`npx prisma generate` only if it works offline; record the result). Never `prisma migrate dev`, `db push` or `migrate reset`.
Write `03 Decisions/ADR-009-event-page-fields.md` (status: proposed) from `99 Templates/` if a template exists: the decision, the
alternatives considered (one jsonb blob vs columns vs side tables), and why.

## Acceptance criteria

- [ ] Migration file, idempotent and transactional, covering exactly the missing pieces; RLS on every new table.
- [ ] `schema.prisma` mirrored; `npx prisma validate` passes.
- [ ] ADR-009 proposed.
- [ ] Not applied; the report says so and gives the owner the one-line instruction to apply it in the dashboard SQL editor.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| prisma validate | pass | `npx prisma validate` in the worktree, 2026-10-19: "The schema at prisma\schema.prisma is valid". The phantom block (lines 1-91) is byte-identical to HEAD (md5 checked before and after) |
| prisma format --check | pass on LF content | The CRLF working copy reports "unformatted", but only because of line endings (core.autocrlf=true; HEAD's LF blob passes). The same file converted to LF reports "All files are formatted correctly!". Formatting changed whitespace only, all below the banner |
| prisma generate | not run | node_modules is a junction to the main checkout, so generating would overwrite the main checkout's client with columns the live DB does not have. No enum changed, so DTOs are unaffected |
| npm run build | not run | No src/** change |
| SQL reviewed for idempotency and RLS | pass (static review only, not executed) | One BEGIN/COMMIT. IF NOT EXISTS on every column, table and index. Named constraints wrapped in duplicate_object guards. DROP ... IF EXISTS before all 22 CREATE POLICY and 16 CREATE TRIGGER. 9 new tables with 9 ENABLE ROW LEVEL SECURITY. No DROP TABLE/COLUMN, TRUNCATE, DELETE or ALTER COLUMN. Parentheses and dollar quotes balanced. No Postgres was available here, so the SQL has not been executed anywhere |
| Applied to live DB | **no** | Owner to apply: Supabase dashboard -> SQL editor -> paste all of `20261019000026_event_page_fields.sql` -> Run, then run the commented verification block at the end of the file |
| Scope | extended | The owner extended scope on 2026-10-19 (via the coordinator) to social links, clubs and academies, and gear. The frontmatter `scope`/Goal above still describe events only. The coordinator should update them |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
