#!/usr/bin/env python3
"""Quality gate focused on usefulness, completeness and technical safety.

Length is deliberately adaptive: an article is not required to hit an arbitrary
word count. The gate rejects thin pages, broken image URLs, duplicate images and
missing core metadata.
"""
from __future__ import annotations
import argparse, json, re, subprocess
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parents[1]
WEBSITE = ROOT / "website"
ARTICLES = WEBSITE / "articles"
REGISTRY = ROOT / "data" / "used_images.json"
MIN_WORDS = 650
MIN_H2 = 4
MIN_IMAGES = 3
MIN_FAQ = 3
MIN_INTERNAL = 2
REQUIRED = ["index.html", "guides.html", "about.html", "robots.txt", "sitemap.xml", "feed.xml"]
BASE = "https://home-project-wise.github.io/home-project-wise"

def visible_text(html: str) -> str:
    html = re.sub(r"<script\b[^>]*>.*?</script>", " ", html, flags=re.I | re.S)
    html = re.sub(r"<style\b[^>]*>.*?</style>", " ", html, flags=re.I | re.S)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).strip()

def internal_links(html: str) -> int:
    links = re.findall(r'href=["\']([^"\']+)["\']', html, flags=re.I)
    return sum(1 for u in links if u.endswith(".html") and not u.startswith(("http://", "https://", "//")))

def image_urls(html: str) -> list[str]:
    return re.findall(r'<img\b[^>]+src=["\']([^"\']+)["\']', html, flags=re.I)

def image_ids(html: str) -> list[str]:
    ids = []
    for url in image_urls(html):
        m = re.search(r"photo-([A-Za-z0-9_-]+)", url)
        ids.append(m.group(1) if m else url.split("?")[0])
    return ids

def registry():
    if not REGISTRY.exists():
        return {"used_ids": [], "used_urls": [], "used_photographers": []}
    try:
        return json.loads(REGISTRY.read_text(encoding="utf-8"))
    except Exception:
        return {"used_ids": [], "used_urls": [], "used_photographers": []}

def check_image_url(url: str) -> str | None:
    if url.startswith(("../", "./", "/")):
        return None
    if not url.startswith(("http://", "https://")):
        return "unsupported image URL"
    try:
        req = Request(url, method="HEAD", headers={"User-Agent": "HomeProjectWise-QA/1.0"})
        with urlopen(req, timeout=12) as r:
            if r.status >= 400:
                return f"image HTTP {r.status}"
    except HTTPError as e:
        return f"image HTTP {e.code}"
    except URLError as e:
        return f"image request failed: {e.reason}"
    except Exception as e:
        return f"image request failed: {e}"
    return None

def check(path: Path, recent_ids: set[str]) -> list[str]:
    html = path.read_text(encoding="utf-8")
    text = visible_text(html)
    words = len(re.findall(r"\b[\w’'-]+\b", text))
    h2 = len(re.findall(r"<h2\b", html, flags=re.I))
    images = len(image_urls(html))
    faq = len(re.findall(r"<h3\b", html, flags=re.I))
    links = internal_links(html)
    ids = image_ids(html)
    failures = []

    # Adaptive depth: concise articles can pass, but thin pages cannot.
    checks = [
        (words >= MIN_WORDS, f"article is too thin: {words} words (minimum {MIN_WORDS})"),
        (h2 >= (3 if words < 900 else MIN_H2), f"not enough sections: {h2} H2"),
        (images >= (2 if words < 900 else MIN_IMAGES), f"not enough useful visuals: {images} images"),
        (faq >= MIN_FAQ, f"not enough FAQ coverage: {faq} questions"),
        (links >= MIN_INTERNAL, f"not enough internal navigation: {links} links"),
    ]
    failures.extend(msg for ok, msg in checks if not ok)

    if len(ids) != len(set(ids)):
        failures.append("duplicate image inside article")
    repeated = sorted(set(ids) & recent_ids)
    if repeated:
        failures.append("image reused in one of the three most recent articles: " + ", ".join(repeated))

    if "application/ld+json" not in html or "BlogPosting" not in html:
        failures.append("missing BlogPosting JSON-LD")
    if "FAQPage" not in html:
        failures.append("missing FAQPage schema")
    if not re.search(r'<meta\s+name=["\']description["\']', html, re.I):
        failures.append("missing meta description")
    if not re.search(r"<h1\b", html, re.I):
        failures.append("missing H1")
    if not re.search(r"<img\b[^>]+alt=["\'][^"\']+", html, re.I):
        failures.append("images need descriptive alt text")

    # Catch broken remote images before they reach production.
    for url in image_urls(html):
        err = check_image_url(url)
        if err:
            failures.append(f"{err}: {url}")

    return failures

def article_files() -> list[Path]:
    return sorted(ARTICLES.glob("*.html"), key=lambda p: p.stat().st_mtime, reverse=True)

def changed_articles() -> list[Path]:
    try:
        out = subprocess.check_output(["git", "diff", "--name-only"], cwd=ROOT, text=True)
    except Exception:
        out = ""
    paths = [ROOT / p.strip() for p in out.splitlines()
             if p.strip().startswith("website/articles/") and p.strip().endswith(".html")]
    return [p for p in paths if p.exists()]

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true")
    args = ap.parse_args()

    for f in REQUIRED:
        if not (WEBSITE / f).exists():
            print(f"FAIL: missing website/{f}")
            return 1

    all_articles = article_files()
    recent_ids: set[str] = set()
    for p in all_articles[:3]:
        recent_ids.update(image_ids(p.read_text(encoding="utf-8")))

    targets = all_articles if args.all else changed_articles()
    if not targets:
        print("PASS: no changed article candidate; site structure is present.")
        return 0

    failed = False
    for path in targets:
        own_ids = set(image_ids(path.read_text(encoding="utf-8")))
        errors = check(path, recent_ids - own_ids)
        if errors:
            failed = True
            print(f"FAIL: {path.relative_to(ROOT)}")
            for e in errors:
                print(f"  - {e}")
        else:
            html = path.read_text(encoding="utf-8")
            words = len(re.findall(r"\b[\w’'-]+\b", visible_text(html)))
            print(f"PASS: {path.relative_to(ROOT)} | words={words} h2={len(re.findall(r'<h2\\b', html, re.I))} images={len(image_urls(html))} faq={len(re.findall(r'<h3\\b', html, re.I))} internal={internal_links(html)}")

    counts = {}
    for item in registry().get("used_photographers", []):
        name = item.get("name") if isinstance(item, dict) else item
        if name:
            counts[name] = counts.get(name, 0) + 1
    over = sorted(name for name, count in counts.items() if count > 3)
    if over:
        failed = True
        print("FAIL: photographer used more than 3 times: " + ", ".join(over))
    return 1 if failed else 0

if __name__ == "__main__":
    raise SystemExit(main())
