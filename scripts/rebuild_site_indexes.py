#!/usr/bin/env python3
from __future__ import annotations
import re
import json
from html import escape, unescape
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
WEBSITE = ROOT / "website"
ARTICLES = WEBSITE / "articles"
BASE = "https://home-project-wise.github.io/home-project-wise"
NL = chr(10)
GOAT = '<script data-goatcounter="https://homeprojectwise.goatcounter.com/count" async src="//gc.zgo.at/count.v5.js" crossorigin="anonymous"></script>'


def attr(tag, name):
    """Read an attribute value from one HTML tag, whatever the attribute order."""
    m = re.search(name + '="([^"]*)"', tag, re.I)
    if m:
        return m.group(1)
    m = re.search(name + "='([^']*)'", tag, re.I)
    return m.group(1) if m else None


def meta_content(text, key, value):
    """Find <meta key="value" content="..."> in any attribute order."""
    for tag in re.findall('<meta[^>]*>', text, re.I):
        if attr(tag, key) == value:
            c = attr(tag, "content")
            if c is not None:
                return c
    return None


def first_image(text):
    for tag in re.findall('<img[^>]*>', text, re.I):
        src = attr(tag, "src")
        if src and "logo" not in src:
            if src.startswith("../"):
                src = src[3:]
            return src, attr(tag, "alt") or ""
    return None


def article_date(text):
    m = re.search('"datePublished"[^"]*"([^"]+)"', text, re.I)
    values = [m.group(1)] if m else []
    pub = meta_content(text, "property", "article:published_time")
    if pub:
        values.append(pub)
    for v in values:
        try:
            d = datetime.fromisoformat(v.replace("Z", "+00:00"))
            return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
        except Exception:
            pass
    return datetime.min.replace(tzinfo=timezone.utc)


def date_modified(text):
    m = re.search('"dateModified"[^"]*"([^"]+)"', text, re.I)
    if m:
        try:
            d = datetime.fromisoformat(m.group(1).replace("Z", "+00:00"))
            return d if d.tzinfo else d.replace(tzinfo=timezone.utc)
        except Exception:
            pass
    return None


def rows():
    out = []
    for p in ARTICLES.glob("*.html"):
        t = p.read_text(encoding="utf-8", errors="ignore")
        desc = meta_content(t, "name", "description")
        title = re.search("<title>(.*?)</title>", t, re.S | re.I)
        img = first_image(t)
        cat = re.search('<p[^>]*class="eyebrow"[^>]*>([^<]+)</p>', t, re.I)
        if desc and title:
            clean = re.sub("[ ]*[|—-][ ]*HomeProjectWise.*$", "", re.sub("<[^>]+>", "", title.group(1))).strip()
            out.append({
                "slug": p.stem,
                "title": unescape(clean),
                "description": unescape(desc),
                "image": unescape(img[0]) if img else "",
                "alt": unescape(img[1]) if img and img[1] else "Useful home project guide",
                "category": unescape(cat.group(1).strip()) if cat else "HOME PROJECTS",
                "date": article_date(t),
                "modified": date_modified(t),
            })
    return sorted(out, key=lambda x: (x["date"], x["slug"]), reverse=True)


def footer():
    return '<footer><div class="brand"><img class="brand-logo-footer" src="logo.svg" alt="HomeProjectWise"></div><nav><a href="./">Home</a><a href="./guides.html">Guides</a><a href="./search.html">Search</a><a href="./tools.html">Tools</a><a href="./about.html">About</a><a href="./editorial-policy.html">Editorial Policy</a><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="./contact.html">Contact</a></nav><p>Better decisions. Better projects. A better home.</p></footer>'


def card(x, featured=False):
    image = f'<img src="{escape(unescape(x["image"]), quote=True)}" alt="{escape(x["alt"], quote=True)}" loading="lazy">' if x["image"] else ""
    return f'<article class="card{" featured" if featured else ""}">{image}<div class="card-body"><span class="tag">{escape(x["category"])}</span><h3>{escape(x["title"])}</h3><p>{escape(x["description"])}</p><a href="articles/{escape(x["slug"])}.html">Read the guide →</a></div></article>'


def category_key(x):
    value = x["category"].upper()
    if "SMART" in value:
        return "smart-home"
    if "DESIGN" in value:
        return "design"
    if "PROJECT" in value or "REPAIR" in value or "MAINTENANCE" in value:
        return "projects"
    return "storage"


