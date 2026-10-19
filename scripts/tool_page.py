#!/usr/bin/env python3
"""Build a free-tool page for HomeProjectWise.

How to add a tool (about 10 minutes):
1. Write the calculator logic as a plain JavaScript string (see website/rug-size-calculator.html for a tested example).
2. Call build_tool_page(...) below to get the full HTML, and save it as website/<slug>.html.
3. Add an entry to TOOLS in scripts/rebuild_site_indexes.py (slug, hub, title, desc, kw). That one entry adds the tool to the Tools page,
   the matching category hub, the search index and the sitemap.
4. Add a short callout in the related guide: <div class="tool-callout"><strong>Try the calculator.</strong> ... </div>
5. Pass sources=[] to leave out the Sources section when a tool has none of its own, and extra_html to add a block (for example the newsletter) before the page footer.
6. Test the logic in jsdom with real scenarios before publishing, and cite the sources the rules come from.
"""
import json, re
from html import escape

BASE = "https://home-project-wise.github.io/home-project-wise"


def build_tool_page(website, slug, title, desc, eyebrow, hub_slug, hub_label, lead, form_html, how_html, faq, sources, js, extra_html=""):
    about = (website / "about.html").read_text(encoding="utf-8")
    goat = re.search(r"<script data-goatcounter=.*?</script>", about, re.S).group(0)
    foot = about[about.find("<footer>"):].replace("</body></html>", "").replace("</body>", "").replace("</html>", "")
    url = BASE + "/" + slug + ".html"
    ld = [
        {"@context": "https://schema.org", "@type": "WebApplication", "name": title, "url": url, "description": desc,
         "applicationCategory": "UtilitiesApplication", "operatingSystem": "Any", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Tools", "item": BASE + "/tools.html"},
            {"@type": "ListItem", "position": 3, "name": title, "item": url}]},
    ]
    ldhtml = "".join('<script type="application/ld+json">' + json.dumps(x, ensure_ascii=False) + "</script>" for x in ld)
    d = escape(desc, quote=True)
    t = escape(title)
    faq_html = "".join("<h3>" + escape(q) + "</h3><p>" + escape(a) + "</p>" for q, a in faq)
    src_html = "".join("<li>" + s + "</li>" for s in sources)
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="favicon.svg"><meta name="viewport" content="width=device-width,initial-scale=1">'
            f'<title>{t} | HomeProjectWise</title><meta name="description" content="{d}"><link rel="canonical" href="{url}"><meta property="og:type" content="website"><meta property="og:title" content="{t} | HomeProjectWise"><meta property="og:description" content="{d}"><meta property="og:url" content="{url}"><meta name="twitter:card" content="summary">'
            '<link rel="stylesheet" href="style.css">' + goat + ldhtml + '</head>'
            '<body><header class="nav"><a class="brand" href="./"><img class="brand-logo" src="images/logo.svg" alt="HomeProjectWise" width="220" height="33"></a><a class="nav-cta" href="guides.html">All guides</a></header>'
            '<main class="section article" style="max-width:820px"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Home</a><span>›</span><a href="tools.html">Tools</a><span>›</span>' + t + '</nav>'
            f'<p class="eyebrow">{eyebrow}</p><h1>{t}</h1><p class="lead">{escape(lead)}</p>' + form_html + how_html +
            '<h2>Frequently Asked Questions</h2>' + faq_html + (('<h2>Sources</h2><ul>' + src_html + '</ul>') if sources else '') + extra_html + '</main>' + foot + '<script>' + js + '</script></body></html>')
