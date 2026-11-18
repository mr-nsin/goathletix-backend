---
type: reference
status: applied to the live database 2026-11-12 (run by hand), verified, search load-tested
date: 2026-11-12
related: ["01 Product/Registration form fields by sport.md", "03 Decisions/ADR-007-discovery-plus-ticketing.md", "supabase/migrations/20261112000027_registrations.sql"]
tags: [architecture, data-model, ticketing, search, qr]
---

# Registrations data model

How a booking is stored, how a person is found quickly, and where the QR code lives. Migration `20261112000027_registrations.sql`; backend `src/registrations/`.

## The four tables

A booking is four separate things, each in its own table, so each can be queried, indexed and kept on its own:

| Table | One row per | Holds |
| --- | --- | --- |
| `orders` | checkout | The booking contact (name, email, mobile; guest checkout, `user_id` may be null), the totals, the status (`pending_payment` until paid), an `idempotency_key` |
| `tickets` | seat | The category, the price paid, the status (`reserved` until paid, then `confirmed`, `checked_in`...), the **QR code** (`qr_token`, `qr_payload`, `qr_svg`) and the human `ticket_number` |
| `participants` | seat | The person on the ticket: name, email, mobile, gender, **date of birth**. Linked 1:1 to the ticket |
| `registration_answers` | answer | One row per answer to a question: `field_key`, the label and type **as asked**, a searchable `value_text`, the structured `value_json`, and `is_sensitive` |

`payments` (already in the schema, migration 0021) hangs off `orders`. It is not written yet; see "Payments, later".

`participants` carries `event_id`, and `tickets (participant_id, event_id)` is a composite foreign key to it, so a ticket can never point at a person from another event. The old `tickets.attendee_*` and `tickets.form_answers` columns are deprecated (commented) and no longer written.

## Organiser-defined questions

The organiser dashboard (not built yet) will edit `event_form_fields`. Answers are saved against those questions as they were asked:

- Each answer row stores `field_key`, `field_label` and `field_type`. Renaming or deleting a question later never rewrites or orphans what a participant answered.
- `field_id` links to the organiser's `event_form_fields` row when there is one; built-in questions (sport presets, and ones a ticket implies, such as a doubles partner or a guardian for a minor) have no row and keep fixed keys and labels (`BUILT_IN_FIELDS` in `registrations.logic.ts`).
- The server validates each answer against the organiser's field: required or optional as the organiser set, checked by type, and select options must be ones offered. A field scoped to a ticket type (`category_id`) applies to that type only.
- Medical and emergency answers (`blood_group`, `emergency_contact`, keys starting `medical`, `allerg`, ...) are stored with `is_sensitive = true`. RLS shows them to organiser admins and the participant only; staff and broad exports do not get them.

## QR code

- `tickets.qr_token`: 128 random bits as hex, unique (the index is the scan lookup). It is never derived from the ticket id.
- `tickets.qr_payload`: exactly what the code encodes, `GA1.<qr_token>` (a version prefix, so the format can change safely).
- `tickets.qr_svg`: the rendered code, about 3 KB, generated on the server with `uqr` and stored with the ticket, so the ticket page, the email and a wallet pass all show the same image without regenerating. The ticket page shows it as an `<img>` with a data URI, so it cannot run script.
- Library choice (2026-11-12): `uqr`, zero dependencies, 77 KB, about 10M downloads a week, works in Node and in the browser, about 0.5 ms a code. Alternatives weighed: `qrcode` (most used, but three dependencies and Node-first), `@paulmillr/qr` (best audit pedigree, includes a decoder, but pre-1.0), `qrcode-generator`, `qrcode-svg` (not updated since 2022). Every code from `uqr` was decoded with macOS Vision in testing.
- Scanning (check-in) is not built: it will look up `qr_token` and require the ticket to be `confirmed`.

## Booking flow (POST /registrations)

1. The page sends what the buyer typed: the contact, and for each seat the category, the participant and the answers. It does **not** send prices.
2. The backend loads the event (public and published only), the categories with their price tiers, and the form fields. It checks the registration window, the per-order limit, each participant's age and gender against their category, and each answer against the organiser's questions, then computes every price and the totals itself.
3. If the page sent `expected_total_inr` and it differs from the real total, the booking is refused with `PRICE_CHANGED` (nobody pays an unexpected amount).
4. It makes a QR token per seat and renders the code.
5. It calls `create_registration(p jsonb)` once. The function holds the seats, then inserts the order, each participant, ticket and answers, **in one transaction**: a booking is complete or absent. Seats are held with one conditional update on `event_categories.slots_taken`, so the last seat can only go to one buyer (`SOLD_OUT`). A repeated `idempotency_key` returns the existing order. The ticket number is built in the database as `<order number>-<seat>`.
6. Today the order is `pending_payment` and the tickets `reserved` (no payment provider yet, ADR-007).

