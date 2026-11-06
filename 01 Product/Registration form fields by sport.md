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
| Running / athletics | `city` · text · required; `name_on_bib` · text · optional; `club` · club · optional; `best_time` · text · optional (start-wave seeding) |
| Ticket has a qualifying standard | `qualifying_result` · text · required; `timing_certificate` · file · optional |
| Cycling | `bike_type` · select (Road, MTB, Hybrid, Gravel, Other) · required; `helmet_ack` · checkbox · required; `club` · club; `rider_id` · text · optional (Audax/ACP for brevets) |
| Trekking / adventure | `diet` · select (Veg, Non-veg, Jain, Vegan) · required; `experience` · select · required; `fitness_certificate` · file · optional |
| Swimming / triathlon | `swim_level` · select · required; `best_time` · text · optional; `club` · club |
| Racquet | `playing_level` · select · required; `federation_id` · text · optional; `partner_name` · text · doubles only; `club` · club (academy) |
| Under 18 on event day | `guardian_name` · text; `guardian_phone` · phone; `guardian_consent` · checkbox — all required |

Blood group is required for endurance, cycling, trekking, adventure and triathlon presets and optional elsewhere.

## Organiser configuration (later)

An event's own `event_form_fields` rows replace the preset when present; `category_id` scopes a field to one ticket type.
The builder UI should start from the sport preset above so organisers edit rather than build from scratch.
