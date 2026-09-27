#!/usr/bin/env python3
from __future__ import annotations
import re
from html import escape, unescape
from pathlib import Path
from datetime import datetime
ROOT=Path(__file__).resolve().parents[1]; WEBSITE=ROOT/"website"; ARTICLES=WEBSITE/"articles"; BASE="https://home-project-wise.github.io/home-project-wise"; GOAT='<script data-goatcounter="https://homeprojectwise.goatcounter.com/count" async src="//gc.zgo.at/count.v5.js" crossorigin="anonymous"></script>'

def article_date(text):
    for pat in (r'"datePublished"\s*:\s*"([^"]+)"',r'<meta[^>]+property=["\']article:published_time["\'][^>]+content=["\']([^"\']+)["\']'):
        m=re.search(pat,text,re.I)
        if m:
            try:return datetime.fromisoformat(m.group(1).replace("Z","+00:00"))
            except Exception:pass
    return datetime.min

def rows():
    out=[]
    for p in ARTICLES.glob("*.html"):
        t=p.read_text(encoding="utf-8",errors="ignore")
        desc=re.search(r'<meta name="description" content="([^"]*)"',t,re.I)
        title=re.search(r"<title>(.*?)</title>",t,re.S|re.I)
        img=re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]+alt=["\']([^"\']*)["\']',t,re.I)
        cat=re.search(r'<p class="eyebrow">([^<]+)</p>',t,re.I)
        if desc and title:
            clean=re.sub(r"\s*[|—-]\s*HomeProjectWise.*$","",re.sub("<[^>]+>","",title.group(1))).strip()
            out.append({"slug":p.stem,"title":unescape(clean),"description":unescape(desc.group(1)),"image":unescape(img.group(1)) if img else "","alt":unescape(img.group(2)) if img else "Useful home project guide","category":unescape(cat.group(1).strip()) if cat else "HOME PROJECTS","date":article_date(t)})
    return sorted(out,key=lambda x:(x["date"],x["slug"]),reverse=True)

def footer():
    return '<footer><div class="brand"><img class="brand-logo-footer" src="logo.svg" alt="HomeProjectWise"></div><nav><a href="./">Home</a><a href="./guides.html">Guides</a><a href="./about.html">About</a><a href="./editorial-policy.html">Editorial Policy</a><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="./contact.html">Contact</a></nav><p>Better decisions. Better projects. A better home.</p></footer>'

def card(x,featured=False):
    image=f'<img src="{escape(unescape(x["image"]),quote=True)}" alt="{escape(x["alt"],quote=True)}" loading="lazy">' if x["image"] else ""
    return f'<article class="card{" featured" if featured else ""}">{image}<div class="card-body"><span class="tag">{escape(x["category"])}</span><h3>{escape(x["title"])}</h3><p>{escape(x["description"])}</p><a href="articles/{escape(x["slug"])}.html">Read the guide →</a></div></article>'

def main():
    r=rows()
    cards="".join(card(x) for x in r)
    guides='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Practical HomeProjectWise guides for real home problems, projects and smart-home decisions."><link rel="canonical" href="'+BASE+'/guides.html"><link rel="stylesheet" href="style.css">'+GOAT+'<title>Guides — HomeProjectWise</title></head><body><header class="nav"><a class="brand" href="./"><img class="brand-logo" src="logo.svg" alt="HomeProjectWise"></a><nav><a href="./">Home</a><a href="./guides.html" aria-current="page">Guides</a><a href="./about.html">About</a></nav><a class="nav-cta" href="feed.xml">Follow the feed</a></header><main class="section guide-library"><div class="library-intro"><p class="eyebrow">THE GUIDE LIBRARY</p><h1>Useful answers for real home problems.</h1><p>Newest guides first, with the wider library below.</p></div><div class="library-meta"><strong>'+str(len(r))+' guides</strong><span>Practical · readable · built to be used</span></div><div class="cards guide-grid">'+cards+'</div></main>'+footer()+'</body></html>'
    (WEBSITE/"guides.html").write_text(guides,encoding="utf-8")
    urls=[BASE+"/",BASE+"/guides.html",BASE+"/about.html",BASE+"/editorial-policy.html",BASE+"/privacy.html",BASE+"/terms.html",BASE+"/contact.html"]+[BASE+"/articles/"+x["slug"]+".html" for x in r]
    (WEBSITE/"sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join("<url><loc>"+u+"</loc></url>" for u in urls)+"</urlset>",encoding="utf-8")
    items="".join(f'<item><title>{escape(x["title"])}</title><link>{BASE}/articles/{x["slug"]}.html</link><description>{escape(x["description"])}</description></item>' for x in r[:20])
    (WEBSITE/"feed.xml").write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>HomeProjectWise</title><link>'+BASE+'/</link><description>Practical home projects, smart-home ideas and useful guides.</description>'+items+"</channel></rss>",encoding="utf-8")
    p=WEBSITE/"index.html"; h=p.read_text(encoding="utf-8",errors="ignore")
    latest="".join(card(x,True) for x in r[:3])
    h,n=re.subn(r'<section id="guides" class="section">.*?</section>','<section id="guides" class="section"><div class="section-head"><div><p class="eyebrow">THE LATEST</p><h2>Useful guides, newest first.</h2><p class="section-intro">Real fixes, practical projects and smart-home decisions — without filler.</p></div><a href="guides.html">Browse all '+str(len(r))+' guides →</a></div><div class="cards">'+latest+'</div></section>',h,count=1,flags=re.S)
    if n!=1: raise SystemExit("Could not update latest section safely")
    start='<section class="section start-here"><div class="section-head"><div><p class="eyebrow">START WITH THE PROBLEM</p><h2>Choose what you need help with.</h2></div></div><div class="problem-grid"><a href="guides.html"><strong>Storage & organization</strong><span>Make everyday items easier to put away and easier to find.</span></a><a href="guides.html"><strong>Home design</strong><span>Improve light, layout and calm before buying new things.</span></a><a href="guides.html"><strong>Weekend projects</strong><span>Plan repairs and upgrades with fewer mistakes and less waste.</span></a><a href="guides.html"><strong>Smart home</strong><span>Automate the moments that genuinely remove friction.</span></a></div></section>'
    h,n=re.subn(r'<section class="section"><div class="section-head"><div><p class="eyebrow">START HERE</p>.*?</section>',start,h,count=1,flags=re.S)
    if n!=1: raise SystemExit("Could not replace stale START HERE section safely")
    p.write_text(h,encoding="utf-8")
    print(f"Rebuilt guide library, homepage latest cards, sitemap and RSS from {len(r)} article files.")
if __name__=="__main__":main()
