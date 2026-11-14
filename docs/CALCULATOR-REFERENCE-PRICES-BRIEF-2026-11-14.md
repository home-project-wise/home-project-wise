# Calculator reference prices: brief for ChatGPT

**From:** Claude, Calculator Owner (assigned by the owner). **To:** ChatGPT (research, sources, QA). **Date:** 2026-11-14.
**Status:** step 1 requested (source list, no numbers yet). Nothing in this brief authorises publishing a price.

## 1. Owner direction (14 Nov 2026)
The calculator must serve two kinds of visitor:

- **Path A, "I know my prices".** The visitor knows what they want and has prices. The calculator only has to compute a good, honest figure. This already exists (the tabs and the project list in PR #338).
- **Path B, "Help me with prices".** The owner considers this the **majority**. The visitor knows what they want (room size, type of work) but not the prices. The site must help: collect the details, then show an **approximate range from trusted sources**, always labelled as approximate and "based on the latest sources we have". The visitor can replace it with their own price or two quotes at any time.

Audience order: **United States first, then English-speaking and Canadian visitors, then Europe.** Sources must be aimed at the audience they serve. Keep two groups of data: a **US-first group (US, then Canada and UK)** and a **European group**. Never show a US price to a European visitor or the reverse, and never convert currencies to fill a gap.

## 2. What the site will show (so your caveats match)
"Typical range: LOW–HIGH per UNIT. Approximate, from SOURCE NAME, observed DATE. Prices vary by store, region, brand, quality and time. Replace it with your own quote for a better estimate."

- If no sourced range exists for an item and region, the site says "No reference range yet; add your own price or two quotes." It never fills a gap.
- Proposed (owner may change): data older than 12 months is shown as "older data".
- Region is chosen by the visitor (US by default for US English), with the matching units and currency.

## 3. Scope, smallest useful batch first
Map to the calculator tabs. Start with the **US**, then Canada and UK, then Europe.

| Calculator area | Reference needed | US unit | Other regions |
|---|---|---|---|
| Paint | interior wall paint | per gallon | per litre |
| Flooring | laminate, luxury vinyl plank, engineered or solid hardwood, ceramic/porcelain tile, carpet | per square foot | per m² |
| Wallpaper | per roll, with the roll size/coverage stated | per roll | per roll |
| Electricity | average residential price | per kWh, by state | per kWh, by province or country |

Installation labour is **out of scope** for now. Add it only if you find an authoritative, dated source and tell the owner first.
For electricity, official statistics are preferred (for example the US Energy Information Administration, Eurostat, the UK regulator Ofgem, Statistics Canada or provincial regulators). **Verify the current correct source and table yourself; do not assume.**

## 4. Source rules
Priority: (1) government, statistical agencies and regulators; (2) published cost surveys by established organisations with a stated method and date; (3) retailer listings you observe yourself, one price per listing, with SKU, URL and retrieval date, respecting the site's terms (no bulk scraping); (4) editorial cost guides only with a stated method and date, recorded as `editorial-range`.

Not allowed: forums, anonymous blogs, SEO listicles without a method, undated figures, averages without a geography, AI-generated numbers, interpolation, currency conversion, anything behind a licence we do not hold.
Copyright: record facts (numbers, dates, publisher, URL). Do not copy tables or prose.
**Every number needs:** publisher, title, URL, geography, `observedAt` (the date the data refers to) and `retrievedAt` (the day you read it). If any is missing, leave the value empty (unknown). If sources conflict, record both and say so; do not average them.

## 5. Record format (matches the estimator engine's external-price rules)
```json
{
  "id": "US-paint-interior-gallon-001",
  "audience": "US",
  "category": "paint",
  "item": "Interior wall paint",
  "unit": "gallon",
  "currency": "USD",
  "low": null,
  "high": null,
  "kind": "regional-range",
  "source": {
    "id": "", "name": "", "publisher": "", "url": "",
    "geography": "", "geographyResolution": "national",
    "observedAt": "YYYY-MM-DD", "retrievedAt": "YYYY-MM-DD"
  },
  "notes": "what is included or excluded (materials only, sizes, tax)",
  "caveats": "",
  "reviewStatus": "researched"
}
```
`kind` is one of `regional-range`, `retailer-listing`, `editorial-range`, `government-benchmark`. Engine rules that Claude will test: `low` and `high` are non-negative and `low <= high`; the currency is three letters; the unit matches the item; `observedAt` is not in the future; a `retailer-listing` is a single price (`low == high`) with `productOrSku` and `retrievedAt`; geography and resolution are required. Numbers stay `null` until fully sourced.

## 6. Deliverables and ownership
1. **Step 1 (now):** a research memo in `docs/` listing, per region group, the candidate sources for each row of the table above, with licence/terms notes and what each source can and cannot support. **No prices yet.** The owner approves the source list first.
2. **Step 2:** the US first batch as `data/reference_prices.json`, in one data-only PR. ChatGPT owns this file; Claude only reads it and never edits a number.
3. **Step 3:** Canada and UK. **Step 4:** Europe.
4. Claude builds the loader, the region choice, the "use the typical range" action and a validation test that rejects any record breaking section 5. Problems found go back to ChatGPT through the operations room.
5. GitHub budget: one PR per step, nothing else.

## 7. Open questions for the owner (not blocking step 1)
- Staleness threshold (12 months proposed).
- Whether to add installation labour later.
- Whether to publish a short "How we get typical prices" methodology page.
