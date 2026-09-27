#!/usr/bin/env python3
from __future__ import annotations
import json, os, re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
QUEUE=ROOT/"content/queue"; ARTICLES=ROOT/"website/articles"; STAGING=ROOT/"content/staging"
STATE=ROOT/"data/editorial_state.json"; LOG=ROOT/"data/editorial_team.jsonl"
MODEL=os.environ.get("GEMINI_MODEL","gemini-2.5-flash")
API=f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"

def load(p,default):
    try:return json.loads(p.read_text(encoding="utf-8"))
    except:return default

def text_only(s):
    s=re.sub(r"<script\b[^>]*>.*?</script>"," ",s,flags=re.I|re.S)
    s=re.sub(r"<style\b[^>]*>.*?</style>"," ",s,flags=re.I|re.S)
    return re.sub(r"<[^>]+>"," ",s)

def context():
    out=[]
    for p in ARTICLES.glob("*.html"):
        t=p.read_text(encoding="utf-8",errors="ignore")
        m=re.search(r"<title>(.*?)</title>",t,re.S|re.I)
        if m:out.append(re.sub(r"\s*[|—-]\s*HomeProjectWise.*$","",re.sub("<[^>]+>","",m.group(1))).strip())
    for p in QUEUE.glob("*.json"):
        d=load(p,{})
        if d.get("title"):out.append(d["title"])
    return out[-100:]

def ask(prompt):
    key=os.environ.get("GEMINI_API_KEY")
    if not key:raise RuntimeError("GEMINI_API_KEY missing")
    body={"systemInstruction":{"parts":[{"text":"You are the coordinated HomeProjectWise editorial team: planner, lead writer and strict critic. Produce practical natural English for homeowners. Never invent facts or image URLs. Avoid filler, clickbait, repetition and keyword stuffing."}]},
          "contents":[{"parts":[{"text":prompt}]}],
          "generationConfig":{"responseMimeType":"application/json","temperature":0.55,"maxOutputTokens":12000}}
    req=Request(API,data=json.dumps(body).encode(),headers={"Content-Type":"application/json","x-goog-api-key":key,"User-Agent":"HomeProjectWise-Editorial-Team/1.0"},method="POST")
    with urlopen(req,timeout=90) as r:data=json.load(r)
    return json.loads(data["candidates"][0]["content"]["parts"][0]["text"])

def valid(d):
    for k in ("title","slug","description","category","body_html","image_queries"): 
        if not d.get(k):raise ValueError("missing "+k)
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*",d["slug"]):raise ValueError("invalid slug")
    b=d["body_html"]; w=len(re.findall(r"\b[\w’'-]+\b",text_only(b)))
    if not 650<=w<=2400:raise ValueError(f"word count {w}")
    if len(re.findall(r"<h2\b",b,re.I))<4:raise ValueError("fewer than 4 H2")
    if not 4<=len(re.findall(r"<h3\b",b,re.I))<=6:raise ValueError("FAQ count must be 4-6")
    if not re.search(r"<(ol|ul)\b",b,re.I):raise ValueError("missing actionable list")
    if len(d["image_queries"])<3:raise ValueError("fewer than 3 image queries")

def next_slot():
    local=datetime.now(timezone.utc)+timedelta(hours=1)
    candidates=[]
    for day in range(3):
        x=local+timedelta(days=day)
        for h in (6,18):candidates.append(x.replace(hour=h,minute=0,second=0,microsecond=0))
    return sorted(x for x in candidates if x>local)[0]-timedelta(hours=1)

def main():
    if (ROOT/".editorial-freeze").exists() and os.environ.get("ALLOW_GENERATION_DURING_FREEZE")!="1":
        print("EDITORIAL FREEZE: generation paused");return 0
    QUEUE.mkdir(parents=True,exist_ok=True);STAGING.mkdir(parents=True,exist_ok=True)
    existing=context(); target=int(os.environ.get("EDITORIAL_BUFFER","6")); count=len(list(QUEUE.glob("*.json")))
    if count>=target:print(f"EDITORIAL TEAM: queue healthy ({count})");return 0
    created=[]
    for _ in range(min(2,target-count)):
        prompt=f"""First act as Planner. Choose one concrete HomeProjectWise reader problem not represented by these recent/pending titles:
{json.dumps(existing,ensure_ascii=False)}
Then act as Lead Writer and Critic. Produce one complete article package and self-critique it before returning.

Return JSON only:
{{
"title":"...","slug":"...","description":"...","category":"...",
"body_html":"<p>...</p><h2>...</h2>...",
"image_queries":["query 1","query 2","query 3"],
"internal_links":["existing-slug"],
"critic":{"approved":true,"issues":[]}
}}
Rules: 650-2400 visible words; 4-8 H2; answer part of the problem in first ~100 words; actionable OL/UL; 4-6 FAQ H3/P pairs; useful, specific, human English; no invented facts or image URLs; no SEO/AI/editorial references; internal_links only when a real existing slug is known."""
        d=ask(prompt)
        if not d.get("critic",{}).get("approved"):
            d=ask(f"Revise this draft until it passes the same rules. Return only the full JSON package.\n{json.dumps(d,ensure_ascii=False)}")
        valid(d)
        if (ARTICLES/(d["slug"]+".html")).exists() or (QUEUE/(d["slug"]+".json")).exists() or (STAGING/(d["slug"]+".json")).exists():
            raise RuntimeError("duplicate slug refused: "+d["slug"])
        d["publish_at"]=next_slot().isoformat().replace("+00:00","Z")
        d["images"]=[]
        d["editorial_status"]="approved-awaiting-images"
        (STAGING/(d["slug"]+".json")).write_text(json.dumps(d,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
        existing.append(d["title"]);created.append(d["slug"])
    STATE.write_text(json.dumps({"last_run":datetime.now(timezone.utc).isoformat(),"created":created,"queue_size":count},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    with LOG.open("a",encoding="utf-8") as f:
        for slug in created:f.write(json.dumps({"time":datetime.now(timezone.utc).isoformat(),"slug":slug,"status":"approved-awaiting-images"})+"\n")
    print("EDITORIAL TEAM: staged "+", ".join(created))
    return 0
if __name__=="__main__":raise SystemExit(main())
