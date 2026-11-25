# Macerating-toilet discharge-route tool: feasibility research

**Prepared by:** ChatGPT — research/spec owner  
**Date:** 2026-11-25  
**Status:** Research in progress; no implementation authorized by this document.  
**Evidence level:** owner-supplied Search Console screenshots; repository article and roadmap read from `main`; official manufacturer manuals and supplier guidance reviewed on 2026-11-25.

## 1. Why this candidate is first

The owner's 2026-11-25 Google Search Console screenshot is the selected 3-month Web view: 7 clicks, 1.94K impressions, 0.4% CTR, average position 18. In the visible Pages table (1–10 of 23), `macerating-toilet-basement-bathroom.html` has **267 impressions and 0 clicks**. The water-leak-sensor guide has 171/0. The approved calculator roadmap ranks the macerator run-check candidate before the leak-sensor planner; `data/ARTICLE_TOOL_MAP.json` marks the leak-sensor planner `B2_after_macerator`. The initial chat suggestion to build T4e first was therefore withdrawn before any code or PR was created.

**Data limitation:** the screenshots do not include the Queries tab. OpenSEO's Search Console API returned `not_connected` on 2026-11-25. Therefore this document does not claim exact query wording, query-level position, or that 267 impressions prove demand for a calculator. The page metric justifies research, not automatic implementation.

## 2. The decision the existing article actually raises

The article asks the reader to compare a proposed discharge route with the **exact pump model's** published limits. It explicitly warns that maximum vertical lift and maximum horizontal run are not a promise that both can be achieved together. It also explains that pipe diameter, bends, horizontal pitch, route order and model change the result.

A useful tool would need to help a visitor collect and check those model-specific facts without turning separate headline maximums into a false combined-capacity verdict.

## 3. Primary-source findings

### Saniflo SaniAccess 3 — US manual

