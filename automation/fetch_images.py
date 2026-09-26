#!/usr/bin/env python3
"""Fetch diversified Unsplash images while enforcing the site image registry.

Requires UNSPLASH_ACCESS_KEY for live search. The script is deliberately fail-closed:
it will not return an image already recorded in data/used_images.json and will avoid
photographers already used three times in the registry.
"""
from __future__ import annotations
import json, os, sys
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "data" / "used_images.json"
MODIFIERS = ["bright", "airy", "soft", "muted", "simple", "minimal", "warm", "natural-light", "scandinavian", "japandi", "neutral-tones", "cozy", "modern", "rustic", "clean"]


def load_registry():
    if not REGISTRY.exists():
        return {"used_ids": [], "used_urls": [], "used_photographers": []}
    return json.loads(REGISTRY.read_text(encoding="utf-8"))


def save_registry(data):
    REGISTRY.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def photographer_counts(data):
    counts = {}
    for item in data.get("used_photographers", []):
        name = item.get("name") if isinstance(item, dict) else item
        if name:
            counts[name] = counts.get(name, 0) + 1
    return counts


def search_unsplash(query: str, per_page: int = 30):
    key = os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:
        raise SystemExit("UNSPLASH_ACCESS_KEY is required for live image search")
    url = "https://api.unsplash.com/search/photos?query=" + quote(query) + f"&per_page={per_page}&orientation=landscape"
    req = Request(url, headers={"Authorization": f"Client-ID {key}", "Accept-Version": "v1"})
    with urlopen(req, timeout=30) as response:
        return json.load(response).get("results", [])


def choose(topic: str, modifier: str, data: dict):
    if modifier not in MODIFIERS:
        raise SystemExit(f"Unknown modifier: {modifier}")
    query = f"{topic} {modifier.replace('-', ' ')}"
    counts = photographer_counts(data)
    for photo in search_unsplash(query):
        photo_id = photo.get("id", "")
        photographer = (photo.get("user") or {}).get("name", "")
        raw = ((photo.get("urls") or {}).get("regular") or "").split("?")[0]
        if not photo_id or not raw:
            continue
        if photo_id in data.get("used_ids", []) or raw in data.get("used_urls", []):
            continue
        if photographer and counts.get(photographer, 0) >= 3:
            continue
        url = raw + "?auto=format&fit=crop&w=1400&q=82"
        data.setdefault("used_ids", []).append(photo_id)
        data.setdefault("used_urls", []).append(raw)
        if photographer:
            data.setdefault("used_photographers", []).append({"name": photographer, "photo_id": photo_id})
        save_registry(data)
        return {"id": photo_id, "url": url, "photographer": photographer, "query": query, "alt": f"{topic} — {modifier.replace('-', ' ')}"}
    raise SystemExit(f"No unused image found for query: {query}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: fetch_images.py '<topic>' '<modifier>'")
    print(json.dumps(choose(sys.argv[1], sys.argv[2], load_registry()), ensure_ascii=False, indent=2))
