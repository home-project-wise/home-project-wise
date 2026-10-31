# HomeProjectWise — AI Search Visibility Priority Plan

**Date:** 2026-10-31  
**Priority:** Strategic growth priority, not a minor SEO subtask  
**Status:** Proposed; implementation requires repository audit and project-owner approval

## 1. Strategic decision

AI discovery must become a first-class growth workstream for HomeProjectWise. The target surfaces include ChatGPT Search, Google AI Overviews and AI Mode, Microsoft Copilot, Perplexity, and other answer engines that retrieve and cite public web sources.

The objective is not to “game AI” or guarantee mentions. It is to make HomeProjectWise eligible, retrievable, understandable, trustworthy, and genuinely useful enough to be selected and cited when a user's question matches the site's expertise.

Measure two separate outcomes:
1. **Visibility:** a page/brand is cited or linked in an answer.
2. **Value:** the citation produces a qualified visit or the visitor completes a useful task.

A citation is not a click, ranking, endorsement, or proof that one change caused the result.

## 2. What official platform guidance tells us

- OpenAI says public websites can appear in ChatGPT Search; publishers should not block OAI-SearchBot if they want content to be discovered, surfaced, and cited. OAI-SearchBot controls search discovery and is distinct from GPTBot, which relates to model-training crawling. Decide the GPTBot policy separately; do not conflate the two.
- Google says AI Overviews and AI Mode rely on the same foundational Search eligibility and helpful-content principles. Pages need to be indexed and eligible for snippets. Google explicitly discourages supposed AEO/GEO hacks such as unnecessary chunking, special AI-only files, or inauthentic mentions.
- Bing Webmaster Tools now provides an AI Performance report for citation activity across Copilot, Bing AI summaries, and selected partner experiences. Use it as a measurement source where available.
- Perplexity publishes crawler guidance; verify current official user-agent names, robots behavior, and publisher controls before making robots changes.

Official references:
- OpenAI crawler controls: https://developers.openai.com/api/docs/bots
- OpenAI publisher FAQ: https://help.openai.com/en/articles/12627856
- Google AI search guidance: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google AI features: https://developers.google.com/search/docs/appearance/ai-features
- Bing AI Performance: https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a

## 3. Priority A — Technical eligibility audit (first 48 hours)

Claude should audit the production site and repository, reporting exact evidence for:

- robots.txt response and directives for Googlebot, Bingbot, OAI-SearchBot, PerplexityBot, and other verified search crawlers.
- CDN, WAF, hosting, rate-limit, and bot-protection rules that may block verified crawlers.
- HTTP status, redirects, canonical tags, robots meta, X-Robots-Tag, and indexability for homepage and key existing guides/tools.
- Whether key content is present in server-rendered HTML or otherwise reliably accessible to crawlers; verify with rendered/URL inspection rather than assumption.
- Sitemap inclusion, internal discoverability, broken links, duplicate URLs, and freshness.
- Structured data validity and agreement with visible page content.
- Whether AI crawler visits can be identified in server logs or analytics without treating user-triggered agents as automated indexing crawlers.

**Important:** Do not change robots.txt or bot access policy blindly. Present current rules, impact, and proposed diff first. Allowing OAI-SearchBot is necessary for ChatGPT Search inclusion according to OpenAI, but it does not guarantee citation. GPTBot is a separate policy decision.

## 4. Priority B — Build a real AI question and citation map

Create a test set of 30–50 realistic questions in the site's actual subject areas, not a generic list of keywords. Start with existing project topics such as bathroom condensation, basement toilets, crawl-space moisture, and relevant tools only after verifying those pages exist and are useful.

For each question, record:
- User intent and situation.
- Exact question and natural variants.
- Which answer engines were tested, product/mode, date, region/language, and whether web search was enabled.
- Whether HomeProjectWise appeared, which URL was cited, citation position/context, and competitor/alternative sources.
- Whether the cited page answered the question accurately and completely.
- Follow-up action: improve existing page, build a genuinely missing resource, earn an external reference, or no action.

Repeat the same fixed test set periodically. AI answers are stochastic and vary by model, query, region, and time; a single response is not evidence of stable visibility.

## 5. Priority C — Make a small number of pages citation-worthy

Do not rewrite every article for AI. Select at most three existing pages based on actual demand, quality gap, and usefulness.

