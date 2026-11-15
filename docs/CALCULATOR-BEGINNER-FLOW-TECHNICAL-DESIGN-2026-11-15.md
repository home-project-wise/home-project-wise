# Calculator beginner flow: technical design (response to Issue #362)

**Author:** Claude, Calculator Owner. **Date:** 2026-11-15. **Status:** design for owner and ChatGPT review; nothing here is implemented yet.

## 1. Principle (from Issue #362, accepted)
A visitor who knows nothing about building materials must reach a useful range with **only the room size and the kind of work**. The calculator carries the assumptions; every assumption is shown with its source; technical inputs move under "Advanced settings"; if no sourced assumption exists the calculator says so and does not invent a number.

## 2. What the audit of the current code shows
- **Flooring:** asks for coverage per pack. The cost can be computed from **area** alone using the sourced price per sq ft or m² already in the registry, so the pack question can be optional today.
- **Paint:** asks for coverage per tin. A beginner cannot answer; a sourced typical coverage range is needed.
- **Wallpaper:** asks for roll width, length and pattern repeat. Typical roll sizes differ by region; a sourced assumption set is needed.
- **Electricity:** choosing a place is already beginner-friendly; the appliance wattage is the remaining expert input.
- **Existing unsourced defaults:** the page already pre-fills an allowance and a contingency percentage. Under the new principle each needs a sourced reference or an explicit "your choice" label (ChatGPT to advise).

## 3. Design
1. **One shared room** (length, width, height, optional doors and windows) entered once and used by Flooring (floor area), Paint (wall area) and Wallpaper (wall area). In memory only; nothing stored or sent.
2. **Beginner view first.** Result = quantity **range** and cost **range** with the assumptions listed under it ("we assumed X, source, date"). "Advanced settings" (collapsed) holds pack size, coverage, roll size, repeat, allowance, prices, quotes. Any value the visitor enters replaces the assumption and is never blended with it.
3. **Assumptions registry** `data/reference_assumptions.json`, **owned by ChatGPT**, same rules as the price contract: every number has publisher, URL, geography, `observedAt`, `retrievedAt`; ranges not points; `autoEligible` and structured keys; no source, no number. Build copies it to `website/` like the price registry (the existing script step is the model). Claude reads it and never edits a number.
4. **Region and units** follow the visitor's choice (US default for US English): ft²/gallon or m²/litre, currency from the record, no conversion of prices.
5. **Quantities without product specs:** where the pack or roll size is unknown, show the **amount of material** (area, volume) as a range and, where a sourced typical pack size exists, an approximate pack count labelled as such; otherwise show the amount only.

## 4. Data needed from ChatGPT (assumptions registry, step 1: source list, no numbers)
| Key | Used for | Notes |
|---|---|---|
| paint.coverage per gallon / per litre | paint volume range | interior wall, per coat; manufacturer or standards source; low and high |
| paint.coats default | paint volume | recommended coats, sourced or left to the visitor |
| flooring.allowance by layout | flooring area to buy | straight vs diagonal vs patterned; per material where sources differ |
| wallpaper.roll size by region | roll count | US single/double roll vs European roll; pattern-repeat allowance |
| openings.default areas | wall area | typical door and window size by region, or ask the visitor |
| appliance.typical wattage | electricity | later stage; official efficiency or energy agencies |

## 5. Staged plan (each stage: one claim, one PR, tests, evidence by level)
- **Stage 0, no new data:** Flooring becomes area-first. The visitor picks country and floor type, enters the room size, and gets a **cost range from area** using the registry (pack coverage moves to Advanced and only adds a pack count). Allowance stays a visible, labelled field until ChatGPT supplies a sourced default.
- **Stage 1, no new data:** shared room object feeding Flooring, Paint and Wallpaper area fields.
- **Stage 2, needs the assumptions registry:** Paint and Wallpaper quantity ranges from sourced assumptions; Advanced settings container.
- **Stage 3:** electricity appliance presets from sourced wattages.
- **Design specialist:** owns layout, the Advanced settings disclosure styling and wording tone; Claude supplies the logic hooks and ids.

## 6. Acceptance criteria
A first-time visitor with no product knowledge gets a range from room size and work type; every assumption on screen has a source and date; nothing is shown without a source; any visitor input overrides an assumption; no stored or sent data; tests cover each rule; evidence is labelled by level and nothing is called live without a check of the live page.

## 7. Open questions for the owner
- Beginner view as the default for every calculator, with the current detailed forms under "Advanced settings"?
- Is an approximate pack count acceptable when it rests on a sourced typical pack size?
- Start with Stage 0 and Stage 1 now (no new data), while ChatGPT prepares the assumptions source list?
