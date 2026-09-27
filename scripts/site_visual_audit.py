#!/usr/bin/env python3
from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parents[1];W=ROOT/'website';A=W/'articles'
def main():
 issues=[]
 for p in [W/'index.html',W/'guides.html',*sorted(A.glob('*.html'))]:
  if not p.exists():continue
  t=p.read_text(encoding='utf-8',errors='ignore')
  if not re.search(r'<meta[^>]+name=["\']viewport["\']',t,re.I):issues.append([str(p),'missing-viewport'])
  if '<link rel="stylesheet" href="style.css">' not in t and p.parent==W: issues.append([str(p),'missing-shared-style'])
  if p.parent==A and 'article-hero' not in t: issues.append([str(p),'missing-article-hero'])
  if p.parent==A and re.search(r'<img\b[^>]+src=["\'][^"\']+["\'][^>]*>',t,re.I) and 'article-image' not in t:issues.append([str(p),'article-image-class-missing'])
  if 'HomeProjectWise' not in t:issues.append([str(p),'missing-brand'])
 (ROOT/'data/site_visual_audit.json').write_text(json.dumps({'status':'fail' if issues else 'pass','issues':issues,'files_checked':1+len(list(A.glob('*.html')))},indent=2)+'\n',encoding='utf-8');print('Visual structure audit:', 'FAIL' if issues else 'PASS', '| issues=',len(issues));return 1 if issues else 0
if __name__=='__main__':raise SystemExit(main())
