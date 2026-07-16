# How to scrape Google Hotels prices & reviews (the easy way)

Scraping Google Hotels directly is painful: the data lives behind Google's internal, obfuscated APIs with
TLS fingerprinting, and a price ladder spread across several response containers. This guide
skips all of that by using the [Google Hotels Scraper](https://apify.com/factden/google-hotels-scraper?fpr=factden)
actor on Apify — no login, no Google API key, no proxy setup, no anti-bot tuning.

## 1. Get an Apify token

Create a free [Apify](https://console.apify.com/sign-up?fpr=factden) account and copy your API token from
**Settings → Integrations**. New accounts include free credit.

## 2. Run it from the Console (no code)

1. Open the [actor page](https://apify.com/factden/google-hotels-scraper?fpr=factden) and click **Try for free**.
2. The input is pre-filled with an example search. Leave it or replace it with your own destination and dates.
3. Click **Start**. A small run finishes in about a minute.
4. Download results from the **Output** tab as JSON, CSV, or Excel.

## 3. Choose your input

**Search a destination** — type it in **Search queries**, exactly as you would on Google Hotels, e.g.
`hotels in New York City`, `Paris 5 star hotels`, `resorts in Bali`. Use a specific, unambiguous destination — a
broad one-word term can pull in similarly-named places elsewhere.

**Or price specific hotels** — paste any of these into **Hotel URLs / IDs**: a Google Hotels/Travel URL, a Google
Maps place URL, a `maps.app.goo.gl` short link, a numeric CID (or `cid=`/`ludocid=`), a `0x…:0x…` feature-id, a
`ChkI…` entity token, or a `ChIJ…` Maps place-id. Add **extra check-in dates** to reprice the same hotels across a
range (`ratesByDate`).

## 4. Pick what to pull

- **Include prices** (default on) — the lead price + the full OTA ladder with booking links. Needs check-in/out dates.
- **Include per-room prices** — the room × source rate matrix.
- **Include reviews** — guest reviews (exact dates + owner responses) into the separate `reviews` dataset.

Filters (`minPrice`/`maxPrice`/`minGuestRating`) are applied on the accurate price; star class, amenities and
property type refine the search itself.

## 5. Run it from code

Copy-paste snippets: **[Python](./snippets/run_actor.py)** · **[Node](./snippets/run_actor.js)** ·
**[curl](./snippets/run_actor.sh)**. The Python one, in short:

```python
from apify_client import ApifyClient

client = ApifyClient("<YOUR_APIFY_TOKEN>")
run = client.actor("factden/google-hotels-scraper").call(run_input={
    "searchQueries": ["hotels in New York City"],
    "checkInDate": "2026-08-15",
    "checkOutDate": "2026-08-16",
    "includePrices": True,
})
for row in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(row["name"], row["leadPrice"], row["currency"])
```

## 6. Schedule & integrate

From the actor page you can put it on a **Schedule** (e.g. reprice your competitive set daily and diff the ladder
over time) and wire **webhooks** or native integrations (Make, Zapier, n8n, Google Sheets, Slack) to route results
downstream. Every row carries `markdownContent` for direct RAG ingestion, and the actor is callable from AI agents
via the Apify MCP server.

Full field reference: **[FIELDS.md](./FIELDS.md)**.
