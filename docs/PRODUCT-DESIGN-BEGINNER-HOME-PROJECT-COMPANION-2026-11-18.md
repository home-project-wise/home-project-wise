# Beginner Home Project Companion — Product Blueprint
**Prepared by:** ChatGPT — product design, research and calculation/data review  
**Date:** 2026-11-18  
**Status:** Product blueprint for owner and Claude review. Documentation only. Not authorization to change calculator code, price data, assumptions, workflows or deployment.

## 1. Product vision

Turn HomeProjectWise from a collection of useful calculators into a beginner-friendly companion that helps a homeowner move from an intention ("I want to renovate this room") to a clear, realistic and trackable plan.

**Product promise:** *Tell us what you want to improve. We'll help you understand the work, reuse your measurements, estimate what can be estimated, identify what remains unknown, prepare a shopping list and know what to do next.*

The product must be useful to someone who:
- does not know trade names, material terminology or formulas;
- does not know which calculator to open;
- has only approximate measurements at first;
- wants an early cost picture before buying or hiring;
- needs help distinguishing DIY-suitable tasks from work requiring a qualified professional.

The product is not a contractor, architect, structural engineer, electrician, quantity surveyor, legal adviser or a guaranteed quotation. It should explain its limits and direct users to qualified local help when appropriate.

## 2. Product principles — non-negotiable

1. **Goal-first, not calculator-first.** Ask what the visitor wants to achieve in plain language. Recommend the relevant tools and questions.
2. **Measure once, reuse carefully.** Room dimensions, openings, units and selected market are shared project facts. Never ask for them again without explaining why a different measurement is needed.
3. **Progressive disclosure.** Ask one useful question at a time. Do not front-load a long form or require technical choices that are not yet relevant.
4. **Beginner language.** Explain terms in ordinary language, with examples and simple diagrams where useful. Never assume knowledge of trade terminology.
5. **Show the method.** Each calculated result explains the inputs, formula/basis, unit, assumptions and exclusions.
6. **Unknown is not zero.** Missing product coverage, unavailable local prices, unconfirmed labour, or unknown site conditions remain visible as unknown.
7. **Evidence before precision.** Never invent coverage, pack size, roll yield, waste, labour rates, tax, delivery, code requirements or product compatibility.
8. **Separate unlike costs.** One-time materials, labour, tools, delivery, permits/taxes and recurring energy costs have separate lines and subtotals.
9. **No double counting.** Mutually exclusive options cannot both consume the same area; shared scope is allocated explicitly.
10. **Local applicability.** Prices, safety guidance, permits, tax and contractor credentials are jurisdiction-specific. Never silently reuse another market's data or legal rules.
11. **Safe boundaries.** High-risk electrical, gas, structural, roof, asbestos/lead, waterproofing and other regulated work triggers clear stop-and-consult guidance, not step-by-step instructions for an unqualified beginner.
12. **Privacy by default.** Preserve the current browser-only calculation approach unless the owner explicitly approves a privacy-reviewed architecture change. Do not transmit or persist room measurements without explicit consent and a documented need.
13. **Accessible on mobile.** Plain labels, keyboard support, readable errors, touch-friendly controls, responsive layout and assistive-technology semantics are release requirements.
14. **No false reassurance.** An estimate is not a quote, and a known-material subtotal is not the full project budget.

## 3. Target users and jobs to be done

### Primary persona: first-time DIY homeowner
"I have a room to improve. I don't know where to start. Help me understand the steps and likely costs without making me learn construction first."

### Secondary persona: practical planner
"I know what I want to do, but need quantities, shopping items, a budget and a sequence."

### Secondary persona: homeowner comparing tradespeople
"I have two or three quotes. Help me see whether they cover the same work and what is missing."

### Core jobs
- Identify the right project path from a plain-language goal.
- Capture room/home context once.
- Understand the scope and order of work.
- Estimate geometry and material quantities only where the data supports it.
- Build a transparent known-cost range and expose unknowns.
- Turn the plan into a shopping/checklist.
- Track decisions, purchases and completion.
- Prepare comparable information for a professional quote.

