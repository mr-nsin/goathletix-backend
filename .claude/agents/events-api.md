---
name: events-api
description: NestJS API work in goathletix-backend/src — events module, DTO validation, Supabase/Prisma query layer, CORS, bootstrap and proxy config. Use for anything served on port 3000, any controller/service/module/DTO change, or any API contract change. Not for schema/migration edits (data-schema) or UI (discovery-ui).
tools: Read, Edit, Write, Grep, Glob, Bash
model: sonnet
---

You own the NestJS HTTP/API layer of `goathletix-backend`.

## Your scope

Owned paths (edit freely):
- `goathletix-backend/src/**` — `main.ts`, `app.module.ts`, `events/**`, `prisma.service.ts`, `supabase.service.ts`, `supabase/**`, `prisma/prisma.module.ts`
- `goathletix-backend/test/**`
- `goathletix-backend/nest-cli.json`, `tsconfig*.json`

Never touch:
- `goathletix-backend/prisma/schema.prisma` or `supabase/migrations/**` → hand to `data-schema`
- `goathletix-frontend/**` → hand to `discovery-ui`
- `goathletix-backend/backend/**` and `goathletix-backend/frontend/**` → stale duplicate trees, archive only
- `package.json` dependency lists without saying so in your handoff (lockfile is a serial-merge conflict point)

## Facts you must not rediscover

- Runtime: NestJS 11, TypeScript 5.7, CommonJS (`sourceType: 'commonjs'` in eslint config). Node fetch is proxied via `undici` `setGlobalDispatcher` in `main.ts` because `@supabase/supabase-js` ignores `HTTPS_PROXY` — keep that block first in `main.ts`.
- Two DB access paths coexist: `PrismaService` (`pg` Pool + `@prisma/adapter-pg`, reads `DATABASE_URL`) and `SupabaseService` (`createClient` with `SUPABASE_SERVICE_ROLE_KEY`, `auth.persistSession: false`, `@Global()` module). **`EventsService` currently uses Supabase, not Prisma.** Prisma is used by `src/seed.ts`.
- Both services throw on missing env vars in their constructor. Preserve that — fail fast, never silently fall back to a placeholder.
- Query params go through a `class-validator` DTO (`GetEventsQueryDto`) with `@Type(() => Number)`; the global pipe is `new ValidationPipe({ transform: true, whitelist: true })`. Any new query param needs a DTO field or `whitelist` will strip it.
- Enum params validate against Prisma-generated enums (`SportCategory`, `DifficultyLevel` from `@prisma/client`). Adding a sport means a migration + `prisma generate`, not a string literal.
- Response shape for list endpoints is `{ data, meta: { total, page, limit, totalPages } }`, count from Supabase `{ count: 'exact' }`, ordered ascending by date, paginated with `.range(from, to)`. Keep this envelope.
- Rows are returned in **snake_case** straight from Supabase (`EVENT_SELECT` string with an embedded `organizer:organizers(...)` join). The frontend normalizes. Do not rename fields to camelCase without coordinating with `discovery-ui`.
- Errors: `InternalServerErrorException(error.message)` on Supabase error, `NotFoundException` on missing row, with a UUID regex guard before the query in `findOne`.
- Port: `process.env.PORT ?? 3000`. `.claude/launch.json` expects 3000. Note that `backend/.env.example` says `PORT=4000` and the stale `useSocket.ts` defaults to 4000 — 3000 is what actually runs.

## Known open defect in your area

`EventsService.EVENT_SELECT` and the month/year filter select and filter on `event_date`, but migration `20260710000003_multiday_events.sql` renamed that column to `start_date` and added `end_date`, and `schema.prisma` models it as `startDate`/`endDate`. Either the migration is not applied to the live project or `/events` is broken. **Do not "fix" this by guessing.** Verify against the live table first, then raise it as a GA task with `data-schema`, because multi-day events need range-overlap filtering (`start_date <= monthEnd AND end_date >= monthStart`), not equality on one column.

## How you work

1. Read the task note in `goathletix-backend/04 Delivery/` before editing.
2. Run the repo's own checks — never claim a build passes without them:
   ```bash
   npm run lint --prefix goathletix-backend
   npm run build --prefix goathletix-backend
   npm test --prefix goathletix-backend
   ```
3. Prettier config is `{ singleQuote: true, trailingComma: "all" }`. Single quotes, trailing commas, semicolons. Match `events.service.ts` style: module-level `const` for shared select strings, small pure helpers above the class, constructor injection with `private readonly`.
4. Test convention: `*.spec.ts` beside the source (`jest` `rootDir: src`), e2e in `test/*.e2e-spec.ts` via `npm run test:e2e`. Coverage today is one placeholder spec — any endpoint you add or change gets a spec.
5. Verify the endpoint actually responds before claiming done:
   ```bash
   curl -s -m 10 -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/events?limit=2"
   ```
6. Never log, echo, or paste values from `.env`. Reference variable names only.

Finish with a handoff note per `goathletix-backend/99 Templates/Agent handoff.md`, listing changed paths, commands run with results, and the API contract delta if any.
