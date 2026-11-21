# HomeProjectWise — Experience, Design & Editorial System
**Prepared by:** ChatGPT — product strategy, UX/content architecture and independent QA  
**Date:** 2026-11-18  
**Status:** Proposed foundation for owner, Claude, design, editorial and visual teams. This is a planning document only; it does not authorize implementation, pricing changes or publication.

## 1. Why this document exists

The product blueprint defines what HomeProjectWise should become. This document defines how that promise should feel and work across the calculator, interface, articles and visual explanations.

The governing idea is:

**One project, one shared context, one connected experience.**  
A visitor should not feel that they are moving between unrelated calculators, articles and image galleries. Each part should help them make the next project decision.

Do not build every layer at once. Establish the shared rules and deliver one complete, trustworthy room journey before expanding.

## 2. The product experience: from intention to next action

### 2.1 The main journey

1. **Choose an outcome** — “I want to refresh this room”, “change the floor”, “paint the walls”, “use wallpaper”, or “I am not sure”.
2. **Set the room once** — dimensions, openings where relevant, units and country/market. Explain why each input matters.
3. **Review the work** — a plain-language list of likely tasks, with suggested / confirmed / not needed / needs checking states.
4. **Calculate** — reuse existing calculators and shared room data. Show geometry separately from product purchase quantities.
5. **Review gaps** — identify missing decisions, unsupported quantities, missing prices and site conditions that should be checked before buying.
6. **Build the project basket** — combine only compatible work and costs; show known, user-entered, unpriced and excluded items separately.
7. **Prepare** — shopping checklist, questions for a supplier or contractor, and relevant how-to guidance.
8. **Track** — user marks items purchased and tasks complete; changes explain which estimates and tasks are affected.

A user may enter at any stage. The product should not force a beginner through a wizard if they only need one quick estimate.

### 2.2 The project workspace

The project workspace is the destination that connects the tools. Its first version should be simple and single-room.

**Top area**
- Project name and room name.
- Country/market and unit system, visible but not repeatedly requested.
- A compact “Room details” summary with an edit action.
- A clear project stage such as Planning, Checking prices, Ready to prepare, In progress.

**Main content**
- “Your plan” — selected work and task sequence.
- “Your estimates” — one card per supported estimate, with amount, unit and evidence status.
- “Before you buy” — missing decisions, checks and price gaps.
- “Your next step” — one recommended action, not a wall of instructions.

**Budget area**
- Known material estimate (range where applicable).
- User-entered prices.
- Items still needing a price.
- Labour/tools/delivery/fees only when explicitly sourced or entered.
- Recurring household running costs in a separate panel.
- An unmistakable note when the displayed subtotal is incomplete.

**Mobile behaviour**
- One-column layout.
- Room summary collapses after confirmation but remains easy to edit.
- Main action stays visually obvious.
- No dense tables on narrow screens; use readable cards and expandable detail.
- Keep units, labels and error messages visible without relying on placeholder text.

### 2.3 Screen sketches in words

These are layout directions for the design specialist, not pixel-perfect specifications.

**Screen A — Start**
- Heading: “What would you like to improve?”
- Large plain-language project choices with simple original illustrations/icons.
- “Not sure? Describe it” as an optional route.
- Avoid presenting calculator names as the first decision.

**Screen B — Your room**
- A simple room diagram with length, width and wall height labels.
- Inputs grouped by what they describe, not by formula.
- Openings are optional unless the selected calculation needs them.
- Country and units are set once and shown as shared project settings.
- A short “Why we ask” explanation beside unfamiliar inputs.

**Screen C — Your plan**
- A vertical sequence: Prepare → Repair → Install/Apply → Finish → Check.
- Each task shows why it may be needed and whether it is confirmed or still needs checking.
- The user can mark “Not needed” or edit the scope.
- Do not imply that every project requires every task.

