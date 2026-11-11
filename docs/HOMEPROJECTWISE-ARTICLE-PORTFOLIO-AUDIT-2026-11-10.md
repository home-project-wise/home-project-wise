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


## Full 100-title repository-only disposition

This pass classifies every candidate against the current repository inventory. It does **not** validate search volume, ranking difficulty or the live US SERP for all 100 titles. "Keep" means retain in the research queue, not approve publication. "Merge" means combine with another candidate or strengthen an existing URL rather than create a second thin page.

| # | Candidate | Preliminary disposition | Repository-level reason / next action |
|---:|---|---|---|
| 1 | How to Fix a Running Toilet: Causes, Parts, and Repair Costs | Keep | No running-toilet repair guide; separate from macerating-toilet buying/install content. Cost section must not invent local prices. |
| 2 | Why Is My Water Heater Making Noise? Causes and Safe Checks | Keep, safety-gated | No equivalent guide; distinguish normal sounds from urgent gas, pressure or electrical issues and use primary safety sources. |
| 3 | How to Find the Source of a Hidden Water Leak | Keep | Distinct diagnosis intent from sensor placement; include shutoff, meter checks and professional escalation without destructive tests. |
| 4 | What to Do Immediately After Discovering a Water Leak | Keep | Distinct immediate-response intent from hidden-leak diagnosis and sensor placement; strong safety and electrical shutoff boundaries required. |
| 5 | How to Fix a Slow-Draining Bathroom Sink | Keep | No matching drain troubleshooting guide; include trap, hair and when not to use chemical drain cleaners. |
| 6 | Why Does My Toilet Keep Clogging? Causes and Solutions | Keep | No clog diagnosis guide; distinguish recurring clogs from one-off blockage and identify when a professional is needed. |
| 7 | How to Repair Cracked Drywall Before Painting | Merge with #8 | Closely related repair intent; create one substantial drywall repair guide with separate crack and hole methods if SERPs support it. |
| 8 | How to Patch a Large Hole in Drywall Without Replacing the Wall | Merge with #7 | Same repair cluster; use as a section or the main scope of one drywall repair guide, not two thin URLs. |
| 9 | How to Fix Peeling Paint on Walls and Ceilings | Merge with #10 | Both are paint-failure diagnosis; one guide can distinguish peeling, bubbling and substrate/moisture causes. |
| 10 | Why Does Paint Bubble or Blister? Causes and Prevention | Merge with #9 | Same failure cluster; avoid separate near-duplicate troubleshooting pages. |
| 11 | How to Repair Cracked Caulk Around a Bathtub | Merge with #12 | Same bathroom caulk repair workflow; one guide can diagnose, remove and replace. |
| 12 | How to Remove and Replace Old Bathroom Caulk | Merge with #11 | Combine with cracked-caulk repair; distinguish surface mildew from failed sealant and include cure-time limits. |
| 13 | Why Is Grout Cracking and When Should You Replace It? | Keep | No equivalent grout-repair guide; separate grout failure from loose tile and explain movement/water causes. |
| 14 | How to Fix Loose Floor Tiles Without Replacing the Entire Floor | Keep, safety-gated | Distinct from grout cracks; explain substrate/water-damage checks and when lifting tiles needs a professional. |
| 15 | Why Does My Door Stick? How to Diagnose and Fix It | Merge/reframe with #16 and existing door guide | Door alignment and rubbing overlap with latch issues and `stop-a-drafty-door-without-replacing-it`; assess whether one door troubleshooting guide is stronger. |
| 16 | How to Fix a Door That Will Not Latch Properly | Merge/reframe with #15 | Related adjustment/strike-plate intent; add only if distinct query demand is proven. |
| 17 | How to Stop Water From Seeping Into a Basement | Keep, conditional | Different from crawl-space humidity, but overlap is possible; focus on water entry paths, grading/drainage and professional/foundation boundaries. |
| 18 | Why Is My Ceiling Stained? How to Identify the Cause | Keep, conditional | Distinct visible symptom; link to hidden-leak diagnosis and clearly distinguish plumbing leaks, roof leaks and condensation. |
| 19 | How to Diagnose a Musty Smell Coming From a Crawl Space | Duplicate / revise existing | Existing `how-to-fix-damp-crawl-space-humidity` already owns crawl-space moisture diagnosis. Add useful odor causes there. |
| 20 | Home Maintenance Problems You Should Fix Before They Become Expensive | Out of scope / low priority | Generic listicle with weak differentiation; prioritize focused repairs and measurable homeowner decisions. |
| 21 | Smart Thermostat Compatibility: How to Check Before You Buy | Duplicate existing | Existing `smart-thermostat-without-c-wire` already covers compatibility. Improve it rather than create a second URL. |
| 22 | C-Wire vs. No C-Wire: What Your Thermostat Actually Needs | Duplicate existing | Same compatibility intent as #21 and existing guide; fold any missing explanation into that page. |
| 23 | Matter vs. Zigbee vs. Thread vs. Wi-Fi: Which Smart Home Standard Should You Choose? | Revise / conditional | Keep only if a practical device-compatibility decision test adds beyond existing lighting, offline and connectivity guides; standards change quickly. |
| 24 | Why Do Smart Bulbs Disconnect and How Can You Fix Them? | Merge/reframe with existing | `smart-devices-keep-going-offline` covers recurring device disconnections; add bulb-specific causes there unless SERPs show a distinct bulb-only intent. |
| 25 | Smart Switch vs. Smart Bulb: Which Is Better for Your Room? | Duplicate existing | Existing `smart-lighting` already covers bulb-versus-switch selection. |
| 26 | How to Choose a Smart Dimmer for LED Lights | Revise / conditional | Add a distinct compatibility section to `smart-lighting` first; a new page needs a separate dimmer/LED compatibility intent and manufacturer evidence. |
| 27 | Can You Use Smart Switches With Three-Way Lighting? | Keep, safety-gated | No equivalent three-way smart-switch guide; must explain wiring variations, neutral-wire checks and when to stop/call an electrician. |
| 28 | How to Build a Smart Lighting Schedule That Saves Energy | Merge/reframe with existing | Overlaps `better-evening-home-lighting`, `smart-lighting` and motion-lighting; new URL only for a distinct schedule/occupancy intent with sourced energy claims. |
| 29 | Smart Home Hub vs. No Hub: What Do You Really Need? | Merge with #30/#23 | Treat as a practical part of the broader interoperability decision, not a separate broad comparison by itself. |
| 30 | How to Check Whether Smart Devices Work Together Before Buying | Merge/reframe with #23/#29 | Could become the core practical compatibility workflow if it is more useful than a protocol explainer. |
| 31 | Smart Door Sensors vs. Motion Sensors: Which Should You Use? | Keep, conditional | No dedicated door-contact sensor guide; compare use cases and false triggers, and link to motion lighting. |
| 32 | Where to Place Smart Motion Sensors for Reliable Detection | Duplicate existing | Existing `motion-lighting-that-actually-helps` covers sensor placement and detection paths. |
| 33 | Smart Water Shutoff Valves: Are They Worth Installing? | Keep | Distinct product/decision intent from leak sensor placement; include plumbing compatibility, failure modes and installation constraints. |
| 34 | Smart Leak Detector vs. Automatic Water Shutoff: What's the Difference? | Merge/reframe with #33 and existing | Use as a comparison section in a smart shutoff guide, cross-linking `where-to-put-water-leak-sensors`; avoid repeating sensor placement. |
| 35 | How to Make Smart Home Devices Work During an Internet Outage | Duplicate existing | Existing `smart-home-wifi-outage-test` covers offline fallback behavior. |
| 36 | How to Secure a Smart Home Network Without Complicated Settings | Duplicate/overlap existing | Existing `smart-home-privacy-check` covers smart-home security/privacy; strengthen it unless a network-only intent is proven. |
| 37 | Smart Plug vs. Smart Power Strip: Which Is Safer? | Reframe / conditional | Existing smart-plug load guide overlaps; proceed only with a distinct multi-outlet/power-strip protection decision. |
| 38 | How Much Electricity Do Smart Home Devices Use on Standby? | Keep, conditional | Could support electricity-cost and smart-plug tools, but every watt/standby claim needs source-backed device examples or transparent user inputs. |
| 39 | How to Choose a Smart Smoke and Carbon Monoxide Alarm | Keep, high safety review | No current guide; use primary fire-safety authorities and manufacturer requirements; do not improvise placement/code advice. |
| 40 | A Practical Smart Home Upgrade Plan for Older Houses | Out of scope / reframe | Too broad as written and overlaps several smart-home guides; only a focused old-wiring/compatibility decision could qualify. |
| 41 | How to Perform a Home Energy Audit Without Special Equipment | Keep — first validation priority | No dedicated energy-audit guide; create a safe DIY walk-through with explicit limits versus professional testing. |
| 42 | Where Does a House Lose the Most Heat? A Room-by-Room Guide | Merge with #41/#43 | Best as a diagnostic section or visual checklist in the energy-audit/air-leak cluster unless a distinct SERP intent is proven. |
| 43 | How to Find Air Leaks Around Windows, Doors, and Outlets | Keep — first validation priority | Whole-home diagnostic intent distinct from the existing single-door sealing guide; safety caveats for wiring and combustion appliances. |
| 44 | Attic Insulation vs. Air Sealing: What Should You Do First? | Keep, conditional | Useful decision intent, but should connect to #41/#43 and climate-specific authoritative guidance. |
| 45 | How Much Insulation Does Your Attic Need? | Keep, conditional | Requires climate-zone/R-value context and careful limits around local codes and existing insulation. |
| 46 | How to Choose the Right Insulation for Your Home | Defer / narrow | Broad buying guide with high authority and climate complexity; only proceed with a narrow material/condition decision. |
| 47 | Why Is One Room Colder Than the Rest of the House? | Keep, conditional | Distinct troubleshooting intent; use a diagnostic tree spanning airflow, envelope, controls and professional HVAC checks. |
| 48 | How to Reduce Heating Costs Without Replacing Your HVAC System | Defer / reframe | Generic savings list is hard to differentiate; use measured, low-risk steps within #41 or a narrowly scoped guide. |
| 49 | Heat Pump vs. Furnace: Cost, Efficiency, and Home Compatibility | Keep, later/high authority | Important buying decision but requires climate, fuel, electrical capacity and verified regional cost data; no generic savings promise. |
| 50 | How Often Should You Replace HVAC Filters? | Keep, conditional | No equivalent guide; explain manufacturer guidance, system conditions and pressure-drop limits rather than one universal schedule. |
| 51 | How to Choose the Right HVAC Filter MERV Rating | Merge with #50 | Combine filter replacement frequency and MERV selection into one practical filter guide; avoid separate thin pages. |
| 52 | Why Does My Air Conditioner Run but Not Cool the House? | Keep, safety-gated | No AC troubleshooting guide; include filter/airflow/thermostat checks and stop conditions for refrigerant/electrical work. |
| 53 | How to Reduce Indoor Humidity Without Overusing a Dehumidifier | Reframe / conditional | Existing crawl-space sizing and bathroom condensation content overlap; only keep if it targets occupied-home humidity sources and ventilation choices. |
| 54 | What Is the Ideal Indoor Humidity for Different Rooms? | Merge with existing / conditional | Add useful, sourced room-specific humidity guidance to moisture cluster unless a distinct indoor humidity query set justifies a hub. |
| 55 | How to Improve Bedroom Ventilation Without Losing Comfort | Keep, conditional | No dedicated bedroom ventilation guide; must avoid generic health claims and distinguish ventilation from cooling/dehumidification. |
| 56 | Bathroom Fan vs. Open Window: Which Removes Moisture Better? | Duplicate/merge existing | Existing condensation guide and exhaust-fan selection guide already cover bathroom moisture and ventilation trade-offs. |
| 57 | How to Stop Condensation on Windows in Winter | Keep, conditional | Window condensation differs from bathroom condensation, but first inspect SERPs and whether existing moisture guide can answer it fully. |
| 58 | Why Does My Attic Get Too Hot? Causes and Practical Fixes | Merge with #41/#44 | Add to energy-audit/insulation cluster; a standalone page risks overlap unless attic heat has a distinct query set. |
| 59 | How to Calculate the Running Cost of a Space Heater | Keep, conditional | Could support the electricity-cost calculator; require wattage × time × tariff method, clear duty-cycle assumptions and electrical safety. |
| 60 | Which Home Upgrades Reduce Energy Bills the Most? | Out of scope / low priority | Broad ranking invites unsupported savings claims and local-cost assumptions; prefer measurable single-upgrade comparisons. |
| 61 | How to Install a Bathroom Exhaust Fan: Planning, Wiring, and Venting | Keep, conditional | Distinct from existing fan sizing and dripping-water diagnosis; strict electrical/roof/duct professional boundaries required. |
| 62 | How to Replace a Bathroom Faucet Without Damaging the Sink | Keep | No equivalent faucet installation guide; include shutoff, sink material and stop conditions. |
| 63 | How to Install a Kitchen Backsplash: Materials, Layout, and Cost | Keep, conditional | New installation task; cost must be user-entered or explicitly illustrative, not a fabricated market estimate. |
| 64 | How to Prepare a Wall Before Painting | Keep, conditional | Could be a useful preparation guide, but first compare whether the existing paint-finish guide can cover prep without becoming unfocused. |
| 65 | How to Paint a Room Without Visible Roller Marks | Keep | Distinct execution problem; useful if it includes paint/roller selection, wet-edge technique and surface preparation. |
| 66 | How to Choose and Apply Primer for Different Wall Surfaces | Merge with #92 | One primer decision guide can cover surface type, stain-blocking and paint-and-primer trade-offs. |
| 67 | How to Install Peel-and-Stick Wallpaper Without Common Mistakes | Keep | Distinct installation intent from existing wallpaper quantity/pattern-repeat guide; link to that calculator workflow. |
| 68 | How to Remove Wallpaper Without Damaging Drywall | Keep | Distinct removal task; explain test patches, substrate and moisture limits. |
| 69 | How to Plan a Tile Layout Before Cutting the First Tile | Keep, tool-linked | A practical tile planning guide can support a tile workflow, but must add layout/cut planning beyond generic area arithmetic. |
| 70 | How to Install Floor Tiles: Subfloor Preparation to Grouting | Keep, high skill boundary | Distinct installation guide; scope must be realistic and identify waterproofing/subfloor work requiring a professional. |
| 71 | How to Install Vinyl Plank Flooring Around Doorways | Keep | Specific installation problem not covered by current inventory; include expansion gaps and manufacturer instructions. |
| 72 | Laminate vs. Vinyl Plank Flooring: Installation and Long-Term Costs | Keep, conditional | No existing flooring buying comparison; require product-specific durability/moisture/installation criteria and avoid unsupported lifecycle cost claims. |
| 73 | How to Install Baseboards and Avoid Visible Gaps | Keep | No equivalent trim installation guide; distinct DIY task. |
| 74 | How to Replace Interior Door Weatherstripping | Merge with existing | Existing `stop-a-drafty-door-without-replacing-it` already owns door sealing; add replacement details there unless intent differs. |
| 75 | How to Install a Door Sweep and Check the Seal | Merge with existing | Same door-draft cluster; add as a method/test in the existing door guide. |
| 76 | How to Build a Simple Under-Sink Leak Protection Setup | Reframe / conditional | Could complement leak sensors, but distinguish passive containment, shutoff and alerting; avoid duplicating sensor placement. |
| 77 | How to Install a Water Leak Sensor Near Appliances | Duplicate/merge existing | Existing `where-to-put-water-leak-sensors` covers placement; add setup only if manufacturer-specific instructions create a distinct task. |
| 78 | How to Plan Lighting Layers Before Renovating a Room | Duplicate/merge existing | Existing evening lighting, smart lighting and motion lighting already cover lighting planning; strengthen those guides first. |
| 79 | How to Prepare a Basement for a Moisture-Safe Renovation | Defer / conditional | High overlap with crawl-space humidity and basement seepage; requires clear separation between moisture diagnosis and renovation scope. |
| 80 | How to Plan a Small Bathroom Renovation Before Buying Materials | Keep, conditional | Could provide project sequencing and quantity planning, but distinguish from fan/condensation guides and avoid invented remodel costs. |
| 81 | How Much Tile Do You Need? Waste, Cuts, and Box Coverage Explained | Tool candidate only — hold | Generic tile calculators are already crowded; no build until a genuinely differentiated multi-surface/carton-comparison/budget hand-off workflow is proven. |
| 82 | How Much Paint Do You Need for Two Coats? | Existing-tool overlap | Flagship calculator already has a paint tab; a supporting guide needs unique coverage/condition/product-label method, not a second calculator. |
| 83 | How Many Wallpaper Rolls Do You Need for Patterned Walls? | Duplicate existing | Existing `how-to-calculate-wallpaper-rolls-pattern-repeat` and proposed Wallpaper tab in #269 already cover this intent. |
| 84 | How to Calculate Flooring Waste Before Ordering | Existing-tool overlap | Flagship calculator has flooring/materials; a guide is conditional on original layout/cut/package-rounding value. |
| 85 | How to Compare Flooring Quotes Apples to Apples | Keep, tool-linked | Distinct quote-comparison intent; could be a focused flooring scope template inside a general quote worksheet. |
| 86 | How to Estimate the Total Cost of a Bathroom Renovation | Defer / high risk | No reliable local cost source; avoid generic cost ranges. Could become a user-entered scope worksheet, not a purported market estimate. |
| 87 | How to Compare Contractor Quotes Before Hiring | Keep — first validation priority | Strong tool-backed opportunity if it normalizes identical scope, allowances, exclusions, permits, cleanup, schedule, payment and warranty without ranking contractors. |
| 88 | How to Choose the Right Caulk for Bathrooms, Windows, and Trim | Merge with #89 | One material-selection guide can compare acrylic, silicone and hybrid products by location and paintability. |
| 89 | Silicone vs. Acrylic Caulk: Where Each One Works Best | Merge with #88 | Same selection intent; merge into one guide rather than split. |
| 90 | Thinset vs. Mastic: Which Tile Adhesive Should You Use? | Keep, conditional | Distinct material decision; must explain substrate, wet areas, tile type and manufacturer/standard limitations. |
| 91 | Grout Types Explained: Sanded, Unsanded, and Epoxy | Keep, conditional | Distinct buying decision from grout repair; cite manufacturer instructions and joint-width limits. |
| 92 | Primer vs. Paint-and-Primer: What Is the Real Difference? | Merge with #66 | Same primer decision cluster; one page can cover when separate primer is required. |
| 93 | Paint Sheen Guide: Flat, Eggshell, Satin, and Semi-Gloss | Duplicate existing | Existing `choose-paint-finish-for-each-room` covers paint finish by room/use. |
| 94 | How to Choose a Dehumidifier by Room Size and Moisture Level | Revise / conditional | Existing crawl-space sizing is distinct, but an occupied-room sizing page needs separate authoritative guidance and query demand. |
| 95 | How to Choose an Exhaust Fan by Bathroom Size and Duct Length | Duplicate existing | Existing `choose-bathroom-exhaust-fan` and Bathroom Exhaust Fan Size Calculator cover this. |
| 96 | What Size Air Filter Does Your HVAC System Need? | Keep, tool-linked/conditional | No matching tool/guide; a filter-size finder may be useful only if based on actual unit/return dimensions and manufacturer constraints. |
| 97 | How to Choose the Right Extension Cord for Home Appliances | Keep, safety-gated | No equivalent guide; use authoritative electrical guidance for gauge, length, load and indoor/outdoor ratings; no generic one-size recommendation. |
| 98 | How to Calculate Appliance Electricity Costs Before Buying | Existing-tool overlap | Existing electricity-cost tab and Smart Plug Load Check; create a guide only for label wattage, duty cycle and tariff assumptions. |
| 99 | What Should a Home Renovation Estimate Include? | Merge with #87 | Best as the scope/allowances/exclusions checklist within the contractor-quote comparison workflow. |
| 100 | DIY vs. Hiring a Contractor: How to Compare the Real Cost | Merge/reframe with #87 | Make this a decision section in quote comparison; do not create a broad generic cost article without matched scope/data. |

