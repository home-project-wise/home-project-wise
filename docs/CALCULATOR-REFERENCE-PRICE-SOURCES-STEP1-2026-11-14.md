# Calculator reference-price sources — Step 1 research memo

**Prepared for:** HomeProjectWise calculator owner  
**Prepared by:** ChatGPT — research, source verification and data QA  
**Date:** 2026-11-14  
**Scope:** Candidate sources only. **No prices or numeric reference records are supplied or authorized by this memo.**  
**Status:** Research proposal for owner approval; terms/licence checks remain a publication gate.

## Executive recommendation

Build the reference-price catalogue from country- and region-specific evidence, not from a single "global" price list.

1. **United States first:** use EIA for residential electricity by state; use manually observed, dated product listings from established US retailers for paint, flooring and wallpaper. Home Depot is a practical first retailer to validate; Lowe's is a second independent check.
2. **Canada and United Kingdom next:** Canada should use provincial/territorial utility and regulator tariffs for electricity, with the Canada Energy Regulator (CER) snapshot as a transparent cross-check only. The UK should use DESNZ official domestic energy statistics and Ofgem tariff-cap data with their different meanings clearly distinguished. For materials, use country-specific retailer listings.
3. **Europe after that:** do not treat Europe as one price region. Use Eurostat for household electricity where the country is covered, and country-specific retailers for material listings. Keep country, currency, tax treatment and product units distinct.

Retailer listings are not statistically representative market averages. If used, record them as individual `retailer-listing` observations (one SKU per record), never relabel them as an average or an independently measured typical range. A range may be published only when a defensible, dated survey or a sufficiently documented collection method supports it.

## 1. United States — first release group

### Electricity

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| U.S. Energy Information Administration (EIA), Electric Power Monthly, Table 5.6.A and 5.6.B — https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_a and https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_b | Monthly and year-to-date average residential retail electricity price by state, cents/kWh. | Preferred primary source. It is an average realised retail price derived from revenue divided by kWh sold, not an advertised tariff for an individual household. Record the reporting month and retrieval date; identify residential sector. |
| EIA explanation of retail prices — https://www.eia.gov/tools/faqs/faq.php?id=507&t=5 | Explains state/provider/sector coverage and that the average includes generation, transmission, distribution, taxes and fees. | Use as methodology/caveat support, not as a separate price observation. |

### Paint — interior wall paint, per US gallon

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| The Home Depot US product listings and product detail pages — https://www.homedepot.com/ | Individual interior wall-paint SKU prices, container size, finish/type and manufacturer-stated coverage where shown. | Use a specific gallon SKU, not a search-page promotional range. Record SKU/model, exact size, price, location/ZIP or store context, availability, coverage and retrieval date. Do not mix primer, exterior paint, specialty coatings or different container sizes without separate item definitions. |
| Lowe's US interior-paint listings and buying guidance — https://www.lowes.com/ | Independent product observations and coverage context. | Product pages, not the general buying guide, must support a price. Coverage guidance is not a price source. |
| BLS CPI average-price data — https://www.bls.gov/cpi/factsheets/average-prices.htm | Methodological reference for what BLS average prices are. | BLS publishes selected average prices, not a representative average price for interior wall paint. Do **not** use BLS CPI paint indexes as a dollar-per-gallon paint price. |

### Flooring — material-only, per square foot

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| The Home Depot US product pages/categories — https://www.homedepot.com/b/Flooring/N-5yc1vZaq7r | Individual product observations for laminate, luxury vinyl plank, engineered/solid hardwood, ceramic/porcelain tile and carpet when price and area/package quantity are both visible. | Convert a pack price to a per-square-foot listing only from the package's explicit coverage; retain original pack price and coverage in notes. Separate material from underlayment, trim, delivery and installation. |
| Lowe's US flooring product pages — https://www.lowes.com/c/Flooring | Independent SKU observations by flooring type. | Same single-listing rule; confirm whether displayed unit price is per sq ft or per pack. |
| The Home Depot laminate cost guide — https://www.homedepot.com/services/c/cost-install-laminate-floors/2942f0527 | Secondary context distinguishing laminate material, underlayment and total installed project cost. | It includes installation context and must not be used as a materials-only reference without isolating the explicitly stated material component. Not a substitute for dated SKU observations. |

### Wallpaper — per roll, with coverage

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| The Home Depot US wallpaper product pages — https://www.homedepot.com/b/Home-Decor-Wallpaper/N-5yc1vZbc0q | Individual roll price, roll dimensions, stated coverage, material, pattern repeat/match and SKU. | Preferred first source. Preserve single/double-roll distinctions and stated coverage. Never assume nominal roll dimensions equal usable wall coverage; pattern repeat and drop match can reduce effective coverage. |
| Lowe's US wallpaper product pages — https://www.lowes.com/ | Independent SKU observations where price and coverage are explicit. | If coverage or roll quantity is absent, do not create a normalized record. |