def category_sections(r):
    specs = [
        ("storage", "STORAGE &amp; ORGANIZATION", "Make everyday items easier to put away and easier to find.", "Drop zones, clutter control and practical storage decisions built around real routines."),
        ("design", "HOME DESIGN", "Improve light, layout and calm before buying new things.", "Simple changes to make rooms easier to use and maintain without showroom thinking."),
        ("projects", "WEEKEND PROJECTS", "Plan repairs and upgrades with fewer mistakes and less waste.", "Small repairs and maintenance tasks with clear checks before you spend or replace."),
        ("smart-home", "SMART HOME", "Automate the moments that genuinely remove friction.", "Practical automation with manual fallbacks, sensible routines and no gadget collecting."),
    ]
    # Large sections are split into labelled groups by sub-topic (the text after the dot in each guide's eyebrow).
    subgroups = {
        "projects": [
            ("Moisture and bathrooms", ("MOISTURE", "BATHROOM", "LAUNDRY")),
            ("Repairs and upgrades", None),
        ],
    }
    parts = []
    for key, label, heading, intro in specs:
        items = [x for x in r if category_key(x) == key]
        groups = subgroups.get(key)
        if groups and len(items) > 5:
            remaining = list(items)
            blocks = []
            for title, words in groups:
                if words is None:
                    chosen, remaining = remaining, []
                else:
                    chosen = [x for x in remaining if any(w in x["category"].upper() for w in words)]
                    remaining = [x for x in remaining if x not in chosen]
                if chosen:
                    blocks.append(f'<h3 class="library-subhead">{title} <span>{len(chosen)} guides</span></h3><div class="cards guide-grid">' + "".join(card(x) for x in chosen) + '</div>')
            body = "".join(blocks)
        else:
            body = '<div class="cards guide-grid">' + "".join(card(x) for x in items) + '</div>'
        parts.append(f'<section id="{key}" class="section"><p class="eyebrow">{label} · {len(items)} GUIDES</p><h2>{heading}</h2><p>{intro}</p><p class="hub-link"><a href="{HUBS[key]["slug"]}.html">Open the {escape(HUBS[key]["label"])} page →</a></p>{body}</section>')
    return "".join(parts)



HUBS = {
    "storage": {"slug": "storage", "label": "Storage & Organization", "h1": "Storage and organization guides",
        "desc": "Practical storage and organization guides: drop zones, clear counters, cable and paper control, and small systems that fit real routines.",
        "intro": "Clutter rarely means you own too much. It usually means things have no obvious home, or the home is in the wrong place. These guides focus on small systems that work for real routines: a drop zone at the door, a counter that stays clear, cables and paper under control. Start with the smallest change that removes daily friction, then build from there.",
        "start": ["simple-home-reset-that-prevents-weekend-chaos", "quiet-entryway-storage", "stop-mail-and-paper-pile"]},
    "design": {"slug": "home-design", "label": "Home Design", "h1": "Home design guides",
        "desc": "Home design guides on light, layout and calm: rug sizing, evening lighting, small living rooms and restful spaces, before you buy anything new.",
        "intro": "Good home design is mostly about light, layout and calm, not new furniture. These guides help you decide what to change before you buy anything: how big a rug should be, how to light a room in the evening, how to make a small living room feel larger and how to keep a space restful.",
        "start": ["calm-room", "make-small-living-room-feel-bigger", "better-evening-home-lighting-without-overcomplicating-it"]},
    "projects": {"slug": "weekend-projects", "label": "Weekend Projects", "h1": "Weekend project and repair guides",
        "desc": "Weekend project and repair guides: moisture and bathrooms, drafts, wobbly furniture and safe wall fixings, with clear checks before you spend.",
        "intro": "Small repairs and maintenance jobs go better with a clear check first. These guides cover moisture and bathrooms, drafts, wobbly furniture and safe wall fixings, with the questions to answer before you spend money or call someone, and the points where a professional is the safer choice.",
        "start": ["fix-wobbly-furniture", "stop-a-drafty-door-without-replacing-it", "stop-musty-bathroom-towels"]},
    "smart-home": {"slug": "smart-home", "label": "Smart Home", "h1": "Smart home guides",
        "desc": "Smart home guides for lighting, plugs, motion and Wi-Fi decisions, with simple routines and manual fallbacks when apps or the internet fail.",
        "intro": "Smart-home gear helps most when it removes a real daily annoyance and still works by hand when the internet or an app fails. These guides cover lighting, plugs, motion and Wi-Fi decisions, with simple routines, sensible fallbacks and no gadget collecting.",
        "start": ["smart-lighting", "motion-lighting-that-actually-helps", "what-can-you-plug-into-a-smart-plug"]},
}
PROJECT_GROUPS = [("Moisture and bathrooms", ("MOISTURE", "BATHROOM", "LAUNDRY")), ("Repairs and upgrades", None)]
STOP = set("with without your that this from home guide make stop fix when what into about easier better actually helps simple small useful real keep need".split())


def tokens(x):
    words = re.findall("[a-z]{4,}", (x["title"] + " " + x["category"].split("·")[-1]).lower())
    return {w for w in words if w not in STOP}


def subtopic(x):
    return x["category"].split("·")[-1].strip().upper() if "·" in x["category"] else ""


