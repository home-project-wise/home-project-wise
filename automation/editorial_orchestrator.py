#!/usr/bin/env python3
from __future__ import annotations
import json, os, re
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT=Path(__file__).resolve().parents[1]
QUEUE=ROOT/'content/queue'; ARTICLES=ROOT/'website/articles'; STAGING=ROOT/'content/staging'
STATE=ROOT/'data/editorial_state.json'; LOG=ROOT/'data/editorial_team.jsonl'
MODEL=os.environ.get('GEMINI_MODEL','gemini-2.5-flash')
API=f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent'
MAX_BUFFER=2

def load(p,default):
    try:return json.loads(p.read_text(encoding='utf-8'))
    except:return default

def text_only(s):
    s=re.sub(r'<script\b[^>]*>.*?</script>',' ',s,flags=re.I|re.S)
    s=re.sub(r'<style\b[^>]*>.*?</style>',' ',s,flags=re.I|re.S)
    return re.sub(r'<[^>]+>',' ',s)

def context():
    out=[]
    for p in ARTICLES.glob('*.html'):
        t=p.read_text(encoding='utf-8',errors='ignore')
        m=re.search(r'<title>(.*?)</title>',t,re.S|re.I)
        if m:out.append(re.sub(r'\s*[|—-]\s*HomeProjectWise.*$','',re.sub('<[^>]+>','',m.group(1))).strip())
    for p in QUEUE.glob('*.json'):
        d=load(p,{})
        if d.get('title'):out.append(d['title'])
    return out[-100:]

def ask(prompt):
    key=os.environ.get('GEMINI_API_KEY')
    if not key:raise RuntimeError('GEMINI_API_KEY missing')
    body={'systemInstruction':{'parts':[{'text':'You are the strict editorial team for HomeProjectWise. Produce practical natural English for homeowners. Every article must solve one concrete reader problem, provide actionable steps, explain trade-offs or decision points where relevant, and avoid filler. Never invent facts or image URLs. Avoid keyword stuffing, repetition and generic lifestyle prose.'}]},'contents':[{'parts':[{'text':prompt}]}],'generationConfig':{'responseMimeType':'application/json','temperature':0.35,'maxOutputTokens':12000}}
    req=Request(API,data=json.dumps(body).encode(),headers={'Content-Type':'application/json','x-goog-api-key':key,'User-Agent':'HomeProjectWise-Editorial-Team/2.0'},method='POST')
    with urlopen(req,timeout=90) as r:data=json.load(r)
    return json.loads(data['candidates'][0]['content']['parts'][0]['text'])

def valid(d):
    for k in ('title','slug','description','category','body_html','image_queries'):
        if not d.get(k):raise ValueError('missing '+k)
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',d['slug']):raise ValueError('invalid slug')
    b=d['body_html']; w=len(re.findall(r"\b[\w’'-]+\b",text_only(b)))
    if not 900<=w<=2400:raise ValueError(f'word count {w}; article must be substantial but not padded')
    if len(re.findall(r'<h2\b',b,re.I))<4:raise ValueError('fewer than 4 H2')
    if not 4<=len(re.findall(r'<h3\b',b,re.I))<=6:raise ValueError('FAQ count must be 4-6')
    if not re.search(r'<(ol|ul)\b',b,re.I):raise ValueError('missing actionable list')
    if not 3<=len(d['image_queries'])<=6:raise ValueError('image queries must be 3-6')
    if not d.get('reader_problem'):raise ValueError('missing explicit reader problem')
    if not d.get('critic',{}).get('approved'):raise ValueError('critic did not approve')

def next_slot():
    now=datetime.now(timezone.utc)
    x=(now+timedelta(days=1)).replace(hour=6,minute=0,second=0,microsecond=0)
    return x

def main():
    if (ROOT/'.editorial-freeze').exists() and os.environ.get('ALLOW_GENERATION_DURING_FREEZE')!='1':
        print('EDITORIAL FREEZE: generation paused');return 0
    QUEUE.mkdir(parents=True,exist_ok=True);STAGING.mkdir(parents=True,exist_ok=True)
    existing=context(); count=len(list(QUEUE.glob('*.json')))+len(list(STAGING.glob('*.json')))
    target=min(int(os.environ.get('EDITORIAL_BUFFER',str(MAX_BUFFER))),MAX_BUFFER)
    if count>=target:print(f'EDITORIAL TEAM: queue healthy ({count}/{target}); no generation');return 0
    prompt=f'''Choose ONE concrete HomeProjectWise reader problem not already represented by these recent or pending titles:\n{json.dumps(existing,ensure_ascii=False)}\n\nAct as planner, lead writer and strict critic. Return one complete article package only after self-review. The article must genuinely solve the problem, not merely discuss it. Include concrete steps, practical quantities/decision rules only when reliable, common mistakes, and a short section explaining when the approach is not appropriate.\n\nReturn JSON only with:\n{{"reader_problem":"...","title":"...","slug":"...","description":"...","category":"...","body_html":"<p>...</p><h2>...</h2>...","image_queries":["3-6 highly specific visual queries matching sections of the article"],"internal_links":["real-existing-slug"],"critic":{{"approved":true,"issues":[]}}}}\n\nRules: 900-2400 visible words; 4-8 H2; give a useful partial answer in the first ~100 words; actionable OL/UL; 4-6 FAQ H3/P pairs; natural human English; no filler, generic inspiration, SEO padding, invented facts, invented image URLs or fake internal links. Images must be conceptually tied to specific sections, not decorative substitutes.''' 
    d=ask(prompt)
    if not d.get('critic',{}).get('approved'):
        d=ask(f'Revise this draft strictly until it solves one concrete reader problem and passes all rules. Return only the complete JSON package.\n{json.dumps(d,ensure_ascii=False)}')
    valid(d)
    if (ARTICLES/(d['slug']+'.html')).exists() or (QUEUE/(d['slug']+'.json')).exists() or (STAGING/(d['slug']+'.json')).exists():raise RuntimeError('duplicate slug refused: '+d['slug'])
    d['handoff']={'stage':'writer+critic-complete','critic':d.get('critic',{}),'image_requirements':d.get('image_queries',[]),'validation':'passed','remaining_tasks':['image_relevance_and_deduplication','publisher_quality_gate']}
    d['publish_at']=next_slot().isoformat().replace('+00:00','Z');d['images']=[];d['editorial_status']='approved-awaiting-images'
    (STAGING/(d['slug']+'.json')).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    STATE.write_text(json.dumps({'last_run':datetime.now(timezone.utc).isoformat(),'created':[d['slug']],'queue_size':count+1,'mode':'one-article-quality-buffer'},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    with LOG.open('a',encoding='utf-8') as f:f.write(json.dumps({'time':datetime.now(timezone.utc).isoformat(),'slug':d['slug'],'status':'approved-awaiting-images'})+'\n')
    print('EDITORIAL TEAM: staged '+d['slug']);return 0
if __name__=='__main__':raise SystemExit(main())
