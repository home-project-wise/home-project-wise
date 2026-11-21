# Calculator verification report — 2026-11-21

Calculator Team — Claude, Calculator Owner. Specialized evidence record for queue item 1 (verification suite); the operations room is `data/AI_COLLABORATION.md`.

**Evidence level: local only** (Node v24, Python Playwright with Chromium headless shell 159 on Linux, local pages, no network, not a real device, not Safari/Firefox, no screen reader). PR-head checks are recorded in the room by the reviewer. Base: `main` `c4dd5d2`.

## 1. What changed in this PR (item 1a)

| Change | Why |
| --- | --- |
| `website/tile.js`: the tile size, joint and label-coverage units start from the floor unit (metres: cm, mm, m²; feet: in, in, ft²). A starting choice only: never applied over a unit the visitor picked, and never beside a number they typed. | On `main` the three selects always start on cm, mm and m², even after the visitor chooses feet, so a visitor measuring in feet and typing `12` and `0.125` gets a 0.125 mm joint without noticing. |
| `scripts/test_tile.js`: unit mapping test and a hand-computed twin fixture (12 ft x 10 ft floor, 12 in tile, 1/8 in joint, 10 ft² box = 118 tiles and 12 boxes; the metric twin gives the same). | Unit round trip for the tile calculator. |
| `scripts/qa_browser_tile_units.py` (new, manual like the other `qa_browser_*` scripts): 8 browser checks. 4 of them fail on `main` and pass with the change; the other 4 pass on both. | Proves the wiring in a real page, not only the pure function. |
| `scripts/test_region.js`: the fake document gained `querySelectorAll`. | The test crashed on `main` because the fake document lacked a method that `region.js` has called since the currency link was added; nobody saw it because it was not in CI. |
| `.github/workflows/quality-gate.yml`: nine existing node tests added. | They passed on `main` but never ran in CI (see section 2). |

## 2. Coverage map (node tests in CI)

Before this PR CI ran 10 node tests. These existing tests were not run by any workflow: `test_region.js` (also broken, fixed above), `test_shared_room.js`, `test_project_estimator_engine.js`, `test_budget_planner.js`, `test_bathroom_fan_calculator.js`, `test_wallpaper_beginner.js`, `test_wallpaper_calculator_engine.js`, `test_wallpaper_project_estimator_integration.js`, `test_wallpaper_reference.js`. All 19 node test files pass locally with this PR; all 19 now run in the gate.

| Calculator | Node fixtures | Browser smoke (manual, not in CI) |
| --- | --- | --- |
| Area and volume, paint | `test_home_calculator.js`, `test_paint_reference.js` | `qa_browser_home_calculator.py` |
| Flooring and materials | `test_flooring_reference.js` | `qa_browser_home_calculator.py` |
| Tile | `test_tile.js` | `qa_browser_tile_units.py` (new) |
| Soil and mulch | `test_soil_mulch.js` | n/a |
| Wallpaper | four `test_wallpaper_*` files | `qa_browser_wallpaper_calculator.py`, `qa_browser_wallpaper_compare.py` |
| Electricity cost | `test_energy_reference.js` | `qa_browser_home_calculator.py` |
| Project cost and list | `test_project_list.js`, `test_project_estimator_engine.js` | n/a |
| Budget planner | `test_budget_planner.js` | `qa_browser_budget_planner.py` |
| Bathroom fan size | `test_bathroom_fan_calculator.js` | `qa_browser_bathroom_fan_calculator.py` |
| Room to Ready, shared room, country, currency, reference prices | `test_room_to_ready.js`, `test_shared_room.js`, `test_region.js`, `test_currency.js`, `test_reference_prices.js` | `qa_browser_home_calculator.py` |
| **Rug size, Crawl space dehumidifier, Smart plug load check, Home Check-up** | **none: the logic is inline in each page** | `qa_browser_four_tools.py` only |

The only browser script run by CI is `scripts/visual_qa.py` (visual, responsive and link checks). Every `qa_browser_*` script is manual.

## 3. Units and currency by market

Currency comes from `website/currency.js` (`MARKET_CURRENCY`), from the visitor's explicit country choice only:

| Market | Currency code | Floor and measurement selects at start | Tile, joint, coverage start |
| --- | --- | --- | --- |
| US | USD | Metres | follows the floor unit (this PR) |
| Canada | CAD | Metres | same |
| UK | GBP | Metres | same |
| Germany, France, Spain, Italy, Netherlands | EUR | Metres | same |

No market sets a unit: choosing the United States or Canada leaves the Area, Paint, Flooring, Room and Tile floor selects on Metres. Exceptions seen in the source: the Wallpaper select starts on Feet; Soil and mulch starts on metres for length and centimetres for depth. I did not change any of this; a market-driven unit default is a product decision for the owner (it would also need the same "never over a visitor's choice" rule). The shared-room select was read in the source only, not exercised in a browser.

The "$ in every market" finding of the 2026-11-19 audit is resolved on `main` by the ISO code contract in `currency.js` (`test_currency.js` passes). I did not re-check every price field in a browser.

## 4. Other findings, not changed here

1. `qa_browser_home_calculator.py` reports one failure on `main` and with this PR alike: "every input/select has exactly one label[for]" lists `plan-flooring`. That control is a checkbox wrapped inside its `<label>` (`room-to-ready-ui.js`), so it is labelled; the check is too strict. No site change needed; the check can allow wrapping labels.
2. Rug size, Crawl space dehumidifier, Smart plug load check and Home Check-up have no node fixtures. Next step (item 1b): extract each page's arithmetic into a testable function with hand-computed fixtures; the smart-plug extraction is best done inside the T4a work so the logic is written once.
3. Not measured: real devices, Safari/Firefox, screen readers, field performance, live site.
