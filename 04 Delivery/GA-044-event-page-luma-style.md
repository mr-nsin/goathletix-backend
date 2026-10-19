---
id: GA-044
type: task
status: ready
priority: P0
owner: discovery-ui
branch: codex/ga-044-event-page
worktree: D:\project\goathletix-wt\fe-ga-044-event-page
scope: [new src/app/events/[id]/page.tsx, new src/components/event/**, src/lib/api.ts (add one function), new src/lib/eventDetails.ts, src/lib/sampleContent.ts (sample detail data only), src/components/home/EventCard.tsx (href only)]
acceptance: []
depends_on: [GA-043]
related: [ADR-007]
---

# GA-044 The event page, Luma style: media left, information right, ticket options below

Read [[08 Runbooks/Agent brief - frontend]] and [[01 Product/Card design principles]] first. Do **not** edit `globals.css`,
`Sections.tsx` or the homepage `page.tsx`. Put styles in your own CSS files under `src/components/event/`.

## Owner request

"Design the individual event page. When opened it should look like Luma's event page. Left side: event images, past event images,
videos, social media icons. Right side: all the event information. Then at the bottom: the different purchase options, based on the
different ticket prices defined, with complete information."

## Data (the backend task GA-043 adds this endpoint in parallel; code against this exact contract)

`GET {API}/events/:id/details` returns `{ data: { event, organizer, ticket_types, media, faqs, schedule } }`; the full shape is in
`04 Delivery/GA-043-event-details-endpoint.md` (read it). Add `getEventDetails(id)` to `src/lib/api.ts` next to `listEvents`, using
its `getJson` helper (null on any failure), and normalise into typed camelCase in a new plain module `src/lib/eventDetails.ts`.
Treat every field as optional (the endpoint may omit absent columns). The live data today: events have poster, dates, city, venue,
distances, price range, age categories, organiser; **ticket_types, media, faqs and schedule are usually empty** (synthetic seed data).

Two routes are needed:
1. `/events/<uuid>`: real events from the API. If the endpoint 404s or fails, fall back to `GET /events/:id` (exists today) so the
   page still renders the basics; if that also fails, `notFound()`.
2. `/events/sample-<slug>` when `SHOW_SAMPLE` is on: a fully populated SAMPLE event from `src/lib/sampleContent.ts` (add one
   `SAMPLE_EVENT_DETAIL`, built on the existing sample "Tata Mumbai Marathon 2027" card data, clearly flagged as sample in the UI with the
   existing pending-tag style), so the design can be judged with real-looking ticket tiers, past-edition photos and a video. Use only
   local images already in `public/` (posters, cities, hero) for sample media; for a sample video, either link to a real CC-licensed
   clip on Wikimedia Commons (find it via the MediaWiki API using the network recipe in the brief, record licence in a comment) or
   render the video tile only when a URL exists. Never invent a playable URL.
   Also update `EventCard.tsx` so card titles link to `/events/<id>` for live events and `/events/sample-<slug>` for sample cards
   (only the `href`; do not touch the card design).

## Design (follow these; they come from Anthropic's frontend-design skill the owner asked us to use)

- Ground it in the subject: a sports event in India. The most characteristic thing is the event itself: its photo, date and distances.
- Luma's structure, our brand: a calm two-column page. **Left column (about 40%, sticky on desktop):** the cover image (large, rounded,
  square or 4:5), then "Past editions" photo grid (from `media` with `edition_year` older than the event year; open a simple lightbox),
  "Videos" (tiles with a play affordance; YouTube URLs embed in a lightbox with youtube-nocookie, other URLs open in a new tab),
  then the organiser block with social icons (Instagram, website, organiser page) using the bundled brand icons in `src/lib/socialIcons.json`
  only when a URL exists. **Right column (about 60%):** a quiet eyebrow (sport, Official/verified badge), the title, a Luma-style date
  tile (month over day) with weekday and time, a location tile (venue, city, state) with "Directions" (Google Maps link), "Hosted by"
  organiser with avatar, the registration status line and the primary action, the About text (description), a details grid
  (distances, age groups, difficulty, terrain, elevation, start time, cut-off), schedule and FAQ (accordions) when present, and a
  share action. **Below both columns, full width: "Tickets"**: one card per ticket type (label, distance, age groups, gender, start
  time, cut-off), the current price with the tier name (Early bird / Regular / Late) and the next tier and its date shown as "then Rs X
  from 12 Nov", capacity remaining as a quiet bar only when capacity exists, sold-out state, and a quantity stepper capped at
  `max_tickets_per_order`. Payments do not exist yet: for `ticketing_mode = 'platform'` the buy button is disabled "Checkout coming
  soon"; for `'external'` there is one clear "Register on organiser site" link (registration_url) and the ticket cards are information only.
  If an event has no ticket types, show one honest card from `price_range` ("Entry from Rs X") plus the register link.
- One orchestrated moment only (for example the cover and title settling on load); motion that answers a user action (lightbox,
  accordion, stepper) is welcome; transform/opacity only; visible with reduced motion ON (see the brief). No fade-up on every block.
- Card type roles from the principles note; the page title can be larger (it is a page, not a card): clamp(28px, 4vw, 44px).
- Never invent data: hide any block with no data. Real events today will mostly show the basics: that must still look complete and calm.
- Mobile (375 px): one column in this order: cover, title and date/location, primary action, about, tickets, media, organiser.
- Next 16: `params` is a Promise; the page is a server component; lightbox, stepper and accordions are small client components.
  Server/client boundary rule from the brief applies. Add `generateMetadata` (title, description, og:image from poster).

## Acceptance criteria

- [ ] `/events/<uuid>` renders a real event (basics) with the fallback chain; `/events/sample-<slug>` renders the full design.
- [ ] Left media column, right info column, full-width tickets below; mobile order as specified.
- [ ] Ticket cards with tiers, next-tier note, capacity, sold-out, stepper; honest checkout state per ticketing mode.
- [ ] Event cards link to the event page.
- [ ] `npx tsc --noEmit`, `npx eslint src`: 0 errors; no invalid CSS (`!important` only at the end of a declaration).

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| tsc --noEmit | pass | `npx tsc --noEmit` in the worktree, exit 0, no output (2026-10-19) |
| eslint src | pass, 0 errors | `npx eslint src`: 0 errors, 6 warnings, all pre-existing in files GA-044 does not touch (CategoryGrid, EventsDirectory, LiveTicker, Footer) |
| Server/client boundary self-check | pass | Client files: MediaGallery, TicketStepper, ShareButton (import only react, next/image, lucide). Server files (page, EventPage, EventTickets, OrganizerCard) only render them with serialisable props and import a type from MediaGallery; no function from a client file is called on the server. eventDetails.ts, sampleContent.ts, format.ts are plain modules |
| Invalid CSS grep `!important\s*,` | pass | no matches in src/components/event/event.css |
| Normaliser / pricing smoke test | pass | jiti script against src/lib/eventDetails.ts: sample tiers (Early bird 2,400, then 2,900 from 1 Nov), capacity left 1,120 of 14,000, 10K sold out, IST schedule times, `?mode=external` override, basics-only sample card, placeholder fields dropped on live rows |
| Loaded in a browser | not run | coordinator, after merge (real renders with headless Edge) |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
