#!/usr/bin/env python3
from __future__ import annotations
import re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = ROOT / 'website' / 'articles'
THRESHOLD = 0.52

STOP = {'the','and','for','that','with','from','this','your','you','are','was','into','have','will','can','not','but','how','what','when','where','their','they','then','than','about','more','some','only','just','also','after','before','while','into','under','over','home','guide'}

def text(path: Path) -> str:
    s = path.read_text(encoding='utf-8')
    s = re.sub(r'<script\b[^>]*>.*?</script>', ' ', s, flags=re.I|re.S)
    s = re.sub(r'<style\b[^>]*>.*?</style>', ' ', s, flags=re.I|re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    return re.sub(r'\s+', ' ', s).strip().lower()

def tokens(s: str) -> list[str]:
    return [w for w in re.findall(r"[a-z][a-z0-9’'-]{2,}", s) if w not in STOP]

def shingles(words: list[str], n=5) -> set[tuple[str, ...]]:
    return {tuple(words[i:i+n]) for i in range(max(0, len(words)-n+1))}

def similarity(a: set, b: set) -> float:
    if not a or not b: return 0.0
    return len(a & b) / len(a | b)

def changed() -> list[Path]:
    try:
        out = subprocess.check_output(['git','diff','--name-only','HEAD^','HEAD'], cwd=ROOT, text=True)
        return [ROOT/x.strip() for x in out.splitlines() if x.strip().startswith('website/articles/') and x.strip().endswith('.html')]
    except Exception:
        return []

def main() -> int:
    args = [Path(x) for x in sys.argv[1:]]
    targets = [ROOT/x if not x.is_absolute() else x for x in args] if args else changed()
    targets = [p for p in targets if p.exists()]
    if not targets:
        print('SIMILARITY GATE: PASS | no changed article candidates')
        return 0
    corpus = {p: shingles(tokens(text(p))) for p in ARTICLES.glob('*.html')}
    failed = False
    for p in targets:
        a = corpus.get(p, shingles(tokens(text(p))))
        for other, b in corpus.items():
            if other == p: continue
            score = similarity(a, b)
            if score >= THRESHOLD:
                failed = True
                print(f'FAIL: {p.relative_to(ROOT)} is too similar to {other.relative_to(ROOT)} | 5-gram Jaccard={score:.3f}')
    if failed: return 1
    print(f'SIMILARITY GATE: PASS | checked={len(targets)} | threshold={THRESHOLD}')
    return 0

if __name__ == '__main__': raise SystemExit(main())
