---
id: GA-021
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-021-age-search-params
worktree: D:\project\goathletix-wt\fe-ga-021-age-search-params
scope: [goathletix-frontend/src/app/locations/[city]/page.tsx, goathletix-frontend/src/app/sports/[sport]/page.tsx, goathletix-frontend/src/components/EventsDirectory.tsx, goathletix-frontend/src/app/globals.css]
acceptance: []
depends_on: []
related: [GA-017, GA-020]
---

# GA-021 Honour `ageCategories` and `q` on the city and sport pages

## Goal

The hero search now has an **Age** segment and sends `?ageCategories=kids,junior` (and `?q=` for typed
text) when you press search. The city and sport pages ignore both query strings, so the choice has no
effect. Make those pages apply them. The backend already supports both (`ageCategories` overlaps
`events.age_categories`; `search` uses the generated `search_vector`), so this is frontend-only.

## Scope and ownership

- Owned files: `src/app/locations/[city]/page.tsx`, `src/app/sports/[sport]/page.tsx`,
  `src/components/EventsDirectory.tsx`; at most one clearly marked block appended to `src/app/globals.css`.
- Explicitly out of scope: the hero search itself (`HeroSearch.tsx`), the event card, any backend file, any
  other component, the header search. Do not touch `schema`, `package.json`, `layout.tsx`.
- Coordination: none. This is the only frontend writer in batch 1.

## Acceptance criteria

- [ ] `/locations/<city>?ageCategories=kids,junior` lists only events whose `age_categories` overlap
      those values, by passing `ageCategories` to the API (not by filtering client-side after the fact).
- [ ] `/locations/<city>?q=marathon` and `/sports/<sport>?q=...` pass `search` to the API.
- [ ] Both pages show the active filters as removable chips ("Kids (U12) x") with a "Clear all"; removing
      one updates the URL and the list. Labels come from `AGE_CATEGORIES` in `src/lib/sportTaxonomy.ts`.
- [ ] Unknown age values in the URL are ignored (the API rejects them with 400 and the page must not break).
- [ ] The page still works with no query string, exactly as before.
- [ ] `npx tsc --noEmit` and `npx eslint src` report 0 errors (existing warnings may remain).

## Implementation notes

Next 16 / React 19: `searchParams` is a **Promise** in page props and must be awaited. Read
`node_modules/next/dist/docs/` before writing App Router code. Dates are parsed by string splitting, never
`new Date(str)`. Style: double quotes, no Prettier. Do not run a dev server (ports belong to the main
checkout); verify with type-check and lint, and say plainly which behaviours you could not run.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | exit 0, no output (after one fix: Set<string> typing); commit 4ba3497 |
| eslint src | pass | 0 errors, 6 pre-existing-style warnings (img, unused vars); exit 0 |
| Browser behaviour (chips, URL update, API params) | not run | no browser/dev server allowed in this worktree |

## Outcome

merged 2026-10-16 (ded2896 + fix 346dafa on feat/implement-main-page-mockup); browser-checked: chips render, removing one updates URL and list.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
