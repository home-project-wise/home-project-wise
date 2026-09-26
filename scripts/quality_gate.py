#!/usr/bin/env python3
"""Fail closed on weak newly-published articles."""
from __future__ import annotations
import argparse, re, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
WEBSITE = ROOT / "website"
ARTICLES = WEBSITE / "articles"
MIN_WORDS, MIN_H2, MIN_IMAGES, MIN_FAQ, MIN_INTERNAL = 1500, 8, 5, 4, 3
REQUIRED = ["index.html", "guides.html", "about.html", "robots.txt", "sitemap.xml", "feed.xml"]

def visible_text(html: str) -> str:
    html = re.sub(r"<script\b[^>]*>.*?</script>", " ", html, flags=re.I | re.S)
    html = re.sub(r"<style\b[^>]*>.*?</style>", " ", html, flags=re.I | re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).strip()

def internal_links(html: str) -> int:
    links = re.findall(r'href=["\']([^"\']+)["\']', html, flags=re.I)
    return sum(1 for u in links if u.endswith(".html") and not u.startswith(("http://", "https://", "//")))

def check(path: Path) -> list[str]:
    html = path.read_text(encoding="utf-8")
    text = visible_text(html)
    words = len(re.findall(r"\b[\w’'-]+\b", text))
    h2 = len(re.findall(r"<h2\b", html, flags=re.I))
    images = len(re.findall(r"<img\b", html, flags=re.I))
    faq = len(re.findall(r"<h3\b", html, flags=re.I))
    links = internal_links(html)
    failures = []
    checks = [(words >= MIN_WORDS, f"words {words} < {MIN_WORDS}"), (h2 >= MIN_H2, f"h2 {h2} < {MIN_H2}"), (images >= MIN_IMAGES, f"images {images} < {MIN_IMAGES}"), (faq >= MIN_FAQ, f"faq questions {faq} < {MIN_FAQ}"), (links >= MIN_INTERNAL, f"internal links {links} < {MIN_INTERNAL}")]
    failures.extend(msg for ok, msg in checks if not ok)
    if "application/ld+json" not in html: failures.append("missing JSON-LD")
    if "FAQPage" not in html: failures.append("missing FAQPage schema")
    if not re.search(r'<meta\s+name=["\']description["\']', html, re.I): failures.append("missing meta description")
    return failures

def changed_articles() -> list[Path]:
    try: out = subprocess.check_output(["git", "diff", "--name-only"], cwd=ROOT, text=True)
    except Exception: out = ""
    paths = [ROOT / p.strip() for p in out.splitlines() if p.strip().startswith("website/articles/") and p.strip().endswith(".html")]
    return [p for p in paths if p.exists()]

def main() -> int:
    ap = argparse.ArgumentParser(); ap.add_argument("--all", action="store_true", help="audit every article"); args = ap.parse_args()
    for f in REQUIRED:
        if not (WEBSITE / f).exists(): print(f"FAIL: missing website/{f}"); return 1
    targets = sorted(ARTICLES.glob("*.html")) if args.all else changed_articles()
    if not targets: print("PASS: no changed article candidate; site structure is present."); return 0
    failed = False
    for path in targets:
        errors = check(path)
        if errors:
            failed = True; print(f"FAIL: {path.relative_to(ROOT)}")
            for e in errors: print(f"  - {e}")
        else:
            html = path.read_text(encoding="utf-8")
            words = len(re.findall(r"\b[\w’'-]+\b", visible_text(html))); h2 = len(re.findall(r"<h2\b", html, re.I)); images = len(re.findall(r"<img\b", html, re.I)); faq = len(re.findall(r"<h3\b", html, re.I))
            print(f"PASS: {path.relative_to(ROOT)} | words={words} h2={h2} images={images} faq={faq} internal={internal_links(html)}")
    return 1 if failed else 0

if __name__ == "__main__": raise SystemExit(main())
