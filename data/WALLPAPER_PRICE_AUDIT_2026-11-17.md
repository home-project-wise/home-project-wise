# Wallpaper price evidence audit — 2026-11-17

**Prepared by:** ChatGPT — calculator research/data owner  
**For:** HomeProjectWise calculator owner and Claude — calculator implementation owner  
**Parent handoff:** Issue #402 (under #362)  
**Scope:** Audit the 12 existing wallpaper records in `data/reference_prices.json`; no new market-wide price collection, no runtime data activation, no calculator code changes.  
**Repository baseline checked:** 193 total reference-price records; exactly 12 have category `wallpaper`. The other 181 records were not re-researched or modified.

## Executive finding

The existing 12 records are a useful starting inventory, not yet an approved eight-market price model. They cover all eight supported markets and contain useful product/coverage clues. Current source rechecks confirm several endpoints, but the sample construction and product-class comparability are uneven. Some source URLs are broad category pages rather than exact product pages; some observations are promotions or member-only prices; and the US IQR range does not retain the 12 underlying SKUs needed to reproduce it.

**Decision for data safety:** keep all 12 raw records at `autoEligible: false`. Do not change `data/reference_prices.json`, `data/reference_assumptions.json`, or any runtime code until the owner approves a documented method and the missing evidence is repaired.

A provisional per-area multiplication is mathematically possible, but the current evidence should not yet be presented as a normal/typical national price range. It is not enough to predict roll counts, especially for 4 m walls.

## Scope and no-duplication check

| Check | Result |
|---|---:|
| Total existing reference-price records | 193 |
| Existing wallpaper records | 12 |
| Other records left untouched | 181 |
| Markets represented | US, UK, CA, DE, FR, ES, IT, NL |
| Wallpaper records currently autoEligible | 0 |
| Runtime/data eligibility flags changed in this audit | 0 |

## Record-by-record audit

### United States — 5 existing records

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `US-wallpaper-nextwall-lenox-hill-2026-11-14` | NextWall NW56902, USD 34.99/roll, 30.75 sq ft | Home Depot search currently shows the exact model at USD 34.99/roll and 30.75 sq ft. | Price and nominal coverage reconfirmed; retain as a single SKU observation, not a market average. |
| `US-wallpaper-nextwall-distressed-brick-2026-11-14` | NextWall NW31700, USD 34.99/roll, 30.75 sq ft | Home Depot exact product result confirms model NW31700, USD 34.99 and 30.75 sq ft. | Price and nominal coverage reconfirmed; retain as a single SKU observation. |
| `US-wallpaper-galey-alix-coral-way-2026-11-14` | Galey Alix LX10005, USD 49.99/roll, 30.75 sq ft | The current search pass did not independently retrieve the exact product page/price. | Keep ineligible pending exact product URL and current price recheck. |
| `US-wallpaper-30-75sqft-roll-home-depot-top-listings-iqr-2026-11-14` | IQR USD 31.21–34.99 per approx. 30.75 sq ft roll; claimed 12 listings | The current category results confirm examples at USD 34.99 and 30.75 sq ft, but the 12 underlying SKUs and observations are not enumerated in the record. I cannot reproduce the IQR or verify that every sample item has the same coverage/class. | Do not use as an automatic range until all 12 sample SKUs, prices, coverage and calculation method are recorded. |
| `US-wallpaper-lowes-nextwall-lemon-30-75sqft-2026-11-14` | Lowe's NextWall NW36703, USD 34.99/roll, 30.75 sq ft | Stored URL is an exact product URL, but the current recheck did not return enough product detail to independently reconfirm both price and coverage. | Keep ineligible pending exact current-page confirmation. |

**US current source evidence:** Home Depot's current search result confirms NW31700 and NW56902 at USD 34.99/roll and 30.75 sq ft. Exact product result for NW31700: https://www.homedepot.com/p/308657449. The category/search result is useful for discovery but should not replace exact SKU links in records.

### United Kingdom — 1 existing record

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `UK-wallpaper-bq-listings-2026-11-14` | GBP 1.40–7.08/m² from selected B&Q listings | Current B&Q results show a low example at £6.29 and £1.40/m² for a 10 m self-adhesive PVC wallpaper, and a high example at £37.72 and £7.08/m² for a 10.05 m × 53 cm patterned non-woven wallpaper. The high example is sold/shipped by Bricoflor Ltd and is online-only. The two endpoints therefore differ in material/class, and the high endpoint does not match the stored note's description of a vinyl roll. | The arithmetic is consistent with the displayed £/m², but the range is a mixed-class selected-listing envelope, not a typical market range. Correct the high-end product-class note and retain the third-party seller/promotion caveats. Exact product pages should replace the category-only source URL. |

