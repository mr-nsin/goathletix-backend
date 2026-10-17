---
id: GA-029
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-029-sport-city-v2
worktree: D:\project\goathletix-wt\fe-ga-029-sport-city-v2
scope: [new src/components/home/SportGridV2.tsx, new src/components/home/CityRailV2.tsx, src/components/home/SportCityCards.css, src/lib/cityPhotos.ts]
acceptance: []
depends_on: [GA-024]
related: [GA-027]
---

# GA-029 Sport tiles and city cards, round 2

Read [[08 Runbooks/Agent brief - frontend]] first. Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx`.

## Goal (owner feedback)

**Sport tiles** (now white cards, icon on a coloured disc): improve the design and the icon treatment.
- **No background colour behind the icons**: show the glyph itself, larger, directly on the white card (a soft ground shadow or a subtle sport-coloured glow behind is fine, but no filled disc or circle).
- Look for ideas the way designers do (Pinterest-style sport category cards, Airbnb category bar, Strava, Decathlon Sports, Nike): you cannot browse Pinterest, so use your design judgement and the icon research in `01 Product/Sports icon libraries.md`. Where a sport lacks a good glyph (triathlon, gymnastics, martial arts, hurdles) say so; you may add a better glyph from the recommended fallback sets if you record its licence in a new `public/icons/CREDITS.md`.
- Add a hover animation that suits the sport (a small bounce, tilt or nudge on the glyph only; transform-only), a count line, and a short descriptor line (for example "Road, trail, ultra" derived from known discipline names in `src/lib/sportTaxonomy.ts`, not invented).

**City cards**: improve width and information and animation.
- Wider cards (about 260 to 300 px on desktop; the rail still scrolls and snaps), photo kept, with: city name, state, event count, "this weekend" count, the landmark name, and 2 to 3 top sports in that city as small icons or chips ONLY if the data exists in `CityCardModel` (`src/lib/homeData.ts`); if it does not, you may add an optional field to the model and fill it from data the page already fetches, but do not invent numbers.
- Animation: a slow, subtle photo zoom/pan (Ken Burns) on hover, an entrance stagger when the rail scrolls into view, and a count-up of the event number. Motion must remain visible with reduced-motion ON (see brief).

## Scope and ownership

- Owned: new `SportGridV2.tsx` (export `SportGridV2` with the same props as `SportGrid` in `Sections.tsx`), new `CityRailV2.tsx` (export `CityRailV2` with the same props as `CityRail`), the existing `SportCityCards.css` (yours now; extend or replace its rules), `src/lib/cityPhotos.ts`, optional new `public/icons/*` and `public/cities/*`. If you need new styles, put them in `SportCityCards.css` or a new css file you import.
- Out of scope: `globals.css`, `Sections.tsx` (the coordinator swaps the old functions for yours), `page.tsx`, every other component.
- Use the `hov` class idea only if it exists (GA-028 may add it); otherwise implement your own smooth transform-only hover.

## Acceptance criteria

- [ ] No filled disc or background colour behind sport glyphs; glyph larger; sport-appropriate hover animation.
- [ ] Sport tiles show a name, count and an honest descriptor line.
- [ ] City cards wider with state and extra info (no invented data), photo zoom on hover, entrance stagger, count-up.
- [ ] Legible on every photo; works at 375 px and dark mode.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | no output, exit 0 (worktree) |
| eslint src | pass | 0 errors, 6 pre-existing warnings, none in new files |
| Server/client boundary self-check | pass | SportGridV2 and CityRailV2 are server components; only CityCardV2 is client and receives plain props, nothing exported from it is called on the server |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged and wired 2026-10-17 (SportGridV2, CityRailV2). Per-city top sports not shown: no data on the model, would need about 120 extra count requests.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
