#!/usr/bin/env python3
import json,re
from datetime import datetime,timezone
from html import escape
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; QUEUE=ROOT/'content/queue'; ARTICLES=ROOT/'website/articles'; WEBSITE=ROOT/'website'
BASE='https://home-project-wise.github.io/home-project-wise'
GOAT='<script data-goatcounter="https://homeprojectwise.goatcounter.com/count" async src="//gc.zgo.at/count.v5.js" crossorigin="anonymous" integrity="sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYelFmeR6EmLP5bYeoRVQ"></script>'
def main():
 items=[]
 for p in QUEUE.glob('*.json'):
  try:
   d=json.loads(p.read_text(encoding='utf-8')); d['_path']=p; d['_dt']=datetime.fromisoformat(d['publish_at'].replace('Z','+00:00')); items.append(d)
  except Exception as e: print('Skipping',p,e)
 due=sorted([x for x in items if x['_dt']<=datetime.now(timezone.utc)],key=lambda x:x['_dt'])
 if not due: print('No due article in queue.'); return
 d=due[0]; slug=d['slug']; title=escape(d['title']); desc=escape(d['description']); url=BASE+'/articles/'+slug+'.html'
 footer='<footer><div class="brand"><span class="mark">H</span><span>HomeProjectWise</span></div><nav><a href="../">Home</a><a href="../guides.html">Categories</a><a href="../about.html">About</a><a href="../editorial-policy.html">Editorial Policy</a><a href="../privacy.html">Privacy</a><a href="../terms.html">Terms</a><a href="../contact.html">Contact</a></nav></footer>'
 html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="'+desc+'"><link rel="canonical" href="'+url+'"><link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="../feed.xml"><link rel="stylesheet" href="../style.css">'+GOAT+'<title>'+title+' | HomeProjectWise</title></head><body><header class="nav"><a class="brand" href="../"><span class="mark">H</span><span>HomeProjectWise</span></a><nav><a href="../#projects">Projects</a><a href="../guides.html">Guides</a><a href="../#ideas">Ideas</a><a href="../about.html">About</a></nav></header><main class="section"><p class="eyebrow">'+escape(d['category'])+'</p><h1>'+title+'</h1><p class="lead">'+desc+'</p><img class="article-hero" src="'+escape(d['image'],quote=True)+'" alt="'+escape(d.get('image_alt','Home improvement project'),quote=True)+'" loading="eager">'+d['body_html']+'<p><a class="text-link" href="../guides.html">← Explore more HomeProjectWise guides</a></p></main>'+footer+'</body></html>'
 (ARTICLES/(slug+'.html')).write_text(html,encoding='utf-8'); d['_path'].unlink()
 rows=[]
 for p in ARTICLES.glob('*.html'):
  t=p.read_text(encoding='utf-8'); m=re.search(r'<meta name="description" content="([^"]*)"',t); q=re.search(r'<title>(.*?)</title>',t,re.S)
  if m and q: rows.append((p.stem,re.sub(r'\s*[|—-]\s*HomeProjectWise.*$','',re.sub('<[^>]+>','',q.group(1))).strip(),m.group(1)))
 rows.sort(reverse=True)
 cards=''.join('<article class="card"><div class="card-body"><span class="tag">GUIDE</span><h3>'+escape(t)+'</h3><p>'+escape(desc)+'</p><a href="articles/'+s+'.html">Read the guide →</a></div></article>' for s,t,desc in rows)
 (WEBSITE/'guides.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Practical HomeProjectWise guides for real home problems, projects and smart-home decisions."><link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="feed.xml"><link rel="stylesheet" href="style.css">'+GOAT+'<title>Guides — HomeProjectWise</title></head><body><header class="nav"><a class="brand" href="./"><span class="mark">H</span><span>HomeProjectWise</span></a></header><main class="section"><p class="eyebrow">THE GUIDE LIBRARY</p><h1>Useful answers for real home problems.</h1><div class="cards">'+cards+'</div></main>'+footer.replace('../','./')+'</body></html>',encoding='utf-8')
 urls=[BASE+'/',BASE+'/guides.html',BASE+'/about.html',BASE+'/editorial-policy.html',BASE+'/privacy.html',BASE+'/terms.html',BASE+'/contact.html']+[BASE+'/articles/'+s+'.html' for s,_,_ in rows]
 (WEBSITE/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+u+'</loc></url>' for u in urls)+'</urlset>',encoding='utf-8')
 itemsxml=''.join('<item><title>'+escape(t)+'</title><link>'+BASE+'/articles/'+s+'.html</link><description>'+escape(desc)+'</description></item>' for s,t,desc in rows[:20])
 (WEBSITE/'feed.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HomeProjectWise</title><link>'+BASE+'/</link><description>Practical home projects, smart-home ideas and useful guides.</description>'+itemsxml+'</channel></rss>',encoding='utf-8')
 print('Published:',slug)
if __name__=='__main__': main()