---
id: GA-030
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-030-clubs-guides
worktree: D:\project\goathletix-wt\fe-ga-030-clubs-guides
scope: [new src/components/home/ClubsRailV2.tsx, new src/components/home/GuidesRailV2.tsx, src/lib/sampleContent.ts, new css]
acceptance: []
depends_on: []
related: [GA-032]
---

# GA-030 "Clubs & academies near you" and "Train smarter" cards

Read [[08 Runbooks/Agent brief - frontend]] first. Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx`.

## Goal (owner feedback)

1. **Clubs & academies** (today: a small green icon tile, a name, one meta line and a disabled "View" button): show much more useful information, with a design in the league of Strava clubs, Playo, Hudle and Cult.fit. Suggested content (sample data, clearly flagged as sample like today): cover or sport-colour banner with the sport glyph (no filled disc behind icons), name with a verified tick, type (club / academy / coaching centre), city and area, sports and age groups ("U8 to U16"), members or students, number of coaches and head-coach credential, batch timings and next batch, fee range ("from Rs 1,500 / month"), rating with review count, facilities (3 small icons), a "Free trial" or "Enrolling" pill, and actions (View, Save, Call/Enquire disabled "Soon"). A parallel research task (GA-032) is collecting what real platforms show; if its note `01 Product/Club and academy listing research.md` already exists when you start, read it and follow its field recommendations; otherwise use the list above.
2. **Train smarter** (guides rail: gradient tile with a floating emoji, a kind, a title, "6 min read"): improve the cards and the icons, and show a little more: author or source, difficulty/level, read time, a one-line teaser, the sport and age tags, a progress or "plan length" hint for training plans, a save (bookmark) affordance. No emoji on a gradient: use the Fluent glyph via `FluentIcon` (server component) without a filled disc, on a clean card or a soft sport-tinted header.

## Scope and ownership

- Owned: new `ClubsRailV2.tsx` (export `ClubsRailV2`), new `GuidesRailV2.tsx` (export `GuidesRailV2`), `src/lib/sampleContent.ts` (extend `SAMPLE_CLUBS` and `SAMPLE_GUIDES` with the new fields; keep existing fields so nothing else breaks; you are the only task editing this file), new CSS files, optional bookmark client component if you need state.
- They use the shared `RailSection` wrapper (`src/components/home/RailSection.tsx`, owned by GA-028, **read-only for you**). Keep passing the same props (`id`, `title`, `pending`, `sub`, `viewAll`, `railLabel`) as the current `ClubsRail` and `GuidesRail` in `Sections.tsx` (read them).
- Out of scope: `globals.css`, `Sections.tsx`, `page.tsx`, `RailSection.tsx`, other components.

## Acceptance criteria

- [ ] Club cards carry the extra information above, well structured and scannable at 375 px; everything sample is flagged as sample (keep the existing pending tag behaviour).
- [ ] Guide cards redesigned with real glyphs (no gradient emoji tiles), extra info, level/teaser/tags.
- [ ] No filled disc behind any icon; hover is smooth transform-only.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | exit 0 in worktree |
| eslint src | pass | 0 errors, 6 existing warnings |
| Server/client boundary self-check | pass | both rails are server components calling only plain modules; only SaveToggle is "use client" and is rendered, never called |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged and wired 2026-10-17 (ClubsRailV2, GuidesRailV2). Follow-up: align club cards with GA-032 findings (Request trial, Ask for fees, omit empty fields).

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
