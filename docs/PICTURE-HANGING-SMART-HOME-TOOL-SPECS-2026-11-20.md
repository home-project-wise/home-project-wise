# WS1 specifications — picture hanging, fixing-load verdict, smart-plug and energy cost

**Prepared by:** ChatGPT  
**Date:** 2026-11-20  
**Scope:** Research/specification only for #415 / plan WS1. No calculator code, article edits, link placement, CSS, prices, persistence or deployment.

## 1. Executive decisions

**Shared acceptance rule for every new or extended calculator page:** publish 2–3 worked examples as semantic, crawlable plain HTML text (not image-only or canvas-only content). Keep the example inputs and expected outputs in tests and assert that the visible example values match the tested calculations. Show the units and any assumptions beside each example.

1. **T2 picture-hanging planner: proceed.** The article contains real geometry and explicit arithmetic. Build the four modes below with visitor-measured hook drop, furniture gap and gallery spacing; do not invent those values.
2. **T3 fixing-load calculator: drop the proposed generic version.** TOGGLER supports a quarter-of-ultimate recommendation for its own products, but that does not establish a universal factor for every anchor. E-Z Ancor explicitly says multiple anchors do not multiply its holding performance. The proposed division of object weight by anchor count assumes equal load sharing, which is not supported. Keep manufacturer-specific evidence in the guide; do not return a generic “safe load”.
3. **T4a smart-plug v2: extend the existing checker to sum simultaneous devices, but correct the meaning of the 80% line.** It is not a universal smart-plug safety limit. Compare against the exact product nameplate and lowest-rated component. Keep the existing green/amber/red categories only as a conservative screening aid, never as certification or a declaration that a device is safe.
4. **T4b running/standby energy cost: proceed.** Use the established watts × hours / 1,000 formula, separate active and standby periods, and use the visitor's tariff. No hidden runtime, tariff or price.
4. **Regional electrical defaults:** use nominal 120 V / 60 Hz for US and Canada, and 230 V / 50 Hz for UK/EU examples, but show that the plug's own nameplate overrides a regional prefill. Validate US, UK and Canada cases; do not infer a product rating from geography.

## 2. T2 — picture-hanging planner

### 2.1 Modes and inputs

**Mode A — one piece on an open wall**
- Inputs: frame height (and width for layout), chosen centre height, measured distance from frame top to the taut wire / D-ring / sawtooth support point.
- Suggested starting convention: centre at **57 in (145 cm)** above floor. This is a gallery/decorating guideline, not a building code or universal rule. Keep it editable.
- Formula: **hook height = chosen centre height + frame height / 2 − measured hook drop**.
- If there is no wire, measure from the frame top to the actual bearing point of the hardware. Do not assume the hardware sits at the top edge.

**Mode B — above furniture**
- Inputs: furniture top height, visitor-selected gap, frame height, measured hook drop.
- The furniture gap takes precedence over the 57 in centre guideline.
- Formula: **frame bottom = furniture top + chosen gap**; **frame top = frame bottom + frame height**; **hook height = frame top − hook drop**.
- Present **6–10 in (15–25 cm)** as a sourced design range, not a preselected gap. Home Depot's guide specifies 8–10 in above a bed or sofa; other framing guidance gives 6–10 in. The visitor chooses the actual gap.

**Mode C — wide piece with two hooks**
- Inputs: frame width/height, chosen centre or furniture position, and the measured horizontal and vertical offsets of each actual support point from the frame edges. Do not assume the two supports are symmetric.
- Coordinate convention: **x** is the horizontal distance from the chosen, fixed wall reference edge; **y** is the vertical height **above the finished floor**, increasing upward. Record the frame's left edge as an x-distance from that same reference edge and its bottom as a y-height above the floor. For each support point, calculate **wall x = frame-left x + measured horizontal offset from the frame's left edge** and **wall y = frame-bottom y + frame height − measured drop below the frame top**. Show the reference edge and floor datum in the output so the installer cannot accidentally reverse the y-axis. This is placement only; it must not imply that two hooks share the weight evenly or double a fixing's capacity.

