#!/usr/bin/env python3
"""
fix_site_v2.py - one-shot repair for HomeProjectWise (static HTML, GitHub Pages).

Run from the repo root:   python tools/fix_site_v2.py
Needs:                    pip install beautifulsoup4
"""
import datetime
import re
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent if Path(__file__).parent.name == "tools" else Path.cwd()
SITE = ROOT / "website"
ARTICLES = SITE / "articles"
BASE = "https://home-project-wise.github.io/home-project-wise"

RETIRED = [
    "entryway-drop-zone",
    "five-minute-home-reset-that-prevents-clutter",
    "make-bedroom-more-restful",
    "stop-kitchen-counter-clutter",
]
REMOVE_AFFILIATE_NOTE = True          # set False once Awin links are live
MAX_IMAGES = 4
SITEMAP_EXCLUDE = re.compile(r"smoke|test|draft|template", re.I)

KEEP_IMAGES = {
    "stop-musty-bathroom-towels": [
        "1685813223206",  # towel beside shower (hero)
        "1471880504582",  # towel bar
        "1581869393747",  # window ventilation
        "1742932759518",  # laundry / washing
    ],
}

DUPLICATE_SECTIONS = {
    "stop-musty-bathroom-towels": [
        "Give towels enough air to dry between uses",
        "Separate towel drying from towel storage",
        "Check what happens between showers",
        "Build a small towel routine that is easy to repeat",
    ],
    "smart-lighting": [
        "11. Use a simple decision checklist",
    ],
}
FILLER_PARAGRAPHS = {
    "smart-lighting": [
        "There is also a social test",
        "Keep a simple before-and-after note",
        "That mindset keeps the project practical",
        "Keep the rule visible",
    ],
}

log = []


def note(msg):
    log.append(msg)
    print(msg)


def read(p):
    return p.read_text(encoding="utf-8")


def write(p, s):
    p.write_text(s, encoding="utf-8")


def soup_of(html):
    return BeautifulSoup(html, "html.parser")


def dump(soup):
    return str(soup)


def remove_with_caption(img):
    fig = img.find_parent("figure")
    if fig:
        fig.decompose()
        return
    nxt = img.find_next_sibling()
    img.decompose()
    if nxt is not None and nxt.name in ("figcaption", "em", "small", "p"):
        txt = nxt.get_text(" ", strip=True)
        is_caption = nxt.name in ("figcaption", "em", "small") or "caption" in " ".join(nxt.get("class", []))             or (nxt.name == "p" and nxt.find("em") and len(nxt.find_all(True)) == 1 and nxt.find("em").get_text(strip=True) == txt)
        if is_caption:
            nxt.decompose()


def remove_section_soft(soup, heading_start):
    for h in soup.find_all("h2"):
        if h.get_text(" ", strip=True).lower().startswith(heading_start.lower()):
            sib = h.find_next_sibling()
            h.decompose()
            while sib is not None:
                nxt = sib.find_next_sibling()
                if sib.name in ("h2",):
                    break
                if sib.name == "p" and ("For practical next steps" in sib.get_text() or "For a calmer room" in sib.get_text()):
                    break
                if sib.name in ("p", "ul", "ol", "h3", "figure", "img"):
                    sib.decompose()
                else:
                    break
                sib = nxt
            return True
    return False


def clean_alt_and_captions(html):
    def fix_alt(m):
        alt = m.group(2)
        alt = re.sub(r"s+—s+[^"]*?;s*section:[^"]*$", "", alt)
        alt = re.sub(r";s*section:[^"]*$", "", alt)
        return f'{m.group(1)}{alt.strip()}"'
    html = re.sub(r'(alt=")([^"]*)"', fix_alt, html)
    html = re.sub(r"s*This section focuses on [^.<]*.", "", html)
    html = re.sub(r"s*Section context:[^<]*", "", html)
    html = re.sub(r"s*—s*Unsplash(?=s*</)", " — Unsplash", html)
    return html


def fix_article(path, existing_slugs):
    slug = path.stem
    html = read(path)
    original = html

    html = clean_alt_and_captions(html)
    soup = soup_of(html)

    for a in soup.find_all("a", href=True):
        m = re.search(r"/articles/([^/]+).html", a["href"])
        if m and (m.group(1) in RETIRED or m.group(1) not in existing_slugs):
            a.unwrap()

    links = [a for a in soup.find_all("a", href=True) if "sibforms.com" in a["href"]]
    for a in links[1:]:
        block = a
        while block.parent is not None and block.parent.name not in ("body", "main", "article", "html", "[document]"):
            sibs = [x for x in block.parent.find_all("a", href=True) if "sibforms.com" in x["href"]]
            if len(sibs) == 1 and block.parent.find(["h1"]) is None:
                block = block.parent
            else:
                break
        block.decompose()
    if len(links) > 1:
        note(f"  {slug}: removed {len(links) - 1} duplicate CTA block(s)")

    if REMOVE_AFFILIATE_NOTE and not any("awin" in a["href"] for a in soup.find_all("a", href=True)):
        for p in soup.find_all(["p", "div"]):
            if p.get_text(strip=True).startswith("Affiliate disclosure:") and len(p.get_text(strip=True)) < 160:
                p.decompose()
                note(f"  {slug}: removed empty affiliate disclosure")
                break

    for heading in DUPLICATE_SECTIONS.get(slug, []):
        if remove_section_soft(soup, heading):
            note(f"  {slug}: removed section '{heading[:40]}'")
        else:
            note(f"  {slug}: section '{heading[:40]}' not found (already clean?)")
    for start in FILLER_PARAGRAPHS.get(slug, []):
        for p in soup.find_all("p"):
            if p.get_text(" ", strip=True).startswith(start):
                p.decompose()
                note(f"  {slug}: removed filler paragraph '{start[:30]}'")
                break

    body = soup.find("main") or soup.find("article") or soup.body or soup
    imgs = [i for i in body.find_all("img") if "logo" not in i.get("src", "")]
    if len(imgs) > MAX_IMAGES:
        keep_ids = KEEP_IMAGES.get(slug)
        if keep_ids:
            keep = [i for i in imgs if any(k in i.get("src", "") for k in keep_ids)]
            keep = keep[:MAX_IMAGES]
        else:
            keep = imgs[:MAX_IMAGES]
        for img in imgs:
            if img not in keep:
                remove_with_caption(img)
        note(f"  {slug}: images {len(imgs)} -> {len(keep)}")

    out = dump(soup)
    if out != original:
        write(path, out)
        return True
    return False


