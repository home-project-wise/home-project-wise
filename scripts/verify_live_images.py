#!/usr/bin/env python3
"""Verify every article image against the deployed public site."""
from __future__ import annotations
import html
import re
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = ROOT / "website" / "articles"
TIMEOUT = 25
RETRIES = 3
UA = "HomeProjectWise-LiveImageAudit/1.0"

def request_status(url: str) -> int:
    last = None
    for attempt in range(1, RETRIES + 1):
        try:
            req = Request(url, headers={"User-Agent": UA, "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"})
            with urlopen(req, timeout=TIMEOUT) as response:
                return int(getattr(response, "status", 200))
        except HTTPError as exc:
            last = exc.code
            if exc.code in {429, 500, 502, 503, 504} and attempt < RETRIES:
                time.sleep(2 * attempt)
                continue
            return int(exc.code)
        except (URLError, TimeoutError, OSError) as exc:
            last = exc
            if attempt < RETRIES:
                time.sleep(2 * attempt)
                continue
    return int(last) if isinstance(last, int) else 599

def main() -> int:
    if len(sys.argv) != 2:
        print("usage: verify_live_images.py <deployed-base-url>", file=sys.stderr)
        return 2
    base = sys.argv[1].rstrip("/") + "/"
    pages = sorted(ARTICLES.glob("*.html"))
    if len(pages) != 16:
        print(f"ERROR: expected 16 article HTML files, found {len(pages)}", file=sys.stderr)
        return 1
    cache = {}
    total = local = unsplash = broken = 0
    print("| # | Article | Images | Local | Unsplash | 404 | Status |")
    print("|---:|---|---:|---:|---:|---:|---|")
    for idx, path in enumerate(pages, 1):
        text = path.read_text(encoding="utf-8")
        srcs = [html.unescape(x) for x in re.findall(r'<img\\b[^>]*\\bsrc=["\\\']([^"\\\']+)["\\\']', text, re.I)]
        local_n = sum(x.startswith("/images/") for x in srcs)
        unsplash_n = sum("images.unsplash.com" in x.lower() for x in srcs)
        bad = 0
        for src in srcs:
            url = base + src.lstrip("/") if src.startswith("/") else src
            if url not in cache:
                cache[url] = request_status(url)
            if cache[url] != 200:
                bad += 1
        total += len(srcs); local += local_n; unsplash += unsplash_n; broken += bad
        state = "OK" if bad == 0 else "BROKEN"
        print(f"| {idx} | {path.stem} | {len(srcs)} | {local_n} | {unsplash_n} | {bad} | {state} |")
        if bad:
            for src in srcs:
                url = base + src.lstrip("/") if src.startswith("/") else src
                if cache[url] != 200:
                    print(f"  BROKEN: {src} -> HTTP {cache[url]}", file=sys.stderr)
    print(f"SUMMARY: articles=16 images={total} local={local} unsplash={unsplash} broken={broken} unique_checked={len(cache)}")
    return 1 if broken else 0

if __name__ == "__main__":
    raise SystemExit(main())
