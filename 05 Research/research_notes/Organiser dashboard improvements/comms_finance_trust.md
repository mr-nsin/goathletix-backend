# Organiser dashboard (India): communications, finance, team permissions, alerts, trust and safety

Research date: 2026-11-18. Public sources only. About 16 tool calls. Search results were mostly vendor or law-firm secondary sources; official primary pages were fetched where possible (WhatsApp policy, KonfHub help, Supabase docs via search). Nothing here is legal or tax advice. Items marked [CA/LAWYER] need professional confirmation.

Blocked or weak pages: ClearTax GST-on-sporting-events returned HTTP 410. Official TRAI, CBIC, MeitY gazette PDFs and the Meta rate card were not directly fetched, so those points rest on secondary sources. Stripe, Shopify and RunSignup/Eventbrite organiser reporting and email-segment features were not retrieved (search returned only race-level policy pages and payout/refund help pages).

## Q1. Which communications, finance and permission features are MVP, and which should wait?

### Takeaway
Competitor evidence shows the finance basics organisers actually rely on are: a per-settlement-cycle breakdown (gross, platform and gateway fee, net), a GST-invoice toggle, organiser-controlled refund policy with bulk refund, and bank details. Comms and permission MVP is an inference from these plus compliance constraints, not a sourced competitor feature list.

