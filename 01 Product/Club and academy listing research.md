---
type: note
status: draft
tags: [research, clubs, academies]
date: 2026-10-17
related: ["[[GA-032-club-academy-listing-research]]", "[[ADR-008-coach-trainings]]", "[[Organizer and seller platform features]]"]
---

# Club and academy listing research (GA-032)

What should a "Clubs and academies near you" card and profile show on GoAthletix? Desk research from public pages, 2026-10-17. Recommendation fits ADR-008 (proposed) Phase 1: find-a-coach, no payments, enquiry only.

## Top 5 findings

1. **Cards that win show a decision, not a name.** Where I could see real cards (LyfSkills directory, Hudle event page, UrbanPro profile), the decision signals are: rating plus review count, locality, age or level, "from" price, and a trial or demo action. Our card has none of these today (icon, name, one meta line, disabled button).
2. **The primary action on coaching listings is a free trial or demo, not "join".** UrbanPro shows "Book a Free Demo" repeatedly; Hudle's coaching listing leads with 80% off the first session; cult.fit pages advertise free trial classes; LyfSkills describes enquire plus book-a-trial. For Phase 1 (no payments) the equivalent is "Request a trial / WhatsApp".
3. **Trust is layered and specific: it says what was checked.** UrbanPro lists Identity, Education, Phone, Email verified and says identity is matched to government databases. Airbnb shows identity-verified month and year, review stars and years hosting. A bare "Verified" badge is weak; "Phone and ID checked, 12 Aug 2026" is strong. Our `is_verified` / `is_certified` flags are staff-set, which is the right basis, but must say what was checked.
4. **Price and batches are the weakest, least consistent data everywhere.** UrbanPro's tutor page had no fee; LyfSkills snippets showed ratings and hours but fees only as "ask the academy"; Hudle gave only "₹399 onwards". Show "from ₹X / month" only when the coach supplies it, otherwise "Ask for fees". Never estimate (an academy blog puts typical fees at ₹2,500 to ₹6,000/month, a self-interested source, so use it only as a sanity range).
5. **India child-safety is a legal and trust gap, and nobody in the sample surfaces it.** POCSO Rules 2020 require police verification and periodic background checks of staff for institutions in regular contact with children, including sports academies; a Goa child-rights commission found no regulator, no minimum standards, and abuse cases in home-run private coaching. A parent-facing "safeguarding status" is a differentiator, but needs legal sign-off before the claim is shown (ADR-008 open item).

## How I researched, and what I could not load

Corporate proxy (Forcepoint) blocks many sites, so several fetches returned a block page. I did not follow block-page redirects.

| Platform | Evidence quality | Notes |
| --- | --- | --- |
| Strava Clubs | Fetched help page; search snippet for API fields | Strava search page itself is a login wall |
| Eventbrite organiser | Fetched help page | Live organiser page not loaded |
| Hudle | Fetched homepage and one real coaching event page | Venue results pages redirect loop, not loaded |
| UrbanPro | Fetched one real tutor profile | One profile only |
| Airbnb host profile | Fetched help article 3811; Experiences card layout unconfirmed | Stay-host examples only |
| ClassPass (studio pages) | Snippet only (page blocked) | |
| LyfSkills directory | Snippet only (all pages blocked) | |
| Meetup | Snippet only (blocked) | |
| cult.fit / cure.fit | Snippet only (cult.fit blocked, cure.fit returned HTTP 402) | |
| Khelomore | Snippet only (site not returned; press and aggregator listing) | |
| Playo | Not loaded (blocked); no usable snippet | Cannot make claims |
| Justdial | Not loaded; search returned none | Cannot make claims |
| Decathlon sports clubs | URL guess returned 404 | Cannot make claims |
| Playtomic Academy, BBFS | Blocked; only search-result existence | Not used for claims |

## Platform findings

Sources are inline. "Snippet" means taken from a search result summary, not read on the page.

