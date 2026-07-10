# 13. Risks and Criticism

> This section is intentionally harsh. If this product is worth building, it must survive honest scrutiny.

---

## Why the Product May Fail

### Risk 1: Cold Start — Empty Database = Dead Platform

| Aspect | Detail |
|--------|--------|
| **The Problem** | A discovery platform with 50 events is useless. Athletes will visit once, find nothing relevant, and never return. |
| **Severity** | 🔴 Critical |
| **Why It's Hard** | Seeding 500-1000 events manually across 6 sports and 20+ cities requires 100-200 hours of data entry before a single user arrives. |
| **Mitigation** | Hire 1-2 part-time data entry operators. Scrape BhaagIndia and Townscript. Prioritize Bangalore + Mumbai + Pune first with deep coverage. Do NOT launch until you have 500 events minimum. |
| **Honest Assessment** | This is the single biggest risk. Most aggregator startups die here. You must be willing to do boring, manual data work for 4-8 weeks before seeing any traction. |

### Risk 2: Organizers Don't See Value (Why Would I List Here?)

| Aspect | Detail |
|--------|--------|
| **The Problem** | Small organizers already have their WhatsApp lists and Instagram. Why would they spend time listing on a new platform with zero traffic? |
| **Severity** | 🔴 Critical |
| **Why It's Hard** | Classic chicken-and-egg. Athletes won't come without events. Organizers won't list without athletes. |
| **Mitigation** | List organizer events FOR them without asking permission (public event info is not proprietary). Tell them after: "Your event is already live on GoAthletix, claim your organizer page." Reduce friction to zero. |
| **Honest Assessment** | You must list events first, ask permission later. If you wait for organizer opt-in before having events, you'll wait forever. |

### Risk 3: SEO Takes 6-12 Months to Work

| Aspect | Detail |
|--------|--------|
| **The Problem** | SEO is the #1 growth channel, but Google takes 3-6 months to rank new domains. You'll have near-zero organic traffic for the first quarter. |
| **Severity** | 🟠 High |
| **Mitigation** | Start SEO work from Day 1 (Sprint 1). Invest in content marketing alongside. Use WhatsApp/club distribution as the primary channel until SEO kicks in. Don't expect SEO results before month 4. |

### Risk 4: Users Visit Once and Don't Return

| Aspect | Detail |
|--------|--------|
| **The Problem** | Event discovery is inherently low-frequency. Athletes might search for events 1-2x/quarter, not daily. |
| **Severity** | 🟠 High |
| **Why It Matters** | Low frequency = low retention = hard to build habits = hard to raise funding. |
| **Mitigation** | Registration reminders, weekly email digests, new event alerts for saved preferences. Make the platform useful between event searches. |
| **Honest Assessment** | This is a structural challenge for any discovery platform. Google solves it with daily search intent. You'll need to manufacture reasons to return (new events, content, community). |

### Risk 5: Someone with More Resources Copies This Quickly

| Aspect | Detail |
|--------|--------|
| **The Problem** | Strava, BhaagIndia, or a well-funded startup could build the same thing faster. |
| **Severity** | 🟡 Medium |
| **Why It's Less Scary Than It Seems** | Strava's DNA is activity tracking, not event discovery. BhaagIndia hasn't innovated in 5+ years. A new well-funded startup is the real threat, but they'd face the same cold-start problem. |
| **Mitigation** | Move fast. Build organizer relationships. Create data moat (complete event database). Community trust is defensible. |

### Risk 6: India Is Not a Paying Market for This

| Aspect | Detail |
|--------|--------|
| **The Problem** | Indian athletes may not pay for discovery. Organizers may not pay for featured listings. Revenue model is unproven. |
| **Severity** | 🟠 High |
| **Honest Assessment** | This is a real risk. Indian consumer willingness to pay for digital tools is low. Monetization likely comes from organizer tools (featured listings, analytics, premium placement) and later brand sponsorships, not consumer subscriptions. |

---

## What Would Make It Too Broad

| Trap | Why It's Tempting | Why It's Dangerous |
|------|-------------------|--------------------|
| **Covering every sport type** | "We're the platform for ALL sports" | Cricket, football, badminton have different ecosystems. Stick to endurance + adventure sports. |
| **Building globally from Day 1** | "India is small, let's go global" | Completely different event landscape, SEO, organizer relationships. India first. |
| **Adding social features too early** | "Everyone wants social" | Social needs density (50K+ users). Premature social features feel empty and waste dev time. |
| **Building training/coaching features** | "Athletes want training plans" | You're competing with Strava, Garmin, Nike Run Club. Stay in your lane: discovery. |
| **Building ticketing/payments** | "We can capture transaction revenue" | Enormous regulatory, financial, and technical complexity. Competes with Townscript, Razorpay. |

