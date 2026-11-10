#!/usr/bin/env python3
"""Repeatable visual QA for HomeProjectWise. Captures screenshots and a machine-readable report."""
from __future__ import annotations
import json, os, subprocess, sys, time, urllib.request
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "website"
OUT = Path(os.environ.get("VISUAL_QA_OUT", ROOT / "visual-qa-results"))
OUT.mkdir(parents=True, exist_ok=True)
PAGES = [
    ("home", "/"), ("guides", "/guides.html"), ("tools", "/tools.html"),
    ("calculator", "/home-project-calculator.html"), ("budget-planner", "/budget-planner.html"),
    ("search", "/search.html"), ("about", "/about.html"),
]
VIEWPORTS = [("mobile", 390, 844), ("mobile-small", 320, 740), ("desktop", 1280, 900), ("wide", 1440, 1000)]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_): pass

os.chdir(SITE)
server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}"
report = {"base_url": base, "pages": [], "checks": [], "failures": [], "screenshots": []}

def check(name, ok, detail=""):
    item = {"name": name, "passed": bool(ok), "detail": str(detail)[:500]}
    report["checks"].append(item)
    if not ok:
        report["failures"].append(item)
        print("FAIL", name, detail)
    else:
        print("PASS", name)

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for page_name, path in PAGES:
            for mode in ("light", "dark"):
                for vp_name, width, height in VIEWPORTS:
                    # Full matrix for the key pages; mobile/desktop for the supporting pages.
                    if page_name not in ("home", "calculator", "tools") and vp_name in ("mobile-small", "wide"):
                        continue
                    context = browser.new_context(
                        viewport={"width": width, "height": height},
                        color_scheme=mode,
                        reduced_motion="reduce",
                    )
                    page = context.new_page()
                    console_errors, page_errors, failed_responses = [], [], []
                    page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
                    page.on("pageerror", lambda exc: page_errors.append(str(exc)))
                    page.on("requestfailed", lambda req: failed_responses.append(req.url + " " + str(req.failure)))
                    url = base + path
                    try:
                        response = page.goto(url, wait_until="networkidle", timeout=30000)
                        check(f"{page_name}/{mode}/{vp_name}: HTTP 200", bool(response and response.status == 200), response.status if response else "no response")
                        page.wait_for_timeout(150)
                        metrics = page.evaluate("""() => ({
                          title: document.title, h1: document.querySelectorAll('h1').length,
                          width: document.documentElement.scrollWidth, viewport: innerWidth,
                          bodyHeight: document.body.scrollHeight,
                          brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src).slice(0,10),
                          missingAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
                          emptyLinks: [...document.querySelectorAll('a')].filter(a => !a.textContent.trim() && !a.querySelector('img[alt]')).length
                        })""")
                        check(f"{page_name}/{mode}/{vp_name}: no horizontal overflow", metrics["width"] <= width + 1, metrics)
                        check(f"{page_name}/{mode}/{vp_name}: exactly one H1", metrics["h1"] == 1, metrics["h1"])
                        check(f"{page_name}/{mode}/{vp_name}: images load", not metrics["brokenImages"], metrics["brokenImages"])
                        check(f"{page_name}/{mode}/{vp_name}: image alt present", metrics["missingAlt"] == 0, metrics["missingAlt"])
                        check(f"{page_name}/{mode}/{vp_name}: links have names", metrics["emptyLinks"] == 0, metrics["emptyLinks"])
                        # Save screenshots for human visual review; screenshots are evidence, not an AI visual sign-off.
                        shot = OUT / f"{page_name}-{mode}-{width}x{height}.png"
                        page.screenshot(path=str(shot), full_page=True, animations="disabled")
                        report["screenshots"].append(str(shot.relative_to(ROOT)))
                        report["pages"].append({"page": page_name, "path": path, "mode": mode, "viewport": [width,height], "metrics": metrics})
                        # Internal navigation targets should resolve on the same origin.
                        links = page.locator("a[href]").evaluate_all("""els => [...new Set(els.map(a => a.href).filter(u => u.startsWith(location.origin)))].slice(0,100)""")
                        bad = []
                        for link in links:
                            try:
                                req = urllib.request.Request(link, method="HEAD")
                                with urllib.request.urlopen(req, timeout=8) as r:
                                    if r.status >= 400: bad.append([link, r.status])
                            except Exception as e:
                                bad.append([link, str(e)[:120]])
                        check(f"{page_name}/{mode}/{vp_name}: internal links resolve", not bad, bad[:8])
                        # Ignore known browser console noise from blocked analytics; report application errors.
                        app_console = [x for x in console_errors if "gc.zgo.at" not in x and "goatcounter" not in x]
                        check(f"{page_name}/{mode}/{vp_name}: no page errors", not page_errors, page_errors)
                        check(f"{page_name}/{mode}/{vp_name}: no application console errors", not app_console, app_console[:5])
                    except Exception as e:
                        check(f"{page_name}/{mode}/{vp_name}: navigation and render", False, repr(e))
                    finally:
                        context.close()
        browser.close()
finally:
    server.shutdown()

report_path = OUT / "visual-qa-report.json"
report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
print(f"Visual QA: {len(report['checks']) - len(report['failures'])}/{len(report['checks'])} checks passed")
print(f"Report: {report_path}")
sys.exit(1 if report["failures"] else 0)