**Mode D — stud positions**
- Inputs: a wall reference edge, the first stud position actually found by the visitor, confirmed stud spacing (16 in / 24 in / custom measured), and frame left/right edges.
- Formula: **stud[n] = first confirmed stud + n × confirmed spacing**. Highlight only studs falling within the frame's horizontal span. Allow the visitor to enter individually confirmed stud positions when the wall is not regularly spaced.
- 16 in on-centre is common; 24 in is also used. These are not guaranteed in every wall, country or construction. Require the visitor to confirm positions with a stud finder / physical verification; never infer a stud solely from the spacing option.
- The 16/24 in defaults are US framing conventions. Allow centimetres and custom spacing for other markets.

**Mode E — gallery wall**
- Inputs: frame widths/heights, visitor-defined frame order within each row, number of rows, visitor-selected horizontal/vertical gaps, chosen group centre or furniture gap, and optional wall reference. Do not silently choose a grid or rearrangement.
- Treat the whole arrangement's bounding box as one composition. Compute its total width/height from the entered frame sizes and gaps, then place its centre. For each row, define the row height as the height of the tallest frame in that row; the vertical gap is measured between adjacent row bounds, not between arbitrary frame centres.
- A **2–3 in (5–7.6 cm)** gap is a published layout suggestion, not a universal standard. Show it as guidance only; do not silently select a gap.
- Optional visual proportion check: the Home Depot guide suggests a picture/group width of about two-thirds of the furniture width. This is a design heuristic, not a pass/fail rule.

### 2.2 Output and hand-computed fixtures

Show all measurements in both inches and centimetres, with a copyable measurement list. Where a market default is used, prefer inches for US/Canada and centimetres for UK/EU, but always expose the unit switch and do not infer a market when it is unknown. Publish 2–3 of the hand-calculated placement examples in semantic plain HTML. The tool is a placement worksheet; it does not choose fixings or claim structural safety.

| Fixture | Inputs | Expected result |
|---|---|---|
| Open wall (plan fixture 1) | Frame 36 in high; centre 57 in; hook drop 3 in | Hook = 57 + 18 − 3 = **72 in** (182.88 cm) |
| Above furniture (plan fixture 2) | Furniture top 30 in; chosen gap 8 in; frame 24 in high; hook drop 2 in | Bottom 38 in; top 62 in; centre 50 in; hook = 62 − 2 = **60 in** |
| Stud positions (plan fixture 3) | First stud 14 in from corner; confirmed spacing 16 in; frame left edge 20 in; width 40 in | Studs at 14, 30, 46, 62 in; frame spans 20–60 in; highlight **30 and 46 in only** |
| Two-hook placement | Frame top-left at (20, 40) in; frame width 48 in; measured support points 5 in from left and 3 in below top, and 43 in from left and 3 in below top | Hook coordinates **(25, 37) in** and **(63, 37) in**; no load-sharing inference |
| Gallery calculation | Two frames 18 in and 24 in wide; visitor chooses 2.5 in gap | Group width = 18 + 2.5 + 24 = **44.5 in**; centre the group as one unit |
| Two-row gallery | Row 1: frames 18 × 24 in and 12 × 18 in; row 2: frames 16 × 20 in and 14 × 16 in; visitor chooses 2.5 in horizontal gap and 3 in vertical gap | Row 1 height = **24 in** (tallest frame); row 2 height = **20 in**; group height = 24 + 3 + 20 = **47 in**. The 3 in gap is between row bounds; centre the 47 in group as one composition |

### 2.3 Safety and scope limits

- The planner calculates **placement only**. It must not rate anchors, screws, studs, plaster, masonry or the complete hanging system.
- Before drilling, the guide must continue to direct visitors to check for electrical cables and pipes and to use a suitable detector. A stud finder may also react to pipes/wiring; it is not a guarantee.
- No automatic advice for stairwells, ceilings, overhead loads, cribs/beds, child-safety installations, very heavy/valuable pieces, damaged walls, uncertain substrates or frames with unusual offset hardware. Direct these cases to the relevant manufacturer instructions, a sound stud/cleat solution or a qualified installer.
- Do not turn “two hooks” into a weight-sharing promise. The tool can position two measured hooks from the frame's actual hardware offsets; it cannot infer equal load distribution.
- No hidden default for furniture gap, hook drop, gallery gap, first stud position or actual stud spacing.

## 3. T3 — fixing-load verdict

### 3.1 What the sources support

