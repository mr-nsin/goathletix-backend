# GoAthletix Sports Taxonomy & Category Roadmap

To structure our database schema, filters, landing page, and search index, we define the official phase-by-phase sports taxonomy. This maps categories, sub-categories, and targets for our ingestion engines.

---

## The Master Categorization Table

| Primary Category | Sub-Categories (Tags) | Phase | Target Ingestion Sources |
|------------------|----------------------|-------|--------------------------|
| **Running** | Marathons, Half marathons, 10K runs, 5K runs, Ultra marathons, Trail runs, Night runs, Charity runs, Corporate runs, Walkathons | **Phase 1** | Townscript, IndiaRunning, BhaagoIndia, MeraEvents, Tuffman India |
| **Cycling** | Road cycling races, Gran Fondos, MTB races, Gravel races, Audax rides (BRMs), Cyclothons, Bike tours, Endurance rides, Corporate cycling | **Phase 2** | Audax India Randonneurs (AIR), Deccan Cliffhanger, Tour of Nilgiris, Townscript |
| **Triathlon** | Triathlons, Duathlons, Aquathlons, Ironman events, Obstacle races, Adventure races | **Phase 3** | Ironman India/Goa, Spartan India, IndiaRunning, Sportzify |
| **Trekking** | Treks, Expeditions, Hiking events, Mountain challenges, Peak climbing, Adventure camps, Nature trails | **Phase 4** | Indiahikes, Trek The Himalayas, Youth Hostels Association (YHAI), local operators |
| **Fitness** | Yoga festivals, Fitness expos, CrossFit competitions, Functional fitness events, Bodybuilding events, Sports festivals, Wellness retreats | **Phase 5** | Cult.fit, local gyms, Fit India, MeraEvents |
| **Racquet** | Pickleball tournaments, Badminton tournaments, Tennis tournaments, Table tennis events, Squash tournaments, Amateur leagues | **Phase 6** | Playo, Hudle, local clubs/arenas |
| **Water** | Swimming competitions, Open water swimming, Kayaking, Rowing, Surfing, Sailing | **Phase 7** | National swimming associations, local surf clubs (Goa/Mangalore) |
| **Adventure** | Skiing, Snowboarding, Ice marathons, Desert rallies, Adventure races, Ultra endurance events | **Phase 8** | Himalayan mountaineering clubs, local rally associations, Spartan |

---

## Phase-by-Phase Integration Strategy

### **Phase 1: Running (Start Here)**
* **Focus**: Capture the core market. Over 70% of organized amateur participation in India is in running events.
* **DB Schema Config**: Event distance fields are stored as numerical values (in km) to allow range filters, alongside categorical tags (e.g., `["half-marathon", "trail-run"]`).

### **Phase 2: Cycling**
* **Focus**: Leverage the structured Audax/BRM network. Audax rides have strict dates and registration URLs managed centrally.
* **Examples**: Deccan Cliffhanger, Tour of Nilgiris, AIR Brevets.

### **Phase 3: Triathlon & Multi-sport**
* **Focus**: Premium, high-paying demographic. Triathletes travel long distances and plan their calendar 6-12 months ahead.
* **Examples**: Ironman Goa, local Duathlons.

### **Phase 4: Trekking & Outdoor**
* **Focus**: Batch-based events. Treks run almost weekly during peak seasons. The ingestion engine must support "recurring departures/batches" rather than just a single annual date.

### **Phase 5: Fitness Events**
* **Focus**: Focus on wellness expos and fitness festivals.

### **Phase 6: Racquet Sports**
* **Focus**: Amateur tournaments (especially the rapid rise of Pickleball in Indian metros).

### **Phase 7: Water Sports**
* **Focus**: Curation of swimming and coastal adventure races.

### **Phase 8: Winter & Adventure Sports**
* **Focus**: Extreme events (Manali/Auli skiing, Ladakh ice marathons, desert rallies).

---

## Database Schema Representation (PostgreSQL Enums)

We represent this taxonomy using PostgreSQL enums and array columns to support clean filtering:

