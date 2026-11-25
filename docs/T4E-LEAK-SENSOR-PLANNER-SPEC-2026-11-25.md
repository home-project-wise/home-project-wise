# T4e — Water-leak sensor planner feasibility and specification

**Prepared by:** ChatGPT  
**Date:** 2026-11-25  
**Status:** Specification only; no implementation authorized.  
**Decision:** **Class C — keep as a guide checklist; do not build a standalone planner.**

## 1. The challenge: what decision would a tool make that the six spots do not?

The article already answers the practical decision: identify the places in the home where a hose, supply line or tank can fail, place a sensor at each applicable place, and prioritize the washing machine, water heater and kitchen sink if buying only a few at first. It also says there is no official number.

A proposed tool could let a visitor tick the applicable locations and add the checked boxes. That creates a count and a shopping-list line, but it does not add a new decision: it merely counts a visitor's checklist. More importantly, the article's labels include plural groups — **toilets** and **bathroom sink cabinets** — so one checkbox per category cannot know whether the home has one toilet or several, or one vanity or several. Asking for those quantities would simply make the visitor count the real locations manually; the arithmetic is trivial and still does not establish sensor coverage or model suitability.

The article's own FAQ says “one for each place” and “There is no official number.” That is useful guidance, but not a source-backed universal count rule for every device, layout or market. The clearer product is the existing six-location checklist in the guide, not a separate calculator.

## 2. Source-backed scope already in the article

### Six main locations

Use only the six main locations named in the article's Step 1 and quick answer:
1. Washing machine — floor beside hose connections and wall valves.
2. Dishwasher — floor at the front or side.
3. Kitchen sink cabinet — cabinet floor under supply lines and drain.
4. Water heater — floor beside the base, or inside its drain pan if present.
5. Toilets — floor at the base, near the supply valve.
6. Bathroom sink cabinets — cabinet floor under each vanity.

### Optional extras named by the article

- Sump pump.
- Refrigerator ice-maker line.
- Condensate pan of a furnace or air conditioner.

The article says these are extras worth adding later; they are not part of a default count.

### First-priority locations named by the article

If the visitor can only buy a few sensors at first, the article recommends:
- Washing machine.
- Water heater.
- Kitchen sink.

Do not invent a numeric risk score or a ranked priority beyond this stated order.

## 3. Hypothetical tool contract — documented to explain why it is not being built

If a selector were ever reconsidered, the only defensible inputs would be visitor-selected applicable locations from the article's list, with optional extras kept separate. A hypothetical output would be a count plus a plain list line, such as “3 sensors to plan for — washing machine, water heater, kitchen sink.” This is a count of selected places only, not a guarantee of coverage, a product recommendation, or an official required quantity.

A one-checkbox-per-category design is not adequate for plural categories. A quantity-per-location design would require the visitor to count actual toilets, vanities and other individual places; it would not remove the need to inspect the home. No calculator should silently assume one toilet or one vanity.

### Hand-computed examples (illustrative only; derived from the article's wording)

| Visitor's selected places | Arithmetic | Hypothetical list line |
|---|---:|---|
| Washing machine, water heater, kitchen sink | 3 selected places = 3 | 3 sensors to plan for — washing machine, water heater, kitchen sink |
| All six main named categories, assuming one actual place in each category | 6 selected categories = 6 | 6 sensors to plan for — six main locations |
| All six main categories plus the three optional extras, assuming one actual place for each | 6 + 3 = 9 | 9 sensors to plan for — six main locations plus three optional extras |

**Caveat:** the second and third examples are not valid universal household totals. They explicitly assume one actual place per named category; homes with multiple toilets or vanities would need to count each actual place. The article does not provide an official number.

## 4. Stop messages a future checklist must preserve

These are editorial/safety guardrails, not implementation instructions:

- **Unknown or unlisted location:** “This guide does not provide a count for that location. Check the device manual and ask a qualified professional if needed.”
- **Multiple toilets or vanities:** “Count each actual place where a leak could reach a sensor; the six labels are location groups, not a guaranteed six-device total.”
- **Coverage or mounting uncertainty:** “A sensor only detects water that reaches its active sensing surface. Check the exact model's manual for orientation, base, remote disc or cable requirements.”
- **Country/model uncertainty:** “Buy a model sold for your country and follow its manual and local rules. This checklist does not verify radio compatibility, approvals or device coverage.”
- **Automatic shut-off:** “A basic leak sensor warns you; it does not turn the water off. An automatic shut-off valve is a separate product and plumbing decision.”
- **Standing water near electrical equipment:** preserve the article's warning not to step in water near outlets, appliances or the electrical panel; call a professional if power cannot be cut safely.

