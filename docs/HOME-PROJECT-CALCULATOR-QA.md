# HomeProjectWise Home Project Calculator — QA cases

**Created:** 2026-11-01  
**Related implementation:** `website/home-project-calculator.html`  
**Status:** Expected-value test plan; manual browser execution still required.

## Purpose

Give Claude and the owner reproducible test cases with independently calculated expected results. These are calculation checks, not evidence that browser interactions have already passed.

## 1. Area, perimeter and volume

| Case | Inputs | Expected result |
|---|---|---|
| Metric room | Unit m; length 4; width 3; depth 0.1 | Area 12 m² (129.17 ft²); perimeter 14 m (45.93 ft); volume 1.2 m³ (42.38 ft³) |
| Imperial room | Unit ft; length 10; width 12; depth 1 | Area 120 ft² (11.148 m²); perimeter 44 ft (13.411 m); volume 120 ft³ (3.398 m³) |
| No depth | Unit m; length 4; width 3; depth blank | Area and perimeter only; no volume row |
| Invalid dimensions | Length 0, negative, or blank; width 3 | Error; no result |

Exact conversion basis: 1 ft = 0.3048 m; area and volume factors are powers of this exact length conversion.

## 2. Paint quantity

| Case | Inputs | Expected result |
|---|---|---|
| Metric baseline | Unit m; room 4 × 3 × 2.5; openings 3 m²; 2 coats; coverage 10 m²/tin; waste 10%; price 20 | Gross walls 35 m²; paintable 32 m²; allowance-adjusted coverage 70.4 m²; 7.04 tin-equivalents; buy 8 tins; cost 160 |
| Imperial equivalent | Unit ft; room 13.12336 × 9.84252 × 8.20210; openings 32.2917 ft²; 2 coats; coverage 107.6391 ft²/tin; waste 10%; price 20 | Approximately same as metric baseline: 32 m² paintable, 8 tins, cost 160 (small rounding differences allowed) |
| Openings too large | Openings equal to or greater than gross wall area | Error; no result |
| Optional price blank | Valid dimensions and coverage; price empty | Quantity appears; no cost line |

Formula: net wall area = 2 × (length + width) × height − total openings. Required coverage = net area × coats × (1 + waste fraction). Purchase count rounds up to whole tins.

## 3. Flooring / material packs

| Case | Inputs | Expected result |
|---|---|---|
| Exact pack boundary | Length 5 m; width 4 m; coverage 2.2 m²/pack; waste 10% | Area 20 m²; allowance-adjusted 22 m²; exactly 10 packs |
| Round up | Length 5 m; width 4 m; coverage 2.1 m²/pack; waste 10% | 22 ÷ 2.1 = 10.476…; 11 packs |
| Invalid coverage | Coverage 0, negative or blank | Error; no result |

Formula: packs = ceil[(length × width × (1 + waste fraction)) ÷ coverage per pack].

## 4. Electricity running cost

| Case | Inputs | Expected result |
|---|---|---|
| Standard month | 1,000 W; 2 h/day; 30 days; 0.25 currency units/kWh | 60 kWh/month; 2 kWh/day; monthly estimate 15; 30-day estimate 15 |
| Half-hour use | 500 W; 0.5 h/day; 30 days; 0.20/kWh | 7.5 kWh/month; 1.5 cost units |
| Invalid usage | Hours above 24, days above 31, negative watts, blank/zero rate | Error; no result |

Formula: monthly kWh = watts ÷ 1,000 × hours/day × days. Estimated cost = kWh × entered tariff. This does not estimate variable appliance cycling or assess electrical safety.

## 5. Project cost

| Case | Inputs | Expected result |
|---|---|---|
| Standard estimate | Quantity 12; unit price 25; extras 50; contingency 10%; tax 5% | Base 350; contingency 35; tax 19.25; total 404.25 |
| No contingency/tax | Quantity 2; unit price 30; extras 10; contingency 0%; tax 0% | Total 70 |
| Invalid percentages | Contingency or tax above 100, or negative value | Error; no result |

Current calculation order: base = quantity × unit price + extras; contingency = base × contingency rate; tax = (base + contingency) × tax rate; total = base + contingency + tax. Local tax rules differ, so users must adjust inputs to the way tax is charged where they live.

## 6. Browser and accessibility checklist

- [ ] Each tab opens the matching panel; inactive panels are not visible.
- [ ] All controls have accessible labels and can be reached with keyboard Tab.
- [ ] Tab controls expose the selected state; test arrow-key expectations for ARIA tabs.
- [ ] Submitting each form does not reload the page.
- [ ] Error messages are announced through the alert region.
- [ ] Results update in the live region and are understandable on mobile.
- [ ] Long currency symbols, large values and decimal inputs do not overflow.
- [ ] Blank optional price fields do not show a misleading cost.
- [ ] No user-entered measurement or price is sent to a server.
- [ ] Check Chrome Android and desktop browser widths.
- [ ] Verify every cross-link and canonical URL on the deployed preview before merge.

## 7. Acceptance rule

Do not call this calculator validated until all expected-value cases pass in the actual browser implementation, keyboard/mobile checks pass, and any safety-sensitive wording has been independently reviewed. If a formula or input assumption changes, update this document and the visible formula copy together.

## 8. Automated calculation and keyboard checks (added 2026-11-02)

`node scripts/test_home_calculator.js` runs the page's inline script against a minimal DOM stub (no dependencies) and asserts the hand-calculated results from sections 1 to 5, plus the boundary cases below. It is **not** a browser run: layout, HTML5 form validation (`required`, `min`, `max`), mobile rendering, screen-reader behaviour and the privacy/network check in section 6 remain manual and still pending.

| Case | Expected |
|---|---|
| Depth `0` | Accepted; volume 0 m³ (negative depth rejected, blank depth = area and perimeter only) |
| Electricity: 0 hours/day | Accepted; 0 kWh, cost 0 |
| Electricity: tariff 0 | Accepted; cost 0 |
| Electricity: blank days | Error message, no result (never a silent 0) |
| Electricity: 15.5 days | 31 kWh for 1000 W x 2 h |
| Paint: zero allowance | 32 m² x 2 coats / 10 m² = 6.4, buy 7 tins |
| Paint/material exact boundary | exact multiples do not round up (21 m² / 2.1 = 10 packs) |
| Material or project price 0 | Accepted; cost 0 |
| Percentages | contingency or tax above 100 rejected; paint/material allowance above 50 rejected |
| Invalid submit after a valid one | result cleared, only the error shown |
| Tabs | ArrowLeft/ArrowRight (wrapping), Home, End move selection and focus; one tab in the tab order at a time |
