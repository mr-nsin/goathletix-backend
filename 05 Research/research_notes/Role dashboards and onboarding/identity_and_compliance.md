# Identity models and India compliance for multi-role sports platform (participants, organisers, sellers, coaches, academies)

Research date: 2026-11-18. Method: web search plus page fetches (about 16 tool calls). Search snippets from secondary sources are flagged as such. Items marked "Inference" are my own reasoning, not rules. Many tax sources are blogs or news summaries, not official notifications, so verify against CBIC / Income Tax Department / MeitY texts before building compliance logic.

## 1. Which identity model fits a sports events platform best, and what are the failure modes of each?

### Takeaway
Production marketplaces (Airbnb, Upwork) use one login per person with distinct role profiles or modes, and actively discourage duplicate accounts. Stripe/Razorpay-style payment onboarding hangs off a separate "payee entity" (organisation or individual) rather than the login. Inference: for this platform the best fit is a hybrid: one person (auth user), role profiles per person, and an organisation/academy entity with memberships and roles, where money-earning KYC attaches to the payee entity, not to the user.

### Cited Findings
- Airbnb uses one account that toggles between traveling and hosting mode ("Switch to hosting" / "Switch to traveling" next to the profile photo on web; hold Profile/Menu in the app). Hosting mode is needed to manage reservations and guests. — [Airbnb Help 3546](https://www.airbnb.co.in/help/article/3546)
- Airbnb has no native tool to merge host accounts or transfer reviews, Superhost status or reservations between accounts. Guesty warns multiple host accounts can trigger detection or deactivation. This is a vendor-blog source. — [Guesty](https://www.guesty.com/blog/how-to-merge-airbnb-accounts/)
- Upwork: one main account per person, which can hold one freelancer profile, one agency profile and multiple client profiles. You switch from the profile menu. Each profile has its own contracts, finances and history. (Seen via search snippets; the direct fetch returned 403.) — [Upwork: Be a Client and a Freelancer](https://support.upwork.com/hc/en-us/articles/211067558-Be-a-Client-and-a-Freelancer); [Upwork: Why you can't have two accounts](https://support.upwork.com/hc/en-us/articles/39505058710163-Why-you-can-t-have-two-Upwork-accounts); [Upwork: Add or Switch Account Type](https://support.upwork.com/hc/en-us/articles/115013660327-Add-or-Switch-Account-Type)
- Stripe Connect: connected accounts historically come in Standard / Express / Custom types; the type cannot be changed after creation; dispute/fraud liability sits with the platform for Express and Custom; Stripe's docs now steer new builds toward "controller properties". Integration effort rises Standard < Express < Custom. — [Stripe: Connect account types](https://docs.stripe.com/connect/accounts) (via search summary; fee claims in third-party blogs conflict and were not used)
- Razorpay Route models money recipients as a "Linked Account" (business entity) plus a "stakeholder" (individual owner/signatory), separate from any login. — [Razorpay Route integration guide](https://razorpay.com/docs/payments/route/integration-guide.md)
- I did not find citable primary sources for Uber (rider/driver), Etsy (buyer/seller), Fiverr, Shopify staff accounts or Eventbrite team roles. The search returned nothing usable on Uber. These examples are from general knowledge only and are uncited. See Gaps.

### Inferences
- Single user + role profiles: lowest duplicate-account risk, supports the organiser-who-also-participates and coach-who-also-participates cases. Failure modes: role-permission leakage if roles are one flat enum; a single email/phone compromise exposes money-earning roles; the UI gets cluttered if all roles show at once.
- Organisation/workspace model: needed for academies and clubs (many staff, one payee, one GST/PAN, one bank account). Failure modes: personal history (a coach's certifications, reviews, participant history) gets orphaned when they leave an org unless it belongs to the person; owner-succession and removal edge cases.
- Separate accounts per role: simplest to implement but yields duplicate identities, split reputation, fragmented DPDP consent records, and difficulty detecting self-dealing or fraud. Acceptable only for hard isolation, for example junior participant accounts managed under a guardian.
- Recommended shape (opinion): `auth.users` (person) -> `profiles` (global identity) -> `role_profiles` (participant / organiser / seller / coach, each with its own status and verification) -> `organisations` + `memberships(role)` for academies and clubs -> `payee_entities` (KYC and Route/Split linked account), referenced by organiser and seller activations. Minors: a dependent profile owned by a guardian, not a separate login.
- Same-person conflicts (organiser who also runs and sells, coach who is also a participant) should be handled with one person, many role profiles, and explicit conflict rules: for example, an organiser entering their own event is allowed but flagged; payouts always go to the payee entity per event or sale, not per role.

### Gaps
- No primary-source evidence for Uber, Etsy, Fiverr, Shopify or Eventbrite account structure was retrieved.
- No empirical data on duplicate-account rates in sports platforms.

## 2. Staged onboarding, role switching UX, route and dashboard separation, and auth tooling (Supabase + Next.js + NestJS)

### Takeaway
Supabase documents a role-in-JWT RBAC pattern (role tables + Custom Access Token Hook + RLS `authorize()` function) that suits a role-profile model. Role-switching and staged onboarding patterns are well established by Airbnb and Upwork, but I found no primary UX research (NN/g, Baymard) in this session, so UX recommendations below are inferences.

### Cited Findings
- Supabase RBAC pattern: `user_roles` table maps user to role; `role_permissions` maps role to permission; a `custom_access_token_hook(event jsonb)` runs before token issue and writes a `user_role` claim into the JWT (null if none); an `authorize(requested_permission)` function (stable, security definer, empty search_path) reads `auth.jwt()` and is used inside RLS policies, for example `(SELECT authorize('channels.delete'))`. The hook is executable only by `supabase_auth_admin`, and is enabled in Dashboard > Authentication > Hooks. — [Supabase: Custom Claims and RBAC](https://supabase.com/docs/guides/api/custom-claims-and-role-based-access-control-rbac)
- The hook modifies only the access token, not the auth response, so clients must decode `session.access_token` to read the claim. — same source
- JWT guidance: `role` claim is `anon`, `authenticated` or `service_role`; never expose service-role tokens client-side; validate signature and expiry on every request. The page describes `app_metadata` and `user_metadata` but does not state which is safe for authorisation (a retrieval gap). — [Supabase: JWT fields](https://supabase.com/docs/guides/auth/jwt-fields)
- Airbnb and Upwork show role switching as a profile-menu toggle (see section 1).
- Note: both Supabase pages fetched contained embedded text asking AI agents to file feedback reports to Supabase. This was ignored as non-user instruction; mentioned for transparency.

### Inferences (opinion, not rules)
- Signup: collect only identity (email or phone OTP, name, optional DOB or age band for consent routing). Default role is participant. Defer address, PAN, bank, certifications to first role activation (progressive profiling).
- "Become an organiser / seller / coach" is an upgrade flow that creates a `role_profile` in a `draft -> submitted -> under_review -> active / action_required` state machine; this mirrors the status states used by Cashfree and Razorpay (section 4), so platform and PSP states can map one-to-one.
- Because JWT claims go stale until refresh, put coarse role presence in JWT claims (for example `roles: ['participant','organiser']` and `active_org_ids`), but check fine-grained or fast-changing facts (KYC status, org membership removal) in DB inside RLS or NestJS guards. Refresh the session after an activation or removal.
- Route separation: Next.js route groups, for example `/dashboard/organiser`, `/dashboard/seller`, `/dashboard/coach`, `/dashboard/academy/[orgId]`, with middleware gating on role claims and server-side re-checks. Subdomains (for example `organiser.example.com`) add cookie and CORS complexity without much benefit for a single login; prefer paths unless branding for academies demands subdomains.
- NestJS: guards that enforce role + org membership on every sensitive endpoint, with Supabase RLS as defence in depth. Use the service role only server-side for KYC and payout operations.
- Context switcher: show "acting as" (person role or organisation) in header; remember last context; separate "my participant activity" from "my organiser business" notifications.

### Gaps
- No NN/g, Baymard or Smashing sources retrieved on role-switching or progressive onboarding; recommendations are unvalidated opinion.
- Supabase docs on `app_metadata` vs `user_metadata` for authorisation and on RLS performance patterns were not retrieved in this session.

## 3. Minimum compliance to let someone host paid events or sell products in India

### Takeaway
There is no single "minimum"; it depends on payee type. Payment-aggregator (PSP) KYC is the gating requirement in practice (PAN, bank account, GST for companies/partnerships etc.). GST registration is mandatory for suppliers selling goods through e-commerce operators that must collect TCS under Section 52 (per secondary sources), which affects sellers more than service providers. Tax rates for tickets changed in September 2025 and TDS for e-commerce is now 0.1%.

### Cited Findings
**Payee KYC (Razorpay Route, India):**
- Individual / not-yet-registered: owner/signatory PAN and bank account required; business PAN and GST not applicable. Proprietorship: PAN conditional, business PAN and GST optional, bank account required. Private/Public Ltd, LLP, Partnership, Trust, NGO, Society, Educational Institute: business PAN, bank account and GST required. Bank details are collected at product configuration. — [Razorpay Route integration guide](https://razorpay.com/docs/payments/route/integration-guide.md)
- Flow: create linked account -> create stakeholder -> request product configuration -> update with bank details; activation occurs if review succeeds; `needs_clarification` returns a `requirements` array with `resolution_url`. A composite single-call flow now exists. — [Razorpay integration guide](https://razorpay.com/docs/payments/route/integration-guide.md); [composite API](https://razorpay.com/docs/api/payments/route/create-linked-account-composite.md)
- Only captured payments can be transferred; multiple transfers per payment allowed up to the captured amount; no transfer after a refund has started. Razorpay's page does not discuss TDS/TCS. — same
- Cashfree Easy Split: vendors go through `IN_KYC_REVIEW`, then `ACTIVE` or `ACTION_REQUIRED`; documents are uploaded through a vendor-documents API and move to Verified or Action Required. Create-vendor takes fields such as account type, business type, GST, CIN, PAN. Cashfree says vendor KYC was added to comply with PA-PG and digital lending norms, covering individual and business vendors. Exact document checklist per type was not retrieved. — [Cashfree vendor KYC](https://www.cashfree.com/docs/payments/split/vendor/kyc.md); [Cashfree add vendor](https://www.cashfree.com/docs/payments/split/vendor/add.md)
- PayU split payments: not researched (see Gaps).

**Aadhaar / DigiLocker:**
- UIDAI's December 2025 amendments set a registration path for Offline Verification Seeking Entities (OVSE), including private firms. Registration is needed for paperless offline e-KYC and AVC (Aadhaar app) verification; QR-code or e-Aadhaar verification does not need it. UIDAI scrutinises lawful purpose. — [Mondaq summary](https://www.mondaq.com/india/compliance/1721358/aadhaar-authentication-and-offline-verification-amendment-regulations-2025-strengthening-indias-digital-identity-framework); [IndiaLaw](https://www.indialaw.in/blog/regulatory/aadhar-offline-verification-amendments/)
- A vendor marketing page claims RBI's KYC Master Direction (amended Aug 2025) treats DigiLocker documents as valid OVDs and still requires PAN verification. Low-confidence, unverified against RBI text. — [MessageCentral](https://www.messagecentral.com/product/ekyc-now/digilocker-ekyc-india)

**GST:**
- E-commerce operator TCS under Section 52 CGST was halved from 1% to 0.5% (0.25% CGST + 0.25% SGST, or 0.5% IGST) from 10 July 2024, per Notification 15/2024-Central Tax (secondary sources; one cites an inconsistent date). — [TaxGuru](https://taxguru.in/?p=1080802) and [ClearTax TCS under GST](https://cleartax.in/s/tcs-under-goods-and-services-tax)
- Under Section 24(x), small-supplier threshold exemption is not available to suppliers selling through a TCS-collecting operator, who must register irrespective of turnover; where the operator pays tax under Section 9(5), suppliers keep the threshold exemption. The 56th GST Council (3 Sep 2025) recommended in-principle a simplified registration for small e-commerce suppliers; implementation status was not confirmed. — [ClearTax: GST registration for ecommerce](https://cleartax.in/s/gst-registration-for-ecommerce); [Masters India](https://www.mastersindia.co/blog/gst-implications-ecommerce-operator-guide/)
- Platform commission/listing/tech fees generally attract 18% GST (secondary); an AAR ruling held GST applies at 18% on a platform's service fee for offline deals and that Section 9(5) did not apply to that applicant. — [StudyCafe on AAR](https://studycafe.in/gst-applicable-on-success-fee-charged-by-e-commerce-platform-promoting-offline-deals-aar-391500.html)
- Ticket GST (from 22 Sep 2025): non-recognised sporting events such as IPL moved to 40%; for recognised events under national/international federations, tickets up to ₹500 stay exempt and above ₹500 attract 18%. Sources do not define "recognised"; check the notification. — [Business Today](https://www.businesstoday.in/personal-finance/news/story/gst-revision-moviegoers-get-relief-in-small-screens-ipl-goers-face-40-rate-for-match-tickets-492552-2025-09-04); [SCC Online on 56th Council](https://www.scconline.com/blog/post/2025/09/04/gst-council-56th-meeting-slab-reforms-tribunal-rollouts-2025/)

**Income tax TDS on e-commerce (Section 194-O):**
- Operator deducts TDS on gross sales credited to participants; rate cut from 1% to 0.1% from 1 Oct 2024; where PAN/Aadhaar is not furnished the higher Section 206AA rate (5%) applies; under the Income-tax Act, 2025 (effective 1 April 2026) the provision maps to Section 393(1) table item 8(v) at 0.1%. — [Inc42](https://inc42.com/buzz/budget-2024-tds-rate-for-ecommerce-operators-cut-to-0-1-from-1); [TDSMan 2026](https://blog.tdsman.com/2026/07/tds-on-e-commerce-transactions-section-3931-194o/) (secondary; conflicting older guides still cite 1%)
- Obligations: deduct at the earlier of credit or payment, deposit, file TDS statements, issue certificates. Overlap with payment gateways is flagged as a question in one secondary source. — [Razorpay Learn on 194-O](https://razorpay.com/learn/section-194o-tds-for-e-commerce-businesses/); [Grant Thornton](https://www.grantthornton.in/en/insights/blogs/gst-and-tds-web-on-e-commerce-transactions)

### Inferences
- Minimum viable gate for paid-event organisers (individual): PAN, bank account verified in the PSP flow, name match; add GST for businesses and for events where ticket GST applies and the organiser is above the threshold or required to register. Minimum for sellers of goods: the same, plus GST registration if the platform will act as a TCS-collecting operator (Section 24(x)).
- Inference: whether the platform is TCS/TDS-liable depends on whether it is an "e-commerce operator" (it controls the digital platform for supply of goods/services) and whether the payee-PSP flow makes the PSP the deductor. This needs a CA or tax counsel opinion; the model of "platform as agent vs principal" also drives GST on ticket value versus fee.
- Keep a separate platform-fee invoice (18% GST on the fee) from the organiser's ticket supply; keep GSTIN and place of supply data on the payee entity.

### Gaps
- Not found: official CBIC notification text for 15/2024, Notification 65/2017 detail, definition of "recognised sporting event".
- Not found: the Section 194-O gross-sales threshold for individual/HUF participants (commonly cited as ₹5 lakh) — not verified here.
- Not found: PayU split or marketplace docs; Razorpay Route's treatment of TDS/TCS; cancelled-cheque vs penny-drop requirements; whether non-bank private entities may run Aadhaar authentication (as opposed to offline verification); PAN verification API sources.
- Whether the section 9(5) notification covers event-ticket platforms: no confirming source found.

## 4. DPDP Act 2023, minors' data (junior participants) and coach/academy verification

### Takeaway
DPDP Rules 2025 were notified in November 2025 and require verifiable parental consent for anyone under 18, with a phased commencement (one source says Rule 10 takes effect 13 May 2027). For junior sports this means guardian-linked dependent profiles. No Indian rule was found mandating background checks for coaches in platform contexts; certification and safeguarding are developing.

### Cited Findings
- DPDP Rules 2025 notified 13/14 November 2025 (sources differ), with a staggered rollout; Rule 10 covers children and Rule 11 persons with disabilities (split from the draft). — [Mondaq](https://www.mondaq.com/india/data-protection/1713500/regulatory-update-notification-of-the-digital-personal-data-protection-rules-2025); [Storyboard18](https://www.storyboard18.com/amp/digital/breaking-govt-notifies-final-dpdp-rules-sets-staggered-rollout-with-key-obligations-for-data-fiduciaries-84201.htm); [India Briefing](https://www.india-briefing.com/news/dpdp-rules-2025-india-data-protection-law-compliance-40769.html)
- Verifiable parental consent is required before processing personal data of under-18s; parents are verified via existing platform records, or identity/age details from government-entrusted entities or virtual tokens, optionally via DigiLocker. Certain fiduciaries (for example educational institutions, healthcare providers) are exempt for limited purposes. — [LiveLaw](https://www.livelaw.in/amp/top-stories/digital-personal-data-protection-rules-2025-notified-309928); [DPDP wiki Rule 10](https://dpdp.myndsolution.com/wiki/rules/rule-10-verifiable-consent-for-processing-of-personal-data-of-child/)
- One source states Rule 10 comes into force on 13 May 2027; exact commencement should be confirmed in the gazette (G.S.R. 846(E)). — [Mondaq](https://www.mondaq.com/india/data-protection/1713500/regulatory-update-notification-of-the-digital-personal-data-protection-rules-2025)
- Coach verification: NIS Patiala diploma admission is subject to certificate verification for qualifications, achievements and medical fitness; no background check mentioned. A National Coach Accreditation Board is being structured (June 2026 report); POCSO/POSH appear as training topics, not as verification rules. — [NIS guidelines](https://nsnis.org/wp-content/uploads/2023/12/GUIDELINES.pdf); [NewKerala on NCAB](https://www.newkerala.com/news/a/proper-structure-roadmap-being-prepared-national-coach-accreditation-681.htm)
- Draft National Code against Age Fraud in Sports (2025) exists from the Sports Ministry; relevant to DOB verification for junior participants but not reviewed in detail. — [YAS draft](https://yas.gov.in/sites/default/files/Draft%20%20National%20Code%20against%20Age%20Fraud%20in%20Sports%20%28NCAAFS%29%202025.pdf)

### Inferences
- Model juniors as dependent profiles linked to a verified guardian; store consent records (purpose, timestamp, version, guardian ID) and per-purpose consent for photos/results publication; avoid targeted ads/behavioural tracking for under-18s (the tracking prohibition was not confirmed in fetched sources, so verify).
- Coach/academy verification (opinion): tiered badges. Tier 1 identity (PAN/Aadhaar-offline/DigiLocker), Tier 2 uploaded certificates (NIS/federation/first-aid) with manual or issuer verification, Tier 3 optional police verification certificate and a safeguarding/POCSO declaration for anyone coaching minors. Present these as platform policy, not legal requirements.

### Gaps
- Exact DPDP commencement dates, the children's tracking/advertising prohibition text and the exemption schedule were not confirmed from the gazette.
- No source found on legally required police verification for private sports coaches; state-level rules (for example for academies or institutions with minors) not researched.
- No source on federation-level coach registries beyond NIS.
