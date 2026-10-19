---
id: GA-048
type: task
status: ready
priority: P1
owner: events-api
branch: codex/ga-048-details-fields
worktree: D:\project\goathletix-wt\be-ga-048-details-fields
scope: [goathletix-backend/src/events/**]
acceptance: []
depends_on: [GA-043, GA-046]
related: [GA-047, GA-049]
---

# GA-048 `GET /events/:id/details` v2: return the event-page columns that already exist

## Goal

The research (GA-046, `01 Product/Event detail fields by sport.md`) found that most of what organisers publish is **already stored**
(migrations 0014, 0016, 0022, 0023, 0025 are applied) but `/events/:id/details` does not return it. Add those existing columns and
the sponsors list. Do NOT select any column or table from the unapplied migration 0026 (GA-047): selecting a missing column makes
Supabase error.

## Contract additions (the frontend GA-049 codes against this; keep everything from GA-043 unchanged)

```
event: { ...existing,
  tagline, start_time, end_time, reporting_time, is_certified, certifying_body, is_chip_timed, timing_partner,
  altitude_m, course_map_url, aid_stations, amenities, safety_info, address_line, pincode, venue_notes,
  refund_policy, transfer_policy, deferral_policy, cancellation_policy, terms_text, waiver_text,
  tax_mode, gst_rate, waitlist_enabled, contact_email, contact_phone, whatsapp_url,
  bib_expo_opens_at, bib_expo_closes_at, certificate_available_at, results_url, rating_avg, rating_count, ... }
ticket_types[i]: { ...existing, description, includes, sales_start_at, sales_end_at, max_per_order,
  min_age, max_age, age_as_on_date, required_documents, qualifying_standard, team_size_min, team_size_max, eligibility_notes }
sponsors: [{ name, tier, logo_url, website_url }]   // [] when none; use the real event_sponsors column names
```

The column names above come from the research note. **Verify every one against the migration SQL** (grep the `supabase/migrations`
folder) and use the real names; for any that do not exist, leave them out and list them in the report. The frontend treats every
field as optional.

## Scope and ownership

- Owned: `src/events/**` (service, controller, spec). Out of scope: schema, migrations, `app.module.ts`, `main.ts`, package files, any DB write.

## Acceptance criteria

- [ ] The listed existing columns returned (snake_case), sponsors added (`[]` if none), nothing from 0026 selected.
- [ ] Spec updated: new fields pass through, sponsors ordering and empty array.
- [ ] `npm run build`, `npm test`, `npx eslint src/events` (no --fix) pass; record results.
- [ ] The coordinator will run a live smoke call after merge.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| npm run build | pass | `nest build` exit 0, no TS errors (worktree `be-ga-048-details-fields`, 2026-10-19) |
| npm test | pass | 2 suites, 27 tests passed (4 new GA-048 specs: column select, pass-through, sponsor ordering, sponsor missing-table/error) |
| eslint | pass | `npx eslint src/events --max-warnings=1000` (no --fix): 0 problems |
| prettier | pass | `npx prettier --check` on `events.service.ts` and `events.service.spec.ts`: clean |
| column check | pass | All 34 event columns, 13 ticket-type columns and `event_sponsors(name, tier, logo_url, website_url, sort_order, created_at)` grep-verified in migrations 0014, 0016, 0022, 0023, 0025; nothing from 0026 selected; none missing |
| live smoke | not run | Coordinator runs after merge |

## Handoff

Link the completed [[99 Templates/Agent handoff|agent handoff]] here.
