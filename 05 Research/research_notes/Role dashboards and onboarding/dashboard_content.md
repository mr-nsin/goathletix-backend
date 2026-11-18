# Role dashboards for a multi-sport events platform (India, 2026)

Method note: ~13 tool calls. Several primary vendor pages (RunSignup info site, Meetup help) returned 403 to fetch, so cited findings below come from search-result summaries of vendor help pages, not full-page reads. Anything under "Inferences" is design recommendation, not sourced fact. Playo Business, Shopify admin, Amazon Returns, and Teachable's full sidebar could not be verified.

## 1. What are the 5-8 top-level navigation items per role?

### Takeaway
Benchmarks cluster around: Home/Overview, a core object list (Events / Orders / Classes), People (registrants/members/customers), Money (payouts/finance), Messages, Reports/Analytics, Settings. The per-role nav lists below are recommendations built on that pattern.

### Cited Findings
- Amazon Seller Central's home acts as a map to Catalog, Inventory, Orders, Advertising, Reports and Performance. — [SellerSprite](https://www.sellersprite.com/en/blog/amazon-seller-central-dashboard-tour-first-10-settings-after-login) (third-party guide, not Amazon documentation)
- Teachable's author (instructor) dashboard lists assigned courses/coaching products, plus tabs for Author Bio, Users, Sales, Emails, Settings and Payout Details. — [Teachable support](https://support.teachable.com/en/articles/11682543-author-dashboard)
- Eventbrite organiser: event-level dashboard with a Reporting section; Finance > Payouts for payout status/history/export; multi-event reports from main Reporting area. — [Eventbrite help](https://www.eventbrite.com/support/articleredirect?anum=5870), [Eventbrite payouts](https://www.eventbrite.fi/help/fi/articles/620300/how-to-see-and-export-itemized-payouts-for-eventbrite-payment-processing/)
- RunSignup groups reports into participant, financial, donation, marketing and saved reports; graphical reports sit on the Race Dashboard. — [RunSignup](https://info.runsignup.com/?p=159)
- Mindbody has a Reporting & Analytics tab; staff manage schedules, sales and client profiles from the business mobile app; Business Snapshot tiles default to yesterday's numbers and refresh nightly. — [Mindbody](https://www.mindbodyonline.com/business/business-management), [Mindbody Business Snapshot](https://www.mindbodyonline.com/education/blog/your-data-is-at-your-fingertips-with-business-snapshot)
- Hudle Partner app lists slot/booking management, membership automation, staff management, GST invoicing, UPI payment collection, analytics, rescheduling/cancellation, equipment rental POS, accounts reconciliation, payment links, dynamic coupons. — [Hudle Partner, App Store](https://apps.apple.com/in/app/id1569130632)
- Meetup organiser tooling: role tiers (organizer/co-organizer/assistant), member attendance history, attendee list merged with QR check-in, event chats, Pro dashboard with cross-group analytics. — [Meetup help](https://help.meetup.com/hc/en-us/articles/360002878471-Pro-admin-tools-overview), [Meetup attendees](https://help.meetup.com/hc/en-us/articles/9389668230541-Manage-attendees-and-track-attendance-for-your-Meetup-event)

### Inferences (recommended nav, 5-8 items)
- **Participant (mobile-first, bottom tabs):** Home | Explore | My Registrations (Upcoming / Past, tickets + QR) | Results & Certificates | Profile (personal, medical/emergency, family/junior profiles, saved events, orders from sellers). Notifications via bell, not a tab.
- **Organiser (desktop-first sidebar):** Home | Events (create wizard; per-event workspace) | Registrations/Participants (cross-event people search) | Check-in & Race Day | Marketing (promo codes, messaging, email/WhatsApp) | Finance (payouts, settlements, invoices/GST) | Reports & Analytics | Team & Settings. Inside each event: Overview, Tickets/Categories, Form, Participants, Bibs, Check-in, Promo, Messages, Results, Reports.
- **Seller:** Home | Catalogue | Orders | Inventory | Returns & Cancellations | Payouts | Reports | Settings (store profile, KYC/GST, shipping, team). Mirrors Seller Central/Shopify.
- **Coach:** Home | Profile & Certifications | Trainings/Batches | Schedule | Enquiries (leads inbox) | Students/Clients | Reviews | Earnings (if payments on-platform). Seven items.
- **Academy/Club:** Home | Listing/Profile | Batches & Schedule | Coaches/Staff | Members | Fees & Payments | Attendance | Events. Add Messages/Reports under Home or Settings to stay within 8.
- Pattern: use the same shell (sidebar on web, bottom bar on mobile), role switcher in header since one user can hold several roles (participant + coach + organiser).

### Gaps
- Exact current sidebar labels for Eventbrite, RunSignup, RaceRoster, Playo Business, Shopify admin, Teachable could not be confirmed (pages blocked or search summaries only).
- No Playo Business (partner) documentation found; only the consumer app listing surfaced.
- No Dribbble/Behance case studies were retrieved.

## 2. What does each role see on first login, and what is the single primary CTA?

### Takeaway
Best practice (Amazon, Teachable) is a setup/compliance-first state: the first screen is a checklist of blocking prerequisites (identity, legal/tax, bank), then one dominant CTA for the core object. Recommended CTAs are in Inferences.

### Cited Findings
- SellerSprite's first-login checklist groups ten settings into Account & Legal, Finance & Tax, Operations (legal entity, bank deposit method, compliance alerts); Amazon requires two-step verification per Seller Central user. — [SellerSprite](https://www.sellersprite.com/en/blog/amazon-seller-central-dashboard-tour-first-10-settings-after-login)
- Teachable authors see their assigned courses on login first. — [Teachable support](https://support.teachable.com/en/articles/11682543-author-dashboard)
- Eventbrite Organizer app home shows a summary of sales and check-ins, customisable. — [Eventbrite blog](https://www.eventbrite.com/blog/?p=15782)
- India DPDP Rules 2025 (notified 14 Nov 2025) require verifiable parental/guardian consent for under-18 data; behavioural tracking and targeted ads aimed at children are barred; substantive children's-data duties reportedly take effect about 14 May 2027 (law-firm commentary, not Gazette text). — [LiveLaw](https://www.livelaw.in/amp/top-stories/digital-personal-data-protection-rules-2025-notified-309928), [BDO India](https://www.bdo.in/en-gb/news/2025/digital-personal-data-protection-rules-2025-%E2%80%94-check-provisions,-implementation-plan,-penalties), [Chambers](https://chambers.com/articles/schools-coaching-centres-platforms-processing-children-s-data-are-you-compliant)

### Inferences (first-run state and primary CTA per role)
- **Participant:** Empty state = "Find your first event" with sport/city/date chips and a nearby-events carousel; secondary prompt to complete profile (emergency contact, medical, T-shirt size) which autofills every future registration. **Primary CTA: Find an event.** Offer "Add a child/family member" as secondary card (builds junior profiles early; mind DPDP parental-consent flow).
- **Organiser:** Empty state = setup checklist (verify organisation/KYC, add bank account, GST optional, create first event) with progress bar; show a sample/demo event and templates per sport (10K run, cyclothon, trek, tournament). **Primary CTA: Create your first event** (wizard autosaves drafts; bank/KYC can be deferred until publish with paid tickets, but required before first payout).
- **Seller:** Checklist: business/GST/PAN, bank, pickup address, shipping method, then add product. **Primary CTA: Add your first product** (bulk upload CSV secondary).
- **Coach:** Checklist: profile photo/bio, sports and levels, certifications upload (verification badge pending), location/online, first batch. **Primary CTA: Complete your profile** until >=80%, then **Create a batch/training**. Rationale: enquiries only flow once listing is live.
- **Academy/Club:** Checklist: listing (name, address, sports, photos), add batches with fee/schedule, invite coaches, import members (CSV). **Primary CTA: Publish your listing**, then Add first batch.
- Every empty state should show: one-line value statement, one primary button, a preview or sample data, and a "Skip, explore demo" link.

### Gaps
- No public data found on activation rates or drop-off in first-run flows for these platforms.
- Exact first-login screens for Eventbrite, RunSignup, Hudle not captured (no screenshots retrievable).

## 3. Which dashboard features are MVP versus later for an India sports platform?

### Takeaway
MVP = anything that gates a paid registration or payout and is a statutory/safety need (forms, registrations table, export, QR check-in, bibs, promo codes, payouts, medical/emergency, parent consent). Later = marketplace depth, analytics, advanced automation, RFID/timing integration.

### Cited Findings
- RunSignup treats these as core: registration, custom questions, bibs (auto, bulk, or dynamic at pickup), check-in app (with offline mode on the desktop version), reports, transfers, deferrals, bib exchanges. — [RunSignup features](https://info.runsignup.com/?p=159), [RunSignup RaceDay](https://info.runsignup.com/?p=165)
- RunSignup also offers check-in reports (counts, bib assignments, devices) and bib pickup tied to label printers. — [RunSignup RaceDay](https://info.runsignup.com/?p=165)
- Hudle Partner's India-specific must-haves: GST invoicing, UPI collection, payment links, accounts reconciliation. — [Hudle Partner](https://apps.apple.com/in/app/id1569130632)
- Meetup merged attendee list and check-in into one view with optional QR tickets. — [Meetup help](https://help.meetup.com/hc/en-us/articles/45352992737677-Introducing-the-new-attendee-list-and-QR-code-check-in)
- Ticket Fairy's (vendor) comparison says Townscript was stronger for endurance events needing attendee numbers for timing chip agencies and approval-before-payment. — [Ticket Fairy](https://www.ticketfairy.com/compare/ticketing/townscript-alternatives)
- Townscript status conflict: its own page says "Townscript & Townhall Services Have Been Discontinued" — [Townscript](https://www.townscript.com/organize/attendee-management-software) — while a search found only a G2 reference to a Townhall rebrand and no shutdown news — [G2](https://www.g2.com/products/townscript/competitors/alternatives). Treat Townscript as unreliable benchmark; verify before citing. This also suggests a market gap for Indian organisers.

### Inferences (MVP vs later)
**Organiser**
- MVP: event wizard (basics, categories/tickets, form, pricing, T&C/waiver, publish); registrations table with search/filter/export; custom form fields; QR ticket + scan check-in (offline-tolerant); bib assignment (auto + CSV import); promo codes (percent/flat, caps, expiry, per-category); email/WhatsApp/SMS broadcast to filtered segment; payouts ledger with settlement status and downloadable statements (platform fee, gateway fee, GST); basic sales graph.
- Later: team/group and relay registration, transfers/deferrals self-serve, refunds rules engine, results upload/publishing with timing-chip import, volunteer/staff roles with granular permissions, multi-event series, funnels/UTM attribution, waitlists, add-on merch upsell, label-printer integration, API/webhooks.
**Participant**
- MVP: tickets with QR, registrations list, profile with emergency and medical info, saved events, family/junior profiles with guardian consent, certificates download, results view.
- Later: training log/Strava sync, PR history and badges, transfer/defer ticket, photo galleries, social features.
**Seller**
- MVP: catalogue with variants, orders with status/shipping label, stock counts with low-stock alert, returns/refund requests, payout statements. Later: ads, bulk repricing, shipping aggregator integration, event-linked bundles (race-day packs).
**Coach**
- MVP: profile, certifications upload, batches with price/schedule/location, enquiry inbox, reviews display. Later: calendar sync, online payments and invoicing, client progress tracking, group chats.
**Academy/Club**
- MVP: listing, batches, coaches, member roster (CSV import), fee collection with dues/reminders, attendance marking, event hosting via organiser tools. Later: age-group promotion, fee plans/instalments, kit inventory, parent app, multi-branch.

### Gaps
- No verified India-specific adoption data on which features organisers/academies value most; none of the Indian platforms' (BookMyShow, Playo, Hudle academies, Townscript) full dashboards were reviewed.
- Hudle listings did not mention batches/academy management; unconfirmed whether Playo or Hudle offer batch/fee/attendance tooling.

## 4. How should organiser dashboards handle "search anyone fast, custom registration fields, export" for race directors?

### Takeaway
Treat the participant table as the core race-day product: global instant search (name, bib, email, phone, order ID), saved views/filters, column chooser, per-event custom fields, audit log of changes, and exports tailored to timers, packet pickup and finance.

### Cited Findings
- RunSignup: participant/demographics reports let directors customise columns and export lists for packet pickup, timing, or bib assignment; a participant report answers which entrants lack a bib; a Participant Information Changes report tracks edits by directors, timers or participants; registration reports cover periods, time of day, day of week, revenue by event, per-day counts; saved reports exist. — [RunSignup](https://info.runsignup.com/?p=159), [RunSignup advanced reporting (2024 deck)](https://info.runsignup.com/wp-content/uploads/sites/3/2024/06/Presentation.2024.06.11.RunSignup-University.Advanced-Reporting.pdf), [RunSignup 2026 reporting post](https://info.runsignup.com/2026/05/04/reporting-tools/)
- RunSignup bib tooling: bulk range assignment by event or across events, CSV import for manual assignment, dynamic assignment at pickup, emailing bib or check-in QR code to participants. — [RunSignup features](https://info.runsignup.com/?p=159), [RunSignup RaceDay](https://info.runsignup.com/?p=165)
- RaceRoster: custom registration questions added from settings with optional validation rules; participants can add their own options on multiple-choice questions; multiple custom waivers with merge tags. — [Race Roster question help](https://help.raceroster.com/en-us/knowledge-base/how-to-create-a-custom-registration-question), [Race Roster release](https://raceroster.com/major-releases/new-release-participants-can-create-options-for-custom-questions), [Race Roster waiver help](https://help.raceroster.com/en-us/knowledge-base/hc/en-us/articles/216529063-how-to-add-a-custom-waiver)
- Eventbrite: Check-ins report previews 25 rows before export; reports gated by permission ("Basic reports"). — [Eventbrite help](https://www.eventbrite.fi/help/fi/articles/876912/download-your-check-ins-report)
- Meetup: organisers can search members and add them as attendees, change RSVP status, manage waitlist, and check people in from one list. — [Meetup help](https://help.meetup.com/hc/en-us/articles/9389668230541-Manage-attendees-and-track-attendance-for-your-Meetup-event)

### Inferences (concrete spec)
- **Search:** sticky global search bar (shortcut "/"), type-ahead across name, bib, phone, email, order/ticket ID, team name, with fuzzy match for Indian name spellings and transliteration; results in <300 ms; scan a QR or type a bib to jump to a participant card.
- **Participant card (drawer):** details, custom answers, payment/order, bib, category, T-shirt size, emergency/medical (permissioned), waiver status, check-in status, history/audit trail, actions (resend ticket, edit, transfer, change category, refund, mark kit collected).
- **Table:** columns chooser; saved views (e.g. "Unpaid", "No bib", "Kit not collected", "Minors", "Medical flag"); filters: category/distance, ticket type, payment status, promo code, gender/age group, city/state, club/team, check-in/kit status, registration date range, custom field values; bulk actions (assign bibs, message selection, change category, export selection); pagination with virtual scrolling for 10k+ rows.
- **Custom form builder:** field types (text, number, dropdown, multi-select, checkbox, date, file upload, phone, T-shirt size, blood group, ID proof); per-category visibility and conditional logic; required/optional; validation; reusable sets (medical, emergency, club, T-shirt, guardian consent for minors, Aadhaar/ID proof only if needed — minimise); drag-drop order; locked core fields so exports stay stable; edit-after-sales warnings (changing a field with existing responses).
- **Export:** CSV and XLSX, choose columns, saved templates (Timer, Packet pickup, Finance/GST, Sponsor/T-shirt count, Medical list); async export for big files with email/download link; PII access controlled by team role, with export audit log; separate permission for medical/ID fields.
- **Check-in:** web PWA + mobile scanner, offline-first with later sync; manual search fallback; kit-collection status separate from race-day check-in; duplicate-scan warning; live counters.
- **Bibs:** auto-range per category, bulk CSV import, reserve ranges (elites/sponsors), swap/exchange, bib-less until pickup option.
- **Money:** payout page with status (pending/processing/paid), per-event ledger, fee breakdown, refund/chargeback lines, downloadable statements; settlement after event end is the common pattern.
- **Messaging:** segment-based broadcast reusing the table filters; templates (race kit info, route change, weather).

### Gaps
- Could not read RunSignup's 2026 reporting page in full (403), so saved-report limits and exact export formats are unconfirmed.
- No Race Roster or Eventbrite documentation found on participant search UX specifically.
- No Indian race-director interviews or public Indian-platform dashboards (e.g. for Indian race registration sites) located.
- Payout/settlement timelines in India (Razorpay/Cashfree T+2 etc.) not researched; Eventbrite's payout timings quoted in sources are region-specific (3 business days after an event, or 8-10 for non-US banks) and should not be reused. — [Eventbrite](https://www.eventbrite.fi/help/fi/articles/620300/how-to-see-and-export-itemized-payouts-for-eventbrite-payment-processing/)
