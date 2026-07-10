# 12. Go-To-Market Plan

---

## Best Launch Geography

### Recommended: Start with 3 Cities (Phase 1)

| City | Why | Event Density | Community Strength | Risk |
|------|-----|---------------|-------------------|------|
| **Bangalore** 🥇 | India's running capital. Highest density of endurance athletes. Tech-savvy users. Strong cycling/trek community. | Very High | Very High | Low |
| **Mumbai** 🥈 | Largest city. Tata Mumbai Marathon creates massive awareness. Strong running clubs. | Very High | High | Low |
| **Pune** 🥉 | Strong running/cycling culture. Many trail events in Sahyadris. Close to Mumbai for network effects. | High | High | Low |

### Phase 2 Expansion (Month 4-6)

| City | Why |
|------|-----|
| **Delhi NCR** | Large population, growing running culture, Airtel Delhi Half Marathon |
| **Hyderabad** | Rapidly growing fitness scene, Hyderabad Marathon |
| **Chennai** | Strong cycling community, TCS Chennai Marathon |

### Phase 3 (Month 7-12)

Goa, Kolkata, Ahmedabad, Jaipur, Dehradun (trek hub), Manali/Leh (adventure hub), Coimbatore, Kochi.

> **Critical Rule**: Do NOT launch nationally with thin data. 90% coverage in 3 cities >> 10% coverage in 30 cities.

---

## Best First User Segment

### Primary Wedge: **Serious Recreational Runners in Bangalore**

| Why This Segment | Evidence |
|-----------------|----------|
| They participate in 5-10+ events/year | High frequency = high discovery need |
| They actively search for events | Already using BhaagIndia, Instagram, WhatsApp |
| They influence others | Club leaders, Strava followers, WhatsApp group admins |
| They share event info | Natural viral distribution |
| They're tech-savvy | Will adopt a web platform |
| They have disposable income | Spend ₹5K-50K/year on events |

### NOT the first segment

