# Registration form fields by sport

Researched 2026-11-05 for GA-065. Drives the checkout participant form now and the organiser form builder later
(`event_form_fields`, migration 0022, already live).

## What IndiaRunning does (read on 2026-11-05)

- Bajaj Pune Marathon 2026 registration page: categories are split **by gender** ("Half Marathon - Men" / "- Women",
  women at a discount), each with inclusions (T-shirt, medals, timed bib, refreshments, e-certificate, goodie bag) and a
  tax-inclusive price. "+ Add" builds a cart, "Proceed" opens per-attendee forms ("Attendee 1 Details", progress bar).
- The attendee form is behind **phone-number OTP sign-in** ("Phone Number and Email ID are required to save details...";
  booking for someone else means logging in with their phone). We did not sign in, so the inner field list was **not
  read directly**.
- A third-party guide to the same race lists the inputs as personal details, emergency contact and T-shirt size, then
  payment by UPI, card or net banking ([fatmarathoner.com](https://fatmarathoner.com/bajaj-pune-marathon/)).

## Other evidence

- Tata Mumbai Marathon medical advisory: allergies, medical conditions, emergency contact name + mobile, ideally someone
  not running ([procam.in](https://tatamumbaimarathon.procam.in/Medical-Advisory.pdf)). TMM half marathon entry is
  against a **timing certificate**; the fastest certificate earns a better start wave.
- Vihaya (Indian registration platform) custom fields for runs: age, gender, DOB, T-shirt size, emergency contact,
  **blood group**, medical notes; organisers mark safety fields required
  ([vihaya](https://events.vihaya.app/marathon-registration-india)).
- Offline Indian marathon forms commonly ask for Aadhaar. **We do not collect ID numbers**: the ticket says which photo
  ID to bring to kit collection (`required_documents`).

## Field catalogue (maps to `event_form_fields.field_type`)

Core, always asked, stored in `tickets` columns: full name, email, mobile, gender, date of birth.

| Group | Fields (key · type · default) |
| --- | --- |
| Every physical event | `emergency_contact` · emergency_contact (name, mobile, relation) · required; `blood_group` · blood_group; `medical_conditions` · textarea · optional |
| Ticket includes a T-shirt | `tshirt_size` · tshirt_size · required (added automatically) |
| Every event with a kit or courier | `whatsapp` · phone · optional (with "same as mobile"); `address_line`, `city`, `state`, `pincode` · text/select · required for running and cycling, optional for trekking and swimming |
| Running / athletics | `city` · text · required; `name_on_bib` · text · optional; `club` · club · optional; `best_time` · text · optional (start-wave seeding) |
| Ticket has a qualifying standard | `qualifying_result` · text · required; `timing_certificate` · file · optional |
| Cycling | `bike_type` · select (Road, MTB, Hybrid, Gravel, Other) · required; `helmet_ack` · checkbox · required; `club` · club; `rider_id` · text · optional (Audax/ACP for brevets) |
| Trekking / adventure | `diet` · select (Veg, Non-veg, Jain, Vegan) · required; `experience` · select · required; `fitness_certificate` · file · optional |
| Swimming / triathlon | `swim_level` · select · required; `best_time` · text · optional; `club` · club |
| Racquet | `playing_level` · select · required; `federation_id` · text · optional; `partner_name` · text · doubles only; `club` · club (academy) |
| Under 18 on event day | `guardian_name` · text; `guardian_phone` · phone; `guardian_consent` · checkbox — all required |

Blood group is required for endurance, cycling, trekking, adventure and triathlon presets and optional elsewhere.

## Benchmark: Vedanta Pink City Half Marathon (read 2026-11-08)

Official registration site (`registration.pinkcitymarathon.com`, organiser Anybody Can Run, AIMS-certified). No sign-in
wall: the whole form is visible. Fields read directly from the page (nothing was entered or submitted):

| Section | What it asks | Notes |
| --- | --- | --- |
| Race category | Cards: Half Marathon 21.1 km (18+), Cool Run 10 km (15+), Dream Run 5 km (12+) | Min age shown on the card; a live "Registration summary" panel beside the form |
| Personal | Full name, email, **confirm email**, mobile, **WhatsApp number** with a "Same as mobile number" tick, gender (Male, Female, Other), date of birth, T-shirt size (S to XXL), **blood group (required)** | Every field required |
| Address | House no./street/locality, city, **state (dropdown of all states and UTs)**, country, 6-digit pincode | All required: used for kit courier and certificates |
| Emergency contact | Name, mobile | No relation field |
| Terms | One tick: medically fit, accepts risk and rules, authorises name and photo use | Single combined consent |

### Gap analysis against our checkout (GA-064/065)

| Vedanta asks | We had | Done 2026-11-08 |
| --- | --- | --- |
| Confirm email | No | Added for the booking contact (`emailConfirm`, must match) |
| WhatsApp + same as mobile | No | `whatsapp` phone field in every preset, "Same as mobile number" tick on the form |
| Address, state, pincode | City only | `address_line`, `city`, `state`, `pincode` in running and cycling (required) and trekking, swimming (optional); pincode must be 6 digits |
| State dropdown | n/a | `state` select with all 28 states, 8 UTs and "Other", searchable |
| Blood group, T-shirt, emergency contact | Yes | Unchanged |
| Combined consent tick | Separate waiver and terms ticks on the pay step | Kept (more explicit); no change |
| Country | Not asked | Not added: India only for now. Add when overseas entries open |

## Form controls (decided 2026-11-08)

Single-choice questions are **dropdowns with an icon on every option**, not rows of radio pills. Multiple-choice
questions stay as pills. The control is `components/checkout/Dropdown.tsx` (combobox + listbox, arrow keys, type-ahead,
Escape, and a search box when a list has more than 10 options, such as state).

| Field | Icons |
| --- | --- |
| Gender | Venus, Mars, Transgender, User (prefer not to say) |
| Relation (emergency contact) | Users (parent), Heart (spouse), Users (sibling), Smile (friend), User (other) |
| T-shirt size | Shirt |
| Blood group | Droplet (red) |
| State | Map pin |
| Sport selects | Bike (bike type), Utensils (diet), Mountain (experience), Waves (swim level), Trophy (playing level) |

Organiser-defined selects use the same dropdown. An option list over 10 items becomes searchable automatically.

## Organiser configuration (later)

An event's own `event_form_fields` rows replace the preset when present; `category_id` scopes a field to one ticket type.
The builder UI should start from the sport preset above so organisers edit rather than build from scratch.

### Organiser form builder: specification (build when the organiser dashboard starts, not before)

Status: **deferred**. Today every event uses the sport preset, or its own `event_form_fields` rows if any exist. The
dashboard work will give organisers a screen to change that. Requirements for it:

- **Start from the sport preset.** A new event opens with the preset's fields already listed; the organiser edits, they
  do not build from nothing. A "Reset to default" button restores the preset.
- **Per field:** show or hide, required or optional, label, help text, placeholder, option list (for dropdowns), and
  which ticket types it applies to (`category_id`; empty = all). Drag to reorder.
- **Add a field** of any type in the catalogue above: text, long text, number, date, dropdown, multi-select, tick box,
  phone, email, file upload, T-shirt size, blood group, emergency contact, club.
- **Locked fields.** Name, email, mobile, gender, date of birth, and the guardian block for under 18s cannot be
  removed. Safety fields (emergency contact, blood group) can be made optional but show a warning.
- **Live preview** of the participant form, with the real dropdowns, beside the editor.
- **Safe renames.** Answers are stored by `field_key`, so changing a label never orphans old answers. Deleting a field
  hides it from new bookings and keeps stored answers.
- **Data handling.** Organisers see answers only for their own events. Medical and ID-like answers are visible only to
  the roles that need them (medical team, kit desk) and are excluded from general exports. No ID numbers are collected.
- **Export** of all answers as CSV, with one column per `field_key`.
- **Premium hook.** Basic edits are free. Unlimited custom fields, conditional questions ("ask only if X") and file
  uploads can sit behind a plan later; keep the entitlement check in one place.
