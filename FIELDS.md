# Output fields

The Google Hotels Scraper produces **two datasets**. The **Hotels** dataset (also the default/billing dataset) has
one row per unique hotel, with the price ladder and rooms nested on the row. The **Reviews** dataset has one row per
guest review, with hotel context merged onto each row. Fields a given property doesn't provide are `null` (or an
empty array).

## Hotels dataset

| Field | Type | Description |
|---|---|---|
| `searchQuery` | string \| null | The destination query this hotel was discovered from (`null` in URL/ID mode). |
| `name` | string | Hotel name. |
| `entityToken` | string | Google Travel entity token (`ChkI…`) — the stable de-dup key + price/review anchor. |
| `cid` | string \| null | Google Maps feature-id in `0x…:0x…` (hex) form. |
| `cidDecimal` | string \| null | Decimal form of the Maps CID. |
| `hotelUrl` | string | Google Hotels deep link for this property. |
| `propertyType` | string \| null | e.g. `hotel`, `resort`, `apartment`, `vacation rental`. |
| `starClass` | number \| null | Hotel-class stars (1–5). |
| `rating` | number \| null | Average guest review score (/5). |
| `reviewCount` | integer \| null | Total reviews Google reports for the hotel. |
| `latitude` / `longitude` | number \| null | Coordinates. |
| `checkInDate` / `checkOutDate` | string \| null | Stay dates (`YYYY-MM-DD`). |
| `nights` | integer \| null | Nights in the stay. |
| `adults` / `children` / `rooms` | integer \| null | Occupancy used for pricing. |
| `currency` | string \| null | Currency of all prices in the row. |
| `leadPrice` | number \| null | Cheapest per-night price across all sources. |
| `leadPriceTotal` | number \| null | Cheapest total price for the whole stay. |
| `vendorCount` | integer | How many booking sources (OTAs) returned a price. |
| `roomOfferCount` | integer | How many room × source offers were found (for the sources that expose them). |
| `offers` | array | **The Prices view** — one row per bookable option: each source (roomName null), expanded to per-room rows where the source provides them. `{source, roomName, perNight, total, bookingLink, official}`. |
| `vendors` | array | **The OTA ladder** — one object per source: `{source, pricePerNight, priceTotal, bookingLink, official}`. |
| `roomOffers` | array | Per-room × source rates (for the sources that expose them): `{source, roomName, perNight, total, currency}`. |
| `ratesByDate` | array | Multi-date price window (from the "track prices until" date): `{checkInDate, checkOutDate, nights, leadPrice, currency, vendors[]}`. |
| `reviewsExtracted` | integer | Reviews this run pushed to the Reviews dataset for this hotel. |
| `markdownContent` | string | Self-contained hotel + price-ladder summary block, ready for LLM / RAG ingestion. |
| `scrapedAt` | string | ISO-8601 UTC timestamp of extraction. |

### `vendors[]` object

| Field | Type | Description |
|---|---|---|
| `source` | string | Booking source name (e.g. `Booking.com`, `Agoda`, `Expedia.com`, or the hotel's official site). |
| `pricePerNight` | number \| null | Per-night price from this source. |
| `priceTotal` | number \| null | Whole-stay total from this source. |
| `bookingLink` | string \| null | Deep link to book on this source. |
| `official` | boolean | Whether this is the hotel's official/direct site. |

## Reviews dataset

| Field | Type | Description |
|---|---|---|
| `entityToken` | string | Entity token of the hotel this review belongs to. |
| `hotelName` | string \| null | Hotel display name. |
| `hotelUrl` | string \| null | Google Hotels deep link for the hotel. |
| `reviewId` | string \| null | Unique review identifier. |
| `reviewerName` | string \| null | Reviewer display name. |
| `rating` | number \| null | Review rating. |
| `ratingMax` | integer \| null | Rating scale max (typically 5). |
| `reviewText` | string \| null | Review body (empty for rating-only reviews). |
| `publishedAt` | string \| null | **Exact review date** (ISO-8601 UTC), decoded from Google's timestamp. |
| `relativeDate` | string \| null | As Google shows it, e.g. `2 months ago`. |
| `ownerResponse` | object \| null | The hotel's reply: `{text, date}`, when present. |
| `source` | string | Review source (`google`). |
| `markdownContent` | string | Self-contained per-review markdown block for RAG ingestion. |
| `scrapedAt` | string | ISO-8601 UTC timestamp of extraction. |
