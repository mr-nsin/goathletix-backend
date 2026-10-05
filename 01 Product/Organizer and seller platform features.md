# Organizer & Seller platform — feature inventory + DB requirements

- **Date:** 2026-10-05
- **Primary source:** SPORTIFI organizer console (`sportifiindia.com/organizer`, authenticated walk-through) — the closest India-specific competitor to GoAthletix's hosting side. Plus deep research for the seller/marketplace side (GoAthletix has no direct analogue yet).
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