def related_for(x, r, limit=3):
    mine = tokens(x)
    scored = []
    for y in r:
        if y["slug"] == x["slug"]:
            continue
        score = 4 * (category_key(y) == category_key(x)) + 3 * (bool(subtopic(x)) and subtopic(x) == subtopic(y)) + len(mine & tokens(y))
        scored.append((score, y["date"], y["slug"], y))
    scored.sort(key=lambda t: (t[0], t[1], t[2]), reverse=True)
    return [t[3] for t in scored[:limit]]


def card_from_article(x):
    img = x["image"]
    if img and not img.startswith("http"):
        img = "../" + img
    image = f'<img src="{escape(img, quote=True)}" alt="{escape(x["alt"], quote=True)}" loading="lazy">' if img else ""
    return f'<article class="card">{image}<div class="card-body"><span class="tag">{escape(x["category"])}</span><h3>{escape(x["title"])}</h3><p>{escape(x["description"])}</p><a href="{escape(x["slug"])}.html">Read the guide →</a></div></article>'


def fmt_date(d):
    return d.strftime("%B %-d, %Y")


def enhance_articles(r):
    for x in r:
        path = ARTICLES / (x["slug"] + ".html")
        html = path.read_text(encoding="utf-8", errors="ignore")
        key = category_key(x)
        hub = HUBS[key]
        if 'class="breadcrumb"' not in html:
            crumb = ('<nav class="breadcrumb" aria-label="Breadcrumb"><a href="../">Home</a><span>›</span><a href="../guides.html">Guides</a><span>›</span>'
                     '<a href="../' + hub["slug"] + '.html">' + escape(hub["label"]) + '</a></nav>')
            html, n = re.subn(r"(<main[^>]*>)", lambda m: m.group(1) + crumb, html, count=1)
        if 'class="article-dates"' not in html and x["date"].year > 1:
            line = "Published " + fmt_date(x["date"])
            mod = x.get("modified")
            if mod and mod.date() != x["date"].date():
                line += " · Updated " + fmt_date(mod)
            tag = '<p class="article-dates">' + line + ' · <button type="button" class="print-btn" onclick="window.print()">Print this guide</button></p>'
            m = re.search(r'<p class="lead">.*?</p>', html, re.S) or re.search(r"</h1>", html)
            if m:
                html = html[:m.end()] + tag + html[m.end():]
        if 'class="related-guides"' not in html:
            cards = "".join(card_from_article(y) for y in related_for(x, r))
            block = '<section class="related-guides"><h2>Keep reading</h2><div class="cards guide-grid">' + cards + "</div></section>"
            if '<section class="article-newsletter">' in html:
                html = html.replace('<section class="article-newsletter">', block + '<section class="article-newsletter">', 1)
            else:
                html = html.replace("</main>", block + "</main>", 1)
        path.write_text(html, encoding="utf-8")


