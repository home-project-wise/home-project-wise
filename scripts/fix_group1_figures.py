#!/usr/bin/env python3
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'website/articles'
MARK='<!-- group1-closure-v1 -->'
FILES=['better-evening-home-lighting-without-overcomplicating-it.html','kitchen-counter-zone-that-stays-clear.html','quiet-entryway-storage.html','simple-home-reset-that-prevents-weekend-chaos.html']
for name in FILES:
    p=ART/name
    s=p.read_text(encoding='utf-8')
    if MARK not in s: continue
    head, tail=s.split(MARK,1)
    if '<h2>Frequently Asked Questions</h2>' not in tail: raise SystemExit(f'FAQ missing in {name}')
    middle, faq=tail.split('<h2>Frequently Asked Questions</h2>',1)
    middle=re.sub(r'<figure\\b.*?</figure>','',middle,flags=re.I|re.S)
    p.write_text(head+MARK+middle+'<h2>Frequently Asked Questions</h2>'+faq,encoding='utf-8')
print('Group 1 figure normalization complete.')
