# HomeProjectWise: content inventory and decisions (2026-10-24)

Scope: the 23 published articles in `website/articles/` on `main` on 2026-10-24. No drafts exist in the repository (the `content/queue` items are frozen by `.editorial-freeze` and are not reviewed here).

Method and limits: structure, sources, update dates and links were read from the article HTML. Intent, overlap and decisions are editorial judgments made against the pillars and the "no organization topics" boundary in `data/COMPETITOR_RESEARCH_DESIGN_AND_EDITORIAL_PLAN.md` (PR #150, not yet merged). No Search Console, traffic or keyword data was available, so no decision below relies on search volume. Nothing here is a redirect, merge or deletion: every URL stays live until there is data to justify a change.

## Verified facts
- 23 guides. Tags on the pages: Storage & Organization 5, Home Design 5, Weekend Projects 8, Smart Home 5.
- All 23 have a Sources section.
- 13 of 23 carry `dateModified` in their JSON-LD (so the visible "Updated" line can appear). 10 do not: better-evening-home-lighting, calm-room, kitchen-counter-zone-that-stays-clear, make-small-living-room-feel-bigger, motion-lighting-that-actually-helps, quiet-entryway-storage, reduce-cable-clutter, simple-home-reset-that-prevents-weekend-chaos, stop-a-drafty-door-without-replacing-it, stop-musty-bathroom-towels. Several of them were materially edited after publication (see `WORK_LOG.md`), so their readers currently see only "Published".
- 4 guides carry Awin affiliate links (crawl-space guide, dehumidifier sizing, macerating toilet, large wall art). Do not touch them.

## Inventory

Pillars (from the plan): A Repairs & Troubleshooting, B Smart Home & Lighting, C Energy, Airflow & Comfort, D DIY Projects & Installation, E Tools, Materials & Buying Decisions. "Org" = home organization, outside the stated boundary.

| Guide (slug) | Page tag | Reader intent | Pillar | Notes (verified) | Decision |
|---|---|---|---|---|---|
| reduce-bathroom-condensation | Weekend Projects | Fix: fogged mirror, wet walls | C / A | Measure first, fan use, safety and when to call a professional, sources | Keep. Flagship moisture guide; hub for the towels and small-bathroom guides |
| how-to-fix-damp-crawl-space-humidity | Weekend Projects | Diagnose damp crawl space | A / C | Quick win, "when to call a professional", Awin | Keep. Link to the sizing guide and calculator |
| what-size-dehumidifier-crawl-space | Weekend Projects | Buying: capacity | E / C | 7-day test, Awin, matching calculator tool | Keep. Distinct intent from the diagnosis guide: cross-link, do not merge |
| stop-a-drafty-door-without-replacing-it | Weekend Projects | Fix: draft at a door | C / D | Has a "when replacement or professional repair" section; no `dateModified`, no quick answer block | Update: add quick answer and a short note that sealing must not trap combustion or moisture problems; add `dateModified` |
| fix-wobbly-furniture | Weekend Projects | Fix: wobble | A / D | Quick answer, safety, quick win | Keep |
| macerating-toilet-basement-bathroom | Weekend Projects | Buying and install decision | D / E | Honest downsides, permits, Awin | Keep. Re-check regional rules and sources on the next review |
| stop-musty-bathroom-towels | Weekend Projects | Fix: musty towels | A / C | Overlaps the condensation guide on room moisture; no `dateModified` | Keep; link prominently to reduce-bathroom-condensation; add `dateModified` |
| small-bathroom-easier-to-clean | Weekend Projects | Cleaning and layout | Weak fit | Mostly cleaning habits and storage of products | Keep for now, no further investment. Revisit with traffic data (candidate to refocus on moisture-proofing or to fold into the condensation guide) |
| smart-lighting | Smart Home | Choose bulb vs switch | B / E | Neutral-wire check, no-neutral trade-offs, sources | Keep |
| motion-lighting-that-actually-helps | Smart Home | Plan motion lighting | B | 13 numbered sections; no `dateModified` | Keep; add `dateModified` |
| what-can-you-plug-into-a-smart-plug | Smart Home | Safety: load limits | B / E | Watt check, US/UK/EU, matching calculator, "I am not an electrician" | Keep |
| smart-home-wifi-outage-test | Smart Home | Test what works offline | B | Quick answer, FAQ | Keep |
| smart-home-privacy-check | Smart Home | Secure devices | B | Published 2026-10-24, sources NCSC and NCA | Keep |
| better-evening-home-lighting-without-overcomplicating-it | Home Design | Plan room lighting | B / C | 11 numbered sections; overlaps lightly with smart-lighting and motion-lighting; no `dateModified` | Keep; cross-link to the two smart-lighting guides; add `dateModified` |
| how-to-hang-large-wall-art-without-damage | Home Design | Install: heavy art | D | Wall check, hardware by weight, when to call a professional, Awin | Keep. Fits "DIY installation" better than "Home Design" (category question below) |
| right-rug-size-painters-tape-test | Home Design | Choose rug size | E | Tape test, matching calculator | Keep (tool-backed, decision-focused) |
| make-small-living-room-feel-bigger | Home Design | Room layout | Org/decor | No quick answer or `dateModified` | Keep URL, no new work in this lane |
| calm-room | Home Design | Room feel | Org/decor | Overlaps make-small-living-room | Keep URL, no new work; do not merge without data |
| kitchen-counter-zone-that-stays-clear | Storage | Declutter counter | Org | Outside the stated boundary | Keep URL, freeze |
| quiet-entryway-storage | Storage | Entryway storage | Org | Outside the boundary | Keep URL, freeze |
| simple-home-reset-that-prevents-weekend-chaos | Storage | Cleaning routine | Org | Outside the boundary | Keep URL, freeze |
| stop-mail-and-paper-pile | Storage | Paper clutter | Org | Outside the boundary | Keep URL, freeze |
| reduce-cable-clutter | Storage | Cable routing | Borderline | Power and cable safety angle possible | Keep; if updated, reframe around safe cable and power-strip practice |

## Decisions that need the owner
1. The site's top-level category "Storage & Organization" (5 guides) contradicts the plan's boundary. Proposal: do not delete anything. Stop adding to it, and when the guide library is next restructured (after PR #151 is settled) move toward categories that match the pillars (for example Repairs & Moisture, Smart Home & Lighting, Install & Improve). Changing categories touches the generated indexes, so it must not be done while PR #151 is open.
2. Whether any organization or decor guide should be redirected: not decided, no data yet.

## Next editorial candidates (not written, each needs the plan's scorecard and a duplicate check first)
- Smart Home: smart thermostat compatibility and the C-wire check (no existing guide covers it).
- Energy/Airflow: choosing a bathroom exhaust fan (only if section 7 of the condensation guide cannot carry it without duplicating it).
- Smart Home: "works with what?" compatibility (Matter, Zigbee, Wi-Fi) only if it adds beyond section 5 of smart-lighting.

## Low-risk fixes queue (no open-PR conflicts when done on article files only)
1. Add `dateModified` to the 10 guides above, using the real date of the last content edit.
2. Quick answer block on stop-a-drafty-door-without-replacing-it.
3. Cross-links: towels -> condensation, evening lighting -> smart-lighting and motion-lighting, dehumidifier sizing <-> crawl-space guide.
