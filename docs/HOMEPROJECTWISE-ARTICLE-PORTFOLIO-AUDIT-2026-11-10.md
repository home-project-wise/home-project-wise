# HomeProjectWise — Preliminary Article Portfolio & SERP Audit

**Date:** 2026-11-10  
**Scope:** Candidate titles in the 100-idea portfolio in the operating charter, compared with the 30 indexable guides and 7 tools recorded in `data/CONTENT_INVENTORY.md` and the 2026-11-10 competitive roadmap.  
**Status:** Preliminary triage only. This is not approval to publish, not a full 100-row keyword audit, and not a substitute for a fresh Google Search Console export and live SERP review for each approved brief.

## Decision rules

- **Duplicate / do not create a second URL:** existing page already serves substantially the same primary intent.
- **Overlap / reframe:** potentially useful only if the new page answers a materially different question and links to the existing page.
- **Distinct candidate:** no direct equivalent found in the repository inventory; still requires query demand, live SERP and value validation.
- **High-risk / low-priority:** broad, safety-sensitive, highly price-dependent or difficult to differentiate; do not prioritize without stronger evidence.

## High-confidence duplicate and overlap flags

| Portfolio candidate | Current site asset or overlap | Preliminary disposition |
|---|---|---|
| Smart Thermostat Compatibility: How to Check Before You Buy | `smart-thermostat-without-c-wire` | **Duplicate / revise existing guide.** Do not create a second compatibility URL. |
| C-Wire vs. No C-Wire: What Your Thermostat Actually Needs | `smart-thermostat-without-c-wire` | **Duplicate.** Fold useful subtopics into the existing guide if missing. |
| Smart Switch vs. Smart Bulb: Which Is Better for Your Room? | `smart-lighting` already covers the bulb-versus-switch choice | **Duplicate.** Improve the current guide rather than split the same decision. |
| How to Build a Smart Lighting Schedule That Saves Energy | `smart-lighting`, `better-evening-home-lighting-without-overcomplicating-it`, `motion-lighting-that-actually-helps` | **Overlap / reframe.** Only a new page if it is specifically about schedule logic, occupancy and daylight controls, with a distinct query set. |
| Where to Place Smart Motion Sensors for Reliable Detection | `motion-lighting-that-actually-helps` | **Duplicate / revise existing guide.** |
| How to Make Smart Home Devices Work During an Internet Outage | `smart-home-wifi-outage-test` | **Duplicate.** |
| How to Secure a Smart Home Network Without Complicated Settings | `smart-home-privacy-check` | **Overlap.** Prefer strengthening the existing privacy/security guide unless the network-hardening intent is demonstrably separate. |
| Smart Plug vs. Smart Power Strip: Which Is Safer? | `what-can-you-plug-into-a-smart-plug` | **Overlap / reframe.** Only proceed with a distinct multi-outlet / power-strip safety decision, not another general load-safety guide. |
| How to Diagnose a Musty Smell Coming From a Crawl Space | `how-to-fix-damp-crawl-space-humidity` | **Duplicate / revise existing guide.** |
| Bathroom Fan vs. Open Window: Which Removes Moisture Better? | `reduce-bathroom-condensation`, `choose-bathroom-exhaust-fan` | **Overlap.** Add a concise, sourced comparison to the strongest existing page unless SERPs prove a distinct intent. |
| How to Install a Water Leak Sensor Near Appliances | `where-to-put-water-leak-sensors` | **Overlap / revise existing guide.** Installation may be a distinct subtask only if manufacturer-specific setup steps are missing. |
| How to Replace Interior Door Weatherstripping | `stop-a-drafty-door-without-replacing-it` | **Overlap.** Check whether the existing guide already covers the replacement path before creating a new URL. |
| How to Install a Door Sweep and Check the Seal | `stop-a-drafty-door-without-replacing-it` | **Overlap.** Prefer an additional section or visual test in the existing door guide unless intent differs. |
| How Many Wallpaper Rolls Do You Need for Patterned Walls? | `how-to-calculate-wallpaper-rolls-pattern-repeat` and the Wallpaper tab proposed in PR #269 | **Duplicate.** Improve and connect the existing guide and flagship calculator. |
| How to Choose an Exhaust Fan by Bathroom Size and Duct Length | `choose-bathroom-exhaust-fan` and Bathroom Exhaust Fan Size Calculator | **Duplicate.** |
| Paint Sheen Guide: Flat, Eggshell, Satin, and Semi-Gloss | `choose-paint-finish-for-each-room` | **Duplicate / expand existing guide.** |
| How Much Paint Do You Need for Two Coats? | Existing paint tab in the flagship calculator | **Tool overlap, not necessarily article duplication.** A supporting guide is only worthwhile if it explains coat coverage, surface condition and product-label assumptions better than the calculator's existing help. |
| How to Calculate Appliance Electricity Costs Before Buying | Existing electricity-cost tab and Smart Plug Load Check | **Tool overlap.** Do not create another generic electricity calculator; a distinct guide may explain label wattage, duty cycle and tariff inputs. |
| How to Choose a Dehumidifier by Room Size and Moisture Level | `what-size-dehumidifier-crawl-space` and Crawl Space Dehumidifier Size Calculator | **Overlap.** A general occupied-room sizing guide could be distinct from crawl-space sizing, but needs separate SERP and authoritative sizing evidence. |
| How to Calculate Flooring Waste Before Ordering | Flooring/materials tab in the flagship calculator | **Tool overlap.** Only create a guide if it adds layout-specific cuts, package rounding and a worked example not already covered. |
| How to Choose and Apply Primer for Different Wall Surfaces / Primer vs. Paint-and-Primer | Related candidates #66 and #92 | **Internal candidate overlap.** Combine into one decision guide or separate only by a clearly distinct intent. |
| How to Choose the Right Caulk / Silicone vs. Acrylic Caulk | Related candidates #88 and #89 | **Internal candidate overlap.** One practical selection guide can cover material and location trade-offs. |
| Cracked bathtub caulk / remove and replace old bathroom caulk | Related candidates #11 and #12 | **Internal candidate overlap.** Combine into one repair-and-replacement guide unless query evidence proves two separate tasks. |
| Cracked drywall before painting / patch a large drywall hole | Related candidates #7 and #8 | **Related, not automatically duplicate.** Could be one drywall repair hub with distinct sections; avoid two thin near-identical articles. |
| Tile quantity guide and Tile Quantity & Cost Calculator | Candidate #81 and proposed tool #1 | **One joined journey.** A guide should explain tile size, pattern, cuts, waste and carton coverage; the tool must do the arithmetic. Do not build two competing calculators or duplicate the same explanation. |

