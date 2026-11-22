# Tool link contract (T1)

Calculator Team — Claude, Calculator Owner. 2026-11-21. Plan: `docs/CALCULATOR-SMART-HOME-AND-HANGING-PLAN-2026-11-20.md`, work item T1. No calculation is added or changed by this contract.

## Files

| File | Role |
| --- | --- |
| `website/tools-registry.json` | Every public calculator: id, title (the page's own h1), url (with a tab anchor where the tool is a tab), topics, the query parameters the page accepts, which of them an article link may use (`linkPrefill`), and the class A articles that link it. The Guided Start chooser reads this file. |
| `data/ARTICLE_TOOL_MAP.json` | Every article: class A (links an existing tool), B (a tool is planned) or C (no honest calculation; a reason is required), with the article sentence that carries the decision. |
| `scripts/test_tools_registry.js` | The CI rule, run by the quality gate. |

## Rules

1. Every article file has one entry in the map. **A new article without an entry fails the quality gate.** Add it as class C with a reason of at least 40 characters, or as class A with a registered tool.
2. Class A: the article links the tool's page (`../<page>.html`, with the tab anchor where the registry has one) and the registry lists the article.
3. Class B: a planned tool with a status and a reason; no url until the page exists. Class C is a valid, permanent outcome.
4. Query parameters in an article link may only be names in the tool's `linkPrefill`: units, the visitor's region, and example geometry. Never prices, waste or allowances. Invalid parameters are ignored by the page.
5. Adding a tool: add the page, then its registry entry (the test checks that the page, the h1 and the anchor exist), then link it from the articles that need it.

## Markup hook for a link (unstyled; the design lead styles it)

```html
<aside class="tool-link" data-tool="rug-size" data-article="right-rug-size-painters-tape-test">
  <p class="tool-link__text">Check the sizes with the <a class="tool-link__a" href="../rug-size-calculator.html">Rug Size Calculator</a> before you buy.</p>
</aside>
```

Stable hooks: `.tool-link`, `data-tool`, `data-article`, `.tool-link__text`, `.tool-link__a`. Existing plain links are valid; the test only requires that an element marked `tool-link` names a registered tool and links its page.

## Not part of T1

- Link-click measurement (a GoatCounter event such as `tool-link:<tool>:<article>`) needs the owner's approval of the event first.
- The Guided Start chooser that reads the registry is a separate item.
- Placing links in articles is the publishing lane. Open today: `how-to-calculate-wallpaper-rolls-pattern-repeat` links the Home Project Calculator page, not its Wallpaper tab (`#panel-wallpaper`).
