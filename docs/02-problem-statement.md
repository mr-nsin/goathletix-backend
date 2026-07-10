# 2. Problem Statement

## The Core Problem

India's sports event ecosystem is fragmented, opaque, and organizer-centric. Athletes have no reliable way to discover, compare, and plan their participation in events. Organizers have no scalable way to reach the right athletes beyond social media hustle.

---

## Problems by User Type

### For Athletes (Runners, Cyclists, Trekkers, Triathletes, Adventure Sports Enthusiasts)

| Problem | Severity | Current Workaround | Why Workaround Fails |
|---------|----------|-------------------|---------------------|
| **No single place to discover events** | 🔴 Critical | Check 5-10 Instagram pages, WhatsApp groups, BhaagIndia, Townscript, organizer websites | Time-consuming, incomplete, biased toward well-promoted events |
| **Cannot filter/search meaningfully** | 🔴 Critical | Manually scan event lists, ask friends | No filters for distance, difficulty, terrain, city, date range |
| **Cannot compare events side-by-side** | 🟠 High | Open multiple browser tabs | No standardized info (elevation, aid stations, past reviews) |
| **No reviews or trust signals** | 🟠 High | Ask in WhatsApp/Facebook groups | Anecdotal, biased, not organized |
| **Cannot plan a race season** | 🟡 Medium | Google Sheets, personal calendar | No integration with event dates, training blocks, reminders |
| **Miss registration deadlines** | 🟡 Medium | Set manual reminders | Forget, or learn about events too late |
| **Cannot discover new sports** | 🟡 Medium | Rely on friend recommendations | Limited exposure to triathlons, brevets, trail runs, adventure races |

### For Event Organizers (Race Directors, Trek Operators, Club Leaders)

| Problem | Severity | Current Workaround | Why Workaround Fails |
|---------|----------|-------------------|---------------------|
| **Expensive to reach target athletes** | 🔴 Critical | Instagram ads, WhatsApp broadcast lists, Facebook groups | CPM is rising, organic reach is dying, no targeting by sport/fitness level |
| **No distribution beyond existing followers** | 🔴 Critical | Rely on existing community + word-of-mouth | Cannot reach new athletes, especially in new cities |
| **Registration scattered across platforms** | 🟠 High | Use Townscript, Google Forms, Instamojo, own website | Athletes confused by different UX per event |
| **No post-event credibility/portfolio** | 🟡 Medium | Post photos on Instagram | No aggregated reviews, ratings, or participation history |
| **Cannot understand their audience** | 🟡 Medium | Manual surveys, gut feel | No analytics on who views, saves, or shares their events |

### For Running/Cycling Clubs and Communities

| Problem | Severity | Current Workaround | Why Workaround Fails |
|---------|----------|-------------------|---------------------|
| **Club management stuck on WhatsApp** | 🟠 High | WhatsApp groups (often 5-10 per club) | Unorganized, messages get buried, no event calendar |
| **Cannot grow beyond existing members** | 🟠 High | Instagram posts, word-of-mouth | No discoverability for new members |
| **No shared club calendar** | 🟡 Medium | Admin posts manually | Missed events, duplicate planning |

---

## Why Current Solutions Are Insufficient

### The India-Specific Problem

Unlike the US/EU where Active.com and LetsDoThis aggregate events, India has:

1. **No dominant aggregator**: BhaagIndia and IndiaRunning have poor UX, incomplete data, and no comparison/planning features. They are essentially listing directories from 2015.

2. **WhatsApp is the de facto distribution channel**: 80%+ of event discovery happens through WhatsApp forwards. This is unstructured, unsearchable, and favors popular organizers.

3. **Instagram is the de facto marketing channel**: Organizers create reels and stories. Discovery is algorithm-dependent. You only find events from accounts you already follow.

4. **No standardization of event data**: Each organizer presents info differently — different date formats, distance units, registration links, refund policies. There's no normalized database.

5. **Tier 2/3 city events are invisible**: Events in Pune, Coimbatore, Dehradun, Guwahati are nearly impossible to discover unless you're already connected to local communities.

6. **Fragmentation benefits no one**: Athletes miss events. Organizers struggle to fill slots. Communities stay siloed.

---

## Acute vs. Nice-to-Have Pain

### Acute Pain (Must Solve in MVP)
- "I can't find all running events near me this month" → **Discovery**
- "I don't know if this event is well-organized" → **Trust/Reviews**
- "I want to save events and get reminded" → **Save/Plan**
- "As an organizer, I need reach beyond my existing followers" → **Distribution**

### Important but Not Urgent (Post-MVP)
- "I want to plan my full season" → **Calendar**
- "I want to track my progress across events" → **Activity Tracking**
- "I want to join a local running club" → **Community**
- "I want training plans tied to my events" → **AI Coach**

### Nice-to-Have (Future)
- Social feed
- Challenges and leaderboards
- Brand partnerships
- Strava/Garmin integration
