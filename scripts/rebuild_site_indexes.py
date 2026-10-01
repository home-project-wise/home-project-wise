#!/usr/bin/env python3
from __future__ import annotations
import re
from html import escape, unescape
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
WEBSITE = ROOT / "website"
ARTICLES = WEBSITE / "articles"
BASE = "https://home-project-wise.github.io/home-project-wise"
GOAT = '<script data-goatcounter="https://homeprojectwise.goatcounter.com/count" async src="//gc.zgo.at/count.v5.js" crossorigin="anonymous"></script>'


def article_date(text):
    for pat in (
        r'"datePublished"\s*:\s*"([^"]+)"',
        r'<meta[^>]+property=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']',
    ):
        m = re.search(pat, text, re.I)
        if m:
            try:
                return datetime.fromisoformat(m.group(1).replace("Z", "+00:00"))
            except Exception:
                pass
    return datetime.min.replace(tzinfo=timezone.utc)


def rows():
    out = []
    for p in ARTICLES.glob("*.html"):
        t = p.read_text(encoding="utf-8", errors="ignore")
        desc = re.search(r'<meta name="description" content="([^"]*)"', t, re.I)
        title = re.search(r"<title>(.*?)</title>", t, re.S | re.I)
        img = re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]+alt=["\']([^"\']*)["\']', t, re.I)
        cat = re.search(r'<p class="eyebrow">([^<]+)</p>', t, re.I)
        if desc and title:
            clean = re.sub(r"\s*[|—-]\s*HomeProjectWise.*$", "", re.sub("<[^>]+>", "", title.group(1))).strip()
            out.append({
                "slug": p.stem,
                "title": unescape(clean),
                "description": unescape(desc.group(1)),
                "image": unescape(img.group(1)) if img else "",
                "alt": unescape(img.group(2)) if img else "Useful home project guide",
                "category": unescape(cat.group(1).strip()) if cat else "HOME PROJECTS",
                "date": article_date(t),
            })
    return sorted(out, key=lambda x: (x["date"], x["slug"]), reverse=True)


def footer():
    return '<footer><div class="brand"><img class="brand-logo-footer" src="logo.svg" alt="HomeProjectWise"></div><nav><a href="./">Home</a><a href="./guides.html">Guides</a><a href="./about.html">About</a><a href="./editorial-policy.html">Editorial Policy</a><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="./contact.html">Contact</a></nav><p>Better decisions. Better projects. A better home.</p></footer>'


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
    parts = []
    for key, label, heading, intro in specs:
        items = [x for x in r if category_key(x) == key]
        cards = "".join(card(x) for x in items)
        parts.append(f'<section id="{key}" class="section"><p class="eyebrow">{label}</p><h2>{heading}</h2><p>{intro}</p><div class="cards">{cards}</div></section>')
    return "".join(parts)


def main():
    for article in ARTICLES.glob('*.html'):
        html = article.read_text(encoding='utf-8', errors='ignore')
        html = re.sub(r'<script[^>]*data-goatcounter="[^"]*"[^>]*></script>', '', html, flags=re.I)
        if 'data-goatcounter="https://homeprojectwise.goatcounter.com/count"' not in html:
            html = html.replace('</head>', GOAT + '</head>', 1)
        article.write_text(html, encoding='utf-8')
    r = rows()
    guides = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
              '<meta name="description" content="HomeProjectWise guides organized into Storage & Organization, Home Design, Weekend Projects and Smart Home.">'
              '<link rel="canonical" href="' + BASE + '/guides.html"><link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="feed.xml">'
              '<link rel="stylesheet" href="style.css">' + GOAT + '<title>Guides &amp; Categories — HomeProjectWise</title></head><body>'
              '<header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise"></a>'
              '<nav><a href="#storage">Storage</a><a href="#design">Home Design</a><a href="#projects">Projects</a><a href="#smart-home">Smart Home</a></nav>'
              '<a class="nav-cta" href="feed.xml">Follow the feed</a></header><main class="section guide-library">'
              '<div class="library-intro"><p class="eyebrow">THE GUIDE LIBRARY</p><h1>Useful answers for real home problems.</h1><p>Every guide has one primary category so the library stays easy to browse.</p></div>'
              '<div class="library-meta"><strong>' + str(len(r)) + ' guides</strong><span>Practical · readable · built to be used</span></div>'
              + category_sections(r) + '</main>' + footer() + '</body></html>')
    (WEBSITE / "guides.html").write_text(guides, encoding="utf-8")

    urls = [BASE + p for p in ("/", "/guides.html", "/about.html", "/editorial-policy.html", "/privacy.html", "/terms.html", "/contact.html")]
    urls += [BASE + "/articles/" + x["slug"] + ".html" for x in r]
    (WEBSITE / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + ''.join("<url><loc>" + u + "</loc></url>" for u in urls) + "</urlset>", encoding="utf-8")

    items = "".join(f'<item><title>{escape(x["title"])}</title><link>{BASE}/articles/{x["slug"]}.html</link><description>{escape(x["description"])}</description></item>' for x in r[:20])
    (WEBSITE / "feed.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HomeProjectWise</title><link>' + BASE + '/</link><description>Practical home projects, smart-home ideas and useful guides.</description>' + items + "</channel></rss>", encoding="utf-8")

    (WEBSITE / "robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: " + BASE + "/sitemap.xml\n", encoding="utf-8")\n    for key_file in (ROOT / "static").glob("*.txt"):\n        if re.fullmatch(r"[A-Fa-f0-9]{32}\\.txt", key_file.name):\n            (WEBSITE / key_file.name).write_text(key_file.read_text(encoding="utf-8"), encoding="utf-8")\n\n    p = WEBSITE / "index.html"
    h = p.read_text(encoding="utf-8", errors="ignore")
    latest = "".join(card(x, True) for x in r[:3])
    latest_section = '<section id="latest" class="section"><div class="section-head"><div><p class="eyebrow">THE LATEST</p><h2>Useful guides, newest first.</h2><p class="section-intro">Real fixes, practical projects and smart-home decisions — without filler.</p></div><a href="guides.html">Browse all ' + str(len(r)) + ' guides →</a></div><div class="cards">' + latest + '</div></section>'

    pattern = r'<section id="latest" class="section">.*?</section>'
    h, n = re.subn(pattern, latest_section, h, count=1, flags=re.S)
    if n == 0:
        marker = '<section id="categories" class="section">'
        if marker not in h:
            raise SystemExit("Could not find categories section for latest insertion")
        h = h.replace(marker, latest_section + marker, 1)

    p.write_text(h, encoding="utf-8")
    print(f"Rebuilt guide library, homepage latest cards, sitemap and RSS from {len(r)} article files.")


if __name__ == "__main__":
    main()
