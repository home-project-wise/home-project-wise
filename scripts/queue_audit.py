#!/usr/bin/env python3
from __future__ import annotations
import json, re
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / 'content' / 'queue'
REGISTRY = ROOT / 'data' / 'used_images.json'
ARTICLES = ROOT / 'website' / 'articles'

def image_id(url: str) -> str:
    m = re.search(r'photo-([A-Za-z0-9_-]+)', url)
    return m.group(1) if m else url.split('?')[0]

def visible_words(html: str) -> int:
    html = re.sub(r'<script\b[^>]*>.*?</script>', ' ', html, flags=re.I|re.S)
    html = re.sub(r'<style\b[^>]*>.*?</style>', ' ', html, flags=re.I|re.S)
    return len(re.findall(r"\b[\w’'-]+\b", re.sub(r'<[^>]+>', ' ', html)))

def main() -> int:
    registry = json.loads(REGISTRY.read_text(encoding='utf-8')) if REGISTRY.exists() else {}
    used = set(registry.get('used_ids', [])) | set(registry.get('used_urls', []))
    seen_queue: dict[str, str] = {}
    failures: list[str] = []
    now = datetime.now(timezone.utc)
    items = sorted(QUEUE.glob('*.json'))
    if not items:
        failures.append('queue is empty')
    for path in items:
        try:
            d = json.loads(path.read_text(encoding='utf-8'))
            when = datetime.fromisoformat(d['publish_at'].replace('Z', '+00:00'))
            slug = d['slug']
            if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
                failures.append(f'{path.name}: invalid slug {slug!r}')
            if (ARTICLES / f'{slug}.html').exists():
                failures.append(f'{path.name}: duplicate slug already published: {slug}')
            body = d.get('body_html', '')
            words = visible_words(body)
            h2 = len(re.findall(r'<h2\b', body, re.I))
            faq = len(re.findall(r'<h3\b', body, re.I))
            images = d.get('images') or []
            if words < 650:
                failures.append(f'{path.name}: thin queue article ({words} words)')
            if h2 < 3:
                failures.append(f'{path.name}: too few H2 sections ({h2})')
            if faq < 3:
                failures.append(f'{path.name}: too few FAQ questions ({faq})')
            if len(images) < 3:
                failures.append(f'{path.name}: too few images ({len(images)})')
            ids = [image_id(i.get('url','')) for i in images]
            if len(ids) != len(set(ids)):
                failures.append(f'{path.name}: duplicate image inside queue item')
            for raw, iid in zip((i.get('url','') for i in images), ids):
                if not raw.startswith(('https://images.unsplash.com/', 'https://images.pexels.com/')):
                    failures.append(f'{path.name}: unsupported image host: {raw}')
                if iid in used or raw.split('?')[0] in used:
                    failures.append(f'{path.name}: image already used: {iid}')
                if iid in seen_queue:
                    failures.append(f'{path.name}: image reused by queue item {seen_queue[iid]}: {iid}')
                else:
                    seen_queue[iid] = path.name
            if when <= now:
                failures.append(f'{path.name}: overdue queue item ({d["publish_at"]})')
        except Exception as exc:
            failures.append(f'{path.name}: invalid queue JSON/content: {exc}')
    if failures:
        print('QUEUE AUDIT: FAIL')
        for item in failures:
            print(' - ' + item)
        return 1
    print(f'QUEUE AUDIT: PASS | items={len(items)} | unique queued images={len(seen_queue)}')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