---

## What Features Should Be Cut

| Feature | Why Cut It | When to Reconsider |
|---------|-----------|-------------------|
| ❌ **Activity tracking (GPS)** | Compete with Strava with 100M+ users? No. | Never — integrate with Strava instead |
| ❌ **In-app messaging** | WhatsApp exists. Don't rebuild it. | Never |
| ❌ **Social feed/timeline** | Needs 50K+ users to not feel empty | After 50K MAU |
| ❌ **Native mobile apps** | Too expensive to build and maintain for a startup | After proving PMF on web |
| ❌ **AI coaching** | Requires sports science + ML expertise | Year 2+ |
| ❌ **Marketplace (gear, nutrition)** | Completely different business | Year 3+ or never |
| ❌ **Multi-language support** | English + Hindi covers 80%+ of target users | When expanding to South India deeply |
| ❌ **Challenges/leaderboards** | Gamification is premature without users | After user profiles and 20K users |
| ❌ **WhatsApp chatbot** | Cool but expensive to build right | After proving web-first discovery works |

---

## Assumptions That May Be Wrong

| Assumption | Why It Might Be Wrong | How to Test |
|-----------|----------------------|-------------|
| "Athletes want a dedicated discovery platform" | Maybe WhatsApp + Instagram is "good enough" for most people | Validate in Sprint 0 with 20 user interviews |
| "Organizers will list events for free" | Maybe they see no value without traffic guarantees | List their events without asking, then measure claim rate |
| "SEO will be a viable growth channel" | Maybe event keywords don't have enough search volume | Check Google Keyword Planner for 50 target keywords before building |
| "Multi-sport positioning is better than single-sport" | Maybe runners don't care about cycling events and vice versa | A/B test multi-sport vs. running-only homepage |
| "India's sports event market is large enough" | Maybe 1,500 events/year isn't enough to build a business on | Map the total addressable event count by sport, city, and month |
| "WhatsApp sharing will drive viral growth" | Maybe people share but don't click | Track share-to-visit conversion rate |
| "Free model works until you have scale" | Maybe you run out of money before monetization | Keep burn rate under $2K/month. Have 12-month runway. |

---

## What Could Become a Distraction

| Distraction | Why It Seems Important | Why It's Not (Yet) |
|-------------|----------------------|-------------------|
| **Talking to VCs before PMF** | "We need funding to scale" | You need 5,000 MAU and 100 organizers first. VCs will come when metrics exist. |
| **Building a perfect app** | "The UX needs to be perfect" | Ship ugly but functional. Data completeness > pixel perfection. |
| **Partnership discussions with big brands** | "Adidas wants to talk!" | Big brand deals take 6-12 months and distract from user growth. Focus on athletes and small organizers. |
| **Adding new cities before deep coverage** | "Let's expand to Delhi!" | 90% coverage in 3 cities > 20% coverage in 10 cities |
| **Building features for edge cases** | "What about virtual events? What about kids' events?" | Edge cases can wait. Serve the core user (adult endurance athletes in metros) first. |
| **Hiring before proving demand** | "We need a full-time engineer" | Build with 1-2 people until you have consistent traffic. |

---

## What Should Be Avoided in the First 6 Months

1. ❌ **Do NOT build payment/ticketing features** — Not even a little.
2. ❌ **Do NOT build native mobile apps** — Web + PWA only.
3. ❌ **Do NOT spend money on ads** — Prove organic demand first.
4. ❌ **Do NOT build social features** — No feeds, no posts, no likes.
5. ❌ **Do NOT hire more than 3 people** — Keep the team tiny and fast.
6. ❌ **Do NOT pursue enterprise/B2B sales** — Focus on self-serve organizer tools.
7. ❌ **Do NOT build an admin panel for everything** — Use Google Sheets + Airtable for operations.
8. ❌ **Do NOT compete with Strava** — You are discovery, not tracking.
9. ❌ **Do NOT launch in more than 5 cities** — Deep, not wide.
10. ❌ **Do NOT raise funding before 5,000 MAU** — Prove demand, then ask for money.