def write_hubs(r):
    urls = []
    for key, hub in HUBS.items():
        items = [x for x in r if category_key(x) == key]
        if not items:
            continue
        url = BASE + "/" + hub["slug"] + ".html"
        urls.append(url)
        start = [y for s in hub["start"] for y in items if y["slug"] == s][:3] or items[:3]
        if key == "projects" and len(items) > 5:
            remaining, blocks = list(items), []
            for title, words in PROJECT_GROUPS:
                if words is None:
                    chosen, remaining = remaining, []
                else:
                    chosen = [y for y in remaining if any(w in y["category"].upper() for w in words)]
                    remaining = [y for y in remaining if y not in chosen]
                if chosen:
                    blocks.append(f'<h3 class="library-subhead">{title} <span>{len(chosen)} guides</span></h3><div class="cards guide-grid">' + "".join(card(y) for y in chosen) + "</div>")
            allcards = "".join(blocks)
        else:
            allcards = '<div class="cards guide-grid">' + "".join(card(y) for y in items) + "</div>"
        others = " · ".join('<a href="' + h["slug"] + '.html">' + escape(h["label"]) + "</a>" for k, h in HUBS.items() if k != key)
        label_esc = escape(hub["label"])
        title = label_esc + " Guides | HomeProjectWise"
        ld = [
            {"@context": "https://schema.org", "@type": "CollectionPage", "name": hub["h1"], "url": url, "description": hub["desc"],
             "mainEntity": {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": BASE + "/articles/" + y["slug"] + ".html", "name": y["title"]} for i, y in enumerate(items)]}},
            {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
                {"@type": "ListItem", "position": 2, "name": "Guides", "item": BASE + "/guides.html"},
                {"@type": "ListItem", "position": 3, "name": hub["label"], "item": url}]},
        ]
        ldhtml = "".join('<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + "</script>" for d in ld)
        tools = [t for t in TOOLS if t["hub"] == key]
        tools_html = ('<h2>Tools</h2><ul class="tool-list">' + "".join('<li><a href="' + t["slug"] + '.html">' + escape(t["title"]) + '</a><span>' + escape(t["desc"]) + '</span></li>' for t in tools) + '</ul>') if tools else ""
        page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
                '<title>' + title + '</title><meta name="description" content="' + escape(hub["desc"], quote=True) + '"><link rel="canonical" href="' + url + '">'
                '<meta property="og:type" content="website"><meta property="og:title" content="' + title + '"><meta property="og:description" content="' + escape(hub["desc"], quote=True) + '"><meta property="og:url" content="' + url + '"><meta name="twitter:card" content="summary">'
                '<link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="feed.xml"><link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#243238">'
                '<link rel="stylesheet" href="style.css">' + GOAT + ldhtml + '</head><body>'
                '<header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise" width="220" height="33"></a><a class="nav-cta" href="guides.html">All guides</a></header>'
                '<main class="section"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Home</a><span>›</span><a href="guides.html">Guides</a><span>›</span>' + label_esc + '</nav>'
                '<p class="eyebrow">' + label_esc.upper() + ' · ' + str(len(items)) + ' GUIDES</p><h1>' + escape(hub["h1"]) + '</h1><p class="lead">' + escape(hub["intro"]) + '</p>'
                '<h2>Start here</h2><div class="cards guide-grid">' + "".join(card(y) for y in start) + '</div>'
                '' + tools_html + '<h2>All ' + label_esc + ' guides</h2>' + allcards +
                '<h2>Explore other areas</h2><p>' + others + '</p></main>' + footer() + '</body></html>')
        (WEBSITE / (hub["slug"] + ".html")).write_text(page, encoding="utf-8")
    return urls



SEARCH_JS = r'''(function(){
var form=document.getElementById('sf'),input=document.getElementById('q'),status=document.getElementById('status'),list=document.getElementById('results'),idx=[];
/*fn*/
function norm(s){return (s||'').toLowerCase().replace(/-/g,'');}
function words(s){return norm(s).split(/[^a-z0-9]+/).filter(function(w){return w.length>2;});}
function has(text,w){return text.indexOf(w)>-1||(w.length>3&&w.charAt(w.length-1)==='s'&&text.indexOf(w.slice(0,-1))>-1);}
function score(item,tokens){var s=0,t=norm(item.t),c=norm(item.c),d=norm(item.d),k=norm(item.k);for(var i=0;i<tokens.length;i++){var w=tokens[i],hit=false;if(has(t,w)){s+=5;hit=true;}if(has(k,w)){s+=3;hit=true;}if(has(c,w)){s+=2;hit=true;}if(has(d,w)){s+=1;hit=true;}if(!hit){return 0;}}return s;}
/*endfn*/
function render(q){var tokens=words(q);list.textContent='';if(!tokens.length){status.textContent='Type a word such as damp, rug, plug or storage.';return;}var res=idx.map(function(i){return {i:i,s:score(i,tokens)};}).filter(function(x){return x.s>0;}).sort(function(a,b){return b.s-a.s;});status.textContent=res.length?res.length+(res.length===1?' guide found':' guides found'):'No guides found. Try a shorter word, or browse all guides.';res.slice(0,20).forEach(function(x){var li=document.createElement('li'),a=document.createElement('a'),p=document.createElement('p'),sp=document.createElement('span');a.href=x.i.u;a.textContent=x.i.t;sp.textContent=x.i.c;p.textContent=x.i.d;li.appendChild(sp);li.appendChild(a);li.appendChild(p);list.appendChild(li);});}
fetch('search-index.json').then(function(r){return r.json();}).then(function(d){idx=d;var q=new URLSearchParams(location.search).get('q')||'';input.value=q;render(q);}).catch(function(){status.textContent='Search is unavailable right now. Browse the guides instead.';});
form.addEventListener('submit',function(e){e.preventDefault();render(input.value);});
input.addEventListener('input',function(){render(input.value);});
})();'''


def write_search(r):
    index = []
    for x in r:
        hub = HUBS[category_key(x)]
        index.append({"t": x["title"], "u": "articles/" + x["slug"] + ".html", "c": hub["label"], "d": x["description"], "k": subtopic(x).title() + " " + x["slug"].replace("-", " ")})
    for t in TOOLS:
        index.append({"t": t["title"], "u": t["slug"] + ".html", "c": "Tools", "d": t["desc"], "k": t["kw"]})
    (WEBSITE / "search-index.json").write_text(json.dumps(index, ensure_ascii=False), encoding="utf-8")
    page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow">'
            '<title>Search the guides | HomeProjectWise</title><meta name="description" content="Search HomeProjectWise guides on storage, home design, weekend projects and smart home.">'
            '<link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#243238"><link rel="stylesheet" href="style.css">' + GOAT + '</head><body>'
            '<header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise" width="220" height="33"></a><a class="nav-cta" href="guides.html">All guides</a></header>'
            '<main class="section"><p class="eyebrow">SEARCH</p><h1>Search the guides</h1>'
            '<form id="sf" class="search-form" role="search" action="search.html" method="get"><label for="q" class="sr-only">Search guides</label><input id="q" name="q" type="search" placeholder="Try: damp, rug size, smart plug" autocomplete="off"><button type="submit">Search</button></form>'
            '<p id="status" role="status" aria-live="polite"></p><ul id="results" class="search-results"></ul></main>' + footer() + '<script>' + SEARCH_JS + '</script></body></html>')
    (WEBSITE / "search.html").write_text(page, encoding="utf-8")


