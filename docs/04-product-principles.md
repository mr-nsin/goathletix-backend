# 4. Core Product Principles

---

## What the Product Must Always Do

1. **Be useful on Day 1 with zero user accounts**: A visitor should be able to discover, filter, and view events without creating an account. Account creation is only required for saving, planning, and reviewing.

2. **Prioritize data completeness over feature polish**: A platform with 90% of India's events and basic UX beats a platform with 20% of events and beautiful UX. Data IS the product.

3. **Redirect to official registration, never own the transaction**: In v1, every event links to the organizer's own registration page. No payment processing, no ticketing. This keeps the platform neutral and trusted.

4. **Be WhatsApp-native in distribution**: Every event page, share button, and organizer tool must produce WhatsApp-optimized output — deep links, preview cards, compact text. India communicates on WhatsApp.

5. **Serve the athlete first, monetize the organizer later**: The athlete is the demand side. Build for them first. Organizer revenue comes after athlete trust is earned.

6. **Work on bad connections and cheap phones**: 60% of Indian users are on Android devices under ₹15,000 with inconsistent 4G. The platform must be fast, lightweight, and progressively enhanced.

7. **Be multi-sport from Day 1**: Do not launch as "just a running app." Include cycling, treks, triathlons, adventure sports, and fitness events from the start. Multi-sport positioning is the differentiation.

---

## What the Product Must NEVER Do in V1

| Never Do | Why |
|----------|-----|
| ❌ Build ticketing or payment processing | Enormous regulatory, financial, and technical complexity. Compete with Townscript, Razorpay, etc. on their home turf. |
| ❌ Build activity tracking (GPS, pace, distance) | Compete with Strava, Garmin, Nike Run Club. Cannot win this fight. |
| ❌ Build training plans or coaching | Requires deep sports science expertise. Will distract from core discovery value. |
| ❌ Build a social feed (timeline, posts, likes) | Premature. Social only works with density. Need 50K+ users before social is valuable. |
| ❌ Build in-app messaging/chat | WhatsApp already solves this. Don't rebuild WhatsApp poorly. |
| ❌ Build a marketplace for sports gear/nutrition | Scope explosion. E-commerce is a different business. |
| ❌ Over-invest in AI/ML before having data | Recommendations need usage data. Ship the discovery UX first, collect data, then personalize. |
| ❌ Build native mobile apps before web is proven | Start with responsive web + PWA. Native apps are expensive to build and maintain. Validate demand first. |

---

## Product Constraints

| Constraint | Implication |
|------------|-------------|
| **No payment processing** | All "Register" buttons open external URLs in new tabs |
| **No user-generated events without verification** | Prevent spam by requiring organizer accounts with basic verification |
| **English + Hindi only for v1** | Skip Kannada, Tamil, Telugu, Marathi in MVP. Add later based on city expansion |
| **India only for v1** | No Southeast Asia, no global. Focus on Indian event database completeness |
| **Team of 2-5 for first 6 months** | Every feature must be evaluable by a tiny team. Ruthless prioritization |
| **Bootstrap/pre-seed budget** | No expensive infrastructure. Use free tiers, serverless, CDN. Keep monthly costs under $200 |
| **Event data is cold-start problem** | Must manually seed 500-1000 events before launch. Cannot launch with empty database |

---

## Design Principles

| Principle | What It Means |
|-----------|---------------|
| **Information-dense, not content-sparse** | Event cards should show sport, date, city, distance, price, rating at a glance. No giant hero images with no info. |
| **Filter-first, not browse-first** | Users should land on a filtered view (sport + city + date) rather than an infinite scroll of all events |
| **Mobile-first but desktop-capable** | Design for 6-inch Android screens first. Desktop is secondary. |
| **Shareable by default** | Every event page generates a beautiful WhatsApp/Instagram share card automatically |
| **Zero learning curve** | A first-time user should be able to find and save an event in under 60 seconds |
| **Trust through transparency** | Show organizer history, past events, reviews, participant counts. Hide nothing. |
| **Progressive disclosure** | Don't overwhelm beginners. Show basic info first, let power users dig deeper. |

---

## Growth Principles

| Principle | How |
|-----------|-----|
| **SEO is the primary growth engine** | Every event, city, sport combination should have a unique, indexable page. Target: "half marathon bangalore 2026", "cycling events pune", "treks near mumbai" |
| **WhatsApp sharing is the viral loop** | Make event share cards so good that athletes forward them in groups without being asked |
| **Organizer onboarding is supply-side growth** | Every new organizer brings their own audience. 1 organizer = 200-2000 potential users |
| **Content is the moat** | Event guides, "best events of 2026" lists, training advice tied to events. Content brings SEO + authority |
| **No paid acquisition in first 6 months** | Prove organic demand first. Paid ads are a crutch. |
| **City-by-city expansion, not national spray** | Launch in 3-5 cities with 90%+ event coverage before expanding |
