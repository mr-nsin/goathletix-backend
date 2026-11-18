# BookMyShow: consumer vs organiser/partner role separation

Access note: in.bookmyshow.com blocked automated fetching (WebFetch refused), so BookMyShow's own organiser pages (list-your-show, partner pages, T&Cs) could NOT be read directly. Much of the organiser-side detail below comes from secondary sources (mainly a competitor's comparison page, which is marketing material). No login, account creation or form submission was done.

## Which links lead to organiser/partner pages, and how different are they from the consumer flow?

### Takeaway
The organiser entry point is a separate "list your show" / "Partner with us & get listed" page, reported at in.bookmyshow.com/list-your-show. It is a contact/enquiry funnel rather than a self-serve console. Exact footer links and visual differences could not be verified.

### Cited Findings
- Organiser page is reported to live at in.bookmyshow.com/list-your-show — [Slashdot profile](https://slashdot.org/software/p/BookMyShow/) (as relayed by search summary; not directly verified)
- The organiser page heading is reported as "Partner with us & get listed on BookMyShow"; no organiser plans or prices are published — [Ticket Fairy comparison (competitor)](https://www.ticketfairy.com/compare/ticketing/bookmyshow-vs-district)
- BookMyShow's public help centre (Freshdesk) has NO partner/organiser category; its categories are consumer-only (cancellation/refund, Stream, BMS Cash, Gift Card, Offers, Filmy Pass, Verified Tickets, etc.) — [BookMyShow help centre](https://bookmyshow.freshdesk.com/support/solutions)
- BookMyShow states that listing or delisting a show is the organiser's/venue's decision and it only provides a ticket-sales platform (Kunal Kamra dispute) — [Outlook India](https://www.outlookindia.com/national/bookmyshow-rejects-kunal-kamras-claims-says-it-is-organisers-decision-to-list-or-delist)
- Cinema partners use a separate iOS app "BookMyShow Partner" (developer Bigtree Entertainment Pvt. Ltd.), access "restricted to only BookMyShow Cinema Partners" — [App Store](https://apps.apple.com/us/app/-/id1336023106)

### Inferences
- Roles are split by product/entry point: consumer web/app vs a sales-assisted enquiry page vs invite-only partner apps (cinema). Organisers do not appear to share the consumer UI.

### Gaps
- Footer link labels/URLs for corporate/partner pages, "BookMyShow Stream" or "Corporate" pages: not verified (site blocked).
- Visual/behavioural differences between organiser page and consumer flow: not verified.

## Consumer profile and post-login experience

### Takeaway
Consumer account is phone/email based with a profile, order history, BMS Cash wallet, gift cards, offers and loyalty-points. Details of the profile page layout were not directly viewable.

### Cited Findings
- Help topics cover "My Profile" in the app, deleting an account, changing registered email, registration benefits; booking/refund queries are checked under Profile > Purchase History — [BookMyShow help centre](https://bookmyshow.freshdesk.com/support/solutions)
- Wallet: BMS Cash (add money, balance, use on app/web; refunds can go to BMS Cash instantly); also Gift Card, Pay Later (LazyPay) — [help centre](https://bookmyshow.freshdesk.com/support/solutions)
- No dedicated rewards category; related: Offers, Winpins, Filmy Pass, BookMyShow Play Credit Card; loyalty reward points exist (returned as points when a listed ticket is refunded) — [help centre](https://bookmyshow.freshdesk.com/support/solutions); [Marketplace article](https://bookmyshow.freshdesk.com/support/solutions/articles/4000225692-how-do-i-list-my-tickets-)
- M-tickets are viewable after login (QR shown at venue); Profile leads to "Your Orders" — [M-ticket FAQ](https://bookmyshow.freshdesk.com/support/solutions/articles/4000188966-information-on-m-ticket)
- Consumers can resell Live Event tickets: Your Order > List on Marketplace; whole booking listed; original payment refunded to source — [help article](https://bookmyshow.freshdesk.com/support/solutions/articles/4000225692-how-do-i-list-my-tickets-). Consumers can thus act as "sellers" within the same consumer account (face-value resale) — [Ticket Fairy](https://www.ticketfairy.com/compare/ticketing/bookmyshow-vs-district)

### Inferences
- Resale is a consumer-account feature, not a separate seller role.

### Gaps
- Phone/OTP signup steps: no BookMyShow-specific source found (search returned only other products). Not verified.

## Organiser onboarding (lead form vs self-serve vs sales-assisted) and verification

### Takeaway
Reported as sales-assisted: organiser submits an enquiry/proposal and BookMyShow replies after evaluation. No public documentation of documents, KYC or agreements was found.

### Cited Findings
- Organisers do not self-sign-up; they request a listing and the team replies "within 24-48 working hours post evaluating your proposal" — [Ticket Fairy (competitor)](https://www.ticketfairy.com/compare/ticketing/bookmyshow-alternatives)
- BookMyShow says it supports an event from registration to completion; services listed: on-ground support, gate entry management, POS, RFID, turnstiles, online sales/marketing, reports and business insights — [Ticket Fairy](https://www.ticketfairy.com/compare/ticketing/bookmyshow-vs-district)
- BookMyShow collects payment on behalf of organiser/cinema (unofficial profile description; low reliability) — search summary of third-party profile, unverified
- 2017: BookMyShow partnered with ClearTax to help cinemas and organisers with GST registration/returns — [Business Standard](https://business-standard.com/article/news-ani/bookmyshow-cleartax-associate-to-help-partners-get-gst-ready-117062900774_1.html)
- Operating entity: Bigtree Entertainment Pvt. Ltd. (ticketing); Bookmyshow Live Pvt. Ltd. holds multiple state GSTINs under PAN AAGCN1458E — [KnowYourGST](https://www.knowyourgst.com/gst-number-search/bookmyshow-live-private-limited-27AAGCN1458E1ZJ)

### Inferences
- GST/PAN/bank details and an agreement are almost certainly collected in a sales-led process (standard for Indian ticketing, GST on event services is 18% under SAC 998596 per [AuthBridge](https://authbridge.com/knowledge-centre/insights/gst-event-management-services)), but this is NOT confirmed by any BookMyShow source.

### Gaps
- Required documents, agreement terms, approval criteria, commission/fee rates, payout timing: not found publicly.
- Whether organisers and consumers are separate accounts: not stated in any source found; the cinema Partner app being restricted suggests separate partner credentials, unverified for live-event organisers.

## Organiser/partner dashboard (sales, settlements, scanning)

### Takeaway
Public evidence: a cinema-partner sales-tracking app, a venue ticket-scanner app, and generic "reports and business insights" for live events. Settlement/payout views are undocumented.

### Cited Findings
- BookMyShow Partner app: real-time ticket sales and revenue, show-wise and movie-wise monitoring, seat-level details, movie performance; latest versions 1.1.3 (10/15/2025) — [App Store](https://apps.apple.com/us/app/-/id1336023106). One review complains of "high commission".
- BookMyShow Access Point app (Bigtree): scans M-Tickets, built for cinema staff; supports split tickets and multi-session bookings; needs a "connection string"; last listed version 1.3.8 (2019), rating 2.9/5, support support@bigtree.in — [App Store](https://apps.apple.com/in/app/id1059988231)
- Live-event check-in: a May 2025 capture describes a browser-based scanning app (no download), exit scanning, QR from shared M-ticket link — [Ticket Fairy](https://www.ticketfairy.com/compare/ticketing/bookmyshow-vs-district) (secondary)
- Venue scanning hardware: Famoco rugged devices used for ticket validation — [case study](https://www.casestudies.com/company/famoco/case-study/improve-your-mobile-deployment-for-a-better-management)

### Gaps
- Live-event organiser dashboard contents (inventory, buyer data export, settlements/payouts): not found.
- Separate exhibitor/venue portal URL: not found.

## Sports / run events, and other seller/venue/influencer experiences

### Takeaway
Little verifiable detail. BookMyShow historically sold race registrations (2016) but no current organiser listing flow for sports/runs was found.

### Cited Findings
- 2016: BookMyShow handled registrations for The Great India Run (5K/half marathon) — via search summary of a news article (source not directly opened; unverified)
- Competitors (Insider, others) host many Indian run events; none of the run listings found used BookMyShow — [Insider example](https://insider.in/delhi-heroes-half-marathon-aug31-2025/event)

### Gaps
- Sports/Experiences category onboarding, merchandise/F&B seller, influencer/affiliate programs: nothing found.
- Play Store listings for partner/scanner apps: not verified (only App Store pages seen).