TOOLS = [
    {"slug": "budget-planner", "hub": "all", "title": "Project Budget Planner",
     "desc": "Pick a home project, enter your own prices and see what fits your budget, with a buying order that protects the essentials.",
     "kw": "budget cost price planner shopping list how much spend setup refresh money afford"},
    {"slug": "home-checkup", "hub": "all", "title": "Home Check-up",
     "desc": "Answer ten short statements and get your top three home priorities, with the guides and tools to start with.",
     "kw": "checkup check-up quiz priorities audit assessment start where begin first home overview"},
    {"slug": "rug-size-calculator", "hub": "design", "title": "Rug Size Calculator",
     "desc": "Enter your room and furniture to see the best rug size, in feet or centimetres.",
     "kw": "calculator rug size room living dining bedroom tool"},
    {"slug": "crawl-space-dehumidifier-calculator", "hub": "projects", "title": "Crawl Space Dehumidifier Size Calculator",
     "desc": "Enter your crawl space size and conditions to get a benchmark capacity in pints per day and what to fix first.",
     "kw": "calculator dehumidifier crawl space basement damp humidity pints tool"},
    {"slug": "smart-plug-load-check", "hub": "smart-home", "title": "Smart Plug Load Check",
     "desc": "Enter your plug rating and a device to see if it is a good fit, needs care or should not go on a smart plug.",
     "kw": "calculator smart plug watts amps load safety heater kettle tool"},
]


