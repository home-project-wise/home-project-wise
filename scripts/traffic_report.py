#!/usr/bin/env python3
"""Create an honest daily traffic snapshot from GoatCounter when an API key is available."""
from __future__ import annotations
import json,os
from datetime import datetime,timezone,timedelta
from urllib.parse import urlencode
from urllib.request import Request,urlopen
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'data/traffic/latest.json'; API='https://homeprojectwise.goatcounter.com/api/v0'

def get(path,params):
    token=os.environ.get('GOATCOUNTER_API_KEY','').strip()
    if not token: return None
    url=f'{API}/{path}?{urlencode(params)}'
    req=Request(url,headers={'Authorization':f'Bearer {token}','Content-Type':'application/json'})
    with urlopen(req,timeout=30) as r: return json.load(r)

def main():
    now=datetime.now(timezone.utc); start=(now-timedelta(days=1)).replace(minute=0,second=0,microsecond=0); previous_start=start-timedelta(days=1)
    if not os.environ.get('GOATCOUNTER_API_KEY','').strip():
        payload={'status':'unavailable','reason':'GOATCOUNTER_API_KEY is not configured for GitHub Actions. No traffic number is inferred.','generated_at':now.isoformat()}
    else:
        try:
            total=get('stats/total',{'start':start.isoformat(),'end':now.isoformat()})
            hits=get('stats/hits',{'start':start.isoformat(),'end':now.isoformat(),'limit':100})
            refs=get('stats/toprefs',{'start':start.isoformat(),'end':now.isoformat(),'limit':100})
            prev=get('stats/total',{'start':previous_start.isoformat(),'end':start.isoformat()})
            payload={'status':'ok','generated_at':now.isoformat(),'period_start':start.isoformat(),'period_end':now.isoformat(),'pageviews':total,'paths':hits,'referrers':refs,'previous_period_pageviews':prev}
        except Exception as exc:
            payload={'status':'error','generated_at':now.isoformat(),'reason':str(exc)}
    OUT.parent.mkdir(parents=True,exist_ok=True); OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print(json.dumps(payload,ensure_ascii=False,indent=2)); return 0 if payload['status']!='error' else 1
if __name__=='__main__': raise SystemExit(main())
