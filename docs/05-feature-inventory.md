# 5. Feature Inventory

## Feature Classification

- **P0 (Must-Have MVP)**: Required for launch. Product is broken without these.
- **P1 (Should-Have)**: High value, build in Sprint 3-6 post-MVP.
- **P2 (Nice-to-Have)**: Valuable but not critical for first 6 months.
- **P3 (Future Roadmap)**: Build after product-market fit is validated.

---

## P0 — Must-Have MVP Features

| # | Feature | Why It Matters | User Value | Complexity | Dependencies |
|---|---------|----------------|------------|------------|--------------|
| 1 | **Event Listing Pages** | Core product. Each event has a dedicated page with all details. | Athletes can view complete event info in one place | Medium | Event data model, CMS |
| 2 | **Event Data Model** | Normalized schema for all event types (run, cycle, trek, tri) | Consistent, comparable information | Medium | Database design |
| 3 | **Search & Filter** | Athletes can filter by sport, city, date, distance | "Show me all half-marathons in Bangalore in October" | Medium-High | Event data, search index |
| 4 | **City Landing Pages** | SEO entry points: "Running events in Mumbai" | Drives organic traffic, gives city-specific view | Low | Event data, location tagging |
| 5 | **Sport Landing Pages** | SEO entry points: "Cycling events in India" | Categorized browsing by sport type | Low | Sport taxonomy |
| 6 | **Event Detail Page** | Rich event page: date, location, distance, map, registration link, organizer info | Athletes get all info to decide + direct link to register | Medium | Event data model |
| 7 | **External Registration Redirect** | "Register" button opens organizer's official registration URL in new tab | Zero friction to register, no payment complexity | Low | Event data (registration_url field) |
| 8 | **Mobile-Responsive Web** | Works well on Android phones with 4G | 80%+ Indian users are mobile-first | Medium | Frontend framework |
| 9 | **Manual Event Ingestion** | Admin tool to add/edit events manually | Seed initial database before scrapers are built | Low-Medium | Admin panel |
| 10 | **Basic SEO** | Meta tags, OpenGraph, structured data for every event page | Google indexing, WhatsApp share previews | Low | Page templates |
| 11 | **WhatsApp Share Cards** | Tapping "Share" generates a WhatsApp-formatted message with event summary + link | Viral distribution through India's #1 messaging app | Low | OG tags, deep links |
| 49 | **Buddy Sync** | Share custom links with friends to align calendars | Group race planning, viral invite loops | Medium-High | Personal Event Calendar (#14) |
| 50 | **Live Activity Feed** | Dynamic feed of user actions like saves, follows, and calendar adds, powered by WebSockets | Real-time social proof, active community feel | High | WebSockets infra, User Accounts (#12) |

---

## P1 — Should-Have Features (Post-MVP, Sprints 3-6)

| # | Feature | Why It Matters | User Value | Complexity | Dependencies |
|---|---------|----------------|------------|------------|--------------|
| 12 | **User Accounts (Email/Google/Phone)** | Required for save, plan, review features | Personalized experience | Medium | Auth system |
| 13 | **Save/Bookmark Events** | Athletes save events they're interested in | "My Events" list for later decision-making | Low | User accounts |
| 14 | **Personal Event Calendar** | Calendar view of saved events | Plan race season visually | Medium | User accounts, calendar UI |
| 15 | **Registration Reminders** | Push/email/WhatsApp reminder when registration opens or closes | Never miss a deadline | Medium | User accounts, notification system |
| 16 | **Organizer Accounts & Dashboard** | Organizers create accounts, submit events, see analytics | Self-serve event listing, reduce admin work | High | Auth, admin tools |
| 17 | **Event Submission Form** | Structured form for organizers to submit new events | Scale event ingestion beyond manual entry | Medium | Organizer accounts, data validation |
| 18 | **Organizer Profile Pages** | Public page showing organizer's events, rating, history | Trust building, organizer brand | Medium | Organizer accounts |
| 19 | **Event Reviews & Ratings** | Athletes rate events 1-5 stars with text reviews | Trust signals, decision-making | Medium | User accounts, moderation |
| 20 | **Full-Text Search** | Search by event name, organizer, location | Quick finding for returning users | Medium | Search infrastructure (Algolia/Meilisearch) |
| 21 | **Instagram Share Templates** | Generate Instagram-story-ready event cards | Organizers share beautifully on Instagram | Medium | Image generation, template design |
| 22 | **Event Comparison** | Compare 2-3 events side-by-side | "Which half-marathon should I do?" | Medium | Standardized event data |
| 23 | **Past Events Archive** | Show completed events with results, photos, reviews | Historical record, trust for organizers, SEO content | Low-Medium | Event lifecycle |
| 24 | **Web Scraping Pipeline** | Automated scraping of BhaagIndia, Townscript, organizer sites | Scale event data collection | High | Scraping infra, data normalization |
| 51 | **Weather & Altitude Advisories** | Display dynamic climate, terrain, and acclimatization guides for high-altitude/monsoon events | Safe planning for extreme weather and high altitude | Medium | Event Detail Page (#6) |
| 52 | **Verified Organizer Dashboard** | Claim profile, view traffic/save/follow analytics, and broadcast templates to followers | High-value retention tool for race directors | High | Organizer Profile Pages (#18), Organizer Analytics (#31) |
| 53 | **Official Event Results** | Per-event results page: full finisher list with bib, name, category, gun/chip time, overall and category position, searchable by name or bib. Phased — Phase 1 is an outbound `results_url` to the timing partner; Phase 3 is ingested structured entries | The reason an athlete returns to a site after the event. Every competitor loses the user to the timing partner's domain the moment the race ends; holding results holds the relationship. Also the single largest SEO surface — one page per event per year, each with hundreds of searched names | High | Event Detail Page (#6), Past Events Archive (#23), scraping/feed integration with timing partners |
| 54 | **Claim Your Result** | Match an ingested official result row to a logged-in profile; auto-populates PB history, the season poster (#21) and the past-events archive (#23) | Turns a read-only results page into an account reason. Converts anonymous results traffic — the highest-volume traffic a race site gets — into registered users | Medium | Official Event Results (#53), User Profiles (#36) |
| 56 | **Gear Marketplace** | Equipment, apparel and nutrition storefront, surfaced as a header menu, a homepage rail matched to the user's saved events, and footer SEO links. GoAthletix holds no stock — the seller fulfils and owns returns | The only site that knows someone just entered a 21.1K three weeks out. That context, not catalogue breadth, is the advantage; a generic sports store has no reason to exist. Also the first revenue line that does not touch an entry fee, which protects the Neutrality pillar | High | Catalogue/affiliate source, saved-events signal (#13), seller terms |
| 55 | **Editorial Featured Events** | Admin-curated `is_featured` / `featured_rank` / `featured_until` on events, driving the homepage hero carousel and seasonal collections | The Trust pillar forbids calling anything "Popular" without a signal behind it, and `interest_count` / `view_count` are at zero on all 10,100 rows. Curation is the honest bridge until engagement data exists | Low | Schema column, a minimal admin surface |

---

## P2 — Nice-to-Have Features (Months 4-9)

| # | Feature | Why It Matters | User Value | Complexity | Dependencies |
|---|---------|----------------|------------|------------|--------------|
| 25 | **Trending Events** | Show most-viewed, most-saved events | Social proof, FOMO | Low | Analytics, view counts |
| 26 | **"Near Me" Location-Based Discovery** | Use GPS to show events within X km | Hyper-local discovery | Medium | Geolocation, location indexing |
| 27 | **Event Difficulty Rating** | Standardized difficulty scale (Beginner/Intermediate/Advanced/Expert) | Helps first-timers self-select | Low | Event data enrichment |
| 28 | **Curated Collections** | "Best trail runs in Western Ghats", "Beginner 5Ks" | Editorial content, SEO, engagement | Low-Medium | Content creation |
| 29 | **Notification Center** | In-app notifications for reminders, new events, reviews | Re-engagement | Medium | Notification infra |
| 30 | **PWA (Progressive Web App)** | Install on home screen, push notifications, offline | App-like experience without app store | Medium | Service workers, manifest |
| 31 | **Organizer Analytics** | Views, saves, registration clicks, share counts per event | Organizer value prop, monetization foundation | Medium | Analytics pipeline |
| 32 | **Verified Organizer Badges** | Manual verification of organizers | Trust, quality signal | Low | Verification process |
| 33 | **Event Photo Galleries** | Past event photos from organizers/athletes | Visual trust, engagement | Low-Medium | Image upload, storage |
| 34 | **Email Digest** | Weekly email: "New events in your city" | Retention, re-engagement | Low-Medium | Email infra, user preferences |
| 35 | **Multi-City Calendar View** | Plan events across cities (travel athletes) | Competitive runners who travel for events | Medium | Calendar + location data |

---

## P3 — Future Roadmap Features (Post-PMF)

| # | Feature | Why It Matters | User Value | Complexity | Dependencies | OUT OF SCOPE for v1? |
|---|---------|----------------|------------|------------|--------------|----------------------|
| 36 | **User Profiles** | Public athlete profiles with event history | Social identity | High | User accounts, events | ✅ OUT OF SCOPE |
| 37 | **Follow Organizers/Athletes** | Get notified when someone posts/does an event | Social engagement | Medium | User accounts, social graph | ✅ OUT OF SCOPE |
| 38 | **Activity Feed** | Timeline of events, reviews, photos from followed users | Social retention | High | Social graph, content pipeline | ✅ OUT OF SCOPE |
| 39 | **Club Pages** | Clubs have their own page with calendar, members, events | Community layer | High | Club accounts, member management | ✅ OUT OF SCOPE |
| 40 | **Challenges** | "Run 100K in January", "Complete 3 treks in 2026" | Gamification, engagement | High | User accounts, tracking | ✅ OUT OF SCOPE |
| 41 | **Activity Tracking (Strava-like)** | Log runs, rides, treks with GPS | Engagement, data moat | Very High | Mobile app, GPS, mapping | ✅ OUT OF SCOPE |
| 42 | **Strava/Garmin Integration** | Sync activities from existing trackers | Convenience, avoids cold-start | High | API integrations, OAuth | ✅ OUT OF SCOPE |
| 43 | **AI Coach** | Personalized training plans tied to event calendar | Premium feature, monetization | Very High | ML, sports science, data | ✅ OUT OF SCOPE |
| 44 | **Native Mobile Apps** | iOS and Android apps | Better UX, push, offline | Very High | Mobile dev team | ✅ OUT OF SCOPE |
| 45 | **In-App Registration/Ticketing** | Process payments, manage tickets | Monetization | Very High | Payment gateway, compliance | ✅ OUT OF SCOPE |
| 46 | **Marketplace (Gear, Nutrition)** | Sell products to athletes | Revenue diversification | Very High | E-commerce, fulfillment | ✅ OUT OF SCOPE |
| 47 | **WhatsApp Bot** | Conversational event discovery via WhatsApp | Meet users where they are | High | WhatsApp Business API, NLP | ✅ OUT OF SCOPE |
| 48 | **Content/Blog Platform** | Training articles, event previews, race reports | SEO, authority, engagement | Medium | CMS, content team | Partially in scope (curated only) |

---

## Feature Dependency Map

```
Event Data Model (#2)
├── Event Listing Pages (#1)
│   ├── Event Detail Page (#6)
│   │   ├── External Registration Redirect (#7)
│   │   ├── WhatsApp Share Cards (#11)
│   │   ├── Event Reviews (#19) → User Accounts (#12)
│   │   └── Weather & Altitude Advisories (#51)
│   ├── Search & Filter (#3)
│   └── Event Comparison (#22)
├── City Landing Pages (#4)
├── Sport Landing Pages (#5)
├── Manual Event Ingestion (#9)
│   └── Web Scraping Pipeline (#24)
└── Basic SEO (#10)

Official Event Results (#53)
├── Claim Your Result (#54)
│   └── Instagram Share Templates (#21)
└── Past Events Archive (#23)

User Accounts (#12)
├── Save/Bookmark Events (#13)
│   ├── Personal Event Calendar (#14)
│   │   └── Buddy Sync (#49)
│   └── Registration Reminders (#15)
├── Event Reviews (#19)
├── Live Activity Feed (#50)
└── User Profiles (#36, Future)

Organizer Accounts (#16)
├── Event Submission Form (#17)
├── Organizer Profile Pages (#18)
│   └── Verified Organizer Dashboard (#52)
├── Organizer Analytics (#31)
└── Instagram Share Templates (#21)
```