**Screen D — Estimate**
- Large readable result, unit and range where supported.
- Beneath it: “How we worked this out” with inputs, formula/basis, source, date and exclusions.
- Geometry result and product purchase quantity are visually distinct.
- If purchase quantity is unsupported, say what information is missing instead of guessing.

**Screen E — Before you buy**
- A short list of unresolved items, grouped as:
  1. You need to decide.
  2. You need to measure/check.
  3. A price or product specification is missing.
  4. Ask a qualified professional.
- Every item has a reason and a suggested resolution.
- This is the natural home for the proposed Project Gap Detector, once its rules are validated.

**Screen F — Project basket**
- Each line links back to its estimate or task.
- Show known material subtotal and unpriced count.
- Explain changed totals when scope, room dimensions, market or product selection changes.
- No “complete project cost” label while important categories remain unknown.

**Screen G — Guide**
- A relevant short guide, checklist or visual explanation for the current task.
- Return link to the exact project step that opened it.
- Do not send the user to a generic article index and make them search again.

## 3. Visual design direction

The design should feel like a calm, capable project companion — not a contractor dashboard, spreadsheet or DIY hobby blog.

### Visual principles
- Warm, light neutral base with restrained dark text and one consistent accent colour.
- Clear hierarchy: one primary action per screen; secondary details remain available but quieter.
- Generous spacing and readable type; avoid tiny helper text.
- Use real project photography and original explanatory diagrams only where they clarify a decision.
- Use status labels and icons together; never communicate risk or evidence by colour alone.
- Avoid decorative progress percentages unless the underlying completion logic is real.
- Prefer direct, reassuring language without promising certainty.

### Component principles
- **Room summary card:** reusable across every estimator.
- **Estimate card:** result, unit, evidence status, “How calculated”.
- **Task row:** task, reason, status, dependency and optional guide link.
- **Unknown item card:** what is unknown, why it matters, what resolves it.
- **Price line:** market, currency, basis, source/date and caveat.
- **Safety stop panel:** clear reason, what not to do, and appropriate local professional route.

### Visual assets
Create a consistent asset family:
- Room measurement diagrams with consistent perspective and dimension arrows.
- Material close-ups that show the correct product category without brand implication.
- Step illustrations for preparation, installation and inspection.
- Before/after photos only when the comparison is truthful and the scope is clear.
- Safety visuals that communicate a stop condition without dramatizing or normalizing risky DIY.

No image should contain invented labels, fake product packaging, misleading dimensions or unsafe demonstrations. Article hero photography should not be mistaken for technical evidence.

## 4. The editorial system: articles that help complete a project

Articles should not be an isolated traffic library. They should answer the question the user has at a specific project moment.

### 4.1 Four article roles

1. **Decision guides** — help choose between options before adding scope (e.g., paint or wallpaper, flooring types).
2. **Measurement and estimation guides** — show how to measure and understand what a calculator result means.
3. **Preparation and execution guides** — explain a task at an appropriate safety level, with local checks and professional boundaries.
4. **Buying and troubleshooting guides** — help compare specifications, identify missing quote details, and recognize when to stop.

Each article must declare its role, target question, supported project/task, jurisdiction, evidence level and the exact next action it supports.

### 4.2 Article structure

Recommended reusable structure:
- A direct answer in the opening.
- “Is this right for your project?” scope and exclusions.
- What to check or measure first.
- Materials/tools only where verified and relevant.
- Step sequence appropriate to the risk level.
- Quality checkpoints and common mistakes.
- “When to stop and call a professional” where applicable.
- Sources with dates and jurisdiction.
- A contextual next step back into the calculator/project.

Do not pad articles to a target word count. Do not repeat generic advice across multiple pages. One canonical article should own each main question; related pages should link to it.

### 4.3 The calculator ↔ article connection

Use contextual links in both directions:

- **From calculator to article:** next to an unfamiliar input, estimate assumption, missing item or task. The link should open the exact relevant section, not the article homepage.
- **From article to calculator:** a clearly named action such as “Calculate your wall area” or “Add this task to your project”, carrying only data that the user has explicitly approved and that the destination can safely reuse.
- **From project task to article:** each task can expose one primary guide and, only when useful, one supporting guide.
- **From article to project:** preserve the return path and do not silently overwrite existing project choices.