The US SaniAccess 3 instruction manual shows a maximum vertical discharge of 15 ft and a 3/4 in or 1 in discharge pipe; it also specifies the vent pipe and fixture connections. Its routing diagrams require the vertical rise before the horizontal run, show an initial toilet-to-unit connection maximum of 18 in, and prefer smooth bends over tight 90-degree elbows. The US manual diagram indicates a 2% drainage slope. **There is a material inconsistency inside this same manual:** its performance diagram is labelled up to 300 ft horizontal discharge distance (page 2), while the additional-information text says up to 150 ft horizontally (page 4). The article currently repeats 150 ft. This must be clarified with Saniflo before any SaniAccess 3 combined-run calculator uses either figure. Source: [Saniflo SaniAccess 3 Instruction Manual (US PDF)](https://sfa.backend.sfagroup.com/sites/default/files/2025-03/SaniAccess%203%20Instruction%20Manual.pdf), reviewed 2026-11-25.

### Saniflo SaniAccess 3 — UK/European manual version

The UK/European manual contains a different installation chart: five vertical heights (1–5 m) paired with a horizontal-distance scale up to 100 m, and a 1% slope marker. This is not interchangeable with the US manual's displayed 2% slope. The manual also shows model-specific connection dimensions and routing diagrams. Source: [Saniflo SaniAccess 3 Installation Instructions (UK/European PDF)](https://www.saniflo-pumpshop.co.uk/wp-content/uploads/2023/09/saniaccess-3-instructions.pdf), reviewed 2026-11-25.

**Implication:** a generic international calculator cannot safely reuse one SaniAccess 3 chart or slope assumption across market/manual variants. Country, product version and the actual manual matter. The US manual's 150 ft vs 300 ft horizontal-distance inconsistency is an additional stop condition; do not choose the more favorable number or infer a resolution.

### Liberty Pumps Ascent II — manufacturer manual

The Liberty Ascent II installation manual says:
- vertical lift must precede the horizontal run;
- the initial horizontal run should not exceed 12 in;
- horizontal discharge pipe requires at least 1/4 in per foot fall;
- 3 ft of vertical lift is treated as equivalent to 30 ft of horizontal run for its lift calculation;
- each 90-degree bend adds pressure loss, with an estimate of 3 ft of vertical head per 90-degree bend;
- long runs or multiple elbows require factory sizing advice.

Its worked example uses 5 ft vertical lift, 43 ft total horizontal run and three 90-degree elbows: 5 + 4.3 + 9 = **18.3 ft equivalent head**, then reads the performance curve to estimate 23 gal/min at 60 Hz. Source: [Liberty Pumps Ascent II Installation Manual (PDF copy)](https://bostonheatingsupply.com/Liberty%20Pumps/Ascent%20II%20Installation.pdf), reviewed 2026-11-25. The manual identifies Liberty Pumps as manufacturer and directs installers to its factory for sizing in complex cases.

**Important limit:** 36 ft is the Ascent II's stated *shut-off head*, not a suitable operating allowance or a visitor-facing pass threshold. The manual requires flow/performance-curve interpretation and warns about friction losses. A tool must not compare a computed head to 36 ft and call the route acceptable.

## 4. Competitor / alternative review

[BES — Macerator category and guidance](https://www.bes.co.uk/plumbing-supplies/plumbing/macerator/) (reviewed 2026-11-25) sells multiple models from Grundfos, DAB and Wilo. Its guidance explains that the maximum lift and maximum horizontal figures are not simultaneous and tells the reader to use the manufacturer's chart for pipe size and route. It also distinguishes models by which fixtures they accept. This reinforces that model-specific charts and fixture compatibility matter. The page is a supplier category/guidance page, not evidence of a calculator competitor.

The search sample for “macerating toilet lift horizontal run calculator” surfaced manufacturer manuals, supplier guidance and comparison pages, but no verified independent calculator in this small pass. This is not an exhaustive top-10 SERP audit and should not be presented as proof that no competitor tool exists.

## 5. Calculation feasibility and risk

### What is supported

A **Liberty Ascent II-only arithmetic worksheet** could reproduce the manual's stated estimate:

\[
H_{eq}=H_v + \frac{L_h}{10} + 3N_{90}
\]

where `H_v` is vertical rise in feet, `L_h` is total horizontal run in feet, and `N_90` is the number of 90-degree bends. The manual's own example gives (5 + 43/10 + 3(3)=18.3) ft. This formula is explicitly model-specific and approximate; the manual says to use the performance curve and consult the factory for long runs or multiple elbows.

### What is not supported

- A universal formula for all macerating toilets or lifting stations.
- A pass/fail result based only on independent maximum lift and maximum horizontal-run numbers.
- Using shut-off head as a permissible route limit.
- A general rule for every bend type, pipe diameter, pipe material, pitch, fixture combination or local plumbing code.
- A claim that a visitor's route is safe, compliant, correctly sized or approved.
- Applying the Liberty conversion to Saniflo, Grundfos, DAB, Wilo or other models without their own documented method.

## 6. Recommended product decision

**Do not build a universal “Will this macerator work?” calculator.** The available sources do not support a universal combined-capacity formula or a safe pass/fail threshold.

A narrower option may be worth building after owner/Claude review:

1. Name it a **Macerator Discharge-Route Worksheet**, not a safety or compatibility checker.
2. First screen asks the exact make/model and requires the visitor to have its current installation manual. If the model is not a supported model, do not calculate; show a manual-first checklist and professional sizing prompt.
3. If Liberty Ascent II is the only supported model in the first release, calculate only its manual's approximate equivalent head using the formula above. Label it “manual-based estimate — not a fit verdict”.
4. Show the manual's routing checks separately: vertical rise first; initial horizontal section limit; horizontal fall; pipe size/material from the exact manual; smooth bends; vent and fixture compatibility; service access. The tool cannot verify these from a single height/run number.
5. Display the exact manufacturer source and a clear stop message: long runs, multiple bends, unusual pipe sizes, extra fixtures, a different model/manual version, or uncertain measurements require manufacturer/qualified plumber sizing.
6. Never use the 36 ft shut-off head as a pass threshold. Never output “safe”, “approved”, “will work”, or “fits”.
7. If the owner wants broader model support, collect the actual model-specific charts and their revision/market first; do not infer a chart from marketing maximums.

This narrower worksheet is a **proposal only**, not an approved implementation contract. The query screenshot is still needed to confirm what people are asking, and Claude should challenge whether the worksheet is useful enough to justify a new standalone page rather than a better diagram/checklist in the existing guide.

## 7. Hand-worked fixture for any future implementation

For the Liberty Ascent II manual example:
- Vertical rise: 5 ft
- Total horizontal run: 43 ft
- 90-degree bends: 3
- Horizontal equivalent: 43 / 10 = 4.3 ft
- Bend allowance estimate: 3 × 3 = 9 ft
- Equivalent head estimate: 5 + 4.3 + 9 = **18.3 ft**
- The manual's example reads the performance curve as approximately **23 gal/min at 60 Hz**. Do not extrapolate this as a general flow-rate formula.

A future fixture must assert 18.3 ft exactly (within floating-point tolerance) and must not assert a “pass” verdict.

## 8. Open question before build

The owner should provide the **Queries** tab screenshot for the same 3-month Web window, with rows per page set to 10 or 25 and the query table sorted by impressions. That will show whether the page is appearing for pump-lift/run questions, general basement-bathroom queries, product comparisons, or something else. The current screenshots only establish page-level visibility.

## Sources reviewed

- Saniflo, [SaniAccess 3 Instruction Manual (US PDF)](https://sfa.backend.sfagroup.com/sites/default/files/2025-03/SaniAccess%203%20Instruction%20Manual.pdf), retrieved 2026-11-25.
- Saniflo, [SaniAccess 3 Installation Instructions (UK/European PDF)](https://www.saniflo-pumpshop.co.uk/wp-content/uploads/2023/09/saniaccess-3-instructions.pdf), retrieved 2026-11-25.
- Liberty Pumps, [Ascent II Installation Manual (PDF copy)](https://bostonheatingsupply.com/Liberty%20Pumps/Ascent%20II%20Installation.pdf), retrieved 2026-11-25.
- BES, [Macerator category and buyer guidance](https://www.bes.co.uk/plumbing-supplies/plumbing/macerator/), retrieved 2026-11-25.
- HomeProjectWise, `website/articles/macerating-toilet-basement-bathroom.html`, read from repository main on 2026-11-25.
