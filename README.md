# Google Hotels Scraper

> Scrape **Google Hotels** at scale — hotel **discovery**, live **per-night prices**, the full **OTA price ladder** (Booking.com, Agoda, Expedia, Hotels.com, Priceline and more) with **booking links**, **per-room rates**, **star class**, **guest ratings & reviews**, and a per-row **LLM-ready markdown** block. **No code, no login, no Google API key.** Runs on [Apify](https://apify.com/factden/google-hotels-scraper?fpr=factden).

[![Run on Apify](https://img.shields.io/badge/Run%20on-Apify-00b04f?logo=apify&logoColor=white)](https://apify.com/factden/google-hotels-scraper?fpr=factden)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

This repo is the **developer entry point** for the Google Hotels Scraper actor: the output shape, copy-paste API snippets, a full [field dictionary](./FIELDS.md), and a short [how-to](./HOWTO.md). The actor itself runs on Apify — no login, no Google API key, no proxy or anti-bot setup required.

**▶ [Run it on Apify →](https://apify.com/factden/google-hotels-scraper?fpr=factden)**

---

## What it extracts

Give it a **destination search** (e.g. `hotels in New York City`) and/or **exact hotels** (by name, Google Maps/Hotels link, or ID), pick your **dates and occupancy**, and get two structured datasets:

- **Hotels** — one row per hotel: name, star class, guest rating, review count, property type, coordinates, the **lead per-night price**, a complete **`offers[]` prices table** (one row per booking source × stay-date × room-if-available — with booking links, and every price-window date folded in), a price-free **`vendors[]` booking directory**, Google entity token / CID, and an LLM-ready `markdownContent` block.
- **Reviews** *(optional)* — one row per guest review: reviewer, rating, **review text**, **exact publish date**, the hotel's **owner response**, and an LLM-ready `markdownContent` block.

### Two things you won't find in most Google Hotels scrapers

💰 **The whole OTA price ladder in one per-hotel row** — not just one lead price, but *every* booking source Google shows (typically 15–20: Booking.com, Agoda, Expedia, Hotels.com, Priceline, Trip.com, KAYAK, Vio, eDreams…), each with its rate and a direct booking link — nested on a single row, no row-explosion.

🤖 **Discovery + prices + reviews in one actor** — most scrapers do prices *or* reviews. This one paginates a destination search, prices the full ladder, and pulls reviews (with **exact dates + owner responses**) — each row carrying `markdownContent` for direct RAG ingestion.

---

## Quick start (API)

```python
from apify_client import ApifyClient

client = ApifyClient("<YOUR_APIFY_TOKEN>")
run = client.actor("factden/google-hotels-scraper").call(run_input={
    "searchQueries": ["hotels in New York City"],
    "checkInDate": "2026-08-15",
    "checkOutDate": "2026-08-16",
    "includePrices": True,
    "includeReviews": True,
    "maxResults": 20,
})
for row in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(row["name"], row["leadPrice"], row["currency"], f'({row["vendorCount"]} sources)')
```

More: **[Python](./snippets/run_actor.py)** · **[Node](./snippets/run_actor.js)** · **[curl](./snippets/run_actor.sh)**

---

## Output

Real sample output lives in **[`examples/`](./examples)**:

- [`examples/hotels-sample.csv`](./examples/hotels-sample.csv) — hotel rows with the lead price + source counts — browse it right in GitHub's table view
- [`examples/hotels-output.sample.json`](./examples/hotels-output.sample.json) — full hotel rows incl. the `offers[]` prices table, `vendors[]` directory, and `markdownContent`
- [`examples/reviews-output.sample.json`](./examples/reviews-output.sample.json) — review rows with exact `publishedAt` + owner responses
- [`examples/input.json`](./examples/input.json) — a ready-to-run input

Every field is documented in **[`FIELDS.md`](./FIELDS.md)**. From Apify you can download results as **JSON, CSV, Excel, or HTML**.

---

## Use cases

- **Rate shopping & price comparison** — the full price ladder per hotel, across dates (all in `offers`), for your competitive set.
- **Revenue management** — monitor your own and competitors' rates and parity across booking sources.
- **Market & travel research** — discover every hotel in a destination with star class, ratings and price bands.
- **AI / RAG pipelines** — drop each hotel's or review's `markdownContent` straight into a vector DB.

---

## How much does it cost?

**Pay only for what you pull — no start fee.** Three events: **Hotel** $0.004 (each hotel returned), **Prices** $0.008 (each hotel priced — the full OTA ladder + per-room rates, per date), and **Review** $0.001 (each review). So a hotel with its full price ladder = **$0.012**; discovery-only = **$0.004**. Paid Apify plans get a lower per-event rate. Toggle prices/reviews off to run cheaper, and new accounts get **$5 in free credit** (~400 fully-priced hotels, or ~1,250 discovery-only). See the [actor page](https://apify.com/factden/google-hotels-scraper?fpr=factden) for current pricing.

---

## FAQ

**Is scraping Google Hotels legal?** The actor collects only **publicly available** data — the same results any visitor sees. As with any scraping, review Google's Terms and your local regulations, and use the data responsibly.

**Do I need a Google account or API key?** No. Everything runs inside the actor on Apify's infrastructure — no login, no key, no proxy setup.

**Can I price specific hotels instead of a whole city?** Yes — add exact hotels by **name**, Google Hotels/Maps URL, `maps.app.goo.gl` short link, `ChIJ…` place-id, or `ChkI…` entity token (a Maps link is CID-matched to the exact property), and set a "track prices until" date for a multi-date price window.

**Why do a few hotels have no price ladder?** Almost all do. A property with no bookable offers on your dates still returns its name, rating, star class and reviews — just an empty ladder.

**Found a bug or want a field added?** Open an issue here, or use the **Issues** tab on the [Apify actor page](https://apify.com/factden/google-hotels-scraper?fpr=factden).

---

## Other scrapers by FactDen

- [Expedia Reviews Scraper](https://apify.com/factden/expedia-hotel-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/expedia-hotel-reviews-scraper))
- [Hotels.com Reviews Scraper](https://apify.com/factden/hotels-com-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/hotels-com-reviews-scraper))
- [Trip.com & Ctrip Reviews Scraper](https://apify.com/factden/ctrip-trip-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/ctrip-trip-reviews-scraper))
- [G2 Reviews Scraper](https://apify.com/factden/g2-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/g2-reviews-scraper))
- [Indeed Jobs Scraper](https://apify.com/factden/indeed-jobs-scraper?fpr=factden)
  ([docs](https://github.com/factden/indeed-jobs-scraper))
- [All FactDen actors →](https://apify.com/factden?fpr=factden)

---

_The sample data in this repo is real public Google Hotels data, collected with the actor and provided for documentation/evaluation. Run the actor on Apify to pull data for any destination, at any scale._

_Found this useful? A star on this repo helps other people find it._
