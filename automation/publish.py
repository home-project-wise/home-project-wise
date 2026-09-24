#!/usr/bin/env python3
import json
import re
from datetime import datetime, timezone
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / "content" / "queue"
ARTICLES = ROOT / "website" / "articles"
WEBSITE = ROOT / "website"


def now_utc():
    return datetime.now(timezone.utc)


def load_queue():
    items = []
    for path in sorted(QUEUE.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            data["_path"] = path
            data["_publish_dt"] = datetime.fromisoformat(data["publish_at"].replace("Z", "+00:00"))
            items.append(data)
        except Exception as exc:
            print(f"Skipping invalid queue item {path}: {exc}")
    return sorted(items, key=lambda x: x["_publish_dt"])


def article_html(item):
    title = escape(item["title"])
    description = escape(item["description"])
    slug = escape(item["slug"])
    canonical = f"https://home-project-wise.github.io/home-project-wise/articles/{slug}.html"
    image = escape(item["image"], quote=True)
    category = escape(item["category"])
    published = item["publish_at"][:10]
    body = item["body_html"]
    return f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="{description}">
<link rel="canonical" href="{canonical}">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article"><meta property="og:title" content="{title}"><meta property="og:description" content="{description}"><meta property="og:image" content="{image}">
<meta property="article:published_time" content="{published}">
<title>{title} — HomeProjectWise</title>
<link rel="stylesheet" href="../style.css">
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"Article","headline":item["title"],"description":item["description"],"image":item["image"],"datePublished":published,"author":{"@type":"Organization","name":"HomeProjectWise Editorial"},"publisher":{"@type":"Organization","name":"HomeProjectWise Editorial"},"mainEntityOfPage":canonical}, ensure_ascii=False)}</script>
</head>
<body>
<header class="nav"><a class="brand" href="../"><span class="mark">H</span><span>HomeProjectWise</span></a><nav><a href="../#projects">Projects</a><a href="../guides.html">Guides</a><a href="../#ideas">Ideas</a><a href="../about.html">About</a></nav><a class="nav-cta" href="../guides.html">Explore guides</a></header>
<main class="section article-page">
<p class="eyebrow">{category}</p>
<h1>{title}</h1>
<p class="lead">{description}</p>
<img class="article-hero" src="{image}" alt="{escape(item['image_alt'], quote=True)}" loading="eager">
{body}
<p><a class="text-link" href="../guides.html">← Explore more HomeProjectWise guides</a></p>
</main>
<footer><div class="brand"><span class="mark">H</span><span>HomeProjectWise</span></div><p>Better decisions. Better projects. A better home.</p><a href="../about.html">About the editorial team</a></footer>
</body></html>'''


def extract_articles():
    rows = []
    for path in sorted(ARTICLES.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        if path.name == "index.html":
            continue
        desc = re.search(r'<meta name="description" content="([^"]*)"', text, re.S)
        title = re.search(r'<title>(.*?)</title>', text, re.S)
        if not desc or not title:
            continue
        clean_title = re.sub(r"\s*[|—-]\s*HomeProjectWise.*$", "", re.sub(r"<[^>]+>", "", title.group(1))).strip()
        rows.append({"slug": path.stem, "description": desc.group(1), "title": clean_title, "url": f"articles/{path.name}"})
    return rows


def write_guides(rows):
    cards = "\n".join(f'''<article class="card"><div class="card-body"><span class="tag">GUIDE</span><h3>{escape(r['title'])}</h3><p>{escape(r['description'])}</p><a href="{r['url']}">Read the guide →</a></div></article>''' for r in rows)
    html = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Practical HomeProjectWise guides for real home problems, projects and smart-home decisions."><link rel="alternate" type="application/rss+xml" title="HomeProjectWise" href="feed.xml"><link rel="canonical" href="https://home-project-wise.github.io/home-project-wise/guides.html"><link rel="icon" href="favicon.svg" type="image/svg+xml"><title>Guides — HomeProjectWise</title><link rel="stylesheet" href="style.css"></head><body><header class="nav"><a class="brand" href="./"><span class="mark">H</span><span>HomeProjectWise</span></a><nav><a href="index.html#projects">Projects</a><a href="guides.html">Guides</a><a href="index.html#ideas">Ideas</a><a href="about.html">About</a></nav><a class="nav-cta" href="feed.xml">Follow the feed</a></header><main class="section"><p class="eyebrow">THE GUIDE LIBRARY</p><h1>Useful answers for real home problems.</h1><p class="lead">Practical, specific advice designed to help you make a better decision before you spend money or start a project.</p><div class="cards">{cards}</div></main><footer><div class="brand"><span class="mark">H</span><span>HomeProjectWise</span></div><p>Better decisions. Better projects. A better home.</p><a href="about.html">About the editorial team</a></footer></body></html>'''
    (WEBSITE / "guides.html").write_text(html, encoding="utf-8")


def write_sitemap(rows):
    urls = ["https://home-project-wise.github.io/home-project-wise/", "https://home-project-wise.github.io/home-project-wise/guides.html", "https://home-project-wise.github.io/home-project-wise/about.html"]
    urls += ["https://home-project-wise.github.io/home-project-wise/" + r["url"] for r in rows]
    body = "".join(f"<url><loc>{escape(u)}</loc></url>" for u in urls)
    (WEBSITE / "sitemap.xml").write_text(f'''<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{body}</urlset>''', encoding="utf-8")


def write_rss(rows):
    items = "".join(f'''<item><title>{escape(r['title'])}</title><link>https://home-project-wise.github.io/home-project-wise/{r['url']}</link><description>{escape(r['description'])}</description></item>''' for r in rows[:20])
    (WEBSITE / "feed.xml").write_text(f'''<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HomeProjectWise</title><link>https://home-project-wise.github.io/home-project-wise/</link><description>Practical home projects, smart-home ideas and useful guides.</description>{items}</channel></rss>''', encoding="utf-8")


def main():
    queue = load_queue()
    now = now_utc()
    due = [x for x in queue if x["_publish_dt"] <= now]
    if not due:
        print("No due article in queue.")
        return
    item = due[0]
    target = ARTICLES / f"{item['slug']}.html"
    target.write_text(article_html(item), encoding="utf-8")
    item["_path"].unlink()
    rows = extract_articles()
    rows.sort(key=lambda x: x["slug"], reverse=True)
    write_guides(rows)
    write_sitemap(rows)
    write_rss(rows)
    print(f"Published: {item['slug']}")


if __name__ == "__main__":
    main()
