#!/usr/bin/env python3
"""Publish the newest HomeProjectWise article to Pinterest.

The GitHub Actions workflow refreshes the short-lived Pinterest access token
from the continuous refresh token before this script is executed.
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

API = "https://api.pinterest.com/v5"

def api(token, method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = Request(API + path, data=data, headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }, method=method)
    try:
        with urlopen(req, timeout=30) as r:
            raw = r.read().decode()
            return r.status, json.loads(raw) if raw else {}
    except HTTPError as e:
        raw = e.read().decode(errors="replace")
        try: payload = json.loads(raw)
        except Exception: payload = {"raw": raw}
        return e.code, payload

def fm(text, name):
    m = re.search(r"^" + re.escape(name) + r"\s*[:=]\s*(.*)$", text, re.M)
    if not m: return ""
    v = m.group(1).strip()
    if len(v) >= 2 and v[0] == v[-1] and v[0] in "'\"": v = v[1:-1]
    return v.strip()

def newest_post():
    candidates = []
    for root in ("content/posts", "content"):
        p = Path(root)
        if p.exists():
            candidates.extend(p.rglob("*.md"))
    candidates = [p for p in candidates if p.name.lower() not in ("_index.md", "index.md")]
    if not candidates: return None
    def key(p):
        t = p.read_text(encoding="utf-8")
        m = re.search(r"^date\s*[:=]\s*["']?([^"'\n]+)", t, re.M)
        return m.group(1).strip() if m else ""
    return sorted(candidates, key=key, reverse=True)[0]

def main():
    token = os.environ.get("PINTEREST_ACCESS_TOKEN")
    if not token: raise SystemExit("PINTEREST_ACCESS_TOKEN was not provided by the refresh step.")
    post = newest_post()
    if post is None: print("No post found; nothing to publish."); return
    text = post.read_text(encoding="utf-8")
    title, description, image = fm(text, "title"), fm(text, "description"), fm(text, "image")
    if not image: image = fm(text, "cover")
    if image.startswith("/"): image = "https://home-project-wise.github.io/home-project-wise" + image
    slug = post.stem
    link = "https://home-project-wise.github.io/home-project-wise/posts/" + slug + "/"
    if not title or not image: raise SystemExit("ERROR: Missing title or image in " + str(post))

    status, pins = api(token, "GET", "/pins?page_size=100")
    if status != 200: raise SystemExit("Pinterest read failed: " + json.dumps(pins))
    if any(p.get("link") == link for p in pins.get("items", [])):
        print("Pin already exists for " + link); return

    status, boards = api(token, "GET", "/boards?page_size=100")
    if status != 200: raise SystemExit("Could not list Pinterest boards: " + json.dumps(boards))
    items = boards.get("items", [])
    if not items: raise SystemExit("No Pinterest board is available.")
    preferred = [b for b in items if any(k in (b.get("name") or "").lower() for k in ("home", "organization", "decor", "storage"))]
    board = preferred[0] if preferred else items[0]

    payload = {"board_id": board["id"], "title": title[:100], "description": (description or title)[:800],
               "link": link, "media_source": {"source_type": "image_url", "url": image, "is_standard": True}}
    status, result = api(token, "POST", "/pins", payload)
    if status == 201: print("SUCCESS: Pinterest Pin created: " + str(result.get("id"))); return
    print(json.dumps(result, indent=2))
    raise SystemExit("ERROR: Pinterest Pin creation failed.")

if __name__ == "__main__": main()
