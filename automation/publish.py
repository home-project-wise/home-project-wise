#!/usr/bin/env python3
from __future__ import annotations
import json,re
from datetime import datetime,timezone
from html import escape
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; QUEUE=ROOT/'content/queue'; ARTICLES=ROOT/'website/articles'; WEBSITE=ROOT/'website'; REGISTRY=ROOT/'data/used_images.json'; PENDING=ROOT/'data/pending_publications.json'; BASE='https://home-project-wise.github.io/home-project-wise'
GOAT='<script data-goatcounter="https://homeprojectwise.goatcounter.com/count" async src="//gc.zgo.at/count.v5.js" crossorigin="anonymous" integrity="sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYelFmeR6EmLP5bYeoRVQ"></script>'
def image_key(url):
    m=re.search(r'photo-([A-Za-z0-9_-]+)',url); return m.group(1) if m else url.split('?')[0]
def load_registry():
    if not REGISTRY.exists(): return {'used_ids':[],'used_urls':[],'used_photographers':[]}
    try: return json.loads(REGISTRY.read_text(encoding='utf-8'))
    except Exception: return {'used_ids':[],'used_urls':[],'used_photographers':[]}
def recent_image_ids(limit=3):
    ids=set()
    for p in sorted(ARTICLES.glob('*.html'),key=lambda x:x.stat().st_mtime,reverse=True)[:limit]:
        ids.update(image_key(u) for u in re.findall(r'<img\b[^>]+src=["\']([^"\']+)["\']',p.read_text(encoding='utf-8'),re.I))
    return ids
def normalise_images(d): return d.get('images') or [{'url':d['image'],'alt':d.get('image_alt','Useful home project detail'),'caption':''}]
def faq_from_body(body):
    return [{'@type':'Question','name':re.sub('<[^>]+>','',m.group(1)).strip(),'acceptedAnswer':{'@type':'Answer','text':re.sub('<[^>]+>','',m.group(2)).strip()}} for m in re.finditer(r'<h3>(.*?)</h3>\s*<p>(.*?)</p>',body,re.S|re.I)]
def render_article(d):
    slug=d['slug']; title=escape(d['title']); desc=escape(d['description']); url=f'{BASE}/articles/{slug}.html'; images=normalise_images(d); hero=images[0]
    gallery=''.join('<figure class="article-figure"><img class="article-image" src="'+escape(i['url'],quote=True)+'" alt="'+escape(i.get('alt','Useful home project detail'),quote=True)+'" loading="lazy"><figcaption>'+escape(i.get('caption',''),quote=False)+'</figcaption></figure>' for i in images[1:])
    faq=faq_from_body(d['body_html']); schemas=[{'@context':'https://schema.org','@type':'BlogPosting','headline':d['title'],'description':d['description'],'mainEntityOfPage':{'@type':'WebPage','@id':url},'datePublished':d['publish_at'],'dateModified':d['publish_at'],'image':[i['url'] for i in images],'articleSection':d.get('category','Home Projects'),'author':{'@type':'Organization','name':'HomeProjectWise Editorial Team'},'publisher':{'@type':'Organization','name':'HomeProjectWise'}},{'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':f'{BASE}/'},{'@type':'ListItem','position':2,'name':'Guides','item':f'{BASE}/guides.html'},{'@type':'ListItem','position':3,'name':d['title'],'item':url}]}]
    if faq: schemas.append({'@context':'https://schema.org','@type':'FAQPage','mainEntity':faq})
    schema_html=''.join(f'<script type="application/ld+json">{json.dumps(s,ensure_ascii=False)}</script>' for s in schemas)
    footer='<footer><div class="brand"><img class="brand-logo-footer" src="../logo.svg" alt="HomeProjectWise"></div><nav><a href="../">Home</a><a href="../guides.html">Categories</a><a href="../about.html">About</a><a href="../editorial-policy.html">Editorial Policy</a><a href="../privacy.html">Privacy</a><a href="../terms.html">Terms</a><a href="../contact.html">Contact</a></nav><p>Better decisions. Better projects. A better home.</p></footer>'
    html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="'+desc+'"><link rel="canonical" href="'+url+'"><link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="../feed.xml"><link rel="icon" href="../favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="../style.css">'+GOAT+schema_html+'<title>'+title+' | HomeProjectWise</title></head><body><header class="nav"><a class="brand" href="../"><img class="brand-logo" src="../logo.svg" alt="HomeProjectWise"></a><nav><a href="../#projects">Projects</a><a href="../guides.html">Guides</a><a href="../#ideas">Ideas</a><a href="../about.html">About</a></nav></header><main class="section"><p class="eyebrow">'+escape(d.get('category','HOME PROJECTS'))+'</p><h1>'+title+'</h1><p class="lead">'+desc+'</p><figure class="article-figure article-hero-wrap"><img class="article-hero" src="'+escape(hero['url'],quote=True)+'" alt="'+escape(hero.get('alt','Useful home project detail'),quote=True)+'" loading="eager"><figcaption>'+escape(hero.get('caption',''),quote=False)+'</figcaption></figure>'+d['body_html']+gallery+'<p><a class="text-link" href="../guides.html">← Explore more HomeProjectWise guides</a></p></main>'+footer+'</body></html>'
    (ARTICLES/f'{slug}.html').write_text(html,encoding='utf-8')