## Result of the full repository-only triage

- **Retain for validation, not publication:** focused repair guides, home energy audit, whole-home air-leak diagnosis, contractor-quote comparison, and selected installation/buying tasks.
- **Merge into existing pages or sibling candidates:** thermostat/C-wire, smart lighting, motion sensors, Wi-Fi outage, privacy, crawl-space musty odor, bathroom ventilation, door sealing, wallpaper quantity, paint sheen, fan sizing, and the paired drywall/paint/caulk/primer topics.
- **Hold or deprioritize:** generic maintenance lists, generic energy-saving rankings, generic tile calculator, bathroom renovation cost estimates without reliable data, and broad old-house smart-home plans.
- This is a repository-level content architecture decision. It does not establish demand. Every retained candidate still needs a query/page check, live US SERP study, source audit, value score and owner approval.

## Candidate investigations — consolidated from PR #283 (2026-11-11)

These candidates remain outside the qualified production queue. The research register is deliberately limited and balanced; no candidate is approved for drafting or publication.

| ID | Area | Status | Decision and evidence gap |
|---|---|---|---|
| PL-001 | Plumbing / hidden water leak diagnosis | RESEARCHING | Four deep competitor reviews completed (Angi, Plumber.com, Bluebot, Pulliam Plumbing), plus EPA WaterSense primary guidance. Potential differentiator: safe result-interpreting diagnostic path separating supply leaks from drain leaks, roof/weather intrusion, groundwater and condensation; explain what each test proves and does not prove. Still needs verified keyword demand/GSC query evidence, remaining primary-source checks and complete scorecard. |
| EN-001 | Energy / whole-home air-leak diagnosis | DEFER | ENERGY STAR and DOE already provide strong authoritative coverage; no distinct angle proven. Reopen only with evidence for a genuinely different diagnostic workflow or tool-linked decision. |
| PC-001 / portfolio #87 | Project planning / contractor quote comparison | DEFER | Generic guides and free worksheets compete directly. Reopen only with a genuinely useful privacy-first comparison workflow that normalizes scope, materials, allowances, exclusions, permits, cleanup, schedule, payments, change orders and warranty without ranking contractors or treating missing values as zero. |