## First US SERP sample — 2026-11-10

This is a small page-level sample for three proposed opportunities. It is not a complete top-10 SERP audit and does not establish keyword volume or expected traffic.

### 1. Home energy assessment

- [U.S. Department of Energy — Guide to Home Energy Assessments](https://www.energy.gov/sites/prod/files/guide_to_home_energy_assessments.pdf): describes a DIY walk-through and professional assessment, including common leak locations and the difference between simple inspection and diagnostic testing.
- [ENERGY STAR — DIY Checks & Inspections](https://www.energystar.gov/saveathome/seal_insulate/identify-problems-you-want-fix/diy-checks-inspections): provides attic and air-leak checks and explicitly warns not to disturb vermiculite insulation because it may contain asbestos.
- [This Old House — How to Perform a Home Energy Audit](https://www.thisoldhouse.com/inspections/how-to-perform-a-home-energy-audit): frames the task as a whole-home audit, with tools, time/skill expectations and attic/insulation checks.

**Opportunity:** a safer, genuinely DIY-first walk-through that separates observations homeowners can make from work requiring a qualified auditor. Do not tell readers to disturb insulation, enter unsafe attic spaces, operate combustion appliances for a DIY depressurization test, or treat a visual walk-through as a formal energy audit. Link the results to specific existing or future guides and to user-entered energy-cost calculations. This appears to be a meaningful gap in the current inventory, but query demand still needs Search Console and live SERP validation.

### 2. Tile quantity calculator

- [TileCalculator.us](https://tilecalculator.us/): supports room/tile dimensions, grout spacing, layout, waste, optional layout preview, carton details and material price.
- [Solved Tools — Tile Calculator](https://solved.tools/tools/tile-calculator): supports multiple rooms, waste presets, area-per-box or tiles-per-box and optional box cost.
- [Nestique — Tile Calculator](https://nestique.io/tile-calculator/): supports multiple areas, pattern-dependent waste, whole-box rounding, price and a layout preview.

**Opportunity and warning:** the basic tile-count / waste / boxes / price feature set is already crowded. A generic tile calculator would not be differentiated. Before approving it, prove a stronger job-to-be-done such as a reliable multi-surface room plan with separate products, explicit carton-label inputs, pattern/cut assumptions, a transparent comparison of two carton options and a safe hand-off into the existing Project Budget Planner. Even those features must be compared against the live competitors above. The calculator should not be built merely because the keyword has search volume.

### 3. Contractor quote comparison

- [FixItCost — How to Compare Contractor Quotes](https://fixitcost.com/guides/how-to-compare-contractor-quotes/): includes a scope checklist, itemized quote fields, permits, disposal, warranties and a printable comparison sheet.
- [Pond — How to Compare Contractor Quotes](https://www.pond.com/home/how-to-compare-contractor-quotes): emphasizes same written scope, materials, allowances, exclusions, schedule, payment and warranties.
- [Project Budgeter — How to Compare Contractor Estimates](https://projectbudgeter.com/blog/how-to-compare-contractor-estimates/): covers comparable scope, itemized costs, licensing/insurance and worked examples.

**Opportunity:** a generic checklist article is not enough. The stronger potential product is an interactive, privacy-first comparison worksheet that normalizes two or three quotes by scope, materials, allowances, exclusions, permits, cleanup, payment schedule, warranty and unknowns. It should never rank contractors or imply that the cheapest or highest quote is best. This is a tool-and-guide opportunity, not an approved article yet.

## Recommended first validation queue

1. **Home Energy Audit Without Special Equipment** — retain as the strongest new editorial candidate, with a strict safety boundary and links to existing air/moisture content.
2. **Compare Contractor Quotes Apples to Apples** — retain only as a tool-backed decision guide; generic checklist competition already exists.
3. **Find the Source of a Hidden Water Leak** — retain as diagnosis and immediate-response content, distinct from sensor placement; include shutoff and professional escalation guidance.
4. **Patch a Large Hole in Drywall** — retain as a practical repair candidate, but check whether it should be combined with a broader drywall repair guide.
5. **Find Air Leaks Around Windows, Doors and Outlets** — replace the Matter/Thread candidate for now; keep it distinct from the single-door sealing guide.

No item in this queue is approved to publish. The live SERP sample above is not a substitute for the full 3–5 page competitor study required before each brief.

## Decisions still needed

- Owner approval of the five-pillar editorial scope and the first validation batch.
- A fresh query/page export from Google Search Console and Bing Webmaster Tools before choosing publication targets.
- A separate technical feasibility review before any new calculator or comparison tool is implemented.
- A complete per-candidate KEEP / REVISE / REPLACE / DUPLICATE / OUT OF SCOPE review before the 100-title list is treated as a ranked portfolio.
