# GA-056 handoff (discovery-ui)

Changed: `goathletix-frontend/src/components/event/vocab.tsx` only (branch `codex/ga-056-aid-station-vocab`).

| Key | Icon |
| --- | --- |
| gel | Zap |
| banana | Banana |
| orange, oranges | Citrus |
| salted_biscuits, "salted biscuits", biscuits | Cookie |
| dates | Grape |
| soup | Soup |
| noodles | Utensils |
| drop_bag, "drop bag" | Luggage |
| cola | CupSoda |
| coffee, tea | Coffee |
| salt | Droplet |

Name swaps: none. All suggested lucide names exist. Cola uses CupSoda instead of the suggested GlassWater (closer match); Croissant was not used.

Verification: `npx tsc --noEmit` exit 0; `npx eslint src/components/event/vocab.tsx` exit 0, 0 warnings. Browser not run.
