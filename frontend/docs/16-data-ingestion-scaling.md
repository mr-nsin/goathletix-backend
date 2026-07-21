# GoAthletix Data Ingestion & Scaling Plan

A discovery platform with 15 events is dead on arrival. To build a robust utility for athletes, GoAthletix must contain **90%+ of all sports events** in target regions. 

This document details the automated architecture we will use to scale from 15 validation events to **1,500+ active events** across running, cycling, trekking, triathlons, and adventure sports.

---

## 1. The Scaling Target

| Sport Category | Source Platforms | Target Crawl Volume (Annual) |
|----------------|------------------|------------------------------|
| **Running (Road, Trail, Ultra)** | Townscript, IndiaRunning, BhaagoIndia, MeraEvents, Tuffman | 1,200+ events |
| **Cycling (Brevets, Races, Tours)** | Audax India Randonneurs (AIR), Townscript, local cycling clubs | 400+ events |
| **Trekking (Hikes, Expeditions)** | Indiahikes, Trek The Himalayas, Youth Hostels (YHAI), local operators | 800+ batches/events |
| **Triathlons & Duathlons** | IndiaRunning, Sportzify, local clubs | 50+ events |
| **Adventure & Fitness Events** | BookMyShow Sports, MeraEvents, Cult.fit | 200+ events |

---

## 2. Automated Crawler Architecture

We avoid writing custom scrapers for 100+ websites by separating **Data Gathering (Crawling)** from **Data Parsing (AI Normalization)**.

```
       +---------------------------------------------+
       |             CRAWLER STAGE (Python)          |
       |  - Scrapes raw listing pages & HTML source  |
       |  - Downloads page text dumps                |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       |             LLM PARSING STAGE               |
       |  - Sends text payload to OpenRouter API     |
       |  - Extracts standardized structured JSON    |
       +---------------------------------------------+
                              |
                              v
       +---------------------------------------------+
       |           DATABASE INGESTION STAGE          |
       |  - Deduplicates via Neon Postgres UUID      |
       |  - Saves to database with status 'draft'    |
       +---------------------------------------------+
```

---

## 3. Crawler Scripts Implementation

### A. Townscript Scraper (Category: Sports & Fitness)
- Target Page: `https://www.townscript.com/india/sports-fitness-events`
- Mechanism:
  - Use Python **Playwright** to handle infinite scroll.
  - Extract all event card URLs matching `https://www.townscript.com/e/*`.
  - Fetch raw page body for each URL.

### B. IndiaRunning Scraper
- Target Page: `https://www.indiarunning.com/` (calendar view)
- Mechanism:
  - Scrape month-by-month tables.
  - Parse event names, dates, cities, and link URLs.

### C. Audax India Randonneurs (AIR) Cycling Calendar Scraper
- Target Page: `https://www.audaxindia.in/event-calendar.php`
- Mechanism:
  - Crawl HTML table containing official Brevets (200K, 300K, 400K, 600K, 1000K rides).
  - Extract date, host club, distance, route details, and registration link.

---

## 4. The Paperclip Agent Execution Routine

We use **Paperclip** to run these crawlers in parallel background tasks:

```json
{
  "crawlers": {
    "townscript_crawler": {
      "command": "python3 scripts/townscript_scraper.py",
      "cron": "0 0 * * *",
      "output_folder": ".paperclip/staging_vault/townscript"
    },
    "indiarunning_crawler": {
      "command": "python3 scripts/indiarunning_scraper.py",
      "cron": "0 2 * * *",
      "output_folder": ".paperclip/staging_vault/indiarunning"
    },
    "audax_crawler": {
      "command": "python3 scripts/audax_scraper.py",
      "cron": "0 4 * * 0",
      "output_folder": ".paperclip/staging_vault/audax"
    }
  }
}
```

---

## 5. Ingestion & Normalization Script (OpenRouter Script)

This Python script reads raw scraped HTML text and uses OpenRouter to format it into our clean PostgreSQL schema:

```python
# scripts/parse_scraped_data.py
import os
import json
import requests

def parse_with_openrouter(raw_text):
    openrouter_url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json"
    }
    
    prompt = """
    Parse this raw sports event text. Extract event details as a JSON object with keys:
    {
      "event_name": "Name of event",
      "sport_type": "running/cycling/trekking/triathlon/adventure/fitness",
      "event_date": "YYYY-MM-DD",
      "city": "City name",
      "state": "State name",
      "venue": "Specific venue/start point",
      "distance_options": ["List of distances (e.g. 10K, 21.1K)"],
      "elevation_gain": "Elevation in meters (if mentioned)",
      "difficulty": "Beginner/Intermediate/Advanced/Expert",
      "price_range": "Price range (e.g. ₹500 - ₹1200)",
      "registration_url": "Official registration link",
      "organizer_name": "Name of organizer",
      "terrain": "Road/Trail/Mixed",
      "is_virtual": true/false
    }
    Only output JSON, no extra text.
    """
    
    payload = {
        "model": "google/gemini-flash-1.5",
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": raw_text[:8000]} # Truncate to avoid token limits
        ]
    }
    
    response = requests.post(openrouter_url, json=payload, headers=headers)
    return response.json()['choices'][0]['message']['content']
```
