# Organizer & Seller platform — feature inventory + DB requirements

- **Date:** 2026-10-05
- **Primary source:** SPORTIFI organizer console (`sportifiindia.com/organizer`, authenticated walk-through) — the closest India-specific competitor to GoAthletix's hosting side. Plus deep research for the seller/marketplace side (GoAthletix has no direct analogue yet).
- **Updated 2026-10-12:** section 5 adds **coaches and academies hosting trainings** (requirement #61, ADR-008 proposed).
- **Purpose:** define the organizer + seller feature set GoAthletix must match or beat, and the DB tables/columns each needs. Cross-check against the applied `supabase/migrations` (0001–0023) and fill gaps.

---

## 1. Organizer console — feature inventory (from SPORTIFI)

SPORTIFI groups the organizer console into five areas. GoAthletix should offer **at least** these.

### Overview
| Module | Route | What it does |
| --- | --- | --- |
| **Cockpit** | `/organizer` | Dashboard: revenue (period selector), active events, settlements shortcut, "every module at a glance". |
| **Playbook** | `/organizer/playbook` | Guided how-to / onboarding checklist for organizers. |

### Race control (the core)
| Module | Route | What it does |
| --- | --- | --- |
| **New Event** | `/organizer/events/new` | 10-step event builder (detailed in §2). |
| **Events** | `/manage/events` | List/manage all events; per-event **workspace**; public event page link. |
| **Participants** | `/manage/participants` | Registrant list, filters, exports, uploaded documents. |
| **Task Manager** | `/manage/tasks` | Operational to-dos for an event. |
| **War Room** | `/war-room` | Race-day live ops (check-in, live stats). |
| **BIB Expo** | — | Bib number allocation + expo/collection window. |
| **Cancellations** | `/manage/cancellations` | Registration cancellations & refunds. |
| **Recycle** | `/manage/recycle` | Soft-deleted events/participants restore. |
| **Branding** | `/manage/branding` | Event-page branding (colors, logo, sponsors). |
| **Ticket Design** | `/manage/ticket_design` | Customisable ticket/bib layout ("Runner ID" vs "Booking ID"). |
| **Certificates** | `/manage/certificates` | Finisher e-certificate template + availability date. |
| **Waivers** | `/manage/waivers` | Liability waiver documents + acceptance capture. |
| **Forms** | `/manage/forms` | Reusable registration-form templates. |
| **Feedback & Insights** | `/manage/feedback` | Pre/post-event surveys, ratings, analytics. |
| **Integrations** | `/manage/integrations` | Timing systems, webhooks, 3rd-party apps. |

### Marketing
| Module | Route | What it does |
| --- | --- | --- |
| **Referrals** | `/manage/referrals` | Referral reward goals ("refer 3, get refund"), auto-refund via Razorpay. |
| **Affiliates** | `/manage/affiliates` | Affiliate partners with tracked links + commissions. |
| **Campaigns** | `/manage/campaigns` | Email/WhatsApp marketing campaigns. |
| **Social Kit** | `/manage/social-kit` | Shareable social creatives per event. |
| **Coupons** | `/manage/coupons` | Discount codes (%, flat, limits). |
| **Communicate** | `/manage/communicate` | Broadcast to participants (email/SMS/WhatsApp). |
| **Traffic** | `/manage/traffic` | Event-page traffic/analytics. |

### Finance
| Module | Route | What it does |
| --- | --- | --- |
| **Settlements** | `/manage/settlements` | Payouts owed/paid, fee breakdown, period view. |
| **Reports** | `/manage/reports` | Downloadable financial & registration reports. |

### Settings (per organizer account)
| Module | Route | What it does |
| --- | --- | --- |
| **Team** | `/organizer/team` | Invite teammates, roles/permissions. |
| **API Keys** | `/manage/api_keys` | Programmatic access tokens. |
| **Profile / KYC** | `/manage/profile` | Legal name, **GST (GSTIN)**, bank/Razorpay payout, contact. |
| **Notification Log** | `/manage/notif_log` | Audit of system notifications sent. |

**Platform-wide touches worth copying:** global search, "All Features" launcher, dark mode, install-as-app (PWA), AI "Race-Marshal" chatbot per event, "absorb platform fee" toggle, 18% GST handling with tax-invoice PDFs.

---

## 2. Event-creation data model (the 10-step builder)

| Step | Fields (→ columns) |
| --- | --- |
| 1 · Basics | `event_name`, `event_type` (Marathon…), `primary_category`, `visibility` (public/private), `start_at`, `end_at`, venue type (physical/online), `venue`, `venue_map_url`, `cover_image_desktop` (1600×600), `cover_image_mobile` (720×900), `social_share_image` (1200×630), `short_description`, `full_description`. |
| 2 · Registration & tickets | `registration_opens_at`, `registration_closes_at`, `bib_expo_opens_at`, `bib_expo_closes_at`, `certificate_available_at`; **tickets[]**: name, `price`, `status` (available/halt/sold_out), `min_age`, `max_age`, `capacity`, `deliverables[]`; flags: `absorb_fees`, `collect_document`, `gst_enabled`. |
| 3 · Contact | `organizer_contact_name`, `contact_phone`, `contact_email`. |
| 4 · Participant form | locked: full name, phone, email; standard toggles: tshirt_size, gender, city, emergency_contact, dob; **custom_fields[]** (type, label, required, options, order); **quick_questions[]** (≤3 text). |
| 5 · Media & tabs | `gallery[]` (images), `youtube_urls[]`, `instagram_reels[]`, **custom_tabs[]** (title, sections: rich-text/gallery/video/reels/sponsors); default tabs About/Schedule/FAQ/Refund. |
| 6 · Advanced | refund policy, maps, `waiting_list_enabled`. |
| 7 · Ask-a-Question AI | chatbot enabled, knowledge, languages. |
| 8 · SEO & Discovery | meta title/description, OG image, slug. |
| 9 · Surveys / Insights | pre/post survey definitions, public link, auto-send schedule. |
| 10 · Referral reward goal | goal count, reward type (refund %), Razorpay auto-refund. |

---

## 3. Seller / marketplace — sections to build (deep research)

GoAthletix's marketplace (gear, nutrition, apparel) and event-travel/training are new pillars (`docs/21`). A seller console needs, at minimum:

| Area | Sections | Key columns/tables |
| --- | --- | --- |
| **Seller onboarding / KYC** | Business profile, GSTIN/PAN, bank/payout, pickup address, legal agreement, verification status | `sellers`, `seller_kyc`, `seller_payout_accounts` |
| **Catalog** | Products, variants (size/color), categories, brand, images, specs, SKU, HSN code | `products`, `product_variants`, `product_media`, `product_categories` |
| **Inventory** | Stock per variant/warehouse, low-stock alerts, restock | `inventory`, `warehouses`, `stock_ledger` |
| **Pricing & offers** | MRP, sale price, GST rate, seller coupons, bundle deals, event-tie-in deals | `product_prices`, `seller_coupons`, `offers` |
| **Orders** | Order list, status pipeline (placed→packed→shipped→delivered→returned), invoices | `orders`, `order_items`, `order_status_history`, `invoices` |
| **Fulfilment / shipping** | Shipping zones/rates, courier integration, AWB, labels, pickup scheduling | `shipments`, `shipping_rates`, `couriers` |
| **Returns / refunds** | RMA, reason, refund status | `returns`, `refunds` |
| **Payments / settlements** | Payouts, commission/take-rate, fee breakdown, TDS/TCS | `seller_settlements`, `commission_rules`, `payouts` |
| **Storefront** | Seller store page, banner, about, policies | `seller_storefront` |
| **Reviews & ratings** | Product reviews, seller rating, Q&A | `product_reviews`, `seller_ratings`, `product_questions` |
| **Promotions / ads** | Featured placement, sponsored products, race-week deals | `product_promotions` |
| **Analytics** | Sales, conversion, best-sellers, returns rate | views/materialised rollups |
| **Support / disputes** | Tickets, chargebacks | `support_tickets`, `disputes` |

Marketplace is **Phase 4** per `docs/21` — build affiliate-first (link-out) before full consignment/inventory. The schema above is the full target; ship the thin slice first.

---

## 4. DB status & what's required

**Already applied (verified 2026-10-05):** migrations `0001–0023`, including the 2026-10-01 batch — roles/organizers/profiles, event details & pricing, geo/cities, results, reviews/media, notifications/feed/stats, content collections, **marketplace, seller commerce, ticketing/private events, event setup**. Most tables above already exist from `0020_marketplace` / `0021_seller_commerce` (975 lines) / `0022_ticketing_private_events` / `0023_event_setup`.

**Gaps to verify against the applied schema (next migration if missing):** per-ticket `deliverables`, event `custom_tabs`, `quick_questions`, BIB-expo dates, certificate-availability date, AI-chatbot config, referral-reward-goal, affiliate links, social-kit assets, notification-log, API keys, team roles. Several map to existing tables; a column-level diff is the follow-up.

**Migration tracking (this task):** the DB had **no `supabase_migrations.schema_migrations` table** — migrations were applied by hand and untracked. Migration `20261005000024_migration_tracking.sql` creates that schema/table (Supabase-CLI compatible) and backfills every applied version, so from now on applied vs pending is queryable and `supabase db push` / CI can track state.

---

## 5. Coaches & academies — hosting trainings (requirement #61)

- **Added:** 2026-10-12, at the product owner's request: coaches must be able to host their own trainings on
  GoAthletix. The header gets a **Training** link and the end of the homepage's first screen gets a coach card
  (both inert "Soon" entries until Phase 1 pages exist).
- **Third supply-side role** beside organisers (events) and sellers (gear). Recorded as
  [[03 Decisions/ADR-008-coach-trainings|ADR-008]] (proposed: model, phasing and verification for the owner to confirm).
- **Product rule it touches:** `docs/04-product-principles.md` forbids *building* training plans or coaching.
  Hosting a coach's own trainings is a marketplace: the coach runs the session and is accountable for it;
  GoAthletix lists, verifies and (from Phase 2) takes bookings. We still do not author plans or employ coaches.

### 5.1 What a coach or academy can host

| Type | Example | Schedule shape | Typical fee |
|---|---|---|---|
| **Session / workshop / clinic** | "Sprint-start clinic", one Saturday | one date and time | per person |
| **Recurring batch** | "U12 skating, Tue/Thu 6 pm" | weekly days and times; rolling or fixed-term enrolment | per month, or a pack of N sessions |
| **Programme / cohort** | "8-week half-marathon prep", starts 1 Nov | fixed start and end; weekly plan the coach delivers | one price for the programme |
| **Camp** | "5-day athletics camp" | multi-day; optional residential | per person |
| **Trial class** | "Free demo class" | limited seats, one date | free or a small fee |
| **1:1 or small group** | "Personal coaching, 3 athletes" | by appointment | per session or pack |

Each listing records: title; sport and discipline (the two-axis taxonomy, ADR-006); level (beginner to elite);
age group(s) and gender if it is a girls-only or women-only batch; in-person, online or hybrid (online sessions
use the coach's own meeting link; GoAthletix does not host video); venue and map pin; schedule; capacity per
batch; fee model and amount; what is included (kit, assessments, certificate); the coach(es) assigned;
make-up class, cancellation and refund policy; trial policy; photos.

### 5.2 Coach and academy profile

Individual coach or academy (rink, dojo, institute): name, bio, years coaching, certifications (federation,
NIS, ITRA or other) with uploaded proof, achievements, the age groups and sports they coach, languages,
the venues they train at, photos, and, later, reviews and followers (`entity_follows` already supports a
`training_center` target). A centre has several coaches; an individual coach is a centre of one. One login can
hold organiser, seller and coach roles (rights are per entity, not global).

### 5.3 Athlete and parent side

- **Find:** a **Training** link in the header, a "Training near you" rail on the homepage, and training results on
  city and sport pages. Filters: sport and discipline, age group, level, city and radius, in-person or online,
  price, days of the week, trial available, certified coach.
- **Decide:** a detail page with the coach, schedule, venue map, fee, what is included, policies and a verified
  badge. Parents see the child-safety status first.
- **Act:** Phase 1 — call, WhatsApp or an enquiry form (the coach receives a lead). Phase 2 — enrol and pay.
- **Connect to events (Phase 3):** "Train for this event" on an event page lists programmes that finish before
  the race date and match the distance; a programme page lists the events it prepares for. This is the
  advantage a generic coaching listing lacks: GoAthletix already knows which race someone has entered.

### 5.4 Coach console

Create and edit a training (lighter than the 11-step event wizard in #60: basics, schedule and batches, venue,
fees and policies, coaches, media); save as draft and resume; submit for review; manage batches and capacity;
see leads (Phase 1) and the roster (Phase 2); announcements to enrolled athletes; payouts via the ticketing
payout layer (Phase 2). Attendance and progress notes are Phase 3.

### 5.5 Trust and child safety

- **Verified before visible.** Staff verify identity and certification before the first listing goes public.
  Listings re-enter review when price, schedule, venue, age group or safety fields change (the seller-product
  rule, #58). Everything else a coach edits is live immediately.
- **Under-18s.** A coach or academy that lists anything for minors needs a child-safeguarding declaration on
  file and verified; listings for minors stay hidden until then. Parental consent is captured at enrolment (the
  consent document type from #60 already exists). **What evidence is required (for example police
  verification) and how the POCSO Act applies is a legal decision — confirm with counsel before launch.**
- **No self-asserted trust.** `is_verified` and `is_certified` stay human-set, as in migration 0010.

### 5.6 Money

Phase 1 takes no money. Phase 2 reuses orders, payments, refunds and payouts (0021, 0022). Recommended: sell
**fixed-term packs** first (a month, 8 sessions, a programme); auto-renewing monthly subscriptions need
mandate and subscription support from the payment provider and come later. GST on coaching fees, marketplace
TCS and TDS, and a coach agreement are open items for a CA and counsel, together with the ticketing ones in ADR-007.

### 5.7 Out of scope for v1

Authoring training plans ourselves; employing coaches; hosting video; in-app chat (WhatsApp already does it);
GPS or performance tracking; payments before the provider is chosen.

### 5.8 Acceptance criteria — Phase 1 ("find a coach")

1. A signed-in coach or academy owner can create a profile and a training listing as a draft, and submit it
   for review.
2. Staff can approve or reject with a reason; only approved listings are visible anywhere; a change to price,
   schedule, venue, age group or safety fields sends the listing back to review.
3. The Training page and the homepage rail list approved listings, filterable by sport and discipline, age
   group, level, city and radius, in-person or online, price and days, ordered by soonest start or nearest.
4. A detail page shows the coach, schedule, venue map, fee, what is included and policies; the contact action
   records a lead the coach can see.
5. Listings for under-18s appear only once the coach's safeguarding declaration is verified.
6. The header **Training** link, the Partner menu's coach column and the hero's coach card link to live pages
   (today they are inert "Soon" entries).
7. Visibility (public / unlisted / private, #57) works for trainings, and the backend filters every list query
   by visibility and approval status (the service role bypasses RLS).

### 5.9 Database status and gaps

| Need | Exists | Gap |
|---|---|---|
| Directory of centres and coaches | `training_centers` (0010): sport and discipline arrays, age categories, geo, `owner_id` claim path, `is_verified`, `is_certified` | Several coaches per centre (`training_center_members`, like `organizer_members`); coach credentials with proof |
| Follow a coach or centre | `entity_follows` with a `training_center` target (0009) | none |
| The offering | none | `trainings` (type, level, mode, fee model, policies, visibility, review status) |
| Schedule and capacity | none | `training_batches` (days and times, start and end, venue, capacity, price) |
| Who is enrolled | none | `training_enrolments` (links to `orders`; status, pause and cancel) — Phase 2 |
| Leads | none | `training_leads` — Phase 1 |
| Review and moderation | pattern in `product_moderation_log` (0021) | `training_moderation_log` |
| Money | `orders`, `payments`, `refunds`, payouts (0021, 0022) | wiring only — Phase 2 |
| Reviews | `event_reviews`, `product_reviews` | `training_reviews` — after Phase 2 |

No migration is written yet. The proposed next one is **0026** (trainings, batches, leads, credentials, moderation
log) with RLS and the backend visibility filter; Prisma mirrors it in the same commit.

### 5.10 Open decisions for the owner

| # | Decision | Recommendation |
|---|---|---|
| 1 | Model trainings as their own tables, or as events | Own tables (ADR-008) |
| 2 | Ship Phase 1 (no payments) first, so the Training link goes live before a payment provider is chosen | Yes |
| 3 | Review every listing, or verify the coach once and re-review only on changes | Verify the coach; review the first listing; re-review on changes to money, schedule, venue, age or safety |
| 4 | Monthly fees: auto-renew subscriptions, or fixed-term packs | Packs first |
| 5 | Platform fee on training bookings | Not decided (ADR-007: no fee model yet) |
| 6 | Evidence required from coaches who work with minors | Legal decision; none of this launches for under-18s without it |
| 7 | GST on coaching fees, TCS/TDS, coach agreement | CA and counsel |
| 8 | Which sports first | Athletics, skating and running, matching the athletics-first scope |
| 9 | Menu label | "Training" (covers batches, camps, clinics and race prep; it is what athletes search for). Alternatives: Coaching, Academies, Classes, Programmes |
