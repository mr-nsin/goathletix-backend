---
id: GA-028
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-028-featured-arrows-hover
worktree: D:\project\goathletix-wt\fe-ga-028-featured-arrows-hover
scope: [src/components/home/FeaturedBanner.tsx, src/components/home/Rail.tsx, src/components/home/RailSection.tsx, src/app/globals.css]
acceptance: []
depends_on: []
related: [GA-020]
---

# GA-028 Featured banner, rail navigation arrows and smooth card hover

Read [[08 Runbooks/Agent brief - frontend]] first. **This is the only task allowed to edit `src/app/globals.css`.**

## Goal (owner feedback)

1. **Featured banner** (the big "Showing the soonest upcoming events..." carousel): improve the design and the information shown, and its previous/next arrows and "1 / 8" counter, so they look like the best event sites (BookMyShow, District, Eventbrite, Airbnb): arrows as clean circular buttons that sit on the edges and appear/solidify on hover, keyboard operable, with the thumbnail strip and counter tidied. Show more useful info per event (distance chips, price, countdown, organiser tick, registration status) without clutter.
2. **Rail arrows** (the round next/prev buttons on every horizontal rail: events, cities, guides): same visual language as the banner arrows; disabled state at the ends; larger touch target on phones.
3. **Hover transitions are not smooth** on cards (event cards `.card`, organiser/gear/club/guide/city cards, sport tiles). Find why (for example `transition: transform .3s ..., box-shadow ..., border-color` on a large card, `overflow:hidden` with a scaled child, `transform: scale` on images, layout-affecting properties) and fix it sitewide in `globals.css` following the Motion rules in the brief. Keep the visual hover (a small lift and soft shadow) but make it fluid, and make sure image zoom inside a card is clipped smoothly (use `transform` on the image, not width/height).

## Scope and ownership

- Owned: `FeaturedBanner.tsx`, `Rail.tsx`, `RailSection.tsx`, `src/app/globals.css`, plus new files (for example `FeaturedBanner.css`).
- Out of scope: `Sections.tsx`, `page.tsx`, `layout.tsx`, all other components (other agents are redesigning the sport, city, clubs, guides, partners, alerts and footer areas in new files in parallel: **do not restyle `.stile`, `.ccard`, `.clubcard`, `.gcard`, `.pt*`, `.af*`, `.closing`, `.parade`, `.madein`**; for those only provide the shared hover rule below).
- Shared hover rule: define one reusable class or custom properties, for example `.hov` plus `--lift`, and ALSO make the generic transition fix apply to the existing selectors via a single grouped rule at the end of `globals.css`, so other agents' new cards (which they style in their own files) can opt in by adding the class `hov`. Document the class in a comment at the top of your block.

## Acceptance criteria

- [ ] Banner and rail arrows share one design; both have hover, focus-visible ring, disabled state; 44 px touch target on phones.
- [ ] Banner shows richer, well-structured info; works at 375 px; dark mode correct.
- [ ] Card hover is a single smooth transform-based lift (no jank sources left: report each cause you removed).
- [ ] The `hov` class exists and is documented.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | 0 errors |
| eslint src | pass | 0 errors, 6 pre-existing warnings |
| Server/client boundary self-check | pass | only client files edited, no new cross-boundary calls; npm run build not run (Turbopack rejects the node_modules junction) |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged 2026-10-17. Root cause of rough hovers: the global reduced-motion rule disabled every transition on the owner machine.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