Sample events (`sample-...`) are not in the database; the checkout keeps its local preview for them.

## Fast search for a person

Everything people are looked up by is in one generated column, `participants.search_text` (name, email, last 10 digits of the mobile, lower-cased), with one trigram index that includes `event_id`, so "who is Asha" inside one event is a single index lookup, however many events there are.

| Lookup | Served by |
| --- | --- |
| Name, part of a name, part of an email, mobile in any format | `idx_participants_search` (GIN: `event_id`, trigram on `search_text`) |
| Exact mobile (last 10 digits) | `idx_participants_event_phone` |
| Email, name prefix | `idx_participants_event_email`, `idx_participants_event_name` |
| Ticket number, QR token, bib | `tickets_ticket_number`, `tickets.qr_token` (unique), `tickets_bib_per_event` |
| Order number, booking contact | `orders.order_number` (unique), `idx_orders_search` (trigram), `idx_orders_buyer_email`, `idx_orders_buyer_phone` |
| Everyone in a category, who checked in | `idx_tickets_event_category`, `idx_tickets_event_status` |
| Who answered X to question Y (for example blood group O+) | `idx_answers_event_field` (`event_id`, `field_key`, `lower(value_text)`); contains-search on `idx_answers_search` |
| A person's seats and answers | `tickets_one_per_participant`, `idx_answers_participant` |

`search_participants(event, query, limit)` wraps this: it escapes the query (`%` and `_` match literally), accepts any phone format, matches a ticket number, bib or scanned token exactly, and returns the best matches first. Both it and `create_registration` are executable by the service role only.

There is **no HTTP route for search yet, on purpose**: it returns personal data, so it waits for organiser sign-in and the organiser dashboard.

## Payments, later

`payments` (order, provider, provider order and payment ids, amount, status, method) is already linked to `orders`, so adding a provider needs no change to these tables: create a `payments` row per attempt, and on capture set the order `paid`, its tickets `confirmed`, and release nothing (seats were held at booking). To add when payments go live: a unique index on `(provider, provider_payment_id)` for webhook idempotency, and a job that releases seats held by unpaid orders after a timeout (`tickets.reserved_until`, `slots_taken`).

## Tested

- Migration and function, in a transaction that was rolled back, against the live schema: a two-seat booking (order `pending_payment`, 2 seats counted); the same idempotency key returns the same single order; a booking past capacity is refused with `SOLD_OUT` and leaves nothing half-written; search by name, mobile in a different format, part of an email, ticket number and scanned token each found the right person; `%` is matched literally; an answer lookup by field found the right person with the sensitive flag kept.
- `src/registrations/registrations.logic.spec.ts`: 16 tests (IST dates, age on event day, tier pricing, GST, answers by type and organiser field, sensitive flags, QR token and SVG).

- After applying (rolled-back transactions on the live DB): 100,000 participants across two events. `search_participants` took about 1 ms warm (first call 38 ms cold) for a name plus number, a common name (6,000 matches, limit 25), a mobile in another format and part of an email. The planner uses `idx_participants_search` (bitmap scan, 2-8 ms for the raw query). At 10,000 rows in one event the planner prefers a sequential scan, which is correct at that size. Also used their indexes: exact mobile (`idx_participants_event_phone`), ticket number (`tickets_ticket_number`), answers by field (`idx_answers_event_field`, 2,018 matches in 3 ms).
- Booking write speed: 10,000 tickets inserted in one statement took 41 s, mostly the `refresh_ticket_counts` trigger recounting the category on every insert. Real bookings are 1-10 seats, so this does not matter, but do not bulk-import tickets in one statement without reviewing that trigger.

Not yet tested: a booking made through the HTTP endpoint (no platform-ticketed event exists in the data yet).

## Applying it

Applied to the live database on 2026-11-12 by hand (the automated apply was blocked by the permission system). Verified afterwards: tables, columns, 18 indexes, both functions (execute for `service_role` only), RLS, extensions and the migration history row.

## Open items

- Rate limiting and bot protection on `POST /registrations` (a public endpoint that writes rows): add `@nestjs/throttler` and a captcha or OTP before launch.
- Private and unlisted events: bookings are limited to public, published events for now.
- Promo codes and the platform fee: `discount_inr` and `fee_inr` are 0 (fee model undecided, ADR-007).
- Release of unpaid holds, check-in scan endpoint, organiser search route, and the organiser form builder.