## 2. Canada — second release group

### Electricity

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| Canada Energy Regulator (CER), “How much do your neighbours across Canada pay for electricity?” — https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/market-snapshots/2026/market-snapshot-how-much-do-your-neighbours-across-canada-pay-for-electricity.html | Government-published residential comparisons for provinces/territories at representative monthly usage levels; explains underlying utilities, rates, fixed charges, distribution and assumptions. | Strong cross-check and possible `government-benchmark`, but it is a modelled representative-household comparison based on selected rate plans, not a population-weighted observed average. Taxes are excluded in the published calculation. Its source rates are generally from 2025 and differ by jurisdiction/date. Do not call it an average paid by all households. |
| Provincial/territorial utilities and regulators cited by CER (e.g. BC Hydro/BCUC, SaskPower, Manitoba Hydro/PUB, Ontario Energy Board, Hydro-Québec/Régie de l’énergie, NB Power/EUB, Nova Scotia Power/NSERBT, Maritime Electric/PEI regulator, Newfoundland Power/PUB, ATCO Electric Yukon, Naka Power/NTPC) | Official residential rate schedules, effective dates, fixed charges, tier thresholds and time-of-use rules. | Preferred underlying primary evidence for province-specific calculations. A per-kWh energy charge alone is not an all-in average price. State the assumed consumption and include/exclude fixed, delivery, regulatory, rebate and tax components explicitly. |
| Statistics Canada — https://www.statcan.gc.ca/ | Potential national statistical context and price-index checks. | No suitable current province-by-province residential all-in cents/kWh table was verified in this pass. Do not use a CPI/index series as a unit price. |

### Paint, flooring and wallpaper

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| The Home Depot Canada — https://www.homedepot.ca/ | Canadian product/SKU observations; paint pages commonly state 3.79 L container size and coverage in m². Flooring and wallpaper pages can be used only where package coverage and price are explicit. | Record CAD, province/store or postal-code context, SKU, container/package quantity, coverage, tax treatment and retrieval date. Do not reuse US listings or US dollars. |
| RONA Canada — https://www.rona.ca/ | Independent Canadian retailer listings for paint, flooring and wallpaper where comparable product detail is present. | Validate current listing availability and full unit/package data before accepting a record. |
| Canadian product/manufacturer technical sheets linked from retailer pages | Coverage, material specification, roll dimensions and product classification. | Technical sheets support product characteristics, not the retail price unless they themselves publish a price. |

## 3. United Kingdom — second release group

### Electricity

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| Department for Energy Security and Net Zero (DESNZ), Domestic energy price statistics / Quarterly Energy Prices — https://www.gov.uk/government/collections/domestic-energy-prices | Official statistics on average prices paid by UK households, with domestic market and payment-method context; data tables include unit-price/bill series. | Preferred source for average paid prices where a directly reported p/kWh series is available. Record period, payment method, fuel, tax treatment and UK/nation/region coverage. The average annual bill is not a unit price. |
| Ofgem, Energy price cap unit rates and standing charges — https://www.ofgem.gov.uk/your-energy-supply/your-energy-bill/energy-price-cap-unit-rates-and-standing-charges | Official regional electricity unit rates and daily standing charges for cap periods. | A regulated cap for specified tariff/payment conditions, not the average price actually paid by all households. Keep separate from DESNZ average-paid observations and disclose cap period, region, payment method and standing charge. |

### Paint, flooring and wallpaper

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| B&Q UK product listings — https://www.diy.com/ | Individual UK product prices; flooring listings often show pack coverage and £/m²; paint and wallpaper listings can support records where container/roll size and coverage are stated. | Record GBP, SKU, exact pack size/coverage, delivery/collection and local availability. B&Q listings may include third-party marketplace sellers; prefer items sold by B&Q or clearly identify seller. |
| Wickes — https://www.wickes.co.uk/ | Independent UK paint, flooring and wallpaper SKU observations. | Use exact product pages; exclude installation bundles and ambiguous multi-buy offers unless terms are recorded. |
| Screwfix — https://www.screwfix.com/ | Paint SKU observations and technical specifications where available. | More useful for paint and trade-oriented products than broad flooring/wallpaper coverage. |
| Wallpaperdirect — https://www.wallpaperdirect.com/ | Specialist wallpaper roll listings and dimensions/coverage. | Verify whether price is per single roll, double roll or a different ordering unit before recording. |

## 4. Europe — country-specific group, not one regional price

### Electricity

| Candidate source | What it can support | Limitations / handling |
|---|---|---|
| Eurostat dataset `nrg_pc_204`, household electricity prices — https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_204/default/table?lang=en | Official biannual national household end-user prices in €/kWh, broken down by standard consumption band and tax treatment. Covers EU countries and a wider set of reporting countries in the dataset. | Preferred comparable source for covered countries. Select one consistent household consumption band and tax-inclusive/exclusive view. Preserve semester, country, band, currency and tax selection. It is not subnational pricing. |
| National regulators/statistical agencies for countries not covered or where more local detail is required | Country-specific residential tariff/average-price series. | Identify one authoritative source per country. Do not fill gaps with a neighbouring country, an EU average or currency conversion. |

