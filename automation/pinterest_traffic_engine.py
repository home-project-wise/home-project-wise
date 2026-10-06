#!/usr/bin/env python3
from __future__ import annotations
import json, os, re, urllib.request, urllib.error
from pathlib import Path
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = ROOT / "website" / "articles"
STATE = ROOT / "data" / "pinterest_published.json"
BASE = "https://home-project-wise.github.io/home-project-wise"

TOKEN = os.environ.get("PINTEREST_ACCESS_TOKEN", "").strip()
BOARD_ID = os.environ.get("PINTEREST_BOARD_ID", "").strip()
LIMIT = max(1, min(int(os.environ.get("PINTEREST_DAILY_LIMIT", "2")), 3))

def clean(s):
    return re.sub(r"\s+", " ", unescape(re.sub("<[^>]+>", " ", s or ""))).strip()

def article_rows():
    rows = []
    for p in ARTICLES.glob("*.html"):
        t = p.read_text(encoding="utf-8", errors="ignore")
        title = re.search(r"<title>(.*?)</title>", t, re.S | re.I)
        desc = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', t, re.I)
        img = re.search(r'<img[^>]+(?:class="[^"]*article-hero[^"]*"|class="[^"]*article-image[^"]*")[^>]+src="([^"]+)"', t, re.I)
        if not (title and desc and img):
            continue
        title_text = re.sub(r"\s*[|—-]\s*HomeProjectWise.*$", "", clean(title.group(1))).strip()
        src = img.group(1)
        if src.startswith("../"):
            image_url = BASE + "/" + src[3:]
        elif src.startswith("/"):
            image_url = BASE + src
        else:
            image_url = BASE + "/articles/" + src
        rows.append({
            "slug": p.stem,
            "title": title_text[:100],
            "description": clean(desc.group(1))[:450],
            "link": f"{BASE}/articles/{p.stem}.html",
            "image_url": image_url,
        })
    return sorted(rows, key=lambda x: x["slug"], reverse=True)

def load_state():
    if not STATE.exists():
        return {}
    try:
        return json.loads(STATE.read_text(encoding="utf-8"))
    except Exception:
        return {}

def create_pin(row):
    payload = {
        "board_id": BOARD_ID,
        "title": row["title"],
        "description": row["description"] + " | Affiliate disclosure: this Pin may contain monetized links.",
        "link": row["link"],
        "media_source": {"source_type": "image_url", "url": row["image_url"], "is_standard": True},
    }
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        "https://api.pinterest.com/v5/pins",
        data=data,
        headers={"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def main():
    if not TOKEN or not BOARD_ID:
        print("Pinterest automation is safely idle: PINTEREST_ACCESS_TOKEN and/or PINTEREST_BOARD_ID is not configured.")
        print("No site files or Pins were changed.")
        return 0
    state = load_state()
    candidates = [r for r in article_rows() if r["slug"] not in state]
    if not candidates:
        print("Pinterest automation: no new eligible articles.")
        return 0
    selected = candidates[:LIMIT]
    for row in selected:
        try:
            result = create_pin(row)
            pin_id = result.get("id", "")
            state[row["slug"]] = {"pin_id": pin_id, "url": row["link"]}
            print(f"PIN_CREATED slug={row['slug']} pin_id={pin_id}")
        except urllib.error.HTTPError as e:
            body = e.read().decode(errors="replace")
            print(f"PIN_FAILED slug={row['slug']} http={e.code} body={body[:500]}")
        except Exception as e:
            print(f"PIN_FAILED slug={row['slug']} error={e}")
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
