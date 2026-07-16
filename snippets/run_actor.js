// Run the Google Hotels Scraper on Apify and print the results.
//
// Install:  npm install apify-client
// Docs:     https://apify.com/factden/google-hotels-scraper

import { ApifyClient } from 'apify-client';

// Get your token from https://console.apify.com/settings/integrations
const client = new ApifyClient({ token: '<YOUR_APIFY_TOKEN>' });

const input = {
    searchQueries: ['hotels in New York City'],
    checkInDate: '2026-08-15',
    checkOutDate: '2026-08-16',
    includePrices: true,
    includeReviews: true,
    maxResults: 20,
};

// Start the actor and wait for it to finish
const run = await client.actor('factden/google-hotels-scraper').call(input);

// Fetch the resulting dataset (one row per hotel)
const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const row of items) {
    console.log(`${row.name} — ${row.currency} ${row.leadPrice} / night (${row.vendorCount} sources)`);
    for (const v of (row.vendors || []).slice(0, 3)) {
        console.log(`   ${v.source}: ${row.currency} ${v.pricePerNight}`);
    }
}
