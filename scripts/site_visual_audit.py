#!/usr/bin/env python3
"""Check basic visual structure markers across the site's main pages and guides."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
WEBSITE = ROOT / "website"
ARTICLES = WEBSITE / "articles"


def main():
    issues = []
    required_pages = [WEBSITE / "index.html", WEBSITE / "guides.html"]
    article_pages = sorted(ARTICLES.glob("*.html")) if ARTICLES.is_dir() else []
    if not ARTICLES.is_dir():
        issues.append([str(ARTICLES), "missing-articles-directory"])

    for page in required_pages:
        if not page.is_file():
            issues.append([str(page), "missing-required-page"])

    pages = required_pages + article_pages
    files_checked = 0

    for page in pages:
        if not page.is_file():
            continue

        files_checked += 1
        source = page.read_text(encoding="utf-8", errors="ignore")
        is_article = page.parent == ARTICLES

        if not re.search(r'<meta[^>]+name=["\']viewport["\']', source, re.I):
            issues.append([str(page), "missing-viewport"])
        if page.parent == WEBSITE and not re.search(
            r'<link\b(?=[^>]*\brel=["\']stylesheet["\'])(?=[^>]*\bhref=["\']style\.css["\'])[^>]*>',
            source,
            re.I,
        ):
            issues.append([str(page), "missing-shared-style"])
        # Current article templates use semantic structure, not the legacy
        # article-hero/article-image class names. Check the real markup instead.
        if is_article and not re.search(
            r'<main\b[^>]*class=["\'][^"\']*\barticle\b[^"\']*["\']',
            source,
            re.I,
        ):
            issues.append([str(page), "missing-article-main"])
        if is_article and not re.search(
            r'<figure\b[^>]*>\s*<img\b[^>]*\bsrc=["\'][^"\']+["\']',
            source,
            re.I | re.S,
        ):
            issues.append([str(page), "missing-figure-image"])
        if "HomeProjectWise" not in source:
            issues.append([str(page), "missing-brand"])

    report = {
        "status": "fail" if issues else "pass",
        "issues": issues,
        "files_checked": files_checked,
    }
    (ROOT / "data/site_visual_audit.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8"
    )
    print(
        "Visual structure audit:",
        "FAIL" if issues else "PASS",
        "| files checked=",
        files_checked,
        "| issues=",
        len(issues),
    )
    return 1 if issues else 0


if __name__ == "__main__":
    raise SystemExit(main())
