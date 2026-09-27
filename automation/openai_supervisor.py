#!/usr/bin/env python3
from __future__ import annotations
import json, os, subprocess, urllib.request
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
REPORT=ROOT/"data/openai_supervisor.json"
def run(cmd):
    return subprocess.run(cmd,capture_output=True,text=True,timeout=30).stdout.strip()
def main():
    report={
      "generated_by":"openai-supervisor",
      "commit":run(["git","rev-parse","HEAD"]),
      "recent_commits":run(["git","log","-8","--pretty=%h %s"]).splitlines(),
      "queue_count":len(list((ROOT/"content/queue").glob("*.json"))),
      "staging_count":len(list((ROOT/"content/staging").glob("*.json"))),
      "article_count":len(list((ROOT/"website/articles").glob("*.html"))),
      "ui_checks":{"homepage_exists":(ROOT/"website/index.html").exists(),"guides_exists":(ROOT/"website/guides.html").exists(),"sitemap_exists":(ROOT/"website/sitemap.xml").exists(),"feed_exists":(ROOT/"website/feed.xml").exists()},
      "handoffs":[],
      "actions":[]
    }
    for p in (ROOT/"content/staging").glob("*.json"):
        try:
            d=json.loads(p.read_text(encoding="utf-8"))
            report["handoffs"].append({"slug":d.get("slug"),"stage":d.get("handoff",{}).get("stage"),"remaining":d.get("handoff",{}).get("remaining_tasks",[])})
        except Exception as e:
            report["actions"].append("repair invalid handoff: "+p.name)
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False))
if __name__=="__main__":main()