def fix_index_pages(existing_slugs):
    n = len(existing_slugs)
    for name in ("index.html", "guides.html"):
        p = SITE / name
        if not p.exists():
            note(f"  {name}: missing")
            continue
        soup = soup_of(read(p))
        removed = 0
        for a in soup.find_all("a", href=True):
            m = re.search(r"/articles/([^/]+).html", a["href"])
            if m and m.group(1) not in existing_slugs:
                card = a
                while card.parent is not None and card.parent.name not in ("body", "main", "section", "html", "[document]"):
                    cards_inside = [x for x in card.parent.find_all("a", href=True) if "/articles/" in x["href"]]
                    if len({re.search(r"/articles/([^/]+).html", x["href"]).group(1) for x in cards_inside}) == 1:
                        card = card.parent
                    else:
                        break
                if card.parent is not None:
                    card.decompose()
                    removed += 1
        html = dump(soup)
        html = re.sub(r"\b\d+ guides\b", f"{n} guides", html)
        html = re.sub(r"Browse all \d+ guides", f"Browse all {n} guides", html)
        html = html.replace("/images/logo.svg", "/logo.svg") if (SITE / "logo.svg").exists() and not (SITE / "images/logo.svg").exists() else html
        write(p, html)
        note(f"  {name}: removed {removed} retired card(s), count set to {n}")


def git_date(path):
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", str(path)],
                             capture_output=True, text=True, cwd=ROOT).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    return datetime.date.today().isoformat()


def build_sitemap():
    urls = [("", SITE / "index.html")]
    for name in ("guides", "about", "editorial-policy", "privacy", "terms", "contact"):
        if (SITE / f"{name}.html").exists():
            urls.append((f"{name}.html", SITE / f"{name}.html"))
    for p in sorted(ARTICLES.glob("*.html")):
        if not SITEMAP_EXCLUDE.search(p.stem):
            urls.append((f"articles/{p.name}", p))
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for rel, p in urls:
        loc = f"{BASE}/{rel}"
        pri = "1.0" if rel == "" else ("0.8" if rel.startswith("articles/") else "0.5")
        lines.append(f"  <url><loc>{loc}</loc><lastmod>{git_date(p)}</lastmod><priority>{pri}</priority></url>")
    lines.append("</urlset>")
    write(SITE / "sitemap.xml", "\n".join(lines) + "\n")
    note(f"  sitemap.xml rebuilt: {len(urls)} URLs")


def main():
    if not ARTICLES.exists():
        print(f"ERROR: {ARTICLES} not found. Run from the repo root.")
        sys.exit(2)

    note("[1] Retired articles")
    for slug in RETIRED:
        p = ARTICLES / f"{slug}.html"
        if p.exists():
            p.unlink()
            note(f"  deleted {p.name}")

    existing = {p.stem for p in ARTICLES.glob("*.html") if not SITEMAP_EXCLUDE.search(p.stem)}
    note(f"[2] Fixing {len(existing)} articles")
    for p in sorted(ARTICLES.glob("*.html")):
        if p.stem in existing:
            fix_article(p, existing)

    note("[3] Index pages")
    fix_index_pages(existing)

    note("[4] Sitemap")
    build_sitemap()

    note("[5] Verification")
    problems = []
    sm = read(SITE / "sitemap.xml")
    if re.search(r"smoke", sm, re.I):
        problems.append("sitemap still contains smoke tests")
    if "stop-musty-bathroom-towels" not in sm:
        problems.append("sitemap missing stop-musty-bathroom-towels")
    for slug in RETIRED:
        for p in SITE.rglob("*.html"):
            if f"/{slug}.html" in read(p):
                problems.append(f"{p.relative_to(SITE)} still links to {slug}")
    for p in ARTICLES.glob("*.html"):
        h = read(p)
        if re.search(r'alt="[^"]*section:', h) or "Section context:" in h:
            problems.append(f"{p.name} still has stuffed alt/caption")
        if h.count("sibforms.com") > 1:
            problems.append(f"{p.name} has duplicate CTA")
    if problems:
        print("\nPROBLEMS:")
        for x in problems:
            print("  -", x)
        sys.exit(1)
    print("\nALL CHECKS PASSED")


if __name__ == "__main__":
    main()