### Cited Findings
- KonfHub settles weekly: transactions Monday 00:00 to Sunday 23:59 are settled the following Thursday. The settlement view shows gross collected, KonfHub and gateway fees, and net payout per cycle. Bank details sit under Event Dashboard, Payments & Taxes. An older post mentions on-demand settlement that may not apply to all accounts. — [KonfHub payments and settlements](https://konfhub.com/payments-settlements); [KonfHub bank details](https://help.konfhub.com/payments/india/bank-details); [KonfHub settlements blog](https://blog.konfhub.com/simplified-event-finances-secure-payments-transparent-settlements-with-konfhub)
- KonfHub: GST invoices toggle in Taxes & Charges; attendees can enter a GSTIN at checkout and a GST-compliant invoice is generated; organiser sets GST number, rate, invoice prefix and starting number; organiser chooses whether tax is inclusive (organiser bears) or added on top (attendee bears). The platform does not remit GST for the organiser. — [KonfHub GST invoices](https://blog.konfhub.com/automatically-issuing-gst-invoices-in-konfhub); [KonfHub tax and charges](https://help.konfhub.com/payments/india/tax-and-charges.md)
- KonfHub processing fee setting covers both platform fee and gateway fee, and can be absorbed by organiser or passed to attendee. The page does not state whether GST applies to the platform fee or give fee percentages. — [KonfHub tax and charges](https://help.konfhub.com/payments/india/tax-and-charges.md)
- KonfHub refunds: return to source payment mode; for cancellations the organiser decides whether GST is refundable or forfeited, fully or partially; organiser chooses whether processing fees and taxes are included; refunded processing fees are deducted from the organiser's settlement; bulk refunds limited to paid plans. — [KonfHub bulk refunds](https://blog.konfhub.com/bulk-ticket-refunds-are-here-refund-multiple-participants-in-just-a-few-clicks); [KonfHub payments](https://konfhub.com/payments-settlements)
- Eventbrite: organiser sets refund policy; for cancelled events organisers must refund all attendees and Eventbrite can refund and bill the organiser; payouts are held on cancel or postpone so refunds can be processed; standard payout is about three (business) days after the event ends or a custom schedule; schedule changes apply account-wide. Sources are regional and differ on response windows (7 days vs 5 business days). — [Eventbrite payment processing help](https://www.eventbrite.com/help/en-us/articles/426093/); [Eventbrite cancelled event policy](https://www.eventbrite.com/help/en-us/articles/724340/); [Eventbrite postponed event policy](https://www.eventbrite.com/help/en-us/articles/169121/)
- RunSignup race pages show organiser-configured tiered refunds (e.g. 80% at one year out down to 20% at 14 days, excluding platform fees), transfer requests (original registrant refunded once new registrant pays, possibly with a transfer fee), deferral via the registrant's Manage Registration, and cancellation outcomes (refund, or move to virtual option). These are individual race policies hosted on RunSignup, not RunSignup's own rules. — [RunSignup example refund policy](https://runsignup.com/Race/18798/RefundPolicy); [RunSignup refund/defer example](https://runsignup.com/Race/ColumbiaClassic10K/Page/Refund-Defer-Policy)

### Inferences
- Finance MVP: per-event sales summary; settlement ledger (gross, platform fee, gateway fee, GST on fees, refunds, net); CSV export; GST toggle with GSTIN capture and invoice numbering; bank/KYC status; organiser-configurable refund policy with tiered date windows; single and bulk refund; payout-hold visibility. Promo codes and early-bird tiers are standard but this research found no India-specific source on them; treat as product-standard, not sourced.
- Comms MVP: transactional email (confirmations, reminders, event updates) plus organiser broadcast email to registrants with simple segments (by category, paid/unpaid or incomplete, checked-in). Defer WhatsApp and SMS broadcasts, scheduled sends, A/B templates, delivery analytics dashboards, and abandoned-registration automation until DLT/WABA onboarding and consent capture are in place.
- Permissions MVP: owner, admin, finance, check-in, read-only with per-event scope; invite by email; audit log for exports, refunds, payout bank changes and role changes. SSO and enforced org-wide 2FA can wait; offer optional 2FA for owner/finance.
- Wait: transfers and deferrals as self-service flows (can be organiser-initiated refund-and-rebook at first), chargeback tooling, marketplace-style multi-organiser split settlement if not needed at launch.

### Gaps
- No sourced competitor feature matrix for Stripe, Shopify, RunSignup race director reports or Eventbrite email segmentation; those pages were not retrieved.
- No source found on promo code or early-bird tier mechanics for India platforms.

## Q2. Which India-specific rules affect each, and what remains unverified?

### Takeaway
Rules found: DLT registration and template whitelisting for SMS; WhatsApp requires recipient opt-in and approved templates outside the 24-hour window, with per-message pricing since July 2025; GST at 0%/18%/40% by ticket category with 0.5% GST TCS on e-commerce operators; income-tax TDS 0.1% for e-commerce operators; DPDP Rules notified 14 Nov 2025 with most substantive duties (including children's consent) starting about May 2027. Many specifics are unverified against primary text.

### Cited Findings

#### WhatsApp
- Meta policy: you may message only people who provided their number and gave opt-in permission; you are responsible for the opt-in method meeting applicable law and notices; best practice is separate opt-in per message category, clear opt-out, and honouring block/stop requests. — [WhatsApp Business messaging policy](https://whatsappbusiness.com/hi/policy/)
- Outside the 24-hour customer service window, conversations can start only with approved templates; Meta can review, approve or reject a template at any time; user blocks/reports can reduce a business's messaging limits. — [WhatsApp Business messaging policy](https://whatsappbusiness.com/hi/policy/)
- Policy says not to share or request personal ID numbers, financial account numbers or full card numbers, and not to use WhatsApp to send or request health information where law restricts it. — [WhatsApp Business messaging policy](https://whatsappbusiness.com/hi/policy/)
- Pricing moved to per-message billing from 1 July 2025 (marketing, utility, authentication; service replies in window free). A vendor lists India at about 0.86 INR marketing and 0.13 INR utility/authentication, another gives marketing about 0.78 INR; vendors also say India rates changed on 1 Jan 2026 and 1 Oct 2026. Rates conflict, so check the Meta rate card. — [Meta pricing docs](https://developers.facebook.com/docs/whatsapp/pricing); [MyOperator summary](https://support.myoperator.com/portal/en/kb/articles/whatsapp-has-shifted-to-per-message-pricing-effective-july-1-2025-based-on-message-categories-and-your-recipient-s-country-in-india-there-are-three-paid-categories)

#### SMS / TRAI DLT
- DLT requires registering entity, sender ID (header), consent and templates; each approved template gets a template ID; scrubbing checks messages against DND; repeated non-compliance can lead to sender ID blacklisting. — [WebEngage DLT guide](https://docs.webengage.com/docs/trai-sms-dlt-regulations-india); [MSG91 DLT scrubbing rules](https://msg91.com/help/dlt-registration-in-india/dlt-template-scrubbing-filtering-rules)
- Vendor-reported 2025 TCCCPR amendments: header suffixes (-P, -S, -T, -G) live from 6 May 2025, Service Explicit category discontinued, time-window limits for non-consented promotional-type messages (10:00 to 21:00 reported). Unverified against TRAI text. — [MessageCentral India guideline](https://www.messagecentral.com/sms-guideline/india) (vendor, conflicting in places)

#### Email deliverability
- No source retrieved. SPF/DKIM/DMARC and bulk-sender rules (Gmail/Yahoo) were not researched. Treat as gap.

#### GST on tickets and fees
- Secondary sources (dated up to Oct 2026): admission to recognised sporting events up to 500 INR exempt; above 500 INR 18%; premium events such as IPL 40%. Ancillary supplies have their own treatment. The page does not address marathon or run participation fees. — [TaxAJ sports GST](https://www.taxaj.com/learn/gst-sports-fitness-coaching-services/); [Business Today on 40% IPL GST](https://www.businesstoday.in/personal-finance/tax/story/ipl-tickets-hit-with-40-gst-watching-cricket-now-costs-like-a-luxury-heres-what-you-pay-now-492413-2025-09-03)
- Registration threshold for service suppliers: 20 lakh INR turnover (10 lakh in special category states); reverse-charge liability triggers registration regardless. — [TaxAJ sports GST](https://www.taxaj.com/learn/gst-sports-fitness-coaching-services/)
- Platform/booking fee under SAC 998554 reported at 18% by one advisory guide; secondary only. — [Business Today / ClearTax coverage, search summary](https://www.businesstoday.in/personal-finance/tax/story/ipl-tickets-hit-with-40-gst-watching-cricket-now-costs-like-a-luxury-heres-what-you-pay-now-492413-2025-09-03)

#### TCS / TDS
- GST TCS under Section 52 CGST: rate reduced from 1% to 0.5% (0.25% CGST + 0.25% SGST, or 0.5% IGST) by Notification 15/2024-Central Tax, effective 10 July 2024 per secondary sources; some sites still show 1%. Applies when the operator collects consideration on behalf of other suppliers; not where the operator is just an agent; reported in GSTR-8, and the supplier sees it in GSTR-2A/ledger. — [TaxGuru on rate reduction](https://taxguru.in/goods-and-service-tax/cgst-e-commerce-operator-tcs-collection-rate-reduced-0-25-percent.html); [ClearTax GST TCS](https://cleartax.in/s/tcs-under-goods-and-services-tax)
- Income-tax TDS on e-commerce operators (old s.194-O) cut from 1% to 0.1% from 1 Oct 2024, applicable with PAN; from 1 April 2026 the Income-tax Act 2025 applies and references move to the new section numbering (Section 393 reported). — [Inc42](https://inc42.com/buzz/budget-2024-tds-rate-for-ecommerce-operators-cut-to-0-1-from-1); [TDSMAN on 194O](https://blog.tdsman.com/2025/03/section-194o-tds-on-payments-by-e-commerce-operators-to-participants/)

#### Payout holds until KYC
- Razorpay Route: transfers can be held via `on_hold` with optional `on_hold_until`; linked account KYC collects business and bank details and a nominal transfer verifies the bank account; transfers allowed only on successful validation; webhook `product.route.under_review` signals verification in progress. No doc found tying pending KYC to automatic `on_hold`. — [Razorpay Route modify hold](https://razorpay.com/docs/api/payments/route/transfers/modify-settlement-hold/); [Razorpay linked accounts](https://razorpay.com/docs/payments/route/linked-account?preferred-country=IN)
- Cashfree Easy Split: vendor onboarding statuses (document not shared, in review, Action Required); "On-hold" status set by Cashfree when documents are missing; merchants can block/unblock vendor settlements; schedule set at onboarding and editable; Deferred Settlement API sets eligibility date per order and vendor. Interaction between hold status and schedule not documented in results. — [Cashfree vendor KYC](https://docs.cashfree.com/docs/vendor-kyc); [Cashfree add vendor](https://docs.cashfree.com/docs/easy-split-add-single-vendor); [Cashfree Easy Split FAQ](https://www.cashfree.com/docs/payments/split/faq)

#### DPDP
- Rules notified 13/14 Nov 2025 (G.S.R. 846(E)); Rules 1, 2, 17 to 21 effective on publication; Rule 4 (consent managers) on a later notified date; Rules 3, 5 to 16, 22, 23 eighteen months after publication (about May 2027). Sources differ by a day on the notification date. — [SCC Online](https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/); [Mondaq/Lakshmikumaran](https://www.mondaq.com/india/data-protection/1707452/digital-personal-data-protection-rules-2025-incremental-tweaks-and-the-way-ahead)
- A secondary source claims the Data Protection Board had not yet been constituted as of early 2026; unverified. — [MessageCentral India guideline](https://www.messagecentral.com/sms-guideline/india)

### Inferences
- Treat DPDP-grade consent as the design target now even though substantive duties start about May 2027: separate, purpose-specific, withdrawable consent per channel; store consent records (timestamp, text version, channel).
- WhatsApp and SMS broadcasts need a recorded opt-in per channel; do not reuse a bundled T&C tick-box. Do not send medical details or ID numbers over WhatsApp.
- Because a platform that collects money for organisers may be an e-commerce operator, the platform may carry GST TCS and income-tax TDS duties and must show them on organiser statements. Whether the platform's model (agent vs principal, collecting via Route/Easy Split) triggers s.52 or s.9(5) is an open legal question. [CA/LAWYER]
- Finance screens should model: ticket GST, platform fee GST, TCS deducted, TDS deducted, gateway fee, refunds, net. Exact lines depend on CA advice.

### Gaps
- Email deliverability requirements for India not researched.
- Official TRAI/DLT text, CBIC notification text, and Meta rate card not fetched; values above come from secondary sources.
- Whether a marathon or run entry fee is "admission to a sporting event" or another service category: not resolved. [CA/LAWYER]
- Whether GST on platform fee is 18% and who is the supplier when a platform charges organisers: only a secondary mention.
- Chargeback handling and dispute SLAs for Razorpay/Cashfree not researched.
- What Stripe and Shopify show on organiser finance screens: not researched.
- Exact interaction of KYC state and settlement hold in Razorpay Route and Cashfree Easy Split: undocumented in results; confirm with provider support.

## Q3. What audit and access-control design is proportionate for Supabase + NestJS?

### Takeaway
Supabase documents a pattern of a Postgres Auth Hook adding a role claim to the JWT that RLS policies read via an `authorize` function. For a small team, that plus a NestJS-written append-only activity log is proportionate. Trigger-based and pgAudit approaches are options, but no official Supabase guide combining them was found.

### Cited Findings
- Supabase RBAC guide: use an Auth Hook to add a custom claim (e.g. `user_role`) to the JWT, then check it in RLS through an `authorize` function; grant hook execution to `supabase_auth_admin` and revoke from `authenticated`, `anon`, `public`. — [Supabase RBAC docs](https://supabase.com/docs/guides/auth/custom-claims-and-role-based-access-control-rbac)
- Claims are not updated automatically; a user may need to re-login after a role change. — [Supabase custom claims (community repo)](https://www.github.com/supabase-community/supabase-custom-claims)
- RLS is layered over Postgres privileges (privileges decide whether an operation is allowed; RLS decides which rows). — [WZ-IT Supabase RLS audit](https://wz-it.com/en/knowledge/supabase/audit-rls/) (community)
- DPDP Rule 8 (as summarised): retain logs for at least one year from processing; processors follow the fiduciary's deletion instructions; notify individuals at least 48 hours before deletion. — [SCC Online](https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/)
- Eventbrite and KonfHub do organiser-side controls on refunds and payouts (organiser decides refund inclusions; payout hold on cancellation). — [Eventbrite cancelled event policy](https://www.eventbrite.com/help/en-us/articles/724340/); [KonfHub payments](https://konfhub.com/payments-settlements)

### Inferences
- Roles: owner (all, billing/bank, delete event), admin (event config, comms, team invites except owner), finance (payouts, refunds, invoices, exports of finance data), check-in (check-in and limited attendee view only), read-only. Membership table `(org_id, event_id nullable, user_id, role)` gives per-event scope; null event_id means org-wide.
- RLS on every tenant table keyed by membership; put role in JWT via Auth Hook for cheap checks, but re-verify role server-side in NestJS guards for sensitive actions (refund, export, bank change) because stale JWT claims persist until refresh.
- Activity log: append-only table written by NestJS service (actor, org, event, action, target, IP, user agent, before/after summary, timestamp), no UPDATE/DELETE for app roles. Log at minimum: exports, refunds, payout/bank changes, role changes and invites, attendee data views of medical or emergency fields, consent/permission changes, deletions. Retain at least one year per DPDP Rule 8 as summarised; confirm with counsel. [CA/LAWYER]
- Database triggers for audit are a good backstop for finance tables; pgAudit is probably excessive for MVP except for DDL and connection events.
- Defer SSO/SAML; offer TOTP 2FA, mandatory for owner and finance roles when feasible.

### Gaps
- No official Supabase source on audit-log patterns or pgAudit use on the hosted platform in these results.
- SSO/2FA expectations among Indian organiser platforms: no sourced evidence.

## Q4. Notifications and alerts for organisers (D)

### Takeaway
No sourced competitor evidence on organiser alert catalogues was retrieved. Recommendations below are inferences from the finance and payout findings.

### Cited Findings
- Razorpay emits a `product.route.under_review` webhook for linked-account verification, and Cashfree exposes vendor KYC statuses (including Action Required and On-hold), which can drive payout/KYC alerts. — [Razorpay linked accounts](https://razorpay.com/docs/payments/route/linked-account?preferred-country=IN); [Cashfree vendor KYC](https://docs.cashfree.com/docs/vendor-kyc)
- Eventbrite holds payouts on cancelled or postponed events and requires timely refund handling. — [Eventbrite cancelled event policy](https://www.eventbrite.com/help/en-us/articles/724340/)

### Inferences
- MVP alerts (email, in-app): new registration daily digest (not per-registration email), capacity at 80%/95%/sold out per category, payment failed spike, refund requested/processed, KYC status change or action required, payout scheduled/paid/held, team invite/role change. Defer WhatsApp/SMS alerts to organisers.
- Batch to avoid noise; let each role choose which alerts they receive.

### Gaps
- No competitor evidence on alert defaults; abandoned-registration recovery metrics not researched.

## Q5. Trust and safety: medical and emergency data, minors, retention, exports, data ownership (E)

### Takeaway
DPDP Rule 10 requires verifiable parental consent for children's data (using reliable identification, with digital locker and government platforms usable), with narrow Fourth Schedule exemptions; substantive duties start about May 2027. Ownership roles (fiduciary vs processor) between organiser and platform were not researched and need legal drafting.

### Cited Findings
- Rule 10: collect consent from a parent or guardian using reliable identification, verify parent age and identity, robust authentication; digital locker and other authorised government platforms may be used. — [SCC Online](https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/)
- Rule 12 and Fourth Schedule switch off verifiable consent and the ban on tracking, behavioural monitoring and targeted advertising for specified classes (e.g. healthcare establishments, educational institutions, crèches, school transport) and specific purposes; exemptions are narrow and tied to purpose. Sources differ on the healthcare scope; rule numbering differs between draft and final. — [Storyboard18](https://www.storyboard18.com/digital/dpdp-rules-carve-out-key-exemptions-for-healthcare-providers-schools-and-childcare-services-processing-childrens-data-84208.htm); [DPDP Wiki Schedule 4](https://dpdp.myndsolution.com/wiki/rules/schedule-4-classes-of-data-fiduciaries-in-respect-of-whom-provisions-of/)
- Rule 8: delete data once purpose is fulfilled unless law requires retention; 48 hours' notice before deletion; logs retained at least one year. — [SCC Online](https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/)
- Breach: affected principals notified without delay and the Board notified promptly with later updates (the source did not state a 72-hour figure). — [SCC Online](https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/)
- WhatsApp policy discourages sharing health information and ID numbers over the channel. — [WhatsApp Business messaging policy](https://whatsappbusiness.com/hi/policy/)
- KonfHub states the organiser, not the platform, is responsible for event taxes — an example of allocating responsibility between organiser and platform. — [KonfHub GST invoices](https://blog.konfhub.com/automatically-issuing-gst-invoices-in-konfhub)

### Inferences
- A sports-event platform is unlikely to fit the Fourth Schedule exemptions; plan for verifiable parental consent for under-18 participants (age 18 is the child threshold in the Act, from training knowledge, not verified in these results) and avoid behavioural tracking or targeted ads on minors. [CA/LAWYER]
- Role split is probably organiser as data fiduciary and platform as processor for event participant data, with the platform a fiduciary for its own account data; this must be set in terms and a DPA. Not sourced. [CA/LAWYER]
- Medical and emergency data: collect only what the organiser needs, make fields separately permissioned (hidden from check-in volunteers unless needed, view logged), exclude from comms and exports by default, and time-box retention after the event. Show emergency contact only on a day-of check-in screen.
- Exports: gate behind finance/admin roles, log every export, watermark or time-limit download links, and make PII columns opt-in.

### Gaps
- Official Rule 10 and Fourth Schedule text not read; exact exemption wording unverified.
- Data ownership between organiser and platform: no source found.
- Retention periods for tax/invoice records (GST law) not researched; likely longer than DPDP deletion — conflict to resolve with a CA. [CA/LAWYER]
- Penalty amounts and enforcement status of the Data Protection Board not verified.
