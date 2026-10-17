---
id: GA-031
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-031-partners-flow
worktree: D:\project\goathletix-wt\fe-ga-031-partners-flow
scope: [src/components/home/PartnersSection.tsx, PartnersSection.css, new src/components/home/AlertsSectionV2.tsx, src/components/layout/ClosingBanner.tsx, src/components/layout/Footer.tsx, new src/components/layout/flow.css]
acceptance: []
depends_on: [GA-025, GA-026]
related: []
---

# GA-031 Partners infographics and animated steps, alerts cleanup, one continuous flow to the footer

Read [[08 Runbooks/Agent brief - frontend]] first. Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx`.

## Goal (owner feedback)

1. **Partners section** ("Organise it. Equip it. Coach it."): add a little more information, infographics and numbers, and animate the steps. Steps should play as a sequence: first card "Step 1 Create your profile" appears, then a right-arrow animates (draws/travels) to Step 2, which appears, then the arrow to Step 3 (a connected timeline/stepper). Replay when the panel changes. Also consider more ideas such as a progress line that fills, numbered nodes that pulse once, count-up stat tiles, a mini bar/ring infographic (for example "events by month" or "sports covered") built with CSS/SVG from numbers the page really has (events, cities, states, sports, disciplines, upcoming); never invent numbers. The panels for sellers and coaches keep their honest "Soon" wording.
2. **Alerts section** ("Never miss race day"): remove the "Or get alerts on WhatsApp" link entirely. Create `AlertsSectionV2.tsx` (export `AlertsSectionV2`, same markup and behaviour as `AlertsSection` in `Sections.tsx`, read it, minus WhatsApp, still using `AlertsForm`), so the coordinator can swap it in.
3. **One continuous flow**: in the last part of the page three things look like three unrelated bands: the white "Never miss race day" strip, the dark photo "Your next finish line is waiting" banner, and the athlete strip. Make them read as one flow: same background family, shared side alignment, no hard white strip then dark block, softer transitions (a gradient bridge, an angled or curved divider, the banner sitting on the page background with rounded corners, spacing rhythm), and the athlete strip clearly the "finish area" under the banner. Keep every link. You own `ClosingBanner.tsx`, `Footer.tsx` (parade and made-in line only) and a new `src/components/layout/flow.css` (imported by Footer or ClosingBanner) which may restyle `.alerts`, `.alertsin`, `.closing`, `.parade`, `.madein` using selectors at least as specific as the existing ones in `globals.css` (READ them). The alerts section's wrapper markup is in your `AlertsSectionV2.tsx`.

## Scope and ownership

- Owned: files in the scope list above. Out of scope: `globals.css`, `Sections.tsx`, `page.tsx`, the footer columns, header, backend.

## Acceptance criteria

- [ ] Steps animate as a sequence with arrows between cards, replayed per panel; also usable and readable without motion (final state visible if animations do not run).
- [ ] Infographic and number additions use only real or clearly-labelled numbers; centred layout kept; `id="host"` kept.
- [ ] WhatsApp link gone from `AlertsSectionV2`.
- [ ] Alerts, banner and athlete strip read as one continuous section; works at 375 px and dark mode.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | 0 errors |
| eslint src | pass | 0 errors, 6 pre-existing warnings |
| Server/client boundary self-check | pass | AlertsSectionV2, ClosingBanner, Footer are server components and call no client-file functions; Timeline/CountUp live inside the existing client PartnersSection |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged and wired 2026-10-17 (AlertsSectionV2, no WhatsApp link).

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
