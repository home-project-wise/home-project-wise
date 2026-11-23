"""Responsive Chromium fixtures for the tile material-cost estimate and shared-room hand-off."""
import os, threading, http.server, socketserver, functools
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
        context = browser.new_context(viewport={"width": width, "height": 900})
        context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE + "home-project-calculator.html#panel-material", wait_until="load")
        page.wait_for_selector("#tile-type")
        page.wait_for_timeout(700)
        check("tile calculator loads at %dpx" % width, page.locator("#tile-form").is_visible())
        check("no horizontal overflow at %dpx" % width, page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))

        # Shared room: type the dimensions once; Tile follows without pressing a Use-for button.
        page.select_option("#room-unit", "m")
        page.fill("#room-length", "5")
        page.fill("#room-width", "4")
        check("shared room fills tile dimensions automatically at %dpx" % width,
              page.input_value("#tile-length-1") == "5" and page.input_value("#tile-width-1") == "4" and not page.locator("#tile-room-note").is_hidden())
        check("shared room wall openings are not reused as floor openings at %dpx" % width, page.input_value("#tile-openings") == "0")

        # UK ceramic: 5 x 4 m = 20 m2; source range 12 to 50.60 GBP/m2 => GBP 240 to 1,012.
        page.select_option("#region-country", "UK")
        check("selected market currency is GBP at %dpx" % width, page.input_value("#tile-currency") == "GBP")
        page.select_option("#tile-type", "ceramic-tile")
        page.click("#tile-form button[type=submit]")
        result = page.inner_text("#tile-result")
        check("UK ceramic estimate uses exact-market range at %dpx" % width,
              "GBP 240.00–GBP 1,012.00" in result and "Source:" in result, result)
        check("no hidden waste allowance at %dpx" % width, "no extra allowance added" in result.lower(), result)

        # Visitor price replaces, not blends with, the reference.
        page.fill("#tile-manual-price", "25")
        page.click("#tile-form button[type=submit]")
        result = page.inner_text("#tile-result")
        check("manual per-area price replaces reference at %dpx" % width,
              "GBP 500.00" in result and "your price; replaces the reference range" in result, result)

        # Market change clears manual and pack prices; Netherlands has no porcelain reference.
        page.locator("#tile-form details summary").click()
        page.fill("#tile-pack-price", "10")
        page.select_option("#region-country", "Netherlands")
        check("market change clears prices and updates currency at %dpx" % width,
              page.input_value("#tile-manual-price") == "" and page.input_value("#tile-pack-price") == "" and page.input_value("#tile-currency") == "EUR")
        page.select_option("#tile-type", "porcelain-tile")
        page.click("#tile-form button[type=submit]")
        result = page.inner_text("#tile-result")
        check("missing exact-market range asks for manual price, never zero, at %dpx" % width,
              "No reference range is available" in result and "no price from another country" in result and "EUR 0.00" not in result, result)

        # A separate pack price uses the computed boxes only; it does not replace the per-area estimate.
        page.select_option("#tile-type", "ceramic-tile")
        page.locator("#tile-form details summary").click()
        page.fill("#tile-box-coverage", "1.5")
        page.select_option("#tile-coverage-unit", "m2")
        page.fill("#tile-pack-price", "10")
        page.click("#tile-form button[type=submit]")
        result = page.inner_text("#tile-result")
        check("pack estimate is a separate line based on 14 boxes at %dpx" % width,
              "Estimated boxes: 14" in result and "Separate pack-price estimate: EUR 140.00" in result, result)

        # Imperial twin: US ceramic 1.08–2.59 USD/sq ft over 120 sq ft => USD 129.60–310.80.
        page.select_option("#room-unit", "ft")
        page.fill("#room-length", "12")
        page.fill("#room-width", "10")
        page.select_option("#region-country", "US")
        page.select_option("#tile-type", "ceramic-tile")
        page.click("#tile-form button[type=submit]")
        result = page.inner_text("#tile-result")
        check("shared room and US ceramic price follow feet at %dpx" % width,
              page.input_value("#tile-unit") == "ft" and "USD 129.60–USD 310.80" in result, result)
        check("manual price label follows square-foot unit at %dpx" % width,
              "Your material price per ft²" in page.locator("#tile-manual-price-label").inner_text())
        page.fill("#tile-manual-price", "2")
        page.select_option("#tile-unit", "m")
        check("manual per-area price clears when its unit changes at %dpx" % width, page.input_value("#tile-manual-price") == "")
        page.select_option("#tile-unit", "ft")

        # Display-only sample remains explicit.
        page.select_option("#tile-type", "porcelain-tile")
        page.click("#tile-form button[type=submit]")
        result = page.inner_text("#tile-result")
        check("display-only porcelain sample is labelled at %dpx" % width,
              "Display only" in result and "2 observed product listings" in result, result)

        check("tile price controls have associated labels at %dpx" % width,
              page.locator("label[for=tile-type]").count() == 1 and
              page.locator("label[for=tile-manual-price]").count() == 1 and
              page.locator("label[for=tile-pack-price]").count() == 1)
        check("no browser errors at %dpx" % width, not errors, errors)
        context.close()
    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Tile cost Chromium QA failed: " + ", ".join(failures))
print("Tile material-cost Chromium QA passed at 320, 390 and 1280 px.")
