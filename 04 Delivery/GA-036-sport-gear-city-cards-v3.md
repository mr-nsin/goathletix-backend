---
id: GA-036
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-036-sport-gear-city
worktree: D:\project\goathletix-wt\fe-ga-036-sport-gear-city
scope: [SportGridV2.tsx, CityRailV2.tsx, CityCardV2.tsx, SportCityCards.css, new GearRailV2.tsx + css, public/icons/*, src/lib/sportIcons2.json, new gear icon json]
acceptance: []
depends_on: [GA-029]
related: [GA-027]
---

# GA-036 Sport tiles without animation, redesigned gear cards, city cards on the type system

Read [[08 Runbooks/Agent brief - frontend]], [[01 Product/Card design principles]] (tokens in `src/app/card-tokens.css`) and [[01 Product/Sports icon libraries]] first.
Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx` (the coordinator swaps `GearRail` for your `GearRailV2` in `page.tsx`).

## Owner feedback

1. **"Stop the animation of Browse by sports icons."** Remove every glyph animation (hop, roll, swing, tilt, flip, bob, the second-glyph stagger, ring fade). The sport tiles may keep only the common card lift from the design principles. Keep bare glyphs on white cards, no disc.
2. **"Gear up for your next event: the icons are not good, check other libraries, and the background should be like Browse by sports icons, or check more design inspiration."**
   - Create `GearRailV2.tsx` (export `GearRailV2`, no props, same `RailSection` props as the current `GearRail` in `Sections.tsx`: read it) replacing the pale square image tile.
   - Cards look like the sport tiles: white `--surface` card, one large bare glyph (about the glyph token size), no filled coloured disc, a soft ground shadow.
   - **Better icons:** evaluate other Iconify sets for these six products: running shoe, energy gel or sports nutrition, GPS running watch, race singlet or running shirt, inline skates, cycling helmet. Candidates to probe with the Iconify API (Node recipe in the brief): `fluent-emoji-flat` (current), `noto`, `twemoji`, `emojione`, `streamline-emojis`, `streamline-ultimate-color`, `icon-park-twotone`, `healthicons`, `mdi`, `solar`. The set must read as one family with the sport tiles' Fluent glyphs, be colourful, be permissively licensed, and actually contain the product. Render the candidates (for example to PNG with a quick Python script if a renderer is available, or inspect the SVG bodies) and choose by looking, not by name. Bundle the chosen glyphs as a new local JSON, record licences in `public/icons/CREDITS.md` (append, do not overwrite), and report which sets you rejected and why. If no set gives a clearly better glyph for a product, keep the current one and say so honestly.
   - Content per card (type roles from the principles note): eyebrow "why" chip (for example "For your 21.1K"), title (product name), price line with the struck-through old price and the discount in a chip, a small "sold by" or category line only if data exists in `SAMPLE_PRODUCTS` (read `src/lib/sampleContent.ts`, do not edit it). Hover = the common lift only.
3. **Type system:** apply the five text roles to the sport tile, the gear card and the city card (`CityCardV2`): drop ad-hoc sizes; the big city count is the card's one `stat` (24 / 800).

## Scope and ownership

- Owned: the files in the scope line. Out of scope: everything else.

## Acceptance criteria

- [ ] No animation on sport glyphs (grep `@keyframes` in your CSS: only the entrance and count-up for city cards may remain).
- [ ] `GearRailV2` with bare large glyphs on white cards, better or honestly-kept icons, licence recorded, rejected sets listed in the report.
- [ ] Sport, gear and city cards use only the type roles.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | 0 errors, no output |
| eslint src | pass | 0 errors, 6 pre-existing warnings |
| Server/client boundary self-check | pass | GearRailV2 and SportGridV2 are server components and call no function from a use-client file; CityCardV2 unchanged client component |
| Loaded in a browser | not run | coordinator, after merge. Gear card markup and CSS were rendered in headless Edge from a static mock only |

## Outcome

merged and wired 2026-10-17 (GearRailV2); sport glyph animation removed; gear glyphs from Noto plus one OpenMoji helmet (CC BY-SA, credit needed before launch).

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