ASK_JS = r'''(function(){
var TOOLS=__TOOLS__;
var form=document.getElementById('ask'),input=document.getElementById('askq'),out=document.getElementById('ask-out');
var EXTRA={'rug-size-calculator':'rug rugs carpet living dining table bedroom bed floor size','crawl-space-dehumidifier-calculator':'dehumidifier crawl crawlspace space basement damp humidity moisture mold musty pints','smart-plug-load-check':'smart plug plugs watts watt amps heater kettle fridge freezer lamp load socket outlet'};
/*fn*/
function norm(s){return (s||'').toLowerCase().replace(/\u00d7/g,'x').replace(/crawl\s*space/g,'crawlspace');}
function wordset(s){var o={};norm(s).split(/[^a-z0-9]+/).forEach(function(w){if(w.length>2){o[w]=1;}});return o;}
function score(t,q){var hay=wordset(t.kw+' '+t.title+' '+t.desc+' '+(EXTRA[t.slug]||'')),n=0;Object.keys(wordset(q)).forEach(function(w){if(hay[w]){n+=1;}else if(w.length>3&&w.charAt(w.length-1)==='s'&&hay[w.slice(0,-1)]){n+=1;}});return n;}
function allDims(q){var re=/(\d+(?:\.\d+)?)\s*(ft|feet|foot|metres|meters|m|cm)?\s*(?:x|by)\s*(\d+(?:\.\d+)?)\s*(ft|feet|foot|metres|meters|m|cm)?/g,m,res=[],s=norm(q);while((m=re.exec(s))){var a=parseFloat(m[1]),b=parseFloat(m[3]),u=m[4]||m[2]||'';var unit=(u==='m'||u==='metres'||u==='meters')?'m':(u==='cm'?'cm':((u==='')&&(a>40||b>40)?'cm':'ft'));res.push({a:a,b:b,unit:unit});}res.sort(function(x,y){return y.a*y.b-x.a*x.b;});return res;}
function toIn(v,unit){return unit==='ft'?v*12:(unit==='m'?v*100/2.54:v/2.54);}
function r1(x){return Math.round(x*10)/10;}
function rug(q){var s=norm(q),d=allDims(q),p=new URLSearchParams(),said=[];var type=/dining|table/.test(s)?'dining':(/bed/.test(s)?'bedroom':'living');var metric=d.length&&d[0].unit!=='ft';p.set('u',metric?'m':'us');p.set('t',type);said.push(type==='living'?'living room':(type==='dining'?'dining room':'bedroom'));if(d.length){p.set('rw',r1(toIn(Math.min(d[0].a,d[0].b),d[0].unit)));p.set('rl',r1(toIn(Math.max(d[0].a,d[0].b),d[0].unit)));said.push('room '+d[0].a+' x '+d[0].b+' '+d[0].unit);if(type==='dining'&&d[1]){p.set('tw',r1(toIn(Math.min(d[1].a,d[1].b),d[1].unit)));p.set('tl',r1(toIn(Math.max(d[1].a,d[1].b),d[1].unit)));said.push('table '+d[1].a+' x '+d[1].b+' '+d[1].unit);}}if(type==='bedroom'&&!metric){var bi={twin:0,full:1,queen:2,king:3}[(s.match(/twin|full|queen|king/)||[''])[0]];if(bi!==undefined){p.set('bed',bi);said.push(['twin','full','queen','king'][bi]+' bed');}}return {p:p,said:said};}
function dehum(q){var s=norm(q),d=allDims(q),p=new URLSearchParams(),said=[];if(d.length){var u=d[0].unit==='ft'?'us':'m';p.set('u',u);var f=function(v){return d[0].unit==='cm'?v/100:v;};p.set('l',r1(f(Math.max(d[0].a,d[0].b))));p.set('w',r1(f(Math.min(d[0].a,d[0].b))));said.push('crawl space '+d[0].a+' x '+d[0].b+' '+d[0].unit);}var rh=s.match(/(\d{2,3})\s*(%|percent)/);if(rh){p.set('rh',rh[1]);said.push('humidity '+rh[1]+'%');}var bits=0;if(/\bcold|cool/.test(s)){bits+=1;said.push('cold');}if(/musty|damp|wet|condensation|smell|moist/.test(s)){bits+=2;said.push('damp signs');}if(/vent|unsealed|not sealed/.test(s)){bits+=4;said.push('open vents');}if(/bare soil|dirt|no vapor|no vapour/.test(s)){bits+=8;said.push('bare soil');}if(/standing water|leak|flood/.test(s)){bits+=16;said.push('water or leak');}if(bits){p.set('f',bits);}return {p:p,said:said};}
function plug(q){var s=norm(q),p=new URLSearchParams(),said=[];var rating=s.match(/(\d{2})\s*(?:a|amp|amps)\b/),region=0;if(rating){var a=parseInt(rating[1],10);region={15:0,13:1,10:2,16:3}[a];if(region===undefined){region=0;}else{said.push(a+' A plug');}}else if(/\buk\b|britain|british|england/.test(s)){region=1;said.push('UK plug');}else if(/europe|\beu\b/.test(s)){region=3;said.push('European plug');}p.set('r',region);var dev='other',list=[['heater',/heater/],['kettle',/kettle|toaster|hair ?dryer|hairdryer|\biron\b/],['fridge',/fridge|freezer|refrigerator/],['critical',/medical|oxygen|alarm|cpap/],['ac',/air conditioner|aircon|\bac\b/],['pump',/dehumidifier|\bpump/],['strip',/power strip|extension/],['lamp',/lamp|bulb|\blight\b/],['charger',/charger/],['router',/router|modem/],['tv',/\btv\b|television/],['fan',/\bfan\b/]];for(var i=0;i<list.length;i++){if(list[i][1].test(s)){dev=list[i][0];break;}}p.set('d',dev);said.push(dev==='other'?'other device':dev);var w=s.match(/(\d+(?:\.\d+)?)\s*(?:w|watts?)\b/);if(w){p.set('m','w');p.set('x',w[1]);said.push(w[1]+' W');}else if(['pump','strip','critical','other'].indexOf(dev)<0){p.set('m','t');}else{p.set('m','w');}return {p:p,said:said};}
/*endfn*/
var BUILD={'rug-size-calculator':rug,'crawl-space-dehumidifier-calculator':dehum,'smart-plug-load-check':plug};
function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML;}
function run(q){out.innerHTML='';if(!norm(q).trim()){out.innerHTML='<p>Type what you want to work out, or tap an example.</p>';return;}
var ranked=TOOLS.map(function(t){return {t:t,s:score(t,q)};}).filter(function(x){return x.s>0;}).sort(function(a,b){return b.s-a.s;});
var html='';
if(!ranked.length){html='<div class="ask-card"><strong>I could not match that to a calculator yet.</strong><p>Browse the tools below, or tell us what you would like on the <a href="contact.html">Contact</a> page.</p></div>';}
else{var best=ranked[0].t,b=BUILD[best.slug];var href=best.slug+'.html',said=[];if(b){var r=b(q);var qs=r.p.toString();if(qs){href+='?'+qs;}said=r.said;}
html='<div class="ask-card"><strong>Best match: '+esc(best.title)+'</strong><p>'+esc(best.desc)+'</p>'+(said.length?'<p class="ask-said">I picked up: '+esc(said.join(', '))+'.</p>':'')+'<a class="calc-btn ask-go" href="'+esc(href)+'">Open with my numbers</a></div>';
if(ranked.length>1){html+='<p>Other tools that may fit: '+ranked.slice(1,3).map(function(x){return '<a href="'+esc(x.t.slug)+'.html">'+esc(x.t.title)+'</a>';}).join(', ')+'.</p>';}}
html+='<p>Looking for advice instead of a number? <a href="search.html?q='+encodeURIComponent(q.trim())+'">Search the guides for this</a>.</p>';out.innerHTML=html;}
form.addEventListener('submit',function(e){e.preventDefault();run(input.value);});
Array.prototype.forEach.call(document.querySelectorAll('.ask-examples .chip'),function(c){c.addEventListener('click',function(){input.value=c.textContent;run(c.textContent);});});
})();'''