- TOGGLER's own FAQ says its published figures are **ultimate loads** from independent laboratory tests and states that industry safety standards recommend **one-quarter of ultimate load** as a reasonably safe working load for each installed TOGGLER anchor. The FAQ does not name an independent standard or code for that statement. TOGGLER immediately qualifies this: it cannot guarantee the result because wall/ceiling condition and the exact installation are unknown; age, capacity and condition of the base material matter. The FAQ also says its figures apply to objects held close to the wall; a stand-off or swinging mount increases effective load and reduces allowable capacity. This is not a universal factor for every drywall anchor.
- CRL's SnapSkru product data lists ultimate tensile and shear values by drywall thickness and says to use one-quarter of those ultimate values as the maximum load per anchor. For the SnapSkru Regular in 1/2 in drywall, its listed values are 79 lb pull-out and 149 lb shear; quarter arithmetic gives **19.75 lb pull-out** and **37.25 lb shear**. These are not new test results and are not interchangeable directions of loading.
- ITW Buildex's E-Z ANCOR data sheet lists average ultimate holding values and says they change with drywall age, moisture and surface treatment; it instructs designers to apply appropriate safety factors but gives **no numerical factor**. Applying 1/4 to ITW values would invent a manufacturer recommendation. The existing article's suggestion to use the smaller quarter-value when load direction is unknown is explicitly an editorial cautious reading, not an ITW or TOGGLER rule; it cannot replace identifying the actual load path.
- E-Z Ancor's FAQ says the load performance is determined by the surrounding drywall within a 1 ft diameter. It says extra anchors do **not** multiply the rating; any minor increase from load sharing is negligible. It also specifies a product-specific minimum spacing of 2 ft. This is direct evidence against a generic “two anchors = twice the capacity” calculation. The FAQ distinguishes static loads (including picture frames) from working/moving loads, which can fail at lower values.

### 3.2 Verdict

**DROP T3 as currently specified.** The proposed inputs (object weight, number of anchors, ultimate pull-out, generic factor) and a per-anchor comparison would require assuming that the object load is shared evenly across the entered number of fixings. The manufacturer evidence does not justify that assumption. It also does not support applying TOGGLER's quarter factor to ITW or every other brand. Per the plan, the anchor article may link to T2 **only as a separate placement aid** after the visitor has independently selected a suitable fixing; T2 must not calculate anchor capacity, choose hardware or approve a load.

The guide may retain the quarter figures **only beside the exact TOGGLER product, wall thickness, tested load direction and installation conditions**, clearly labelled as manufacturer guidance and arithmetic from ultimate values. It must not present “about 20 lb per anchor” as a universal drywall-anchor rating.

A future product-specific reference tool would need manufacturer-published allowable/working loads for the exact anchor, substrate, thickness, loading direction, fastener and installation, plus published group-load data for multi-anchor layouts. Without those data, it remains guide-only.

### 3.3 Required stop wording if any future tool is reconsidered

> This comparison is not a safety approval or a guarantee. Do not use it for ceilings or overhead loads, dynamic/vibrating loads, child-safety installations, heavy or valuable objects, damaged or damp drywall, unknown wall material/thickness, plaster/masonry, uncertain installation, or any case where the load direction or product model is unclear. Use the exact manufacturer's instructions and have a qualified installer assess the complete fixing system.

Never output “safe”, “safe to hang”, or a combined system capacity from the sum of individual anchors.

### 3.4 Hand check (manufacturer-specific arithmetic only)

- SnapSkru Regular, 1/2 in drywall: 79 lb ultimate pull-out ÷ 4 = **19.75 lb**.
- Same product and substrate: 149 lb ultimate shear ÷ 4 = **37.25 lb**.
- These values are distinct; do not choose the larger one without knowing the load direction. Do not add them or multiply by anchor count.

## 4. T4a — smart-plug v2, multi-device load check

### 4.1 Inputs and behavior

