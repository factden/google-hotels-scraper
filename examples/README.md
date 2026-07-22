# Examples

Real public Google Hotels data collected with the actor (a New York City search, stay 2026-08-15 → 2026-08-16).

- **`input.json`** — a ready-to-run actor input (destination search + dates, with prices — which include the
  per-room rate matrix — and reviews enabled).
- **`hotels-output.sample.json`** — full hotel rows showing the complete field shape: the unified `offers[]`
  (Prices view — each row is a source × date × room-if-available, with rate + booking link), the price-free
  `vendors[]` booking directory (each source + booking link + official flag), and the LLM-ready
  `markdownContent` block. (`offers`/`vendors` are trimmed here for readability — a real run returns the full
  set, typically 15–20 sources and dozens of priced room rows per hotel.)
- **`hotels-sample.csv`** — hotel rows flattened to key columns (name, star class, rating, lead price, source/room
  counts, cheapest source), browsable right in GitHub's table view.
- **`reviews-output.sample.json`** — guest review rows with **exact `publishedAt`** dates and hotel **owner
  responses**.
- **`reviews-sample.csv`** — the same reviews, CSV-flattened (`markdownContent` omitted for readability).

Prices are date-scoped and in the run's currency (USD here). Run the actor for any destination or hotel:
**https://apify.com/factden/google-hotels-scraper?fpr=factden**
