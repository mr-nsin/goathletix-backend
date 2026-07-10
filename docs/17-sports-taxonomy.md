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
