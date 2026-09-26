#!/usr/bin/env python3
from __future__ import annotations
import argparse,json,re,subprocess
from pathlib import Path
from urllib.error import HTTPError,URLError
from urllib.parse import urlparse
from urllib.request import Request,urlopen
ROOT=Path(__file__).resolve().parents[1]; WEBSITE=ROOT/'website'; ARTICLES=WEBSITE/'articles'; REGISTRY=ROOT/'data/used_images.json'
MIN_WORDS=650; MIN_H2=4; MIN_IMAGES=3; MIN_FAQ=3; MIN_INTERNAL=2; GOAT_MARKER='homeprojectwise.goatcounter.com/count'
REQUIRED=['index.html','guides.html','about.html','robots.txt','sitemap.xml','feed.xml']
def visible_text(html):
    html=re.sub(r'<script\b[^>]*>.*?</script>',' ',html,flags=re.I|re.S); html=re.sub(r'<style\b[^>]*>.*?</style>',' ',html,flags=re.I|re.S); return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',html)).strip()
def internal_links(html): return [u for u in re.findall(r'href=["\']([^"\']+)["\']',html,re.I) if not u.startswith(('http://','https://','//','#','mailto:'))]
def image_urls(html): return re.findall(r'<img\b[^>]+src=["\']([^"\']+)["\']',html,re.I)
def image_ids(html):
    out=[]
    for url in image_urls(html):
        m=re.search(r'photo-([A-Za-z0-9_-]+)',url); out.append(m.group(1) if m else url.split('?')[0])
    return out
def registry():
    if not REGISTRY.exists(): return {'used_ids':[],'used_urls':[],'used_photographers':[]}
    try: return json.loads(REGISTRY.read_text(encoding='utf-8'))
    except Exception: return {'used_ids':[],'used_urls':[],'used_photographers':[]}
def check_image_url(url):
    if url.startswith(('../','./','/')): return None
    if not url.startswith(('http://','https://')): return 'unsupported image URL'
    try:
        req=Request(url,method='HEAD',headers={'User-Agent':'HomeProjectWise-QA/2.0'})
        with urlopen(req,timeout=15) as r:
            if r.status>=400: return f'image HTTP {r.status}'
    except HTTPError as e: return f'image HTTP {e.code}'
    except URLError as e: return f'image request failed: {e.reason}'
    except Exception as e: return f'image request failed: {e}'
    return None
def link_target(path,href):
    parsed=urlparse(href)
    if parsed.scheme or parsed.netloc: return None
    target=(path.parent/parsed.path).resolve()
    try: target.relative_to(ROOT.resolve())
    except ValueError: return None
    return target
