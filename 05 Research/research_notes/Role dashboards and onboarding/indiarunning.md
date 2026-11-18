# IndiaRunning (indiarunning.com): role separation, signup/login, profile completion, dashboards

Research date: 2026-11-18. Public pages only; no login, signup or form submission. The organiser portal and the logged-in runner area are JS-rendered or gated, so most in-product screens could not be observed. Treat anything not cited as unverified.

## Entry points: Login/Sign up vs "List your event" / organiser

### Takeaway
The public site has separate entry points. "Log In" and "Sign Up" in the header serve participants. "Create Event" in the header links to a separate subdomain, organiser.indiarunning.com. It is titled "India Running Organiser Dashboard". This suggests a separate organiser app, but its login/signup UI was not observable.

### Cited Findings
- The header nav of the homepage reads: All Events, Shop Nutrition (external, ascendliv.com/collections), Training (external, training.fitpage.in), Create Event (https://organiser.indiarunning.com), Log In, Sign Up. The mobile menu adds Events by Distance, Events by City, Event Review, Stories and Blogs, "Write your story". — [indiarunning.com](https://indiarunning.com)
- There is no "List your event", "Partner", "Sell", "Coach", "Club" or "Volunteer" link in the homepage nav or footer. The only organiser link is "Create Event". — [indiarunning.com](https://indiarunning.com)
- The homepage listing tabs are "Races (126)" and "Run Clubs (0)". The Run Clubs tab was empty at fetch time. — [indiarunning.com](https://indiarunning.com)
- Footer links: /contact-us, /tnc, /privacy-policy, /sitemap, /distance/{less-than-5k,5k,10k,half-marathon,marathon,ultra-marathon}, /city/{mumbai,pune,delhi,bangalore,chennai,hyderabad,kolkata,goa,indore}. It also links the India Running mobile apps and the Fitpage apps, and says "Powered by Fitpage" (fitpage.in). — [indiarunning.com](https://indiarunning.com)
- Fetching organiser.indiarunning.com returned only the title "India Running Organiser Dashboard". The page is a client-rendered app, so the content was not visible. — [organiser.indiarunning.com](https://organiser.indiarunning.com)
- Events can have their own subdomains, for example multicityrun.indiarunning.com, a multi-city event page with registration and a bib-collection FAQ. — [search result](https://multicityrun.indiarunning.com)
- Event URL pattern: /events/{slug}-{numeric id}, for example https://www.indiarunning.com/events/vishal-marathon-39259. — [search results](https://www.indiarunning.com/events/vishal-marathon-39259)

### Inferences
- Organisers and participants use separate front ends (www vs organiser subdomain). Whether they share one identity or credential store is unknown.
- The brand is run by Saransh Ventures Pvt Ltd on the Fitpage platform. The Fitpage app and the training and nutrition shops are cross-sell surfaces, not roles.

### Gaps
- The sign-in methods on the login screen (phone OTP, email, Google) were not observed. The privacy policy mentions Google/Facebook login and says nothing of OTP (see below).
- The organiser login and signup UI at organiser.indiarunning.com could not be rendered.

## Account model: one account or separate roles?

### Takeaway
The legal documents define two account types, Participants (Users) and Organizers (Hosts), plus the platform itself, which sometimes organises events directly. No public evidence of separate coach, seller, club-admin, sponsor or volunteer account types.

### Cited Findings
- T&Cs define Participants (18+, or a guardian registering a minor), Organizers (third-party entities or individuals who list, manage and promote events, 18+), and the Platform (IndiaRunning, operated by Saransh Ventures Private Limited), which in some cases organises events itself. — [T&Cs](https://www.indiarunning.com/tnc)
- Volunteers, race directors and medical staff appear in the T&Cs only as people participants must follow at events. There is no volunteer signup or role. — [T&Cs](https://www.indiarunning.com/tnc)
- The privacy policy lists two account types, Organizers (Hosts) and Participants (Users). Both must be 18+. — [Privacy Policy](https://www.indiarunning.com/privacy-policy)
- Event pages say listings are updated from information given by "website visitors, event organizers, participants and thousands of volunteers". This is crowd-sourced data, not a volunteer role. — [event page](https://www.indiarunning.com/events/vishal-marathon-39259)
- The footer has a "Write your story" item (mobile menu) and an "Event Review" item. This points to user-generated content (reviews, stories) from ordinary accounts, not a separate role. — [indiarunning.com](https://indiarunning.com)
- The Android and iOS apps are consumer apps (runners). The iOS listing mentions organisers only for the "organising club" on the event page and for paid/free events with add-ons. — [App Store](https://apps.apple.com/in/app/india-running/id6736513478)

### Inferences
- A person who is both runner and organiser probably needs a participant login on www and a separate organiser account, but this is unverified.
- "Run Clubs" is a listing and community feature available to ordinary users (the app lets users create and manage a club), not a distinct account role.

### Gaps
- No evidence found of seller, coach, academy or sponsor roles. Coaching sits behind the Fitpage training site and the shop behind Ascendliv and Dukaan (the privacy policy says Dukaan hosts the "IR Shop"), so these are external products, not roles.
- Whether clubs have admin dashboards on the web is unknown.

## Runner (participant) profile and dashboard

### Takeaway
The profile is built around event registration data. Terms list a broad set of participant fields, and the app description says users set up a profile before registering. Dashboard widgets (registrations, results, certificates, saved events, gear) could not be observed.

### Cited Findings
- The T&Cs list participant data as: name, phone, email, ID details (such as Aadhaar), blood group, emergency contact, T-shirt size, postal address, plus event-specific details. — [T&Cs](https://www.indiarunning.com/tnc)
- The privacy policy lists registration data (name, email, mobile number "and other fields in the sign-up form"), identity verification images (government ID, passport, national ID, driving licence) where permitted, and payment data processed by gateways (Razorpay, PayTM or the IndiaRunning gateway). — [Privacy Policy](https://www.indiarunning.com/privacy-policy)
- Third-party sign-in via Google or Facebook is mentioned. OTP-based sign-in is not mentioned. — [Privacy Policy](https://www.indiarunning.com/privacy-policy)
- Integrations named: Strava and Garmin (data integration), Captured (event photos), Fitpage (training plans), Dukaan (IR Shop), OpenAI (Run Buddy). Optional tools are a running calculator questionnaire and Run Buddy queries. — [Privacy Policy](https://www.indiarunning.com/privacy-policy)
- iOS app features: filter races by distance, city, price and date; find, join, create and manage run clubs; register and pay for events; transfer an entry or cancel; maps to start and finish; address-book sync to see which contacts are running; a personal running calendar; a Race Pace Calculator; "runbuddy" route analysis (elevation and pacing). — [App Store](https://apps.apple.com/in/app/india-running/id6736513478)
- App release notes: 2.0.0 (major redesign with run club discovery, address-book sync, entry transfers, paid events with add-ons), 2.0.6 (organisers can join the organising club from the event page and pin an address on a map), 2.1.0 (calendar integration for race day), 1.9.5 (profile-related fixes). Reviews mention setting up a profile before registering for races. The listing does not mention Strava or certificates. — [App Store](https://apps.apple.com/in/app/india-running/id6736513478)
- Participant registrations are non-refundable and non-transferable unless the organiser permits it (but the app markets "transfer your entry" and "cancel"). Refund requests go to the organiser. — [T&Cs](https://www.indiarunning.com/tnc)

### Inferences
- Profile completion is probably enforced at first registration, because event forms need blood group, emergency contact, T-shirt size and ID. Signup itself likely asks only name, email and mobile. This is unverified.
- Strava/Garmin integration is declared in the privacy policy, but no feature was seen in the app listing, so it may be limited or planned.

### Gaps
- Not verified: exact "My Profile" screens, required vs optional fields, results and certificates pages, saved events or wishlist, shoe/gear tracking.
- The Play Store page was not readable (JS-rendered).

## Organiser onboarding, KYC, payouts, approval and dashboard

### Takeaway
The terms say organisers must provide business, PAN, bank and signatory identity details and complete mandatory KYC. Settlements are held until KYC passes. There is no formal pre-approval, but IndiaRunning can edit or delist listings. Dashboard contents are known only from the T&Cs (participant data, leads, results).

### Cited Findings
- Organiser registration data: legal name, registered address, contact numbers and official email, PAN, bank account details, and identity proof for authorised signatories. The Platform may request more documents at any time. — [T&Cs](https://www.indiarunning.com/tnc)
- KYC is mandatory. It may occur before listing or periodically afterwards. Settlements are not processed until KYC is verified. — [T&Cs](https://www.indiarunning.com/tnc)
- Listing approval: the T&Cs describe no formal pre-approval step. Organisers must supply complete event details (dates, venue, categories, fees, cut-off times) and keep them updated. The Platform may review, modify or remove incomplete, misleading, unlawful or non-compliant listings without notice, and may suspend or delist events for material misrepresentation. — [T&Cs](https://www.indiarunning.com/tnc)
- Dashboard contents named in the T&Cs: participant details (ID proof, gender, medical and emergency details, race results) and "leads" (people browsing or showing interest in specific races). Organisers may use participant data only for the event. — [T&Cs](https://www.indiarunning.com/tnc)
- Fees and payouts: organisers set ticket prices. The Platform's service fee is included in or added to the price. The Platform "may retain roughly 30% to 50%" of total event revenue (as summarised by the fetch tool; verify against the original text before quoting). Optional paid promotions (banners, WhatsApp campaigns, email marketing). Settlement is partial before the event and final after it, via third-party gateways and/or the Platform's own processing. — [T&Cs](https://www.indiarunning.com/tnc)
- Organisers publish their own refund and cancellation policy, decide refund eligibility, and handle disputes and chargebacks. — [T&Cs](https://www.indiarunning.com/tnc)
- Organiser capabilities per the privacy policy: create and promote events, set pricing, ticketing and inventory, collect registration fees, receive attendee registration data. Event listings, reviews and ratings are user-generated content. — [Privacy Policy](https://www.indiarunning.com/privacy-policy)
- App and organiser features: free or paid events with add-ons such as merchandise; the organising club shown on the event page. — [App Store](https://apps.apple.com/in/app/india-running/id6736513478)
- Platform-run events exist: the platform "in some cases" organises events directly. — [T&Cs](https://www.indiarunning.com/tnc)

### Inferences
- Onboarding is likely self-serve account creation, then KYC (PAN, bank, signatory ID) gating payouts rather than listing. This fits the T&C wording but was not seen in the UI.
- The 30-50% take rate is unusually high versus ticketing peers. It may bundle marketing, timing or logistics services. Unverified.

### Gaps
- Not verified: event-creation wizard steps, promo codes, bib/check-in tools, exports, messaging, payout dashboards, listing-approval workflow, organiser verification timing.
- No press coverage, help centre, or YouTube walkthrough of the organiser portal was found in the searches run. A search for organiser pages returned no organiser.indiarunning.com results.
- The T&C fee range comes from an AI-summarised fetch. Re-read /tnc directly before relying on the numbers.
