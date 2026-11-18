# Global organiser-facing landing and login pages (ticketing / race registration / product sites)

Method note: public pages fetched via WebFetch in Nov 2026. Fetches return text-converted content, so visual details (split screens, sticky behaviour, mobile menus, dark/light) were NOT observable. Eventbrite sign-in, Stripe login, Dice partners, Let's Do This and Race Entry pages were blocked (403/404 or browser-gate). These are listed under Gaps.

## 1. Recurring header and navigation patterns, and Sign in vs Sign up

### Takeaway
Standalone organiser/product sites use a short header (logo, 3-5 dropdown/links incl. Pricing, then a right-aligned cluster of text-link "Sign in/Login" plus a filled primary "Get started" and often a secondary "Contact sales / Book a demo"). Sign in is always the quiet text link; sign-up is the filled button.

### Cited Findings
- Eventbrite organiser page nav: Features, Event Types, Resources (dropdowns) plus Pricing link; right side has "Contact Sales" and "Get Started". A Sign in link was not shown in the fetched content. — [Eventbrite Organizer](https://www.eventbrite.com/organizer/)
- Ticket Tailor: announcement bar ("Join over 73,000 Event Creators - Book a demo with the team today!"); nav How it works, Features, Who's it for, Pricing, About us; right side "Find your tickets", "Login", "Get started". Hero repeats Get started + Book a demo. — [Ticket Tailor](https://www.tickettailor.com)
- Ticket Tailor's "Who's it for" dropdown segments by audience (First-timers, Event pros, Free events, Developers, Charities, Attractions) and by industry (Festivals, Workshops, Venues, Conferences, Agritourism). — [Ticket Tailor](https://www.tickettailor.com)
- RunSignup keeps consumer and organiser in one header: top utility bar "Find a Race, Create a Race, Search, Sign In, Create Account, Help", plus main menu Products, Use Cases, AI, Pricing, Knowledge Base, About. (Counter-example: NOT separated.) — [RunSignup](https://runsignup.com)
- RunSignup CTAs: "Get Started for Free", "Create Your Event Now", and "Schedule a Call"/"Request a Call" (the word "demo" not used). — [RunSignup](https://runsignup.com)
- Race Roster organiser solutions page: header has Sign in, event search bar, mega-menus Products (Registration, Fundraising, Timing tools, CRM, Onsite, Virtual events), Solutions (Event organizers, Fundraising coordinators, Timers), Pricing, Resources; CTAs "Create an event", "Let's talk" (to demo booking), "Book a demo" in footer. — [Race Roster](https://raceroster.com/solutions/event-organizer)
- Stripe: announcement bar on top; nav Products, Solutions, Developers, Resources, Pricing; "Sign in" text link right; "Start now" and "Contact sales" as header CTAs; hero single CTA "Request an invite". — [Stripe](https://stripe.com)
- Shopify (India): nav Why Shopify, Products, Pricing, Enterprise; "Log in" text link beside a "Start for free" button; CTA repeated under hero and at page end; no inline email field in captured content (links to admin signup). — [Shopify India](https://www.shopify.com/in)
- Luma home (consumer-leaning, minimal): header only logo, "Discover Events", "Sign In"; footer Discover, Pricing, Help, Get the App. Shows an extreme "stripped-down" header. — [Luma](https://luma.com/home)

### Inferences
- Pattern: [Logo] [Product/Solutions/Resources/Pricing] ... [Sign in (text)] [Contact sales / Book a demo (outline)] [Get started (filled)].
- For a sports platform, replace "Discover events" and "Find a race" entirely; RunSignup's mixed header is the thing to avoid if the goal is a clean organiser site. Suggested solutions dropdown: by event type (Road run, Trail/ultra, Cycling, Triathlon, Marathon/charity, Corporate/club) and by role (Race director, Timer, Club, NGO).
- Mobile menu details were not observable; common convention is hamburger with Sign in and Get started pinned at bottom (inferred, not verified).

### Gaps
- Sticky/scroll-shrinking behaviour, mobile menu, dark/light not observable via text fetch.
- Eventbrite sign-in link on organiser page not confirmed.

## 2. Login and sign-up screens

### Takeaway
Best verifiable example is Luma: a single centred card, email-first with alternatives stacked (phone, Google, passkey) and one unified "sign in or sign up" screen. Split-screen marketing panels could not be verified for any platform.

### Cited Findings
- Luma sign-in: heading "Welcome to Luma", "Please sign in or sign up below."; email field with "Continue with Email"; "Use Phone Number"; "Sign in with Google"; "Sign in with Passkey"; magic link not stated; vertical stacked layout under a minimal top nav. — [Luma sign-in](https://luma.com/signin)
- Stripe dashboard login returned only a modern-browser gate, so layout could not be confirmed. — [Stripe dashboard](https://dashboard.stripe.com/login)
- Eventbrite sign-in page fetch returned only the title "Log In and Sign In"; layout unverified. — [Eventbrite signin](https://www.eventbrite.com/signin/)
- Shopify and RunSignup primary CTAs route to separate signup/wizard pages ("Start for free" to admin signup; "Create Your Event Now" to the race wizard). — [Shopify India](https://www.shopify.com/in), [RunSignup](https://runsignup.com)

### Inferences
- Unified "sign in or sign up" with email-first, then Google, is the low-friction norm; phone OTP is significant for India (Luma offers phone as an option).
- Recommend minimal first step (email or phone + OTP), then a short post-auth onboarding (organisation name, event type, role, expected participants) rather than a long form.

### Gaps
- Sign-up fields and steps for Eventbrite, RunSignup, Race Roster, Ticket Tailor, Shopify not verified (would require starting a signup; out of scope: no forms submitted). Split-screen usage unverified. No screenshots from Mobbin/Page Flows accessed.

## 3. Section order on organiser landing pages

### Takeaway
Hero, proof (logos/stats), feature blocks, payments/fees, segments, testimonials, resources, closing CTA, footer. Sales-assisted CTA repeated near the end.

### Cited Findings
- Eventbrite: hero; event management features; reach/marketing; organiser tools; get paid/fees; solutions by event type; testimonials (2) + creator spotlight; blog; free-publish CTA; Contact Sales for large events; support resources; final CTA. — [Eventbrite Organizer](https://www.eventbrite.com/organizer/)
- Ticket Tailor: hero with ratings (4.8/5, 4.9/5, 4.8/5, sources unnamed) and intro video; "73,000 Event Creators across 120 countries" with audience cards; lowest-fees; how it works (3 blocks); live events; why Ticket Tailor (B Corp, support); testimonials (3); integrations; closing CTA "You dream it. We'll ticket it."; footer. — [Ticket Tailor](https://www.tickettailor.com)
- RunSignup: hero with rotating event photos; Get Started wizard; Key Products (Registration, Marketing, RaceDay, Fundraising, free Websites/Email, Clubs); AI chatbot; By the Numbers (30,000+ events, 10M annual registrants, $3B raised); feature blocks; event types; Customer Spotlight case studies; footer tagline "A Technology Company for Endurance Events". — [RunSignup](https://runsignup.com)
- Race Roster: hero heading "Our solutions will help drive your success"; feature blocks; 3 testimonials; closing "Let's talk" CTA; footer with USA and Canada addresses. — [Race Roster](https://raceroster.com/solutions/event-organizer)
- Stripe: product bento grid; promo; key metrics; customer stories; developer/scale; news carousel; closing CTA; link grid; footer with region selector (India). — [Stripe](https://stripe.com)
- Shopify: hero with rotating headline words; feature sections; merchant success stories; checkout conversion claims (up to 15%, 250M+ shoppers); three-step getting started ending in final CTA. — [Shopify India](https://www.shopify.com/in)

### Inferences
- Reliable skeleton: hero -> numbers/logos -> feature blocks -> payments/fees -> by-event-type -> testimonials/case studies -> how it works (3 steps) -> FAQ/resources -> final CTA.

### Gaps
- Product screenshots, hero visuals not visible via text.

## 4. Hero copy and CTAs

### Cited Findings
- Eventbrite: "Online Event Management Software to Grow Your Events"; primary "Get started for free", secondary "Contact Sales". — [Eventbrite Organizer](https://www.eventbrite.com/organizer/)
- Ticket Tailor: "The world's most loved event ticketing platform."; subhead about simple, affordable ticket selling; CTAs Get started + Book a demo. — [Ticket Tailor](https://www.tickettailor.com)
- RunSignup: "Create Amazing Events"; all-in-one platform for endurance events from registration through race day. — [RunSignup](https://runsignup.com)
- Stripe: "Financial infrastructure to grow your revenue"; "Request an invite". — [Stripe](https://stripe.com)
- Shopify: "Be the next AI all-star", "Dream big and build fast on Shopify"; "Start for free". — [Shopify India](https://www.shopify.com/in)

### Inferences
- Pairing "free to start" primary with "talk to us" secondary is the dominant pattern for ticketing.

## 5. Pricing presentation and sports-specific patterns (testimonials, switch offers, concierge, demo paths)

### Takeaway
Pricing pages are linked in nav but landing pages avoid listing numbers; fee-led messaging ("free events are free", "low-cost fees") dominates. Race-director testimonials and migration assistance are used by Race Roster/RunSignup; formal "switch from X" offers were not found on landing pages but exist as content/competitor pages.

### Cited Findings
- Eventbrite: no prices on page; "Get started for free", "Low-cost fees", Contact Sales for "customized pricing" on large events. — [Eventbrite Organizer](https://www.eventbrite.com/organizer/)
- Ticket Tailor: no contracts, setup or monthly fees, flat per-ticket fee; free events free; charities 50% off fees; "Show me the savings" CTA; fee amounts not on home page. — [Ticket Tailor](https://www.tickettailor.com)
- Ticket Tailor footer has alternative-to pages for Eventbrite, TicketSpice, TicketSource, Weezevent (competitor-comparison landing pages). — [Ticket Tailor](https://www.tickettailor.com)
- RunSignup: free race website, email, fundraising tools and RaceDay check-in app included with every race; pricing details only on Pricing page. — [RunSignup](https://runsignup.com)
- RunSignup uses "switching" case studies (e.g. NCMC Turkey Trot, Trail Racing Over Texas "by Switching to RunSignup") and claims races/timers move from Race Roster citing lower prices (vendor claim). — [RunSignup NCMC case study](https://info.runsignup.com/case_studies/ncmc-turkey-trot/), [Trail Racing Over Texas](https://info.runsignup.com/case_studies/trail-racing-over-texas/)
- Race Roster: states a dedicated team imports current and past participant data, including events mid-registration (migration/concierge). — [Race Roster migration article](https://raceroster.com/articles/enmotive-seamless-event-migration) (via search summary; vendor claim)
- Race Roster testimonials are named race directors with event and role: Jennifer Edwards (GM, ASICS Falmouth Road Race), Carlo Facchino (Race Director/Founder, Mermaid Series), Scott McConville (Race Director, Wharf to Wharf; credits switch for higher registration, donation and merchandise revenue). — [Race Roster](https://raceroster.com/solutions/event-organizer)
- Race Roster "Get the customer support you deserve" page exists, positioning support as differentiator. — [Race Roster support](https://raceroster.com/go/support-you-deserve)
- Race Roster demo path: "Let's talk" and "Book a demo". RunSignup: "Schedule a Call". Ticket Tailor: "Book a demo" in bar, hero, footer. — sources above.
- RunSignup case studies carry outcome stats (Harpoon 5-Miler sold out in 16 days in 2025; Flutie 5K 26 years). — [RunSignup](https://runsignup.com)

### Inferences
- Strong fit for a sports platform: (a) named race-director testimonials with event name and one metric; (b) "Switch in a weekend" concierge migration with participant-data import and mid-registration handover; (c) "Alternative to X" pages; (d) a "Book a call" path for large/marathon events; (e) a numbers strip.
- Relevance to India: none of these platforms were verified as India-specific. Stripe and Shopify show an India region selector/ "/in" locale, which is a premium detail; India-relevant race platforms (e.g. local registration vendors) were not covered here.

### Gaps
- Actual pricing page layouts (tables, calculators, toggles) not fetched; Let's Do This, Race Entry, Active Network, Sportstats, Dice partner pages blocked or not reached; Race Roster migration article cited via search listing only.

## 6. Footers and premium details

### Cited Findings
- Eventbrite footer: columns mirroring header, repeated Get Started/Contact Sales, socials, legal links incl. privacy preferences, country selector. — [Eventbrite Organizer](https://www.eventbrite.com/organizer/)
- Ticket Tailor footer: company/legal, support (Contact us, Book a demo, Pricing, Help, Partner program, API docs, Status), quicklinks, badges (Certified B Corporation, Penny for the Planet, carbon neutral), newsletter. — [Ticket Tailor](https://www.tickettailor.com)
- Race Roster footer: postal addresses for USA and Canada; Cookie settings. — [Race Roster](https://raceroster.com/solutions/event-organizer)
- Stripe footer: newsletter with consent, region selector (India, English), restricted businesses link. — [Stripe](https://stripe.com)
- Premium touches observed: announcement bars (Stripe, Ticket Tailor), rotating hero text (Shopify), rating badges and intro video (Ticket Tailor), numbers strip (RunSignup), region selector, repeated closing CTAs, status page and API docs links.

### Inferences
- Add trust footer items: status page, security/payments compliance, support hours in IST, WhatsApp support (India-specific suggestion, not sourced).

### Gaps
- Sticky header scroll behaviour, command search, dark/light, screenshots: not verifiable; recommend a visual pass via Mobbin/Land-book/Wayback.
