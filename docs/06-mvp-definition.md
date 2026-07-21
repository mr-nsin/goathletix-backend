# 6. MVP Definition

## The Smallest Launchable Product

The MVP is a **responsive web application** that lets athletes discover, filter, view, and share sports events across India. No accounts required for discovery. External registration links only. Manual event seeding.

---

## MVP Feature Scope

### In Scope ✅

| Feature | Sprint | Notes |
|---------|--------|-------|
| Event database with normalized schema | Sprint 1 | Support: running, cycling, trekking, triathlon, fitness, racquet, water, adventure |
| Manual event ingestion (admin tool) | Sprint 1 | Seed 10,100 events database |
| Event listing page with filters | Sprint 2 | Filters: sport, city, date range, distance, difficulty |
| Event detail page | Sprint 2 | Name, date, location, distance, elevation, price range, map, organizer, registration link |
| External registration redirect | Sprint 2 | "Register" opens organizer's URL in new tab |
| City / Sport landing pages | Sprint 2 | Optimized SEO landing pages |
| Mobile-responsive design | Sprint 2 | Works on 360px-wide Android screens |
| SEO optimization | Sprint 2 | Meta tags, OG tags, structured schema |
| WhatsApp share cards | Sprint 2 | Share button generates formatted WhatsApp message |
| Basic search (text) | Sprint 2 | Search by event name, city, organizer |
| **Live Activity Feed (P0)** | Sprint 2 | Real-time tickers showing public user interactions (e.g., bookmarks, calendar additions) |
| **OAuth Login (Google, FB, LinkedIn)** | Sprint 3 | Supabase Auth integration |
| **Onboarding Questionnaire** | Sprint 3 | Profile setup asking: sports of interest, preferred cities, distance preferences |
| **Personalized Dashboard** | Sprint 3 | Filtered events feed based on onboarding data |
| **Follow Organizers & Events** | Sprint 3 | Get updates from favorite organizers |
| **Personal Event Calendar** | Sprint 3 | Save events to personal calendar sheet |
| **Registration Reminders** | Sprint 3 | Set notifications for registration dates |
| **Buddy Sync (P0)** | Sprint 3 | Share bookmarks and sync training/race calendars with friends |
| **Request to Add Event Form** | Sprint 4 | Dedicated form for organizers and users to submit details of local events |
| **Request a Feature & Feedback Form** | Sprint 4 | Dedicated form for user feedback and feature requests |

### Non-Goals for MVP ❌

| Feature | Why It's Out |
|---------|--------------|
| Automated scraping (Scrapy/Playwright) | Seed database generated; daily automated crawling is Phase 2 |
| Recommendations/personalization (AI) | Basic filter matches onboarding data; ML engines are Phase 3 |
| Payment/ticketing | Explicitly out of scope for all versions |
| Mobile app | Responsive web + PWA first |
| Full social networking / chat | Tickers and public activity feeds are in; direct messaging & posting are Phase 2 |
| Device GPS Integration (Strava/Garmin) | Stay in discovery lane; device track sync integrations are Year 2 (Friend calendar sync is in) |


---

## Data Required for MVP

### Event Data (per event)

| Field | Required? | Example |
|-------|-----------|---------|
| event_name | ✅ | "Tata Mumbai Marathon 2026" |
| sport_type | ✅ | running, cycling, trekking, triathlon, adventure, fitness |
| event_date | ✅ | 2026-01-19 |
| event_end_date | Optional | 2026-01-19 |
| city | ✅ | Mumbai |
| state | ✅ | Maharashtra |
| venue / start_point | ✅ | "CST, Mumbai" |
| latitude, longitude | Preferred | 18.9398, 72.8355 |
| distance_options | ✅ | ["5K", "10K", "21.1K", "42.2K"] |
| elevation_gain | Optional | "450m" |
| difficulty | Optional | Beginner / Intermediate / Advanced / Expert |
| price_range | ✅ | "₹800 - ₹2500" |
| registration_url | ✅ | "https://tatamumbaimarathon.procam.in/register" |
| registration_opens | Optional | 2025-08-01 |
| registration_closes | Optional | 2025-12-31 |
| organizer_name | ✅ | "Procam International" |
| organizer_website | Optional | "https://procam.in" |
| event_description | ✅ | 500-2000 chars |
| event_image | Preferred | URL to hero image |
| tags | Optional | ["AIMS certified", "BQ qualifier", "scenic route"] |
| terrain | Optional | Road / Trail / Mixed |
| is_virtual | ✅ | false |
| status | ✅ | upcoming / registration_open / sold_out / completed / cancelled |

### Seed Data Target

| Metric | Target |
|--------|--------|
| Total events at launch | 500-1000 |
| Cities covered | 20-30 (all major + key Tier 2) |
| Sport types covered | 6 (running, cycling, trekking, triathlon, adventure, fitness) |
| Events per month (forward-looking) | 100-200 for next 6 months |
| Organizers represented | 200-400 |

### Data Sources for Seeding

1. **BhaagIndia.com** — Manually extract running events
2. **Townscript** — Browse sports category
3. **Instagram** — Monitor 50-100 organizer accounts
4. **Google Search** — "marathon 2026 india", "cycling event [city]", "trek [region]"
5. **Running club contacts** — Direct outreach to 20-30 clubs
6. **Event aggregator sites** — IndiaRunning, RunIndia
7. **Facebook groups** — "Runners of [City]", cycling groups

---

## Pages/Screens Needed for MVP