def check(path,recent_ids):
    html=path.read_text(encoding='utf-8'); text=visible_text(html); words=len(re.findall(r"\b[\w’'-]+\b",text)); h2=len(re.findall(r'<h2\b',html,re.I)); images=len(image_urls(html)); faq=len(re.findall(r'<h3\b',html,re.I)); links=internal_links(html); ids=image_ids(html); failures=[]
    intro=re.split(r'<h2\b',html,maxsplit=1,flags=re.I)[0]; intro_words=len(re.findall(r"\b[\w’'-]+\b",visible_text(intro))); actionable=bool(re.search(r'<(ol|ul)\b',html,re.I))
    checks=[(words>=MIN_WORDS,f'article is too thin: {words} words (minimum {MIN_WORDS})'),(h2>=(3 if words<900 else MIN_H2),f'not enough sections: {h2} H2'),(images>=(2 if words<900 else MIN_IMAGES),f'not enough useful visuals: {images} images'),(faq>=MIN_FAQ,f'not enough FAQ coverage: {faq} questions'),(len(links)>=MIN_INTERNAL,f'not enough internal navigation: {len(links)} links'),(actionable,'missing actionable list or step-by-step structure'),(intro_words<=130,f'introduction is too slow to answer the reader: {intro_words} words before first H2')]
    failures.extend(message for ok,message in checks if not ok)
    if len(ids)!=len(set(ids)): failures.append('duplicate image inside article')
    repeated=sorted(set(ids)&recent_ids)
    if repeated: failures.append('image reused in one of the three most recent articles: '+', '.join(repeated))
    required=[('application/ld+json' in html and '"@type": "BlogPosting"' in html,'missing BlogPosting JSON-LD'),('"@type": "FAQPage"' in html,'missing FAQPage schema'),(bool(re.search(r'<meta\s+name=["\']description["\']',html,re.I)),'missing meta description'),(bool(re.search(r'<link\s+rel=["\']canonical["\']',html,re.I)),'missing canonical'),(bool(re.search(r'<h1\b',html,re.I)),'missing H1'),('BreadcrumbList' in html,'missing BreadcrumbList schema'),(GOAT_MARKER in html,'missing GoatCounter tracking')]
    failures.extend(message for ok,message in required if not ok)
    for img in re.findall(r'<img\b[^>]*>',html,re.I):
        alt=re.search(r'\balt=["\']([^"\']*)["\']',img,re.I)
        if not alt or len(alt.group(1).strip())<8 or alt.group(1).strip().lower() in {'image','photo','home improvement project'}: failures.append('every image needs a descriptive, non-generic alt text'); break
    for href in links:
        target=link_target(path,href)
        if target is not None and href.lower().endswith('.html') and not target.exists(): failures.append(f'broken internal link: {href}')
    for url in image_urls(html):
        err=check_image_url(url)
        if err: failures.append(f'{err}: {url}')
    return failures
def article_files(): return sorted(ARTICLES.glob('*.html'),key=lambda p:p.stat().st_mtime,reverse=True)
def changed_articles():
    for command in (["git","diff","--name-only","HEAD^","HEAD"],["git","diff","--name-only"]):
        try: output=subprocess.check_output(command,cwd=ROOT,text=True,stderr=subprocess.DEVNULL)
        except Exception: continue
        paths=[ROOT/p.strip() for p in output.splitlines() if p.strip().startswith('website/articles/') and p.strip().endswith('.html')]; existing=[p for p in paths if p.exists()]
        if existing: return existing
    return []
def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--all',action='store_true'); parser.add_argument('paths',nargs='*'); args=parser.parse_args()
    for required in REQUIRED:
        if not (WEBSITE/required).exists(): print(f'FAIL: missing website/{required}'); return 1
    all_articles=article_files(); recent_ids=set()
    for article in all_articles[:3]: recent_ids.update(image_ids(article.read_text(encoding='utf-8')))
    if args.paths:
        targets=[ROOT/item for item in args.paths]; missing=[p for p in targets if not p.exists()]
        if missing:
            for p in missing: print(f'FAIL: missing article {p.relative_to(ROOT)}')
            return 1
    else: targets=all_articles if args.all else changed_articles()
    if not targets: print('PASS: no changed article candidate; site structure is present.'); return 0
    failed=False
    for path in targets:
        own_ids=set(image_ids(path.read_text(encoding='utf-8'))); errors=check(path,recent_ids-own_ids); html=path.read_text(encoding='utf-8'); words=len(re.findall(r"\b[\w’'-]+\b",visible_text(html))); h2_count=len(re.findall(r'<h2\b',html,re.I)); image_count=len(image_urls(html)); faq_count=len(re.findall(r'<h3\b',html,re.I)); internal_count=len(internal_links(html))
        if errors:
            failed=True; print(f'FAIL: {path.relative_to(ROOT)}')
            for e in errors: print(f'  - {e}')
        else: print(f'PASS: {path.relative_to(ROOT)} | words={words} h2={h2_count} images={image_count} faq={faq_count} internal={internal_count}')
    counts={}
    for item in registry().get('used_photographers',[]):
        name=item.get('name') if isinstance(item,dict) else item
        if name: counts[name]=counts.get(name,0)+1
    over=sorted(name for name,count in counts.items() if count>3)
    if over: failed=True; print('FAIL: photographer used more than 3 times: '+', '.join(over))
    return 1 if failed else 0
if __name__=='__main__': raise SystemExit(main())
