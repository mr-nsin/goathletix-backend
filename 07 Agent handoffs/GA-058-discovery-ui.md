# GA-058 handoff (discovery-ui)

Branch `codex/ga-058-event-page-interactivity`. Not pushed.

## Files changed
- `src/components/event/SectionReveal.tsx` (new, client): renders the `<section>` and sets `data-rv`.
- `src/components/event/EventSections.tsx`: `Section` now returns `SectionReveal`; checkpoint list rebuilt as a rail timeline (`.ev-cp-dot`, `.ev-cp-head`, icon-only `.ev-cp-services`; rail only when some cut-off exists).
- `src/components/event/EventTickets.tsx`: `SectionReveal` for the tickets section; savings ribbon, percent label, `--fill` var for the bar, `.ev-trev` disclosure.
- `src/components/event/TicketStepper.tsx`: `changed` state and keyed `.ev-sweep` total (outside the listed scope, needed for the colour sweep; the note said "tiny client-side touch").
- `src/components/event/event.css`: all styles, keyframes, reduced-motion re-declarations.

## Reveal strategy: IntersectionObserver (option B)
Chosen for reliability; `animation-timeline: view()` is not in Firefox/Safari stable, and the fill bar and rail need an `is-in` style trigger anyway. Server markup is visible (no `data-rv`), so no-JS and first paint never hide content. After hydration: in or above viewport -> `seen` (no animation, the head already has the load moment); below -> `armed` (children hidden) then `in` (320ms rise, 40ms stagger).

## Judgement calls
- Above-fold sections get no extra animation (avoids flash after hydration).
- State is `data-rv` on the section rather than an `.is-in` class.
- Past/upcoming checkpoint distinction skipped (would need client JS).
- Disclosure repeats min/max age with the as-on date, plus docs and qualifying standard; the age chip stays.
- Sold-out cards: 70% opacity, price struck, no lift, no ribbon.
- Rail draw is 800ms as specified (the only animation over 400ms); dots scale in over 320ms.
- Old `.ev-cphead`/`.ev-cpclose` classes removed (no other users).

## Results
tsc exit 0; eslint exit 0 (0 errors, 0 warnings); `!important,` grep empty. Not run: browser check of the four showcase events.