- Read the exact smart plug's nameplate/box: rated voltage, current and/or watts, and any different ratings for resistive, motor or other load types.
- Let the visitor add each device that may run **at the same time**. Prefer the device's stated watts and the smart plug's own stated maximum watts, when both are supplied. If the device label gives amps, compare current directly at the same supply voltage. **V × A = VA (apparent power), not necessarily real watts**; real power is **W = VA × power factor**. Only equate VA and W for a resistive/unity-power-factor load or when the manufacturer explicitly gives the watt rating. Do not relabel an amps-derived VA figure as W.
- Sum simultaneous loads by compatible units: total nameplate watts = Σ device watts; or total current = Σ device amps at the same voltage. If the plug provides only amps and a device provides only watts with unknown power factor/load type, do not claim an exact current comparison; show that the data are not directly comparable and request the missing nameplate value. If both W and A limits are published, check both and use the lower permitted operating limit.
- Compare against the lowest applicable nameplate rating in the chain: smart plug, power strip/extension lead and adapter. Do not guess the wall-circuit rating. If the circuit is unknown, say it has not been assessed.
- The current checker calculates the plug limit as volts × amps, sets an 80% line, returns red above that line (even below the printed maximum), and also returns amber/red for device-category exclusions. Its current amp-input path multiplies A × V but labels the result W; that is **VA**, not necessarily W. Its watts-input path compares real nameplate W with a V × A apparent-power limit, which is exact only when power factor is 1 or the load is resistive. Treat this as a unit/precision defect to resolve before extending the checker: label A × V as VA, use manufacturer W and A/VA ratings where available, and do not present an exact green result when the device and plug data are not comparable. T4a should retain the existing category names and exclusions for parity, then add simultaneous-device totals. Do not phrase green as “safe” or electrical certification. The existing hard red at 80% is a conservative product heuristic, not a universal code or manufacturer rule; Claude should review the wording and threshold as a distinct safety-copy decision before widening the tool's claims. Do not silently describe it as a legally required smart-plug limit.
- No automatic default of 120 V for all visitors. Region may prefill a nominal voltage, but the plug label is authoritative and must be editable.

### 4.2 Critical correction to the existing 80% line

The 80% figure is **not a universal smart-plug rule**:
- NEC 210.20(A) requires branch-circuit overcurrent protection to be sized for the noncontinuous load plus 125% of the continuous load, subject to its listed-assembly exception. This is branch-circuit protection sizing, not a blanket instruction to multiply every smart plug's nameplate rating by 0.8.
- For the **2026 edition (A2025 revision cycle)**, the ballot document is a proposal/revision record, not the published NEC text, so it must not be cited as if it were an edition of the Code. NFPA identifies **NFPA 70, 2026 Edition** as the current published edition. The published-edition material checked for this specification did not establish that the ballot's proposed 80% wording appears at **210.23(B)(1)** in the 2026 text; therefore this subsection and the proposed 80% rule are **not asserted here as a verified requirement of the published 2026 NEC**. Do not cite the ballot as proof of current code wording. Any future code-specific claim must be checked against the actual published text and the applicable local adoption.
- UK Electrical Safety First tells consumers to check the maximum current rating printed on the extension lead; it notes most are 13 A but some are 10 A or less, and warns against exceeding the marked rating. It does not establish a universal 80% smart-plug threshold.
- Therefore, if the current UI keeps its 80% indicator, label it as a **conservative screening buffer used by this tool**, not the legal or manufacturer-rated safe limit. The exact product rating remains the hard ceiling, and a green result is not a safety certification. Do not apply the US NEC branch-circuit rules to UK/EU or Canada as if they were universal.

### 4.3 Regional voltage context

| Market | Nominal example for prefill | Source / qualification |
|---|---:|---|
| US | 120 V, 60 Hz | US Department of Energy describes US supply as 110–120 V, 60 Hz; verify the plug label |
| Canada | 120 V, 60 Hz | Natural Resources Canada energy-audit guide describes typical household voltage as 120 V and 60 Hz; 240 V circuits also exist |
| UK | 230 V, 50 Hz | UK Electricity Safety, Quality and Continuity Regulations declare 230 V and 50 Hz unless otherwise agreed |
| EU | 230 V, 50 Hz | European Commission mains-supply definition; confirm local product label and country standard |

Use the region only to prefill the calculation. Never infer the smart plug's actual maximum rating, certification or compatibility from the country alone. Include at least UK, US and Canada tests; the same UI must allow a different label voltage. Publish 2–3 static examples in semantic plain HTML (for example, US 120 V, UK 230 V, and a three-device sum) and compare their visible values with the test fixtures.

### 4.4 Hand-computed fixtures