| Page | URL Pattern | Purpose |
|------|-------------|---------|
| **Homepage** | / | Hero, search bar, featured events, browse by sport, browse by city, Live Activity Feed ticker |
| **Event Listing (filtered)** | /events?sport=running&city=mumbai&date=2026-01 | Filterable grid of events |
| **Event Detail** | /events/tata-mumbai-marathon-2026 | Full event information + registration link |
| **City Landing** | /city/mumbai | All events in Mumbai, city-specific SEO |
| **Sport Landing** | /sport/running | All running events, sport-specific SEO |
| **About** | /about | What is GoAthletix, mission, team |
| **Request to Add Event** | /add-event | Dedicated form page for organizers/users to submit event details |
| **Request a Feature & Feedback** | /feedback | Dedicated form page for user feedback and feature requests |
| **Buddy Sync Dashboard** | /dashboard/buddies | User interface to connect with buddies and view synced calendars/bookmarks |
| **Search Results** | /search?q=marathon | Text search results |
| **404 / Not Found** | /404 | Helpful error page |

---

## Basic User Flows

### Flow 1: Athlete Discovers an Event

```
Homepage → Browse by Sport (e.g., "Running") → Filter by City ("Bangalore") + Date ("Oct 2026")
→ View Event Listing → Click Event Card → View Event Detail Page
→ Click "Register" → Redirected to Organizer's Registration Page (new tab)
```

### Flow 2: Athlete Finds Event via Search

```
Homepage → Type in Search Bar ("Mumbai Marathon") → View Search Results
→ Click Event → View Event Detail Page → Click "Register" or "Share on WhatsApp"
```

### Flow 3: Athlete Shares Event on WhatsApp

```
Event Detail Page → Click "Share on WhatsApp" → WhatsApp opens with pre-formatted message:

"🏃 Tata Mumbai Marathon 2026
📅 Jan 19, 2026 | 📍 CST, Mumbai
🏁 5K | 10K | Half Marathon | Full Marathon
💰 ₹800 - ₹2500

Check it out: https://goathletix.in/events/tata-mumbai-marathon-2026"
```

### Flow 4: Athlete Discovers Events via Google

```
Google Search: "half marathon bangalore 2026" → Clicks SEO-optimized City+Sport Page
→ Views filtered event listing → Clicks event → Views detail → Registers
```

### Flow 5: Buddy Sync (Share bookmarks & calendar sync)

```
Logged-in User → Navigates to /dashboard/buddies → Clicks "Generate Share Link"
→ Sends unique URL to a friend via WhatsApp → Friend opens link and accepts sync request
→ Both users can now view a merged calendar highlighting each other's bookmarked races and planned events
```

### Flow 6: Live Activity Feed Interaction

```
User lands on Homepage/Dashboard → Views real-time ticker displaying public interactions (e.g., "Arjun bookmarked Sattal Trail Run")
→ Clicks on the event name in the feed → Navigates directly to the Event Detail Page to discover event details
```

### Flow 7: Request to Add Event (For organizers/users)

```
User/Organizer clicks "Add Event Request" in footer/nav → Redirected to /add-event form
→ Inputs event name, sport, date, venue, registration URL, price range, and organizer contact info
→ Clicks "Submit Request" → Submission logged to PostgreSQL with status "pending_review"
→ Admin notified via dashboard for validation and publishing
```

### Flow 8: Request a Feature & Give Feedback

```
User clicks "Send Feedback" or "Request a Feature" → Redirected to /feedback form
→ Selects type ("Feature Request" or "General Feedback") → Fills out feedback description
→ Clicks "Submit Feedback" → Feedback logged to database for product management review
```

> **Note**: In MVP, there is no organizer dashboard. All event management is done by the platform admin using the database log from the submission forms. Self-serve organizer tools come in Sprint 5.

---

## Success Metrics for MVP

### Launch Criteria (Before Public Launch)

| Metric | Target |
|--------|--------|
| Events in database | ≥ 500 |
| Cities covered | ≥ 20 |
| Sport types covered | ≥ 5 |
| All event pages load in < 3 seconds | 100% |
| Mobile responsiveness tested | ✅ |
| WhatsApp share working | ✅ |
| Live Activity Feed ticker working | ✅ |
| Buddy Sync invite generation working | ✅ |
| SEO meta tags on all pages | ✅ |
| Google Search Console submitted | ✅ |

### Post-Launch KPIs (First 30 Days)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Unique visitors** | 5,000 | Google Analytics |
| **Event detail page views** | 10,000 | Analytics |
| **Registration Intent Clicks (RIC)** | **800** | Click tracking (increased via social & sync discovery) |
| **WhatsApp shares** | 350 | Share button clicks (including Buddy Sync invites) |
| **Organic search impressions** | 50,000 | Google Search Console |
| **Avg. session duration (session length)** | **> 3.5 minutes** | Analytics (increased via Live Activity Feed & Buddy profiles) |
| **Bounce rate** | < 50% | Analytics |
| **Event additions via Request form** | 75 | Database submissions |
| **Feedback/Feature requests submitted** | 100 | Database submissions |
| **Return visitors (return rate within 30 days)** | **35%** | Analytics (driven by Buddy Sync calendar retention) |
| **Active Buddy Sync Connections** | 400 | Database records of synchronized user pairs |
| **Live Activity Feed clicks** | 1,200 | Ticker interaction tracking |

### Post-Launch KPIs (First 90 Days)

| Metric | Target |
|--------|--------|
| Unique visitors | 25,000 |
| Events in database | 1,500+ |
| Cities covered | 40+ |
| **Registration Intent Clicks (RIC)** | **4,500** (accelerated by viral Buddy loops) |
| Event Request / Organizer submissions | 300 |
| Google organic clicks | 5,000+ |
| Ranking for 50+ event keywords | Top 10 positions |
| **Active Buddy Sync Connections** | 2,500+ |
