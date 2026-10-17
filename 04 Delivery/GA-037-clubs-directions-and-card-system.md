---
id: GA-037
type: task
status: done
priority: P1
owner: discovery-ui
branch: codex/ga-037-clubs-directions
worktree: D:\project\goathletix-wt\fe-ga-037-clubs-directions
scope: [ClubsRailV2.tsx, GuidesRailV2.tsx, ClubsGuidesV2.css, SaveToggle.tsx, club and guide entries in sampleContent.ts]
acceptance: []
depends_on: [GA-030, GA-032]
related: []
---

# GA-037 Club cards: Directions, no "Sample listing", research fields; guides on the type system

Read [[08 Runbooks/Agent brief - frontend]], [[01 Product/Card design principles]] (tokens in `src/app/card-tokens.css`) and
[[01 Product/Club and academy listing research]] first. Do **not** edit `globals.css`, `Sections.tsx` or `page.tsx`.

## Owner feedback

1. **"Add a direction option in Clubs & academies near you if someone puts the location of the academy."** Each club may have a location
   (`area` and `city`, optionally `lat` / `lng` or a free-text `address`). When it does, show a **Directions** action (map-pin or navigation icon)
   that opens Google Maps directions in a new tab: `https://www.google.com/maps/dir/?api=1&destination=<url-encoded query>` where the query is
   `lat,lng` if present, else `name, address or area, city`. `target="_blank"` with `rel="noopener noreferrer"`. It is a real link, not a disabled
   button. When no location exists the action is omitted (never a dead button). Add the optional fields to the sample type and give the four sample
   clubs plausible area names already present (do not invent street addresses: use area plus city).
2. **Remove the words "Sample listing"** from the cards. (The rail header's pending tag already marks the section as sample data; keep that.)
3. **Type system:** apply the five text roles from the principles note to club cards and guide cards. Today the club card mixes 18, 14, 13, 12.5
   and 12 px; the guide card mixes others. Use `title` for the name, `body` for the fact rows and fee, `meta` for second lines and facility labels,
   `chip` for pills and tags, `eyebrow` for the type label, one `stat` at most (the rating may use body weight, it is not a stat).
4. Follow the research note where it is cheap: primary action "Request a trial" (disabled, marked Soon, same visual weight as other buttons) plus
   Directions and Save; show "Ask for fees" when a club has no fee; omit any field with no data.

## Scope and ownership

- Owned: the files in the scope line. In `sampleContent.ts` edit only the club and guide entries and their types (another task edits the sample **event** cards in the same file: do not touch those hunks).
- Out of scope: everything else.

## Acceptance criteria

- [ ] Directions link present exactly when a location exists, correct URL encoding, opens a new tab.
- [ ] "Sample listing" text gone from club cards.
- [ ] Club and guide cards use only the type roles; no ad-hoc sizes.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | 0 errors |
| eslint src | pass | 0 errors, 6 existing warnings |
| Server/client boundary self-check | pass | directionsUrl is in plain lib/clubDirections.ts; SaveToggle remains the only client file |
| Loaded in a browser | not run | coordinator, after merge |

## Outcome

merged 2026-10-17; actions later stacked because two buttons clipped in a 320 px card.

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
