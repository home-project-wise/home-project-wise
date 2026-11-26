"""Responsive Chromium QA for the fence quantity estimator."""
import functools, http.server, os, socketserver, threading
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "website")
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = socketserver.TCPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = "http://127.0.0.1:%d/" % server.server_address[1]
failures = []
def check(name, ok, detail=""):
    print(("PASS " if ok else "FAIL ") + name + ("" if ok else " | " + str(detail)[:300]))
    if not ok: failures.append(name)

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox"])
    for width in (320, 390, 1280):
        context = browser.new_context(viewport={"width":width,"height":900})
        context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.goto(BASE + "fence-quantity-calculator.html", wait_until="domcontentloaded")
        check("unit and all measurements start blank at %dpx" % width,
              page.locator("#fence-unit").input_value() == "" and
              page.locator("#fence-spacing").input_value() == "" and
              page.locator("#fq-run-length-1").input_value() == "")
        page.select_option("#fence-unit","m")
        page.fill("#fence-spacing","2")
        page.fill("#fq-run-length-1","10")
        page.click("button[type=submit]")
        result = page.locator("#fence-result").inner_text()
        check("metric straight run gives five spans and six posts at %dpx" % width,
              "Total spans: 5" in result and "Post count: 6" in result, result)
        page.click("[data-add-gate]")
        page.fill(".fq-gate-offset","4")
        page.fill(".fq-gate-width","1")
        page.click("button[type=submit]")
        result = page.locator("#fence-result").inner_text()
        check("gate splits run and retains two gate-edge posts at %dpx" % width,
              "Net fenced length after gate openings: 9 m" in result and
              "Total spans: 5" in result and "Post count: 7" in result, result)
        page.fill("#fence-panel-width","2.5")
        page.fill("#fence-pieces-per-span","2")
        page.fill("#fence-piece-length","3")
        page.click("button[type=submit]")
        result = page.locator("#fence-result").inner_text()
        check("optional panel and repeated-piece counts use entered values at %dpx" % width,
              "Panel quantity estimate: 4 panels" in result and
              "Repeated rails / boards estimate: 10 pieces" in result, result)
        page.click("#fence-add-run")
        page.fill("#fq-run-length-2","5")
        page.click("button[type=submit]")
        result = page.locator("#fence-result").inner_text()
        check("multiple runs with blank shared corners withhold post total at %dpx" % width,
              "Post count not calculated" in result and "Total spans: 8" in result, result)
        page.fill("#fence-shared-corners","1")
        page.click("button[type=submit]")
        check("explicit shared corner is deducted once at %dpx" % width,
              "Post count: 10" in page.locator("#fence-result").inner_text())
        page.locator("#fence-unit").focus(); page.keyboard.press("Tab")
        check("keyboard order reaches post spacing at %dpx" % width,
              page.evaluate("document.activeElement.id === 'fence-spacing'"))
        check("no horizontal overflow at %dpx" % width,
              page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("no browser console or page errors at %dpx" % width, not errors, errors)
        context.close()
    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Fence Chromium QA failed: " + ", ".join(failures))
print("Fence quantity Chromium QA passed at 320, 390 and 1280 px.")
