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
                          emptyLinks: [...document.querySelectorAll('a')].filter(a => !a.textContent.trim() && !a.querySelector('img[alt]')).length,
                          overflowers: [...document.querySelectorAll('body *')].map(el => {
                            const r = el.getBoundingClientRect();
                            return { tag: el.tagName, id: el.id, className: typeof el.className === 'string' ? el.className : '', left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), text: (el.innerText || '').trim().slice(0, 80) };
                          }).filter(x => x.width > 0 && (x.left < -1 || x.right > innerWidth + 1)).sort((a,b) => b.right-a.right).slice(0, 12)
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
                    page.locator("#tab-wallpaper").dispatch_event("click")
                    page.wait_for_function("document.querySelector('#panel-wallpaper').classList.contains('active')", timeout=10000)
                    check(f"{label}: Wallpaper panel visible", page.is_visible("#panel-wallpaper"))
                    page.select_option("#wp-unit", "in")
                    page.check("#wp-compare")
                    for pre, sale, ln, match, price in (("wp", "double roll", "396", "straight", "24.99"), ("wp2", "single roll", "198", "free", "12.5")):
                        page.fill(f"#{pre}-saleunit", sale); page.fill(f"#{pre}-rollwidth", "20.5"); page.fill(f"#{pre}-length", ln)
                        page.select_option(f"#{pre}-match", match)
                        if match == "straight": page.fill(f"#{pre}-repeat", "20")
                        page.fill(f"#{pre}-price", price); page.fill(f"#{pre}-currency", "USD")
                    page.fill("#wp-name1", "Product A"); page.fill("#wp-name2", "Product B")
                    page.wait_for_selector("#wp-rooms .wp-room .wp-room-label", timeout=10000)
                    room = page.locator("#wp-rooms .wp-room").first
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

        # Room-to-Ready: current-room invalidation, one-wall-finish guard, keyboard use and screenshots.
        for vp_name, width, height in (("mobile", 390, 844), ("desktop", 1280, 900)):
            label = f"room-to-ready/{vp_name}"
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme="light", reduced_motion="reduce")
            page = context.new_page()
            page_errors, app_console = [], []
            page.on("pageerror", lambda exc, acc=page_errors: acc.append(str(exc)))
            page.on("console", lambda msg, acc=app_console: acc.append(msg.text) if msg.type == "error" and "gc.zgo.at" not in (msg.location or {}).get("url", "") and "goatcounter" not in (msg.location or {}).get("url", "") else None)
            page.route("**/*", handle_request)
            try:
                page.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
                page.select_option("#region-country", "Canada")
                page.locator("#room-root summary").click()
                for field, value in (("room-unit", "m"), ("room-length", "15"), ("room-width", "8"), ("room-height", "4"), ("room-openings", "6")):
                    if field == "room-unit":
                        page.select_option("#" + field, value)
                    else:
                        page.fill("#" + field, value)
                page.click('#room-form button[data-target="flooring"]')
                page.click("#tab-project")
                page.wait_for_selector("#room-plan-form", timeout=15000)
                page.select_option("#plan-wall-finish", "wallpaper")
                page.click("#room-plan-submit")
                page.wait_for_function("window.hpwRoomToReadyPlan && Math.abs(window.hpwRoomToReadyPlan.areas.wallNetM2 - 178) < 0.001", timeout=10000)
                result = page.inner_text("#room-plan-result")
                check(f"{label}: canonical 15x8x4 room gives 178 m² net wall", "Net wall area: 178.00 m²" in result, result[:250])
                source_meta = page.evaluate("""() => {
                  const s = (window.hpwRoomToReadyPlan.sources || []).find(x => x.item === "Wallpaper");
                  return s ? { observedAt: s.observedAt, geographyResolution: s.geographyResolution } : null;
                }""")
                check(f"{label}: source uses earliest observation and sample scope", bool(source_meta and source_meta["observedAt"] == "2026-09-26" and source_meta["geographyResolution"] == "sample"), source_meta)
                check(f"{label}: wall-finish caveat visible", "area-based sample ranges" in result and "not a tin or roll count" in result, result[-300:])
                check(f"{label}: no horizontal overflow", page.evaluate("document.documentElement.scrollWidth") <= width + 1, page.evaluate("document.documentElement.scrollWidth"))
                shot = OUT / f"room-to-ready-{vp_name}-{width}x{height}.png"
                page.screenshot(path=str(shot), full_page=True, animations="disabled")
                report["screenshots"].append(str(shot.relative_to(ROOT)))

                if vp_name == "desktop":
                    # Keyboard-only path through the Room-to-Ready controls: Tab, select with End, Tab, Enter.
                    page.select_option("#plan-wall-finish", "none")
                    page.locator("#plan-flooring").focus()
                    page.keyboard.press("Tab")
                    page.keyboard.press("Tab")
                    check(f"{label}: Tab reaches wall-finish selector", page.evaluate("document.activeElement.id") == "plan-wall-finish", page.evaluate("document.activeElement.id"))
                    page.keyboard.press("End")
                    page.keyboard.press("Tab")
                    page.keyboard.press("Tab")
                    check(f"{label}: Tab reaches Build room plan button", page.evaluate("document.activeElement.id") == "room-plan-submit", page.evaluate("document.activeElement.id"))
                    page.keyboard.press("Enter")
                    page.wait_for_function("window.hpwRoomToReadyPlan && window.hpwRoomToReadyPlan.wallFinish === 'wallpaper'", timeout=10000)
                    check(f"{label}: keyboard Enter builds wallpaper plan", "Net wall area: 178.00 m²" in page.inner_text("#room-plan-result"))

                    # Changing the shared room must invalidate the prior plan and clear the Project List note.
                    for field, value in (("room-length", "10"), ("room-width", "5"), ("room-height", "3"), ("room-openings", "4")):
                        page.fill("#" + field, value)
                    page.click('#room-form button[data-target="flooring"]')
                    check(f"{label}: changed shared room clears old plan", page.evaluate("window.hpwRoomToReadyPlan === null") and page.inner_text("#room-plan-result") == "")
                    check(f"{label}: Project List reports no Room-to-Ready plan", "No Room-to-Ready plan added yet." in page.inner_text("#plist-room-plan-note"), page.inner_text("#plist-room-plan-note"))

                    # Rebuild wallpaper plan, add a Paint-tab item, and prove the combined total is blocked.
                    page.click("#tab-project")
                    page.select_option("#plan-wall-finish", "wallpaper")
                    page.click("#room-plan-submit")
                    page.wait_for_function("window.hpwRoomToReadyPlan && window.hpwRoomToReadyPlan.wallFinish === 'wallpaper'", timeout=10000)
                    page.click("#tab-paint")
                    page.locator("#paint-advanced summary").click()
                    currency_codes = {field: page.input_value("#" + field) for field in ("paint-currency", "material-currency", "energy-currency", "project-currency")}
                    check(f"{label}: Canada market supplies CAD ISO codes to manual-price paths", all(code == "CAD" for code in currency_codes.values()), currency_codes)
                    check(f"{label}: manual currency code is read-only", page.locator("#paint-currency").get_attribute("readonly") is not None)
                    for field, value in (("paint-length", "4"), ("paint-width", "3"), ("paint-height", "2.5"), ("paint-openings", "0"), ("paint-coats", "2"), ("paint-waste", "0"), ("paint-coverage", "10"), ("paint-price", "40")):
                        page.fill("#" + field, value)
                    page.click("#paint-form button[type=submit]")
                    paint_result = page.inner_text("#paint-result")
                    check(f"{label}: manual Paint amount is labelled CAD", "CAD 280.00" in paint_result, paint_result)
                    page.click("#paint-add")
                    page.click("#tab-project")
                    check(f"{label}: Project List inherits CAD", page.input_value("#plist-currency") == "CAD")
                    page.click("#plist-calc-form button[type=submit]")
                    conflict = page.inner_text("#plist-error")
                    check(f"{label}: Paint-tab + wallpaper double count is blocked", "cannot be combined" in conflict and "double-counting" in conflict, conflict)
                    # Changing to another country clears the typed Paint price and the Project List's manual price.
                    page.select_option("#region-country", "Germany")
                    check(f"{label}: country change refreshes all codes to EUR", all(page.input_value("#" + field) == "EUR" for field in ("paint-currency", "material-currency", "energy-currency", "project-currency", "plist-currency")))
                    check(f"{label}: country change clears manual Paint amount and result", page.input_value("#paint-price") == "" and page.inner_text("#paint-result") == "")
                    page.click("#tab-project")
                    modes = page.locator('#plist-items select[data-field="mode"]')
                    check(f"{label}: Project List manual price is reset after country change", modes.count() > 0 and modes.last.input_value() == "unknown")
                    check(f"{label}: no browser errors", not page_errors and not app_console, (page_errors + app_console)[:5])
            except Exception as e:
                check(f"{label}: Room-to-Ready browser scenario", False, repr(e))
            finally:
                context.close()
        # Mulch/soil quantity estimator: shared-room reuse, multi-section volume, label-only bag count and keyboard path.
        for vp_name, width, height in (("mobile", 390, 844), ("mobile-small", 320, 740), ("desktop", 1280, 900)):
            label = f"soil-mulch/{vp_name}"
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme="light", reduced_motion="reduce")
            page = context.new_page()
            page_errors, app_console = [], []
            page.on("pageerror", lambda exc, acc=page_errors: acc.append(str(exc)))
            page.on("console", lambda msg, acc=app_console: acc.append(msg.text) if msg.type == "error" and "gc.zgo.at" not in (msg.location or {}).get("url", "") and "goatcounter" not in (msg.location or {}).get("url", "") else None)
            page.route("**/*", handle_request)
            try:
                page.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
                page.wait_for_selector("#soil-mulch-form", timeout=15000)
                page.locator("#room-root summary").click()
                for field, value in (("room-unit", "m"), ("room-length", "15"), ("room-width", "8")):
                    if field == "room-unit": page.select_option("#" + field, value)
                    else: page.fill("#" + field, value)
                page.click('#room-form button[data-target="flooring"]')
                page.click("#tab-measure")
                page.click("#soil-use-room")
                check(f"{label}: shared room dimensions reused", page.input_value(".soil-length") == "15" and page.input_value(".soil-width") == "8")
                page.fill("#soil-depth", "5")
                page.select_option("#soil-depth-unit", "cm")
                page.fill("#soil-bag-volume", "50")
                page.select_option("#soil-bag-unit", "L")
                page.click("#soil-add-section")
                page.fill("#soil-sections .soil-section:nth-child(2) .soil-length", "2")
                page.fill("#soil-sections .soil-section:nth-child(2) .soil-width", "2")
                page.click("#soil-mulch-form button[type=submit]")
                result = page.inner_text("#soil-mulch-result")
                check(f"{label}: multiple bed sections calculate volume and label-based bags", "6.2 m³" in result and "124 bag(s)" in result, result)
                check(f"{label}: metric and imperial volumes both shown", "ft³" in result and "yd³" in result, result)
                check(f"{label}: shared-room replacement warning is visible", "replaces extra sections" in page.locator("#soil-use-room").inner_text())
                check(f"{label}: no prices or hidden allowance", "price" not in result.lower() and "allowance" not in result.lower(), result)
                check(f"{label}: no horizontal overflow", page.evaluate("document.documentElement.scrollWidth") <= width + 1, page.evaluate("document.documentElement.scrollWidth"))
                if vp_name == "desktop":
                    page.locator("#soil-material").focus()
                    page.keyboard.press("Tab")
                    page.keyboard.press("Tab")
                    check(f"{label}: keyboard reaches first bed length", page.evaluate("document.activeElement.classList.contains('soil-length')"))
                    check(f"{label}: no browser errors", not page_errors and not app_console, (page_errors + app_console)[:5])
                shot = OUT / f"soil-mulch-{width}x{height}.png"
                page.screenshot(path=str(shot), full_page=True, animations="disabled")
                report["screenshots"].append(str(shot.relative_to(ROOT)))
                # Verify preferred imperial display order without changing the saved screenshot.
                page.select_option("#soil-length-unit", "ft")
                page.click("#soil-mulch-form button[type=submit]")
                imperial_result = page.inner_text("#soil-mulch-result")
                imperial_headline = imperial_result.splitlines()[0] if imperial_result.splitlines() else ""
                check(f"{label}: feet selection leads with cubic yards then cubic feet", "yd³" in imperial_headline and imperial_headline.index("yd³") < imperial_headline.index("ft³"), imperial_headline)
                # Tiny positive metric volume must be presented in litres, not rounded to 0 m³.
                page.select_option("#soil-length-unit", "m")
                page.locator("#soil-sections .soil-section:nth-child(2) .soil-remove").click()
                page.fill("#soil-sections .soil-section:first-child .soil-length", "0.1")
                page.fill("#soil-sections .soil-section:first-child .soil-width", "0.1")
                page.fill("#soil-depth", "1")
                page.fill("#soil-bag-volume", "")
                page.click("#soil-mulch-form button[type=submit]")
                small_result = page.inner_text("#soil-mulch-result")
                check(f"{label}: small positive metric volume displays litres", "0.1 L" in small_result and "0 m³" not in small_result, small_result)
            except Exception as e:
                check(f"{label}: soil/mulch browser scenario", False, repr(e))
            finally:
                context.close()
        # Project cost beginner flow: no duplicate country note, currency guidance, and Room-to-Ready first.
        for vp_name, width, height in (("mobile", 390, 844), ("desktop", 1280, 900)):
            label = f"project-cost-guidance/{vp_name}"
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme="light", reduced_motion="reduce")
            page = context.new_page()
            page_errors, app_console = [], []
            page.on("pageerror", lambda exc, acc=page_errors: acc.append(str(exc)))
            page.on("console", lambda msg, acc=app_console: acc.append(msg.text) if msg.type == "error" and "gc.zgo.at" not in (msg.location or {}).get("url", "") and "goatcounter" not in (msg.location or {}).get("url", "") else None)
            page.route("**/*", handle_request)
            try:
                page.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
                page.wait_for_selector("#plist-root", state="attached", timeout=15000)
                check(f"{label}: country hint contains quantity guidance", "Quantity calculations remain available" in page.inner_text("#region-country-hint"))
                check(f"{label}: no duplicate global country note", page.locator("#currency-market-note").count() == 0)
                page.click("#tab-project")
                check(f"{label}: Room-to-Ready appears before Project list", page.locator("#panel-project").inner_text().index("Room-to-Ready plan") < page.locator("#panel-project").inner_text().index("Project list"))
                quick = page.locator("details.quick-estimate")
                check(f"{label}: single-item estimate is collapsed by default", quick.count() == 1 and not quick.evaluate("(el) => el.open"))
                currency = page.locator("#project-currency")
                check(f"{label}: empty currency field explains how to set it", currency.get_attribute("readonly") is not None and currency.get_attribute("placeholder") == "Choose your country above" and "currency-display" in (currency.get_attribute("class") or ""))
                prompt = page.locator("#room-plan-room-prompt")
                check(f"{label}: missing room is explained inline", prompt.is_visible() and "Enter your room once" in prompt.inner_text())
                page.click("#room-plan-open-room")
                check(f"{label}: prompt opens the collapsed shared-room section", page.locator("#room-root details").evaluate("(el) => el.open"))
                page.fill("#room-length", "5"); page.fill("#room-width", "4")
                page.click('#room-form button[data-target="flooring"]')
                page.click("#tab-project")
                check(f"{label}: room prompt hides after room is entered", page.locator("#room-plan-room-prompt").is_hidden())
                page.select_option("#region-country", "Canada")
                check(f"{label}: selected country populates read-only currency", page.input_value("#project-currency") == "CAD" and page.input_value("#energy-currency") == "CAD" and page.input_value("#plist-currency") == "CAD")
                check(f"{label}: currency hint updates after country selection", "CAD" in page.inner_text("#plist-currency-note"))
                check(f"{label}: no horizontal overflow", page.evaluate("document.documentElement.scrollWidth") <= width + 1)
                check(f"{label}: no browser errors", not page_errors and not app_console, (page_errors + app_console)[:5])
            except Exception as e:
                check(f"{label}: project cost guidance scenario", False, repr(e))
            finally:
                context.close()
        # Tile quantity flow is an extension of Flooring & materials, not a new top-level tab.
        for vp_name, width, height in (("mobile", 390, 844), ("desktop", 1280, 900)):
            label = f"tile-quantity/{vp_name}"
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme="light", reduced_motion="reduce")
            page = context.new_page()
            page_errors, app_console = [], []
            page.on("pageerror", lambda exc, acc=page_errors: acc.append(str(exc)))
            page.on("console", lambda msg, acc=app_console: acc.append(msg.text) if msg.type == "error" and "gc.zgo.at" not in (msg.location or {}).get("url", "") and "goatcounter" not in (msg.location or {}).get("url", "") else None)
            page.route("**/*", handle_request)
            try:
                page.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
                page.wait_for_selector("#tile-form", state="attached", timeout=15000)
                page.click("#tab-material")
                check(f"{label}: tile calculator is inside Flooring & materials", page.locator("#panel-material #tile-root").count() == 1)
                check(f"{label}: country-aware material-cost explanation is visible", "Material prices appear only when a source exists" in page.locator("#tile-root").inner_text())
                page.fill("#tile-length-1", "5"); page.fill("#tile-width-1", "4")
                page.fill("#tile-openings", "2"); page.fill("#tile-waste", "")
                page.fill("#tile-length", "0.6"); page.fill("#tile-width", "0.6"); page.select_option("#tile-size-unit", "m")
                page.fill("#tile-joint", "3"); page.select_option("#tile-joint-unit", "mm")
                page.locator("#tile-form details summary").click()
                page.fill("#tile-box-coverage", "1.44"); page.select_option("#tile-coverage-unit", "m2")
                page.click("#tile-form button[type=submit]")
                result = page.inner_text("#tile-result")
                check(f"{label}: subtracts openings and calculates tile and label box counts", "18 m²" in result and "50" in result and "13" in result, result)
                check(f"{label}: does not add an unrequested allowance and waits for a country before pricing", "no extra allowance added" in result.lower() and "choose your country above" in result.lower() and "GBP" not in result and "USD" not in result, result)
                # Exercise automatic shared-room synchronisation and the no-button state.
                page.locator("#room-root summary").click()
                for field, value in (("room-unit", "ft"), ("room-length", "12"), ("room-width", "10")):
                    if field == "room-unit": page.select_option("#" + field, value)
                    else: page.fill("#" + field, value)
                check(f"{label}: shared room fills Tile automatically without a hand-off click", page.input_value("#tile-length-1") == "12" and page.input_value("#tile-width-1") == "10" and page.input_value("#tile-unit") == "ft")
                page.click("#tile-add-section")
                page.fill("#tile-sections .tile-section:nth-child(2) .tile-length", "2")
                page.fill("#tile-sections .tile-section:nth-child(2) .tile-width", "2")
                page.fill("#room-width", "11")
                check(f"{label}: shared room change refreshes first tile area", page.input_value("#tile-length-1") == "12" and page.input_value("#tile-width-1") == "11")
                check(f"{label}: shared room refresh removes stale extra areas", page.locator("#tile-sections .tile-section").count() == 1)
                check(f"{label}: shared room synchronises floor unit", page.input_value("#tile-unit") == "ft")
                empty = context.new_page()
                empty.route("**/*", handle_request)
                empty.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
                empty.wait_for_selector("#tile-use-room", state="attached", timeout=15000)
                empty.click("#tab-material")
                check(f"{label}: no Tile-specific room hand-off button is visible", empty.locator("#tile-use-room").is_hidden() and empty.locator("#tile-room-note").is_hidden())
                empty.close()
                page.fill("#tile-length-1", "5"); page.fill("#tile-width-1", "4")
                page.select_option("#tile-unit", "m")
                page.click("#tile-add-section")
                page.fill("#tile-sections .tile-section:nth-child(2) .tile-length", "2")
                page.fill("#tile-sections .tile-section:nth-child(2) .tile-width", "2")
                page.click("#tile-form button[type=submit]")
                multi = page.inner_text("#tile-result")
                check(f"{label}: multiple rectangular areas are included", "24 m²" in multi and "boxes" in multi.lower(), multi)
                check(f"{label}: no horizontal overflow", page.evaluate("document.documentElement.scrollWidth") <= width + 1)
                if vp_name == "desktop":
                    page.locator("#tile-unit").focus(); page.keyboard.press("Tab")
                    check(f"{label}: keyboard reaches first area length", page.evaluate("document.activeElement.id === 'tile-length-1'"))
                check(f"{label}: no browser errors", not page_errors and not app_console, (page_errors + app_console)[:5])
                shot = OUT / f"tile-quantity-{width}x{height}.png"
                page.screenshot(path=str(shot), full_page=True, animations="disabled")
                report["screenshots"].append(str(shot.relative_to(ROOT)))
            except Exception as e:
                check(f"{label}: tile browser scenario", False, repr(e))
            finally:
                context.close()
        # Decking quantity tool: explicit board gap, edge clearance and orientation; no hidden allowance.
        for vp_name, width, height in (("mobile-320", 320, 800), ("mobile-390", 390, 844), ("desktop", 1280, 900)):
            label = f"decking-quantity/{vp_name}"
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme="light", reduced_motion="reduce")
            page = context.new_page()
            page_errors, app_console = [], []
            page.on("pageerror", lambda exc, acc=page_errors: acc.append(str(exc)))
            page.on("console", lambda msg, acc=app_console: acc.append(msg.text) if msg.type == "error" and "gc.zgo.at" not in (msg.location or {}).get("url", "") and "goatcounter" not in (msg.location or {}).get("url", "") else None)
            page.route("**/*", handle_request)
            try:
                page.goto(base + "/decking-quantity-calculator.html", wait_until="domcontentloaded", timeout=30000)
                page.wait_for_selector("#deck-form", state="attached", timeout=15000)
                check(f"{label}: live result region exists visible and empty before calculation", page.locator("#deck-result").count() == 1 and page.locator("#deck-result").get_attribute("hidden") is None and page.locator("#deck-result").get_attribute("aria-live") == "polite" and page.locator("#deck-result").inner_text() == "")
                check(f"{label}: unit, board details and first section start blank",
                      page.input_value("#deck-unit") == "" and page.input_value("#deck-board-width") == "" and
                      page.input_value("#deck-board-gap") == "" and page.input_value("#deck-stock-length") == "" and
                      page.input_value("#deck-length-1") == "" and page.input_value("#deck-edge-1") == "" and
                      page.input_value("#deck-waste") == "")
                page.select_option("#deck-unit", "m")
                page.fill("#deck-board-width", "0.1"); page.fill("#deck-board-gap", "0.005")
                page.fill("#deck-stock-length", "2.5"); page.fill("#deck-length-1", "4")
                page.fill("#deck-width-1", "2"); page.select_option("#deck-orientation-1", "along-length")
                page.fill("#deck-edge-1", "0"); page.click("#deck-form button[type=submit]")
                result = page.inner_text("#deck-result")
                check(f"{label}: edge-clearance wording limits it to the two sides across board rows", "two sides across the board rows" in page.locator("#deck-form").inner_text() and "No clearance is subtracted from the board-run length" in page.locator("#deck-form").inner_text())
                check(f"{label}: metric first section calculates 40 boards",
                      "20 rows × 2 stock boards per row = 40 boards" in result and "Total stock boards: 40" in result, result)
                check(f"{label}: blank allowance adds no hidden waste", "No extra allowance added." in result, result)
                page.click("#deck-add-section")
                page.fill("#deck-length-2", "2"); page.fill("#deck-width-2", "1")
                page.select_option("#deck-orientation-2", "along-width"); page.fill("#deck-edge-2", "0")
                page.fill("#deck-waste", "5"); page.click("#deck-form button[type=submit]")
                result = page.inner_text("#deck-result")
                check(f"{label}: multiple sections and per-section direction",
                      "Section 1: 20 rows × 2 stock boards per row = 40 boards" in result and
                      "Section 2: 20 rows × 1 stock boards per row = 20 boards" in result and
                      "Base stock boards before extra allowance: 60" in result, result)
                check(f"{label}: explicit 5% allowance adds three boards",
                      "Visitor-selected extra allowance: 5% (3 extra boards)." in result and "Total stock boards: 63" in result, result)
                page.click("[data-remove-section]"); page.fill("#deck-waste", "")
                page.click("#deck-form button[type=submit]")
                check(f"{label}: removing a section restores 40 boards", "Total stock boards: 40" in page.inner_text("#deck-result"), page.inner_text("#deck-result"))
                page.fill("#deck-board-gap", ""); page.click("#deck-form button[type=submit]")
                check(f"{label}: missing board gap stops calculation",
                      "Gap between boards" in page.inner_text("#deck-error") and page.locator("#deck-result").inner_text() == "" and page.locator("#deck-result").get_attribute("hidden") is None, page.inner_text("#deck-error"))
                check(f"{label}: no horizontal overflow", page.evaluate("document.documentElement.scrollWidth") <= width + 1)
                if width == 1280:
                    page.locator("#deck-unit").focus(); page.keyboard.press("Tab")
                    check(f"{label}: keyboard order reaches board width", page.evaluate("document.activeElement.id === 'deck-board-width'"))
                check(f"{label}: no browser/page errors", not page_errors and not app_console, (page_errors + app_console)[:5])
                shot = OUT / f"decking-quantity-{width}x{height}.png"
                page.screenshot(path=str(shot), full_page=True, animations="disabled")
                report["screenshots"].append(str(shot.relative_to(ROOT)))
            except Exception as e:
                check(f"{label}: decking browser scenario", False, repr(e))
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
