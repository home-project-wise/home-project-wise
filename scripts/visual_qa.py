#!/usr/bin/env python3
"""Repeatable visual QA for HomeProjectWise. Captures screenshots and a machine-readable report."""
from __future__ import annotations
import json, os, re, subprocess, sys, time, urllib.request
from pathlib import Path
from urllib.parse import urlparse
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
checked_targets = {}

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
                    def handle_request(route):
                        request = route.request
                        host = (urlparse(request.url).hostname or "").lower()
                        # Remove the analytics script from the local HTML response before
                        # Chromium evaluates its SRI attribute. A blank JS response causes an
                        # integrity mismatch console error, even though analytics is excluded.
                        if request.resource_type == "document":
                            response = route.fetch()
                            html = response.text()
                            html = re.sub(
                                r'<script\\b(?=[^>]*(?:gc\\.zgo\\.at|goatcounter))[^>]*>\\s*</script>',
                                '',
                                html,
                                flags=re.IGNORECASE,
                            )
                            route.fulfill(response=response, body=html)
                        elif host == "gc.zgo.at" or "goatcounter" in host:
                            route.abort()
                        else:
                            route.continue_()

                    page.route("**/*", handle_request)
                    console_errors, page_errors, failed_responses = [], [], []
                    page.on("console", lambda msg: console_errors.append({"text": msg.text, "url": (msg.location or {}).get("url", "")}) if msg.type == "error" else None)
                    page.on("pageerror", lambda exc: page_errors.append(str(exc)))
                    page.on("requestfailed", lambda req: failed_responses.append(req.url + " " + str(req.failure)))
                    url = base + path
                    try:
                        response = page.goto(url, wait_until="domcontentloaded", timeout=30000)
                        check(f"{page_name}/{mode}/{vp_name}: HTTP 200", bool(response and response.status == 200), response.status if response else "no response")
                        page.wait_for_load_state("load", timeout=15000)
                        page.evaluate("() => document.fonts.ready")
                        # Force native lazy-loaded images to fetch before measuring or capturing.
                        # Otherwise a full-page screenshot can contain blank card images even
                        # though the DOM reports no broken images (the images were never requested).
                        image_state = page.evaluate("""async () => {
                          const imgs = [...document.images];
                          for (const img of imgs) img.loading = "eager";
                          await Promise.all(imgs.map(img => img.decode().catch(() => null)));
                          return {
                            total: imgs.length,
                            loaded: imgs.filter(img => img.complete && img.naturalWidth > 0).length,
                            failed: imgs.filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src).slice(0, 20),
                            pending: imgs.filter(img => !img.complete).map(img => img.currentSrc || img.src).slice(0, 20)
                          };
                        }""")
                        page.wait_for_timeout(150)
                        metrics = page.evaluate("""() => ({
                          title: document.title, h1: document.querySelectorAll('h1').length,
                          width: document.documentElement.scrollWidth, viewport: innerWidth,
                          bodyHeight: document.body.scrollHeight,
                          totalImages: document.images.length,
                          loadedImages: [...document.images].filter(i => i.complete && i.naturalWidth > 0).length,
                          brokenImages: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.currentSrc || i.src).slice(0,20),
                          missingAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
                          emptyLinks: [...document.querySelectorAll('a')].filter(a => !a.textContent.trim() && !a.querySelector('img[alt]')).length
                        })""")
                        check(f"{page_name}/{mode}/{vp_name}: all images loaded", image_state["loaded"] == image_state["total"] and not image_state["failed"] and not image_state["pending"], image_state)
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
                            if link not in checked_targets:
                                try:
                                    req = urllib.request.Request(link, method="HEAD")
                                    with urllib.request.urlopen(req, timeout=8) as response:
                                        checked_targets[link] = (response.status < 400, response.status)
                                except Exception as e:
                                    checked_targets[link] = (False, str(e)[:120])
                            ok, detail = checked_targets[link]
                            if not ok: bad.append([link, detail])
                        check(f"{page_name}/{mode}/{vp_name}: internal links resolve", not bad, bad[:8])
                        # Analytics responses are stubbed above, so any remaining console/network error is actionable.
                        def is_blocked_analytics(url):
                            return "gc.zgo.at" in url or "goatcounter" in url
                        app_console = [x for x in console_errors if not is_blocked_analytics(x["url"])]
                        unexpected_failed = [x for x in failed_responses if not is_blocked_analytics(x.split(" ", 1)[0])]
                        check(f"{page_name}/{mode}/{vp_name}: no page errors", not page_errors, page_errors)
                        check(f"{page_name}/{mode}/{vp_name}: no application console errors", not app_console, app_console[:5])
                        check(f"{page_name}/{mode}/{vp_name}: no unexpected failed requests", not unexpected_failed, unexpected_failed[:5])
                    except Exception as e:
                        check(f"{page_name}/{mode}/{vp_name}: navigation and render", False, repr(e))
                    finally:
                        context.close()
        # Wallpaper tab evidence: the default calculator capture never opens it, so capture it
        # explicitly with a worked two-product comparison (light/dark, phone and desktop).
        for mode in ("light", "dark"):
            for vp_name, width, height in (("mobile", 390, 844), ("mobile-small", 320, 740), ("desktop", 1280, 900)):
                label = f"wallpaper-tab/{mode}/{vp_name}"
                context = browser.new_context(viewport={"width": width, "height": height}, color_scheme=mode, reduced_motion="reduce")
                page = context.new_page()
                page_errors, app_console = [], []
                page.on("pageerror", lambda exc, acc=page_errors: acc.append(str(exc)))
                page.on("console", lambda msg, acc=app_console: acc.append(msg.text) if msg.type == "error" and "gc.zgo.at" not in (msg.location or {}).get("url", "") and "goatcounter" not in (msg.location or {}).get("url", "") else None)
                def wp_route(route, pg=page):
                    request = route.request
                    host = (urlparse(request.url).hostname or "").lower()
                    if request.resource_type == "document":
                        response = route.fetch()
                        html = re.sub(r'<script\\b(?=[^>]*(?:gc\\.zgo\\.at|goatcounter))[^>]*>\\s*</script>', '', response.text(), flags=re.IGNORECASE)
                        route.fulfill(response=response, body=html)
                    elif host == "gc.zgo.at" or "goatcounter" in host:
                        route.abort()
                    else:
                        route.continue_()
                page.route("**/*", wp_route)
                try:
                    page.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
                    page.wait_for_selector("#tab-wallpaper", timeout=15000)
                    page.evaluate("() => document.fonts.ready")
                    page.click("#tab-wallpaper")
                    check(f"{label}: Wallpaper panel visible", page.is_visible("#panel-wallpaper"))
                    page.select_option("#wp-unit", "in")
                    page.check("#wp-compare")
                    for pre, sale, ln, match, price in (("wp", "double roll", "396", "straight", "24.99"), ("wp2", "single roll", "198", "free", "12.5")):
                        page.fill(f"#{pre}-saleunit", sale); page.fill(f"#{pre}-rollwidth", "20.5"); page.fill(f"#{pre}-length", ln)
                        page.select_option(f"#{pre}-match", match)
                        if match == "straight": page.fill(f"#{pre}-repeat", "20")
                        page.fill(f"#{pre}-price", price); page.fill(f"#{pre}-currency", "USD")
                    page.fill("#wp-name1", "Product A"); page.fill("#wp-name2", "Product B")
                    room = page.locator(".wp-room").first
                    room.locator(".wp-room-label").fill("Living room"); room.locator(".wp-height").fill("96"); room.locator(".wp-trim").fill("6")
                    while room.locator(".wp-wallw").count() < 4: room.locator(".wp-add-wall").click()
                    for i, w in enumerate((144, 180, 144, 180)): room.locator(".wp-wallw").nth(i).fill(str(w))
                    page.click("#wp-form button[type=submit]")
                    result = page.inner_text("#wp-result")
                    check(f"{label}: worked comparison shown", "Product A" in result and "Product B" in result and "USD" in result, result[:200])
                    check(f"{label}: no horizontal overflow", page.evaluate("document.documentElement.scrollWidth") <= width + 1, page.evaluate("document.documentElement.scrollWidth"))
                    check(f"{label}: no page or console errors", not page_errors and not app_console, (page_errors + app_console)[:5])
                    page.wait_for_timeout(150)
                    shot = OUT / f"wallpaper-tab-{mode}-{width}x{height}.png"
                    page.screenshot(path=str(shot), full_page=True, animations="disabled")
                    report["screenshots"].append(str(shot.relative_to(ROOT)))
                except Exception as e:
                    check(f"{label}: capture", False, repr(e))
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
