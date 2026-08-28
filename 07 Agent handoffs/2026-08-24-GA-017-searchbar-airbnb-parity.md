---
type: handoff
status: ready-for-review
task: "[[04 Delivery/GA-017-searchbar-airbnb-parity]]"
agent: main session
branch: unassigned
worktree: unassigned
commit: uncommitted
tags: [handoff]
---

# Handoff: GA-017 Airbnb parity for the hero search bar

## Outcome

The hero search bar was rewritten as `src/components/SearchBar.tsx` and now follows Airbnb's
interaction model: a local draft that only commits on Search, popovers anchored under their own
fields, keyboard and screen-reader support, a two-month picker that refuses past dates, and a
mobile collapsed-pill → full-screen-sheet pattern replacing the previous stacked capsule.

## Changed paths

- `goathletix-frontend/src/components/SearchBar.tsx` — **new.** The whole search bar: desktop
  segmented bar, four popovers, mobile pill + sheet, calendar. Extracted rather than inlined because
  the rewrite is ~640 lines and `page.tsx` is the documented parallelisation blocker (GA-008).
- `goathletix-frontend/src/app/page.tsx` — removed the ~385-line inline `<form>` and the state it
  owned (`activePanel`, `openPanel`, `pickerMonth`, `pickerYear`, the search half of the
  outside-click effect, five now-unused constant tables, two orphaned `lucide-react` imports).
  Added `appliedSearch` / `applySearch` (draft-vs-applied boundary), `visibleEvents` (client-side
  narrowing by selected day), and switched the hero section to a static `z-40` + `pb-28` instead of
  toggling padding off the old panel state. Net −377 lines.

## Verification

| Command/check | Result |
| --- | --- |
| `npm run lint --prefix goathletix-frontend` | pass for new code — 0 problems in `SearchBar.tsx`; 5 pre-existing problems remain in `page.tsx`, down from 7 |
| `npm run build --prefix goathletix-frontend` | pass — compiled in 11.7s, TypeScript clean, 4/4 static pages |
| Layout / a11y / calendar measurements | pass — full table in the task note, all values measured live via `getBoundingClientRect` and `getComputedStyle` at 882px and 375x812 |
| Animation and morph visuals | **not run** — see the blocker below |
| Backend `GET /events` | fails with 500 `TypeError: fetch failed` (pre-existing environment issue); UI correctly falls back to `fallbackEvents.json` |

## Decisions and risks

- **Decision — orange, not Airbnb red.** The previous bar hardcoded Airbnb's exact brand colours
  (`#FF385C` / `#E31C5F`). Replaced with the project's `--color-primary` (`#f97316`) token.
  Copying a competitor's mechanics is fine; shipping their trade dress is not. Worth an ADR if
  anyone wants the red back.
- **Decision — extracted to a component.** Partially advances GA-008 but does not complete it;
  `page.tsx` is still ~1150 lines and remains serial-only.
- **Decision — client-side day filtering.** `GET /events` accepts only `month`/`year` and the global
  `ValidationPipe({ whitelist: true })` strips undeclared params, so a `date` param is an API change.
  Left for GA-002 rather than fixing one side of a known contract drift in isolation.
- **Blocker — date range not implemented.** Airbnb parity implies check-in/check-out. A range needs
  overlap semantics (`start_date <= rangeEnd AND end_date >= rangeStart`), which is exactly the
  GA-002 drift. Deliberately deferred.
- **Risk — animations are unverified.** The Browser pane in this environment does not composite
  frames: `requestAnimationFrame` fired **0** times in 600ms while `setInterval` fired 11. No
  framer-motion or CSS transition can advance, so panel enter/exit, the Search-button morph and the
  bar tint were never observed running. All *layout* facts were verified (they don't need frames),
  but someone must open `http://localhost:3001` in a real browser and watch the transitions.
  This also means the original audit's "two panels stacked at opacity 1" finding was probably this
  same artifact rather than a genuine `key`/AnimatePresence bug.
- **Risk — week starts Sunday.** Kept for consistency with the legacy calendar; Monday-start is
  arguably better for an India-focused product.
- Secrets: no secret values recorded; none read, echoed, or written.

## Integration request

1. Open `http://localhost:3001` in a real browser and watch: panel open/close, switching between the
   four fields, the Search button expanding from circle to labelled pill, and the mobile sheet slide.
   This is the one thing automated verification could not cover.
2. Confirm the orange re-skin is the wanted direction before this merges.
3. Note that nothing is committed and both repos are on `main` — branch as
   `codex/ga-017-searchbar-airbnb-parity` before any commit.
4. Then triage `[[04 Delivery/GA-016-fixturecalendar-parity]]`, which depends on GA-002 landing first.
