# HomeProjectWise — AI answer visibility benchmark

**Version:** 1.0  
**Created:** 2026-11-01  
**Status:** Question register prepared; platform baseline not yet run.  
**Primary market/language for repeatability:** United States / English (based on the latest documented Search Console country mix).  
**Platforms:** ChatGPT Search, Google AI Overviews/AI Mode when shown, Microsoft Copilot, and Perplexity.

## 1. Purpose and limits

This benchmark checks whether HomeProjectWise is retrieved and cited for real homeowner tasks that match pages and tools already on the site. It is a repeatable sample, not a complete measure of AI visibility. It does not measure model training, every user answer, or guaranteed placement.

**Do not mark a question as tested unless a person actually ran it on the named platform and recorded the answer.** A general web search, a normal ChatGPT answer, or a crawler user-agent test is not a substitute for a platform-specific citation observation.

## 2. Fixed test protocol

For every run, record:

- Date and time (UTC), platform/product mode, account state if relevant, country/region, language, exact prompt, and whether web/search was enabled.
- Whether HomeProjectWise appeared: direct citation/link, unlinked brand mention, no appearance, or unable to observe.
- Exact HomeProjectWise URL cited (not just the domain), cited competitor/source URLs, and the answer passage the citation supports.
- Whether the cited page actually supports the statement (yes / partial / no).
- Whether the answer contains a factual error, unsafe omission, or outdated information relevant to the task.
- Whether the source link is clickable and resolves to the intended canonical page.
- Any AI referral visit observed separately in analytics; never infer a visit from a citation.

Keep the exact question wording unchanged between benchmark rounds. Use the same US-English setting where the platform permits it. If a feature is not displayed for a query, record "not shown", not "zero citations". Repeat the baseline after a meaningful approved change and at the monthly review; do not over-interpret a single run because answer engines vary.

## 3. Scoring rules

Per question/platform observation:

- **2 — Strong citation:** correct HomeProjectWise canonical URL is cited and supports a useful, material part of the answer.
- **1 — Partial presence:** HomeProjectWise is mentioned or cited, but the citation is peripheral, indirect, or only partly supports the answer.
- **0 — No observed presence:** the platform returned an answer and no HomeProjectWise mention/citation was observed.
- **N/O — Not observable:** no AI answer/overview appeared, the feature was unavailable, or the run could not be completed.

Also record answer quality separately: **Supported / Partly supported / Unsupported / Not assessed**. Do not combine citation score and factual quality into one number. Do not interpret the score as rank, authority, or causality.

## 4. Fixed question set (40)

The target URLs below are the most relevant existing pages, not an assertion that the platform currently cites them.

### A. Bathroom moisture and condensation

| ID | Exact test question | Intended page |
|---|---|---|
| BM-01 | Why are my bathroom walls wet after a shower even when I cannot see a leak? | `articles/reduce-bathroom-condensation.html` |
| BM-02 | How can I tell the difference between bathroom condensation and a plumbing leak? | `articles/reduce-bathroom-condensation.html` |
| BM-03 | What are the first practical steps to reduce bathroom condensation without remodeling? | `articles/reduce-bathroom-condensation.html` |
| BM-04 | Why does condensation keep appearing on my bathroom ceiling when I already use an exhaust fan? | `articles/choose-bathroom-exhaust-fan.html` and condensation guide |
| BM-05 | When should recurring bathroom dampness be checked by a plumber or building professional rather than treated as condensation? | `articles/reduce-bathroom-condensation.html` |

### B. Bathroom exhaust fans and dripping water

| ID | Exact test question | Intended page |
|---|---|---|
| BF-01 | How do I choose the right bathroom exhaust fan for my bathroom size? | `articles/choose-bathroom-exhaust-fan.html` |
| BF-02 | Why is water dripping from my bathroom exhaust fan, and what should I check first? | `articles/bathroom-exhaust-fan-dripping-water.html` |
| BF-03 | How can I check whether a bathroom exhaust fan vents outdoors instead of into the attic? | `articles/choose-bathroom-exhaust-fan.html` |
| BF-04 | What matters more when comparing bathroom fans: airflow, noise, or energy use? | `articles/choose-bathroom-exhaust-fan.html` |
| BF-05 | My bathroom fan runs but the mirror and walls stay wet. What should I troubleshoot? | Fan guide and condensation guide |

### C. Basement toilets and drainage choices

| ID | Exact test question | Intended page |
|---|---|---|
| BT-01 | Can I add a toilet to a basement without breaking up the concrete floor? | `articles/macerating-toilet-basement-bathroom.html` |
| BT-02 | What is the difference between a macerating toilet and a sewage ejector system? | `articles/macerating-toilet-basement-bathroom.html` |
| BT-03 | Is a macerating toilet the same thing as a grinder sewage pump? | `articles/macerating-toilet-basement-bathroom.html` |
| BT-04 | What should I check before choosing a toilet system for a basement bathroom? | `articles/macerating-toilet-basement-bathroom.html` |
| BT-05 | When might a basement toilet installation require a plumber or local-code review? | `articles/macerating-toilet-basement-bathroom.html` |