## 4. Information architecture

### A. Project home
- Start a project / continue a project.
- Project title, room/area, market, units, status and last updated.
- Quick summary: planned work, known cost range, missing prices, next action.
- No requirement to create an account in the initial browser-only release.

### B. Project discovery assistant
Entry choices expressed in everyday language:
- Improve a whole room.
- Paint or finish walls.
- Change the floor.
- Change wallpaper.
- Renovate a bathroom.
- Renovate a kitchen.
- Improve ceiling/roof/insulation.
- Plan lighting/electrical improvements.
- Repair or maintain something.
- I am not sure — describe what I want.

Free-text is an optional helper, not an AI-only dependency. A deterministic guided path must work even if no language model is available.

### C. Home and room profile
- Market/country and currency (selected once per project; market changes trigger a clear review of price applicability).
- Measurement unit system.
- Room dimensions: length, width, wall height.
- Openings: doors/windows only when relevant; dimensions or total opening area with clear distinction.
- Ceiling shape/height where needed.
- Existing surface/condition and intended finish only when needed.
- Optional room photo or sketch can be considered later; no image inference should silently become a measurement.
- Multi-room support is later phase.

### D. Scope and work plan
- User-selected outcomes.
- Proposed tasks grouped by preparation, removal, repair, installation, finishing, inspection and cleanup.
- Each task has status: suggested / confirmed / not needed / needs professional / blocked by missing information.
- Dependencies explain why sequence matters (e.g., repairs before finishing; concealed services before closing surfaces).
- Users can remove or add tasks; scope changes update estimates and show what changed.

### E. Estimators and material catalogue
- Reuse existing calculators where valid.
- Add material-specific quantity estimators only after source-backed product assumptions exist.
- Each estimate stores: quantity, unit, calculation basis, input dependencies, assumptions, market, product specification (if any), source and date.
- Distinguish geometry (e.g., net wall area) from product conversion (e.g., litres, tins, packs, rolls).
- Never imply a purchase count from an area-only price record.

### F. Project budget
Each line item must be one of:
- **Reference estimate:** source-backed range with market, currency, unit/basis, source and date.
- **Your price:** exact user-entered price or quote; takes precedence over a reference estimate for the same item.
- **Needs a price:** planned cost not yet supported.
- **Excluded:** explicitly outside the current total, with reason.

Separate subtotals:
- Known materials (low–high).
- User-entered exact prices.
- Labour.
- Tools/equipment.
- Delivery/removal/waste.
- Permits/fees/taxes (only when jurisdictionally verified).
- Recurring operating costs (e.g., electricity), separate from one-time project spend.

Summary language:
- "Known material subtotal" rather than "total project cost" when costs are missing.
- Show number of priced and unpriced items.
- Explain that the overall budget is incomplete until missing costs are resolved.
- Never display a confidence percentage without a validated methodology.

### G. Shopping list and progress
- Item, purpose, required specification, estimated quantity (only if supported), price source/entered price, supplier note and purchase status.
- Status: to research / ready to buy / purchased / substituted / not needed.
- Substitutions trigger a compatibility review; do not assume similar products are interchangeable.
- Checklist tasks can be marked not started / in progress / done / blocked.
- No retailer affiliate ranking or purchase steering in the initial product design.

### H. Project guide and safety
- Plain-language overview of each stage.
- Preparation and protection checklist.
- Tools and materials with clear role and limitations.
- Quality checkpoints and signs that work should stop.
- Local permit/licensing checks and professional referral triggers.
- Safety notices appear before the relevant task, not buried in a generic disclaimer.

### I. Quote comparison
- Enter each contractor quote manually or upload/parse later (upload feature is not in Stage 1).
- Normalize quotes against the same scope.
- Compare inclusions, exclusions, materials/specifications, labour, preparation, protection, cleanup, delivery, waste, tax, permits, schedule, warranty, payment milestones and change-order terms.
- Missing details are marked "not stated", never assumed included.
- Do not automatically recommend the lowest quote.

