#!/usr/bin/env bash
# Run the Google Hotels Scraper on Apify with curl, then fetch the dataset.
# Docs: https://apify.com/factden/google-hotels-scraper

TOKEN="<YOUR_APIFY_TOKEN>"   # https://console.apify.com/settings/integrations

# Run the actor synchronously and get dataset items (one row per hotel) back in one call
curl -s -X POST \
  "https://api.apify.com/v2/acts/factden~google-hotels-scraper/run-sync-get-dataset-items?token=${TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "searchQueries": ["hotels in New York City"],
    "checkInDate": "2026-08-15",
    "checkOutDate": "2026-08-16",
    "includePrices": true,
    "includeReviews": true,
    "maxResults": 20
  }'