def read_rows():
    rows=[]
    for p in ARTICLES.glob('*.html'):
        t=p.read_text(encoding='utf-8'); m=re.search(r'<meta name="description" content="([^"]*)"',t); q=re.search(r'<title>(.*?)</title>',t,re.S); im=re.search(r'<img[^>]+src="([^"]+)"[^>]+alt="([^"]*)"',t)
        if m and q:
            title=re.sub(r'\s*[|—-]\s*HomeProjectWise.*$','',re.sub('<[^>]+>','',q.group(1))).strip(); rows.append((p.stem,title,m.group(1),im.group(1) if im else '',im.group(2) if im else 'Useful home project detail'))
    return sorted(rows,key=lambda x:x[0],reverse=True)
def rebuild_indexes(rows):
    cards=''.join(f'<article class="card"><div class="card-body"><span class="tag">GUIDE</span><h3>{escape(t)}</h3><p>{escape(desc)}</p><a href="articles/{s}.html">Read the guide →</a></div></article>' for s,t,desc,_,_ in rows); footer='<footer><div class="brand"><img class="brand-logo-footer" src="logo.svg" alt="HomeProjectWise"></div><nav><a href="./">Home</a><a href="./guides.html">Categories</a><a href="./about.html">About</a><a href="./editorial-policy.html">Editorial Policy</a><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="./contact.html">Contact</a></nav><p>Better decisions. Better projects. A better home.</p></footer>'
    (WEBSITE/'guides.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Practical HomeProjectWise guides for real home problems, projects and smart-home decisions."><link rel="canonical" href="https://home-project-wise.github.io/home-project-wise/guides.html"><link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="feed.xml"><link rel="stylesheet" href="style.css">'+GOAT+'<title>Guides — HomeProjectWise</title></head><body><header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise"></a></header><main class="section"><p class="eyebrow">THE GUIDE LIBRARY</p><h1>Useful answers for real home problems.</h1><div class="cards">'+cards+'</div></main>'+footer+'</body></html>',encoding='utf-8')
    urls=[BASE+'/',BASE+'/guides.html',BASE+'/about.html',BASE+'/editorial-policy.html',BASE+'/privacy.html',BASE+'/terms.html',BASE+'/contact.html']+[BASE+'/articles/'+s+'.html' for s,_,_,_,_ in rows]; (WEBSITE/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+u+'</loc></url>' for u in urls)+'</urlset>',encoding='utf-8')
    items=''.join(f'<item><title>{escape(t)}</title><link>{BASE}/articles/{s}.html</link><description>{escape(desc)}</description></item>' for s,t,desc,_,_ in rows[:20]); (WEBSITE/'feed.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HomeProjectWise</title><link>'+BASE+'/</link><description>Practical home projects, smart-home ideas and useful guides.</description>'+items+'</channel></rss>',encoding='utf-8')
def rebuild_home(rows):
    p=WEBSITE/'index.html'; html=p.read_text(encoding='utf-8'); cards=''.join(f'<article class="card featured"><img src="{escape(img,quote=True)}" alt="{escape(alt,quote=True)}"><div class="card-body"><span class="tag">NEW · GUIDE</span><h3>{escape(t)}</h3><p>{escape(desc)}</p><a href="articles/{s}.html">Read the guide →</a></div></article>' for s,t,desc,img,alt in rows[:3]); pattern=r'<section id="guides" class="section">.*?</section>'; replacement='<section id="guides" class="section"><div class="section-head"><div><p class="eyebrow">THE LATEST</p><h2>Things worth knowing before you start.</h2></div><a href="guides.html">All guides →</a></div><div class="cards">'+cards+'</div></section>'; new,n=re.subn(pattern,replacement,html,count=1,flags=re.S)
    if n!=1: raise RuntimeError('Could not update THE LATEST section safely')
    p.write_text(new,encoding='utf-8')
def main():
    registry=load_registry(); used=set(registry.get('used_ids',[])); recent=recent_image_ids(); items=[]
    for p in QUEUE.glob('*.json'):
        try:
            d=json.loads(p.read_text(encoding='utf-8')); d['_path']=p; d['_dt']=datetime.fromisoformat(d['publish_at'].replace('Z','+00:00')); items.append(d)
        except Exception as e: print('Skipping',p,e)
    due=sorted((x for x in items if x['_dt']<=datetime.now(timezone.utc)),key=lambda x:x['_dt'])
    if not due: print('No due article in queue.'); return 0
    staged=[]
    for d in due:
        if (ARTICLES/f'{d["slug"]}.html').exists(): raise RuntimeError('Refusing duplicate slug: '+d['slug'])
        images=normalise_images(d); keys=[image_key(i['url']) for i in images]
        if len(keys)!=len(set(keys)): raise RuntimeError('Duplicate image inside queue item: '+d['slug'])
        blocked=sorted(set(keys)&(used|recent))
        if blocked: raise RuntimeError(f'Refusing recently used image(s) for {d["slug"]}: {", ".join(blocked)}')
        render_article(d); used.update(keys); registry.setdefault('used_ids',[]).extend(keys); registry.setdefault('used_urls',[]).extend(i['url'].split('?')[0] for i in images)
        staged.append({'slug':d['slug'],'scheduled_time':d['publish_at'],'staged_time':datetime.now(timezone.utc).isoformat(),'status':'staged','url':f'{BASE}/articles/{d["slug"]}.html','image_count':len(images)})
    rows=read_rows(); rebuild_indexes(rows); rebuild_home(rows); REGISTRY.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); PENDING.write_text(json.dumps(staged,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print('Staged due articles:',', '.join(x['slug'] for x in staged),'| total articles:',len(rows)); return 0
if __name__=='__main__': raise SystemExit(main())
