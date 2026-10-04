#!/usr/bin/env python3
"""HomeProjectWise cleanup: articles + guides.html + index.html.

Dry-run by default; pass --apply to write files. Exit code 1 if verification fails.
Source of truth for the "12 articles" is website/feed.xml.
Needs: pip install beautifulsoup4
"""
from __future__ import annotations
import argparse
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path
from bs4 import BeautifulSoup

MAX_IMAGES = 4
STOP = {"html", "body", "main", "article"}
REPLACE = {
    "entryway-drop-zone": "quiet-entryway-storage",
    "stop-kitchen-counter-clutter": "kitchen-counter-zone-that-stays-clear",
    "five-minute-home-reset-that-prevents-clutter": "simple-home-reset-that-prevents-weekend-chaos",
    "make-bedroom-more-restful": "calm-room",
}
SLUG_HREF = re.compile(r"articles/([a-z0-9-]+)\.html", re.I)
PHOTO = re.compile(r"photo-\d+-[0-9a-f]+")
RE_FOCUS = re.compile(r"\s*This section focuses on[^<\".]*\.", re.I)
RE_CTX = re.compile(r"\s*Section context:[^<\"]*", re.I)
RE_ALT = re.compile(r"(\balt\s*=\s*)([\"'])(.*?)\2", re.I | re.S)
RE_COUNT = re.compile(r"\b\d+(\s+guides\b)", re.I)

def parse(text): return BeautifulSoup(text, "html.parser")
def slug_of(href):
    m = SLUG_HREF.search(href or ""); return m.group(1) if m else None
def canonical_slugs(feed):
    slugs=set()
    for link in ET.parse(feed).iter("link"):
        s=slug_of(link.text or "")
        if s: slugs.add(s)
    return slugs
def content_root(soup): return soup.find("article") or soup.find("main") or soup.body or soup
def photo_id(img):
    src=img.get("src",""); m=PHOTO.search(src); return m.group(0) if m else src
