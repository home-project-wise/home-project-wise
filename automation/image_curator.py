#!/usr/bin/env python3
from __future__ import annotations
import json, os, re
from pathlib import Path
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
STAGING=ROOT/"content/staging"; QUEUE=ROOT/"content/queue"; REGISTRY=ROOT/"data/used_images.json"

def load(p,d):
    try:return json.loads(p.read_text(encoding="utf-8"))
    except:return d

def search_unsplash(query):
    key=os.environ.get("UNSPLASH_ACCESS_KEY")
    if not key:return []
    u="https://api.unsplash.com/search/photos?query="+quote(query)+"&per_page=30&orientation=landscape"
    req=Request(u,headers={"Authorization":"Client-ID "+key,"Accept-Version":"v1"})
    with urlopen(req,timeout=30) as r:return json.load(r).get("results",[])

def search_pexels(query):
    key=os.environ.get("PEXELS_API_KEY")
    if not key:return []
    u="https://api.pexels.com/v1/search?query="+quote(query)+"&per_page=30&orientation=landscape"
    req=Request(u,headers={"Authorization":key})
    with urlopen(req,timeout=30) as r:return json.load(r).get("photos",[])

def pick(query,used_ids,used_urls,used_people):
    providers=[]
    if os.environ.get("PEXELS_API_KEY"):providers.append(("pexels",search_pexels))
    if os.environ.get("UNSPLASH_ACCESS_KEY"):providers.append(("unsplash",search_unsplash))
    for provider,search in providers:
        for item in search(query):
            if provider=="pexels":
                iid=str(item.get("id","")); raw=((item.get("src") or {}).get("large2x") or (item.get("src") or {}).get("large") or "")
                person=item.get("photographer","").strip()
                credit="Pexels · "+person if person else "Pexels"
            else:
                iid=item.get("id",""); raw=((item.get("urls") or {}).get("regular") or "")
                person=((item.get("user") or {}).get("name") or "").strip()
                credit="Unsplash · "+person if person else "Unsplash"
            raw=raw.split("?")[0]
            if not iid or not raw or iid in used_ids or raw in used_urls or (person and person in used_people):continue
            return {"id":iid,"url":raw+("?auto=compress&cs=tinysrgb&w=1400" if provider=="pexels" else "?auto=format&fit=crop&w=1400&q=82"),"photographer":person,"credit":credit,"provider":provider}
    return None

def main():
    registry=load(REGISTRY,{"used_ids":[],"used_urls":[],"used_photographers":[]})
    used_ids=set(registry.get("used_ids",[]));used_urls=set(registry.get("used_urls",[]));people={}
    for x in registry.get("used_photographers",[]):
        name=x.get("name") if isinstance(x,dict) else x
        if name:people[name]=people.get(name,0)+1
    provider_available=bool(os.environ.get("PEXELS_API_KEY") or os.environ.get("UNSPLASH_ACCESS_KEY"))
    if not provider_available:
        print("IMAGE CURATOR: no image-provider secret configured; staging remains untouched.");return 0
    moved=[]
    for src in sorted(STAGING.glob("*.json")):
        d=load(src,{})
        queries=d.get("image_queries",[])[:7]
        if len(queries)<3:continue
        images=[];reserved=[]
        for q in queries:
            x=pick(q,used_ids|{i["id"] for i in reserved},used_urls|{i["url"].split("?")[0] for i in reserved},people)
            if not x:continue
            reserved.append(x)
            images.append({"url":x["url"],"alt":q.title()+" for a practical home project","caption":x["credit"]})
            if len(images)>=max(3,min(7,len(queries))):break
        if len(images)<3:
            print("IMAGE CURATOR: not enough unused images for",src.name);continue
        d["images"]=images;d.pop("image_queries",None);d["editorial_status"]="ready-for-publisher"
        dst=QUEUE/(src.stem+".json")
        if dst.exists():continue
        for x in reserved:
            used_ids.add(x["id"]);used_urls.add(x["url"].split("?")[0])
            if x["photographer"]:
                people[x["photographer"]]=people.get(x["photographer"],0)+1
                registry.setdefault("used_photographers",[]).append({"name":x["photographer"],"photo_id":x["id"]})
        registry.setdefault("used_ids",[]).extend(x["id"] for x in reserved)
        registry.setdefault("used_urls",[]).extend(x["url"].split("?")[0] for x in reserved)
        dst.write_text(json.dumps(d,ensure_ascii=False,indent=2)+"\n",encoding="utf-8");src.unlink();moved.append(dst.name)
    REGISTRY.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("IMAGE CURATOR: queued "+(", ".join(moved) if moved else "nothing"))
if __name__=="__main__":main()