Current endpoint pages:
- Low example: https://www.diy.com/painting-decorating/wallpaper-wall-coverings/wallpaper.cat?Application+method=Self-adhesive&Material=Vinyl&Style=Modern
- High example: https://www.diy.com/departments/patterned-non-woven-wallpaper-10-05m-x-53cm-for-living-room-bedroom-and-hallway-ref-b386384/4051315538111_BQ.prd

### Canada — 1 existing record

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `CA-wallpaper-homedepot-listings-2026-11-14` | CAD 0.89–2.44/sq ft covered | Home Depot Canada currently shows traditional/non-pasted 56 sq ft rolls at CAD 49.98 and CAD 57.20 (about CAD 0.89–1.02/sq ft), while Galey Alix peel-and-stick listings show CAD 2.44/sq ft. These are materially different product classes. | Both ends are source-supported as observations, but the combined range mixes traditional and peel-and-stick. Keep class-separated; do not imply a single homogeneous price band. |

Current evidence:
- 56 sq ft traditional roll example, CAD 49.98: https://www.homedepot.ca/product/holden-basket-weave-beige-non-pasted-wallpaper-covers-56-sq-ft-/1001836882
- Current category evidence also shows CAD 57.20 / 56 sq ft and Galey Alix peel-and-stick at CAD 2.44/sq ft: https://www.homedepot.ca/en/home/categories/decor/wallpaper-and-supplies/wallpaper.html

### Germany — 1 existing record

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `EU-DE-wallpaper-hornbach-2026-11-14` | Non-woven wallpaper, EUR 7.95–19.95/roll; notes normalize examples to EUR 1.49–3.75/m² | Current HORNBACH search results show non-woven products at EUR 7.95/roll and EUR 1.49/m², and products at EUR 19.95/roll and EUR 3.75/m². HORNBACH states prices include VAT and may exclude shipping. | Price endpoints and normalized unit rates reconfirmed. Record exact SKU/product examples and roll coverage in provenance; keep as selected non-woven retail observations, not a national average. |

Current source: https://www.hornbach.de/s/Vliesfasertapete

### France — 1 existing record

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `EU-FR-wallpaper-leroymerlin-2026-11-14` | EUR 11.90–29.90/roll; notes use approx. 5.3 m² for standard 53 cm rolls | The stored URL is a broad promotional floor/wall covering page, not a direct wallpaper category or exact SKU page. Current Leroy Merlin results show multiple wallpaper classes and dimensions; the EUR 11.90 example found is a paintable wallpaper roll, while other EUR 29.90 products may have different widths/lengths. The original pair cannot be safely treated as one comparable non-woven 5.3 m² roll sample from the current evidence. | Source mapping and product comparability are insufficient. Replace with exact product pages and record the exact width × length, coverage, material and seller for both endpoints before proposing an automatic range. |

Better current discovery page (not a substitute for exact SKU links): https://www.leroymerlin.fr/produits/revetement-sol-et-mur/papier-peint-frise-et-fibre-de-verre/papier-peint/

### Spain — 1 existing record

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `EU-ES-wallpaper-leroymerlin-2026-11-14` | EUR 12.99–36.99/roll; examples nominally 10 m × 53 cm | Current Leroy Merlin results show a 53 cm × 10 m vinyl roll at EUR 36.99 (about EUR 6.98/m²) and a 53 cm × 10.05 m non-woven roll at EUR 12.99 (about EUR 2.45/m²). The low price is explicitly a time-limited online promotion; its displayed validity dates need checking at each future refresh. | Both examples and nominal coverage are supported, but the range mixes vinyl and non-woven and the low endpoint is promotional. Keep class and offer status explicit; not a national average. |

Current source: https://www.leroymerlin.es/productos/decoracion/papel-pintado-y-cenefas/todos-los-papeles-pintados/rollo-de-papel-pintado-p.html

### Italy — 1 existing record

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `EU-IT-wallpaper-leroymerlin-2026-11-14` | EUR 21.98–32.99/roll; approx. 5.33 m²/roll | Current Leroy Merlin results show an example at EUR 21.99 and another at EUR 32.99; product details show 53 cm × 10.05 m for the standard roll examples. | Correct the stored low endpoint from EUR 21.98 to EUR 21.99 only after owner approval and a data PR. Keep both as selected listings, not a market average. |

Current source: https://www.leroymerlin.it/prodotti/decorazione/carta-da-parati-e-adesivi-murali/carta-da-parati-per-soggiorno/

### Netherlands — 1 existing record

| Existing record | Stored observation | Recheck / finding | Audit disposition |
|---|---|---|---|
| `EU-NL-wallpaper-praxis-2026-11-14` | EUR 2.64–5.12/m², Praxis Plus promotional listings | Current Praxis results show 10.05 m × 52 cm non-woven products with member prices at EUR 2.64/m² and EUR 5.12/m², with several examples between them. The page explicitly marks Praxis Plus pricing and 25% promotions. | Endpoints reconfirmed as member-promotion prices. Do not show as an ordinary public shelf-price range; label membership/promotion conditions and check expiry on refresh. |

