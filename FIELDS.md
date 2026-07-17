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
| `leadPrice` | number \| null | Cheapest per-night price across all sources for the base stay. |
| `leadPriceTotal` | number \| null | Cheapest total price for the base stay. |
| `vendorCount` | integer | How many distinct booking sources sell this hotel. |
| `offers` | array | **The prices table** (powers the Prices view) — one row per booking source × stay-date × room-if-available. Includes the base stay **and every price-window date**. See the `offers[]` object below. |
| `vendors` | array | **Booking directory** — one object per source: `{source, bookingLink, official}` (no prices; prices are in `offers`). |
| `reviewsExtracted` | integer | Reviews this run pushed to the Reviews dataset for this hotel. |
| `markdownContent` | string | Self-contained hotel + price summary block, ready for LLM / RAG ingestion. |
| `scrapedAt` | string | ISO-8601 UTC timestamp of extraction. |

### `offers[]` object

The complete priced table (powers the **Prices** view) — one self-contained row per booking source × stay-date ×
room-if-available, in this column order:

| Field | Type | Description |
|---|---|---|
| `source` | string | Booking source name (e.g. `Booking.com`, `Agoda`, `Expedia.com`). The hotel's own direct-booking row is labelled **`Official site`** (Google returns it under the hotel name; we normalise it so `source` is never the hotel name). |
| `checkInDate` / `checkOutDate` | string \| null | The stay dates this priced row is for (base stay or a price-window date). |
| `roomName` | string \| null | Room type, when the source exposes per-room rates; `null` for a source-level row. |
| `perNight` | number \| null | Per-night price. |
| `total` | number \| null | Whole-stay total (= perNight × nights for the row's dates). |
| `currency` | string \| null | Currency of this row's prices. |
| `official` | boolean | `true` only for the hotel's own direct-booking (`Official site`) row. |
| `hotelUrl` | string \| null | Google Hotels deep link for the hotel (repeated per row so each row stands alone). |
| `bookingLink` | string \| null | Deep link to book on this source. |

### `vendors[]` object

| Field | Type | Description |
|---|---|---|
| `source` | string | Booking source name. |
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
