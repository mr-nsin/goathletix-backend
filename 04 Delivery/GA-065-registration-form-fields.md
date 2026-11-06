---
id: GA-065
type: task
status: ready-for-review
priority: P1
owner: discovery-ui + events-api
branch: codex/ga-065-registration-form-fields
scope:
  - goathletix-frontend/src/lib/registrationFields.ts (new: field catalogue, sport presets, validation)
  - goathletix-frontend/src/lib/checkout.ts, src/lib/eventDetails.ts (form_fields passthrough)
  - goathletix-frontend/src/app/events/[id]/checkout/page.tsx
  - goathletix-frontend/src/components/checkout/** (render fields from config)
  - goathletix-backend/src/events/events.service.ts (+ spec): `form_fields` in /events/:id/details
acceptance: []
depends_on: [GA-064]
---

# GA-065 Registration form fields per sport, organiser-ready

## Owner request (2026-11-05)
"Check on IndiaRunning what information is required to fill; we need to take that much input, and later these can be
configured by organisers based on the type of sport event they host."

## Research
`01 Product/Registration form fields by sport.md`. IndiaRunning hides the attendee form behind phone OTP, so its inner
field list was not read directly; the catalogue combines its visible flow with Procam and Vihaya sources.

## Scope
1. A field catalogue typed to `event_form_fields.field_type`, and presets per `sport_type`.
2. Checkout renders participant fields from config: event `form_fields` (organiser) when present, else the sport preset;
   T-shirt and qualifying fields added from the ticket; guardian fields when the participant is under 18.
3. `/events/:id/details` returns `form_fields` (sorted, isolated like other child tables).
4. Answers go to `form_answers` keyed by `field_key` in `orderDraft()`.

## Out of scope
Organiser builder UI, file storage (file fields keep the file name only in the preview), ID numbers (never collected).

## Verification
| Check | Result |
| --- | --- |
| backend jest + lint | pass (39/39) |
| frontend tsc + eslint | pass |
| Checkout per sport sample (running, cycling, trek, badminton) + under-18 | pass (see handoff) |
| Organiser rows end to end | not run (no rows yet) |
