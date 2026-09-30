#!/usr/bin/env python3
from __future__ import annotations
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; ARTICLES=ROOT/'website/articles'; OUT=ROOT/'data/editorial_repair_queue.json'
TOPIC_WORDS={
 'make-bedroom-more-restful':('bedroom','bed','lamp','clothes','wardrobe','walking'),
 'calm-room':('room','light','lamp','storage','walking','clutter'),
 'entryway-drop-zone':('entryway','hallway','keys','shoes','bag','coat','hook'),
 'quiet-entryway-storage':('entryway','hallway','keys','shoes','bag','coat','hook'),
 'stop-musty-bathroom-towels':('towel','bathroom','dry','washing','ventilation','shower'),
 'reduce-bathroom-condensation':('bathroom','window','fan','ventilation','moisture','condensation'),
}
BANNED_VISUAL_TERMS={'luxury','designer','showroom','spa','marble','hotel','resort'}
def clean(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s)).strip()
def words(s): return len(re.findall(r"\b[\w’'-]+\b",clean(s)))
def main():
 rows=[]
 for p in sorted(ARTICLES.glob('*.html')):
  t=p.read_text(encoding='utf-8',errors='ignore');title=re.search(r'<title>(.*?)</title>',t,re.I|re.S);body=re.search(r'<main.*?</main>',t,re.I|re.S);imgs=re.findall(r'<img\b[^>]*src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\']',t,re.I);hs=re.findall(r'<h2\b[^>]*>(.*?)</h2>',t,re.I|re.S);issues=[]
  if not body: rows.append({'slug':p.stem,'priority':'critical','issues':['missing-main-content']});continue
  text=clean(body.group(0))
  if words(text)<900: issues.append('thin-content')
  if len(hs)<4: issues.append('weak-structure')
  if len(imgs)<3: issues.append('insufficient-images')
  if len(set(x[0].split('?')[0] for x in imgs))<len(imgs): issues.append('duplicate-images-inside-article')
  if not re.search(r'<ol\b|<ul\b',t,re.I): issues.append('missing-actionable-list')
  if not re.search(r'<h3\b.*?</h3>\s*<p\b',t,re.I|re.S): issues.append('missing-faq-or-answer-blocks')
  topic=TOPIC_WORDS.get(p.stem,())
  for src,alt in imgs:
   a=alt.strip().lower()
   if not a or a in {'image','photo','home','house'}: issues.append('weak-image-alt')
   if any(term in a for term in BANNED_VISUAL_TERMS): issues.append('luxury-or-showroom-image')
   if topic and not any(term in a for term in topic): issues.append('image-topic-mismatch')
  if issues: rows.append({'slug':p.stem,'title':clean(title.group(1)) if title else p.stem,'priority':'high' if len(issues)>=2 else 'medium','issues':sorted(set(issues)),'image_count':len(imgs)})
 OUT.write_text(json.dumps({'version':2,'purpose':'repair existing library before new publishing','visual_rule':'images must show the practical problem, solution or ordinary context described by the adjacent section; luxury/showroom imagery is blocked','count':len(rows),'articles':rows},ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(f'Editorial repair audit: {len(rows)} articles require review');return 0
if __name__=='__main__':raise SystemExit(main())
