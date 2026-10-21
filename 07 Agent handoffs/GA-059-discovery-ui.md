# GA-059 handoff (discovery-ui)

Branch `codex/ga-059-ticket-card-redesign`, not pushed.

## Files changed
- `goathletix-frontend/src/components/event/EventTickets.tsx` - TicketCard only (plus `KIND_LABEL` const and lucide imports). New structure: header (eyebrow + status pill), title with category pills + description, `.ev-tfacts` fact strip, Included / Not included rows, then unchanged price, deposit, capacity, `.ev-trev`, stepper.
- `goathletix-frontend/src/components/event/event.css` - new `.ev-tcard-head`, `.ev-tpill`, `.ev-ttitle`, `.ev-tcats`, `.ev-tfacts`, `.ev-tfact`, `.ev-tinc`, `.ev-texc`; removed dead `.ev-out`, `.ev-timed`, `.ev-tage`, `.ev-facts`; reduced-motion redeclare for the icon colour transition.

## Judgement calls
- Status pill: sold out = danger tint; "Last few" (left <= 5) and "N spots left" (<= 20) = accent tint via color-mix; Timed = info tint; Not timed = muted. Spots-left takes priority over Timed, so a low-stock timed ticket loses its Timed pill.
- Eyebrow = sport name + (distance, else team label, else kind label). Pills show distance/gender/team, so distance can appear twice (eyebrow and pill); kept per brief.
- Fact order: Entry, When, Eligibility, Format, Cut-off; first 4 kept. Entry and When always exist (When falls back to "Flag-off with event"), so min 2. Cut-off is dropped when all of the other four exist. Session dates beat startTime for When.
- Entry: spectator -> "Spectator pass", add_on -> "Add-on", team range -> "Pair · 2 players" / "Team of N" / "Team of A to B", else "Solo entry".
- Format: racquet = scoring + tournament_format; trek = "Multi-day batch"; else course_type + surface + court_surface. Omitted when empty.
- Age category chips (when no numeric age rule) kept below the strip.
- Not browser-verified (no dev server allowed).

## Results
- `npx tsc --noEmit`: exit 0
- `npx eslint src/components/event`: exit 0, 0 warnings
- `!important` comma grep: empty