def spread(items,n):
    if n<=0:return []
    if len(items)<=n:return list(items)
    if n==1:return [items[len(items)//2]]
    idx=sorted({round(i*(len(items)-1)/(n-1)) for i in range(n)})
    return [items[i] for i in idx]
def _clean_alt(m):
    v=m.group(3)
    v=re.sub(r"\s*[—–]\s*[^;]*;\s*section:.*$","",v,flags=re.I|re.S)
    v=re.sub(r"\s*;?\s*section:.*$","",v,flags=re.I|re.S)
    v=v.rstrip(" ;,—–-")
    return f"{m.group(1)}{m.group(2)}{v}{m.group(2)}"
def clean_text(html):
    stats={"focus":len(RE_FOCUS.findall(html)),"context":len(RE_CTX.findall(html)),"alt":len(re.findall(r"section:",html,flags=re.I))}
    html=RE_FOCUS.sub("",html); html=RE_CTX.sub("",html); html=RE_ALT.sub(_clean_alt,html)
    return html,stats
def _climb_cta(link,own_ids):
    cur=link
    while cur.parent is not None and cur.parent.name not in STOP:
        par=cur.parent
        if any(id(a) not in own_ids for a in par.find_all("a")): break
        if par.find(["h1"]): break
        cur=par
    return cur
def dedupe_cta(soup):
    links=[a for a in soup.find_all("a",href=True) if "sibforms.com" in a["href"]]; removed=0
    for a in links[1:]:
        _climb_cta(a,{id(a)}).decompose(); removed+=1
    return removed
def _is_caption(el):
    if el is None or getattr(el,"name",None) is None:return False
    cls=" ".join(el.get("class",[]))
    if el.name=="figcaption" or "caption" in cls:return True
    kids=[c for c in el.children if getattr(c,"name",None) or str(c).strip()]
    return el.name in ("p","div","small") and len(kids)==1 and getattr(kids[0],"name",None) in ("em","i","small")
def remove_image(img):
    fig=img.find_parent("figure")
    if fig is not None: fig.decompose(); return
    par=img.parent
    if par is not None and par.name in ("p","div","picture") and not par.get_text(strip=True) and len(par.find_all("img"))==1:
        nxt=par.find_next_sibling()
        if _is_caption(nxt): nxt.decompose()
        par.decompose(); return
    nxt=img.find_next_sibling()
    if _is_caption(nxt): nxt.decompose()
    img.decompose()
def prune_images(soup,dup_ids):
    root=content_root(soup); imgs=[i for i in root.find_all("img") if not i.find_parent(["header","nav","footer"])]
    if len(imgs)<=MAX_IMAGES:return 0
    hero,rest=imgs[0],imgs[1:]; need=MAX_IMAGES-1
    unique=[i for i in rest if photo_id(i) not in dup_ids]; dups=[i for i in rest if photo_id(i) in dup_ids]
    keep=spread(unique,need)
    if len(keep)<need: keep+=dups[:need-len(keep)]
    keep_ids={id(hero)}|{id(i) for i in keep}; removed=0
    for i in imgs:
        if id(i) not in keep_ids: remove_image(i); removed+=1
    return removed
def strip_affiliate(soup):
    n=0
    for s in soup.find_all(string=re.compile(r"Affiliate disclosure",re.I)):
        block=s.find_parent(["p","div","aside"])
        if block is not None and len(block.get_text(strip=True))<400: block.decompose(); n+=1
    return n
def fix_links(soup,own_slug,canon):
    notes=[]
    for a in list(soup.find_all("a",href=True)):
        s=slug_of(a["href"])
        if not s or s in canon: continue
        target=REPLACE.get(s)
        if target and target in canon and target!=own_slug:
            a["href"]=a["href"].replace(s,target); notes.append(f"{s} -> {target}")
        else:
            a.unwrap(); notes.append(f"{s} -> (unlinked)")
    return notes
def process_article(text,slug,canon,dup_ids,aff):
    text,st=clean_text(text); soup=parse(text)
    st["cta_removed"]=dedupe_cta(soup); st["imgs_removed"]=prune_images(soup,dup_ids)
    st["aff_removed"]=strip_affiliate(soup) if aff else 0; st["links"]=fix_links(soup,slug,canon)
    return str(soup),st
def _climb_card(a,slug):
    cur=a
    while cur.parent is not None and cur.parent.name not in STOP:
        par=cur.parent
        if any(slug not in (x["href"] or "") for x in par.find_all("a",href=True)): break
        if par.find(["h1","h2"]): break
        cur=par
    return cur
def process_listing(text,canon):
    soup=parse(text); removed=[]; warn=[]
    for a in list(soup.find_all("a",href=True)):
        if getattr(a,"decomposed",False): continue
        s=slug_of(a["href"])
        if not s or s in canon: continue
        card=_climb_card(a,s)
        if card is a: warn.append(f"card structure unclear for {s}; only the link was handled")
        else: card.decompose(); removed.append(s)
    notes=fix_links(soup,None,canon)
    for t in soup.find_all(string=RE_COUNT):
        new=RE_COUNT.sub(lambda m:f"{len(canon)}{m.group(1)}",str(t))
        if new!=str(t): t.replace_with(new)
    return str(soup),{"cards_removed":sorted(set(removed)),"links":notes,"warn":warn}
def verify_article(text,aff):
    p=[]
    if re.search(r"Section context",text,re.I): p.append("Section context still present")
    if re.search(r"This section focuses on",text,re.I): p.append("'This section focuses on' still present")
    if re.search(r"alt\s*=\s*[\"'][^\"']*section:",text,re.I): p.append("alt still contains 'section:'")
    soup=parse(text)
    if sum("sibforms.com" in a["href"] for a in soup.find_all("a",href=True))>1: p.append("more than one newsletter CTA")
    n=len([i for i in content_root(soup).find_all("img") if not i.find_parent(["header","nav","footer"])])
    if n>MAX_IMAGES:p.append(f"{n} images (max {MAX_IMAGES})")
    if aff and re.search(r"Affiliate disclosure",text,re.I): p.append("affiliate disclosure still present")
    return p
def verify_listing(name,text,canon,must_list_all):
    p=[]; linked={slug_of(a["href"]) for a in parse(text).find_all("a",href=True)}-{None}; stale=linked-canon
    if stale:p.append(f"{name}: links to removed articles {sorted(stale)}")
    if must_list_all and canon-linked:p.append(f"{name}: missing cards for {sorted(canon-linked)}")
    for m in re.finditer(r"\b(\d+)\s+guides\b",text,re.I):
        if int(m.group(1))!=len(canon):p.append(f"{name}: counter says {m.group(1)}, expected {len(canon)}")
    return p
def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--root",default="website"); ap.add_argument("--apply",action="store_true"); ap.add_argument("--delete-orphans",action="store_true"); ap.add_argument("--strip-affiliate",action="store_true"); args=ap.parse_args()
    root=Path(args.root); art_dir=root/"articles"; canon=canonical_slugs(root/"feed.xml"); print(f"Canonical articles from feed.xml: {len(canon)}")
    if not canon: print("ERROR: feed.xml has no article links"); return 1
    files=sorted(art_dir.glob("*.html")); keep=[f for f in files if f.stem in canon]; orphans=[f for f in files if f.stem not in canon]; missing=canon-{f.stem for f in keep}
    if missing: print(f"ERROR: in feed.xml but no file in {art_dir}: {sorted(missing)}"); return 1
    usage=Counter()
    for f in keep: usage.update({photo_id(i) for i in parse(f.read_text(encoding="utf-8")).find_all("img")})
    dup_ids={k for k,v in usage.items() if v>1}; outputs={}; problems=[]
    for f in keep:
        old=f.read_text(encoding="utf-8"); new,st=process_article(old,f.stem,canon,dup_ids,args.strip_affiliate); outputs[f]=new
        print(f"[{f.name}] focus={st['focus']} context={st['context']} alt={st['alt']} cta-={st['cta_removed']} img-={st['imgs_removed']} aff-={st['aff_removed']} links={st['links']}")
        problems += [f"{f.name}: {x}" for x in verify_article(new,args.strip_affiliate)]
    for name,must in (("guides.html",True),("index.html",False)):
        f=root/name
        if not f.exists(): continue
        new,st=process_listing(f.read_text(encoding="utf-8"),canon); outputs[f]=new
        print(f"[{name}] cards removed={st['cards_removed']} links={st['links']} warn={st['warn']}")
        problems += verify_listing(name,new,canon,must)
    if orphans:
        print(f"Orphan article files (not in feed.xml): {[o.name for o in orphans]}")
        if not args.delete_orphans: print("  -> pass --delete-orphans to remove them (GitHub Pages cannot 301)")
    stale_re=re.compile("|".join(map(re.escape,REPLACE)))
    for f in root.rglob("*"):
        if f.is_file() and f.suffix in {".html",".xml",".txt",".json"} and f not in outputs and f not in orphans:
            try:
                if stale_re.search(f.read_text(encoding="utf-8")): problems.append(f"{f.relative_to(root)}: still references a removed article")
            except UnicodeDecodeError: pass
    if args.apply:
        for f,text in outputs.items():
            if f.read_text(encoding="utf-8")!=text:f.write_text(text,encoding="utf-8")
        if args.delete_orphans:
            for o in orphans:o.unlink()
        print("Files written.")
    else: print("Dry run: nothing written (use --apply).")
    if problems:
        print("\nVERIFICATION FAILED:")
        for x in problems: print(" -",x)
        return 1
    print("\nVerification OK."); return 0
if __name__=="__main__": sys.exit(main())