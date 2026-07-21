# 🏗️ GoAthletix — 10-Sprint Development Roadmap

> **Product**: Sports Event Discovery Platform for India
> **Type**: Discovery-first (NOT ticketing/payments)
> **Sports Coverage**: Running, Cycling, Triathlons, Treks, Adventure Sports, Fitness Events, Community Sports
> **Organizer Tools**: WhatsApp & Instagram Integration
> **Sprint Cadence**: 2-week sprints (10 working days each)
> **Team Assumption**: 2 FE, 2 BE, 1 Mobile/PWA, 1 Designer, 1 PM, 0.5 QA
> **Timeline**: Sprint 0 starts Week 1 → Sprint 10 ends Week 22 (~5.5 months)

---

## Table of Contents

1. [Sprint 0: Discovery & Validation](#sprint-0-discovery--validation)
2. [Sprint 1: Foundation & Data Layer](#sprint-1-foundation--data-layer)
3. [Sprint 2: Core Discovery Experience](#sprint-2-core-discovery-experience)
4. [Sprint 3: User Accounts & Live Activity Feed (WebSockets)](#sprint-3-user-accounts--live-activity-feed-websockets)
5. [Sprint 4: Organizer Dashboard v1 & Buddy Sync](#sprint-4-organizer-dashboard-v1--buddy-sync)
6. [Sprint 5: Search, SEO & Content](#sprint-5-search-seo--content)
7. [Sprint 6: Reviews, Trust & Weather/Altitude Advisories](#sprint-6-reviews-trust--weatheraltitude-advisories)
8. [Sprint 7: Community & Social v1](#sprint-7-community--social-v1)
9. [Sprint 8: Recommendations & Intelligence](#sprint-8-recommendations-intelligence)
10. [Sprint 9: Mobile Optimization & PWA](#sprint-9-mobile-optimization--pwa)
11. [Sprint 10: Feedback, Event Request Forms & Launch Prep](#sprint-10-feedback-event-request-forms--launch-prep)
12. [GANTT Summary](#gantt-style-summary)
13. [Dependency Map](#cross-sprint-dependency-map)
14. [Risk Register](#cumulative-risk-register)

---

## Sprint 0: Discovery & Validation

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Validate core assumptions about user needs, organizer willingness, and data availability before writing a single line of production code. Kill bad ideas early. |
| **Duration** | 2 weeks (Days 1–14) |
| **Features** | • Conduct 15+ user interviews (runners, cyclists, trek organizers, fitness coaches) across Bangalore, Mumbai, NCR<br>• Map the current "event discovery journey" for 3 user personas (Weekend Warrior, Serious Amateur, Event Organizer)<br>• Audit 50+ existing event sources (Instagram pages, WhatsApp groups, Townscript listings, Bhaago India, India Running, club websites)<br>• Build a manual event spreadsheet with 200+ real events to validate the data schema<br>• Test a "fake door" landing page with Google Ads in Bangalore to measure intent (target: 5%+ signup rate)<br>• Define the MVP event data schema (fields, taxonomies, sport categories, location hierarchy)<br>• Competitive teardown of Bhaago India, Townscript, LetsDoThis, Meetup — document exactly what's broken |
| **Design Deliverables** | • 3 user persona cards with validated pain points<br>• User journey maps (current state vs. desired state) for each persona<br>• Wireframe sketches (paper/Figma lo-fi) for the core discovery feed<br>• Moodboard for visual identity (sporty, energetic, Indian-first)<br>• Information architecture (IA) v1 — site map with 10–15 pages |
| **Engineering Deliverables** | • Tech stack decision document (recommended: Next.js + Supabase/PostgreSQL + Vercel)<br>• Landing page deployed with analytics (Vercel + Plausible/PostHog)<br>• Event data schema v1 (PostgreSQL DDL or Prisma schema)<br>• CI/CD pipeline skeleton (GitHub Actions → Vercel preview deploys)<br>• Development environment setup guide (README with `npm run dev` instructions) |
| **Risks** | • **User interviews biased toward enthusiasts** — mitigate by including 5+ casual/beginner athletes<br>• **Organizers unwilling to share data** — mitigate by offering free event pages as incentive<br>• **Schema over-engineering** — mitigate by starting with 15 fields max, expand later<br>• **Fake door test inconclusive** — need minimum 500 ad impressions per city to get signal |
| **Exit Criteria** | ✅ 15+ user interviews completed and synthesized<br>✅ Event data schema finalized and reviewed by engineering<br>✅ Landing page live with 500+ visitors and signup rate measured<br>✅ Tech stack approved by team with ADR (Architecture Decision Record)<br>✅ Go/No-Go decision documented based on validation signals |
| **KPIs** | • Landing page signup conversion rate (target: ≥5%)<br>• Number of user interviews completed (target: ≥15)<br>• Number of real events catalogued in spreadsheet (target: ≥200)<br>• Number of organizers who expressed interest in listing (target: ≥10)<br>• Team confidence score on 1–5 scale (target: ≥4) |

---

## Sprint 1: Foundation & Data Layer

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Build the production database, API layer, and admin tools to ingest, store, and manage event data. No user-facing UI yet — this is plumbing. |
| **Duration** | 2 weeks (Days 15–28) |
| **Features** | • Production database with event schema (events, locations, sports categories, organizers, images)<br>• RESTful API for CRUD operations on events (`/api/events`, `/api/categories`, `/api/locations`)<br>• Admin dashboard for manual event entry and bulk CSV import<br>• Location hierarchy: Country → State → City → Area (India-specific: Koramangala, Powai, Connaught Place, etc.)<br>• Sport taxonomy: 6 top-level categories (Running, Cycling, Triathlon, Trekking, Adventure, Fitness) with 25+ subcategories<br>• Image upload and optimization pipeline (WebP conversion, responsive sizes)<br>• Basic event scraper v0.1 for 2–3 public sources (Instagram public pages, specific event websites) |
| **Design Deliverables** | • Design system v1: color palette, typography (Inter/Outfit), spacing scale, component tokens<br>• Admin dashboard UI (functional, not pretty — internal tool)<br>• Event card component design (3 variants: compact, standard, featured)<br>• Icon set selection (sport-specific icons for 6 categories)<br>• Responsive grid system definition (mobile-first breakpoints) |
| **Engineering Deliverables** | • PostgreSQL schema deployed (Supabase or managed Postgres)<br>• Next.js API routes with input validation (Zod)<br>• Prisma ORM models with migrations<br>• Admin dashboard (Next.js pages, protected by basic auth)<br>• CSV bulk import tool (parse, validate, insert)<br>• Image upload to Cloudinary/S3 with automatic optimization<br>• Seed script with 200+ real events from Sprint 0 spreadsheet<br>• API documentation (Swagger/OpenAPI auto-generated)<br>• Rate limiting and basic API security headers |
| **Risks** | • **Schema migrations become painful later** — mitigate with Prisma migrate and strict versioning<br>• **Scraper breaks on source changes** — accept this; scrapers are supplementary, not primary<br>• **Location data inconsistency** — mitigate with Google Places API for geocoding + manual override<br>• **Scope creep on admin dashboard** — keep it ugly but functional; it's an internal tool |
| **Exit Criteria** | ✅ 200+ real events seeded into production database<br>✅ API endpoints return correct data with <200ms p95 latency<br>✅ Admin can create, edit, and delete events through dashboard<br>✅ CSV import successfully processes 100+ events in one batch<br>✅ Image pipeline produces 3 responsive sizes for each upload<br>✅ All API routes have input validation and error handling |
| **KPIs** | • API p95 latency (target: <200ms)<br>• Database query performance on event listing (target: <50ms for 1000 events)<br>• Number of events in production DB (target: ≥200)<br>• Admin task completion time: create event (target: <3 min)<br>• Zero critical bugs in API layer |

---

## Sprint 2: Core Discovery Experience

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Ship the user-facing discovery feed — the single most important page. Users can browse, filter, and view events. This is the "moment of truth" for the product. |
| **Duration** | 2 weeks (Days 29–42) |
| **Features** | • Homepage with curated event feed (upcoming events, sorted by date and relevance)<br>• Filter bar: Sport type, City, Date range, Distance/Difficulty, Free/Paid, Indoor/Outdoor<br>• Event detail page with: title, date, location (map), sport type, difficulty, distance, organizer info, description, images, registration link (external)<br>• City-specific landing pages (e.g., `/bangalore/running`, `/mumbai/cycling`)<br>• "Happening This Weekend" section on homepage<br>• "Near You" section using browser geolocation (with graceful fallback to city selection)<br>• Event card interactions: hover effects, quick-view modal<br>• Empty states and loading skeletons for all data states<br>• Mobile-responsive layout (80%+ of Indian users are mobile-first) |
| **Design Deliverables** | • Homepage high-fidelity mockup (mobile + desktop)<br>• Event detail page design (mobile + desktop)<br>• Filter bar component (collapsible on mobile, sidebar on desktop)<br>• Event card final designs (3 variants with real data)<br>• Map integration design (embedded Google Maps with event pin)<br>• Empty state illustrations (no events found, no events in city)<br>• Loading skeleton designs<br>• Typography and content guidelines for event descriptions |
| **Engineering Deliverables** | • Homepage with SSR (Next.js `getServerSideProps` or App Router server components)<br>• Event listing API with pagination, filtering, sorting<br>• Event detail page with dynamic routing (`/events/[slug]`)<br>• City landing pages with ISR (Incremental Static Regeneration)<br>• Filter system: URL-based state (shareable filtered views)<br>• Google Maps embed on event detail page<br>• Browser geolocation API integration with city fallback<br>• Image lazy loading with blur placeholder<br>• Core Web Vitals optimization (LCP <2.5s, CLS <0.1)<br>• Error boundaries and 404 page |
| **Risks** | • **Discovery feed feels empty with only 200 events** — mitigate by focusing on 2–3 cities initially and curating quality over quantity<br>• **Filter combinations return zero results** — mitigate with smart empty states that suggest broadening filters<br>• **Geolocation permission denied by users** — mitigate with manual city selector as default<br>• **Mobile performance on low-end Android** — mitigate by testing on Moto G4 / Redmi Note class devices<br>• **External registration links break** — accept this; we don't control external URLs |
| **Exit Criteria** | ✅ Homepage loads in <3s on 3G connection (Lighthouse mobile score ≥70)<br>✅ Users can filter events by sport, city, date with URL persistence<br>✅ Event detail page renders with all fields, map, and external registration link<br>✅ Mobile layout passes visual QA on 5+ Android devices<br>✅ 3 city landing pages live (Bangalore, Mumbai, NCR)<br>✅ Zero layout shifts (CLS <0.1) on homepage |
| **KPIs** | • Lighthouse mobile performance score (target: ≥70)<br>• Time to first meaningful paint (target: <2s)<br>• Events per filter combination returning results (target: ≥80% of common combos)<br>• User session duration on discovery feed (target: ≥90s)<br>• Event detail page click-through rate from feed (target: ≥15%)<br>• Bounce rate on homepage (target: <60%) |

---

## Sprint 3: User Accounts & Live Activity Feed (WebSockets)

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Enable user identity and build a live-updating interactive feed using WebSockets to allow users to save events, view community updates in real-time, and plan calendars together. |
| **Duration** | 2 weeks (Days 43–56) |
| **Features** | • Authentication: Google OAuth + Phone OTP (Indian users prefer phone auth)<br>• User profile page: name, city, sport preferences, experience level<br>• "Save Event" / "Wishlist" functionality (heart icon on event cards)<br>• "My Events" dashboard showing saved events grouped by date<br>• Event reminders via email (7 days before, 1 day before)<br>• "Share Event" button (WhatsApp deep link, Instagram Stories share, copy link)<br>• Sport preference onboarding flow (select 3+ sports during signup)<br>• Calendar view of saved events (monthly view)<br>• "I'm Going" status on events (public, opt-in)<br>• **Live Activity Feed**: Real-time event updates (signups, event saves, newly added listings) broadcasted using WebSockets to drive community urgency and engagement |
| **Design Deliverables** | • Login/Signup flow (Google OAuth + Phone OTP screens)<br>• Onboarding flow: sport preference selection (interactive, fun)<br>• User profile page design<br>• "My Events" dashboard design (list view + calendar view)<br>• Save/Wishlist interaction design (micro-animation on heart icon)<br>• Share sheet design (WhatsApp, Instagram, Copy Link)<br>• Reminder notification templates (email)<br>• **Live Activity Feed UI**: High-fidelity dashboard sidebar, notification toasts, and activity feed layouts featuring real-time animation of active signups/saves |
| **Engineering Deliverables** | • NextAuth.js or Supabase Auth with Google + Phone OTP providers<br>• User profile CRUD API (`/api/users/[id]`)<br>• Saved events API (`/api/users/[id]/saved-events`)<br>• Event reminder system (cron job or Supabase edge function)<br>• Email service integration (Resend or SendGrid) for reminders<br>• WhatsApp share deep link generation (`wa.me` with pre-filled text)<br>• Instagram Stories share (Open Graph meta tags for rich preview)<br>• Protected routes middleware (redirect unauthenticated users)<br>• User preferences stored in database with sport affinity scores<br>• GDPR-lite: user data export and account deletion<br>• **WebSocket server setup**: Setup WebSocket server endpoints (using Supabase Realtime, Socket.io, or AWS API Gateway WebSockets) for streaming event activities to browsers<br>• **WebSocket client listener**: Real-time broadcast listener integrated with client browser feed |
| **Risks** | • **Phone OTP costs escalate** — mitigate by rate-limiting OTP requests (max 3/hour) and using Twilio/MSG91 bulk plans<br>• **Low signup conversion** — mitigate by allowing browse-without-login; only gate save/plan features<br>• **WhatsApp share attribution is impossible** — accept this; WhatsApp is a black box for analytics<br>• **Calendar view complexity** — mitigate by shipping list view first, calendar as enhancement<br>• **Email deliverability issues** — mitigate by using authenticated domain (SPF/DKIM/DMARC)<br>• **WebSocket connection stability & scaling under load** — mitigate by using Redis adapters, implementing heartbeat ping-pong, and client reconnection logic with exponential backoff |
| **Exit Criteria** | ✅ Users can sign up via Google OAuth and Phone OTP<br>✅ Save event works and persists across sessions<br>✅ "My Events" page shows saved events with correct dates<br>✅ Event reminders fire at correct times (tested with 3+ test events)<br>✅ WhatsApp share generates correct deep link with event details<br>✅ Onboarding flow captures sport preferences for ≥80% of signups<br>✅ WebSocket connections successfully broadcast signups and saves to other connected clients in <150ms |
| **KPIs** | • Signup conversion rate from browse to account (target: ≥8%)<br>• % of users who save ≥1 event in first session (target: ≥20%)<br>• Onboarding completion rate (target: ≥75%)<br>• Share button usage per session (target: ≥5% of sessions)<br>• Reminder email open rate (target: ≥30%)<br>• Phone OTP success rate (target: ≥95%)<br>• WebSocket connection availability/uptime (target: ≥99.9%)<br>• Live feed message broadcast latency (target: <150ms) |

---

## Sprint 4: Organizer Dashboard v1 & Buddy Sync

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Build the initial organizer management dashboard and supply-side ingestion funnel, and integrate Buddy Sync social matching to enable viral user loops and event alignment. |
| **Duration** | 2 weeks (Days 57–70) |
| **Features** | • Organizer registration and verification flow (basic: name, organization, website/social link)<br>• Event creation form: multi-step wizard (details → logistics → media → preview → publish)<br>• **Organizer dashboard v1**: Central workspace to track performance stats (views, saves, shares), edit listings, duplicate recurring races, and manage profile information<br>• WhatsApp integration v1: Auto-generate a WhatsApp message template with event link, image, and key details — one-tap share to WhatsApp groups/status<br>• Instagram integration v1: Auto-generate an Instagram-ready image card (1080x1080) with event name, date, location, sport type — downloadable as PNG<br>• Organizer profile page (public): organization name, bio, past events, upcoming events, follower count<br>• "Claim this event" flow for events added by the platform team<br>• Organizer notification: new saves, new "I'm Going" RSVPs<br>• Bulk event creation (CSV upload for organizers with recurring events)<br>• **Buddy Sync integration**: Shareable custom sync links allowing users to invite sport buddies, align calendars, plan race schedules together, and drive organic network effect |
| **Design Deliverables** | • Event creation wizard (5-step flow, mobile-optimized)<br>• **Organizer dashboard v1 layout**: Responsive design with analytics widgets, activity feeds, and listed events list<br>• Instagram card template system (3 sport-themed templates: running, cycling, general)<br>• WhatsApp message preview component<br>• Organizer profile page design<br>• "Claim Event" flow design<br>• Notification center design (in-app + email)<br>• **Buddy Sync UI components**: Dynamic calendar comparison view showing overlaps/gaps, invitation landing page, and sync status widgets |
| **Engineering Deliverables** | • Organizer role and permissions system (RBAC: user, organizer, admin)<br>• Multi-step event creation API with draft/published states<br>• Image card generator service (Canvas API or Puppeteer for server-side rendering of Instagram templates)<br>• WhatsApp deep link generator with UTM parameters<br>• Organizer analytics API (event views, saves, shares — aggregated from existing data)<br>• "Claim Event" verification queue (admin approval workflow)<br>• Organizer notification system (email + in-app)<br>• Event duplication API (clone with date shift)<br>• Rich text editor for event descriptions (Tiptap or similar)<br>• Organizer onboarding email sequence (3-email drip)<br>• **Buddy Sync APIs**: Database schema models for calendar sync entities, unique link generator (`/api/sync/[token]`), and side-by-side calendar comparison logic |
| **Risks** | • **Organizers won't use a web form** — mitigate by making WhatsApp-based event submission a v2 priority (accept form for now)<br>• **Instagram template quality is low** — mitigate by using professional design templates, not auto-generated garbage<br>• **Verification queue creates bottleneck** — mitigate by auto-approving organizers with verified social links; manual review for others<br>• **Organizers expect ticketing/payments** — be explicit in messaging: "We're discovery, not ticketing. Link to your own registration."<br>• **Low organizer adoption** — mitigate by personally onboarding 20 organizers during this sprint<br>• **Buddy Sync calendar conflict rendering** — mitigate by keeping comparison interface purely visual, letting athletes discuss scheduling on their preferred chat apps |
| **Exit Criteria** | ✅ Organizer can create and publish an event in <5 minutes<br>✅ Instagram card generates correctly with event data (tested with 10 events)<br>✅ WhatsApp share includes event link, image preview, and key details<br>✅ Organizer dashboard v1 shows real-time view/save counts<br>✅ 20+ organizers onboarded and have published at least 1 event<br>✅ "Claim Event" flow works end-to-end with admin approval<br>✅ Buddy Sync link generator successfully creates shareable tokens that render a comparative calendar view for multiple users |
| **KPIs** | • Organizer signup rate (target: ≥20 in sprint)<br>• Event creation completion rate (target: ≥70% of started events get published)<br>• Average time to publish an event (target: <5 min)<br>• Instagram card download rate (target: ≥50% of organizers download at least 1)<br>• WhatsApp share usage by organizers (target: ≥60% use it at least once)<br>• Organizer return rate within 2 weeks (target: ≥40%)<br>• Buddy Sync links generated (target: ≥500 created links)<br>• Invited buddies who create accounts via sync links (target: ≥20%) |

---

## Sprint 5: Search, SEO & Content

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Make every event discoverable via Google Search and on-platform search. SEO is the primary organic acquisition channel — every event page must rank. Build a content layer that drives long-tail traffic. |
| **Duration** | 2 weeks (Days 71–84) |
| **Features** | • Full-text search with autocomplete (search by event name, city, sport, organizer)<br>• SEO-optimized event pages: structured data (JSON-LD Event schema), meta tags, canonical URLs, Open Graph tags<br>• Dynamic sitemap generation (XML sitemap updated on event publish)<br>• City + Sport landing pages with editorial content (e.g., "Best Running Events in Bangalore 2026")<br>• Blog/content section: "Event Guides" (e.g., "Your First Marathon: What to Expect", "Top 10 Cycling Routes Near Mumbai")<br>• Search results page with relevant filters and sorting<br>• "Did you mean?" and typo tolerance in search<br>• Search analytics: track what users search for (for content strategy)<br>• URL slugs for all entities (events, cities, sports) — human-readable, SEO-friendly |
| **Design Deliverables** | • Search bar component (desktop header + mobile overlay)<br>• Search results page design (with filters sidebar/drawer)<br>• Autocomplete dropdown design (recent searches, suggested events)<br>• Blog/content page templates (article, listicle, guide)<br>• City+Sport landing page template<br>• "No results" search state with suggestions<br>• Open Graph image template (auto-generated for social sharing) |
| **Engineering Deliverables** | • Full-text search engine (PostgreSQL `tsvector` for v1, Meilisearch/Typesense if scale demands)<br>• Autocomplete API with debounced client-side calls<br>• JSON-LD structured data for Event schema on all event pages<br>• Dynamic XML sitemap generator (rebuild on event publish/update)<br>• `robots.txt` and meta robots configuration<br>• Open Graph meta tags with dynamic image generation (Vercel OG or `@vercel/og`)<br>• Blog CMS integration (MDX files or headless CMS like Sanity/Contentful)<br>• City+Sport landing page generation from database (ISR)<br>• Search analytics table (log queries, click-through, zero-result queries)<br>• Canonical URL strategy implementation<br>• Google Search Console setup and sitemap submission |
| **Risks** | • **SEO takes 3–6 months to show results** — accept this; start now, measure later. Don't skip it because ROI is delayed.<br>• **Search quality is poor with limited data** — mitigate with typo tolerance and synonym matching (run = running = marathon)<br>• **Content creation bottleneck** — mitigate by writing 5 core articles in this sprint, not 50. Quality > quantity.<br>• **Sitemap becomes stale** — mitigate with webhook-triggered regeneration on event publish<br>• **Duplicate content across city pages** — mitigate with unique intro paragraphs per city page |
| **Exit Criteria** | ✅ Search returns relevant results for 90%+ of test queries (50 test queries)<br>✅ Every event page has valid JSON-LD Event structured data (tested with Google Rich Results Test)<br>✅ Sitemap is auto-generated and submitted to Google Search Console<br>✅ 3+ city/sport landing pages live with editorial content<br>✅ 5+ blog articles published<br>✅ Open Graph previews render correctly on WhatsApp, Twitter, LinkedIn |
| **KPIs** | • Search usage rate (target: ≥20% of sessions use search)<br>• Search-to-click rate (target: ≥40% of searches result in event click)<br>• Zero-result search rate (target: <15%)<br>• Google Search Console: pages indexed (target: ≥80% of event pages)<br>• Organic traffic after 30 days (baseline measurement — target: >0)<br>• Blog article average read time (target: ≥2 min) |

---

## Sprint 6: Reviews, Trust & Weather/Altitude Advisories

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Build trust signals through post-event reviews, ratings, and badges; and implement dynamic Weather & Altitude Advisories for high-altitude or extreme terrain races to enhance safety. |
| **Duration** | 2 weeks (Days 85–98) |
| **Features** | • Post-event review system: star rating (1–5) + text review + photo upload<br>• Review prompts: automatic email/push 24 hours after event ends ("How was [Event Name]?")<br>• Event quality score: composite score visible on event card (based on reviews, organizer history, event completeness)<br>• "Verified Organizer" badge (criteria: 3+ events listed, 1+ reviews, verified identity)<br>• "Repeat Event" badge (for events that have run 2+ editions)<br>• Review moderation: profanity filter + admin review queue for flagged content<br>• Organizer response to reviews (public reply capability)<br>• Past event archive: completed events remain visible with reviews (not deleted)<br>• Report/flag mechanism for events (spam, misleading, cancelled)<br>• Event completeness score for organizers ("Your listing is 70% complete — add images to reach 100%")<br>• **Weather & Altitude Advisories**: Dynamic weather forecasting (via OpenWeatherMap API) and safety recommendations for high-altitude or seasonal extreme weather (e.g. monsoons) on event page layouts |
| **Design Deliverables** | • Review submission form (star + text + photo, mobile-optimized)<br>• Review display component (on event detail page, with organizer replies)<br>• Quality score badge design (visual indicator on event cards)<br>• "Verified Organizer" badge design (trustworthy but not overwrought)<br>• Review prompt email template<br>• Report/flag modal design<br>• Past event archive page design<br>• Event completeness progress bar for organizers<br>• **Weather & Altitude Warning banners & widgets**: Displays temperature/humidity forecasts, elevation profiles, atmospheric density guidance, and monsoon/heat/altitude acclimatization advisories |
| **Engineering Deliverables** | • Reviews CRUD API (`/api/events/[id]/reviews`)<br>• Review prompt scheduler (cron: 24h post-event-end, send email)<br>• Quality score algorithm v1 (weighted: 40% reviews, 30% organizer history, 30% listing completeness)<br>• Moderation pipeline: profanity filter (bad-words library) + admin queue<br>• Verified Organizer status calculation (automated based on criteria)<br>• Organizer reply API<br>• Report/flag API with admin review workflow<br>• Past events query filter (completed events with reviews)<br>• Review photo upload and moderation<br>• Anti-spam: rate limiting reviews (1 per user per event), duplicate detection<br>• **OpenWeatherMap Integration**: API client integration for event location coordinates, caching mechanism (3 hours) to prevent rate limits<br>• **Elevation and Altitude Advisory Engine**: Automatic calculation of elevation warning conditions (>1,500m) and terrain-specific risk logic database flags |
| **Risks** | • **No reviews in the beginning (cold start)** — mitigate by personally soliciting reviews from Sprint 0 interview participants and early users<br>• **Fake reviews from organizers** — mitigate by requiring "I'm Going" or verified attendance for review eligibility<br>• **Negative reviews scare organizers away** — mitigate with organizer reply feature and clear community guidelines<br>• **Quality score feels arbitrary** — mitigate by being transparent about the algorithm ("Based on X reviews, Y events run")<br>• **Moderation queue overwhelms small team** — mitigate with automated profanity filter handling 90% of cases<br>• **Weather API outages or stale climate data** — mitigate by implementing cache fallbacks, displaying last-cached warnings, and placing clear disclaimers that real-time mountain weather varies |
| **Exit Criteria** | ✅ Users can submit reviews with star rating, text, and photos<br>✅ Review prompts fire correctly 24h after event end (tested with 5+ past events)<br>✅ Quality score displays on event cards and updates in real-time<br>✅ "Verified Organizer" badge appears for qualifying organizers<br>✅ Report/flag flow works end-to-end with admin notification<br>✅ Past events are archived and browsable (not deleted)<br>✅ Weather and elevation charts/warnings render correctly on dynamic event detail pages |
| **KPIs** | • Review submission rate post-prompt (target: ≥15% of prompted users submit)<br>• Average review length (target: ≥50 words — indicates genuine engagement)<br>• % of events with ≥1 review after 30 days (target: ≥20% of completed events)<br>• False positive rate in moderation (target: <5%)<br>• Organizer response rate to reviews (target: ≥30%)<br>• Report/flag volume (monitor — no target, just track)<br>• Percentage of high-altitude/extreme weather events featuring dynamic advisories (target: 100%)<br>• Average load time of weather/altitude component (target: <40ms) |

---

## Sprint 7: Community & Social v1

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Transform GoAthletix from a directory into a community. Users should be able to follow organizers, see what friends are attending, and discover events through social signals. This is the retention flywheel. |
| **Duration** | 2 weeks (Days 99–112) |
| **Features** | • Follow organizer: get notified when they post new events<br>• "Friends Going" indicator on event cards (show avatars of followed users who are attending)<br>• Activity feed: "People you follow are going to [Event Name]"<br>• User-to-user follow system (opt-in, public profiles)<br>• Group creation: "Bangalore Runners", "Mumbai Cycling Club" (user-created, open/invite-only)<br>• Group event recommendations: events relevant to group members' interests<br>• "Invite Friends" via WhatsApp (share app link with referral code)<br>• Attendee count on event pages ("42 people interested")<br>• Social proof notifications: "12 people saved this event in the last 24 hours"<br>• Organizer follower milestones ("You've reached 100 followers!") |
| **Design Deliverables** | • Activity feed design (mobile-first, card-based)<br>• Follow button component (organizer + user variants)<br>• "Friends Going" avatar stack component<br>• Group page design (cover image, members, events, discussion)<br>• Group creation flow<br>• "Invite Friends" share sheet with referral messaging<br>• Social proof notification design (subtle, non-intrusive)<br>• Follower milestone notification design |
| **Engineering Deliverables** | • Follow/unfollow API (`/api/users/[id]/following`)<br>• Activity feed generation (fan-out-on-read for v1 — simple but sufficient at current scale)<br>• Groups CRUD API (`/api/groups`)<br>• Group membership management (join, leave, invite, admin roles)<br>• "Friends Going" query (join saved events × following list)<br>• Referral code generation and tracking<br>• Social proof counters (real-time save counts via database triggers or polling)<br>• Push notification infrastructure (web push via service worker)<br>• Notification preferences API (email, push, in-app — per notification type)<br>• Rate limiting on follow/unfollow to prevent spam |
| **Risks** | • **Social features feel empty with low user count** — mitigate by seeding groups (create 5 official groups for top cities/sports)<br>• **Activity feed performance degrades** — mitigate by paginating and caching; fan-out-on-read is fine for <10K users<br>• **Groups become ghost towns** — mitigate by tying groups to organizer accounts and populating with event-related content<br>• **Referral spam** — mitigate by capping referral rewards (if any) and monitoring abuse<br>• **Notification fatigue** — mitigate with sensible defaults (daily digest, not per-event) and easy mute |
| **Exit Criteria** | ✅ Users can follow organizers and receive new event notifications<br>✅ "Friends Going" shows correct data on event cards<br>✅ Activity feed renders with relevant social events<br>✅ Groups can be created, joined, and display relevant events<br>✅ WhatsApp invite generates tracked referral link<br>✅ Notification preferences are configurable per type |
| **KPIs** | • % of users who follow ≥1 organizer (target: ≥25% of registered users)<br>• Activity feed engagement rate (target: ≥10% of sessions visit feed)<br>• Groups created (target: ≥10 in first 2 weeks)<br>• Referral invite-to-signup rate (target: ≥15%)<br>• Notification opt-in rate (target: ≥60% keep push notifications on)<br>• Average follows per user (target: ≥3) |

---

## Sprint 8: Recommendations & Intelligence

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Move from manual discovery to personalized, intelligent event recommendations. Use user behavior, preferences, and collaborative filtering to surface the right events to the right users at the right time. |
| **Duration** | 2 weeks (Days 113–126) |
| **Features** | • "Recommended for You" section on homepage (personalized based on sport preferences, past saves, location)<br>• "Because you saved [Event X]" contextual recommendations on event detail pages<br>• "Trending in [City]" section (events with highest save/view velocity)<br>• "New This Week" section (freshly listed events)<br>• Email digest: weekly personalized event recommendations (Monday morning)<br>• WhatsApp notification channel: opt-in weekly picks via WhatsApp Business API<br>• Smart event ranking: events ranked by relevance score (not just date)<br>• "Events like this" similarity engine (same sport, same city, similar difficulty)<br>• User taste profile: inferred from saves, clicks, and dwell time (not just stated preferences)<br>• Seasonal recommendations: "Monsoon Treks", "Winter Marathons", "Summer Cycling" |
| **Design Deliverables** | • "Recommended for You" section design (carousel or grid)<br>• Contextual recommendation card ("Because you saved...")<br>• "Trending" section design with trend indicators<br>• Weekly digest email template (personalized, 5–7 events)<br>• WhatsApp recommendation message template<br>• Taste profile visualization (user-facing: "Your Sport DNA")<br>• Seasonal recommendation banner design |
| **Engineering Deliverables** | • Recommendation engine v1: content-based filtering (sport, city, difficulty, date proximity)<br>• Collaborative filtering v0.1: "users who saved X also saved Y" (basic co-occurrence matrix)<br>• Relevance scoring algorithm (weighted: preference match, recency, popularity, proximity)<br>• Event similarity API (`/api/events/[id]/similar`)<br>• User behavior tracking: save, click, dwell time, search queries (event log table)<br>• Weekly digest email pipeline (scheduled job, personalized event selection)<br>• WhatsApp Business API integration for broadcast messages<br>• Trending calculation: rolling 24h save/view velocity per event<br>• A/B testing framework setup (Vercel edge middleware or PostHog feature flags)<br>• Recommendation performance tracking (CTR on recommended events) |
| **Risks** | • **Cold start for new users** — mitigate with popularity-based defaults and sport preference onboarding from Sprint 3<br>• **Recommendation quality is poor with sparse data** — mitigate by starting with content-based filtering (deterministic, not ML); add collaborative filtering only when >1K users<br>• **WhatsApp Business API approval delays** — apply early (Sprint 6–7); have email as fallback<br>• **Over-personalization creates filter bubbles** — mitigate with "Explore" section showing events outside preferences<br>• **Email digest goes to spam** — mitigate with warm-up and authenticated sending domain |
| **Exit Criteria** | ✅ "Recommended for You" shows ≥5 events different from the default feed for users with preferences<br>✅ "Events like this" returns ≥3 relevant events per event page<br>✅ Trending section updates hourly and reflects actual save/view velocity<br>✅ Weekly digest email sends to all opted-in users on Monday<br>✅ A/B testing framework is operational (can split traffic on recommendation algorithms)<br>✅ Recommendation CTR is measurable and dashboarded |
| **KPIs** | • Recommendation click-through rate (target: ≥10% — higher than non-personalized feed)<br>• Weekly digest email open rate (target: ≥25%)<br>• Weekly digest click-through rate (target: ≥8%)<br>• WhatsApp message delivery rate (target: ≥90%)<br>• % of homepage events that are personalized vs. generic (target: ≥50% for returning users)<br>• User retention lift for users who engage with recommendations (target: measurable positive delta) |

---

## Sprint 9: Mobile Optimization & PWA

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Make GoAthletix feel native on mobile. 80%+ of Indian users access the web on mobile — the experience must be fast, installable, and work offline. Ship a PWA that competes with native apps. |
| **Duration** | 2 weeks (Days 127–140) |
| **Features** | • Progressive Web App (PWA) with install prompt ("Add to Home Screen")<br>• Offline support: cached homepage, saved events viewable offline, offline event detail pages<br>• Push notifications (web push): new events, reminders, social activity<br>• App-like navigation: bottom tab bar (Discover, Search, Saved, Profile)<br>• Touch-optimized interactions: swipe to save, pull to refresh, haptic feedback<br>• Optimized image loading: AVIF/WebP with responsive `srcset`, aggressive lazy loading<br>• Dark mode support (auto-detect system preference + manual toggle)<br>• Performance budget enforcement: JS bundle <150KB gzipped, total page weight <500KB<br>• Splash screen and app icon for PWA<br>• Deep linking: `/events/[slug]` opens directly to event in PWA<br>• Share target: PWA appears in OS share sheet for receiving shared content |
| **Design Deliverables** | • Mobile navigation redesign: bottom tab bar with 4–5 tabs<br>• Dark mode color palette and component variants<br>• PWA splash screen and app icon (512x512, 192x192)<br>• Touch interaction specifications (swipe gestures, pull to refresh)<br>• Offline state design (cached content indicators, "You're offline" banner)<br>• Install prompt design (custom, not browser default)<br>• Performance budget visualization (for engineering reference) |
| **Engineering Deliverables** | • Service worker with Workbox (precache app shell, runtime cache API responses)<br>• PWA manifest (`manifest.json` with icons, theme color, display: standalone)<br>• Offline fallback page and cached event detail pages<br>• Web push notification infrastructure (VAPID keys, subscription management)<br>• Bottom tab bar navigation component (client-side routing)<br>• Dark mode CSS custom properties + system preference detection<br>• Image optimization pipeline: AVIF/WebP with `<picture>` element and `srcset`<br>• Bundle analysis and code splitting optimization<br>• Lighthouse CI integration (fail build if mobile score <80)<br>• Deep link handling in service worker<br>• Share Target API registration in manifest<br>• Performance monitoring: Real User Metrics (RUM) via web-vitals library |
| **Risks** | • **Service worker caching causes stale data** — mitigate with stale-while-revalidate strategy and cache versioning<br>• **PWA install prompt is ignored by users** — mitigate with custom install prompt at the right moment (after 3+ sessions)<br>• **Push notification permission denied** — mitigate by asking at the right context (not on first visit)<br>• **Dark mode introduces visual bugs** — mitigate with systematic CSS custom property implementation and visual regression tests<br>• **Older Android WebView doesn't support PWA features** — mitigate with progressive enhancement; core functionality works without service worker |
| **Exit Criteria** | ✅ PWA installable on Android Chrome and scores ≥90 on Lighthouse PWA audit<br>✅ Saved events viewable offline (tested in airplane mode)<br>✅ Push notifications deliverable to subscribed users<br>✅ Dark mode works across all pages without visual regressions<br>✅ Mobile Lighthouse performance score ≥80<br>✅ JS bundle <150KB gzipped (measured via build output)<br>✅ Bottom tab navigation works with correct route highlighting |
| **KPIs** | • PWA install rate (target: ≥5% of mobile users install within 30 days)<br>• Lighthouse mobile performance score (target: ≥80)<br>• Push notification opt-in rate (target: ≥30%)<br>• Offline page load success rate (target: 100% for cached pages)<br>• JS bundle size (target: <150KB gzipped)<br>• Time to Interactive on 3G (target: <5s)<br>• Dark mode adoption rate (target: ≥20% of users) |

---

## Sprint 10: Feedback, Event Request Forms & Launch Prep

| Attribute | Detail |
|---|---|
| **Sprint Goal** | Build feedback & request loops, complete the comprehensive launch readiness checks, and prepare marketing and operations for public launch. |
| **Duration** | 2 weeks (Days 141–154) |
| **Features** | • Analytics dashboard for internal team: DAU, WAU, MAU, event views, saves, shares, signups, organizer metrics<br>• Organizer analytics v2: detailed event performance (views over time, save rate, share channel breakdown, geographic distribution of interest)<br>• Referral program: users invite friends → earn "GoAthletix Credits" (future use for premium features)<br>• SEO performance dashboard: indexed pages, top queries, impressions, CTR from Google Search Console API<br>• Error monitoring and alerting (Sentry or similar)<br>• Uptime monitoring and status page<br>• Load testing: simulate 1000 concurrent users (k6 or Artillery)<br>• Database performance audit: slow query log analysis, index optimization<br>• Security audit: OWASP top 10 checklist, dependency vulnerability scan<br>• Legal/compliance: Privacy Policy, Terms of Service, Cookie consent banner<br>• **Feedback & Event Request Forms**: User-facing interfaces to report issues, suggest platform improvements, or manually request listing support for unindexed events<br>• **Launch checklist**: Automated checklist implementation validating DNS, SSL, database pool limits, CDN routing, and key backend endpoints before opening to the public<br>• Organizer acquisition campaign: email/WhatsApp outreach to 200+ organizers<br>• User acquisition campaign: Google Ads, Instagram Reels, running club partnerships |
| **Design Deliverables** | • Internal analytics dashboard mockup (team-facing, not user-facing)<br>• Organizer analytics v2 page design (charts, trends, comparisons)<br>• Referral program UI (invite card, credits balance, referral history)<br>• Legal pages design (Privacy Policy, Terms — clean, readable)<br>• Cookie consent banner design (GDPR-compliant, non-intrusive)<br>• Launch social media assets (Instagram posts, LinkedIn banners, Product Hunt gallery)<br>• Press kit: logo, screenshots, one-pager, founder quotes<br>• **Feedback & Event Request forms**: Simple, low-friction modal overlays with form fields (name, email, feedback category, description, and dynamic event details) |
| **Engineering Deliverables** | • Analytics event tracking: PostHog or Mixpanel integration with 30+ tracked events<br>• Internal metrics dashboard (Metabase or custom Next.js admin page)<br>• Google Search Console API integration for SEO dashboard<br>• Sentry error monitoring with source maps<br>• Uptime monitoring (BetterUptime or UptimeRobot) with Slack alerts<br>• Load testing scripts (k6) simulating peak traffic scenarios<br>• Database indexing optimization based on slow query analysis<br>• `npm audit` and Snyk vulnerability scan (fix critical/high)<br>• Rate limiting on all public APIs (prevent abuse on launch day)<br>• CDN configuration verification (Vercel Edge or Cloudflare)<br>• Legal pages (static MDX content)<br>• Cookie consent implementation (cookie banner + localStorage flag)<br>• Referral code system with tracking and credit ledger<br>• Feature flag cleanup: remove development flags, finalize A/B tests<br>• Production environment hardening: env var audit, secret rotation<br>• **Feedback & Event Request APIs**: Endpoint endpoints (`/api/feedback`, `/api/event-request`) storing data in DB with admin slack/email notification integrations<br>• **Automated checklist validator**: Script running synthetic checks against APIs, DB pool, and WebSockets |
| **Risks** | • **Launch traffic spike crashes the app** — mitigate with load testing + Vercel auto-scaling (serverless advantage)<br>• **Analytics implementation has tracking gaps** — mitigate with a tracking plan document reviewed before implementation<br>• **Security vulnerabilities discovered late** — mitigate by running OWASP checks in Sprint 9 and fixing in Sprint 10<br>• **Organizer outreach has low response rate** — mitigate by offering "Founding Organizer" badge with premium visibility<br>• **Product Hunt launch timing is bad** — mitigate by scheduling for Tuesday/Wednesday and preparing 2 weeks in advance<br>• **Legal compliance gaps** — mitigate by consulting with legal advisor before launch<br>• **Request/feedback form spam** — mitigate by integrating reCAPTCHA v3 or Cloudflare Turnstile on submission endpoints |
| **Exit Criteria** | ✅ Analytics tracks 30+ events accurately across the user journey<br>✅ Internal dashboard shows DAU, WAU, MAU, and top-line metrics<br>✅ Load test passes: 1000 concurrent users with <500ms p95 latency<br>✅ Zero critical/high security vulnerabilities (Snyk scan clean)<br>✅ Privacy Policy and Terms of Service published<br>✅ Error monitoring active with Slack alerts for P0/P1 errors<br>✅ 200+ organizers contacted; 50+ have active listings<br>✅ **Launch checklist script passes all checks** (DNS, database, SSL, APIs green)<br>✅ Feedback and Event Request forms work end-to-end and store logs |
| **KPIs** | • Analytics coverage: % of key user actions tracked (target: 100% of defined 30 events)<br>• Load test p95 latency (target: <500ms at 1000 concurrent users)<br>• Security scan results (target: 0 critical, 0 high vulnerabilities)<br>• Organizers with active listings at launch (target: ≥50)<br>• Total events listed at launch (target: ≥500)<br>• Launch day uptime (target: 100%)<br>• Week 1 post-launch DAU (target: ≥500)<br>• Product Hunt upvotes on launch day (target: ≥100)<br>• Average response time to feedback/event request submissions (target: <24 hours)<br>• Automated checklist pass rate (target: 100%) |

---

## GANTT-Style Summary

> **Timeline**: 22 weeks (5.5 months) from Sprint 0 kick-off to launch readiness

| Sprint | Name | Weeks | W1–2 | W3–4 | W5–6 | W7–8 | W9–10 | W11–12 | W13–14 | W15–16 | W17–18 | W19–20 | W21–22 |
|--------|------|-------|------|------|------|------|-------|--------|--------|--------|--------|--------|--------|
| **S0** | Discovery & Validation | W1–2 | ████ | | | | | | | | | | |
| **S1** | Foundation & Data Layer | W3–4 | | ████ | | | | | | | | | |
| **S2** | Core Discovery Experience | W5–6 | | | ████ | | | | | | | | |
| **S3** | User Accounts & Live Activity Feed | W7–8 | | | | ████ | | | | | | | |
| **S4** | Organizer Dashboard v1 & Buddy Sync | W9–10 | | | | | ████ | | | | | | |
| **S5** | Search, SEO & Content | W11–12 | | | | | | ████ | | | | | |
| **S6** | Reviews, Trust & Advisories | W13–14 | | | | | | | ████ | | | | |
| **S7** | Community & Social v1 | W15–16 | | | | | | | | ████ | | | |
| **S8** | Recommendations & Intelligence | W17–18 | | | | | | | | | ████ | | |
| **S9** | Mobile Optimization & PWA | W19–20 | | | | | | | | | | ████ | |
| **S10** | Feedback, Request Forms & Launch Prep | W21–22 | | | | | | | | | | | ████ |

### Milestone Summary

| Milestone | Sprint | Week | Deliverable |
|-----------|--------|------|-------------|
| 🔬 Validation Complete | S0 | W2 | Go/No-Go decision with data |
| 🗄️ Data Layer Ready | S1 | W4 | 200+ events in production DB |
| 🚀 Alpha Launch (Internal) | S2 | W6 | Users can browse and discover events |
| 👤 Accounts & Live Feed | S3 | W8 | User accounts, WebSocket Live Activity Feed |
| 📋 Organizer Dashboard v1 | S4 | W10 | Dashboard v1, Buddy Sync calendar integration |
| 🔍 SEO Foundation | S5 | W12 | Google indexing, search, content layer |
| ⭐ Trust & Advisories | S6 | W14 | Reviews, ratings, weather/altitude advisories |
| 👥 Community Features | S7 | W16 | Social graph, groups, activity feed |
| 🧠 Smart Discovery | S8 | W18 | Personalized recommendations live |
| 📱 PWA Ready | S9 | W20 | Installable, offline-capable, dark mode |
| 🎯 Public Launch Ready | S10 | W22 | Forms (feedback/requests), launch checklist verified |

---

## Cross-Sprint Dependency Map

```mermaid
graph LR
    S0["S0: Discovery & Validation"] --> S1["S1: Foundation & Data"]
    S1 --> S2["S2: Core Discovery"]
    S2 --> S3["S3: User Accounts & Live Feed"]
    S2 --> S5["S5: Search & SEO"]
    S3 --> S4["S4: Organizer Dashboard & Sync"]
    S3 --> S6["S6: Reviews & Advisories"]
    S3 --> S7["S7: Community & Social"]
    S4 --> S6
    S6 --> S8["S8: Recommendations"]
    S7 --> S8
    S5 --> S10["S10: Forms & Launch Prep"]
    S8 --> S9["S9: Mobile & PWA"]
    S9 --> S10

    style S0 fill:#ff6b6b,color:#fff
    style S2 fill:#ffa502,color:#fff
    style S4 fill:#1e90ff,color:#fff
    style S10 fill:#2ed573,color:#fff
```

### Critical Path

**S0 → S1 → S2 → S3 → S4 → S6 → S8 → S9 → S10**

The critical path runs through data foundation → discovery → accounts → organizer tools → trust → intelligence → mobile → launch. Any delay on this path delays launch.

### Parallelization Opportunities

| Parallel Track | Can Run Alongside | Notes |
|---|---|---|
| SEO & Content (S5) | Organizer Tools (S4) | SEO work is independent once S2 (discovery pages) ships |
| Blog content writing | Any sprint after S5 starts | Content creation is non-engineering work |
| Organizer outreach | S4 onwards | Sales/BD work runs parallel to engineering |
| Design for S(n+1) | Engineering for S(n) | Designer works 1 sprint ahead of engineering |
| WhatsApp Business API approval | S6–S7 | Application process takes 2–4 weeks |

---

## Cumulative Risk Register

| ID | Risk | Severity | Probability | Sprint | Mitigation |
|----|------|----------|-------------|--------|------------|
| R1 | Event data quality is poor at launch | 🔴 High | High | S0–S1 | Manual curation for first 300 events; quality checklist per event |
| R2 | Organizers don't adopt self-serve tools | 🔴 High | Medium | S4 | White-glove onboarding for first 20 organizers; iterate on feedback |
| R3 | Mobile performance on low-end Android | 🟡 Medium | High | S2, S9 | Test on Moto G4 class devices; enforce performance budgets |
| R4 | SEO takes too long to show results | 🟡 Medium | High | S5 | Start early; combine with paid acquisition for initial traffic |
| R5 | Cold start: no reviews, no social proof | 🟡 Medium | High | S6–S7 | Seed reviews from beta users; create official community groups |
| R6 | WhatsApp Business API approval delayed | 🟡 Medium | Medium | S8 | Apply in S6; use WhatsApp deep links as fallback |
| R7 | User registration conversion is low | 🟡 Medium | Medium | S3 | Allow full browse without login; gate only save/plan features |
| R8 | Recommendation quality insufficient | 🟡 Medium | Medium | S8 | Start with simple content-based filtering; add ML later with more data |
| R9 | Launch day traffic spike crashes app | 🟡 Medium | Low | S10 | Load test to 2x expected peak; serverless architecture auto-scales |
| R10 | Team burnout on aggressive timeline | 🔴 High | Medium | All | Strict 2-week sprints with no scope creep; cut features, not corners |

---

## Sprint Capacity Planning

| Sprint | Design Load | Frontend Load | Backend Load | Key Bottleneck |
|--------|-------------|---------------|--------------|----------------|
| S0 | 🟢 Low | 🟢 Low | 🟢 Low | User research coordination |
| S1 | 🟡 Medium | 🟢 Low | 🔴 High | Database schema design decisions |
| S2 | 🔴 High | 🔴 High | 🟡 Medium | Design↔Frontend coordination |
| S3 | 🟡 Medium | 🔴 High | 🔴 High | Auth provider & WebSocket scaling/reconnection |
| S4 | 🔴 High | 🔴 High | 🔴 High | Dashboard panels & Buddy Sync calendar logic |
| S5 | 🟡 Medium | 🟡 Medium | 🔴 High | Search engine + SEO implementation |
| S6 | 🟡 Medium | 🟡 Medium | 🟡 Medium | Reviews & Weather/Altitude advisories caching |
| S7 | 🟡 Medium | 🔴 High | 🔴 High | Real-time social features |
| S8 | 🟢 Low | 🟡 Medium | 🔴 High | Recommendation algorithm |
| S9 | 🟡 Medium | 🔴 High | 🟢 Low | PWA/service worker complexity |
| S10 | 🟡 Medium | 🟡 Medium | 🟡 Medium | Launch checklist automation & form spam prevention |

---

## Success Criteria at Launch (End of Sprint 10)

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Total events listed | ≥500 | Database count |
| Active organizers | ≥50 | Organizers with ≥1 published event |
| Cities covered | ≥5 | Bangalore, Mumbai, NCR, Pune, Hyderabad |
| Sports categories active | ≥6 | Running, Cycling, Triathlon, Trekking, Adventure, Fitness |
| Registered users (pre-launch beta) | ≥500 | Auth provider count |
| Lighthouse mobile score | ≥80 | Lighthouse CI |
| Event pages indexed by Google | ≥80% | Google Search Console |
| PWA installable | ✅ Yes | Lighthouse PWA audit |
| Uptime SLA | ≥99.5% | Uptime monitoring |
| P0 bugs at launch | 0 | Bug tracker |

---

*Last updated: July 2026*
*Document owner: Product Team*
*Review cadence: Sprint retro (every 2 weeks)*