### Strava Clubs (fetched help, snippet for API)
- Card/discovery: search by keyword, filter by location and sport type. [Strava help](https://support.strava.com/hc/en-us/articles/221622188-Clubs-on-the-Mobile-App)
- Fields set by owner: sport, up to three tags, logo, name, description, public or private, location. Same source.
- Profile: Overview (member list), Activities, Stats (leaderboard, clubs of 500 or fewer), Posts, Events. Same source.
- Trust: the help article does not mention verified clubs (the API is reported, snippet only, to expose a verified flag). No reviews.
- Pricing and batches: none. Action: **Join Club** (public) or request (private, shows "Pending"). Same source.

### Eventbrite organiser page (fetched help)
- Profile image, wide cover image, location, "about" with name and website, bio, up to 40 photos under a Media tab, social links, public follower count, one pinned event. [Eventbrite help](https://www.eventbrite.com/help/en-us/articles/161196/how-to-set-up-your-organizer-profile-page/)
- Primary action: Follow (per snippet search, button label unconfirmed). No reviews or verification shown in the article. Lesson: follower count and a pinned "what's next" are cheap, honest social proof.

### Hudle (fetched)
- Homepage has sport and city selectors, sport tiles, user testimonials, "Book Venue" and "List Your Sports Venue" actions; no listing cards in the captured page. [Hudle](https://www.hudle.in/)
- A real coaching listing (2020, may be dated) shows: "₹399 onwards", date and time, venue with Get Directions, organiser phone and email, 4-of-5 stars with no count, a 24-hour cancellation policy, links to refund policy; **no coach named**. Action: "Select Tickets". [Hudle event](https://hudle.in/events/beginners-badminton-coaching-for-adults-in-gurgaon/700061)
- Lesson: it is a bookable event, not a profile. Missing coach identity and review count is the gap we can beat.

### UrbanPro (fetched one profile)
- Header: name and title, locality badge (Baner, Pune), "20 yrs of Exp". Verification panel (Identity, Education; Phone and Email verified) with identity matched to government databases. Languages (Hindi, Marathi, English). Class location (online by Zoom, student's home, tutor's home). Note "Different batches available". Reviews (here "No Reviews yet!"), Q&A, Report this Profile, Share. No fee shown. Actions: **Book a Free Demo**, Ask a Question. [UrbanPro profile](https://www.urbanpro.com/ashish-dabholkar)
- Lesson: "Report this profile" and "No reviews yet" shown honestly are both good trust moves.

### Airbnb host profile (fetched help)
- Host profile can show years hosting, average star rating, month and year identity was verified, reviews, Superhost status; Experience hosts can show last name. [Airbnb help](https://www.airbnb.co.in/help/article/3811) Experiences card layout not confirmed.

### ClassPass studio pages (snippet only)
- Aggregate rating with count and 5-to-1 breakdown, amenities (showers, lockers, parking), Highlights tags (woman-owned, wheelchair accessible), day-selector schedule with class, time, duration, instructor, address, phone, website, "Similar studios", header intro offer ("Get 14 days free"). Snippet from [ClassPass studio](https://classpass.com/studios/mind-body-recovery-hillcrest) results.

### LyfSkills directory, India (snippet only)
- Describes itself as a directory of 7,617 verified academies and classes in 5 cities where users compare ratings, fees and timings, enquire and book a trial. [LyfSkills sports](https://discover.lyfskills.com/sports)
- Pune cricket listings show "Rating: 5.0 (219 reviews)" and opening hours, with an "established 1996" tag on one. Examples: [Vidyaam Academy](https://discover.lyfskills.com/listing/45125), [Cricket Next / Pune listings](https://discover.lyfskills.com/classes/pune/in/dhankawadi/cricket). Fees appeared as ask the academy. Note this directory's own data quality is questionable (a Khelomore listing's description mismatched its sport).

### Meetup (snippet only)
- Group page: About, Upcoming events count, Organizers (with "Super Organizer" badge), member count with photos, past events. [Meetup example](https://www.meetup.com/southjaxsocial/)

### cult.fit (snippet only)
- Centre page: free trial classes, packages with regular and discounted price (3, 6, 12 months), opening slots (morning, evening), address, class formats, facilities. cult.fit pages did not show star ratings; third-party listings did. [cure.fit centre](https://www.cure.fit/cult/center/andheri-east/cult-andheri-east-/277)

### Khelomore (snippet only)
- Positions as booking of venues, coaches and academies; reported 1,500+ coaches, about 15 sports, cities including Mumbai, Pune, Bengaluru, Hyderabad. [Inc42](https://inc42.com/?p=470441). Listing mirrored on LyfSkills: [Khelomore listing](https://discover.lyfskills.com/listing/22860) (4.1, 380 reviews). Card layout unverified.

## What the best listings have in common

| Pattern | Seen at | Use for GoAthletix |
| --- | --- | --- |
| Rating plus count, honest "no reviews yet" | UrbanPro, ClassPass, LyfSkills | Show only once reviews exist (ADR-008 defers reviews); until then show nothing, not a fake star |
| Itemised verification | UrbanPro, Airbnb | Show what staff checked and when |
| Free trial or demo as the main button | UrbanPro, Hudle, cult.fit, ClassPass | Phase 1: "Request a trial" enquiry |
| Locality and online/home options | UrbanPro | Locality chip, in-person/online |
| Years of experience or established year | UrbanPro, LyfSkills | Coach-supplied, optional |
| Languages | UrbanPro | Strong India fit |
| Schedule at a glance | ClassPass, cult.fit | Days chips, times on profile |
| Report this profile | UrbanPro | Include on profile |
| Follower count / "next event" | Eventbrite, Meetup | Use `entity_follows`, pin next training |

## Consolidated field table

"Honest today" refers to `training_centers` (migration 0010: name, slug, description, sport_types, discipline_slugs, age_categories, city, state, address, geo_location, contact_phone/email, website_url, logo/cover, is_certified, is_verified, owner_id) plus current sample data. Fields not in that table need migration 0026 (ADR-008) and a claiming coach.

| Field | Why it matters | Supplied by | Where | Honest today? |
| --- | --- | --- | --- | --- |
| Name, logo | Recognition | Club | Card, profile | Yes (name); logo if uploaded |
| Type (academy, coach, club, rink) | Sets expectations | Club or staff | Card chip | Not a column; derive only if tagged |
| Sport and discipline | Core filter | Club, mapped to taxonomy | Card, filter | Yes (sport_types, discipline_slugs) |
| Age groups | Parents' first filter | Club | Card chip, filter | Yes (age_categories) |
| Level (beginner to elite) | Fit | Club | Profile, filter | No (needs column) |
| Locality and city | Near-me | Club | Card, filter | City yes; locality from address only |
| Distance from user | Convenience | System (geo_location) | Card | Only if geo_location filled |
| Verified, with what was checked | Parent trust | Staff | Card badge, profile detail | Flag yes; detail and date no |
| Certified coach, with body | Credibility | Club proof, staff review | Card badge, profile | Flag yes; body and proof no |
| Safeguarding status | Minors | Club declaration, staff review | Profile, card icon | No (legal decision pending) |
| Years in operation / established | Stability | Club | Profile | No |
| Fee: "from" price and unit (per month, per pack) | Decision | Club | Card, profile, filter | No; show "Ask for fees" |
| Trial available (free or paid) | Main action | Club | Card, filter | No |
| Batch days and times | Fit | Club | Profile, card day chips | No (training_batches pending) |
| Coach names, bio, photo | People buy people | Club | Profile | No |
| Languages | India fit | Club | Profile, filter | No |
| Girls-only or women-only batch | Safety | Club | Card tag, filter | No |
| In-person, online, hybrid | Fit | Club | Card, filter | No |
| Facilities (turf, rink, showers, parking) | Practicalities | Club | Profile | No |
| Reviews, rating | Social proof | Athletes, moderated | Card, profile | No (ADR-008 later) |
| Followers | Light proof | System | Card | entity_follows exists; show only when > 0 |
| Next training / next event | Freshness | Club, system | Card line | Needs trainings table |
| Contact: call, WhatsApp, enquiry | Primary action | Club | Card, profile | Phone yes; WhatsApp and lead no |
| Report this profile | Safety valve | System | Profile | No |
| Photos | Trust | Club | Profile | cover_url yes |

## Recommended card layout

Rule: a field with no data is omitted, never filled with a placeholder or invented value.

```
+--------------------------------------------------+
| [cover/logo]                       [Verified v]  |
| Sunrise Athletics Academy                        |
| Athletics · Running · Jumps                      |
| Pune · Baner · 2.4 km                            |
| Ages 8-16   [Girls batch]   Hindi, Marathi, Eng  |
| Mon Wed Fri · 6:00 am, 5:30 pm                   |
| From Rs 2,500 / month    Free trial              |
| 4.7 (38)   -  coach: AFI Level-1 certified       |
|                                                  |
| [ Request trial ]   [ WhatsApp ]   [ Save ]      |
+--------------------------------------------------+
```

Notes: rating row appears only with 5 or more reviews; verified badge opens a popover saying what was checked and when; fee shows "Ask for fees" if none. Primary button is "Request trial" (records a lead per ADR-008). Mobile: stack; cards must work at 375px.

## Profile section list

1. Header: name, type, verified detail, share, report.
2. Primary actions: request trial, call, WhatsApp, follow.
3. About: description, years in operation, languages.
4. Trainings and batches: sport, level, ages, days and times, fee, capacity left, trial policy.
5. Coaches: photo, bio, certifications with body and proof status, experience.
6. Safety and trust: verification detail, safeguarding declaration status, women-only batches, how to report.
7. Venue: address, map pin, facilities, travel notes.
8. Policies: make-up class, cancellation, refund, kit included.
9. Photos.
10. Reviews and followers (when they exist).
11. Similar academies nearby; next events they prepare for (Phase 3 link).

## Six filters to ship first

1. Sport (and discipline).
2. Age group (parents' first question).
3. City, with distance when geo exists.
4. Level.
5. Trial available.
6. Days of the week (or evening/weekend).

Next wave: language, girls/women-only, price range, in-person/online, verified only, certified coach.

## India-specific points

| Topic | Finding | Source / confidence |
| --- | --- | --- |
| Fee convention | Monthly fee is the norm, often with quarterly or annual discount; one Bangalore academy blog puts typical fees at ₹2,500 to ₹6,000/month, treat as rough | [Kriya blog](https://kriyasportsacademy.lovable.app/blog/best-sports-academy-in-bangalore) via search snippet; weak |
| Batch patterns | Early morning and evening, weekday and weekend batches; one example shows opening hours Monday to Saturday | cult.fit and LyfSkills snippets; common pattern, not rigorously sourced |
| GST | Structured academy coaching generally taxable at 18%; exempt for 12AA/12AB charitable entities offering recreational sports training; pure fitness training moved to 5% without ITC from 22 Sep 2025. Prices shown should state "incl. or excl. GST" once payments exist | [TaxAJ](https://www.taxaj.com/learn/gst-sports-fitness-coaching-services/), [Taxscan AAR](https://www.taxscan.in/?p=181381); needs CA confirmation |
| Child safeguarding | POCSO Rules 2020 require police verification and periodic background checks of staff, and a child protection policy, for institutions including sports academies | [Business Standard (PTI)](https://www.business-standard.com/article/pti-stories/centre-notifies-new-pocso-rules-making-law-for-sexual-offences-against-children-more-stringent-120031300398_1.html) via snippet; legal review needed |
| Regulatory gap | Goa commission found private coaching institutes unregistered, often home-run, with no minimum standards | [Gomantak Times](https://www.gomantaktimes.com/news/goa/child-protection-at-private-sports-coaching-institutes-in-goa) fetched |
| Accreditation bodies | Federation and state association affiliation varies by sport; AIFF requires academies to register with the state football association. I could not confirm an AFI academy registration scheme or SAI/Khelo India accreditation criteria | [AIFF 2017 document](https://www.the-aiff.com/media/uploads/2019/12/ACADEMY-ACCREDITATION-2017.pdf) snippet; AFI and SAI unconfirmed, so store a free-text "affiliation body and number" with proof upload and let staff verify |
| Language | Hindi, Marathi, English shown on UrbanPro; language is a real filter | [UrbanPro](https://www.urbanpro.com/ashish-dabholkar) fetched |
| Women and children | Girls-only batch tag and a safeguarding status are not shown by any studied platform; ClassPass has "woman-owned" tag, snippet only | Opportunity |

## Open questions for the owner

- Evidence required for coaches working with under-18s (police verification certificate, POCSO training, written policy). Legal decision, ADR-008.
- Whether to show the verified badge before reviews exist (recommended: yes, with detail).
- Whether to ingest academies from public directories (LyfSkills, Justdial) as unclaimed listings: check terms; do not copy their ratings.
- Confirm GST position with a CA before any price shows "per month incl. GST".
- Seed data: current sample academies are placeholders. Do not ship ratings, fees or "verified" on them.

## Limits of this research

Most listing cards (LyfSkills, ClassPass, Meetup, cult.fit, Khelomore) were not loaded; claims about them come from search snippets. Playo, Justdial and Decathlon could not be studied. Airbnb Experiences card layout is unconfirmed. Dates and prices seen may be stale (the Hudle listing is from 2020).
