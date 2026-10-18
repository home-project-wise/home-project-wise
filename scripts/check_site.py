#!/usr/bin/env python3
"""Offline quality check for the built site. Run after scripts/rebuild_site_indexes.py.
Errors (exit code 1): broken local links/images, missing canonical, bad JSON-LD, missing datePublished, missing h1.
Warnings: guides without a Sources section or without an external source link, thin guides, images without alt."""
import json, re, sys, os
from pathlib import Path
from html.parser import HTMLParser
ROOT = Path(__file__).resolve().parents[1]
W = ROOT / "website"
BASE = "https://home-project-wise.github.io/home-project-wise"
errors, warnings = [], []
class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.imgs = []; self.h1 = 0; self.canon = None; self.ld = []; self._ld = False; self._buf = ""
    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "link" and a.get("href"): self.links.append(a["href"])
        if tag == "link" and a.get("rel") == "canonical": self.canon = a.get("href")
        if tag == "img": self.imgs.append(a)
        if tag == "h1": self.h1 += 1
        if tag == "script" and a.get("type") == "application/ld+json": self._ld = True; self._buf = ""
    def handle_endtag(self, tag):
        if tag == "script" and self._ld: self.ld.append(self._buf); self._ld = False
    def handle_data(self, d):
        if self._ld: self._buf += d
def local_target(page, ref):
    ref = ref.split("#")[0].split("?")[0]
    if not ref or ref.startswith(("http", "//", "mailto:", "data:", "tel:", "javascript:")): return None
    t = (page.parent / ref).resolve()
    return t / "index.html" if ref.endswith("/") or ref in (".", "..") else t
for page in sorted(W.rglob("*.html")):
    rel = page.relative_to(W).as_posix()
    if rel in ("site-audit.html", "google-site-verification.html", "footer.html"): continue
    t = page.read_text(encoding="utf-8", errors="ignore"); p = P(); p.feed(t)
    for ref in p.links + [i.get("src", "") for i in p.imgs]:
        tgt = local_target(page, ref)
        if tgt is not None and not tgt.exists(): errors.append(f"{rel}: broken local reference {ref}")
    for raw in p.ld:
        try: json.loads(raw)
        except Exception: errors.append(f"{rel}: invalid JSON-LD")
    is_article = rel.startswith("articles/")
    if rel not in ("404.html", "search.html") and not p.canon: errors.append(f"{rel}: missing canonical")
    if is_article:
        if p.h1 != 1: errors.append(f"{rel}: expected one h1, found {p.h1}")
        if '"datePublished"' not in t: errors.append(f"{rel}: missing datePublished")
        if p.canon and p.canon != f"{BASE}/{rel}": errors.append(f"{rel}: canonical mismatch {p.canon}")
        m = re.search(r"<h2[^>]*>\s*(?:\d+\.\s*)?(Sources|References)[^<]*</h2>(.*?)(?=<h2|</main>)", t, re.S | re.I)
        if not m: warnings.append(f"{rel}: no Sources section")
        elif not re.search(r'href="https?://', m.group(2)): warnings.append(f"{rel}: Sources section has no external link")
        words = len(re.sub(r"<[^>]+>", " ", t).split())
        if words < 900: warnings.append(f"{rel}: only {words} words")
        for i in p.imgs:
            if "alt" not in i: warnings.append(f"{rel}: image without alt {i.get('src')}")
sm = (W / "sitemap.xml").read_text(encoding="utf-8")
for u in re.findall(r"<loc>(.*?)</loc>", sm):
    path = u.replace(BASE, "").lstrip("/") or "index.html"
    if not (W / path).exists(): errors.append(f"sitemap: {u} has no file")
print(f"{len(errors)} errors, {len(warnings)} warnings")
for e in errors: print("ERROR", e)
for w in warnings: print("WARN ", w)
sys.exit(1 if errors else 0)
