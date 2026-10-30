# GA-063 handoff: distance tabs, sticky selection bar, poster numerals

Changed (goathletix-frontend): `EventTickets.tsx`, `TicketFinder.tsx`, `TicketPicker.tsx` (new), `TicketStepper.tsx` (deleted),
`event.css`, comment in `EventPage.tsx`.

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | pass, no output |
| `NODE_OPTIONS=--max-old-space-size=4096 npx eslint src/components/event` | pass, no output |
| `grep -nE '!important\s*,' src/components/event/*.css` | empty |
| Browser, Tata sample 1440px | pills All/42.2/21.1/10/6 km, Select shows bar, quantity and total |
| Browser, Tata sample 390px | no horizontal scroll, bar 144px tall, sold-out row has no Select |
| Browser, badminton sample (12 categories) | opens on Singles (10), gender/age filters kept |
| Dark mode, tablet width | not run |

Risks: the bar is only on platform ticketing; external is unchanged. Awwwards/Mobbin could not be read, so this is
design judgement, not research.
