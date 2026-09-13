---
id: ADR-004
type: decision
status: accepted
date: 2026-09-09
owners: [human, events-api]
related: [ADR-001, ADR-003, GA-018]
tags: [adr, architecture]
---

# ADR-004 Stay on Supabase REST as the API data path

## Context

Two data paths exist. `EventsService` on `main` uses `@supabase/supabase-js` (REST over HTTPS 443).
The unmerged branch `origin/chore/discovery-portal-and-env-samples` rewrites it to Prisma over the
Postgres wire protocol (5432), filtering on `where.startDate`.

Measured on this network 2026-09-09:

- **Postgres 5432 is firewalled** — connections to the Supabase pooler time out. Prisma cannot reach
  the database at all, and an HTTP proxy cannot tunnel the Postgres protocol.
- **Supabase REST over 443 works, but only through the corporate proxy.** Direct HTTPS returns no
  connection; proxied requests return real status codes. The proxy accepts unauthenticated CONNECT.

So the Prisma rewrite cannot work here for two independent reasons: the port is blocked, and it
queries a `startDate` column that does not exist in the live database.

## Decision

**Keep Supabase REST as the API data path.** Do not adopt the Prisma rewrite. Prisma stays in the
repo for `schema.prisma` (the schema of record) and `src/seed.ts` only.

## Alternatives considered

- **Adopt the Prisma rewrite** — nicer typing and query ergonomics, and it would remove a dependency
  on PostgREST semantics. Rejected: unusable on the network the team actually develops on, and it
  encodes a column that does not exist.
- **Support both behind an interface** — doubles the surface that must be tested and keeps a path that
  cannot run here. Rejected as premature.

## Consequences

- Positive: the working path stays working, and `main.ts`'s `undici` `ProxyAgent` block keeps earning
  its place — Node's native `fetch` (which `@supabase/supabase-js` uses) ignores `HTTPS_PROXY` on its
  own, so that block must stay before bootstrap.
- Cost/risk: PostgREST cannot call PostGIS functions from `.select()`, so the near-me feature needs a
  Postgres function invoked via `.rpc()` rather than a plain query.
- Cost/risk: `src/seed.ts` uses Prisma and therefore **cannot run from this network at all**,
  independent of its type error and its `startDate` writes. Seeding must happen from an unfiltered
  network or be rewritten against REST.
- Cost/risk: RLS gives no protection on the server path, because the service-role key bypasses it.
  Every authorization decision stays the application's job — matters as soon as write endpoints
  (follows, reminders, event requests) are added.
- The branch `origin/chore/discovery-portal-and-env-samples` should not be merged as-is. Its
  genuinely useful parts — `sample.env` files, making the Supabase env vars explicit — can be
  cherry-picked. Note its `frontend/sample.env` says port 4000, which is wrong; the backend listens
  on 3000.

## Follow-up tasks

1. Get `HTTPS_PROXY` into the server process. It cannot come from `.env` as written, because
   `main.ts:6` reads `process.env` at module load, before `ConfigModule` runs. Either export it in
   the launch environment or read a dotenv file before the proxy block.
2. Add `GET /health` that exercises a real Supabase call, so this class of outage is visible.
3. Cherry-pick the `sample.env` files from that branch, correcting the port to 3000.
4. Record in `PROGRESS.md` that the branch is parked, not pending.
