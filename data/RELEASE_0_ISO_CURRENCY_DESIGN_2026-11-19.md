# Release 0 — market-linked ISO currency foundation

**Owner:** HomeProjectWise product team  
**Implementation lane:** ChatGPT  
**Review lane:** Claude (one final review after exact-head CI)  
**Date:** 2026-11-19  
**Scope:** Manual-price currency handling in Paint, Flooring & Materials, Electricity, Project Cost and Project List. No new market, price dataset, exchange-rate conversion or automatic location detection.

## Decision

Replace free-form currency-symbol fields with a three-letter ISO 4217 currency code derived only from the visitor's explicit country selection at the top of the calculator. The code is visible but read-only in each manual-price workflow. The calculator never guesses a currency from a symbol, browser locale, IP address or device settings.

The existing eight supported markets map as follows:

| Selected market | ISO code |
|---|---|
| United States | USD |
| Canada | CAD |
| United Kingdom | GBP |
| Germany | EUR |
| France | EUR |
| Spain | EUR |
| Italy | EUR |
| Netherlands | EUR |

Tunisia and other unsupported markets are not silently mapped. Adding a market requires an explicit product/data decision and a matching market configuration.

## User experience and behaviour

1. The visitor selects a country once in the shared country selector.
2. Paint, Flooring & Materials, Electricity, Project Cost and Project List display that market's ISO code (for example, EUR) beside the manual-price input.
3. No country selected means no currency code and no priced manual estimate. Quantity/area calculations remain available wherever their formulas do not require a price. The UI asks the visitor to select a supported country before showing a monetary result.
4. Manual amounts are passed to the Project List with their ISO currency code, not inferred from a $ symbol.
5. Project List uses the selected market code and displays ISO codes with monetary values (for example, EUR 7), rather than relying on locale-specific currency glyphs.
6. Reference prices continue to use the currency declared by their source record; they must match the selected market. No conversion is performed.

## Changing the selected country

A typed amount belongs to the market/currency under which it was entered. On country change:
- Clear manual price/rate amounts in Paint, Flooring, Electricity and Project Cost; preserve dimensions, quantities, coverage and percentage inputs.
- Clear existing visitor-entered Project List prices and quote ranges, switching those items to Not sure yet; preserve quantities and item names.
- Re-resolve source-reference choices for the new market and clear stale result output.
- Show a concise notice explaining that manual prices were cleared and must be re-entered in the new currency.
- Do not convert, relabel or silently reinterpret any amount.

## Data and API contract

- Currency identity is an uppercase three-letter ISO code.
- One shared market-to-currency mapping is the source of truth for all eight supported markets.
- A manual line-item price carries kind=user-input, currency=ISO_CODE, unit and amount; two quotes carry the same code.
- Project List rejects mixed-currency combinations and rejects a manually priced item whose currency does not match the selected market.
- Quantity-only lists remain usable without a selected country; an internal calculation placeholder must never be displayed as a visitor currency.
- Prices are not persisted, sent to a server or converted between currencies.

## Tests and release gates

- Unit tests cover all eight mappings, unsupported/empty markets, ISO formatting, zero-valued prices and currency mismatch rejection.
- Regression tests cover the original Germany/EUR case, including an amount of 7 displaying as EUR 7 (never $7), and Paint/Flooring prices being carried into Project List with EUR.
- Changing country clears old manual amounts and Project List price/range entries without changing quantities.
- Existing Room-to-Ready reference-currency and mixed-currency protections remain intact.
- node --check passes for all executable inline scripts.
- Editorial Quality Gate and exact-head Chromium visual QA both pass.
- Chromium includes mobile widths 390 px and 320 px, no horizontal overflow, and keyboard-only interaction checks; screenshots and report must be uploaded.
- Claude performs one final review of the exact head. Do not merge before that review and green CI.

## Explicit non-goals

- No exchange rates or FX conversion.
- No geolocation-based market selection.
- No automatic market default.
- No currency support beyond the existing eight markets.
- No price-source or reference-price changes.
- No changes to the separate wallpaper product price-code workflow unless a future review explicitly scopes it.