def write_tools_hub():
    url = BASE + "/tools.html"
    desc = "Free home calculators from HomeProjectWise: rug size, crawl space dehumidifier size and more, built on the rules and sources in our guides."
    items = "".join('<li><a href="' + t["slug"] + '.html">' + escape(t["title"]) + '</a><span>' + escape(t["desc"]) + "</span></li>" for t in TOOLS)
    ld = [
        {"@context": "https://schema.org", "@type": "CollectionPage", "name": "Free home calculators", "url": url, "description": desc,
         "mainEntity": {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": BASE + "/" + t["slug"] + ".html", "name": t["title"]} for i, t in enumerate(TOOLS)]}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Tools", "item": url}]},
    ]
    ldhtml = "".join('<script type="application/ld+json">' + json.dumps(d, ensure_ascii=False) + "</script>" for d in ld)
    page = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Free Home Calculators | HomeProjectWise</title><meta name="description" content="' + escape(desc, quote=True) + '"><link rel="canonical" href="' + url + '">'
            '<meta property="og:type" content="website"><meta property="og:title" content="Free Home Calculators | HomeProjectWise"><meta property="og:description" content="' + escape(desc, quote=True) + '"><meta property="og:url" content="' + url + '"><meta name="twitter:card" content="summary">'
            '<link rel="icon" type="image/svg+xml" href="favicon.svg"><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#243238"><link rel="stylesheet" href="style.css">' + GOAT + ldhtml + '</head><body>'
            '<header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise" width="220" height="33"></a><a class="nav-cta" href="guides.html">All guides</a></header>'
            '<main class="section"><nav class="breadcrumb" aria-label="Breadcrumb"><a href="./">Home</a><span>›</span>Tools</nav>'
            '<p class="eyebrow">FREE TOOLS · ' + str(len(TOOLS)) + '</p><h1>Free home calculators</h1>'
            '<p class="lead">Simple calculators that apply the rules and sources from our guides to your own measurements. Each result is an estimate to confirm with a tape measure or a test, and each tool links to the guide behind it.</p>'
            '<form id="ask" class="search-form ask-form" role="search"><label for="askq" class="sr-only">Describe what you want to work out</label><input id="askq" type="text" placeholder="e.g. rug for a 12x15 ft living room" autocomplete="off"><button type="submit">Find my calculator</button></form>'
            '<p class="ask-examples">Try: <button type="button" class="chip">What rug size for a 12x15 ft living room?</button> <button type="button" class="chip">Dehumidifier for a 20 x 40 ft damp crawl space</button> <button type="button" class="chip">Can I put a 1500 W heater on a smart plug?</button> <button type="button" class="chip">Where should I start with my home?</button></p><div id="ask-out" class="calc-out" aria-live="polite"></div>'
            '<h2>All tools</h2><ul class="tool-list">' + items + '</ul><h2>Suggest a tool</h2><p>Is there something you keep calculating by hand? Tell us on the <a href="contact.html">Contact</a> page.</p></main>' + footer() + '<script>' + ASK_JS.replace('__TOOLS__', json.dumps([{k: t[k] for k in ('slug', 'title', 'desc', 'kw')} for t in TOOLS])) + '</script></body></html>')
    (WEBSITE / "tools.html").write_text(page, encoding="utf-8")


def ensure_head_tags(path, prefix):
    html = path.read_text(encoding="utf-8", errors="ignore")
    if "</head>" not in html:
        return
    add = ""
    if 'rel="manifest"' not in html:
        add += '<link rel="manifest" href="' + prefix + 'manifest.webmanifest">'
    if 'name="theme-color"' not in html:
        add += '<meta name="theme-color" content="#243238">'
    for font in ("dm-sans-latin.woff2", "playfair-display-latin.woff2"):
        if font not in html:
            add += '<link rel="preload" href="' + prefix + 'fonts/' + font + '" as="font" type="font/woff2" crossorigin>'
    if add:
        path.write_text(html.replace("</head>", add + "</head>", 1), encoding="utf-8")


