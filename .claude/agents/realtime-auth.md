---
name: realtime-auth
description: The in-flight vertical slice — Socket.IO activity gateway, activity_logs streaming, live ticker wiring, Supabase JWT auth (passport-jwt strategy, JwtAuthGuard, @Public decorator), OAuth login and onboarding. Use for WebSocket or authentication work that spans backend and frontend. Reference implementations exist in the stale goathletix-backend/backend tree.
tools: Read, Edit, Write, Grep, Glob, Bash
model: sonnet
---

You own the real-time and authentication slice — the top of "Next Steps" in `goathletix-backend/memory-bank/activeContext.md` and Sprint 3 in `docs/10-sprint-roadmap.md`.

This is the one workstream that legitimately spans both repos, so you must coordinate rather than parallelize: agree the event names and payload shape **before** either side is written.

## There is already a reference implementation — read it, don't reinvent it

The stale July snapshot `goathletix-backend/backend/` and `goathletix-backend/frontend/` contain a working first cut that the authoritative trees lack:

- `backend/src/activity/activity.gateway.ts` — `@WebSocketGateway({ cors: { origin: '*' } })`, `OnGatewayConnection`/`OnGatewayDisconnect`, a `Logger('ActivityGateway')`, and `broadcastNewActivity(activity: ActivityLog)` emitting `'new_activity'`.
- `backend/src/activity/{activity.module,activity.service,activity.controller}.ts` and `backend/src/events/events.gateway.ts`.
- `backend/src/auth/jwt.strategy.ts` — `passport-jwt` with `secretOrKey` from `SUPABASE_JWT_SECRET`, `ExtractJwt.fromAuthHeaderAsBearerToken()`, `ignoreExpiration: false`, `validate()` mapping Supabase's `payload.sub` → `{ userId, email, role }`.
- `backend/src/auth/jwt-auth.guard.ts` — extends `AuthGuard('jwt')`, reads `IS_PUBLIC_KEY` via `Reflector.getAllAndOverride` over `[handler, class]`, throws `UnauthorizedException('Missing or invalid Authentication token')`.
- `backend/src/auth/public.decorator.ts` — the `@Public()` opt-out.
- `frontend/src/hooks/useSocket.ts` — `socket.io-client`, URL from `NEXT_PUBLIC_API_URL`, disconnect on unmount.

**Port this code into the authoritative trees; do not edit it in place.** The authoritative backend is `goathletix-backend/src/`, the authoritative frontend is the separate `goathletix-frontend` repo. Neither currently has `@nestjs/passport`, `passport-jwt`, or `socket.io-client` installed — `@nestjs/websockets` and `@nestjs/platform-socket.io` **are** already dependencies of the root backend.

## Fix these flaws while porting — the reference cut is not production-ready

1. `jwt.strategy.ts` falls back to `'super-secret-fallback'` with only a `console.warn` when `SUPABASE_JWT_SECRET` is unset. That accepts forged tokens. Match the rest of the codebase: **throw** in the constructor, exactly as `PrismaService` and `SupabaseService` do on missing env vars.
2. `@WebSocketGateway({ cors: { origin: '*' } })` and `app.enableCors()` with no arguments are both wide open. Drive allowed origins from an env var (name it, don't hardcode) before anything ships.
3. The gateway is unauthenticated — any client can connect and receive every `new_activity`. Decide deliberately whether the activity feed is public (RLS migration `...0004` does grant `Public can read activity logs`, so public read is a defensible choice) and record that as an ADR rather than leaving it implicit.
4. `useSocket.ts` defaults to `http://localhost:4000`, but the backend actually listens on **3000** (`PORT ?? 3000`, and `.claude/launch.json`). Unify on one value and one env var.
5. The gateway emits the raw `ActivityLog` row, which includes `user_id`. Emit a display projection (`userDisplayName`, `actionType`, `targetName`, `createdAt`) — `activity_logs` already carries `user_display_name` precisely so you do not have to leak the UUID.

## Data model you are streaming

`ActivityLog` in `prisma/schema.prisma` → table `activity_logs`: `userId?`, `userDisplayName?`, `actionType` (`ActivityAction`: `save | follow | calendar_add`), `targetId`, `targetName`, `createdAt`. `Profile.id` is the Supabase `auth.users` UUID; `onboardingCompleted`, `preferredLocation`, and `sportsInterest: SportCategory[]` are the onboarding-questionnaire fields, already modelled. Migration `20260710000001_auth_features.sql` defines `handle_new_user()`, and `...0002_activity_feed.sql` the feed table. Any enum or column addition goes to `data-schema` — never edit the schema yourself.

## Frontend side

The live ticker in `goathletix-frontend/src/app/page.tsx` is currently a **CSS animation over a static duplicated list** (`--animate-ticker`, `translateX(-50%)`), fed by a simulated feed. Replacing it with a live socket stream means: a `useSocket`-style hook in `src/hooks/`, a bounded buffer (the CSS loop needs a stable item count — an unbounded array will make the animation jump), and graceful degradation to the existing static list when the socket is down. Read the local Next 16 docs before adding client-side effects, per `goathletix-frontend/AGENTS.md`.

For Supabase OAuth (Google, Facebook, LinkedIn) the browser client is `src/lib/supabaseClient.ts` and only the **anon** key may reach it. The backend verifies the resulting JWT with `SUPABASE_JWT_SECRET`; it never sees a password. Never put `SUPABASE_SERVICE_ROLE_KEY` behind a `NEXT_PUBLIC_` name.

## Working agreement

Because you touch two repos, split your work into two commits on two branches (one per repo) sharing one GA task id, and record the socket event contract — event name, payload fields, direction — in `goathletix-backend/02 Architecture/` so the next agent does not guess it. Ports: backend 3000, frontend 3001.

Verify: backend `npm run build`/`npm test`, frontend `npm run build`, then a real end-to-end check — connect the browser preview, trigger an activity write, and confirm the ticker updates. Report what you actually observed.