PL-001 qualitative query language (not measured search volume): how to find a water leak in your house; how to find a hidden water leak; water meter leak test; meter moving when water is off; signs of hidden water leak; water leak behind wall; slab leak signs; damp wall but no meter movement; condensation vs plumbing leak; when to call a plumber. No keyword-volume/difficulty export or fresh GSC query export was available in this pass.

Read `docs/EDITORIAL-WRITING-METHOD-AUDIT-2026-11-11.md` before preparing future article drafts. It records a seven-article writing-method audit and the four deep competitor reviews for PL-001. The production queue remains admission-only.


## Candidate investigations — expanded balanced batch (2026-11-11, ChatGPT)

This is a preliminary research update only. No candidate below is approved for drafting or publication. Search-result appearance is not search-volume evidence; the connected Search Console query export currently contains no verified demand signal for these candidates.

| ID | Area | Status | Preliminary disposition |
|---|---|---|---|
| PL-001 | Plumbing / hidden water-leak diagnosis | RESEARCHING — continue | The utility-meter test and main-valve isolation path are supported by Seattle Public Utilities, Portland Water, Miami-Dade and other municipal utilities. This can distinguish a continuous metered supply-side leak and narrow inside-vs-service-line location. It does **not** identify the exact leak, rule out intermittent leaks, diagnose drain/roof/groundwater/condensation sources, or replace professional leak detection. Existing where-to-put-water-leak-sensors is about sensor placement, not a diagnosis workflow. Still missing: a primary source explaining drain-side leak detection and moisture-source differentiation; full 3–5 competitor page reviews; GSC query evidence; complete 16-field brief and scorecard. **Not qualified.** |
| DR-001 | Maintenance & repair / large drywall-hole repair | RESEARCHING — validate differentiation | Initial US SERP sample: This Old House's large-hole guide (wood backing and California patch methods), Ace Hardware's September 2026 guide (patches, brackets and compound), Mr. Handyman's repair guide, plus USG manufacturer clip instructions and HUD rehabilitation guidance. No matching drywall repair article was found in the current repository tree. The generic how-to is crowded; a possible useful angle is a repair-method decision path by hole size, exposed framing, wall condition and available backing, with water-damage/underlying-cause checks and finishing stages. Still missing: full 3–5 deep competitor reviews, exact query/demand evidence, safety/lead-paint and fire-rated-wall boundaries, and scorecard. **Not qualified.** |
| HVAC-001 | Energy / HVAC filter sizing and selection | RESEARCHING — validate differentiation | Initial US SERP sample: PNNL Building America Solution Center (filter location, dimensions, thickness, airflow direction and MERV/pressure-drop caution), Trane (nominal vs actual size and compatibility), EPA MERV guidance, and a commercial filter-finder tool with location/size/MERV inputs. No matching HVAC filter guide or dedicated filter finder was found in the repository tree. A generic size article is not differentiated; potential value is a homeowner-safe measurement/selection checklist that prevents mixing nominal and actual dimensions, wrong thickness, multiple filter locations, and unsafe MERV upgrades without system compatibility. Still missing: 3–5 deep competitor reviews, verified demand, precise primary guidance on equipment compatibility and a scorecard. **Not qualified.** |