## 5. End-to-end beginner journey

1. **Intent:** "What are you hoping to improve?" User selects a goal or describes it.
2. **Clarify scope:** one short question at a time. Example: "Is this one room or several?"
3. **Create room context:** capture dimensions and market once. Explain how to measure and allow "I don't know yet" where safe.
4. **Confirm proposed work:** show a simple task list; user can add/remove tasks.
5. **Calculate what is supportable:** geometry first, then product quantities only if specifications support conversion.
6. **Build project basket:** carry valid calculator results into a shared plan, without duplicate surfaces or duplicate costs.
7. **Expose unknowns:** list missing prices, product decisions, site checks and professional questions.
8. **Prepare to buy or request quotes:** shopping list and consistent contractor brief.
9. **Guide execution:** show the next safe step and dependencies.
10. **Track progress:** user marks decisions, purchases and tasks; budget and remaining work update.

At every step provide:
- where the user is in the journey;
- why the current question matters;
- what can be skipped and what cannot;
- how to correct a previous answer;
- what the program will calculate from the answer.

## 6. MVP scope and delivery stages

### Stage 0 — product contract and validation (this document)
Deliverables:
- Product principles and information architecture.
- Beginner journey and acceptance criteria.
- Research and safety reference register.
- Review by owner and Claude before implementation.
No code or price data changes.

### Stage 1 — Room-to-Ready single-room foundation
Use the existing shared room and market context. Deliver:
- One project view for one room.
- Add one flooring estimate and one wall-finish estimate.
- Paint OR wallpaper for the same wall area, not both by default.
- Carry valid results into a project basket.
- Evidence state on every line.
- Known material subtotal low–high, priced/unpriced counts and incomplete-budget notice.
- Electricity running cost in a separate recurring-cost panel.
- Manual price override precedence.
- Browser-only privacy and regression protection.
Acceptance criteria must map to independent test scenarios.

### Stage 2 — guided scope, material list and shopping checklist
- Add a beginner project selector and task plan for a small set of supported projects.
- Add material quantity conversion only for well-sourced product specifications.
- Shopping list with quantity basis and purchase tracking.
- Keep unknown quantities visible.

### Stage 3 — execution guidance and safety gates
- Sequence tasks and provide plain-language guidance.
- Add jurisdiction-specific professional/permit checks only when sources are verified.
- High-risk tasks must stop at recognition, preparation and referral boundaries.

### Stage 4 — multi-room and phased budgets
- Home-level project with multiple rooms.
- Shared materials only when allocation is explicit.
- Essentials-now vs complete-project scenarios.
- Avoid duplicated room measurements and duplicated cost lines.

### Stage 5 — quote comparison
- Standardized quote intake.
- Scope normalization and missing-information flags.
- Side-by-side comparison without automatic lowest-price selection.

### Deferred until evidence and owner approval
- AI-generated construction instructions.
- Automated product shopping or retailer recommendations.
- Automated local contractor marketplace.
- Structural/load calculations.
- Electrical circuit design or wiring instructions.
- Plumbing system design.
- Asbestos/lead diagnosis.
- Automatic image-based measurement.
- Cloud accounts, sync, collaboration and storage.

## 7. Data and calculation architecture requirements

Every calculation result should be traceable to:
- input values and units;
- formula or documented calculation method;
- source/assumption identifier;
- market/jurisdiction;
- product type/specification if applicable;
- source publication/effective/checked date;
- eligibility status;
- known exclusions and uncertainty.

### Evidence classes
- **Verified source-backed:** exact source and applicability checked.
- **User-provided:** entered by user, not independently verified.
- **Illustrative:** educational example only; never included in a live project subtotal.
- **Unknown / unavailable:** no valid basis; cannot be treated as zero.
- **Excluded / not applicable:** explicitly outside current scope.