Current source: https://www.praxis.nl/collectie/behang-aanbieding

## Provisional unit normalization — research only, not runtime approval

For comparison only, the existing record notes imply these area-price envelopes. These are arithmetic normalizations of the existing observations, not new price observations and not approved runtime defaults.

| Market | Existing source basis | Provisional material price / m² | Main comparability limitation |
|---|---|---:|---|
| US | USD 31.21–34.99 / 30.75 sq ft | USD 10.92–12.25 | IQR sample list missing; current exact SKU confirmation incomplete; peel-and-stick sample only. |
| UK | GBP 1.40–7.08 / m² | GBP 1.40–7.08 | PVC self-adhesive low vs non-woven third-party high; promotional conditions. |
| CA | CAD 0.89–2.44 / sq ft | CAD 9.58–26.26 | Traditional wallpaper vs premium peel-and-stick. |
| DE | EUR 1.49–3.75 / m² | EUR 1.49–3.75 | Selected non-woven listings; exact SKUs should be added. |
| FR | EUR 11.90–29.90 / approx. 5.3 m² | EUR 2.25–5.64 | Existing source URL and comparable product coverage not sufficiently substantiated. |
| ES | EUR 12.99–36.99 / approx. 5.3 m² | EUR 2.45–6.98 | Non-woven promotion vs vinyl standard listing. |
| IT | EUR 21.98–32.99 / approx. 5.33 m² | EUR 4.12–6.19 | Low endpoint now observed at EUR 21.99; exact SKU details should be recorded. |
| NL | EUR 2.64–5.12 / m² | EUR 2.64–5.12 | Praxis Plus member promotion only. |

### Illustration against the owner's room

The approved example area remains correct: 15 m × 8 m × 4 m gives 184 m² gross wall area; deducting 6 m² of openings gives 178 m² net area for an area-based budget.

Multiplying 178 m² by the provisional rates above gives the following **research-only arithmetic**, not a customer-ready quote:

| Market | Provisional material-only arithmetic |
|---|---:|
| US | USD 1,945–2,180 |
| UK | GBP 249–1,260 |
| CA | CAD 1,705–4,675 |
| DE | EUR 265–668 |
| FR | EUR 400–1,004 |
| ES | EUR 436–1,242 |
| IT | EUR 734–1,102 |
| NL | EUR 470–911 |

This does not calculate rolls. A 4 m wall needs roll-specific cut-yield logic, and a total opening area without opening positions/dimensions cannot safely remove strips or predict offcut reuse. No generic waste percentage has been added. Paste, primer, tools, labour, delivery and unverified tax adjustments are not included.

## Recommended next data work

1. Keep the 12 source records and their `autoEligible:false` status unchanged.
2. Repair provenance before any approval:
   - US: enumerate the 12 products used for the IQR, or discard the IQR and use separate exact-SKU observations; recover exact Coral Way and Lowe's pages.
   - UK: preserve exact product pages and correct the high-end product-class description.
   - CA: separate traditional/non-pasted and peel-and-stick evidence into distinct product classes.
   - DE: add exact product URLs/SKUs and coverage for representative low/high examples.
   - FR: replace the broad promotional source with exact standard wallpaper product pages; do not mix paintable wall lining with decorative wallpaper unless explicitly treated as a separate class.
   - ES: preserve the promotion expiry and product class.
   - IT: verify exact SKU and correct EUR 21.98 to EUR 21.99 in a separately reviewed data change.
   - NL: mark prices as Praxis Plus member-only promotional prices and record the refresh/expiry check.
3. Decide whether the beginner estimate should be:
   - a broad, explicitly mixed product-sample envelope, or
   - separate beginner ranges by product class (traditional/non-woven, vinyl, peel-and-stick).
   
   The second is more honest but may require a simple product-class choice; if the user should not choose a class, a broad mixed envelope must be labelled as a rough sample range, never a typical national price.
4. Only after the owner chooses the method, create structured records in `data/reference_assumptions.json` with source links, exact normalization formulas, product-class scope, promotion/tax caveats, and `autoEligible:true` limited to `beginner-area-estimate-only`. Keep `packagePricingEligible:false` and `nationalAverage:false`.
5. Claude may then implement the price adapter. Roll counts remain unavailable unless each market's roll format and tall-wall yield assumptions are independently sourced and approved.

## Ownership / handoff

- **ChatGPT (research/data):** completed the first source recheck of all 12 existing wallpaper records; next research is limited to the specific provenance gaps listed above. No calculator-owned code changed.
- **Claude (implementation):** no new implementation action is requested until the owner approves the structured assumption method/data.
- **Owner:** choose whether the beginner estimate should use one clearly labelled broad sample envelope or separate product-class ranges. No price eligibility is enabled by this report.

**Status: AUDIT COMPLETE — DATA NOT APPROVED FOR AUTOMATIC USE.**
