# Product Context: GoAthletix

## Why the Product Exists
The active lifestyle segment in India (runners, cyclists, trekkers, triathletes) is booming, but finding events is highly manual. Events are scattered across Instagram posts, WhatsApp groups, and old-school listing sites. We exist to provide a single, clean, mobile-responsive gateway for event discovery and season planning.

## Tone & Design Philosophy
- **Dual-Theme Marketplace Aesthetics**: A clean, data-dense, and highly functional dual-theme (Light/Dark) layout, moving away from purely decorative 3D aesthetics to a utility-focused, high-information-density UI (inspired by platforms like Airbnb).
- **Utility First**: The landing page immediately offers powerful, unified search (Where & When) and scrollable filter chips. Users can browse events, sports, and cities instantly without signing up.
- **Scarcity & Live Engagement**: Heavy emphasis on FOMO (Fear Of Missing Out) and live activity, featuring closing-soon progress bars, live tickers, and prominent date badges.

## Detailed Mockup Product Requirements (Rev 5)
Based on the latest Main Page Mockup, the product has evolved into a robust three-sided marketplace (B2C, B2B, and E-commerce). The required systems include:

### 1. Core Discovery Engine & Search
- **Unified Global Search:** A pill-shaped search bar handling fuzzy matching for events, sports, cities, clubs, and gear.
- **Geospatial & Proximity Filtering:** "Near Me" functionality with a pinned location radius (e.g., 25km, 50km, 100km).
- **Taxonomy Filtering:** Complex tagging (age brackets, formats, difficulty) mapped to scrollable chip filters.

### 2. Scarcity & Real-Time Engagement
- **Live Activity Ticker:** A persistent bottom strip broadcasting real-time platform actions ("Rahul just registered").
- **Dynamic Announcement Bar:** Admin-driven top banner for urgent notifications (e.g., event registration closing).
- **Inventory/Capacity Tracking:** Event cards displaying visual progress bars when events reach high capacity (e.g., 92% full).

### 3. User Identity, Social, and Planning
- **Personal Season Planner:** A 12-month calendar UI for plotting races over the year.
- **Social Graph:** Ability for users to "Follow" organizers and join local "Clubs".
- **Action Centers:** Header icons for Alerts, Cart, and My Calendar with badge notifications.

### 4. Multi-Vendor Marketplace (Gear)
- **Contextual E-commerce:** A "Shop Gear" dropdown and product rails that dynamically surface equipment (shoes, nutrition) relevant to the athlete's specific sport and upcoming event distance.
- **Dropship/Affiliate Model:** GoAthletix does not hold stock; orders are fulfilled by external sellers.

### 5. B2B Organizer SaaS
- **Organizer Dashboard:** A dedicated interface for event directors to claim pages, view rich analytics, and message their followers.
- **Verified Organizers:** Badging system (blue ticks) and featured organizer cards showing follower counts and upcoming events.

### 6. Results & Editorial Content
- **Guides & Articles:** A lightweight CMS driving the homepage "Guides" rail for training advice and race-day prep.
- **Results Integration:** Deep linking for post-race results, allowing athletes to search their bib numbers.

## Target User Cohorts
1. **Endurance Athletes (Primary)**: Runners, cyclists, triathletes wanting to plan training and race calendars.
2. **Trekkers & Adventurers**: Individuals looking for weekend hikes, trail races, and outdoor activities.
3. **Event Organizers**: Seek high-intent distribution channels beyond Facebook/Instagram ads.
4. **Sports Clubs**: Local communities needing a central ride/run calendar.
5. **Gear Sellers/Brands**: Seeking targeted visibility to athletes during their pre-race preparation windows.

## 3-Sided Marketplace Feature Matrix (Inspired by Sportifi)
To fully support the multi-vendor ecosystem, the platform requires specific feature sets mapped to three core personas:

### For Organizers (Event Directors / B2B)
- **Advanced Ticketing:** Dynamic ticket tiers (Early-bird, VIP), custom registration forms (T-shirt size, emergency contacts), and wave/batch capacity management.
- **Operations & Logistics:** Volunteer dashboard/app for BIB distribution, kit scanning, and RFID/BIB timing hardware API integrations.
- **Marketing & CRM:** Segmented broadcasting (WhatsApp/SMS/Email to specific registrants), promo code engine, and UTM affiliate tracking.
- **Live Analytics:** Dashboard tracking real-time revenue, demographics (Age/Gender/City), and category performance.
- **Post-Race Automation:** Auto-generation of Finisher and Participation certificates injected with exact chip times.

### For Athletes (Participants / B2C)
- **Frictionless Discovery & Booking:** Geospatial search, multi-ticket purchasing (registering for friends/family), and a sub-3-minute checkout.
- **The Athlete Hub:** Central dashboard to access upcoming event QR codes for expo check-ins, past race results, downloadable digital certificates, and tagged race-day photos.
- **Social & Scarcity Alerts:** Real-time FOMO alerts ("92% full") and the ability to "Follow" organizers or join local "Clubs".

### For Sellers (Gear Marketplace Vendors)
- **Vendor Dashboard:** Financial onboarding via Stripe Connect for automated payouts, SKU, and inventory management.
- **Contextual Merchandising:** Rule-based product surfacing (e.g., surfacing ultra-vests automatically to athletes who register for an ultramarathon).
- **Order Fulfillment:** Dashboard to view pending dropship orders, print shipping labels, and provide tracking URLs to athletes.
- **Sales Analytics:** Data insights showing which specific races/events drive the highest conversion rates for their gear.