### Quantity rules
- Geometry calculations may proceed from dimensions and documented formulas.
- Product quantity conversion requires product coverage, pack size, application conditions and any manufacturer guidance needed for that product.
- Waste/overage must be an explicit, justified rule or a user-entered allowance; never silently inserted.
- For irregular surfaces, openings and multiple wall types, disclose the simplification or request the missing measurement.
- Rounding rules must be explicit and suitable for the purchasing unit.
- Keep raw calculated quantity separate from rounded purchase quantity.

### Price rules
- Exact market and currency only.
- No cross-market fallback or silent FX.
- Keep source-backed ranges separate from exact user-entered prices.
- No inferred labour, tax, delivery, permit, waste or tool costs.
- Record source freshness and flag stale observations.
- A price range is not a quote and not necessarily a national average.

## 8. Safety, legal and trust framework

Safety and legal content must be localized. A rule from one country is not automatically applicable in another.

Before enabling a project path, classify tasks:
- **Low-risk planning:** measuring, selecting finishes, estimating visible surface areas.
- **DIY with precautions:** only where the task and local guidance support it; include clear stop conditions.
- **Professional required/recommended:** fixed electrical installation, gas, structural changes, roof work, complex plumbing, regulated waterproofing, hazardous-material disturbance, or work requiring permits/inspection.
- **Unknown risk:** pause and request local professional advice rather than guessing.

The product must not provide a generic "safe to DIY" label based only on the project category. Risk depends on building age, location, existing conditions, user competence and the exact work.

## 9. Accessibility and beginner usability requirements

- Every control has a persistent, meaningful label.
- Units and expected formats are visible before entry.
- Required vs optional fields are explicit.
- Errors identify the problem and how to fix it in plain language.
- Preserve entered data when validation fails.
- Keyboard navigation and visible focus.
- Screen-reader announcements for changed totals and errors.
- Avoid relying on colour alone for status.
- Use short chunks, progressive disclosure and plain language.
- Mobile-first layout; no horizontal scrolling for core tasks.
- Test with novice users, not only developers.

## 10. Product success measures

Do not optimize for number of calculators or raw page views alone.

Measure:
- Beginner task completion rate: user reaches a usable project plan.
- Measurement re-entry rate: target is zero for unchanged shared dimensions.
- Abandonment by step and reason.
- Percentage of estimates with traceable basis/source.
- Number of hidden/unknown costs exposed before purchase.
- Calculation error and regression rate.
- Quote-comparison completeness (same scope, missing fields identified).
- Safety escalation correctness.
- Mobile accessibility defects.
- User-reported clarity: "I know what to do next."

A successful experience is not one that always returns a number. It is one that helps the user make a better decision and tells the truth when a number is not yet knowable.

## 11. Independent QA scenarios to add

In addition to Stage A's existing Room-to-Ready contract scenarios, future tests should cover:
1. Beginner can start without knowing calculator names.
2. User can say "I don't know" and receive a safe next step.
3. Same room dimensions and market are not requested twice.
4. Changing dimensions recalculates all dependent results and shows affected items.
5. Changing market invalidates or rechecks market-specific prices.
6. Unknown product coverage prevents unsupported package count.
7. User-entered quote replaces, rather than adds to, the reference price.
8. Paint and wallpaper do not both consume the same wall area.
9. Electricity monthly cost remains separate from renovation spend.
10. Unpriced work prevents the interface from calling the subtotal a complete budget.
11. Scope changes update the task list and budget transparently.
12. High-risk work triggers local professional guidance before instructions.
13. Old-building hazardous material warning appears where relevant and jurisdictionally appropriate.
14. Every material quantity exposes its calculation basis and unit.
15. Mobile keyboard and screen-reader users can complete the flow.
16. User can export or print a clear project summary without leaking data to a server.
17. Existing standalone calculators continue to work independently.
18. User can remove a suggested task without corrupting unrelated estimates.
19. A product substitution triggers a specification check.
20. Quote comparison marks missing inclusions as "not stated", not "included".

