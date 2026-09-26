#!/usr/bin/env python3
from __future__ import annotations
import re
from html import escape
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; WEBSITE=ROOT/'website'; ARTICLES=WEBSITE/'articles'; BASE='https://home-project-wise.github.io/home-project-wise'; GOAT='<script data-goatcounter="https://homeprojectwise.goatcounter.com/count" async src="//gc.zgo.at/count.v5.js" crossorigin="anonymous" integrity="sha384-atnOLvQb9t+jTSipvd75X2yginT4PjVbqDdlJAmxMm+wYelFmeR6EmLP5bYeoRVQ"></script>'
def rows():
    out=[]
    for p in ARTICLES.glob('*.html'):
        t=p.read_text(encoding='utf-8'); desc=re.search(r'<meta name="description" content="([^"]*)"',t); title=re.search(r'<title>(.*?)</title>',t,re.S); img=re.search(r'<img[^>]+src="([^"]+)"[^>]+alt="([^"]*)"',t)
        if desc and title:
            clean=re.sub(r'\s*[|—-]\s*HomeProjectWise.*$','',re.sub('<[^>]+>','',title.group(1))).strip(); out.append((p.stem,clean,desc.group(1),img.group(1) if img else '',img.group(2) if img else 'Home project guide'))
    return sorted(out,key=lambda x:x[0],reverse=True)
def main():
    r=rows(); cards=''.join(f'<article class="card"><div class="card-body"><span class="tag">GUIDE</span><h3>{escape(t)}</h3><p>{escape(d)}</p><a href="articles/{s}.html">Read the guide →</a></div></article>' for s,t,d,_,_ in r)
    footer='<footer><div class="brand"><img class="brand-logo-footer" src="logo.svg" alt="HomeProjectWise"></div><nav><a href="./">Home</a><a href="./guides.html">Categories</a><a href="./about.html">About</a><a href="./editorial-policy.html">Editorial Policy</a><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="./contact.html">Contact</a></nav><p>Better decisions. Better projects. A better home.</p></footer>'
    (WEBSITE/'guides.html').write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Practical HomeProjectWise guides for real home problems, projects and smart-home decisions."><link rel="canonical" href="'+BASE+'/guides.html"><link rel="alternate" type="application/rss+xml" title="HomeProjectWise RSS" href="feed.xml"><link rel="stylesheet" href="style.css">'+GOAT+'<title>Guides — HomeProjectWise</title></head><body><header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise"></a></header><main class="section"><p class="eyebrow">THE GUIDE LIBRARY</p><h1>Useful answers for real home problems.</h1><div class="cards">'+cards+'</div></main>'+footer+'</body></html>',encoding='utf-8')
    urls=[BASE+'/',BASE+'/guides.html',BASE+'/about.html',BASE+'/editorial-policy.html',BASE+'/privacy.html',BASE+'/terms.html',BASE+'/contact.html']+[BASE+'/articles/'+s+'.html' for s,_,_,_,_ in r]; (WEBSITE/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+u+'</loc></url>' for u in urls)+'</urlset>',encoding='utf-8')
    items=''.join(f'<item><title>{escape(t)}</title><link>{BASE}/articles/{s}.html</link><description>{escape(d)}</description></item>' for s,t,d,_,_ in r[:20]); (WEBSITE/'feed.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HomeProjectWise</title><link>'+BASE+'/</link><description>Practical home projects, smart-home ideas and useful guides.</description>'+items+'</channel></rss>',encoding='utf-8')
    p=WEBSITE/'index.html'; h=p.read_text(encoding='utf-8'); featured=''.join(f'<article class="card featured"><img src="{escape(i,quote=True)}" alt="{escape(a,quote=True)}"><div class="card-body"><span class="tag">NEW · GUIDE</span><h3>{escape(t)}</h3><p>{escape(d)}</p><a href="articles/{s}.html">Read the guide →</a></div></article>' for s,t,d,i,a in r[:3]); replacement='<section id="guides" class="section"><div class="section-head"><div><p class="eyebrow">THE LATEST</p><h2>Things worth knowing before you start.</h2></div><a href="guides.html">All guides →</a></div><div class="cards">'+featured+'</div></section>'; h,n=re.subn(r'<section id="guides" class="section">.*?</section>',replacement,h,count=1,flags=re.S)
    if n!=1: raise SystemExit('Could not rebuild homepage latest section safely')
    p.write_text(h,encoding='utf-8'); print(f'Rebuilt guides, sitemap, RSS and homepage from {len(r)} article files.')
if __name__=='__main__': main()