If deep links or state transfer are not yet technically supported, use ordinary links first. Do not simulate persistence or claim that data was carried across when it was not.

### 4.4 Content metadata and quality gates

Every article record should include:
- Unique content ID and canonical URL.
- Main user question and search intent.
- Article role and supported task/project.
- Applicable country/jurisdiction.
- Evidence class: official/primary, manufacturer, expert secondary, or editorial explanation.
- Source links, publication/effective dates and last checked date.
- Risk category and professional referral triggers.
- Calculator destination and relevant input/estimate.
- Related canonical articles.
- Review owner and next review date.

Publishing gate:
- Claims are supported and localized.
- Product instructions match the exact cited product.
- Safety advice has an appropriate primary source.
- No unsupported price, yield, coverage, waste or code claim.
- Links work and point to the correct tool/task.
- Images match the described work.
- No duplicate search intent or near-duplicate article.
- A human/editorial review is recorded for high-risk subjects.

## 5. The proposed Project Gap Detector

This is a promising differentiator, but it must be a transparent checklist engine, not an AI guessing what a house needs.

**Purpose:** identify decisions, checks and likely omissions that a beginner may overlook before buying or starting.

**Output categories**
- Confirmed in the plan.
- Usually relevant — confirm whether it applies.
- Missing information — cannot assess yet.
- Not applicable — user confirmed.
- Professional assessment required.

**Example — painting**
- Surface condition not yet checked.
- Protection of floors/furniture not confirmed.
- Primer applicability depends on existing surface and selected paint system.
- Product coverage and pack conversion may still be unknown.
- Repairs or moisture issues may need resolution before painting.

**Example — flooring**
- Existing floor condition and suitability not checked.
- Underlay requirement depends on the selected flooring system.
- Door clearance and transitions may need checking.
- Moisture/subfloor requirements depend on product and location.
- Pack count must not be inferred without the exact product coverage and applicable installation rules.

**Rules**
- Never claim an item is mandatory unless evidence supports that exact project/product/jurisdiction.
- Explain why an item is shown.
- Let users confirm, dismiss or mark “not sure”.
- Record the source/rule behind every generated item.
- A dismissed item must not silently return unless relevant inputs change.
- The detector cannot provide structural, electrical, gas or hazardous-material diagnosis.

## 6. Shared information model

The first implementation can remain browser-only. The conceptual entities should nevertheless be consistent:

- **Project:** name, selected goal, market, units, status.
- **Room:** dimensions, openings, room-specific notes.
- **Scope item:** selected work and surface/area allocation.
- **Task:** stage, dependencies, status, risk class, related guide.
- **Estimate:** value/range, unit, formula, inputs, source, date, assumptions and exclusions.
- **Price item:** market, currency, unit basis, range/exact price, provenance and freshness.
- **Gap/check:** category, reason, applicability, evidence/rule, user response.
- **Article:** content metadata and supported task/tool.
- **Progress item:** decision, purchase or task state.

Do not build cloud persistence, accounts or a complex database merely to implement this conceptual model. Claude should map it onto the smallest compatible browser-side state model and explain any required migration.

## 7. Team ownership and handoffs

| Team | Owns | Deliverable |
|---|---|---|
| Product / ChatGPT | Product rules, research, calculation semantics, evidence review, independent QA | Clear requirements, sources, acceptance criteria and risk review |
| Engineering / Claude | Existing site, calculator logic, state, responsive implementation, tests, performance and deployment | Small reviewed PRs with exact-head checks and evidence |
| Design specialist | Information hierarchy, mobile flows, component patterns, visual system and usability review | Screen flows, wireframes, component states and design QA |
| Editorial team | Article research, structure, sourcing, internal links and maintenance | Useful canonical guides connected to exact project tasks |
| Visual team | Original photography, diagrams and explanatory illustrations | Consistent, accurate assets tied to article/task IDs |
| Innovation team | Competitor observation, user pain discovery, opportunity hypotheses and experiments | Prioritized opportunity briefs with evidence and measurable tests |
| Owner | Strategic decisions, scope approvals and final product direction | Decisions on trade-offs and release priorities |