## 12. Research and reference register

The following sources inform product principles. They are not universal legal rules; local equivalents must be researched before enabling jurisdiction-specific guidance.

### Beginner forms and accessibility
- W3C WAI, WCAG 2.2 — Labels or Instructions (SC 3.3.2): https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions
- W3C WAI Forms Tutorial — Labels: https://www.w3.org/WAI/tutorials/forms/labels/
- W3C WAI Forms Tutorial — Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/

### Quotes, budgets and consumer protection
- New Zealand Consumer Protection — Quotes and estimates: https://www.consumerprotection.govt.nz/general-help/guide-to-buying-smart/quotes-and-estimates
- UK Citizens Advice — Before you get work done on your home: https://www.citizensadvice.org.uk/consumer/getting-home-improvements-done/before-you-get-building-work-done/
- Ontario — Your rights when starting home renovations or repairs: https://www.ontario.ca/page/your-rights-when-starting-home-renovations-or-repairs
- Northern Territory Consumer Affairs — Building and renovating your home (written quotes, scope, hidden costs): https://consumeraffairs.nt.gov.au/__data/assets/pdf_file/0005/668273/building-and-renovating-your-home.pdf

### Competence, building rules and electrical safety
- UK HSE — Electricity FAQs and competence: https://www.hse.gov.uk/ELECTRICITY/faq.htm
- UK HSE — Introduction to electrical safety: https://www.hse.gov.uk/ELECTRICITY/introduction.htm
- GOV.UK — Use a competent person scheme: https://www.gov.uk/building-regulations-approval/use-a-competent-person-scheme
- Electrical Safety Foundation International — DIY electrical safety: https://www.esfi.org/do-it-yourself-diy-electrical-safety/

### Hazardous materials and renovation
- US EPA — Lead-safe renovation, repair and painting (updated March 2026): https://www.epa.gov/lead/steps-lead-safe-renovation-repair-and-painting
- US EPA — Lead-safe renovations for DIYers: https://www.epa.gov/lead/lead-safe-renovations-diyers

### Product-specific quantity evidence (future research requirement)
For paint, tile adhesive/grout, flooring packs, wallpaper, insulation, plasterboard and other materials, use the exact manufacturer's current technical data sheet and installation instructions for the selected product, substrate, application method and market. Do not substitute generic coverage claims for product evidence. The source register for each enabled material must record exact product/version, unit, stated coverage, conditions, date checked and exclusions.

## 13. Open questions for owner and Claude review

These are review questions, not blockers to this blueprint:
1. Should the first guided entry be a whole-room project, with standalone calculator access retained as an alternate path? Recommendation: yes.
2. Should free-text intent be supported in the first release, or should deterministic guided choices ship first? Recommendation: guided choices first; free-text later unless it can be added without unreliable AI dependencies.
3. Should Stage 2 shopping progress remain browser-local? Recommendation: yes until a privacy-reviewed persistence decision is made.
4. Which first two or three project types have sufficient verified data to support real beginner journeys? Recommendation: begin with room refresh (floor + one wall finish), then add other project types only after evidence review.
5. What local jurisdictions should be supported first for safety and permit guidance? This must be an explicit product decision; do not infer it from price-market availability.

## 14. Requested review from Claude

Please review this as a product/technical partner, not as an implementation request.

Return:
- architecture constraints or conflicts with the current calculator;
- features that should be removed, split or reordered;
- smallest technically coherent release boundary;
- data model and state-management implications;
- accessibility, responsive and regression risks;
- tests needed beyond the listed scenarios;
- any proposal that reduces complexity without weakening beginner outcomes.

Do not begin implementation from this document. Wait for owner approval of the reviewed product contract and a separate implementation task. Keep this blueprint documentation-only until that decision.

---
**Decision status:** proposed for review.  
**Implementation status:** not started / not authorized by this document.