## 5. Every number and its source

| Number / statement | Source and what it supports | What it does not support |
|---|---|---|
| Six main spots | HomeProjectWise article, Step 1 and “The quick answer”; it explicitly names washing machine, dishwasher, kitchen sink, water heater, toilets and bathroom sinks | A universal requirement to buy exactly six devices |
| One sensor for each place | Same article, FAQ “How many leak sensors do I need?” | One sensor for each broad category regardless of how many toilets/vanities exist; any manufacturer-certified coverage guarantee |
| Three first-priority spots | Same article, Step 1 and FAQ: washing machine, water heater and kitchen sink | A numeric risk score or claim that other locations are unimportant |
| Three optional extras | Same article, Step 1: sump pump, refrigerator ice-maker line and condensate pan | A default addition to every home or an official required count |
| UK-specific examples: boiler, airing cupboard hot water cylinder and loft cold water tank | Same article, section “US, UK and EU: where the spots differ” | A fixed UK-only number, a universal requirement, or a matching US/EU add-on list |
| “No official number” | Same article, FAQ “How many leak sensors do I need?” | A country-specific standard or legal requirement |

No other numeric count, sensor coverage distance, detection range, radio range, device quantity, or regional standard is sourced by this article. Do not introduce one.

## 6. US / UK / EU differences supported by the article

- The article says the six main locations apply in most homes.
- It says that in many UK homes, visitors may also want sensors near the boiler, airing cupboard hot water cylinder and loft cold water tank.
- It says sensor radios, plugs and approvals differ by country, and recommends buying a model sold for the visitor's country and checking local rules before fitting a valve.
- It does **not** provide a separate US or EU location count, country-specific sensor quantity, coverage rule, or legal approval list. Do not infer one from the US insurance statistics elsewhere in the article; those statistics describe claims/damage, not sensor counts.

## 7. Device-specific source limits

The article links six sources:
- Connecticut Insurance Department — *Water damage prevention pamphlet*.
- Chubb — *Protecting your condo or co-op from water damage*.
- Chubb Australia — *Ten tips to reduce the risk of water damage*.
- BCAA — *Water damage prevention tips*.
- Risk Strategies — *Water leak prevention at home*.
- Moen — *Placement of Moen Flo Detector*.

The article uses the insurer/safety sources to support the location guidance. It uses Moen's own placement page for one model-specific example: the Flo Detector's active sensing surface and behavior change when used with a mounting base and remote accessory. That is explicitly a Moen-specific arrangement, not a general rule for all sensors. The article also says the active sensing surface and orientation vary by model and accessories.

No one of these sources, as represented in the article, supplies a universal sensor coverage radius or a formula that turns room area, plumbing length or appliance count into a required device count.

## 8. Verdict and map classification

**Class C — keep the six locations as a checklist in the guide. Do not build T4e.**

Reason: the proposed count is only the sum of visitor-selected labels; the article already gives the locations, first priorities, optional extras and the “one for each place / no official number” qualification. It does not add a distinct decision, and a simple category selector risks undercounting plural fixture groups or implying complete coverage. Keep the article's manual-first advice and device-specific placement warnings.

The data/ARTICLE_TOOL_MAP.json entry is therefore changed from planned class B to class C with this reason. The registry does not need a new tool or a noTool field because class C reasons are already validated by scripts/test_tools_registry.js.

**No code, article, CSS, registry, or calculator changes are part of this task.**

## 9. Exact source page

HomeProjectWise, website/articles/where-to-put-water-leak-sensors.html, especially:
- “The quick answer”.
- “Step 1: Walk the house and mark six spots”.
- “US, UK and EU: where the spots differ”.
- “How many leak sensors do I need?”.
- “Do all leak sensors detect water from the underside?”.
- “Sources and further reading” (the six sources listed above).