- **US arithmetic:** 120 V × 15 A = **1,800 VA** nominal. The current UI's 80% line is 1,440 VA and currently triggers a red result above that line. **1,440 VA is only an internal threshold in this tool**; it is not presented here as a requirement derived from NEC, and it is not the smart plug's nameplate maximum.
- **UK/EU arithmetic example:** 230 V × 10 A = **2,300 VA** nominal; an 80% display line would be 1,840 VA. Again, 1,840 VA is only the current tool's conservative red threshold, not the plug's rated maximum or a local code rule.
- **Canada region fixture:** prefill nominal 120 V / 60 Hz only. If the visitor reads 10 A on the actual smart-plug label, 120 V × 10 A = **1,200 VA** nominal; if the label says another rating, use that value instead. Do not assume every Canadian smart plug is 10 A or 15 A.
- **Multi-device sum:** device A 60 W + device B 40 W + device C 25 W = **125 W simultaneous total**. If a device is not used at the same time, the visitor must not include it in that simultaneous scenario.
- **Current-only input:** at nominal 120 V, 0.5 A corresponds to **60 VA**. It is approximately 60 W only for a unity-power-factor/resistive load. For an unknown motor/electronic load, do not present 60 VA as 60 W; use the nameplate watts and current/VA or keep the comparison incomplete.

### 4.5 Safety stops

- Stop and direct to the manufacturer's instructions/electrician if the plug's rating or certification is missing, damaged or illegible; if the device is a space heater, kettle, iron, toaster, hair dryer or other high-heat load prohibited by its manual; if it is a fridge/freezer, pump, compressor or other motor load with unknown starting current; if a critical medical/alarm device must not be switched off; if multiple adapters/extensions are daisy-chained; or if the plug/socket feels hot, is damaged, smells burnt, sparks or shows scorch marks.
- Do not infer circuit capacity from a smart-plug rating. Do not recommend an extension chain. Do not call a numerical result a safety certification.

## 5. T4b — running and standby energy cost

### 5.1 Inputs and formulas

- Inputs: measured or manufacturer-stated active watts, active hours per day/week (or total hours per period), measured or manufacturer-stated standby watts, standby hours, days in the period, and the visitor's electricity rate/currency per kWh. Reuse the existing energy-reference.js rate picker for an optional regional reference.
- Separate active and standby energy; do not add standby watts to active watts as though they run simultaneously.
- **active kWh = active watts × active hours ÷ 1,000**.
- **standby kWh = standby watts × standby hours ÷ 1,000**.
- **total kWh = active kWh + standby kWh**.
- **energy cost = total kWh × visitor-entered rate per kWh**.
- If the visitor has not entered a rate, reuse the existing energy-reference.js behavior: exact jurisdiction only (no cross-country fallback); show the selected source's geography, observed date, currency, tariff plan and caveats. A single sourced rate may be copied into the calculator by explicit visitor action. If the source is a time-of-use range or multiple plans are ambiguous, show the range/choice but do not average or auto-fill it; ask the visitor to enter the rate that applies. If no reference exists, show kWh only and mark cost “not calculated”. The visitor's own rate always wins; never use zero or an invented tariff.

### 5.2 Fixtures

- **Plan fixture:** 0.5 W standby × 8,760 h ÷ 1,000 = **4.38 kWh/year per bulb** (365-day year).
- Ten identical bulbs: 4.38 × 10 = **43.8 kWh/year**.
- If the visitor's rate is R currency/kWh, one bulb costs **4.38 × R currency/year**; no numeric currency cost can be shown until R is supplied.
- Active/standby mixed example: 8 W active × 2 h/day × 365 ÷ 1,000 = **5.84 kWh/year**; 0.5 W standby × 22 h/day × 365 ÷ 1,000 = **4.015 kWh/year**; total = **9.855 kWh/year**. (The visitor must choose these hours; this is a worked example, not a default.)

### 5.3 Requirements

