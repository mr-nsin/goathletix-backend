# Ultra-Scale Engineering (100M+ Events) & AI Model Evaluation

To scale **GoAthletix** to hold and update **100M+ events** smoothly while optimizing API costs and performance, we must design a highly distributed read-heavy infrastructure and select the optimal AI engine.

---

## 1. Ultra-Scale Architecture (100M+ Events)

At a scale of 100 million events, running a standard relational database on a single server will crash under query load. We must split reads, writes, and searches:

```
                  [ Distributed Scrapers / Streams ]
                                  |
                                  v
                       [ Ingestion Queue: Kafka ]
                                  |
                                  v
                     [ Write DB: MongoDB / DynamoDB ]
                                  |
                     +------------+------------+
                     |                         |
                     v                         v
        [ Read DB: PostGIS Shards ]   [ Search: Elasticsearch ]
                     |                         |
                     +------------+------------+
                                  |
                                  v
                     [ Edge Caching: Cloudflare ]
                                  |
                                  v
                            [ Users (Web) ]
```

### A. Core Components
1.  **Write Layer (NoSQL Staging)**: We write raw crawled events into a distributed document store like **DynamoDB** or **MongoDB**. This handles millions of write requests per second without locking tables.
2.  **Read Layer (Sharded SQL)**: We sync verified events to a sharded PostgreSQL cluster (using **Citus** or **CockroachDB**) with **PostGIS** geo-indexing enabled on each shard.
3.  **Search Layer (Elasticsearch Cluster)**: We offload all search, filtering, and text querying to an **Elasticsearch** or **OpenSearch** cluster. This maintains sub-30ms filter query speeds on 100M+ records.
4.  **Edge Caching (Cloudflare CDN + Next.js ISR)**:
    *   Event detail pages are rendered statically once, then cached globally at 200+ edge nodes using Cloudflare.
    *   When an event detail changes, the ingestion engine triggers a purge of that specific cached page using Next.js **Incremental Static Regeneration (ISR)**.
    *   Result: 99.9% of user traffic never hits the main database; pages load in 15ms globally.

---

## 2. AI Selection: Gemini vs. ChatGPT vs. Claude vs. OpenRouter

For our **3rd Option (AI Parsing & Curation Engine)**, here is the comparative matrix:

| Feature | OpenRouter | Gemini (Native) | ChatGPT (Native) | Claude (Native) |
|---------|------------|-----------------|------------------|-----------------|
| **Pros** | Switch models with 1 line of code; built-in fallbacks. | 2M token context; cheapest; native image parsing. | Industry standard; highly reliable JSON outputs. | Best editorial/human tone; great formatting. |
| **Cons** | Extra network hop (100-200ms latency). | Bound to Google ecosystem. | Priced higher than Gemini for simple tasks. | Highest cost per token; rate limits are strict. |
| **Cost** | 🟢 Lowest (via DeepSeek/Llama) | 🟢 Very Low (Flash) | 🟡 Medium (4o-mini) | 🔴 High (Sonnet) |
| **Speed** | 🟡 Variable | 🟢 Fast | 🟢 Very Fast | 🟡 Moderate |
| **JSON Reliability** | 🟢 High | 🟢 Excellent | 🟢 Excellent | 🟡 Moderate |

---

## 3. Recommendation

For a 100M+ event system, we recommend a **Hybrid Model using OpenRouter**:

1.  **For Scraper Parsing (Townscript, Instagram, raw HTML) [OpenRouter]**:
    *   *Model*: **Gemini 1.5 Flash** or **DeepSeek-Chat** via OpenRouter.
    *   *Why*: When parsing millions of pages, token costs are your largest expense. Gemini Flash and DeepSeek are incredibly cheap, extremely fast, and support strict JSON schema output. Using OpenRouter allows you to switch between them instantly if one suffers an outage or changes pricing.
2.  **For Content Curation (Descriptions, SEO summaries, newsletters) [Anthropic Claude]**:
    *   *Model*: **Claude 3.5 Sonnet** (via OpenRouter or native).
    *   *Why*: Anthropic models write the most human, engaging sports summaries, avoiding generic AI words (like "delve", "testament", "revolutionize"). This builds user trust.
3.  **For User Memory & Dynamic Prefills [Mem0 + Llama 3 8B]**:
    *   *Why*: Simple, local user preferences can be handled by lightweight open-source models at zero cost.
