---
id: GA-059
type: task
status: ready
priority: P1
owner: discovery-ui
branch: codex/ga-059-ticket-card-redesign
worktree: D:\project\goathletix-wt\fe-ga-059-ticket-card-redesign
scope:
  - goathletix-frontend/src/components/event/EventTickets.tsx (TicketCard function only)
  - goathletix-frontend/src/components/event/event.css (.ev-ticket*, .ev-tt*, .ev-tfacts*)
acceptance: []
depends_on: [GA-049, GA-058]
related: [GA-056]
---

# GA-059 Ticket card redesign: clear separation of details (Luma/Eventbrite style)

## Why

The current ticket card stacks every detail as flat lines — title / description / age / inclusions /
start+cut-off / price / capacity bar — which reads like a form. Owner reference (screenshot 5 of the
2026-10-21 feedback round) is a tournament ticket showing visual sections: a sport eyebrow row with a
spots-left badge on the right, a title with category pills, a short description, a bordered **3-column
fact strip (Entry / Eligibility / Format)** with icon + label + value, then an INCLUDED chip row. The
layout feels composed; details are easy to compare across cards.

## Context (settled; do not re-investigate)

- The data model is already there — don't modify `src/lib/eventDetails.ts`. All of these are available on
  the TicketType or EventDetail:
  - **Title & category:** `t.label`, `t.distanceKm`, `t.gender`, `t.kind` (participant / team / add_on / spectator),
    `t.sessionFrom`, `t.sessionTo`, `t.teamSizeMin/max`.
  - **Timed badge:** `t.isTimed` (`true` → "Timed", `false` → "Not timed", `undefined` → omit the chip).
  - **Spots-left badge:** `p.left`, `p.fill`, `p.soldOut` where `p = ticketPricing(t, today)`.
  - **Pricing:** `p.price`, `t.compareAtInr`, `d.tax`, `t.sportDetails.price_unit`, `p.tierLabel`,
    `p.next` (next tier), `t.depositInr`, `t.balanceDueDays`.
  - **Eligibility:** `t.minAge`, `t.maxAge`, `t.ageAsOn`, `t.requiredDocuments`, `t.qualifyingStandard`.
  - **Format / sport details:** `t.sportDetails` (jsonb, lowercase keys) — pass through sport-specific
    values like `scoring`, `tournament_format`, `court_surface`, `course_type`, `surface`.
  - **Inclusions:** `t.includes` → `VocabList` renders them with icons.
  - **Facts (Start / Cut-off):** `t.startTime` (string), `t.cutoffMinutes` (number).
- Helpers already imported: `formatKm`, `dayMonthYear`, `dateSpan`, `formatDuration`, `taxLabel`,
  `humanize`, `ticketPricing`. Use them, do not duplicate.
- Icon library is `lucide-react`. The project uses `vocabLabel` + `VocabIcon` for shared vocab tokens.
- The project's palette tokens: `--accent`, `--cta`, `--ink`, `--muted`, `--line`, `--tint-mute`,
  `--surface`, `--shadow`, `--shadow-lg`, `--ev-ease`, `--radius`. No hex literals that duplicate a token.
- Reduced-motion pattern: re-declare each new animation inside the existing
  `@media (prefers-reduced-motion: reduce)` block at the end of `event.css` with `!important`. **Never**
  place `!important` inside a comma list — grep for that at the end.
- Section reveal + savings ribbon + hover disclosure were landed by GA-058; keep them working. The savings
  ribbon lives at `.ev-savings`, the hover disclosure at `.ev-trev`, the capacity bar at `.ev-cap`.
- The card lives inside `.ev-tgrid` (an auto-fill grid with min 260px columns), so the card has to
  stay readable from ~260px wide upward. Fact strip must wrap gracefully — 2 columns on narrow, 3 on wide.

## Scope (what you own; nothing else)

- `src/components/event/EventTickets.tsx` — only the `TicketCard` function body (lines ~145–280) and
  anything purely feeding it. **Do not** change `EventTickets` wrapper, the Section headings, the
  `TicketStepper`, the `TicketFinder`, or `TicketCard` call sites.
- `src/components/event/event.css` — the `.ev-ticket` block and its children (search for `.ev-ticket`,
  `.ev-tt`, `.ev-tdesc`, `.ev-tage`, `.ev-tinc`, `.ev-chips`, `.ev-facts`, `.ev-price`, `.ev-cap`,
  `.ev-savings`, `.ev-tier`, `.ev-trev`). Add new classes freely; prefer renaming over leaving
  dead CSS.

**Out of scope:** `globals.css`, `Sections.tsx`, `layout.tsx`, homepage page, `EventPage.tsx`,
`eventDetails.ts`, `sampleContent.ts`, backend, migrations.

## Design brief (follow this)

Each ticket card should read as four stacked groups with clear separation:

1. **Header row** (`.ev-tcard-head`)
   - Left: a small **sport/category eyebrow** — one line, muted, uppercase, `cd-eyebrow` style —
     combining the sport slug (humanised) and the ticket's sub-type ("150 km", "Doubles draw",
     "Teams of 4"), e.g. "CYCLING · 150 km" or "RACQUET · Doubles draw".
   - Right: a **status pill** — "N spots left" when `p.left ≤ 20`, "Last few" when ≤ 5, "Sold out" when
     `p.soldOut`, "Timed" / "Not timed" otherwise (if `t.isTimed !== undefined`). Pills carry a
     colour tint (`--accent` for status, `--muted` for timed/not-timed, `--danger` for sold out).