def main():
    for page in WEBSITE.glob("*.html"):
        if page.name != "404.html":
            ensure_head_tags(page, "")
    for page in ARTICLES.glob("*.html"):
        ensure_head_tags(page, "../")
    for article in ARTICLES.glob('*.html'):
        html = article.read_text(encoding='utf-8', errors='ignore')
        html = re.sub('<script[^>]*data-goatcounter="[^"]*"[^>]*></script>', '', html, flags=re.I)
        if 'data-goatcounter="https://homeprojectwise.goatcounter.com/count"' not in html:
            html = html.replace('</head>', GOAT + '</head>', 1)
        article.write_text(html, encoding='utf-8')
    r = rows()
    if not r:
        raise SystemExit("No articles could be parsed from website/articles - refusing to publish an empty library")
    enhance_articles(r)
    hub_urls = write_hubs(r) + [BASE + "/" + t["slug"] + ".html" for t in TOOLS] + [BASE + "/tools.html"]
    write_tools_hub()
    write_search(r)
    guides = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
              '<meta name="description" content="HomeProjectWise guides organized into Storage & Organization, Home Design, Weekend Projects and Smart Home.">'
              '<link rel="canonical" href="' + BASE + '/guides.html"><link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="feed.xml">'
              '<link rel="stylesheet" href="style.css">' + GOAT + '<title>Guides &amp; Categories — HomeProjectWise</title></head><body>'
              '<header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise"></a>'
              '<nav><a href="#storage">Storage</a><a href="#design">Home Design</a><a href="#projects">Projects</a><a href="#smart-home">Smart Home</a></nav>'
              '<a class="nav-cta" href="feed.xml">Follow the feed</a></header><main class="section guide-library">'
              '<div class="library-intro"><p class="eyebrow">THE GUIDE LIBRARY</p><h1>Useful answers for real home problems.</h1><p>Every guide has one primary category so the library stays easy to browse.</p><form class="search-form library-search" role="search" action="search.html" method="get"><label for="lq" class="sr-only">Search guides</label><input id="lq" name="q" type="search" placeholder="Search guides: damp, rug size, smart plug" autocomplete="off"><button type="submit">Search</button></form><p class="hub-link"><a href="home-checkup.html">Not sure where to start? Take the 1-minute Home Check-up →</a> · <a href="tools.html">Browse all free tools →</a></p></div>'
              '<div class="library-meta"><strong>' + str(len(r)) + ' guides</strong><span>Practical · readable · built to be used</span></div>'
              + category_sections(r) + '</main>' + footer() + '</body></html>')
    (WEBSITE / "guides.html").write_text(guides, encoding="utf-8")

    urls = [BASE + p for p in ("/", "/guides.html", "/about.html", "/editorial-policy.html", "/privacy.html", "/terms.html", "/contact.html")]
    entries = [(u, None) for u in urls + hub_urls]
    for x in r:
        stamp = x.get("modified") or x["date"]
        lastmod = stamp.strftime("%Y-%m-%d") if stamp.year > 1 else None
        entries.append((BASE + "/articles/" + x["slug"] + ".html", lastmod))
    (WEBSITE / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join("<url><loc>" + u + "</loc>" + (("<lastmod>" + lm + "</lastmod>") if lm else "") + "</url>" for u, lm in entries) + "</urlset>", encoding="utf-8")

    items = "".join(f'<item><title>{escape(x["title"])}</title><link>{BASE}/articles/{x["slug"]}.html</link><description>{escape(x["description"])}</description></item>' for x in r[:20])
    (WEBSITE / "feed.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HomeProjectWise</title><link>' + BASE + '/</link><description>Practical home projects, smart-home ideas and useful guides.</description>' + items + "</channel></rss>", encoding="utf-8")

    (WEBSITE / "robots.txt").write_text("User-agent: *" + NL + "Allow: /" + NL + NL + "Sitemap: " + BASE + "/sitemap.xml" + NL, encoding="utf-8")
    p = WEBSITE / "index.html"
    for key_file in (ROOT / "static").glob("*.txt"):
        if re.fullmatch("[A-Fa-f0-9]{32}[.]txt", key_file.name):
            (WEBSITE / key_file.name).write_text(key_file.read_text(encoding="utf-8"), encoding="utf-8")

    h = p.read_text(encoding="utf-8", errors="ignore")
    latest = "".join(card(x, True) for x in r[:3])
    latest_section = '<section id="latest" class="section"><div class="section-head"><div><p class="eyebrow">THE LATEST</p><h2>Useful guides, newest first.</h2><p class="section-intro">Real fixes, practical projects and smart-home decisions — without filler.</p></div><a href="guides.html">Browse all ' + str(len(r)) + ' guides →</a></div><div class="cards">' + latest + '</div></section>'

    # Attribute-order tolerant: matches id="latest" / id="categories" however the tag is written.
    h, n = re.subn('<section[^>]*id="latest"[^>]*>.*?</section>', lambda m: latest_section, h, count=1, flags=re.S)
    if n == 0:
        m = re.search('<section[^>]*id="categories"[^>]*>', h)
        if not m:
            raise SystemExit("Could not find categories section for latest insertion")
        h = h[:m.start()] + latest_section + h[m.start():]

    p.write_text(h, encoding="utf-8")
    for page in WEBSITE.glob("*.html"):
        if page.name != "404.html":
            ensure_head_tags(page, "")
    print(f"Rebuilt guide library, homepage latest cards, sitemap and RSS from {len(r)} article files.")


if __name__ == "__main__":
    main()