### Evidence reviewed in this pass

- PL-001: [Seattle Public Utilities — Detect Leaks](https://www.seattle.gov/utilities/your-services/water/metering/detect-leaks); [Portland Water — How to check for leaks](https://www.portland.gov/water/water-efficiency-programs/find-leak); [Miami-Dade — Leak Detection Tips](https://www.miamidade.gov/global/water/leak-detection.page); [EPA WaterSense — Leak Detection and Flow Monitoring Devices](https://www.epa.gov/watersense/leak-detection-and-flow-monitoring-devices).
- DR-001: [This Old House — How to Fix a Hole in a Wall](https://www.thisoldhouse.com/walls/how-to-fix-a-hole-in-the-wall); [Ace Hardware — How to Patch a Hole in Drywall](https://www.acehardware.com/tips/maintenance-repair/how-to-patch-a-hole-in-drywall/); [Mr. Handyman — Drywall Repair Guide](https://www.mrhandyman.com/us/en-us/mr-handyman/_assets/documents/mrh-drywall-repair-guide.pdf); [USG — Sheetrock Drywall Repair Kits Application Tips](https://www.usg.com/content/dam/USG/pdpmovedocuments/sheetrock-drywall-repair-kits-application-tips-en-J1802.pdf); [HUD — Residential Rehabilitation Guide](https://www.huduser.gov/portal/Publications/PDF/part.pdf).
- HVAC-001: [PNNL — Replace Air Filter Located at Return Air Filter Grille](https://basc.pnnl.gov/diy-guides/replace-air-filter-located-return-air-filter-grille); [PNNL — High-MERV Filters](https://basc.pnnl.gov/resource-guides/high-merv-filters); [Trane — Furnace Filter Guide](https://www.trane.com/residential/en/resources/troubleshooting/gas-furnaces/furnace-filter-guide/); [EPA — What is a MERV rating?](https://www.epa.gov/indoor-air-quality-iaq/what-merv-rating); [Central HVAC — Filter Finder](https://centralhvac.us/resources/tools/filter-finder.html).

### Search-demand and qualification caveat

The currently stored GSC exports do not provide verified query-level demand for PL-001, DR-001 or HVAC-001. A blank or absent query row is not proof of zero market demand. No keyword-volume tool/export was available in this research pass. These candidates must remain in investigation, and none may be moved into the qualified production queue until all 16 fields are complete, the score is at least 85/100, the value/differentiation case is defensible and critical evidence/safety/overlap blockers are closed.
