# GA-065 handoff: registration form fields per sport

Branches `codex/ga-065-registration-form-fields` in both repos, fast-forwarded into `feat/implement-main-page-mockup`.
Frontend `1506911`, `9efba27`; backend `d189b2f` (events-api subagent, Sonnet).

Changed:
- Backend `src/events/events.service.ts` (+ spec): `/events/:id/details` returns `data.form_fields` from
  `event_form_fields` (sorted by sort_order then created_at; `options` coerced to string[] or null; [] on failure).
  Item: `{ id, category_id, field_key, label, field_type, options, is_required, help_text }`.
- Frontend `src/lib/registrationFields.ts` (new): field types = `event_form_fields.field_type`, sport presets, ticket-implied
  fields (T-shirt, qualifying + timing certificate, doubles partner), guardian fields under 18, validation.
  `src/components/checkout/DynamicField.tsx` (new) renders any field type. `checkout.ts` attendees carry `answers`
  (→ `form_answers`); draft key bumped to `ga-checkout:v2:`. `eventDetails.ts` normalises `form_fields` → `formFields`.
- Vault: `01 Product/Registration form fields by sport.md` (research + catalogue).

| Check | Result |
| --- | --- |
| Backend `npx tsc --noEmit -p .`, `npx eslint --fix src/events`, `npx jest src/events` | pass, 39/39 |
| Frontend `npx tsc --noEmit -p .`, `npx eslint src/lib src/components/checkout src/app/events` | pass |
| Headless Edge: running (s-fm), cycling (b-300), trek (t-2), badminton doubles (bd-md) | each shows its sport's fields, completes to a booking; `form_answers` keyed by field key |
| Trek with DOB 2012 (age 14) | guardian name, mobile and consent appear and are required |
| Live `GET /events/<uuid>/details` | `form_fields: []` (no rows yet), no error in logs |
| Organiser rows overriding the preset, end to end | not run (no rows in the live table) |
| Dark mode, phone width for the new fields | not run |

Risks: file fields keep only the file name (no storage yet). IndiaRunning's inner attendee form is behind phone OTP and
was not read directly. Blood group is required in endurance/adventure presets; organisers can relax it once the builder
exists.