- 8,760 h is a 365-day year, not a hidden runtime default. For an “always on all year” example, state the assumption explicitly.
- Do not use a bulb's active wattage as its standby wattage. Use the exact manufacturer's standby/networked-standby figure or a visitor meter reading.
- For devices with variable loads or multiple operating modes, the result is an estimate based on entered hours and watts; disclose that actual consumption varies.
- The existing Electricity cost tab currently accepts one appliance wattage, hours/day, days/month (30 is currently prefilled), and visitor-entered tariff; it calculates kWh and cost for one mode. T4b therefore needs an explicit active/standby extension in that panel, not merely a handoff of an already-combined kWh number. Add active watts + active hours/day, standby watts + standby hours/day, a labelled period (monthly/annual or an explicit number of days), and the existing visitor-entered tariff. For an always-connected device, validate that active + standby hours do not exceed 24/day; do not force them to equal 24 if the device is unplugged or off for part of the day. Replace or clearly expose the current 30-day monthly assumption when annual examples are shown. Preserve the current no-persistence behavior. The existing energy-reference.js fetches the static same-origin reference-prices.json; do not transmit or store visitor-entered device, usage or tariff data.
- Publish 2–3 static worked examples in plain HTML that match the calculation fixtures and have CI compare the displayed numbers with tests.


## 6. T4c — Project List presets (names only)

The plan also queues two optional starter presets in the existing Project List: **Smart home starter** and **Hang and mount**. These are list-entry conveniences, not calculators.

- **Smart home starter — suggested item names:** smart plug; smart bulb; water leak sensor; motion sensor; compatible hub / Thread border router (only if the selected device ecosystem requires one); Wi-Fi router (only if the visitor is buying/upgrading it).
- **Hang and mount — suggested item names:** tape measure; level; painter's tape / paper template; stud finder; frame-specific hanging hardware (wire, D-rings or sawtooth); visitor-selected wall fastener; French cleat (optional, only if selected for the project).
- Add names only. Do not add quantities, unit prices, estimated costs, default brands, anchor ratings, load recommendations or automatic purchase suggestions. Leave quantity and price blank until the visitor supplies them.
- Each item must be removable/editable. The preset must not imply that every listed item is required. In particular, a hub/border router is conditional on the actual smart-home protocol, and a wall fastener is selected only after the wall substrate and exact hardware are known.
- **Preset fixtures:** selecting Smart home starter inserts only the listed names with blank quantity and price; selecting Hang and mount does the same. CI should assert that no quantity, unit price, brand, anchor rating or estimated total is prefilled. Render the two sample lists as plain HTML text so their contents are readable without executing the preset interaction.
- These presets do not change the article map's A/B/C classification and do not authorize article edits or link placement.

## 7. Source register

