---
id: GA-039
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-039-finish-alerts
worktree: D:\project\goathletix-wt\fe-ga-039-finish-alerts
scope: [src/components/layout/ClosingBanner.tsx, src/components/layout/flow.css, src/components/home/AlertsForm.tsx, src/components/home/AlertsForm.css, src/components/layout/Footer.tsx (only if needed), new files]
acceptance: []
depends_on: [GA-026, GA-031, GA-038]
related: []
---

# GA-039 One "finish line" section: alerts signup inside the banner, Email or WhatsApp, better animation

Read [[08 Runbooks/Agent brief - frontend]] and [[01 Product/Card design principles]] first. Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx`
(the coordinator removes the separate alerts section from `page.tsx` after merging).

## Owner request

"Combine these two into one, give some animations, and when I press Get alerts the animation is not good. Show Email / ---- OR ---- / WhatsApp and improve the designs."
The two blocks are today the white rounded "Never miss race day" card (`AlertsSectionV2.tsx` + `AlertsForm.tsx`) and the dark photo "Your next finish line is waiting"
banner (`ClosingBanner.tsx`). Make them **one** section: the dark finish-line banner carries the alerts signup. After the merge there is one headline, one
supporting line, the signup, and the three actions (Find events, List your event, Host a training Soon). The separate alerts card disappears.

## Design brief

- **Layout:** the banner stays full content width with the photo and checkered finish ribbon. Left: headline and one line of copy. Under it the signup. Right: the three action buttons
  (keep them). No second card, no white strip. Decide how the signup sits so the section stays calm and the signup reads as the main conversion. It must still look good at 375 px (stack).
- **Signup flow (client component `AlertsForm`), replacing the old Email/Phone choice:**
  1. Initial state: a single prominent "Get alerts" button.
  2. On click, the button **morphs** (width/shape change by transform and opacity, no layout jump) into the chooser: two large option buttons, **Email** (envelope icon) and **WhatsApp**
     (message icon, brand green accent), separated by a centred divider with the word **OR** (a line, "OR", a line; vertical divider on wide layouts, horizontal when stacked).
  3. Choosing an option slides the chosen option into an input row: email field, or WhatsApp number with a fixed +91 prefix (10 digits starting 6 to 9). One **Send** button; a small
     Back control returns to the chooser. The other option collapses away smoothly.
  4. Send validates with plain messages. There is still no provider or table, so a valid send ends in an animated confirmation state (a check that draws itself) with the honest text
     "Alerts are not live yet, nothing was saved. Check back soon." and no network call.
- **Animation principles** (from the frontend-design skill the owner asked us to consult; follow them):
  - One orchestrated moment beats scattered effects: when the section scrolls into view, play ONE sequence (headline lines rise in, the checkered ribbon sweeps across, the signup button settles). Nothing else loops or pulses.
  - Motion that answers a user action is welcome and should show what changed: the Get alerts morph, the OR chooser appearing, the chosen option sliding into the input, the check drawing. Make these feel physical:
    shared easing `cubic-bezier(.22,.61,.36,1)` (or a gentle spring via `linear()` easing), 260 to 420 ms, animate only transform and opacity (use `grid-template-rows 0fr to 1fr` or measured max-height for
    the height change, or reserve the height up front so nothing jumps), stagger the two options by about 60 ms, use `transform-origin` at the clicked button.
  - Focus moves to the new control on every step; `aria-live` for the result; fully keyboard operable.
  - The owner's machine has reduced-motion ON and wants to see the motion: re-declare the animations with `!important` inside a reduced-motion block (precedent in the brief) while keeping them short and small.
  - The earlier build's problem: the transition felt abrupt (elements appear/disappear). Fix that by making state changes continuous (morph/slide), not mount/unmount flashes.
- Honest content only: no invented numbers or claims; keep the pending nature visible with a small caption such as "Alerts launch soon" inside the section (replaces the old NO PROVIDER YET tag).
- Card/type rules: headline and copy sizes follow the roles where they apply (body 14 to 16 for copy here is acceptable on a banner; chips 12; buttons 14.5). New text sizes must come from the tokens.

## Scope and ownership

- Owned: the files in the scope line, plus new files you create (for example `FinishLine.tsx`/`.css`). You may rewrite `AlertsForm.tsx` and its CSS. You may leave `AlertsSectionV2.tsx` in place unused (the coordinator deletes it) or stop exporting it.
- Out of scope: `globals.css`, `Sections.tsx`, `page.tsx`, other sections, backend.
- Server/client boundary: `ClosingBanner` is a server component rendered by `Footer`; only `AlertsForm` (and anything with state) is a client component.

## Acceptance criteria

- [ ] Alerts signup lives inside the finish-line banner; the separate alerts card is no longer needed (no duplicate headline).
- [ ] Get alerts morphs into Email | OR | WhatsApp chooser; choosing slides into the input and a Send button; Back works; valid send shows the animated honest confirmation.
- [ ] WhatsApp number validation (+91, 10 digits starting 6 to 9); email validation; plain messages; focus management; `aria-live`.
- [ ] Section entrance is one orchestrated sequence; reduced-motion block keeps it visible.
- [ ] Works at 375 px, 1440 px, dark mode; `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | 0 errors, no output |
| eslint src | pass | 0 errors, 6 pre-existing warnings |
| Server/client boundary self-check | pass | ClosingBanner (server) only renders client components FinishLineReveal and AlertsForm, calls no client export |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged 2026-10-17; separate alerts card removed; chip width and phone-width Send row fixed after real renders.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
