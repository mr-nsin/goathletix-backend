# Organiser consoles for multiple sports, multiple events and non-race formats

Scope note: about 20 tool calls, public sources only, as of Nov 2026. Cited Findings are documented facts from the linked pages. Inferences are recommendations and are not documented by the tools. Pages that blocked fetching: Challonge features (HTTP 403), Eventbrite support article on recurring events (HTTP 403). Not found at all: official help pages for LeagueApps, SportsEngine, Mindbody (admin side) and Hudle. For those, only marketing pages, app-store text or third-party roundups were seen.

## Q1. Which modules should the dashboard share across all sports, and which sport modules (bracket, fixtures, legs/transitions, batches) should be added in what order?

### Takeaway
Every tool splits into a generic shell and format-specific engines. The shell holds registration, categories, payments, participants, comms, check-in and reports. The engines are brackets/groups/leagues, a fixture scheduler with venues, and a slot/batch calendar. Race-specific features (timing, legs/transitions) were not covered by the tools reviewed here and need separate sourcing.

### Cited Findings
- Toornament models a tournament as stages, groups, rounds and matches. Bracket structures: single elimination, double elimination, gauntlet, bracket groups, custom bracket. Ranking structures: round-robin groups (max 10 per group), league, Swiss. Free-for-all variants also exist — [Toornament structures](https://help.toornament.com/structures/which-format-for-my-tournament), [Toornament dev docs](https://developer.toornament.com/v2/core-concepts/structure)
- Toornament lets organisers swap match seeds (including in the loser bracket) before or during the competition, and use a "threshold" option to skip unnecessary matches. A bye means a participant has no match in a round — [Toornament search summary of official docs](https://help.toornament.com/structures/which-format-for-my-tournament)
- Tournify combines groups (single or double round robin), single-elimination brackets with consolation "sub brackets", and single playoff matches on one Format page. Teams are placed manually or by automated draw, and later phases fill from earlier results (for example top two per group, or best third-placed teams). The article does not cover byes — [Tournify format help](https://intercom.help/tournify/en/articles/8909549-format)
- Tournify divisions separate teams by age group, gender or skill level. Each division has its own teams and format. Moving to the next phase is a "Start" action on the Results page — [Tournify format help](https://intercom.help/tournify/en/articles/8909549-format)
- Tournify scheduling: add fields/courts/rinks, set match length and buffer, auto-plan by group, round and field, or drag matches onto fields, and add breaks. Scores can be entered by organisers, referees or teams through a password-less unique link, and standings update live — [Tournify schedule help](https://intercom.help/tournify/en/articles/8909552-schedule), [Tournify features](https://tournifyapp.com/features) (as summarised by search; the schedule page itself was not fetched)
- TeamSnap tournament scheduler: auto-generated pools and brackets, updated from a phone on event day. Scores update from a phone and live results go to the event site. Standings and tiebreaker rules are customisable per division or age group. Organisers can resolve multiple conflicts at once, assign officials and notify teams of changes. The page does not mention venues/courts or seeding — [TeamSnap schedule maker](https://www.teamsnap.com/tournaments/tournament-schedule-maker)
- TeamSnap says its scheduler generates conflict-free schedules considering blackout dates, coaches with multiple teams and travel — [TeamSnap tournaments](https://www.teamsnap.com/tournaments) (search snippet only)
- LeagueApps: third-party and vendor snippets list custom registration, waitlists and capacity limits, rosters, season schedule generation with conflict and venue handling, referee assignment, brackets and standings. Support is secondhand — [LeagueApps basketball page](https://leagueapps.com/sport/basketball/), [FitGap listing](https://us.fitgap.com/products/024549/leagueapps)
- SportsEngine: brackets may be sold as a separate "Tourney" product (a competitor's claim), which suggests bracket features are not in the core league console — [TeamSideline comparison](https://go.teamsideline.com/sportsengine-alternative---teamsideline) (competitor, self-promotional)
- Playo Partner Console modules: today dashboard (bookings, earnings, cancellations, slot availability), slot and calendar management (add/edit/block slots, custom pricing, schedule maintenance or tournaments), booking logs, payments and GST invoices, reports by sport, occupancy, and role-based staff access. No batches, coaching or academy module appears — [Playo Partner Console help](https://playo-partner.freshdesk.com/support/solutions/articles/1070000137391-what-is-the-playo-partner-console-), [Playo blog](https://blog.playo.co/playo-partner-app)
- Hudle Partner (vendor/app-store text, varies by country): slot and booking management, payment links, coupons, membership automation, staff management, GST invoicing, a sport-wise occupancy dashboard and equipment rental POS — [Hudle Partner on App Store](https://apps.apple.com/in/app/id1569130632)
- Playspots, a separate Indian product, markets batches, training schedules and membership management for academies. This shows the batch/membership niche is served by separate tools from slot-booking tools — [Playspots](https://www.playspots.in/membership-management-software/)
- Mindbody: when a class is full, clients are offered a waitlist and the next waitlisted client is moved to the roster automatically on cancellation. Members can be given waitlist priority over non-members. Recurring reservations can be made by clients or created by the business — [Mindbody waitlist update](https://www.mindbodyonline.com/business/education/product-waitlist-improvements), [Mindbody scheduling](https://www.mindbodyonline.com/en-gb/business/scheduling)
- RunSignup (races) also covers series: Series Scoring totals points across races, and Multi-Race Bundles sell discounted bundles from one dashboard — [RunSignup search results on renewal and series](https://help.runsignup.com/support/solutions/articles/17000064301)

### Inferences
- Shared across all sports (order of build): (1) Event and category model with capacity, price and eligibility (age, gender, weight) per category. (2) Registration and form builder. (3) Participant list, check-in, and exports. (4) Comms and payouts. (5) Multi-event "all my events" dashboard. All fit the existing events, event_categories and event_form_fields tables.
- Sport-specific modules, suggested order: (A) Batches/slots calendar with seats, waitlist and attendance. It serves yoga, camps, swimming coaching, martial-arts classes and academies in one module, and Playo/Hudle/Mindbody all centre on it. (B) Team and roster registration. (C) Bracket and group draws, for racquet sports and martial arts. (D) Fixture scheduler with courts and a score-entry link, for team leagues and racquet sports. (E) Standings. (F) Leg/transition and wave/heat tooling for triathlon, HYROX and cycling, which differs from the above and was not researched here.
- Mapping: running, cycling, trekking and yoga events need only the shared shell plus categories. Triathlon and HYROX add legs/stations and waves, which are fields in sport_details rather than fixtures. Racquet sports and martial arts use brackets with age/weight categories. Team leagues use rosters, fixtures and standings. Swimming and camps use batches and heats.
- Venue/coaching consoles (Hudle, Playo, Mindbody) are booking-centric, not event-centric. An academy organising several sports needs an "organisation" level above events with sport tags and staff roles.

### Gaps
- No official help-centre pages for LeagueApps, SportsEngine, Mindbody (admin) or Hudle were read, so their feature claims are secondhand.
- Challonge's own help and feature pages returned 403. Its bye and seeding behaviour is known only from forum posts and feature-request threads (for example [Challonge UserVoice, multi-stage](https://challonge.uservoice.com/forums/44455-feature-requests/suggestions/543069-multi-stage-tournaments-preliminary-round-robins)), which are not authoritative.
- Protests/disputes: no documented dispute or protest workflow found in any tool. Treat as an unsolved design item.
- Weight categories and martial-arts divisions: only generic division handling found (Tournify). Federation rules (for example Indian federations) were not checked.
- Transitions/legs tooling in triathlon platforms was out of the tool list and not researched.

## Q2. How do the best tools present event templates, cloning, and series/editions to save organisers' time?

### Takeaway
The common pattern is "copy from a previous event with section checkboxes, then fix dates", a bulk-edit across selected events, and a yearly "renew" action that preserves history. Luma adds a clone-many with recurrence rules and a clear list of what is not copied.

### Cited Findings
- RunSignup Copy Race: Profile > My Races > Actions > Copy this Race. Settings are pre-filled and organisers choose which sections to copy. They must enter a new race URL, which cannot be changed later, and dates written in descriptions are not updated automatically — [RunSignup: Copying Your Race](https://help.runsignup.com/support/solutions/articles/17000064303-copying-your-race)
- RunSignup advises a "Renew Race" for a race held last year instead of copying. Renewal keeps historical data in the same dashboard for year-on-year comparison. A user reported the dashboard looked empty after renewal, and RunSignup says old data is reached through a separate step — [RunSignup: Renewing Your Race](https://help.runsignup.com/support/solutions/articles/17000064301), [RunSignup blog](https://info.runsignup.com/?p=39048)
- RunSignup "Edit Multiple Events": select events by checkbox or select-all. Fields start disabled, and only fields the organiser enables are applied to all selected events. Untouched fields keep each event's values — [RunSignup: Modify Multiple Events](https://help.runsignup.com/support/solutions/articles/17000062662)
- Luma Clone Event copies title, description, FAQs, cover, location, ticket types and prices, coupons, registration settings (capacity, approval, waitlist), registration questions and emails. It does not copy the guest list, blasts, custom reminders, co-hosts or check-in staff. It can create up to 20 clones at once on web (the multi-session page says 30), using Add Time or a Recurrence pattern. Ticket sale dates are copied as exact dates and need updating — [Luma Cloning Events](https://help.luma.com/p/cloning-events), [Luma multi-session](https://help.luma.com/p/multi-session-recurring-events)
- Luma's other multi-session options: a Calendar page listing many events (no bulk registration), linked events, or several ticket types in one event for same-day sessions — [Luma multi-session](https://help.luma.com/p/multi-session-recurring-events)
- Eventbrite: "Create event > Recurring event" adds dates (consecutive or not), and a blog says details can be filled once and duplicated for every occurrence. Editing a single instance is a separate help article that was not readable (support page 403) — [Eventbrite blog](https://www.eventbrite.com/blog/create-recurring-event-program-ds00/), [Eventbrite help (redirected, blocked)](https://support.eventbrite.com/hc/en-us/articles/34862311891858-Create-and-manage-multiple-date-or-recurring-events)
- Race Roster offers a "template for another event" option, per a search summary — [Race Roster duplicate registration page](https://help.raceroster.com/en-us/knowledge-base/how-to-duplicate-a-registration-page) (not fetched)
- A RunSignup customer case study says 100+ events and series are managed from one dashboard with templated event websites — [RunSignup case study](https://info.runsignup.com/?p=40374) (search snippet)

### Inferences
- Recommended model: a series (parent) with editions (events), a "Renew edition" action that clones with a section-checklist and shifts all dates by a delta, and a "what was not copied" summary page after cloning (Luma's explicit list is a good pattern).
- Copy rules to use: copy categories, form fields, prices and rules. Do not copy registrations, coupons' expiry, co-organisers, or announcements. Warn about hard-coded dates in free text.
- Bulk-edit with opt-in fields (RunSignup) is a cheap, high-value feature for multi-category and multi-day events.
- For recurring batches (weekly yoga, coaching), generate sessions from a rule rather than copying events, so editing one session does not break the chain. Third-party plugin forums report that single-instance edits can split a series (see The Events Calendar forum threads), but this is anecdotal.

### Gaps
- Eventbrite's own instance-editing rules and limits were not readable.
- Toornament and Challonge tournament templates/cloning not verified.
- No documented "series page" design (annual race with editions) found beyond RunSignup renewal and Luma calendars.

## Q3. What is the simplest data model for brackets, fixtures and batches that fits the current schema?

### Takeaway
Use a few generic tables (participants/teams, fixtures with next-match pointers, sessions and enrolments) with jsonb for sport rules, not a table per sport. This matches how the tools model stages/groups/rounds/matches and how brackets libraries derive structure.

### Cited Findings
- Toornament's data model is a hierarchy of stage, group, round and match, with participants placed into stages automatically — [Toornament dev docs](https://developer.toornament.com/v2/core-concepts/structure)
- Open-source bracket models route winners via a next-match reference plus a slot position (nextMatchPosition), and a kumite model keeps separate winner and consolation match links — [Golden Gear Games write-up](https://inductiveautomation.com/blog/node/26), [kumite models](https://karate-tournament.readthedocs.io/en/latest/_modules/kumite/models.html)
- brackets-manager.js derives the next match from tournament structure alone, independent of result — [brackets-manager.js discussion](https://www.github.com/Drarig29/brackets-manager.js/discussions/157)
- Tournify keeps divisions with their own teams and formats, with phases linked by "top N from group" rules — [Tournify format help](https://intercom.help/tournify/en/articles/8909549-format)

### Inferences
(All of the following is recommendation. The `next_win_*`/`next_loss_*` column design is general knowledge, not taken from a cited source. Table and column names are suggestions to adapt to the existing schema.)
- Keep events and event_categories as the anchor. A category is a "division" (age, gender, weight, level). Put format choice in event_categories.sport_details, for example `{"format":"double_elim","seeding":"manual","tiebreakers":["h2h","point_diff"],"best_of":3,"weight_class_kg":[60,65]}`.
- `competitors` (event_id, category_id, registration_id or team_id, seed, status). Teams: `teams` and `team_members` linked to registrations. Rosters are rows, not jsonb.
- `stages` (category_id, ordinal, type: group|knockout|league|swiss|heats, config jsonb), and optional `groups` (stage_id, name).
- `fixtures` (id, stage_id, group_id nullable, round, position, competitor_a_id, competitor_b_id, source_a/source_b jsonb for "winner of X"/"2nd of group A", next_win_fixture_id, next_win_slot, next_loss_fixture_id, next_loss_slot, venue_id, court, starts_at, status, referee_id, result jsonb). Result jsonb holds sport scoring: sets/games for racquet sports, points/rounds for martial arts, goals for team sports.
- Byes: a fixture with one competitor and status "bye", auto-advanced. Seeding is `competitors.seed`, with a generator function in the app layer, not in SQL.
- `standings` as a view or computed query over fixtures using stage config for tiebreakers, not a stored table, to avoid drift.
- Batches/camps: `sessions` (event_id or category_id, starts_at, ends_at, capacity, venue_id, rule jsonb for recurrence) and `enrolments` (session_id or category_id, registration_id, status: confirmed|waitlisted|cancelled, waitlist_position) and `attendance` (session_id, registration_id, status, marked_by). Membership/passes could reuse registrations with a validity window.
- Series: `event_series` (organisation_id, name, slug) and events.series_id plus edition label. Multi-sport academies: `organisations` with events.sport and staff roles.
- Races: triathlon legs, HYROX stations and waves can stay in sport_details (ordered arrays), since they describe the course and not per-participant fixtures. Per-athlete split results would need a results table if timing is added.
- Protests/disputes: a small `fixture_disputes` table (fixture_id, raised_by, reason, status, resolution) is a suggestion only. No source documents how other tools handle this.

### Gaps
- No authoritative PostgreSQL reference schema for brackets was found. The search surfaced GitHub projects and blog posts, not vetted standards.
- No documented Indian federation seeding/weight rules were checked.
