---
id: GA-060
type: task
status: ready
priority: P1
owner: events-api
branch: codex/ga-060-event-reviews-api
worktree: D:\project\goathletix-wt\be-ga-060-event-reviews-api
scope: [goathletix-backend/src/events/**]
acceptance: []
depends_on: [GA-050]
related: [GA-061]
---

# GA-060 `GET /events/:id/details` returns published reviews and a rating summary

## Why

Owner feedback 2026-10-28: "there is no option to rate the events and comments also should be there."
The `event_reviews` table already exists (migration 0017, applied) and is public-read for published rows. The details
endpoint does not return it. This task is the **read side only**.

## Settled facts (do not re-investigate)

- `event_reviews` columns: `id, event_id, user_id, rating smallint 1..5, title text(<=120), body text(<=4000),
  edition_year smallint, category_label text, status moderation_status default 'published', helpful_count int,
  created_at, updated_at`. One review per (event, user).
- `profiles` has `id` (= auth user id) and `full_name text`. FK `event_reviews.user_id -> profiles.id`.
- A trigger (`refresh_event_rating_trg`) maintains `events.rating_avg` and `events.rating_count` from published rows.
  Both are **already selected** in `findDetails` (see GA-048). Seeded showcase events have `rating_avg`/`rating_count`
  set by `supabase/seeds/0001_*.sql` but **no `event_reviews` rows** (the seed cannot create auth users).
- The backend uses the service-role key, so RLS is bypassed: filter `status = 'published'` yourself.
- Live tree has **no authentication**. Do NOT add a POST/PUT/DELETE endpoint: writing a review needs an
  authenticated user (accounts are "coming soon"). Out of scope.
- Responses are snake_case. Follow the existing `safeChildRows` pattern in `events.service.ts`: a failing child read
  logs and returns `[]`, never fails the whole response.

## Privacy rules (hard)

- **Never return** `user_id` or `profiles.full_name` as stored. Return `author_name` derived server-side as
  **first name + last initial** ("Priya Sharma" -> "Priya S."; single word -> that word; empty/null -> "Participant").
  Trim, collapse whitespace, cap at 40 characters.
- Do not return `updated_at`.

## Contract (append to the existing response; change nothing else)

```
data.reviews: [{
  id, rating, title, body, edition_year, category_label, helpful_count, created_at, author_name
}]   // published only, newest first, at most 20; [] when none or on error
data.rating_summary: {
  avg: number | null,        // from events.rating_avg (1 decimal), null when count is 0/absent
  count: number,             // from events.rating_count (0 when absent)
  distribution: { "1": n, "2": n, "3": n, "4": n, "5": n } | null
}
```

`distribution` is counted from **all** published `event_reviews.rating` rows for the event (select only `rating`,
cap 10,000 rows). Return `null` when the rows do not account for the count (sum of distribution != `count`), which is
the case for seeded events with a rating but no rows. The UI then shows only the average. Never invent a distribution.

## Scope

Owned: `goathletix-backend/src/events/**` (service, spec; controller only if needed). Out of scope: schema, migrations,
`app.module.ts`, `main.ts`, package files, any DB write, frontend.

## Acceptance

- [ ] `reviews` and `rating_summary` returned as above; existing fields untouched.
- [ ] Verify the embed/join syntax against the live API (PostgREST embed of `profiles` through `user_id`); if an embed is
      awkward, do two reads and join in code. Record which you used.
- [ ] Spec covers: author-name derivation (two words, one word, null, extra spaces, long), no `user_id`/`full_name`
      leakage, distribution `null` when rows != count, distribution counted when rows == count, empty reviews `[]`,
      review-read error isolated to `[]` without failing the response.
- [ ] `npm run build`, `npm test`, `npx eslint src/events` (no --fix) pass. Record results.
- [ ] No `any` regressions beyond the file's existing style; Prettier: `singleQuote`, trailing commas.

## Rules

- Work only in the worktree above; do not run the dev server; do not `npm install` (node_modules is a junction).
- Commit on `codex/ga-060-event-reviews-api`: `feat(events): return published reviews and a rating summary in /details`,
  body references GA-060, end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Do NOT push.
- Handoff at `07 Agent handoffs/GA-060-events-api.md` (files, commands actually run with real results, the join approach,
  anything you left out). Fill the Verification table below.

## Verification

| Check | Command | Result |
| --- | --- | --- |
| Build | `npm run build` | pass (nest build, no errors) |
| Tests | `npm test` | pass: 2 suites, 38 tests |
| Lint | `npx eslint src/events` | pass, no output (no --fix; prettier --write run first) |
| Live smoke | not run here (coordinator) | |
