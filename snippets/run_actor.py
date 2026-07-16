"""Run the Google Hotels Scraper on Apify and print the results.

Install:  pip install apify-client
Docs:     https://apify.com/factden/google-hotels-scraper
"""

from apify_client import ApifyClient

# Get your token from https://console.apify.com/settings/integrations
client = ApifyClient("<YOUR_APIFY_TOKEN>")

run_input = {
    "searchQueries": ["hotels in New York City"],
    "checkInDate": "2026-08-15",
    "checkOutDate": "2026-08-16",
    "includePrices": True,
    "includeReviews": True,
    "maxResults": 20,
}

# Start the actor and wait for it to finish
run = client.actor("factden/google-hotels-scraper").call(run_input=run_input)

# Iterate the resulting dataset (one row per hotel)
for row in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(f'{row.get("name")} — {row.get("currency")} {row.get("leadPrice")} / night '
          f'({row.get("vendorCount")} sources)')
    for v in (row.get("vendors") or [])[:3]:
        print(f'   {v.get("source")}: {row.get("currency")} {v.get("pricePerNight")}')
