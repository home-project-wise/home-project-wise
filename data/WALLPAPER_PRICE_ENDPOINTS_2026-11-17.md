# Wallpaper price endpoint handoff — 2026-11-17

**Prepared by:** ChatGPT — research/data owner  
**For:** Claude — calculator implementation owner; project owner  
**Parent:** Issue #402; evidence PR #411  
**Checked:** 2026-11-17 (retailer pages and search-indexed product pages; some pages expose dynamic prices and cached crawls, so recheck at checkout)  
**Method:** One low/high pair per market, using exact individual product pages and the owner's approved broad-sample-envelope approach. This is a small documented endpoint envelope, **not** a statistically representative national average.

## Results for the eight supported markets

Prices are per roll. The normalized area rate is calculated as roll price ÷ nominal roll area; for square-foot coverage, 1 sq ft = 0.09290304 m². Nominal coverage does not account for pattern repeat, trim, matching, offcuts, or waste.

| Market | Low endpoint | High endpoint | Normalized envelope | Product class / source notes |
|---|---|---|---:|---|
| US | **$34.99** NextWall Distressed Brick NW31700, 30.75 sq ft (2.856 m²): https://www.homedepot.com/p/308657449 | **$49.99** Galey Alix Coral Way LX10005, 30.75 sq ft (2.856 m²): https://www.homedepot.com/p/334613853 | **$12.25–$17.50/m²** | Both vinyl peel-and-stick rolls, Home Depot US. Exact product pages; current listings can vary by ZIP/store. |
| UK | **£31.67** Plain Self Adhesive Wallpaper, 10.05 m × 53 cm (5.33 m²): https://www.diy.com/departments/plain-self-adhesive-wallpaper-10-05m-x-53cm-for-living-room-bedroom-and-hallway/4051315502532_BQ.prd | **£37.72** Patterned Non-Woven Wallpaper Ref B386384, 10.05 m × 53 cm (5.33 m²): https://www.diy.com/departments/patterned-non-woven-wallpaper-10-05m-x-53cm-for-living-room-bedroom-and-hallway-ref-b386384/4051315538111_BQ.prd | **£5.94–£7.08/m²** | Both exact B&Q product pages; both sold/shipped by third-party Bricoflor Ltd, online-only (not stocked in B&Q stores). Low is self-adhesive vinyl; high is non-woven. |
| Canada | **CAD $49.98** Holden Basket Weave Cream, non-pasted, 56 sq ft (5.203 m²): https://www.homedepot.ca/product/holden-basket-weave-cream-non-pasted-wallpaper-covers-56-sq-ft/1001836880 | **CAD $74.89** GALEY ALIX Natural Reed The Alix, peel-and-stick vinyl, 30.75 sq ft (2.856 m²): https://www.homedepot.ca/product/galey-alix-natural-reed-the-alix-peel-and-stick-wallpaper/1001970077 | **CAD $9.61–$26.21/m²** | Exact Home Depot Canada product pages. Low is conventional non-pasted wallpaper; high is premium peel-and-stick vinyl. |
| Germany | **€18.75** A.S. Création Vliestapete 36911-2 Metropolitan Stories Betonoptik grau, 53 cm × 10.05 m (5.3265 m²): https://www.hornbach.de/p/vliestapete-36911-2-metropolitan-stories-betonoptik-grau/4694510/ | **€19.95** Grandeco Vliestapete A74602 Delphinium Forest blau, 53 cm × 10.05 m (5.3265 m²): https://www.hornbach.de/p/vliestapete-a74602-delphinium-forest-blau/12318403/ | **€3.52–€3.75/m²** | Both exact HORNBACH product pages, non-woven wallpaper. Prices include VAT; delivery may be additional. |
| France | **€34.40** Livingwalls intissé vinyl uni blanc, 53 cm × 10.05 m (5.3265 m²), sold/shipped by Profistuck: https://www.leroymerlin.fr/produits/papier-peint-intisse-vinyl-uni-blanc-53-cm-x-10-05-m-livingwalls-83782324.html | **€42.90** A.S. Création intissé vinyl capitonné gris clair, 53 cm × 10.05 m (5.3265 m²): https://www.leroymerlin.fr/produits/papier-peint-intisse-vinyl-capitonne-gris-clair-53-cm-x-10-05-m-a-s-creation-83744104.html | **€6.46–€8.05/m²** | Exact Leroy Merlin product pages. Low is third-party seller Profistuck; high is a Leroy Merlin listing. Both are vinyl-surface/non-woven-base products. |
| Spain | **€12.99** GRANDECOLIFE Bruma 1 vinyl, 53 cm × 10 m (5.30 m²): https://www.leroymerlin.es/productos/papel-pintado-vinilo-liso-bruma-1-grandecolife-de-53cm-x-10m-lavable-metodo-de-pegado-aplicacion-cola-en-pared-91290168.html | **€34.99** RASCH 452013 vinyl, 53 cm × 10 m (5.30 m²): https://www.leroymerlin.es/productos/papel-pintado-vinilo-liso-gris-452013-rasch-de-53cm-x-10m-lavable-apto-para-cocinas-banos-metodo-de-pegado-aplicacion-cola-en-pared-97665090.html | **€2.45–€6.60/m²** | Exact Leroy Merlin Spain pages; both vinyl wallpaper, sold by Leroy Merlin. The €12.99 page is labelled “Nuestro precio + bajo”; not the old time-limited €12.99 non-woven offer. |
| Italy | **€27.99** Carta da parati Foglie grigio, 53 cm × 10.05 m (5.3265 m²): https://www.leroymerlin.it/prodotti/carta-da-parati-foglie-grigio-53-cm-x-10-05-m-82643149.html | **€44.99** Carta da parati Tela bianco, 53 cm × 10.05 m (5.3265 m²): https://www.leroymerlin.it/prodotti/carta-da-parati-tela-bianco-53-cm-x-10-05-m-92448878.html | **€5.25–€8.45/m²** | Exact Leroy Merlin Italy pages; both vinyl on non-woven backing, sold/shipped by Leroy Merlin. |
| Netherlands | **€47.50** Dutch Wallcoverings non-woven, 10 m × 53 cm (5.30 m²): https://nl.bauhaus/vliesbehang/dutch-wallcoverings-vliesbehang/p/34294529 | **€73.50** Duro Bladeren Donkergroen non-woven, 53 cm × 10.05 m (5.3265 m²): https://www.praxis.nl/verf-behang-wandbekleding/behang/behangpapier/duro-behang-bladeren-donkergroen-53-cm-x-10-05-m/10442624 | **€8.96–€13.80/m²** | Exact BAUHAUS and Praxis product pages; both non-woven. Praxis page is a regular product page, not the Praxis Plus promotional collection. |

