#!/usr/bin/env python3
from __future__ import annotations
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; ARTICLES=ROOT/'website/articles'; OUT=ROOT/'data/editorial_repair_queue.json'
# Source of truth: published website/articles. The repository has no content/posts/*.md tree.
MIN_WORDS=900; MIN_H2=8; MIN_IMAGES=8
def clean(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s)).strip()
def words(s): return len(re.findall(r"\b[\w’'-]+\b",clean(s)))
def terms(s):
 stop={'with','from','that','this','your','home','guide','what','when','into','without','where','does','they','will','have','more','about','before','after'}
 return {w for w in re.findall(r'[a-z]{4,}',clean(s).lower()) if w not in stop}
def image_mismatch(t):
 parts=re.split(r'(<h2\b[^>]*>.*?</h2>)',t,flags=re.I|re.S); current=set(); seen=False
 for part in parts:
  if re.match(r'<h2\b',part,re.I): current=terms(part); seen=True; continue
  for block in re.findall(r'<figure\b.*?</figure>',part,re.I|re.S):
   if not seen: continue
   alt=re.search(r'\balt=["\']([^"\']+)["\']',block,re.I); cap=re.search(r'<figcaption>(.*?)</figcaption>',block,re.I|re.S)
   desc=terms((alt.group(1) if alt else '')+' '+(cap.group(1) if cap else ''))
   if current and not (desc & current): return True
 return False
def main():
 rows=[]
 for p in sorted(ARTICLES.glob('*.html')):
  t=p.read_text(encoding='utf-8',errors='ignore'); title=re.search(r'<title>(.*?)</title>',t,re.I|re.S); body=re.search(r'<main.*?</main>',t,re.I|re.S); imgs=re.findall(r'<img\b[^>]*src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\']',t,re.I); hs=re.findall(r'<h2\b[^>]*>(.*?)</h2>',t,re.I|re.S); issues=[]
  if not body: rows.append({'slug':p.stem,'priority':'critical','issues':['missing-main-content']}); continue
  if words(body.group(0))<MIN_WORDS: issues.append('thin-content')
  if len(hs)<MIN_H2: issues.append('weak-structure')
  if len(imgs)<MIN_IMAGES: issues.append('insufficient-images')
  if len(set(x[0].split('?')[0] for x in imgs))<len(imgs): issues.append('duplicate-images-inside-article')
  if not re.search(r'<ol\b|<ul\b',t,re.I): issues.append('missing-actionable-list')
  if len(re.findall(r'<h3\b',t,re.I))<4: issues.append('insufficient-faq')
  if len(re.findall(r'<a\b[^>]+href=["\'][^"\']+\.html["\']',t,re.I))<3: issues.append('insufficient-internal-links')
  if image_mismatch(t): issues.append('image-heading-mismatch')
  if any(not alt.strip() or alt.lower() in {'image','photo','home','house'} for _,alt in imgs): issues.append('weak-image-alt')
  if issues: rows.append({'slug':p.stem,'title':clean(title.group(1)) if title else p.stem,'priority':'high' if len(set(issues))>=2 else 'medium','issues':sorted(set(issues)),'word_count':words(body.group(0)),'h2_count':len(hs),'image_count':len(imgs)})
 OUT.write_text(json.dumps({'version':2,'purpose':'repair existing library before new publishing','count':len(rows),'articles':rows},ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print(f'Editorial repair audit v2: {len(rows)} articles require review')
if __name__=='__main__': main()