### Picture hanging and wall layout
1. The Home Depot, [How to Hang a Picture](https://www.homedepot.com/c/ah/how-to-hang-a-picture/9ba683603be9fa5395fab9009928978) — 57 in centre guideline; 8–10 in above bed/sofa; roughly two-thirds furniture width; hardware-specific measuring and stud advice.
2. Frameology, [Wall art placement rules](https://frameology.com/blogs/resources/best-wall-art-placement) — 57–60 in centre, 6–10 in furniture clearance and 2–3 in suggested gap between frames; corroborating decorating guidance, not a code or universal standard.
3. Lowe's, [How to Find Studs](https://www.lowes.com/n/how-to/how-to-find-studs-in-walls) — common 16/24 in on-centre spacing; confirm the actual stud locations.

### Fixing-load evidence
4. TOGGLER, [Frequently Asked Questions](https://toggler.com/frequently-asked-questions/) — quarter of ultimate for TOGGLER's own anchor products, with explicit wall/installation caveats.
5. TOGGLER, [SnapSkru 2024 Installation and Performance Data](https://toggler.com/pdfs/SnapSkru-Self-Drilling-Drywall-Anchors-2024.pdf) — product- and thickness-specific ultimate tensile and shear values; quarter note.
6. E-Z Ancor, [FAQ](https://www.easyanchors.com/FAQ/) — multiple anchors do not automatically multiply load performance; product-specific spacing note.
7. ITW Buildex, [E-Z ANCOR Self-Drilling Drywall Anchors — Product Data](https://www.buildsite.com/pdf/itwbuildex/E-Z-ANCOR-Self-Drilling-Drywall-Anchors-Product-Data-2964390.pdf) — lists average ultimate values and says to apply appropriate safety factors, but supplies no numeric factor. The mirrored PDF identifies the ITW Buildex product family and is the source linked from the existing guide.
8. Existing article how-much-weight-can-drywall-anchors-hold.html — its “use the smaller quarter figure” wording is the article author's cautious interpretation, not a manufacturer rule.

### Electrical load and regional supply
9. Schneider Electric, [NEC 210.20(A) Continuous and Noncontinuous Loads](https://productinfo.se.com/na-std-ref/viewer?docidentity=NECInformationOfNote-F20BDBCC&extension=xml&lang=en&manualidentity=DataBulletinConductorAmpacityTables-F209E73A) — branch-circuit overcurrent-device rating is the noncontinuous load plus 125% of the continuous load within the rule's scope.
10. National Fire Protection Association, [NFPA 70, National Electrical Code, 2026 Edition](https://www.nfpa.org/product/nfpa-70-standard/p0070code) — official current-edition identification. The A2025 ballot document is a revision-cycle record, not the published Code text; no claim about the ballot's proposed 210.23(B)(1) wording is made here without confirmation in the published text.
11. Schneider Electric, [PowerLogic PM5500 — Real, reactive and apparent power](https://www.productinfo.schneider-electric.com/pm5500/595e2aa946e0fb0001f715da/PM5500%20user%20manual/English/HRB1684301-16.pdf) — distinguishes watts (real power), VA (apparent power) and power factor.
12. Electrical Safety First, [Overloading sockets](https://www.electricalsafetyfirst.org.uk/safety-advice/home-and-people/house-maintenance/overloading-sockets/) — check the marked current rating; extension leads vary (often 13 A, some 10 A or less).
13. Electrical Safety First, [Plugs and fuses](https://www.electricalsafetyfirst.org.uk/safety-advice/home-and-people/house-maintenance/plugs-and-fuses/) — UK 13 A plug/fuse context and appliance examples.
14. US Department of Energy, [United States Electricity Industry Primer — Household Wiring](https://www.energy.gov/node/1508886) — US standard 120 V rms / 60 Hz.
15. Natural Resources Canada, [Energy Audit Manual and Tool — Technical Supplement](https://ressources-naturelles.canada.ca/sites/www.nrcan.gc.ca/files/oee/pdf/publications/infosource/pub/cipec/energyauditmanualandtool.pdf) — typical 120 V / 60 Hz household supply.
16. UK legislation, [Electricity Safety, Quality and Continuity Regulations 2002, regulation 27](https://www.legislation.gov.uk/uksi/2002/2665/part/VII/made?view=extent) — declared low-voltage supply 230 V and 50 Hz unless otherwise agreed.
17. European Commission, [External Power Supplies — mains supply definition](https://energy-efficient-products.ec.europa.eu/product-list/external-power-supplies_en) — 230 V AC at 50 Hz.
18. UK government, [Electricity Engineering Standards Review](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/943700/electricity-engineering-standards-review-technical-analysis-topic-areas.pdf) — harmonised 230 V nominal European voltage envelope.

### Energy calculation
19. Lawrence Berkeley National Laboratory, [Home Energy Saver — Miscellaneous Equipment Energy Consumption](https://hes-documentation.lbl.gov/calculation-methodology/calculation-of-energy-consumption/appliances/miscellaneous-equipment-energy-consumption) — active and standby watt-hours by operating hours, 8,760-hour year and 1,000 Wh-to-kWh conversion.
20. IEA 4E, [Standby of Smart Lamps — Second Report](https://www.iea-4e.org/ssl/our-work/standby-of-smart-lamps-second-report/) — measured smart-lamp standby range; the updated sample's mean is 0.51 W and median 0.39 W, so 0.5 W is a worked example, not a universal device default.
21. Existing article smart-lighting.html — the 0.5 W × 24 × 365 ÷ 1,000 = approximately 4.4 kWh/year worked example; the new tool must match this arithmetic.

## 8. Handoff boundary

- **ChatGPT WS1:** research and specifications only; map file is separate. The current Home Check-up is not an energy audit (it scores storage, design, repairs/moisture and smart-home friction), and the bathroom-fan calculator does not diagnose a dripping fan; those two articles are deliberately class C in the map.
- **Claude / Calculator Owner:** decide implementation scope, especially whether to revise the existing 80% copy before or alongside T4a; review T2 and T4a-b technical behavior.
- **Publishing lane:** places article links only after the registry contract is stable; ChatGPT does not edit article text or links.
- **Design lead:** styles after semantic hooks/markup are agreed; this document does not prescribe visual design.
- **No T3 build** under the current generic design. Reconsider only if a manufacturer-specific system provides the missing group-load and working-load evidence.
