#!/usr/bin/env python3
"""Download the five Pinterest hero images into the site build.

The script is intentionally dependency-free and safe to run in GitHub Actions.
It skips valid existing files, uses an explicit bot user-agent, retries a smaller
Unsplash rendition on failure, and refuses to leave a partial file behind.
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "data" / "pinterest_heroes.json"
DEST = ROOT / "website" / "images" / "pinterest"
USER_AGENT = "PinterestBot/1.0 (+https://home-project-wise.github.io/home-project-wise/)"
TIMEOUT = 30
RETRIES = 2


def valid_jpeg(path: Path) -> bool:
    try:
        with path.open("rb") as f:
            return f.read(3) == b"\xff\xd8\xff"
    except OSError:
        return False


def download(url: str, target: Path) -> bool:
    tmp = target.with_suffix(target.suffix + ".part")
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "image/jpeg"})
    for attempt in range(1, RETRIES + 1):
        try:
            print(f"[Pinterest images] GET {url} (attempt {attempt}/{RETRIES})", flush=True)
            with urlopen(request, timeout=TIMEOUT) as response:
                status = getattr(response, "status", 200)
                content_type = response.headers.get("Content-Type", "")
                data = response.read()
            if status != 200:
                raise RuntimeError(f"HTTP {status}")
            if not data.startswith(b"\xff\xd8\xff"):
                raise RuntimeError(f"unexpected image payload ({content_type or 'unknown content-type'})")
            tmp.write_bytes(data)
            tmp.replace(target)
            print(f"[Pinterest images] OK {target} ({len(data):,} bytes)", flush=True)
            return True
        except (HTTPError, URLError, TimeoutError, RuntimeError, OSError) as exc:
            print(f"[Pinterest images] FAIL: {exc}", file=sys.stderr, flush=True)
            tmp.unlink(missing_ok=True)
            if attempt < RETRIES:
                time.sleep(2)
    return False


def main() -> int:
    if not CONFIG.is_file():
        print(f"[Pinterest images] Missing config: {CONFIG}", file=sys.stderr)
        return 1

    DEST.mkdir(parents=True, exist_ok=True)
    config = json.loads(CONFIG.read_text(encoding="utf-8"))
    images = config.get("images", [])
    if len(images) != 5:
        print(f"[Pinterest images] Expected 5 entries, found {len(images)}", file=sys.stderr)
        return 1

    failures = []
    for item in images:
        name = item["name"]
        target = DEST / name
        if target.exists() and valid_jpeg(target) and target.stat().st_size > 10_000:
            print(f"[Pinterest images] KEEP {target} ({target.stat().st_size:,} bytes)")
            continue

        if not download(item["url"], target):
            print(f"[Pinterest images] Primary failed; trying fallback for {name}", flush=True)
            if not download(item["fallback_url"], target):
                failures.append(name)

    if failures:
        print("[Pinterest images] FAILED: " + ", ".join(failures), file=sys.stderr)
        return 1

    print("[Pinterest images] SUCCESS — all 5 local hero images are ready.")
    for item in images:
        p = DEST / item["name"]
        print(f"  - {p.relative_to(ROOT)} ({p.stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
