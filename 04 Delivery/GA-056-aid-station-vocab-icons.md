---
id: GA-056
type: task
status: ready
priority: P3
owner: discovery-ui
branch: codex/ga-056-aid-station-vocab
worktree: D:\project\goathletix-wt\fe-ga-056-aid-station-vocab
scope: [goathletix-frontend/src/components/event/vocab.tsx]
acceptance: []
depends_on: []
related: [GA-055]
---

# GA-056 Aid-station vocabulary icons: cover the real seed values

## Why

The migration-0026 seed (`supabase/seeds/0001_event_page_showcase.sql`) writes aid-station services
like `banana`, `orange`, `gel`, `salted biscuits`, `dates`, `soup`, `noodles`, `drop bag`. The current
vocabulary in `src/components/event/vocab.tsx` only knows a few of those (`water`, `electrolyte`,
`food`, `fruit`, `energy_gel`). The rest fall back to the generic `Check` icon, which looks sloppy on
the Course section's aid-station list. Give each real value a meaningful lucide icon so the row reads
at a glance.

## Settled facts (do not re-investigate)

- The seed uses lowercase values; some have spaces (`"salted biscuits"`, `"drop bag"`). `vocabLabel`
  already preserves free-text values with spaces; `VocabIcon` falls back to `Check` on unknown keys.
- `humanize("drop_bag")` yields "Drop bag"; keep display labels consistent with that style.
- The vocabulary is a Record keyed by snake_case. For free-text with a space, add BOTH the snake_case
  key AND an alias with the exact spaced string so `V[k]` matches whichever shape arrives.
- Icon library is `lucide-react`. Only use icons that exist in the lucide set (check with the
  existing imports in the file).
- The vocab is shared across inclusions, amenities, documents, gear, checkpoint services, meals, and
  women's safety — do not break existing keys.

## What to add

Add vocabulary entries for the aid-station food/drink items the seed writes, plus the small handful
of adjacent items any real seed is likely to include. Minimum set (snake_case key + spaced alias
where it differs):

- `banana`
- `orange`
- `gel` (alias of `energy_gel`)
- `salted_biscuits` + `salted biscuits`
- `dates`
- `soup`
- `noodles`
- `drop_bag` + `drop bag`
- `oranges` (plural variant some organisers use)
- `cola`
- `coffee`
- `tea`
- `biscuits`
- `salt`

For each, pick a lucide icon that reads at a glance. Suggested starting points (verify each exists):
`Banana`, `Citrus` (for orange), `Zap` (for gel; mirrors existing `energy_gel`), `Cookie` or
`CookieBite` (biscuits), `Grape` or `Citrus` (dates — pick the closer one), `Soup`, `Utensils`
(noodles), `Luggage` (drop bag; already used for `baggage`), `GlassWater` (cola), `Coffee`,
`Croissant` (biscuits), `Droplet` (salt). If a listed lucide name doesn't exist, pick the closest
one that does and justify it in the handoff.

## Scope and ownership

- Owned: `goathletix-frontend/src/components/event/vocab.tsx` only.
- Out of scope: any other file, any CSS, any component, the seed SQL, any backend code.

## Acceptance criteria

- [ ] Every key above has a vocabulary entry with a label and a lucide icon.
- [ ] Both snake_case and spaced-alias forms added where the seed writes the spaced form.
- [ ] Imports updated at the top of the file; nothing removed from the existing icon list.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npx eslint src/components/event/vocab.tsx` passes with 0 errors.
- [ ] A short grep shows no new `Check` fallbacks for the listed keys at runtime (optional, best-effort).

## Rules

- No shell scripts, no browser, no server start — this is a pure file edit + tsc + eslint.
- Do not run `npm install` inside the worktree (node_modules is a junction).
- Commit on `codex/ga-056-aid-station-vocab` with message:
  `feat(event): aid-station vocabulary icons (banana, orange, gel, soup, noodles, …)`
  ending with `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`.
- Do NOT push; coordinator merges.

## Handoff

Short handoff at `07 Agent handoffs/GA-056-discovery-ui.md`:
- Keys added, their chosen lucide icon, any lucide name you had to swap because it does not exist.
- tsc and eslint exit codes.

## Verification

| Check | Command | Result |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | exit 0 |
| Lint | `npx eslint src/components/event/vocab.tsx` | exit 0, 0 errors, 0 warnings |
| Icon names exist in lucide-react | grep of lucide-react d.ts | all exist, no swaps |
| Browser check | not run (out of scope per task rules) | not run |
