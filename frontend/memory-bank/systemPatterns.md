# System Patterns: GoAthletix

## System Architecture

```mermaid
graph TD
    subgraph Data Gathering & Extraction
        A[Instagram Ads/Profiles] --> D[Scraper Crawler Service - Python/Go]
        B[Minor/Major Websites] --> D
        C[WhatsApp/Club Groups] --> D
        D -->|Raw Unstructured Text| E[OpenRouter LLM Parser]
        E -->|Structured JSON| F[(PostgreSQL Database)]
    end

    subgraph User Discovery Platform
        F --> G[Next.js API Routes]
        G --> H[Next.js App / Discover Web UI]
        H -->|Redirect| I[Official Event Registration URL]
    end

    subgraph Agentic Operations Engine - Paperclip
        J[Paperclip Coordinator] --> K[Scraper Agent]
        J --> L[Editorial Agent]
        J --> M[Auditor Agent]
        K -->|Triggers Scrapes| D
        L -->|Enriches/Approves Listings| F
        M -->|Flags Dead Links/Spam| F
    end
```

## Key Architectural Patterns
- **Extraction Pipeline**: Use LLMs (via OpenRouter) as parser function calls. Instead of writing custom regex parser logic for 100+ different websites, scrapers pass raw HTML/text payloads to an LLM to output a standard Event JSON.
- **Verification Gate**: Scraped data is marked as `draft` or `unverified` in PostgreSQL. An editorial agent (manual or automated Agent) reviews the details before promoting to `published`.
- **Redirects Only**: Registration button does not trigger checkouts. It opens a clean outer redirect page with tracking (`/register?event_id=XYZ`) that links to the official page.
