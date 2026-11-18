# Role handling and dashboards on other event, sports and marketplace platforms (India focus)

Method note: public pages only, no logins or forms. About 22 tool calls (search plus fetch). Several platforms (District/Insider, cult.fit, Decathlon India, Playo coaching, Hudle coaching, HYROX India, Teachable, Urban Company app internals, Flipkart official docs) returned little or no primary-source detail. Those are flagged in Gaps and are marked [UNVERIFIED] where only third-party blogs support a claim.

## 1. Signup entry points and account model per role (one account with role switch, or separate accounts/apps?)

### Takeaway
Indian sports and venue platforms (Playo, Hudle) use a separate partner app and console from the consumer app, with separate partner credentials. Event ticketing (Townscript) and Strava/Meetup use one account where the organiser or admin role is an attribute of the account or group. Marketplaces (Amazon, Flipkart) use a separate seller portal and seller account. Staff roles are always sub-users inside the organisation or venue, not separate platforms.

### Cited Findings
- Playo ships a distinct "Playo Partner" app and web dashboard for venue owners, logged into with "Playo Partner credentials". The consumer app is separate — [Playo Partner Console help](https://playo-partner.freshdesk.com/support/solutions/articles/1070000137391-what-is-the-playo-partner-console-); [Playo blog](https://blog.playo.co/playo-partner-app)
- Playo's partner app is aimed at venue owners and managers: football turf, box cricket, badminton, pickleball, swimming pools, fitness studios and multi-sport complexes, single or multi-location — [Playo Partner Console help](https://playo-partner.freshdesk.com/support/solutions/articles/1070000137391-what-is-the-playo-partner-console-)
- Playo's help page and blog do not mention a coach or academy role; the audience listed is facility operators only — [Playo Partner Console help](https://playo-partner.freshdesk.com/support/solutions/articles/1070000137391-what-is-the-playo-partner-console-); [Playo blog](https://blog.playo.co/playo-partner-app)
- Hudle has a separate "Hudle Partner" app (developer Hsquare Sports Private Limited) described as for "sports venues and event organisers", distinct from the consumer "Hudle: Find Sports Activities" app — [Hudle Partner, App Store India](https://apps.apple.com/in/app/id1569130632); [Hudle consumer app](https://apps.apple.com/ms/app/id1380053168)
- Hudle's venue signup is sales-assisted: the page offers "Request a Demo", "Personalized Setup Assistance", phone and email rather than visible self-serve steps — [Hudle list your venue](https://hudle.in/list-your-sports-venue)
- Townscript: the organiser role is inside the same user account; the Billings tab sits under a drop-down labelled "Organizing Events" in the account menu — [Townscript KYC article](https://support.townscript.com/support/solutions/articles/1000156343-how-to-add-update-kyc-details-)
- Eventbrite: organisation-level "Team management" with Roles; default roles are owner and admin (newer article); older article listed Admin and Check-in. Legacy sub-users migrated to "Legacy Role". The two articles conflict — [Eventbrite roles search results (permissions definitions)](https://www.eventbrite.com/help/en-us/articles/362073/) (direct fetch of the glossary was blocked with HTTP 403, so details are from search snippets)
- Meetup: one user account; roles are per group. Primary organizer (pays subscription, manages finances, can close group, nominate successor), Co-organizer (group settings, manage leadership), Assistant organizer (accept/remove/ban members), Event organizer (schedule/edit/cancel events, contact members) — [Meetup leadership roles](https://www.meetup.com/blog/expand-your-meetup-group-through-collaborative-leadership/)
- Strava clubs: same athlete account; creator is automatically Owner; Admins and Members. Club types: public or invite-only. Strava recommends a separate account for club admin access when representing a business — [Strava Clubs help](https://support.strava.com/en-us/articles/15402172-clubs-on-strava); [Strava club moderation guidelines](https://support.strava.com/hc/en-us/articles/27363926037261-Club-Moderation-Guidelines-For-Admins-and-Owners) (the separate-account and verified-club points come from search summaries of Strava and third-party guides, not a fetched page)
- RunSignup: race director dashboard; additional race directors can be added under Race > Secure Access/Info Sharing with Simple/Advanced permission sets; payment-account access can be shared separately. "Partners" (timing or race management companies) get a Partner Dashboard and the Timer Dashboard is a separate tool for timers — [RunSignup: share dashboard access](https://info.runsignup.com/2024/12/11/why-its-important-to-share-dashboard-access/); [RunSignup: partners vs timers](https://info.runsignup.com/?p=40334); [RunSignup Timer Dashboard](https://info.runsignup.com/2017/07/12/timer-dashboard/) (snippets only)
- Udemy: instructors use payout and tax settings in the same account system; I could not confirm role-switch mechanics — [Udemy instructor tax update](https://teach.udemy.com/2024-tax-policy-update/)
- Decathlon marketplace (global/Mirakl) is a closed, approval-based marketplace; sellers get a separate Mirakl seller portal and API keys — [Channable Decathlon](https://www.channable.com/integrations/decathlon); [ChannelEngine Decathlon guide](https://support.channelengine.com/hc/en-us/articles/4412651192209-Decathlon-marketplace-guide); [Linnworks guide](https://linnworks.com/?p=25270) (third-party integrator sources)
- cult.fit has a separate "Cult Team" iPhone app for in-house trainers, centre managers and freelance trainers who are "onboarded", i.e. staff app separate from consumer app — [Cult Team app listing (search snippet)](https://apps.apple.com/in/app/id1315524520)
- cult.fit offers gym-owner partnership and franchise models via business.cult.fit — [cult business partner page](https://business.cult.fit/franchise/cult-pass); [Franchise India interview](https://www.franchiseindia.com/index.php/insights/en/interview/cultfit-takes-fitness-beyond-metros-with-gym-in-a-box-franchise-model.58535)
- HYROX: gym affiliation (Training Club / Performance Centre) is applied for through a HYROX365 account and local affiliate coordinator — [HYROX DACH partner gym](https://hyroxdach.com/?p=1329); [Origym HYROX partner gym](https://www.origym.co.uk/blog/hyrox-partner-gym/) (third-party and DACH, not India)

### Inferences
- Pattern A (venue-ops tools): separate partner app plus web console, role-based staff sub-accounts (Playo, Hudle). Pattern B (community/group): single account, role attached to the group (Meetup, Strava). Pattern C (marketplace): separate seller identity tied to a legal entity (Amazon, Flipkart, Decathlon). Pattern D (event ticketing): same user account, organiser mode with KYC gate (Townscript).
- None of the sports-specific Indian platforms found surface a distinct coach role. Coaches are either venue-attached (Playo, Hudle academies as venue customers) or staff of a brand (cult.fit).

### Gaps
- Townscript: whether organiser and attendee share one login in the UI is implied by the Billings drop-down but not explicitly documented.
- Insider/District: organiser signup page (insider.in/list-your-events) returned HTTP 502; could not verify entry points. District's "List your events" link exists but no published organiser flow was found — [echai District listing](https://echai.ventures/startingup/r/list-your-event-on-district--t5-su-tools-mkt-r219) (aggregator)
- Eventbrite current English roles glossary not retrievable (403). Meetup help-centre role pages not fetched directly.
- Udemy/Teachable: no source found on one-account role switching. Teachable not researched with a source.
- Urban Company partner app: structure not confirmed beyond training descriptions (see section 3).
- Playo/Hudle coach-specific signup: not found.

## 2. Dashboard contents per role

### Takeaway
Venue/booking platforms centre on today's bookings, calendar/slot control, earnings and reports. Event platforms centre on events, registrations, check-in, reports and payouts. Community platforms (Strava, Meetup) centre on members, events and moderation, with no payments. Playo and Hudle dashboards document no coach/batch or enquiry modules in the pages I could read.

### Cited Findings
- Playo Partner dashboard: summary of today's bookings, earnings, cancellations, slot availability and performance; slots and calendar (add/adjust/block slots, custom pricing, maintenance, tournaments); booking logs with online/offline distinction, payment status and repeat-customer tracking; payments and finances (daily/weekly/monthly earnings, pending payouts, GST-compliant invoices, exports); reports and analytics (revenue by sport, peak slots, occupancy); team management with role-based access. Web additionally has equipment configuration and deeper analysis — [Playo Partner Console help](https://playo-partner.freshdesk.com/support/solutions/articles/1070000137391-what-is-the-playo-partner-console-)
- Playo staff roles example: front desk (bookings), accountant (view earnings), admin (owner keeps full control) — [Playo blog](https://blog.playo.co/playo-partner-app)
- Hudle Partner app: sport-wise occupancy dashboard with filters and downloadable reports, membership automation, staff management, GST invoicing, in-app UPI payment collection, club membership and booking management, analytics, rescheduling and cancellations — [Hudle Partner, App Store](https://apps.apple.com/in/app/id1569130632)
- Hudle web: slot system with staff roles and access controls; real-time analytics on bookings, engagement and revenue; accounting with payments, invoices and exportable reports; tournament registration and promotion for event organisers — [Hudle list your venue](https://hudle.in/list-your-sports-venue)
- Hudle advertises "0% Commission" on its venue page — [Hudle list your venue](https://hudle.in/list-your-sports-venue)
- Strava club leaderboards (weekly, reset Sunday), recent-activity feed, discussion posts; owners/admins create and edit group events (start time, date, location required, single day max) — [Strava Clubs help](https://support.strava.com/en-us/articles/15402172-clubs-on-strava); [Strava group events help](https://support.strava.com/en-us/articles/15401898-how-do-i-create-and-manage-group-events-for-my-club) (event detail is from search snippet)
- Meetup: Event organisers schedule/edit/cancel events and contact members; assistant organisers manage membership; co-organisers manage settings and leadership; primary pays subscription and manages finances — [Meetup leadership roles](https://www.meetup.com/blog/expand-your-meetup-group-through-collaborative-leadership/)
- Eventbrite permission examples: edit event details, manage event status, advanced reports, manage organisation team and permissions, edit organisation information — [Eventbrite permissions (search snippet)](https://www.eventbrite.com/help/en-us/articles/362073/)
- RunSignup: Race director dashboard with role-based access by responsibility (e.g. marketing coordinator for email, volunteer coordinator); Timer Dashboard with pre-race readiness checks, real-time race-day views and post-race summaries; team captains view fundraising roster; separate Clubs product with membership management and automatic member discounts at registration — [RunSignup share access](https://info.runsignup.com/2024/12/11/why-its-important-to-share-dashboard-access/); [Timer Dashboard 2025](https://info.runsignup.com/2025/07/07/timer-dashboard-new-intuitive-view-and-real-time-readiness/); [RunSignup single platform](https://info.runsignup.com/2021/04/09/manage-your-event-from-a-single-platform/)
- Flipkart Seller Hub dashboard: listings, inventory, orders, payments, returns, business performance — [Easebuzz Flipkart Seller Hub guide](https://easebuzz.in/explainers/ecommerce/flipkart-seller-hub-guide/); [Unicommerce guide](https://unicommerce.com/blog/how-to-sell-on-flipkart-india/) (third-party)
- Etsy: Shop Manager > Finance > Payments Settings is where bank and payout details live — [WorldFirst Etsy guide](https://www.worldfirst.com/sasia/help-center/receiving-payments/etsy/) (third-party); [Etsy bank verification help](https://help.etsy.com/hc/en-in/articles/115015775908-How-to-Update-and-Verify-Your-Bank-Account-for-Etsy-Payments-Deposits)
- Udemy: payout and tax settings page, with year-end tax forms downloadable there — [Udemy tax update](https://teach.udemy.com/2024-tax-policy-update/)

### Inferences
- A common "home" for venue partners is: today's bookings, earnings, pending payouts, calendar. A seller hub's home is orders, inventory, returns, payments. An organiser dashboard's home is events, registrations, sales and check-in. A coach/academy dashboard would logically combine batches/calendar (venue pattern), enquiries and trials (no benchmark found), and payouts.
- Staff sub-roles are modelled around money access (accountant sees earnings) versus operations (front desk). Meetup and RunSignup separate financial control from operational roles explicitly.

### Gaps
- Top-level menu items for Townscript, Insider/District, Eventbrite India, Amazon Seller Central, Teachable, cult.fit Team app not verified from public pages.
- No screenshots or demo videos were analysed (not fetched).
- No dashboards found for coach or academy on Playo/Hudle. Hudle's one academy testimonial (Agnel Badminton Academy: bookings, player queries, memberships across six courts) shows academies use the venue tool as customers, not as a distinct role — [Hudle list your venue](https://hudle.in/list-your-sports-venue)

## 3. Onboarding gating per role (KYC, GST/PAN, bank, certification, admin approval)

### Takeaway
Money-collecting roles are gated by identity and bank verification (Townscript: Aadhaar, bank, GST status, 24-48h; Amazon/Flipkart: GSTIN, PAN, bank). Service-provider and brand-affiliated roles are gated by certification and training (Urban Company training and background checks; HYROX coach certification and academy courses). Closed marketplaces (Decathlon) use an approval/invite model.

### Cited Findings
- Townscript KYC (Billings > Update KYC Details): choose individual or company; name, OTP-verified phone, address; GST status and number; company CIN; Aadhaar number plus front/back scans; bank name, account number, IFSC, holder name, account type. PAN is not mentioned in the article. Compliance may ask for an event/venue permission document and event-day photos. Verification takes 24-48 hours; any KYC edit triggers re-verification — [Townscript KYC article](https://support.townscript.com/support/solutions/articles/1000156343-how-to-add-update-kyc-details-)
- Townscript says KYC is to remain fraud-free and transfer ticket revenue safely; first clearing for new organisers can take about a week due to compliance diligence — [Townscript: why KYC](https://support.townscript.com/support/solutions/articles/1000283037-why-is-townscript-asking-for-kyc-details-and-how-is-it-important-); [Townscript: clearing time](https://support.townscript.com/support/solutions/articles/1000098942-in-how-many-days-does-townscript-clear-money-) (from search snippets, not fetched)
- Amazon India: Amazon's own page lists GST registration documents (PAN of signatories, Aadhaar for individuals/proprietors, photos, place-of-business proof, bank proof such as cancelled cheque, passbook or statement). Bank can be added after GST registration — [Amazon India seller blog](https://sell.amazon.in/seller-blog/documents-required-goods-services-tax-registration). This is about GST registration, not the Seller Central checklist itself
- Amazon seller registration (third-party sources): GSTIN, PAN, bank account, name consistency across PAN/GST/bank, possible video verification call, PAN not changeable on an existing account [UNVERIFIED] — [ClearTax](https://cleartax.in/s/amazon-seller-registration); [GoNukkad](https://www.gonukkad.com/blog/documents-required-to-become-amazon-seller-india); [Kanakkupillai](https://www.kanakkupillai.com/learn/sell-on-amazon-india/)
- Flipkart (third-party sources): OTP mobile verification, GSTIN (some categories exempt, e.g. books) plus PAN and bank proof; GSTIN validated against GST portal; onboarding ranges from under an hour to 3-7 working days [UNVERIFIED] — [Registerkaro](https://www.registerkaro.in/post/flipkart-seller-registration-procedure); [Unicommerce](https://unicommerce.com/blog/how-to-sell-on-flipkart-india/); [Increff](https://www.increff.com/blog/how-to-be-a-seller-on-flipkart-a-complete-guide-2)
- Decathlon marketplace: approval required (closed marketplace); application via a partner form; typical asks are signed commercial agreement, onboarding questionnaire, brands/logos, product details, company info; brand authorisation may be required; performance expectations such as cancellation rate under 2% [UNVERIFIED, integrator sources, not India-specific] — [Linnworks](https://linnworks.com/?p=25270); [ChannelEngine](https://support.channelengine.com/hc/en-us/articles/4412651192209-Decathlon-marketplace-guide)
- Urban Company: onboarding includes background verification (partnered with third-party verifiers such as AuthBridge, older source), digital training (soft skills, hard skills, app usage, ranging 1 to 10 days per an engineering post), a dummy app for practising job acceptance, and e-Shram registration. Another source gives 2-6 weeks for academy training, which conflicts — [UC engineering blog on training](https://medium.com/uc-engineering/digital-training-at-urban-company-745619a7abf4); [UC investor relations: enablement](https://investorrelations.urbancompany.com/announcements-and-highlights/service-professional-enablement); [UC e-Shram](https://investorrelations.urbancompany.com/announcements-and-highlights/urban-company-and-international-labour-organization-collaborate-to-expand-e-shram-registration-for-uc-service-professionals); [Valueforstartups](https://valueforstartups.in/09-urban-company)
- HYROX gym affiliation: apply through HYROX365 account, gym must meet standards, pay affiliate fee (from about EUR 90/month quoted in one regional source); coaches need a national personal training certification plus two HYROX365 Academy courses per one source [UNVERIFIED, third-party/EU] — [Roxlyfe](https://roxlyfe.com/hyrox-gym-affiliation/); [Origym](https://www.origym.co.uk/blog/hyrox-partner-gym/); [HYROX DACH](https://hyroxdach.com/?p=1329)
- Udemy: valid tax form (W-8BEN for non-US individuals) is required to receive payout since 1 Jan 2024; there is an India instructor withholding tax FAQ — [Udemy tax update](https://teach.udemy.com/2024-tax-policy-update/); [Udemy India withholding tax FAQ](https://support.udemy.com/hc/en-us/articles/26659221900695-India-Instructor-Withholding-Tax-Frequently-Asked-Questions)
- Etsy: bank verification by small deposit (same currency) or statement upload; 30 days to verify or deposits freeze; name must match — [Etsy help (India)](https://help.etsy.com/hc/en-in/articles/115015775908-How-to-Update-and-Verify-Your-Bank-Account-for-Etsy-Payments-Deposits)
- Playo and Hudle: neither page I could read documents KYC, GST or approval steps. Hudle supports GST invoicing and Playo GST-compliant invoices, implying GST handling on the venue side — [Playo help](https://playo-partner.freshdesk.com/support/solutions/articles/1070000137391-what-is-the-playo-partner-console-); [Hudle Partner](https://apps.apple.com/in/app/id1569130632)

### Inferences
- A sensible tiering for a sports platform: light gate for browsing/community roles (Strava/Meetup style, none); identity + bank gate before any payout (Townscript style); GST/PAN gate for seller-of-goods; certification/background gate for coaches, with admin approval before public listing (Urban Company and HYROX analogues).
- Townscript requiring Aadhaar rather than PAN is a notable difference from marketplace sellers, who use PAN+GST.

### Gaps
- PAN requirement at Townscript is not stated. Insider/District KYC not verified.
- Official Amazon Seller Central and Flipkart onboarding pages were not retrieved; only third-party guides, so timelines vary between sources.
- No source found for coach certification checks on Playo/Hudle/cult.fit; cult.fit trainer onboarding steps not documented publicly.
- HYROX India-specific affiliation not found.

## 4. Coach and academy/club profiles (listing, batches, trials, enquiries, fees, reviews, sub-accounts)

### Takeaway
In India, the public evidence I found shows coaches and academies mainly appear as customers of venue software (Hudle memberships/bookings) rather than as first-class profile types. The best documented coach/academy model I found is Playtomic (Spain, padel), which has a required coach profile and an Academy module; it is a pattern reference only. I found no public documentation of trial-class or enquiry workflows at Playo, Hudle or cult.fit.

### Cited Findings
- Hudle: an academy testimonial states Hudle handles bookings, player queries and memberships for six courts; no coach feature pages found — [Hudle list your venue](https://hudle.in/list-your-sports-venue)
- Hudle app lists membership automation, staff management and club membership management — [Hudle Partner, App Store](https://apps.apple.com/in/app/id1569130632)
- Playtomic (reference, not India): Academy lets clubs publish recurring courses, clinics and private lessons bookable in the player app; a coach profile (prices, availability, calendar) must exist before a class can be created; private lessons are bookable only if the club enables the feature, with cancellation per club policy — [Playtomic Academy help](https://helpmanager.playtomic.com/hc/en-gb/articles/20559686617361-Academy-Courses-and-Classes); [Playtomic Coach Profile](https://helpmanager.playtomic.com/hc/en-gb/articles/20534816309649); [Playtomic Coach web app](https://helpmanager.playtomic.com/hc/en-gb/articles/45335085102481-Playtomic-Coach-web-app)
- PodPlay (US, reference): coach profile setup and coaching docs exist, with Stripe-based coach payouts per search summary — [PodPlay coach profile](https://docs.podplay.app/coaches/coach-setup-and-profile/set-up-a-coach-profile) (snippet only)
- cult.fit: trainers, centre managers and freelance trainers use the "Cult Team" app; cult.fit also runs a training academy for partner gyms — [Cult Team app listing](https://apps.apple.com/in/app/id1315524520); [cult business partner page](https://business.cult.fit/franchise/cult-pass)
- RunSignup Clubs: membership management, club member discounts at registration (clubs at 1,700+ members cited) — [RunSignup Sportverse/clubs coverage](https://endurance.biz/2017/industry-news/runsignup-introduces-smarter-registration-raceinsights-promotional-tools/) (older snippet)
- Strava clubs: public or invite-only; owner/admin/member; leaderboards and events; no payments or fees — [Strava Clubs help](https://support.strava.com/en-us/articles/15402172-clubs-on-strava)
- Meetup: leadership team roles for community organisers; subscription paid by primary organizer — [Meetup leadership roles](https://www.meetup.com/blog/expand-your-meetup-group-through-collaborative-leadership/)
- Urban Company: partner (professional) is individual, with ratings-based marketplace; no coach analogue verified — [UC investor relations: enablement](https://investorrelations.urbancompany.com/announcements-and-highlights/service-professional-enablement)

### Inferences
- Gap in the Indian market: no public evidence that Playo or Hudle supports a coach profile with batches, trial classes, enquiries and reviews. This is a possible differentiator, but absence of public docs is not proof the features don't exist inside logged-in apps.
- A usable composite model: Academy/club (org entity with staff sub-accounts, like Playo roles) owns Coaches (profile per Playtomic pattern) who own Batches (recurring) and Trial classes; enquiries and fees would be GoAthletix-specific design choices not benchmarked here.

### Gaps
- Trial class, enquiry, fee-structure and review mechanics: no public Indian benchmark found.
- Playo coach/academy listing (e.g. Playo Coaching) not verified; search returned only Playtomic and unrelated academies.
- Coach/academy sub-accounts for coaches under an academy: not documented for any India platform found. Eventbrite/Meetup/Playo sub-role patterns are the nearest analogues.

## 5. Sellers versus event organisers: listing and payouts

### Takeaway
Organisers get paid on event sales, often held until or after the event with a first-payout compliance delay (Townscript about a week first time; legacy Insider settled after the event). Marketplace sellers list SKUs and are paid on a rolling post-dispatch or post-delivery cycle after commission, with returns and ongoing catalog compliance.

### Cited Findings
- Townscript: bank details collected as part of KYC; first clearing about a week for new accounts — [Townscript KYC article](https://support.townscript.com/support/solutions/articles/1000156343-how-to-add-update-kyc-details-); [Townscript clearing time](https://support.townscript.com/support/solutions/articles/1000098942-in-how-many-days-does-townscript-clear-money-) (snippet)
- Legacy Insider organiser page (pre-District): payments received by Paytm Insider and settled with organiser after the event; account details and payout documents collected at signup. Page predates the handover; I could not fetch it directly (502), so this is from a search summary — [Insider list your events](https://insider.in/list-your-events)
- Playo: commission per successful booking, percentage not stated; partners see pending payouts and can download GST invoices; payout timing not documented — [Playo blog](https://blog.playo.co/playo-partner-app)
- Hudle: advertises 0% commission; settlement FAQ ("how will I get my settlements", frequency) shows only questions, no answers on the page — [Hudle list your venue](https://hudle.in/list-your-sports-venue)
- Flipkart settlement: conflicting third-party figures (7-15 days; 7 days post-dispatch; 7-15 days after delivery) [UNVERIFIED] — [Easebuzz](https://easebuzz.in/explainers/ecommerce/flipkart-seller-hub-guide/); [Unicommerce](https://unicommerce.com/blog/how-to-sell-on-flipkart-india/)
- Etsy: sales funds go to the verified bank account on the deposit schedule; buyer payments land in the Etsy Payments account, not the seller's own account — [Etsy help (India)](https://help.etsy.com/hc/en-in/articles/115015775908-How-to-Update-and-Verify-Your-Bank-Account-for-Etsy-Payments-Deposits); [Insightagent guide](https://insightagent.app/guides/how-does-etsy-pay-you) (third-party)
- Udemy: tax form required for payout; withholding applied at payout — [Udemy tax update](https://teach.udemy.com/2024-tax-policy-update/)
- Meetup: payer of subscription is primary organiser; no per-ticket seller payouts — [Meetup leadership roles](https://www.meetup.com/blog/expand-your-meetup-group-through-collaborative-leadership/)
- RunSignup: payment account access can be shared separately from dashboard access — [RunSignup share access](https://info.runsignup.com/2024/12/11/why-its-important-to-share-dashboard-access/)
- Decathlon marketplace: Mirakl seller portal, product catalog compatible with Mirakl, API integration; closed approval — [Linnworks](https://linnworks.com/?p=25270); [Channable](https://www.channable.com/integrations/decathlon)

### Inferences
- Differences that matter for a data model: organiser = Event (time-bound, capacity, tickets, attendee list, check-in) with payout tied to event completion; seller = Product/SKU (inventory, variants, shipping, returns) with payout tied to delivery and return windows; venue/coach = recurring Slot/Batch with payout per booking or membership. All three need a payee entity (legal name, PAN/GST, bank) separate from the user profile.
- Amazon/Flipkart require name consistency between PAN, GST and bank; Townscript uses Aadhaar plus bank; both imply the payee entity should be verified separately from the login user.

### Gaps
- Official payout schedules for Playo, Hudle, Insider/District, Amazon and Flipkart not found in primary sources.
- Eventbrite payout rules for India not researched; Eventbrite India operations not verified.
- Teachable instructor/school-owner model, Etsy India onboarding and cult.fit payouts: not researched.
- HYROX event organiser (race host) process and India licensing not found.
