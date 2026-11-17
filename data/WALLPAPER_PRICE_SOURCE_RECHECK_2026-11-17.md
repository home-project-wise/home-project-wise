# Wallpaper price-source follow-up — 2026-11-17

**Prepared by:** ChatGPT — calculator research/data owner  
**Related audit:** `data/WALLPAPER_PRICE_AUDIT_2026-11-17.md`  
**Scope:** Follow-up only on the specific evidence gaps in the 12 existing wallpaper records. No other reference-price records were reviewed. No price registry, assumptions, eligibility flag, or calculator code changed.

## Confirmed US product pages

The two US records that were previously pending exact-page confirmation are now independently supported by exact retailer product pages:

| Existing observation | Current exact-page evidence | Result |
|---|---|---|
| Galey Alix Coral Way, model LX10005 | https://www.homedepot.com/p/334613853 | USD 49.99/roll; coverage 30.75 sq ft; vinyl peel-and-stick. |
| NextWall Lemon, model NW36703 | https://www.lowes.com/pd/NextWall-30-75-sq-ft-Lemon-Vinyl-Floral-Self-adhesive-Peel-and-Stick-Wallpaper/5381765 | USD 34.99/roll; coverage 30.75 sq ft; 20.5 in × 18 ft; vinyl peel-and-stick; 20.87 in half-drop repeat. Home Depot also has the same model at https://www.homedepot.com/p/314366865 for USD 34.99/roll and 30.75 sq ft.

These are exact SKU observations, not representative market averages. The listed prices are live retailer observations and can change.

### US IQR record — do not reconstruct from a category page

The stored IQR of USD 31.21–34.99/roll over 12 listings remains non-reproducible: the original 12 SKU identifiers, observation values, inclusion criteria, and quartile calculation are not preserved. The current Home Depot NextWall category page exposes many products, but it is not evidence that those are the same 12 products used in the original calculation. Do not infer or backfill the missing sample.

**Recommended disposition:** retain the IQR record as audit-only or replace it later with a newly enumerated, timestamped sample. A replacement sample must list every SKU, roll dimensions/coverage, material/application class, live price, seller, and a documented quartile method. Do not mix 30.75 sq ft standard NextWall rolls with 31.35 sq ft or 49.99 premium products without declaring that mixed scope.

Current discovery page: https://www.homedepot.com/b/Home-Decor-Wallpaper-Wallpaper-Rolls/NextWall/N-5yc1vZ2fkowkwZojk

## France — exact product pages found; original range not validated

The prior stored endpoints EUR 11.90–29.90 per roll cannot be retained as a verified decorative-wallpaper range from the broad source URL. A fresh exact-page pass found these current examples, both with standard 53 cm × 10.05 m dimensions:

| Product | Current page price | Product class / seller | Normalized nominal area price |
|---|---:|---|---:|
| Livingwalls / Briconeo, reference 83782324 | EUR 34.40/roll | Non-woven, paste-the-wall, sold and shipped by third-party Profistuck; https://www.leroymerlin.fr/produits/papier-peint-intisse-vinyl-uni-blanc-53-cm-x-10-05-m-livingwalls-83782324.html | About EUR 6.46/m² |
| Collection Rétro Vintage, reference 80155088 | EUR 42.90/roll | Vinyl on non-woven backing, washable, 53 cm × 10.05 m; sold/shipped by Leroy Merlin; https://www.leroymerlin.fr/produits/papier-peint-vinyle-sur-intisse-lessivable-collection-retro-vintage-l-10-05-x-l-0-53-m-ref-ltc-51175207-80155088.html | About EUR 8.06/m² |

Nominal roll area is 0.53 × 10.05 = 5.3265 m². These examples improve provenance but do **not** establish a market range: the material finish and seller differ, and both are current snapshots. The old EUR 11.90–29.90 endpoints should remain quarantined until each exact original SKU can be found or replaced by a deliberately defined new sample.

A EUR 15.90 paintable wall-lining roll (reference 84491639) was also found at 53 cm × 10.05 m, but it is paintable lining rather than ordinary decorative wallpaper and should not be silently included in the decorative-wallpaper sample.

## Germany — item identifiers and comparable-class confirmation

The HORNBACH search page currently exposes exact model/design identifiers and matching area-price calculations for non-woven wallpaper, including:

- Vliestapete 6081-2 Putzstruktur creme: EUR 7.95/roll; EUR 1.49/m² (bulk price at 12 rolls: EUR 7.45/roll, EUR 1.40/m²).
- Grandeco A74602 Delphinium Forest blau: EUR 19.95/roll; EUR 3.75/m².
- A.S. Création 36911-2 Metropolitan Stories Betonoptik grau: EUR 18.75/roll; EUR 3.52/m².

Source: https://www.hornbach.de/s/Vliesfasertapete

This confirms the endpoints and the non-woven class at the category-result level, but the exact individual product URLs are not yet recorded. Treat these as corroborating listing evidence only until SKU-level product pages are attached. Note that the EUR 1.40/m² endpoint is conditional on buying 12 rolls; it is not the single-roll price. HORNBACH states prices include VAT and may exclude shipping.

## Effect on the existing audit

- US Coral Way and Lowe's NW36703 no longer need to be marked as lacking exact product-page confirmation.
- US IQR remains unverified and must not be used as a statistical range.
- France's former EUR 11.90–29.90 range remains unsupported; exact new examples show EUR 34.40 and EUR 42.90 for standard 53 cm × 10.05 m rolls, but are not a replacement approved range.
- Germany's non-woven endpoint evidence is stronger, with exact model/design identifiers, but direct product URLs remain outstanding.
- No other market or record was re-researched in this follow-up.
- No stored prices or flags were changed. All 12 wallpaper records remain ineligible for automatic calculator use.

## Next unresolved items

1. Decide whether to retire the US IQR or rebuild a fresh, fully enumerated 12-SKU sample.
2. Find direct HORNBACH product URLs for the German low/high examples.
3. For France, decide whether the estimate's product class is ordinary non-woven, vinyl-on-non-woven, or an explicitly mixed sample before creating a replacement range.
4. Only after the owner approves a product-class strategy should any structured assumption or runtime eligibility change be proposed.