- ❌ First-time runners (don't know what they want)
- ❌ Large event organizers (they have their own distribution)
- ❌ Adventure tourists (low frequency, hard to retain)

---

## Best Acquisition Channels

### Ranked by Expected ROI (First 6 Months)

| # | Channel | Strategy | Expected Contribution | Cost |
|---|---------|----------|----------------------|------|
| 1 | **SEO / Organic Search** | Create indexable pages for every event + city + sport combination. Target long-tail keywords like "half marathon bangalore 2026", "cycling events pune october" | 40% of traffic by month 6 | Free (time investment) |
| 2 | **WhatsApp Viral Sharing** | Make event share cards so good they get forwarded organically. Pre-formatted messages with emoji + link. Organizer share templates. | 25% of traffic | Free |
| 3 | **Running/Cycling Club Partnerships** | Partner with 20-30 clubs in Bangalore, Mumbai, Pune. Offer them a club page on the platform. They share with members. | 15% of traffic | Free (relationship investment) |
| 4 | **Instagram Content** | Post event roundups, "Top 10 runs this month", training tips tied to events. Use reels for engagement. | 10% of traffic | Free (content creation time) |
| 5 | **Organizer Co-Marketing** | Organizers add "Listed on GoAthletix" badge to their communications. Include platform link in registration confirmation emails. | 5% of traffic | Free (organizer partnerships) |
| 6 | **Reddit / Running Communities** | Share useful content (not spam) on r/running, r/india, running Facebook groups | 3% of traffic | Free |
| 7 | **Google Ads (Later)** | Only after organic proves demand. Target high-intent keywords. | 2% of traffic | Paid (₹5-15 per click) |

---

## SEO Strategy

### Keyword Targets (Priority Order)

| Keyword Pattern | Example | Search Volume Estimate | Competition |
|----------------|---------|----------------------|-------------|
| `[event name] [year]` | "mumbai marathon 2026" | 10K-50K/month | Medium |
| `[sport] events [city]` | "running events bangalore" | 1K-5K/month | Low |
| `[sport] events [city] [month/year]` | "cycling events pune october 2026" | 100-500/month | Very Low |
| `[sport] events near me` | "running events near me" | 5K-10K/month | Medium |
| `best [sport] events india` | "best marathons india 2026" | 1K-5K/month | Low |
| `[trek name]` | "hampta pass trek" | 5K-10K/month | Medium |
| `[event type] for beginners [city]` | "5k run for beginners bangalore" | 500-1K/month | Very Low |

### SEO Page Structure

```
/ (homepage)
├── /sport/running
│   ├── /sport/running/bangalore
│   ├── /sport/running/mumbai
│   └── ...
├── /sport/cycling
├── /sport/trekking
├── /sport/triathlon
├── /city/bangalore
│   ├── /city/bangalore/running
│   └── /city/bangalore/cycling
├── /city/mumbai
├── /events/[event-slug]  (individual event pages)
├── /organizer/[organizer-slug]
└── /blog/
    ├── /blog/best-marathons-india-2026
    └── /blog/beginner-running-guide-bangalore
```

### SEO Technical Requirements

- Server-side rendering (SSR) or static site generation (SSG) for all event pages
- Structured data (Schema.org Event markup) on every event page
- OpenGraph tags for WhatsApp/Instagram previews
- Canonical URLs for deduplication
- XML sitemap updated automatically
- Page load time < 2 seconds
- Mobile-first indexing compatible

---

## Organizer Acquisition Strategy

### Phase 1: Manual Outreach (Month 1-3)

| Action | Target | Volume |
|--------|--------|--------|
| Email/DM organizers directly | Bangalore, Mumbai, Pune event organizers | 100 organizers |
| Attend running events in person | Local races, club meetups | 5-10 events |
| Offer free "Verified Organizer" listing | All organizers who respond | Unlimited |
| Create their event page FOR them | Small organizers who lack time | 50 organizers |
| Build relationships with club leaders | Running/cycling club admins | 30 clubs |

### Phase 2: Self-Serve (Month 4-6)

| Action | Target |
|--------|--------|
| Launch organizer dashboard | Self-serve event submission |
| "List Your Event" prominently on homepage | Inbound organizer sign-ups |
| Organizer referral ("tell another organizer") | Network effects |
| WhatsApp share templates for organizers | Easy social distribution |

### Phase 3: Partnerships (Month 7-12)

| Partner Type | Value Exchange |
|-------------|---------------|
| Timing chip companies (RFID vendors) | They know all upcoming events. Share data for cross-promotion. |
| Sports brands (Decathlon, Nike, Asics) | They sponsor events. Co-brand discovery pages. |
| State sports associations | Official event calendars. Legitimacy. |
| Running apps (Strava local communities) | Cross-promotion to Strava users in India |

---

## Social Distribution Strategy: WhatsApp + Instagram

### WhatsApp Strategy

| Tactic | How | Expected Impact |
|--------|-----|-----------------|
| **Share cards on every event page** | One-tap share button that opens WhatsApp with pre-formatted message (event name, date, city, distance, link) | Primary viral channel |
| **Organizer WhatsApp templates** | Give organizers 3-4 pre-designed text templates they can send to their broadcast lists | Leverage organizer networks |
| **Club WhatsApp bot (future)** | Automated event updates in club WhatsApp groups | Persistent presence |
| **"Share with your running buddy" CTA** | Prompt after viewing event detail | Increase per-user share rate |
| **WhatsApp status sharing** | Generate a WhatsApp-status-ready image card | Reach beyond groups |

### Instagram Strategy

| Tactic | How | Expected Impact |
|--------|-----|-----------------|
| **Weekly event roundups** | Carousel post: "Top 10 events this month in [City]" | Awareness, followers |
| **Organizer co-posts** | Feature organizer events, tag them, get re-shared | Cross-pollination |
| **Story templates for organizers** | Downloadable Instagram story templates with event details + GoAthletix branding | Brand impressions |
| **Reels: event previews** | Short video previews of popular events (route, past photos, highlights) | Algorithm-friendly format |
| **User-generated content** | Repost athlete event photos with permission, tag events on platform | Community building |
| **"As seen on GoAthletix" badge** | Shareable badge organizers put on their Instagram posts | Brand awareness |

---

## Partner Strategy

| Partner Type | What They Get | What You Get | Priority |
|-------------|---------------|-------------|----------|
| **Running clubs** | Free club page, event calendar, member growth | User acquisition, event data, credibility | 🔴 High |
| **Small organizers** | Free distribution, reach new athletes | Event data, organizer trust, supply side | 🔴 High |
| **Timing/RFID companies** | Co-marketing, event listing reach | Event pipeline data, industry credibility | 🟠 Medium |
| **Sports stores (Decathlon)** | In-store QR codes to event discovery | Foot traffic to platform, brand alignment | 🟡 Low (later) |
| **Running coaches** | Client recommendation tool | Niche authority, referrals | 🟡 Low (later) |

---

## Launch Sequence

| Week | Activity |
|------|----------|
| **Week -4** | Seed 500+ events in database. Test with 10 beta users. |
| **Week -2** | Soft launch to 5 running clubs in Bangalore (200-500 users). Collect feedback. |
| **Week -1** | Fix critical bugs. Add 200 more events. |
| **Week 0** | Public launch: Share on Instagram, WhatsApp groups, running communities. |
| **Week 1** | Email blast to 100 organizers. DM 50 club leaders. Post on r/india, r/running. |
| **Week 2** | First "Weekly Events Roundup" email/Instagram post. |
| **Week 4** | Review metrics. Double down on what's working. Cut what's not. |
| **Month 2** | Expand to Mumbai + Pune (add 500 events). |
| **Month 3** | Launch organizer self-serve dashboard. |
