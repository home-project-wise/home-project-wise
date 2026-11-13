# HVAC-001-HERO: image prompt (editorial hero, not yet generated)

- **Article:** `how-to-measure-hvac-air-filter-size` (HVAC-001)
- **Status:** PROMPT ONLY. No image has been generated or committed. The article ships with the original SVG size diagram as its hero.
- **Format:** landscape 16:9, at least 1600 x 900 px, sRGB JPEG or WebP, 120 KB or less after export. Suggested file name: `hvac-filter-measure-hero.jpg`.
- **Look:** S19 "quiet luxury" editorial photography (ops room, 2026-11-12): natural light, 35 mm, soft film grain, believable shallow depth of field, calm and tidy.

## Prompt

Editorial close-up photograph in a tidy American utility closet, two hands measuring the opening of a furnace filter slot with a retractable tape measure held flat against the sheet-metal edge, a pleated cardboard-frame air filter leaning upright beside the slot with a simple printed arrow shape on its frame edge pointing toward the furnace, the frame edge otherwise blank, soft natural light from a doorway on the left, painted white drywall and a neat concrete floor in the soft-focus background, muted palette of warm cream, deep evergreen and brushed brass, 35 mm lens at eye level, soft film grain, shallow depth of field with hands and filter slot in sharp focus, uncluttered, landscape 16:9. The tape measure blade shows only plain tick lines in soft focus. No readable text or numbers anywhere.

## Negative prompt

text, letters, numbers, numerals, readable tape measure markings, brand names, logos, watermark, faces, clearly visible people, cartoon, 3D render, CGI gloss, HDR, oversaturated, clutter, warped sheet metal, extra fingers, fused hands, filter forced into a slot, open electrical panel, exposed wiring, flame

## Three variations to request

1. Hands from the left, filter upright at right, doorway light from the left.
2. Slightly higher angle looking down at the slot opening, filter resting on the floor beside it.
3. Tighter crop on the tape measure against the slot edge, filter softly out of focus.

## Alt text (draft)

Hands holding a tape measure across a furnace filter slot beside an upright pleated air filter with an arrow on its frame

## Accuracy requirements (reject if wrong)

- The arrow on the frame must point toward the furnace or air handler, into the slot.
- The filter must be a pleated filter with a cardboard frame, not a bathroom fan filter or a window unit filter.
- The slot is an ordinary filter slot with its cover removed and leaning nearby; no sealed panels opened, no wiring exposed.
- American details: imperial tape, standard sheet-metal furnace cabinet, drywall.

## Quality gate (S19, reject and regenerate, max 3 attempts, then escalate to the owner)

Inspect at 100% zoom and at phone width. FAIL on any of:
- distorted hands or fingers, merged objects
- legible or garbled numerals on the tape measure, or any pseudo-text on the filter frame, cabinet or tape
- impossible geometry: bent verticals, a filter that could not fit the slot, a slot with no plausible cabinet
- plastic or waxy surfaces, inconsistent shadows, repeating-pattern artefacts
- subject unclear at a glance, or style drifting from the S19 set

Log each accepted image as: prompt id, PASS, reviewer. Disclosure caption convention: "AI-generated image:" (owner decides final wording).
