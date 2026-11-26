"""Responsive Chromium QA for the quantity-only decking estimator."""
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
        page.goto(BASE + "decking-quantity-calculator.html", wait_until="domcontentloaded")
        check("all measurements and choices start blank at %dpx" % width,
              page.locator("#deck-unit").input_value() == "" and
              page.locator("#deck-board-width").input_value() == "" and
              page.locator("#deck-board-gap").input_value() == "" and
              page.locator("#deck-stock-length").input_value() == "" and
              page.locator("#deck-length-1").input_value() == "" and
              page.locator("#deck-edge-1").input_value() == "" and
              page.locator("#deck-waste").input_value() == "")
        page.select_option("#deck-unit", "m")
        page.fill("#deck-board-width", "0.1")
        page.fill("#deck-board-gap", "0.005")
        page.fill("#deck-stock-length", "2.5")
        page.fill("#deck-length-1", "4")
        page.fill("#deck-width-1", "2")
        page.select_option("#deck-orientation-1", "along-length")
        page.fill("#deck-edge-1", "0")
        page.click("button[type=submit]")
        result = page.inner_text("#deck-result")
        check("metric 4 × 2 m section gives 20 rows, 2 boards per row and 40 stock boards",
              "20 rows × 2 stock boards per row = 40 boards" in result and "Total stock boards: 40" in result, result)
        check("blank allowance adds no hidden waste", "No extra allowance added." in result, result)
        page.click("#deck-add-section")
        page.fill("#deck-length-2", "2")
        page.fill("#deck-width-2", "1")
        page.select_option("#deck-orientation-2", "along-width")
        page.fill("#deck-edge-2", "0")
        page.fill("#deck-waste", "5")
        page.click("button[type=submit]")
        result = page.inner_text("#deck-result")
        check("multiple sections and per-section direction are counted separately",
              "Section 1: 20 rows × 2 stock boards per row = 40 boards" in result and
              "Section 2: 20 rows × 1 stock boards per row = 20 boards" in result and
              "Base stock boards before extra allowance: 60" in result, result)
        check("visitor-selected 5% allowance adds three boards to 60",
              "Visitor-selected extra allowance: 5% (3 extra boards)." in result and
              "Total stock boards: 63" in result, result)
        page.click("[data-remove-section]")
        page.fill("#deck-waste", "")
        page.click("button[type=submit]")
        check("removing a section restores the single-section count",
              "Total stock boards: 40" in page.inner_text("#deck-result"), page.inner_text("#deck-result"))
        page.fill("#deck-board-gap", "")
        page.click("button[type=submit]")
        check("missing board gap stops the count instead of assuming one",
              "Gap between boards" in page.inner_text("#deck-error") and page.locator("#deck-result").is_hidden(),
              page.inner_text("#deck-error"))
        check("no horizontal overflow at %dpx" % width, page.evaluate("document.documentElement.scrollWidth") <= width + 1)
        if width == 1280:
            page.locator("#deck-unit").focus(); page.keyboard.press("Tab")
            check("keyboard order reaches actual board width after unit", page.evaluate("document.activeElement.id === 'deck-board-width'"))
        check("no browser or console errors at %dpx" % width, not errors, errors)
        shot = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "visual-qa-results", "decking-quantity-%d.png" % width)
        os.makedirs(os.path.dirname(shot), exist_ok=True)
        page.screenshot(path=shot, full_page=True, animations="disabled")
        context.close()
    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Decking Chromium QA failed: " + "; ".join(failures))
print("Decking Chromium QA: all checks passed at 320 / 390 / 1280 px")