For each selected page:
- Provide a concise direct answer near the top when it helps the user.
- Explain the conditions under which the answer changes.
- Include specific steps, measurements, units, examples, and decision criteria where defensible.
- Cite authoritative primary sources close to consequential claims.
- State assumptions, limitations, uncertainty, and safety boundaries.
- Include original diagrams, tables, calculations, or tools only when they add genuine value and can be verified.
- Identify author/reviewer and review date honestly; never invent credentials or hands-on experience.
- Link to relevant supporting resources on the site with descriptive anchors.
- Ensure visible text and structured data match.

The differentiator should be something generic summaries do not provide: carefully checked calculations, a useful decision framework, clearly explained edge cases, transparent comparisons, or a tool that completes the visitor's task.

## 6. Priority D — Earn independent corroboration

Answer engines often discover and assess sources through a wider web ecosystem. Build real recognition rather than artificial mentions:

- Identify two specialist resource pages or organizations whose audiences genuinely need a HomeProjectWise resource.
- Offer a useful asset or correction, not a backlink exchange.
- Seek expert review or feedback where appropriate and accurately disclose it.
- Publish original, maintainable reference material that others have a reason to cite.
- Contribute helpful answers in relevant communities within their rules, linking only when it directly helps.
- Track earned mentions, referral visits, and feedback. Never buy links or manufacture citations/reviews.

## 7. Priority E — Measurement and dashboard

Maintain a monthly AI visibility register with these fields:

| Metric | Meaning |
|---|---|
| Test questions | Fixed, versioned question set |
| Tested surfaces | ChatGPT Search, Google AI features, Copilot, Perplexity, etc. |
| Mentioned answers | Answers that mention the brand/site |
| Cited URLs | Exact HomeProjectWise URLs cited |
| Citation rate | Cited test responses / valid test responses |
| Citation context | Whether citation supports the relevant claim |
| AI referral visits | Attributable referrals, e.g. source/referrer data |
| Engaged visits | Meaningful tool/guide interactions after referral |
| Earned references | Verified external links/mentions |

Use Bing AI Performance for the supported citation data it reports. Use Google Search Console's available AI feature reporting where the account exposes it. Use GoatCounter/referrer analytics for visits where identifiable. Do not claim to measure all ChatGPT or all AI answers from a small manual sample.

## 8. 14-day execution sprint

**Days 1–2 — Claude:** technical crawler/indexability audit. Deliver current robots.txt, key response headers/meta, sitemap/index status, and exact blockers. No production changes.

**Days 3–4 — ChatGPT:** create the initial 30-question benchmark based on confirmed existing pages and user problems. Define repeatable recording format.

**Days 5–7 — Both:** analyze benchmark answers and competitor citations; identify no more than three pages where there is a clear, defensible gap.

**Days 8–11 — ChatGPT:** prepare evidence-backed page briefs and source checks. **Claude:** implement only after approval and editorial-freeze checks, with tests and a focused PR.

**Days 12–14 — Both:** re-run the benchmark, document observed changes and confounders, review Bing/Google reporting and referral data where available, and decide next action.

## 9. Guardrails

- No guarantee of inclusion, citation, ranking, or traffic.
- No AI-generated content at scale merely to target answer engines.
- No fake author credentials, fake tests, fake expert quotes, fake statistics, or fabricated citations.
- No mass outreach or manufactured brand mentions.
- No unnecessary llms.txt or schema additions presented as ranking shortcuts. A machine-readable file may be evaluated only for a concrete, supported use case—not as a substitute for crawlability and content quality.
- Keep the complete Value Before Publishing law and the 85/100 opportunity threshold intact.
- Existing editorial freeze remains active until explicitly changed by the project owner.
- No merge or publication is authorized by this plan.

## 10. Immediate assignment

**Claude:** return a technical eligibility audit with exact evidence and proposed fixes, but do not edit production robots/crawler policy yet.

**ChatGPT:** after receiving the audit and CAO program, own the AI question benchmark, source/competitor analysis, page selection, and independent PR review.

**Project owner:** provide the CAO program and approve any changes to crawler access or publishing policy.

**North-star principle:** HomeProjectWise should not merely be formatted for AI. It should become a source that deserves to be retrieved, trusted, and cited because it helps people solve real home problems better.
