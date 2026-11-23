# Race-day and race-week operations an organiser dashboard must support (India focus)

Method note: public sources only, via web search and page fetches in Nov 2026. "Documented" means stated on a cited page. "Inference" or "Recommendation" is my own reasoning. Many search results were summarised by the tool rather than read in full, so exact UI wording may differ. Pages I could not read in full or that returned nothing are listed under Gaps. No page returned an outright block, but several vendor pages (Wowsly, IndiaRunning organiser side, ChronoTrack/MyLaps DNS/DNF) gave no usable detail.

## 1. Check-in and scanner apps (QR, bib lookup, walk-ups, offline, gates, duplicates, volunteers, hardware, wristbands)

### Takeaway
Mature platforms (RunSignup, KonfHub) treat check-in as a device app with: registration-QR lookup, name search fallback, optional bib scan/entry, un-check-in, queued offline edits that sync later, and role-limited volunteer access. Duplicate-scan and offline-conflict behaviour is mostly undocumented publicly, so GoAthletix must design it explicitly.

### Cited Findings
- RunSignup RaceDay CheckIn keeps working with spotty internet and syncs automatically once back online; it advises Starlink or a non-app backup with the timer if the venue has no connectivity at all. — [RunSignup RaceDay CheckIn app listing](https://apps.apple.com/us/app/raceday-checkin/id1434451638); [RunSignup RaceDay CheckIn overview](https://info.runsignup.com/raceday-checkin-app/)
- RunSignup flow: scan the registration-ID QR (from the confirmation email) to find the participant, then scan a bib QR to assign that bib; or type the participant name and pick from results. Participants lacking a bib are prompted for one if the preset allows. — [RunSignup: Checkin Participants](https://help.runsignup.com/support/solutions/articles/17000141615-raceday-checkin-app-checkin-participants-4-)
- RunSignup has an "Un-Check In" action (confirm with "remove") so a participant can be checked in again. — same article as above
- RunSignup queues edits when the device is not syncing and pushes them on reconnect; some queued edits can be invalid and never push; staff can export, clear or retry queued edits; a device lock prevents using a non-syncing device after a set number of unsynced edits. — same article; also the lock-after-unsynced-edits setting is described in search summaries of [RunSignup presets help](https://help.runsignup.com/support/solutions/articles/17000141614-raceday-checkin-app-presets-2-)
- RunSignup recommends "Prevent Duplicate Bibs" and "Validate Bibs" settings, with Bib Assignment set to Required for dynamic bib assignment. — [RunSignup RaceDay CheckIn app listing](https://apps.apple.com/us/app/raceday-checkin/id1434451638)
- RunSignup's app syncs with registration about every 30 seconds so late signups appear at pickup; it can prompt unsigned waivers on the device and stores signed waivers as PDFs on the registration; check-in lists can be exported. — [RunSignup info page](https://info.runsignup.com/?p=2634); [Introduction to RaceDay CheckIn](https://info.runsignup.com/?p=38921)
- KonfHub Check-In App is a PWA at checkin.konfhub.com (no install). Login by organiser account or an event access code. Camera or USB scanner for QR; search by name/email/phone fallback. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)
- KonfHub offline: check-ins are stored on the device and sync across connected devices on reconnect; staff must fully load event data while online first. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)
- KonfHub supports multiple check-in points, each with own data syncing to a central record: multi-day, zones/halls, workshops with seat checks, goodies/swag/lunch collection timestamped per attendee, sequential security gates. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)
- KonfHub roles: "Check-in App Admin" (manage, view, download) and "Check-in App User" (manage, view, no download); access codes can be revoked or expire after the event. Kiosk mode (self-scan) and badge designer/silent printing exist. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)
- KonfHub help does not document duplicate-scan handling. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)
- Wowsly's public pages claim an offline-capable QR check-in app, unique codes per guest/sponsor/team member, a live entry dashboard, and a speed claim of 1 QR in under 2 seconds (vendor claim, unverified); no documentation on offline load, duplicates or sync. — [Wowsly check-in page](https://wowsly.com/dev/?p=56); [Wowsly Navratri post](https://wowsly.com/?p=2791)
- Indian race ticketing vendor Ticmint states every registration gets a dynamic QR scanned by its mobile app at packet pickup, entry gates or start corrals (vendor marketing). — [Ticmint marathon registration](https://ticmint.com/industries/marathon-registration/)
- IndiaRunning race pages tell runners to show the QR from the IndiaRunning app at the bib counter. — [IndiaRunning multicity run](https://multicityrun.indiarunning.com)
- Race Roster Onsite App: staff sign in before expo, open the check-in kiosk, can collect waiver signatures at check-in; unsigned waivers raise a dashboard alert. — [Race Roster packet pickup help](https://help.raceroster.com/en-us/knowledge-base/how-do-we-check-in-participants-at-packet-pick-up); [Race Roster waiver at check-in](https://help.raceroster.com/en-us/knowledge-base/how-to-set-up-waiver-signature-during-check-in)

### Inferences
- Minimum viable check-in = QR scan + name/phone/bib search + one-tap status change + undo + audit log of who scanned what and when. RunSignup and KonfHub both converge on this.
- Because duplicate handling is undocumented at KonfHub and Wowsly, a clear "already checked in at HH:MM by <volunteer> at <gate>" screen with a supervisor override is a differentiator.
- Wristbands are not covered by any source I found; for India (multi-day, trek, camp, expo-plus-race) wristband issuance is best modelled as an optional "item issued" record per ticket (same pattern as KonfHub goodies per-attendee timestamp).

### Gaps
- How RunSignup reconciles conflicting offline bib assignments on sync is not documented (search summary says contact support).
- No public documentation of Wowsly or KonfHub duplicate-scan behaviour.
- Phone camera vs dedicated scanner trade-offs: only KonfHub (camera or USB scanner) documented; no benchmark source found.
- Wristband workflows: no source.

## 2. Offline-first check-in with Supabase/Postgres and the GA1.<token> payload

### Takeaway
No platform publishes its sync internals, so this is mostly recommendation. Supabase has no native offline sync; PowerSync and RxDB offer Supabase integrations, but for an MVP a small custom "pre-downloaded roster + append-only scan queue + idempotent server RPC" is sufficient and avoids a heavy sync engine.

### Cited Findings
- Supabase JS client does not natively provide offline-first sync; RxDB ships a Supabase replication plugin with checkpointed pulls, retries and conflict handling. — [RxDB Supabase replication](https://rxdb.info/replication-supabase.html)
- PowerSync syncs an on-device SQLite with Supabase Postgres; conflict resolution is left to the backend design per its own write-pattern guidance. — [PowerSync + Supabase](https://www.powersync.com/blog/offline-first-apps-made-simple-supabase-powersync); [PowerSync write patterns](https://telemetry-landing.pages.dev/blog/write-patterns-for-powersync/)
- Supabase's own blog lists ElectricSQL, PowerSync and Replicache as sync options; deletes need tombstones in any of them. — [Supabase blog: Realm alternatives](https://supabase.com/blog/mongodb-realm-and-device-sync-alternatives); [DEV: Offline-first 2026](https://dev.to/dataformathub/offline-first-2026-why-most-developers-fail-at-data-synchronization-g4b)
- RunSignup's model (queue edits, lock device after N unsynced edits, export/retry failed queue, validate/prevent duplicate bibs) and KonfHub's (preload event data while online, sync later) are the only documented patterns from race/event vendors. — sources in section 1

### Inferences (Recommendation, not documented fact)
- Pre-event download: per event, cache a roster snapshot (ticket id, qr_token hash or token, status, participant name, category, bib, size, waiver flag, medical flag) in IndexedDB (PWA) before leaving connectivity. Include a `roster_version` / `updated_at` high-water mark and refetch deltas where `updated_at > mark`.
- Offline validation of GA1.<token>: store qr_token (or a hash of it) in the roster so scan lookup is local; if only qr_payload is stored, compare the full payload string. Never trust a client-side-only check beyond the cached roster; server remains authoritative on sync.
- Write path: client appends scan events `{event_id, ticket_id, scan_uuid (client-generated), scanned_at (device time plus offset), gate_id, device_id, volunteer_id, action}` to a local queue. Server RPC `apply_scan(scan_uuid, ...)` is idempotent on scan_uuid and does `UPDATE tickets SET status='checked_in' WHERE id=? AND status IN ('confirmed','reserved')` only when appropriate, returning a result code (ok, already_checked_in with original time/gate, invalid, wrong_event, not_confirmed).
- Keep an append-only `checkin_scans` table (all scans including duplicates and rejections) separate from the `tickets.status` field; this gives audit, duplicate analytics and replay. First valid scan wins; later ones are logged as duplicates (resolving the two-gate offline race deterministically by earliest scanned_at, tie-break by scan_uuid).
- Reserved tickets: treat `reserved` as not admissible (payment incomplete) and show a distinct "payment pending" screen; offer organiser override with reason logged.
- Bibs: use a unique index on (event_id, bib) so offline duplicate bib assignment fails loudly on sync and appears in a "sync conflicts" queue (mirrors RunSignup's queued-edits-with-failures UI).
- Row Level Security: volunteer role gets scoped access to one event's roster and scan RPC only; no download/export (mirrors KonfHub "App User" vs "Admin"). Use short-lived event access codes that expire after the event (KonfHub model).
- Roster contains personal data on volunteer phones; encrypt at rest where feasible, auto-wipe after event, and exclude medical details from the offline roster unless needed (flag only).
- Suggested MVP sync: manual "Sync now" button plus automatic retry with visible counters: "N scans pending", last sync time, device lock after configurable pending count.

### Gaps
- No public benchmark comparing PowerSync/RxDB/custom for scanning workloads.
- I did not verify current Supabase Realtime limits or pricing for concurrent scanner devices.

## 3. Bib assignment and wave/start-time assignment

### Takeaway
RunSignup supports rule-based bulk assignment, ranges, CSV import, per-registrant manual assignment, group/team bibs, dynamic assignment at check-in and corral (wave) assignment that carries bibs by corral. Elite/reserved bibs are a common manual practice.

### Cited Findings
- RunSignup "Assign Bibs & Chips" offers assigning bib numbers to a group based on defined rules, group/team bibs (separate from individual bibs), and one-by-one assignment. — [RunSignup: Assign Bibs & Chips](https://help.runsignup.com/support/solutions/articles/17000063281)
- RunSignup: bibs can be pre-assigned with a bulk range tool, or via CSV import. — [RunSignup endurance features](https://runsignup.com/Race/P2POptions/Page/enduranceeventfeatures)
- RunSignup corrals: a registrant assigned to a corral also gets the next available bib within the event and corral; a Corral Assignment Tool assigns corrals by estimated finish time; where finish time does not matter, participants can choose their corral/wave. — [RunSignup: Enable Corrals](https://help.runsignup.com/support/solutions/articles/17000073677-enable-corrals)
- Group/team bib setup is a separate flow. — [RunSignup: Group/Team Bib Assignment](https://help.runsignup.com/support/solutions/articles/17000065947-setup-group-team-bib-assignment)
- Red Podium documents bib assignment filters by age/division and wave time. — [Red Podium bib assignment](https://help.redpodium.com/en/articles/4643266-bib-assignment)
- Mount Marathon publishes waves and bib seeding processes (seeding by prior results). — [Mount Marathon waves and bib seeding](https://mountmarathon.com/waves-and-bib-seeding/)
- RunSignup dynamic bibs (bib typed or scanned at check-in) sync to the database so timers see the latest assignment. — [RunSignup RaceDay CheckIn listing](https://apps.apple.com/us/app/raceday-checkin/id1434451638)
- Procam requires timing tags to be attached to bibs before distribution; loose chips may not be handed to runners. — [Procam technical standards](https://tatamumbaimarathon.procam.in/race-categories/marathon/road-race-technical-standards-&-timing-recognition-guidelines)
- An Indian timing vendor states its system matches tag numbers to bib numbers, removing the chip file. — [Sports Timing Solutions India](https://sportstimingsolutions.in/about-us)

### Inferences
- MVP bib tool: per category, a start number and prefix plus "reserve ranges" (e.g., 1-99 elite, 9000+ walk-ups, charity block); preview-then-commit; unique constraint per event; reassign with audit trail; export to CSV. Wave/pace-based assignment (estimated finish time → corral → bib block) is a later feature.
- Reassign is needed for lost bibs, category changes and transfers; log old bib and reason so timing exports stay consistent.

### Gaps
- No public Indian-platform documentation on bib assignment rules (IndiaRunning, BookMyShow, Wowsly organiser help not found).
- Elite bib conventions in Indian marathons: no source found.

## 4. Kit/expo/packet collection (slots, proxy pickup, T-shirt counts, goodie bag reconciliation)

### Takeaway
Indian big races use a physical expo with ID-checked collection; individual runners often must collect personally, while group/corporate representatives may use authorisation letters. IndiaRunning events allow a signed letter plus QR plus photo ID. Platforms provide per-attendee goodie timestamps.

### Cited Findings
- Tata Mumbai Marathon: individual marathon participants must collect running numbers personally at the Bib Collection Center in the Get Active Expo; the 2027 expo is 14-16 Jan 2027; a group representative may collect for a group with printed group confirmation email, letterhead authorisation and government photo ID; and the shirt is given at the bib collection centre. — [TMM bib collection](https://tatamumbaimarathon.procam.in/race-categories/marathon/runner-information/bib-collection); [TMM marathon information](https://tatamumbaimarathon.procam.in/race-categories/marathon/information)
- IndiaRunning event rule: show the app QR at the bib counter; a proxy needs a letter written and signed by the runner naming the proxy, the QR, and the proxy's photo ID. — [IndiaRunning multicity run](https://multicityrun.indiarunning.com)
- Procam asks organisers to verify the registered person is the runner through methods including ID checks at bib collection or controlled bib distribution. — [Procam technical standards](https://tatamumbaimarathon.procam.in/race-categories/marathon/road-race-technical-standards-&-timing-recognition-guidelines)
- KonfHub check-in points can track goodies/swag/lunch collection with a timestamp per attendee. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)
- Vedanta Delhi Half Marathon and Bengaluru Marathon publish expo and race-day detail pages (expo schedule, collection documents). — [Delhi Half expo 2024](https://vedantadelhihalfmarathon.procam.in/race-categories/half-marathon/runners-information/mirchi-get-active-expo-2024); [Bengaluru expo](https://bengalurumarathon.in/expo)

### Inferences
- MVP: per-ticket "kit collected" flag with timestamp, collector type (self/proxy), proxy name and ID type, volunteer id; T-shirt size count report (sold by size vs. issued by size vs. remaining) and goodie reconciliation (issued count vs. delivered stock). Time slots for pickup are a later feature (no public Indian source found for slot booking).
- Proxy authorisation: capture proxy name, ID type/last 4 digits only (avoid storing full Aadhaar; recommendation), and optionally photo of the authorisation letter.

### Gaps
- No public source on pickup time-slot booking by Indian platforms.
- No source for T-shirt size reconciliation reports in Indian platforms (inference only).

## 5. Timing integration, import/export, gun vs chip, age groups, DNS/DNF

### Takeaway
Timing vendors accept participant lists as CSV/Excel with bib (and chip/tag) columns and return results exports. Indian standards from Procam demand RFID, net (chip) time, split mats and quick publication. Exact column names for MyLaps/ChronoTrack and DNS/DNF codes were not found.

### Cited Findings
- RACE RESULT: chip file can be imported from Excel/TXT/CSV pairing bib and chip code, or chip number can equal bib; participants can be imported/merged from other event files with import filters; exports include the visible fields; gun time = from official start to finish, chip (net) time = from the runner's own start crossing; each contest's time mode decides ranking basis. — [RACE RESULT knowledge base](https://www.raceresult.com/en-in/support/kbexport2?id=51100); [Timing Basics](https://www.raceresult.com/en-hu/support/kbexport2?id=36153); [RACE RESULT KB 2687](https://www.raceresult.com/de-de/support/kbexport2?id=2687)
- ChronoTrack Live: athletes imported from CSV/TSV; minimum columns External ID or ChronoID plus Reg Choice; error rows exportable as CSV. — [ChronoTrack: Importing Athletes and Teams](https://director.chronotrack.com/hc/en-us/articles/206193590-Importing-Athletes-and-Teams)
- MyLaps team portal imports participants by CSV with a fixed sample label row. — [MyLaps: Import participants](https://mylaps.zendesk.com/hc/en-us/articles/115001432649-5-7-Import-and-add-participants-in-teamportal)
- Roster Athletics TimeTronics export maps statuses so DNF and DNS pass through; time with no status means OK. — [Roster Athletics support](https://support.rosterathletics.com/en/support/solutions/articles/44002369075)
- RunSignup: finishing times, overall and age-group rankings upload to RunSignup as runners cross the finish mat. — [RunSignup certificates article](https://help.runsignup.com/support/solutions/articles/17000064293--how-to-create-finisher-s-certificates) (search summary)
- Procam: RFID mandatory for all runners; start/finish mats and minimum splits (marathon >=3, half and 25 km >=2); net time required on qualifying certificates; provisional results within 12 hours of official close; final results and downloadable certificates online. — [Procam technical standards](https://tatamumbaimarathon.procam.in/race-categories/marathon/road-race-technical-standards-&-timing-recognition-guidelines)
- Indian timing vendors: Sports Timing Solutions (India) lists race timing, results processing, real-time participant tracking and SMS results; claims 250+ events including Mumbai Marathon and Delhi Half. — [STS India services](https://sportstimingsolutions.in/services.php); [STS India about](https://sportstimingsolutions.in/about-us). Timing Technologies India (Hyderabad) markets live tracking, RFID timing and certificates. — [Timing Technologies blog](https://timingtechnologies.blogspot.com/2026/01/how-wearable-tech-and-race-timing.html)
- The 2007 Business Standard article says Mumbai Marathon used Mika Timings with Championchip and later active RFID chips (old). — [Business Standard](https://www.business-standard.com/article/technology/running-on-a-technology-savvy-track-107012001063_1.html)
- RaceTime was not found in any result; the claim that Procam uses a given vendor today is unconfirmed.

### Inferences (Recommendation)
- Start-list export (to timer): event_id, bib, chip/tag id (nullable), first name, last name, gender, DOB/age, category/distance, wave/corral, city, team, email/phone (optional), status. UTF-8 CSV with a documented header; also Excel.
- Results import: bib, chip/gun/net time, status (OK/DNS/DNF/DSQ), splits, overall/gender/age-group place. Match on bib; produce an error CSV of unmatched bibs (ChronoTrack-style). Compute DNS automatically as confirmed tickets with no start read or not checked in (needs checked_in data), DNF as started with no finish.
- Age-group ranking: compute from DOB on race day, or as of 31 Dec of the year (confirm per race rules, no source found), configurable bands (e.g., 5-year).
- Store both gun_time_ms and net_time_ms; ranking basis configurable per category.

### Gaps
- No official ChronoTrack/MyLaps/RACE RESULT column-level spec for start lists found with DNS/DNF codes; need vendor sample files.
- Which specific timer Indian platforms (IndiaRunning, BookMyShow) integrate with: no public source found.
- RaceTime vendor details: not found.

## 6. Results publishing, e-certificates, live tracking

### Takeaway
RunSignup and Race Roster let organisers customise certificates with name, race, finish time and place, and send results via timer email campaigns with merge tags. Indian standards (Procam) require downloadable certificates and quick provisional results.

### Cited Findings
- RunSignup default certificate auto-fills name, race name, finish time, place and logo; organisers can use a template or upload an image as base. Menu: RaceDay Tools > Results > Customize Finisher Certificates. — [RunSignup: Finisher's Certificates](https://help.runsignup.com/support/solutions/articles/17000064293--how-to-create-finisher-s-certificates)
- Race Roster custom certificates can show event date, name, sub-event, chip time, division and place; post-race timer email campaigns use merge tags including overall place, finishing time and a certificate link. — [Race Roster: finisher certificates](https://help.raceroster.com/en-us/knowledge-base/how-to-enable-and-customize-finisher-certificates-results-v3); [Race Roster: timer email campaigns](https://hubspot.raceroster.com/en-us/knowledge-base/how-to-setup-timer-email-campaigns-with-post-race-results)
- UK Sports Timing Solutions (different company) offers free live tracking, results and downloadable certificates. — [STS UK](https://sportstimingsolutions.co.uk/ourservices/running-chip-timing)
- Procam: final results and downloadable timing certificates online with split times visible; provisional results within 12 hours. — [Procam technical standards](https://tatamumbaimarathon.procam.in/race-categories/marathon/road-race-technical-standards-&-timing-recognition-guidelines)
- RunSignup auto-sending of certificates was not confirmed.

### Inferences
- Certificate MVP: one template per event with placeholders (name, category, bib, gun/net time, overall/gender/age-group rank, date, event logo, signatory), PDF generated on demand from results, with an "available from" date and a toggle for auto-email. Verify certificate correctness against AIMS-measured course and chip data where relevant (certificate must show net time for qualification per Procam).
- Live tracking later: needs splits feed from timer (mat reads) and a public page by bib; SMS results are a known Indian vendor feature.

### Gaps
- Public docs for IndiaRunning/BookMyShow certificate or results workflows: not found.

## 7. Waivers, medical/emergency info on race day

### Takeaway
Indian races collect emergency/medical info on the back of the bib; platforms (RunSignup, Race Roster) store signed waivers and allow signing at check-in. There is no national rule for ambulance counts; each race publishes its own plan.

### Cited Findings
- Tata Mumbai Marathon asks runners to fill allergies, medical conditions, medications and a non-participating emergency contact on the reverse of the bib. — [TMM event medical advisory](https://tatamumbaimarathon.procam.in/event-medical-advisory)
- Hyderabad, Jaipur and Delhi Half give similar instructions. — [NMDC Hyderabad medical advisory](https://nmdchyderabadmarathon.com/medical-advisory); [Jaipur marathon medical](https://marathonjaipur.com/medical.asp); [Delhi Half medical advisory](https://vedantadelhihalfmarathon.procam.in/medical-advisory)
- Examples of medical coverage: Mumbai (13 ambulances, 13 paramedic bikes, medical spotters every 100 m in last 2 km, 2024 advisory); Bengaluru 2025 booklet (ambulances en route, medical bikes). — [TMM medical advisory](https://tatamumbaimarathon.procam.in/event-medical-advisory); [Bengaluru booklet 2025](https://bengalurumarathon.in/wp-content/uploads/2025/09/Booklet-2025.pdf)
- Race Roster: unsigned waivers raise a dashboard alert; waiver can be signed at check-in. RunSignup stores signed waivers as PDFs. — see section 1

### Inferences
- Race-day "medical lookup by bib" screen restricted to a medical-team role, with audit log and no offline caching of full medical data (privacy: DPDP Act, 2023 applies to personal data in India; I did not retrieve the Act text in this session, so verify).
- Waiver status flag shown at check-in; block or warn on unsigned.

### Gaps
- No regulatory minimum for Indian race medical cover found.
- DPDP-specific guidance for health data at events: not researched.

## 8. Volunteers and sponsors; AIMS certification and permits (road races)

### Takeaway
AIMS/World Athletics course certification is becoming a recognition gate in India (Procam); police permissions are local and ad hoc.

### Cited Findings
- Procam requires measurement by an AIMS/World Athletics Grade A or B measurer, calibrated bicycle method, certificate public on the site with race, distance, certificate number, measurer name and grade, date and validity; a deviation needs re-measurement; short course voids certificates. Certificates from non-AIMS-certified courses accepted for events whose registration opens on or before 31 March 2027. — [Procam technical standards](https://tatamumbaimarathon.procam.in/race-categories/marathon/road-race-technical-standards-&-timing-recognition-guidelines)
- A 2026 report says only three certified course measurers are in India; AIMS and World Athletics ran a measurement workshop in Bengaluru. — [Open Magazine](https://openthemagazine.com/sports/inside-the-push-to-make-indian-marathons-globally-recognised); [Lokmat Times workshop](https://www.lokmattimes.com/other-sports/aims-world-athletics-conduct-course-measurement-workshop-in-bengaluru/) (press, treat as indicative)
- Police permission varies by city; in Bhubaneswar a submitted application is not permission and written approval from licensing cell and traffic DCP is needed. — [Sambad English](https://sambadenglish.com/latest-news/bhubaneswar-marathons-banned-between-behera-sahi-chhak-and-nandankanan-square-10960915); general compliance overview: [iPleaders](https://blog.ipleaders.in/organizing-marathon-legal-compliance-must-know/)
- Procam recommends/encourages an Observer for measurement compliance, working cameras at junctions and officials at crucial points. — [Procam technical standards](https://tatamumbaimarathon.procam.in/race-categories/marathon/road-race-technical-standards-&-timing-recognition-guidelines)
- KonfHub RBAC (Admin/User roles) is the only documented volunteer permission model found. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)

### Inferences
- Dashboard "compliance checklist" per event: AIMS certificate (number, measurer, grade, expiry, file upload), police permission (authority, reference no., date, file), medical plan, insurance, NOCs; show certificate publicly on the event page when available (Procam requirement).
- Volunteer module MVP: invite by phone, role (check-in, kit, medical, marshal), station assignment, shift, access code expiry. Sponsor module is later: sponsor deliverables (logo placement, booth, goodie insert counts).

### Gaps
- No public source on sponsor-management workflows from race platforms.
- Volunteer shift/briefing tooling in Indian platforms: not found.
- Specific permit lists (fire, municipal, NOC) per city not systematically covered.

## 9. Treks, tournaments and camps

### Takeaway
Trek permits are state-forest-office driven, require traveller ID checks and operator staff lists; tournaments need fixtures plus live scores, served in India by Zeetius and Tournament Software. Camp attendance had no usable sources.

### Cited Findings
- Uttarakhand Kedarnath Wildlife Division FAQ: forest staff check each trekker's physical ID against records at the trailhead; permit and valid ID must be carried. — [Kedarnath Wildlife Division FAQ](https://kedarnathwildlife.uk.gov.in/pages/kedarnath-wildlife-division-trek-permit-faq)
- A draft 2022 Uttarakhand trekking rule requires operators to submit lists of guides, cooks and staff via the forest portal (draft; finalisation unverified). — [Uttarakhand Tourism draft rules](https://uttarakhandtourism.gov.in/sites/default/files/document/type/Draft%20%20Trekking%20Rule%20%202022%20(Final).pdf)
- Himachal: incomplete applications rejected; fake documents not accepted. — [WikiProcedure Himachal](https://wikiprocedure.com/index.php/Himachal_Pradesh_-_Obtain_License_(Permit)_for_Trekking_or_Camping) (secondary source)
- Acceptable ID examples listed: ration card, passport, Aadhaar, driving licence, plus self-declaration. — [WikiProcedure India](https://www.wikiprocedure.com/index.php/India_-_Obtain_License_(Permit)_for_Trekking_or_Camping) (secondary)
- Karnataka Aranya Vihara permit booking is via government portal. — [Namma Trip](https://nammatrip.in/blogs/how-to-book-trek-permits-in-aranya-vihara) (blog, secondary)
- Zeetius markets badminton tournament software with draws, schedules, live scoring and payment/registration automation, with BAI officials testimonials (vendor claims). — [Zeetius badminton](https://zeetius.com/badminton); [Zeetius Live](https://live.zeetius.com). Karnataka Badminton Association links draws to tournamentsoftware.com, suggesting use at state level. — [KBA draws](https://kba.org.in/en/category/draw/page/2/)

### Inferences
- Trek batch roster export: batch/date, trek name, leader, for each trekker name, age, gender, ID type and number (mask in UI), phone, emergency contact, blood group, medical declaration, indemnity; plus staff list (guides, cooks) for permit submission. Format varies by state; offer CSV/XLSX plus PDF.
- Camp attendance = daily check-in per session reusing the multi-point scan model (KonfHub-style per-day tracking).
- Tournament MVP: categories, draw (knockout/round-robin), match schedule by court/time, score entry by officials with live public view; later: seeding, umpire assignment, rankings.

### Gaps
- No official batch-roster template from any state forest department found.
- No sources for camp attendance, martial arts fixtures/scoring, or team-sport leagues specific to India.
- Sikkim permit specifics weakly sourced.

## 10. Mobile-first race-day UI and minimum toolset (MVP vs later)

### Takeaway
No public Indian platform documents its race-day design rules; guidance here is recommendation. Evidence supports PWA scanning, kiosk mode and low-connectivity tolerance.

### Cited Findings
- KonfHub runs as a browser PWA usable on any device and offers a kiosk mode for self-service. — [KonfHub check-in help](https://help.konfhub.com/apps/check-in-app)
- RunSignup advises planning for venues with no connectivity and syncs registrations about every 30 seconds when connected. — [RunSignup info](https://info.runsignup.com/?p=2634); [RaceDay CheckIn overview](https://info.runsignup.com/raceday-checkin-app/)
- RunSignup claims QR-based packet pickup is faster than manual lookup (about 6 seconds per participant per its guide). — [RunSignup RaceDay processes PDF](https://info.runsignup.com/wp-content/uploads/sites/3/2024/06/RaceDay-Processes-for-Race-Directors.pdf) (search summary only)

### Inferences (Recommendation)
- Design: full-screen scan viewport with one big result banner (green admit / amber warning / red reject), >=48 px tap targets, high-contrast theme and no light-grey text for outdoor sunlight, haptic and sound feedback, a manual bib/phone keypad fallback, always-visible online/offline and pending-sync indicator, one-handed bottom actions, and large-font mode.
- MVP (race week): QR check-in with offline roster cache and dedup; manual search; bib assignment tool (ranges, CSV import, reassign); kit-collected flag with proxy capture; T-shirt size and goodie counts; start list CSV export and results CSV import; results page; finisher certificate PDF with date gating; waiver/medical flags; volunteer access codes with roles; participant list export.
- Later: waves/corrals by pace, pickup slot booking, kiosk self check-in and badge printing, live tracking and SMS results, auto-emailed certificates, AIMS/permit compliance tracker, sponsor and volunteer shift management, tournament fixtures and live scores, trek permit roster templates by state, wristband and multi-gate zones.

### Gaps
- No measured contrast/tap-target research specific to outdoor race-day apps was retrieved.
- Wowsly, IndiaRunning, BookMyShow organiser-side documentation was not found publicly; Indian platform capabilities are inferred from runner-facing pages and marketing.
