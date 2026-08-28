---
id: GA-017
type: task
status: in-review
priority: P1
owner: main session
branch: unassigned
worktree: unassigned
scope: ["goathletix-frontend/src/components/SearchBar.tsx", "goathletix-frontend/src/app/page.tsx"]
acceptance: []
depends_on: []
related: [GA-002, GA-008, GA-016]
---

# GA-017 Airbnb parity for the hero search bar

> **Process note:** this note was written *after* the implementation, at the user's direct request to
> fix the search bar immediately. It does not follow the note-before-branch rule in `PROGRESS.md` §1.
> Recorded here so the board reflects reality rather than backdating the process.

## Goal

Make the hero search bar match Airbnb's interaction model, layout and accessibility behaviour, and
fix the defects found in a deep audit of the previous implementation.

## Scope and ownership

- Owned files/areas: `goathletix-frontend/src/components/SearchBar.tsx` (new),
  `goathletix-frontend/src/app/page.tsx` (search-bar region and filter state only)
- Explicitly out of scope: the `/events` API contract, `schema.prisma`, the disabled
  `#discover` calendar section, the `#browse` tiles, event card markup
- Coordination required with: `data-schema` for GA-002 (blocks the date-range feature below)

## Acceptance criteria

- [x] Search commits on the Search button, not on every keystroke
- [x] Each popover is anchored under its own field
- [x] Escape closes the panel and returns focus to the trigger
- [x] Outside press dismisses on both mouse and touch
- [x] Visible focus rings on every control
- [x] `aria-expanded` / `aria-haspopup` / `aria-controls` / `role="dialog"` present
- [x] Past dates disabled; today marked; picker opens on the current month
- [x] Two months side by side on desktop, one on mobile
- [x] Mobile: collapsed pill opening a full-screen sheet, background scroll locked
- [x] Day cells meet the 44px minimum tap target
- [x] `prefers-reduced-motion` respected
- [x] Brand uses the project's orange token, not Airbnb's red
- [ ] Date **range** (check-in/check-out equivalent) — **blocked on GA-002**

## Implementation notes

- Extracted to `src/components/SearchBar.tsx` rather than growing `page.tsx`. The rewrite is ~640
  lines and `page.tsx` is the documented parallelisation blocker (GA-008); a component with an
  explicit props contract (`value` + `onSearch`) is far cheaper to review. This is a partial,
  opportunistic start on GA-008, not a completion of it.
- **Draft vs applied state** is the core change. The component holds a local `draft`; `page.tsx`
  holds the applied filters. Nothing refetches until `onSearch` fires. The draft re-syncs from props
  by adjusting state during render (not in an effect) — React 19's lint rejects setState-in-effect.
- Dates stay ISO `YYYY-MM-DD` strings compared lexicographically. `new Date(string)` is never used,
  per the timezone rule in `CLAUDE.md` §7. Numeric `new Date(y, m, d)` is used only for month maths.
- The scrim and the mobile sheet are **portalled to `document.body`** because GSAP animates hero
  ancestors, and a transformed ancestor would make `position: fixed` resolve against it.
- The selected day is narrowed **client-side** (`visibleEvents` in `page.tsx`). `GET /events` accepts
  only `month`/`year`, and the global `ValidationPipe({ whitelist: true })` strips undeclared params,
  so adding a `date` param is an API change that belongs with GA-002 — deliberately not done here.
- Week still starts Sunday, matching the rest of the app. Monday-start would be a better fit for an
  India-focused product but would make this calendar inconsistent with the legacy one; left as-is.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run lint --prefix goathletix-frontend` | pass for new code | 0 problems in `SearchBar.tsx`; 5 pre-existing in `page.tsx` (was 7 — two unused imports removed) |
| `npm run build --prefix goathletix-frontend` | pass | "Compiled successfully in 11.7s", TypeScript clean, 4/4 static pages |
| Bar height | 68px (was 76.5) | measured via `getBoundingClientRect` |
| Segment widths even | 190/190/190/191 (was 192/209/234/176) | measured |
| Resting dividers visible | yes (was all `rgba(0,0,0,0)`) | computed `backgroundColor` |
| Search button icon-only at rest | 46px (was 107px with label) | measured |
| Competition panel anchoring | **0px** offset from its field (was −192px) | measured |
| Panels in DOM at once | 1 (was 2) | `querySelectorAll('[role=dialog]')` |
| a11y attributes | all four segments carry expanded/haspopup/controls | measured |
| Calendar opens on current month | August 2026 + September 2026 | measured; today is 2026-08-24 |
| Past dates disabled | 23 (Aug 1–23) | measured |
| Today marked | `aria-current="date"` on "August 24, 2026" | measured |
| Desktop day cell | 34x44 (was 19x44 before width fix) | measured |
| Mobile pill | 62px tall (was a 264px `rounded-full` capsule) | measured at 375x812 |
| Mobile sheet | portalled, fills 375x812 exactly (was opening at y=779, below the fold) | measured |
| Mobile scroll lock | `body.style.overflow === "hidden"` | measured |
| Mobile day cell | 34x44, meets 44px target (was 35x39) | measured |
| Horizontal overflow at 375px | none | `scrollWidth === innerWidth` |
| **Animation smoothness / morph visuals** | **not verified** | the Browser pane is not compositing — `requestAnimationFrame` fired **0** frames in 600ms while `setInterval` fired 11. No rAF or CSS transition can advance, so framer-motion enter/exit, the button morph, and the bar tint could not be observed. Needs a human eye in a real browser. |
| Backend `/events` | 500 `TypeError: fetch failed` | pre-existing environment/network issue, unrelated to this task; the UI falls back to `fallbackEvents.json` |

## Handoff

See `07 Agent handoffs/2026-08-24-GA-017-searchbar-airbnb-parity.md`.
