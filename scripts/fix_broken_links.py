#!/usr/bin/env python3
"""Repair internal links in website/articles/*.html that point to deleted articles.

- Links with a close replacement are redirected (and their anchor text updated).
- Other broken links: the sentence (or list item) containing them is removed.
Idempotent: running it twice changes nothing the second time.
"""
import re
import sys
from pathlib import Path

ART = Path(sys.argv[1] if len(sys.argv) > 1 else "website/articles")
SITE_PAGES = {"index.html", "guides.html", "about.html", "contact.html", "privacy.html",
              "terms.html", "editorial-policy.html"}

REPLACE = {
    "entryway-drop-zone.html": ("quiet-entryway-storage.html", "quiet entryway storage guide"),
    "five-minute-home-reset-that-prevents-clutter.html": (
        "simple-home-reset-that-prevents-weekend-chaos.html",
        "simple home reset that prevents weekend chaos"),
}
LINK = re.compile(r'<a\s[^>]*href="([^"#?]+\.html)"[^>]*>(.*?)</a>', re.S)
existing = {p.name for p in ART.glob("*.html")}


def is_broken(href):
    if href.startswith(("http", "/", "../", "mailto:")):
        return False
    name = href.split("/")[-1]
    return name not in existing and name not in SITE_PAGES


def drop_sentences(par):
    """Remove sentences of a <p> that contain a broken link."""
    m = re.match(r'(<p[^>]*>)(.*)(</p>)$', par, re.S)
    if not m:
        return par
    head, inner, tail = m.groups()
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z<])', inner)
    keep = [s for s in parts if not any(is_broken(h) for h, _ in LINK.findall(s))]
    return head + " ".join(keep) + tail if keep else ""


changed = 0
for f in sorted(ART.glob("*.html")):
    html = f.read_text(encoding="utf-8")
    new = html
    for old, (target, text) in REPLACE.items():
        if old in new and old not in existing:
            new = re.sub(r'(<a\s[^>]*href=")' + re.escape(old) + r'("[^>]*>)(.*?)(</a>)',
                         lambda m: m.group(1) + target + m.group(2) + text + m.group(4), new, flags=re.S)
    new = re.sub(r'<li>\s*<a\s[^>]*href="([^"]+\.html)"[^>]*>.*?</a>\s*</li>\s*',
                 lambda m: "" if is_broken(m.group(1)) else m.group(0), new, flags=re.S)
    new = re.sub(r'<p[^>]*>(?:(?!</p>).)*?</p>',
                 lambda m: drop_sentences(m.group(0)) if any(is_broken(h) for h, _ in LINK.findall(m.group(0))) else m.group(0),
                 new, flags=re.S)
    if new != html:
        f.write_text(new, encoding="utf-8")
        changed += 1
        print("fixed", f.name)

left = [(f.name, h) for f in ART.glob("*.html") for h, _ in LINK.findall(f.read_text(encoding="utf-8")) if is_broken(h)]
print(f"{changed} file(s) changed; remaining broken links: {left}")
sys.exit(1 if left else 0)
