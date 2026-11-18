# India organiser/partner landing pages (Townscript, Insider/District, BMS, Hudle, Playo, MeraEvents, Explara, KonfHub, AllEvents, Skillboxes, cult.fit, Luma)

Method note: pages fetched directly via WebFetch (summarised by a small model, so visual details such as exact colours and modal vs page behaviour are not observable). Fetched ~Nov 2026. Blocked/failed: in.bookmyshow.com (fetch blocked), insider.in/list-your-events (502 twice), Skillboxes (title only). No HighApe/Fitpage pages found. No logged-in or form flows touched.

## Q1. Common section order and header pattern of an organiser landing page in India

### Takeaway
Only the dedicated B2B pages (Hudle /list-your-sports-venue, KonfHub, Explara, cult.fit for Business) follow a SaaS landing pattern: slim header with Login + one primary CTA, hero, logo strip, features, testimonials, support/contact, FAQ, footer. Most others (Playo, MeraEvents, AllEvents, District, Luma) have no dedicated organiser header at all; organiser entry is a single link or button inside the consumer site. Townscript, once the benchmark, is now shut down.

### Cited Findings
- Townscript root page is now only an "Important Notice": Townscript and Townhall services are "no longer operational"; only contact is help@townscript.com; no date or alternatives given — [Townscript](https://www.townscript.com/)
- Hudle organiser page /list-your-sports-venue: header = logo, "List Your Sports Venue", Home, Careers, "Get the App Now". Hero "Digitize Your Sports Club at 0% Commission", CTA "Request a Demo". Sections: logo strip "Trusted by the best" (~18 logos: NSCI, CCI, Smartworks, Brookfield, GD Goenka, Bombay Gymkhana, JSW, Willingdon), Effortless Management, Track Analytics, Seamless Accounting, "Access 10 Lakh+ Hudle Community", six audience segments, testimonials ("Trusted by 1500+ Sports Clubs Across India", 8 named operators), "Talk to our Team" (phone, email, Request a Demo), 10-question FAQ, footer with city directory — [Hudle](https://hudle.in/list-your-sports-venue)
- Hudle consumer home: header is only logo, "List Your Sports Venue", Careers, "Get the App Now" (organiser link is a top-bar text link); footer repeats "List Your Sports Venue", Brand and Corporate Solutions; /partner redirects to the Play Store partner app — [Hudle home](https://hudle.in), [redirect](https://hudle.in/partner)
- Playo: header has "Partner with us" link on consumer site. /partner-with-us has hero "Engage with the Largest Sports Community and Network", three "Know More" cards (List Your Business, Corporate Offerings, Brand Activations), no pricing, logos, stats, testimonials or FAQ. Header there is the consumer header (Get the App, Games, Venues, Trainers) — [Playo home](https://playo.co), [Partner](https://playo.co/partner-with-us)
- Playo /list-business: hero "List Your Business" with a single "I'm Interested" CTA to a contact section; three audience cards (Venues & Clubs, Activity Organizers, Trainers & Academies); 15-item benefit list; no commission, payout, logos, numbers, testimonials, FAQ (external FAQ link in footer) — [Playo list-business](https://playo.co/list-business)
- Playo home claims "5,000+ venues across 100+ cities" (consumer page, not organiser page); the page also contains apparent template placeholder "SaaS admin panel" text and blog cards dated 2016-2022 — [Playo home](https://playo.co)
- MeraEvents home is consumer discovery. Header: logo, Events, Things to do, Communities, search, city selector, "Create Event" button. Organiser CTAs appear near page bottom ("Organizing an event? List Your Event" to organiser login; "Host an Event"). Footer has For organizers (Organizer login, Create an organizer account), Products (Ticketing, Check-in, Exhibitor, Networking, Certificates...), "Request a demo", API docs. No stats, logos, testimonials or fees on the page — [MeraEvents](https://www.meraevents.com)
- Explara: header = logo, Products menu, Pricing, Resources, Use cases, Login, "Get Started" button. Hero "100,000+ Users Host Events with us!" with "Get started for free" (no credit card). Sections: lifecycle (Before/During/After), "Why Event Organizers Prefer Explara", ExplaraEvent card, "Proven and reliable" (since 2008), "Compare Explara with" (Luma, Townscript, Meraevents, Konfhub, BookMyShow, District etc.), 8 testimonials, enterprise logos (NASSCOM, TiE, ASME...), "millions" payment volume claim, free-plan CTA. Footer: offices (Americas, Europe, APAC Singapore, Asia India with phone), support email, GDPR badge — [Explara](https://www.explara.com)
- KonfHub: header = logo, Events, Solutions, Features, Use Cases, Resources, Pricing, "Host an Event" button. Hero "AI-Powered Event Platform"; CTAs "Host an Event" + "Book a Demo"; review badges 4.7-4.8 on Capterra, Software Advice, GetApp, Gartner, G2. Sections: "Trusted by 1000+ Companies & Communities" logos; numbers (10,000+ events/yr, 50+ countries, 95% satisfaction); features by Pre/During/Post event; Why KonfHub; use cases (incl. Marathons & Sports Events); testimonial; pricing (India/RoW tabs); partner programme; closing "Unlock 10x ROI on Events" with same two CTAs; 6-question FAQ; GDPR note; footer with "Compare With" (AllEvents, BookMyShow, Eventbrite, Luma) and WhatsApp social link — [KonfHub](https://konfhub.com)
- cult.fit for Business (business.cult.fit): header logo "cult.fit for Business", Franchise, CULTPASS, Corporates, Equipment Solutions, Contact US, LOGIN / SIGN UP. Hero is a lead form ("Get in touch with us!", "732 companies have already registered", fields: name, company, email, phone) then four "Explore" cards (Franchise, cultpass Network, Corporate, cult.sport equipment). Minimal logos/testimonials — [cult.fit business](https://business.cult.fit)
- cult.fit franchise pages claim "580+ gyms" (search snippet); an older third-party listing claims 8,000+ partner gyms (likely different basis, conflicting) — [cult franchise search result](https://business.cult.fit/franchise/cult-pass)
- Luma (lu.ma 301-redirects to luma.com): header = skip link, logo, "Sign In" text link to /signin; hero cycling adjective + "events start here", subhead "From run clubs to launch parties and firework shows, Luma makes every event feel effortless"; CTAs "Create Your First Event" and "Discover Events"; one secondary banner; footer (Discover, Pricing, App, Help, social, Terms/Privacy/Security/DMCA). Sign-in is a separate page, not a modal — [Luma](https://luma.com/)
- AllEvents: header has "Host Control" dropdown (Create an event, Manage events, app, Need help?), "Create Event" button, Sign in, Open App; hero is a search form ("Search events all around the globe"); organiser pitch ("Do You Host Events?") is a late section/footer links (Publish, Promote, Sell Tickets Online). Claims 40,000+ cities, 300K+ organisers, 20M+ monthly explorers (one fetch of the home page; the other said "20M people globally") — [AllEvents](https://allevents.in)
- District by Zomato: no organiser link in header (logo + Login); footer Quick Links has "List your events" (and "List your restaurant"); no hero — [District](https://www.district.in)
- Insider: per search snippet, insider.in/list-your-events exists; page was not fetchable. Zomato acquired Paytm Insider in Aug 2024 (secondary source, snippet) — [Insider list-your-events](https://insider.in/list-your-events)
- BookMyShow organiser page (in.bookmyshow.com/list-your-show) could not be fetched; contents unverified.
- Skillboxes: fetch returned only title "SkillBox - Everything live!"; nothing else retrievable — [Skillboxes](https://www.skillboxes.com)

### Inferences
- Typical dedicated-organiser order (Hudle/KonfHub/Explara): header -> hero with one primary + one secondary CTA -> logo strip -> feature blocks -> segments/use cases -> testimonials -> pricing (KonfHub, Explara via separate page) -> talk-to-team/contact -> FAQ -> footer.
- Header patterns: Login + a filled primary button ("Get Started", "Host an Event", "Request a Demo") is standard; nav is 4-6 items (Features/Solutions/Pricing/Resources/Use cases). Phone number in header was not seen on any page; phone appears in a "Talk to our Team" block (Hudle) or footer (Explara India).
- Login presentation: Luma uses a separate /signin page; cult.fit uses a combined "LOGIN / SIGN UP" link; MeraEvents routes to an organiser login. Modal vs split-screen could not be observed from text fetches.

### Gaps
- Visual layout (modal/split-screen), exact colours, sticky behaviour not observable via text fetch.
- BookMyShow, Insider organiser pages, Skillboxes, HighApe/Fitpage: no page content retrieved. Hudle's own sports-organiser-specific "Event Organizers" segment text was only a heading.

## Q2. Pricing/fees, payout speed and support presentation

### Takeaway
Fee transparency varies from explicit (KonfHub table, Explara pricing page, Luma) to absent (BMS, District, Playo, AllEvents, MeraEvents landing). Payout speed is rarely on the landing page itself; it lives in help/FAQ. Support is shown as email, demo booking, or a phone in a "Talk to team" block.

### Cited Findings
- KonfHub India pricing on page: Freemium 0% (free tickets, up to 100 registrations); Lite 2.5% + 18% GST (UPI only, up to 300 regs); Silver 3.75% + 18% GST including gateway charges (up to 2,500 regs; non-INR 5% + GST); Gold custom. Extra attendees INR 10 each. Support tiers: Lite email 10am-7pm IST; Silver phone + email; Gold priority phone — [KonfHub](https://konfhub.com)
- KonfHub payouts weekly: Mon 12:00AM-Sun 11:59PM sales settled the following Thursday EOD; GST-compliant invoices generated for buyers who enter GST details; KYC only for paid events; support via email and demo link, no response-time SLA — [KonfHub payments & settlements](https://kh30.konfhub.com/payments-settlements)
- Explara pricing page: Starter $0, Growth $9/mo, Pro $25/mo; ticket fee 4% on all plans (domestic), +1% if own Stripe; ExplaraX Indian gateway 4% (from comparison table only); no payout timing stated; India phone listed in footer office block — [Explara pricing](https://www.explara.com/pricing)
- Explara home page headline CTA stresses "no credit card" and free plan; no fee numbers on home — [Explara](https://www.explara.com)
- Hudle promise: "0% Commission" in hero, "Real-Time Support, 0% Commission, Personalized Setup Assistance" block with phone 011 41186664 and email contact@hudle.in; FAQ lists "How and how often do partners get settlements?" but answers were not captured — [Hudle](https://hudle.in/list-your-sports-venue)
- Luma pricing: Free plan 5% platform fee on paid events (plus Stripe ~2.9%+30c); Plus $59/mo billed annually, 0% platform fee; Enterprise custom; USD only. Fee language for free events not stated explicitly — [Luma pricing](https://luma.com/pricing)
- MeraEvents landing shows no organiser fees; secondary sources conflict: developer docs say free listing and 1.99% gateway + 18% GST; a comparison site says 5% per paid ticket; another says 2% + 1.99%; another quotes KonfHub-like Silver/Lite numbers (likely copied). Settlement time unverified ("same-week" per a competitor comparison) — [Ticket Fairy comparison](https://www.ticketfairy.com/compare/ticketing/ticket-fairy-vs-meraevents), [search results](https://devsite.meraevents.com/faq)
- BookMyShow: no published organiser fee found; competitor claims it does not publish fees and requires a proposal (response in 24-48 working hours per Ticket Fairy claim; competitor source) — [Ticket Fairy](https://www.ticketfairy.com/compare/ticketing/bookmyshow-alternatives)
- Insider (snippet): self-serve setup; payments collected by platform and settled after the event ends, per another snippet weekly; unverified, page not fetched — [Insider](https://insider.in/list-your-events)
- District: third-party directory says no organiser fee published; terms by contacting them; confirm commission/settlement in writing (echai.ventures snippet) — [eChai](https://echai.ventures/startingup/r/list-your-event-on-district--t5-su-tools-mkt-r219)
- Playo and AllEvents: no commission/payout/support-number statements on partner pages — [Playo list-business](https://playo.co/list-business), [AllEvents](https://allevents.in)

### Inferences
- "0% commission" (Hudle) and "free for free events" (KonfHub 0% Freemium) are the headline levers; percentage + "18% GST" footnote is the Indian convention.
- "Talk to us/Request a demo" substitutes for pricing at the larger platforms (BMS, District, Playo, MeraEvents).

### Gaps
- Hudle settlement frequency, MeraEvents/Insider/BMS/District official fees and payout times not verified from primary sources.
- WhatsApp support in header not seen anywhere (KonfHub only has WhatsApp in footer socials; Explara mentions WhatsApp as a product feature).

## Q3. Trust signals

### Takeaway
Strongest signals: named client logos + operator testimonials (Hudle), review-site badges plus event/country/satisfaction counts (KonfHub), lists of competitor-comparison pages and many quotes (Explara). Consumer-first platforms (Playo, MeraEvents, AllEvents, District) show few or none on the partner side.

### Cited Findings
- Hudle: 1500+ sports clubs, 10 lakh+ community, ~18 institutional logos, 8 named operator testimonials — [Hudle](https://hudle.in/list-your-sports-venue)
- KonfHub: 1000+ companies, 10,000+ events/yr, 50+ countries, 95% satisfaction, G2/Capterra/Gartner badges 4.7-4.8, GDPR badge — [KonfHub](https://konfhub.com)
- Explara: "100,000+ users", since 2008, 8 testimonials, enterprise logos (NASSCOM, TiE, ASME), GDPR badge, "millions" payment volume (no figure) — [Explara](https://www.explara.com)
- cult.fit: "732 companies have already registered" in hero; franchise pages cite 580+ gyms — [cult.fit business](https://business.cult.fit)
- AllEvents: 300K+ organisers, 20M+ users — [AllEvents](https://allevents.in)
- Playo: 5,000+ venues, 100+ cities (consumer home) — [Playo](https://playo.co)
- GST invoicing: shown as a feature in KonfHub help; Hudle FAQ lists invoices question; payment-partner logos not observed on any fetched organiser page.

### Inferences
- Indian-specific trust cues (GST invoices, UPI, weekly settlement day, KYC) appear in help content rather than landing heroes: an opportunity.

### Gaps
- Payment-partner logo strips (Razorpay, UPI) not observed; G2/Capterra review content not researched.

## Q4. Weakest/most generic vs best

### Takeaway
Best: Hudle's partner page (outcome-led hero with 0% commission, institutional logos, named operator quotes, phone + demo CTA, payout FAQ) and KonfHub (explicit INR pricing with GST, support tiers, settlement doc, review badges). Weakest: Playo (/list-business: two sections, "I'm Interested", no proof or pricing, template placeholder text on home), MeraEvents (organiser pitch buried at page bottom of a consumer page), AllEvents and District (organiser entry is a footer/dropdown link). Townscript no longer exists.

### Cited Findings
- See Q1/Q2 sources for each assessment: [Hudle](https://hudle.in/list-your-sports-venue), [KonfHub](https://konfhub.com), [Playo](https://playo.co/list-business), [MeraEvents](https://www.meraevents.com), [District](https://www.district.in), [Townscript](https://www.townscript.com/)
- Explara has a distinctive "Compare Explara with" section naming competitors including Townscript (now defunct) — [Explara](https://www.explara.com)
- Luma is minimal and creator-first: two CTAs, no features/FAQ on home; pricing on separate page — [Luma](https://luma.com/)

### Inferences
- Best ones differ by: a specific, quantified promise in the hero, a demo/phone path for high-touch owners, and proof from peers in the same segment (clubs, communities).
- Gap for a sports organiser product: Playo and Hudle target venues; sports event organiser (tournaments, runs) pages are generic (KonfHub lists marathons as a use case; Hudle has "Can I list a tournament?" FAQ).

### Gaps
- Impressions are from text extracts; design quality judgments (visual hierarchy) unverified.