No team should silently take ownership of another team's protected files or ship a cross-team change without a recorded handoff.

## 8. Delivery plan — keep the work focused

### Foundation A — agree the product contract
- Owner and Claude review the existing product blueprint.
- Design/editorial/visual teams review this experience system.
- Resolve conflicts and freeze Stage 1 acceptance criteria.
- No parallel feature expansion.

### Foundation B — complete one room journey
- One room profile and market reused once.
- Existing supported floor and wall-finish estimates feed one project view.
- Paint and wallpaper remain mutually exclusive for the same wall area by default.
- Transparent evidence, unknowns and known material subtotal.
- One clear next action.
- Mobile and regression QA.

### Foundation C — connect help to the journey
- Add a small set of canonical articles for the exact questions users face in the first room journey.
- Add contextual calculator-to-article links.
- Add article-to-calculator links without claiming unsupported data transfer.
- Create the visual assets needed by those guides.

### Foundation D — validate before expanding
- Observe novice users completing a real room plan.
- Record where they hesitate, repeat information or misunderstand estimates.
- Fix the biggest verified friction before adding more project types.

### Foundation E — add the Gap Detector as a controlled pilot
- Start with one low-risk, well-sourced project path.
- Test whether users discover a genuine omission before purchase.
- Expand only when false alarms and missed important checks are acceptably low.

## 9. Acceptance criteria for the first connected experience

A novice should be able to:
1. Start from a plain-language goal without knowing calculator names.
2. Enter room dimensions and market once.
3. Reuse those details in relevant estimators without re-entry.
4. Understand what each estimate represents and what it does not.
5. Distinguish measured area from product purchase quantity.
6. See which costs are known, user-entered, missing or excluded.
7. Open an article that answers the exact question they have at that step.
8. Return to the same project without losing context within the supported session model.
9. Identify a clear next action.
10. Complete the core flow on a phone using accessible controls.

Failure cases to test:
- User changes dimensions or country after estimates exist.
- User switches from paint to wallpaper.
- Product coverage is missing.
- Price is stale or from another market.
- A task is marked not applicable.
- An article or image is unavailable.
- A safety-sensitive task is selected.
- A user enters incomplete or invalid dimensions.
- The project has unpriced items but still shows a subtotal.
- Existing standalone calculators continue to work.

## 10. Decisions that must remain explicit

This proposal does not decide:
- Final brand colours, typography or component styling.
- Whether the project workspace replaces the current calculator page or sits alongside it.
- Which exact articles are the first editorial batch.
- Which Gap Detector rules are approved for live use.
- Any new prices, product yields, roll counts, labour or waste assumptions.
- Cloud accounts, synchronization, AI-generated instructions or automatic image measurement.

Those decisions require design review, source research, owner approval or technical assessment as appropriate.

## 11. Immediate next actions

1. **Owner:** review the direction and resolve whether this is the intended product experience.
2. **Claude:** review the blueprint and this experience model; identify the smallest architecture-compatible Stage 1 slice and any conflicts with active work.
3. **Design:** sketch Screens A–F for mobile first, then desktop; focus on the room summary, estimate card, unknown-item card and project basket.
4. **Editorial:** map existing articles to the first room journey; identify gaps before drafting new articles.
5. **Visual:** define the diagram/photo style and list only assets required by the first journey.
6. **ChatGPT:** maintain the product contract, evidence rules, article map and independent QA; avoid duplicate engineering changes.

**Release principle:** finish one connected, trustworthy room journey before broadening the catalogue. A smaller experience that tells the truth and helps the user take the next step is better than a large collection of disconnected tools.