```sql
-- Core sports category enum
CREATE TYPE primary_sport_category AS ENUM (
  'running',
  'cycling',
  'triathlon',
  'trekking',
  'fitness',
  'racquet',
  'water',
  'adventure'
);

-- Sub-category details are stored as text tags in a PostgreSQL array (e.g., tags = ['MTB', 'Endurance'])
-- to allow flexible filtering without complex join tables.
```

---

## Scope Expansion (2026-09): Multi-Sport, Youth Competitions & Training

**Product decision:** GoAthletix broadens from an endurance/adventure aggregator to a **multi-sport discovery + youth-competition + training platform** — while keeping endurance as the launch wedge (Phases 1–8 above ship first). This adds two things the original 8 categories don't cover: **competitive sports with strong kids/junior participation** (e.g. **skating**), and a **training/coaching layer** (academies, coaches, camps).

### New primary categories (Phase 9+)

| Primary Category | Sub-Categories (Tags) | Kids/Youth relevance | Typical organisers |
|------------------|----------------------|----------------------|--------------------|
| **Skating** | Inline/roller speed skating, Quad, Artistic skating, Roller hockey, Skateboarding | 🔴 Very high — school & district/state meets | Roller Skating Federation of India, school/district associations, rinks |
| **Athletics** (track & field) | Sprints, Middle/Long distance, Relays, Jumps, Throws, Race walking, Cross-country | 🔴 Very high — school & age-group meets | AFI, school games federations, district athletics assns |
| **Gymnastics** | Artistic, Rhythmic, Aerobic, Trampoline | 🔴 Very high | Gymnastics Federation of India, academies |
| **Martial Arts** | Karate, Taekwondo, Judo, Boxing, Wrestling, Kalaripayattu, Fencing | 🔴 Very high | Style federations, dojos/academies |
| **Team Sports** | Football, Basketball, Cricket, Volleyball, Hockey, Kabaddi, Kho-Kho | 🟠 High — school leagues & academies | Schools, academies, district bodies |
| **Mind Sports** *(optional)* | Chess, and other board/mind competitions | 🟠 High — scholastic circuits | Chess assns, schools |

> Existing categories already carry youth relevance too — **Racquet** (badminton/TT), **Water** (swimming), **Cycling**, and **Running** all run age-group events. The new categories mainly add the *competitive, coached, school-linked* disciplines that are the heart of the kids market.

### New dimension: Age / Audience categories

Kids and competitive sports are organised by **age group**, not distance. Add an audience axis, filterable and shown on cards:

```sql
CREATE TYPE age_category AS ENUM (
  'kids',        -- e.g. U8 / U10 / U12
  'sub_junior',
  'junior',
  'youth',
  'open',        -- adult / all-ages
  'masters'
);
-- Events can span several groups → store as an array column:
-- ALTER TABLE events ADD COLUMN age_categories age_category[] DEFAULT '{open}';
```

### New entity: Training & Academies (feeds the Services pillar in doc 21)

Kids competitions imply **training demand**. Introduce a first-class `training_centers` entity (academies, coaches, camps):

```sql
-- training_centers: id, name, sport_type[], age_categories age_category[],
--   city, state, geo_location, is_certified, contact, website, description
```
This powers "Training centers near you" and "Academies for <sport>" surfaces, and links coaches ↔ events ↔ clubs.

### Required schema changes (planned migration)

1. **Extend the sport enum** (Postgres allows additive `ADD VALUE`):
   ```sql
   ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'skating';
   ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'athletics';
   ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'gymnastics';
   ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'martial_arts';
   ALTER TYPE sport_category ADD VALUE IF NOT EXISTS 'team_sports';
   -- 'mind_sports' optional
   ```
   The backend DTO (`@IsEnum(SportCategory)`) and the frontend `sportTaxonomy.ts` + `sportIcons.json` must be regenerated/extended to match, or new-category filters return 400.
2. **Add `age_categories`** (enum array) to `events`, plus a filter param.
3. **Create `training_centers`** table + read API.

### Positioning note

This makes GoAthletix a **family sports platform**, not just an endurance-athlete tool: a parent can find a *skating competition* for a 10-year-old **and** the *academy that trains for it*, in the same place. That is a genuinely under-served combination in India and strengthens the Community (clubs/schools) and Services (training) pillars in `21-platform-expansion-vision.md`.