2. **Title block**
   - `H` (h3 or h4 by level) with the ticket label, next to a short row of **category pills**:
     distance (if any), gender (Men/Women/Mixed/Open), team composition (Pairs / Teams of X).
   - Below the title: a **1–2 line description** in `cd-body` muted ink.

3. **Fact strip** — THE key new element (`.ev-tfacts`)
   - A bordered strip laid out as **auto-fill minmax(140px, 1fr)** of 2–4 cells. Each cell:
     icon (16px lucide) + a `cd-meta` label on top + a `cd-body` value below.
   - Build the cells from the richest data available, in this order (keep the first 3–4 that fit):
     - **Entry** — team / solo, e.g. "Pair · 2 players" (team range) or "Solo entry" (participant default).
       Icon: `Users`.
     - **When** — session date(s) if `sessionFrom`, else `startTime` ("5:00 AM") if present. Icon:
       `Calendar` for date, `Clock` for time. Fall through to "Flag-off with event" if neither.
     - **Eligibility** — `ageRule(minAge, maxAge)` + "on event day" or the as-on date in muted. Icon:
       `BadgeCheck`. Omit the cell entirely when there is no age rule.
     - **Format** — sport-aware single line from `t.sportDetails` (racquet: `scoring` and/or
       `tournament_format`; running/cycling: `course_type` and/or `surface`; trek: nothing specific,
       show "Multi-day batch"). Icon: `Flag`. Omit when nothing meaningful to show.
     - **Cut-off** — `formatDuration(t.cutoffMinutes)` with icon `TimerReset`. Only if `cutoffMinutes`.
   - At least 2 cells, at most 4. The strip has a thin border, 12px padding, 10px gap, rounded corners,
     and the labels are small-caps / uppercase micro-type.

4. **Inclusions**
   - Compact uppercase "INCLUDED" label (muted, `cd-eyebrow`), then the existing `VocabList` chip row
     for `t.includes`. If `t.excludes` has items, show them below in a muted "Not included" row.

5. **Price + capacity footer** (keep current behaviour)
   - Price, strike-through compare-at, tier chip, and "rises to … on …" line unchanged.
   - Capacity bar unchanged (`.ev-cap` + fill percent). Make sure it still animates in on reveal.
   - `TicketStepper` block unchanged.

**Keep:**
- Savings corner ribbon (`.ev-savings`) when `t.compareAtInr` beats the current price.
- Sold-out dimming + strike-through price.
- Hover `.ev-trev` disclosure for secondary info (min age with as-on date, required documents,
  qualifying standard). Attach to this redesign too.

**Micro-interactions:**
- Hover lift stays (translateY(-3px) and bigger shadow).
- Pills in the status slot don't jump on hover — they stay in place.
- Fact-strip cell icons tint `--accent` on card hover.
- No animation over 400ms. One load moment only.

## Acceptance

- [ ] Four showcase events render without errors on `/events/<id>`:
      `fe2f7043-1889-4b31-b7bb-07bc9c26685d` (ultra),
      `dee4ce05-e00e-46f3-9d4b-808457f8adbd` (gravel),
      `b6951a6a-a872-45a0-9377-738549a876ea` (trek),
      `4011e73d-a3df-4dde-94ea-72c58619d966` (racquet).
- [ ] Cards show a header eyebrow with status pill, title + category pills, fact strip of 2–4 cells,
      inclusion row, price + capacity footer.
- [ ] Sold-out, no-compare-at-price, no-cut-off, free-entry, deposit, next-tier, and session-dates branches all render
      without visual regression.
- [ ] Fact strip wraps gracefully at 260px card width and reads cleanly up to the single-column 420px variant.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npx eslint src/components/event` passes with 0 errors (6 pre-existing warnings OK).
- [ ] `grep -nE '!important\s*,' src/components/event/*.css` returns nothing.
- [ ] GA-058 features (section reveal, savings ribbon, hover disclosure, capacity fill animation,
      quantity colour sweep, checkpoint timeline) are untouched or improved.

## Rules

- Work in `D:\project\goathletix-wt\fe-ga-059-ticket-card-redesign` on branch
  `codex/ga-059-ticket-card-redesign`. Do not switch branches, do not run dev servers, do not
  `npm install` inside the worktree.
- Commit on `codex/ga-059-ticket-card-redesign` with message:
  `feat(event): ticket card redesign with clear fact strip and status pill`
  Body references GA-059. End with:
  `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`
- Do NOT push. Coordinator merges after audit + browser render.

## Verification table (fill it in)

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npx eslint src/components/event` | exit 0, 0 warnings, 0 errors |
| CSS `!important` inside comma list | `grep -nE '!important\s*,' src/components/event/*.css` | no matches (exit 1) |

## Handoff

Short handoff at `07 Agent handoffs/GA-059-discovery-ui.md`:
- Files changed and why.
- Any judgement calls where the design brief was silent (fact-strip cell order on edge cases,
  colour choice for the status pill, etc.).
- tsc + eslint results.