### Paint, flooring and wallpaper

| Country/source candidates | What they can support | Limitations / handling |
|---|---|---|
| France — Leroy Merlin France, https://www.leroymerlin.fr/ | French-market SKU listings for interior paint, flooring and wallpaper where package size, coverage and price are explicit. | EUR, French VAT/price display, exact store/availability, SKU and retrieval date. |
| Germany — BAUHAUS, https://www.bauhaus.info/; HORNBACH, https://www.hornbach.de/ | German-market paint, flooring and wallpaper SKU listings. | EUR and German-market availability; record package units and VAT display. |
| Spain — Leroy Merlin España, https://www.leroymerlin.es/ | Spanish-market material SKU listings. | EUR, Spain-specific listings and availability; do not reuse French catalogue prices. |
| Italy — Leroy Merlin Italia, https://www.leroymerlin.it/ | Italian-market material SKU listings. | EUR, Italy-specific SKU and availability. |
| Other European countries | The leading national DIY retailer and/or specialist wallpaper/flooring retailer in each country, selected only after checking product detail and public terms. | No Europe-wide retailer is assumed. Build a country source map before adding records. |

## 5. Comparability and record rules

- **Retailer observations are not market averages.** One observed SKU becomes one `retailer-listing` record with `low == high`, product/SKU, URL and retrieval date. Do not manufacture low/high ranges from a few unrelated listings.
- A `regional-range` or `editorial-range` requires a publisher's explicit dated range and stated geography/method. If the source does not provide that, leave the range unavailable.
- Keep paint separated by finish/quality tier and container size where material differences matter. A gallon and a litre are not interchangeable without a documented unit conversion; currency conversion is never allowed.
- Flooring records must identify the material subtype (laminate, LVP, engineered hardwood, solid hardwood, ceramic/porcelain tile, carpet) and whether underlay or accessories are included.
- Wallpaper records must identify roll type/size, stated coverage and pattern repeat/match when supplied.
- Electricity records must identify residential sector, geography resolution, period, consumption band or assumed usage, and whether fixed charges, delivery, levies, subsidies and taxes are included.
- The website's phrase “Typical range: LOW–HIGH per UNIT” must not be used for a single retailer listing. A single observed listing can be described only as an observed example price, unless the owner approves a different UI label.
- Where sources conflict, retain both records and explain the scope difference; do not average them.
- For data older than the proposed 12-month threshold, apply the owner-approved stale-data label only after the owner confirms the rule.

## 6. Licence, terms and collection controls

This pass identifies source candidates; it does **not** constitute legal clearance for republication or automated collection.

- Government/statistical sources: check each dataset's reuse licence, attribution requirements, API/download terms and any third-party components before reuse. EIA, CER, DESNZ/Ofgem and Eurostat should be attributed by publisher, dataset/title, period and URL. Do not assume that a government page's text, charts or underlying third-party data all share the same licence.
- Retailer sources: use manual, individual product observations only, consistent with the owner's no-bulk-scraping rule. Do not crawl catalogues, bypass access controls, reuse product photos/descriptions, or copy tables/prose. Capture factual fields only (price, SKU, size, coverage, seller, location and dates). Check each retailer's current terms before any repeatable automated collection.
- If a retailer's terms prohibit the intended reuse, do not use that source; seek a permitted alternative or leave the item unavailable.
- Keep screenshots/notes internally only if permitted; do not republish retailer creative assets.

## 7. Recommended approval decision

Approve the following source hierarchy for the first data batch:

1. **US electricity:** EIA monthly residential state table (5.6.A), with 5.6.B as a year-to-date cross-check.
2. **US paint/flooring/wallpaper:** manual dated SKU observations from Home Depot US, with Lowe's as an independent comparator; only create a numeric range later if an explicit method and sufficient observations are approved.
3. **Canada electricity:** CER snapshot as a clearly labelled government benchmark, or direct province utility/regulator schedules if the owner requires an actual all-in representative price. Do not describe CER's modelled values as population averages.
4. **UK electricity:** DESNZ average-paid series as primary; Ofgem price-cap rates as a separate cap-type source.
5. **Europe electricity:** Eurostat `nrg_pc_204` by country and consistent consumption band.
6. **Materials outside the US:** country-specific retailer listings (Home Depot Canada/RONA; B&Q/Wickes/Wallpaperdirect; Leroy Merlin national sites/BAUHAUS/HORNBACH), subject to terms checks and explicit product units.

**No price values have been entered. No record has been written to `data/reference_prices.json`. Approval is requested before Step 2.**