## US IQR — recovery result

The existing record says USD 31.21–34.99/roll, 12 products, approximately 30.75 sq ft each, median USD 34.99. I searched the current repository's default-branch files and code index for the stored lower quartile value, the IQR record identifier, and the known SKU identifiers. **No source list or calculation worksheet was found.**

The original 12 product SKUs, all 12 prices, inclusion/exclusion rules, observation snapshots, and quartile method are absent from the retained record. The IQR therefore **cannot be recovered or independently reproduced**. Do not use it, and do not claim the current two US endpoints recreate it. The new US low/high pair above is a separate exact-SKU sample envelope.

## Germany — individual pages now supplied

The two Germany endpoints above each have an individual HORNBACH product URL. The previously discussed €7.95/roll Vliestapete 6081-2 and its €7.45/roll bulk price at 12 rolls are deliberately not used in this pair because the exact individual product URL for that 6081-2 listing was not established in this pass. The €1.40/m² bulk price is explicitly excluded.

## Explicit exclusions and guardrails

- **US:** quarantine the old USD 31.21–34.99 IQR record; it is not reproducible. The current $34.99/$49.99 pair is a new two-SKU observation set, not an IQR.
- **UK:** do not use the £6.29 low listing from the earlier category scrape; its exact product page is now out of stock. The pair above uses two exact B&Q pages, both third-party online-only Bricoflor listings.
- **Canada:** the old CAD 0.89–2.44/sq ft range mixed traditional and peel-and-stick products and used a category-level endpoint. The new pair uses two exact product pages and preserves the class difference.
- **Germany:** exclude the €1.40/m² 12-roll bulk rate. The new selected non-woven pair uses exact individual product pages.
- **France:** quarantine the old €11.90–€29.90 range; its original exact SKUs and product comparability were not substantiated. Do not include paintable lining paper as decorative wallpaper.
- **Spain:** exclude the old time-limited €12.99 non-woven offer and the former €36.99 listing. The new endpoints are exact, ordinary vinyl product pages at the checked prices.
- **Italy:** the former €21.98 low is not retained; the exact selected pair is €27.99–€44.99. Do not silently restore the €21.98 value.
- **Netherlands:** exclude all Praxis Plus/member-only and temporary promotion prices in the old collection range (€2.64–€5.12/m²). The new pair uses regular product pages.

## Important interpretation for Claude

1. These are **observed product-price envelopes**, not national market averages, statistically representative samples, or guaranteed quotes. Label them “approximate sample price range” and show the checked date and “prices vary by product type and retailer”.
2. The pairs intentionally include a limited mix of wallpaper types where needed to keep the beginner path from asking the visitor to choose a technical class. Keep each endpoint's product class visible in data provenance; do not claim the pair is like-for-like.
3. Use the normalized €/m² or equivalent rate only for an **area-based material budget**. It does not yield a reliable number of rolls for a 4 m wall. Roll counts remain blocked pending sourced tall-wall cut-yield, pattern-repeat, trim and offcut assumptions.
4. This handoff is research evidence only. It does **not** approve a data registry change, does not set autoEligible true, and does not authorize runtime integration. All 12 existing wallpaper records remain autoEligible false until the owner approves the structured assumptions and a separate data PR.
5. Excludes paste, primer, tools, delivery, labour, tax adjustments beyond retailer-displayed prices, pattern-repeat losses, trim and waste unless already included in a retailer's stated coverage.

**Status:** Eight market endpoint pairs supplied with exact individual product URLs. US IQR not recoverable. No reference-price data, assumptions, eligibility flags, calculator code, or deployment changed.