### D. Crawl-space humidity and dehumidifier sizing

| ID | Exact test question | Intended page |
|---|---|---|
| CS-01 | What size dehumidifier do I need for my crawl space? | `articles/what-size-dehumidifier-crawl-space.html` and calculator |
| CS-02 | How do I estimate the dehumidifier capacity needed for a crawl space? | Crawl-space calculator |
| CS-03 | Why does my crawl space stay damp even when the dehumidifier is running? | `articles/how-to-fix-damp-crawl-space-humidity.html` |
| CS-04 | Should I fix drainage or water entry before relying on a crawl-space dehumidifier? | Crawl-space humidity guide |
| CS-05 | What measurements should I collect before buying a crawl-space dehumidifier? | Dehumidifier sizing guide and calculator |

### E. Kitchen and everyday organization

| ID | Exact test question | Intended page |
|---|---|---|
| KO-01 | Why does my kitchen counter clutter keep coming back after I clean it? | `articles/kitchen-counter-zone-that-stays-clear.html` |
| KO-02 | How can I set up kitchen counter zones that stay usable in a small kitchen? | Kitchen counter guide |
| KO-03 | What should I measure before buying storage for a small entryway? | `articles/quiet-entryway-storage.html` |
| KO-04 | How can I make a small living room feel less crowded without buying new furniture? | `articles/make-small-living-room-feel-bigger.html` |
| KO-05 | What is a practical 15-minute routine for resetting a home after a busy week? | `articles/simple-home-reset-that-prevents-weekend-chaos.html` |

### F. Cable clutter and smart-home decisions

| ID | Exact test question | Intended page |
|---|---|---|
| SH-01 | What does cable clutter mean, and how can I reduce it around a desk or TV? | `articles/reduce-cable-clutter.html` |
| SH-02 | How can I hide or organize cables without drilling holes in the wall? | Cable clutter guide |
| SH-03 | How do I know whether an appliance is safe to use with a smart plug? | `articles/what-can-you-plug-into-a-smart-plug.html` and smart-plug checker |
| SH-04 | How do I calculate the electrical load before connecting devices to a smart plug? | Smart-plug load checker |
| SH-05 | Can I install a smart thermostat if my HVAC system does not have a C wire? | `articles/smart-thermostat-without-c-wire.html` |

### G. Smart-home reliability and privacy

| ID | Exact test question | Intended page |
|---|---|---|
| SR-01 | How can I test which smart-home devices stop working during an internet outage? | `articles/smart-home-wifi-outage-test.html` |
| SR-02 | What privacy settings should I review on smart-home devices before using them? | `articles/smart-home-privacy-check.html` |
| SR-03 | What should I check when a smart thermostat loses its Wi-Fi connection? | Thermostat and Wi-Fi outage guides |
| SR-04 | How can motion lighting make a hallway or entry safer without staying on all night? | `articles/motion-lighting-that-actually-helps.html` |
| SR-05 | How should I compare smart-home convenience with privacy and reliability? | Smart-home privacy guide |

### H. Planning, measurements, and home-design tools

| ID | Exact test question | Intended page |
|---|---|---|
| PT-01 | How can I estimate a home project budget before buying materials? | Budget planner |
| PT-02 | How can I check whether a rug is the right size for a room before buying it? | Rug-size guide and calculator |
| PT-03 | Which paint finish should I use on bathroom walls, trim, cabinets, and ceilings? | `articles/choose-paint-finish-for-each-room.html` |
| PT-04 | How can I hang large wall art without damaging the wall or choosing the wrong hardware? | `articles/how-to-hang-large-wall-art-without-damage.html` |
| PT-05 | What should a useful seasonal home checkup include, and how do I track what needs attention? | Home check-up tool |

## 5. Results register

One row per question per platform per run. Do not pre-fill results.

| Run date (UTC) | Platform/mode | ID | Presence (2/1/0/N/O) | HPW URL cited | Other cited domains | Supports answer? | Error/safety issue | Referral observed? | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Not run | — | — | — | — | — | — | — | — | Baseline still to be executed on the named platforms |

## 6. Review and interpretation

At each monthly review, summarize:

- Number of observable runs and number marked N/O.
- Strong and partial citations by platform and topic cluster.
- Which exact HomeProjectWise URLs were cited and what answer passage they supported.
- Competitor domains that recur for the same questions.
- Incorrect or unsupported answer claims that expose a genuine gap on our page.
- AI referrals and useful visitor actions, reported separately.
- Changes since the previous run and confounding platform/model changes.

A citation is not automatically a win. It counts as a meaningful result only when the source is correct, the cited page supports the answer, and there is evidence of relevant reach or useful visitor value. Do not claim an improvement caused by an edit from observational data alone.

## 7. Official platform references

- OpenAI — [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots) and [Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856).
- Google — [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) and [Guide to optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide).
- Bing — [AI Performance in Bing Webmaster Tools](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c) and [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a).

These sources explain eligibility and available measurement; they do not promise inclusion or citation.
