# Calculator expansion plan: smart home, picture hanging, and article-to-tool links

**Prepared by:** Claude, Calculator Owner
**Date:** 2026-11-20
**Status:** Plan and acceptance criteria only. No code, price data or article edit is authorised by this file beyond what the numbered work items below name. Evidence level: repository `main` at `d1d486f` read on 2026-11-20; metrics copied from `data/SEARCH_METRICS.md` (2026-11-11 entry); nothing here is deployed or tested.

## 1. Owner direction and goal

The owner asked for calculators that serve every home project, starting with **smart home** and **picture hanging** (the two clusters that show the first clicks), and for every article, or every article section that contains a real decision, to lead to a realistic calculation. The editorial lane wants the same link from its side.

Goal: a visitor who knows what to measure and a visitor who does not can both reach a correct, honest calculation from the exact paragraph that raises the question.

## 2. What I read (facts, not interpretation)

- **Clicks are few and early.** Search Console, 2026-10-14 to 2026-11-10: 831 impressions, 4 clicks. Pages with clicks: `what-can-you-plug-into-a-smart-plug` (146 impressions, 2 clicks, position 6.29), `motion-lighting-that-actually-helps` (30, 1, 6.17), legacy `stop-kitchen-counter-clutter` (39, 1). `how-to-hang-large-wall-art-without-damage` has 92 impressions at position 6.41. With four clicks this is direction, not proof.
- **Only 7 of 45 articles link to any tool.** Linked: choose-bathroom-exhaust-fan, how-to-calculate-wallpaper-rolls-pattern-repeat, how-to-fix-damp-crawl-space-humidity, how-to-patch-a-large-hole-in-drywall, right-rug-size-painters-tape-test, what-can-you-plug-into-a-smart-plug, what-size-dehumidifier-crawl-space.
- **Existing tools:** home-project-calculator (Area & volume, Paint, Flooring & materials incl. tile, Electricity cost, Project cost, Wallpaper), bathroom-fan-size-calculator, crawl-space-dehumidifier-calculator, rug-size-calculator, smart-plug-load-check, home-checkup, budget-planner.
- **The hanging guide has no tool link but states a formula.** Centre of the piece about 57 in (145 cm) above the floor, or 6 to 10 in above furniture; hook height = 57 + H/2 minus hook drop (example: 36 in piece, hook 3 in below top gives 57 + 18 - 3 = 72 in); studs usually 16 or 24 in on centre.
- **The anchor guide (PR #441, merged) has no tool link and states a rule.** One quarter of the manufacturer's ultimate pull-out per anchor (example: SnapSkru SP, 79 lb in 1/2 in drywall, about 20 lb); two anchors do not always double the capacity; the package number is not a safe load.
- **The smart-plug tool already exists and matches its article** (volts x amps, 80% margin, green/amber/red). The smart-lighting guide has a standby-cost step with no calculation attached.
- Constraints in force: `AGENTS.md` startup protocol, `docs/VALUE-BEFORE-PUBLISHING.md`, the design lane (visuals/CSS/microcopy tone belong to the design lead), the data lane (prices belong to ChatGPT), the editorial lane (article text and placement belong to the publishing Claude and the production queue). Open PR #442 edits the wall-art article; this plan does not touch articles.

## 3. Principles

1. A calculator exists only to answer a decision the article itself asks the reader to make, using the article's own formula and cited sources.
2. **Not every article gets a calculator.** Forcing a link where no honest number exists lowers trust. Every article ends up in one of three classes (section 4); class C is a valid, permanent outcome.
3. Every number comes from the visitor, a product label or manufacturer table the visitor enters, or a dated cited source. No invented defaults, prices, waste or safety factors.
4. Safety-relevant tools (fixings, electrical) are "check your numbers" tools: they never say "safe", always show the source of any factor, and refuse to compute without the visitor's own rating.
5. Coverage is enforced by CI, not by memory (work item T1).

## 4. Article classes (draft: ChatGPT must verify each against the article text in WS1)

**A: an existing tool already fits; add or deepen the link**
- bathroom-fan calculator: choose-bathroom-exhaust-fan (linked), bathroom-exhaust-fan-dripping-water, reduce-bathroom-condensation
- crawl-space calculator: how-to-fix-damp-crawl-space-humidity, what-size-dehumidifier-crawl-space (both linked)
- rug-size calculator: right-rug-size-painters-tape-test (linked)
- calculator hub, deep-linked to the right tab: how-to-calculate-wallpaper-rolls-pattern-repeat (Wallpaper), choose-paint-finish-for-each-room (Paint), how-to-prepare-a-subfloor-for-lvp (Flooring & materials), how-to-replace-a-cracked-floor-tile (Tile estimator), how-to-patch-a-large-hole-in-drywall (Project cost list), smart-lighting (Electricity cost, standby example), diy-home-energy-audit-walkthrough (Electricity cost, Home check-up)
- smart-plug-load-check: what-can-you-plug-into-a-smart-plug (linked)

**B: a new calculator is justified because the article states a computable decision**
- how-to-hang-large-wall-art-without-damage -> picture-hanging planner (T2)
- how-much-weight-can-drywall-anchors-hold -> fixing-load check (T3, conditional on source verification)
- where-to-put-water-leak-sensors -> leak-sensor spot planner (T4e, low priority)
- motion-lighting-that-actually-helps -> sensor coverage count from the sensor's own stated coverage (T4f, optional)
- candidates to verify, not committed: how-to-replace-bathtub-and-shower-caulk (bead volume per cartridge), how-to-regrout-a-shower-without-rebuilding-it (grout from product coverage), stop-a-drafty-door-without-replacing-it (weatherstrip length), macerating-toilet-basement-bathroom (run check from the unit's own stated lift and run limits; highest-impression page), how-to-measure-hvac-air-filter-size (nominal vs actual size), how-to-install-flooring-transition-strips (linear length), better-evening-home-lighting (only if cited lighting-level sources exist; otherwise class C)

**C: no honest calculation; stay guide-only (reason recorded)**
calm-room, fix-wobbly-furniture, kitchen-counter-zone-that-stays-clear, stop-kitchen-counter-clutter (redirect stub), how-to-adjust-kitchen-cabinet-hinges, how-to-fix-a-squeaky-wood-floor, how-to-fix-a-sticking-interior-door, how-to-repair-or-replace-kitchen-drawer-slides, make-small-living-room-feel-bigger, quiet-entryway-storage, reduce-cable-clutter, simple-home-reset-that-prevents-weekend-chaos, small-bathroom-easier-to-clean, stop-mail-and-paper-pile, stop-musty-bathroom-towels, smart-devices-keep-going-offline, smart-home-privacy-check, smart-home-wifi-outage-test, smart-thermostat-without-c-wire, do-you-need-a-thread-border-router

## 5. Work items

Lanes unchanged: ChatGPT researches, specifies and builds; the design lead styles; the publishing Claude places links in articles; I review each PR once on its exact head and merge or return one consolidated list. One PR at a time. Each item is claimed in `data/AI_COLLABORATION.md` with exact files before work starts.

**Already queued and unchanged:** #439 fix-up and merge; re-run of the failed Pages deploy; verification suite plus tile-unit default; sanity checks; price integration for tile and paint.

**WS1: Article-to-calculation audit and specification (ChatGPT, docs/data only; can run in parallel).**
Deliver: (a) `data/ARTICLE_TOOL_MAP.json` for all 45 articles: class A/B/C, the article sentence that carries the decision, the tool, a prefill object (only non-assumption values such as units), and for C the reason. (b) A spec for T2 and T3 and T4a-c with a cited source for every constant, hand-computed fixtures, safety-stop wording, and US/UK/EU voltage differences where relevant. (c) For T3, an explicit verdict: is the one-quarter factor and the two-anchor treatment supportable from manufacturer or standards sources? If not, T3 is dropped and the article links to T2 only.

**T1: Tool registry and link contract (no new calculations).**
`website/tools-registry.json` (id, title, url, topics, accepted query parameters, linked articles) and a small unstyled `tool-link` snippet with stable hooks for the design lead. Query parameters may prefill units and visitor-supplied example geometry, never prices, waste or allowances; invalid parameters are ignored. A CI test fails if an article neither lists a tool nor carries `noTool: <reason>`, or if a link does not resolve. The registry also feeds the Guided Start chooser. Link clicks may fire a privacy-safe GoatCounter event (`tool-link:<tool>:<article>`) so we can measure which links work.

**T2: Picture-hanging planner (`hang-art-calculator.html`, standalone like rug-size).**
Modes: one piece (centre height from floor, or above furniture with the visitor's chosen gap); wide piece with two hooks; stud positions from the visitor's first-stud measurement and chosen 16 or 24 in spacing; gallery wall (n pieces, chosen gap, rows). Units in/cm both ways, copyable measurement list. No hidden default for gap or hook drop. Fixtures:
- 36 in piece, hook 3 in below top, centre 57 in: hook at 57 + 18 - 3 = 72 in (the guide's own example).
- Furniture top 30 in, gap 8 in, piece 24 in tall, hook 2 in below top: bottom edge 38, top edge 62, hook at 60 in.
- First stud 14 in from corner, 16 in spacing, piece 40 in wide with left edge at 20 in: studs at 30 and 46 in fall inside the span; 14 and 62 do not.

**T3: Fixing-load check (separate PR; conditional on WS1 verdict; I review for safety).**
Visitor enters the weighed object weight, number of fixings and the tested ultimate pull-out for the chosen anchor in their wall thickness from the package or manufacturer table. The tool shows ultimate divided by the sourced factor and compares per fixing. It never presumes the second anchor doubles capacity unless a source supports it, never outputs "safe", and routes heavy or hollow-wall cases to the guide's stud or cleat advice. Fixture: 79 lb ultimate divided by 4 = 19.75 lb allowed per anchor (matches the guide's "about 20 lb").

**T4: Smart-home pack (one PR each, in this order).**
a) Smart-plug check v2: several devices on one plug or strip, summed against the 80% line; keep the existing verdicts. Fixtures from the guide: 15 A at 120 V = 1800 W, 80% = 1440 W; 2300 W gives 1840 W.
b) Running and standby cost: watts x hours / 1000 = kWh, times the visitor's own rate or the sourced regional rate already in the energy reference. Fixture: 0.5 W x 8,760 h = 4.38 kWh per bulb per year (match the smart-lighting guide's wording). Deep-link into the Electricity cost tab.
c) Project-list presets ("Smart home starter", "Hang and mount") with item names only, no prices.
d) Lighting brightness planner only if WS1 supplies cited room-level lighting sources; otherwise class C.
e) Leak-sensor spot planner from the article's six spots, producing a count and a list line.
f) Motion-sensor coverage count from the visitor-entered coverage on the sensor's own box (optional).

**WS3: Placing links in articles (publishing Claude, editorial lane).** After T1 is merged and the registry is stable. One link at each decision point with anchor text that states the decision ("Work out your hanging height"), no savings promises, under the production queue and any editorial freeze in force. I do not edit articles.

**WS4: Styling (design lead).** `tool-link`, the hang-planner output and Guided Start, after the markup contract lands.

## 6. Order and why

#439 and the queued items continue. Then WS1 (parallel), T1, **T2** (a direct formula in the article and 92 impressions at position 6.4), T4a-b (the smart-plug page has the most clicks and its tool already exists), T3 (only if verified), then T4c-f and the B candidates by impressions. Re-check Search Console before building beyond T4b: with four clicks in 28 days, do not invest further in a cluster without a fresh measurement.

## 7. Acceptance for every PR in this plan

Exact-head `quality` and `chromium-visual-qa` green; hand-computed fixtures from a cited source; both unit systems; 320, 390 and 1280 px without horizontal overflow; keyboard-complete; no console errors; no new prices, waste, coverage or safety factors without a cited source; no persistence without owner approval; design lead's lane untouched; claim and result recorded in the operations room with the evidence level (local, PR head, merged, deployed).
