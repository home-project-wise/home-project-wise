"""Responsive Chromium QA for drywall/plaster area, optional product quantities and shared-room handoff."""
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
        page.goto(BASE + "drywall-plaster-calculator.html", wait_until="load")
        check("page loads at %dpx" % width, page.locator("h1").inner_text() == "Drywall and Plaster Quantity Calculator")
        check("no horizontal overflow at %dpx" % width, page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        labels = ["dp-unit","dp-openings","dp-length-1","dp-height-1","dp-ceiling","dp-board-width","dp-board-height",
                  "dp-plaster-name","dp-plaster-coverage","dp-plaster-coverage-unit","dp-plaster-reference","dp-plaster-application","dp-plaster-thickness-unit"]
        check("all visible fields have associated labels at %dpx" % width,
              all(page.locator('label[for="%s"]' % field).count() == 1 for field in labels))
        check("unit selectors start blank and no measurements or product data are prefilled at %dpx" % width,
              page.input_value("#dp-unit") == "" and page.input_value("#dp-plaster-coverage-unit") == "" and
              page.input_value("#dp-plaster-thickness-unit") == "" and page.input_value("#dp-length-1") == "" and
              page.input_value("#dp-board-width") == "" and page.input_value("#dp-plaster-coverage") == "")
        page.select_option("#dp-unit","m")
        page.fill("#dp-length-1","5"); page.fill("#dp-height-1","2.4")
        page.fill("#dp-openings","3.6"); page.fill("#dp-ceiling","20")
        page.fill("#dp-board-width","1.2"); page.fill("#dp-board-height","2.4")
        page.fill("#dp-plaster-name","Named plaster")
        page.fill("#dp-plaster-coverage","10"); page.select_option("#dp-plaster-coverage-unit","m2")
        page.fill("#dp-plaster-reference","10"); page.fill("#dp-plaster-application","10")
        page.select_option("#dp-plaster-thickness-unit","mm")
        page.click("button[type=submit]")
        result = page.locator("#dp-result").inner_text()
        check("hand-computed metric surface area and board count at %dpx" % width,
              "28.4 m²" in result and "9.861 boards" in result and "rounded up to 10 whole boards" in result, result)
        check("named plaster coverage and matching thickness calculate rounded bags at %dpx" % width,
              "2.84 bags" in result and "rounded up to 3 whole bags" in result, result)
        page.fill("#dp-plaster-application","15"); page.click("button[type=submit]")
        result = page.locator("#dp-result").inner_text()
        check("different application thickness does not scale published coverage at %dpx" % width,
              "28.4 m²" in result and "no scaling is assumed" in result and "whole bags" not in result, result)
        page.fill("#dp-plaster-application","10"); page.click("button[type=submit]")
        page.click("#dp-add-section")
        check("additional wall section has an associated label at %dpx" % width,
              page.locator('label[for="dp-length-2"]').count() == 1 and page.locator('label[for="dp-height-2"]').count() == 1)
        page.fill("#dp-length-2","4"); page.fill("#dp-height-2","2.4")
        page.click("button[type=submit]")
        result = page.locator("#dp-result").inner_text()
        check("multiple wall sections sum before openings and ceiling at %dpx" % width,
              "38 m²" in result and "rounded up to 14 whole boards" in result and "rounded up to 4 whole bags" in result, result)
        page.fill("#dp-plaster-name",""); page.fill("#dp-plaster-coverage","")
        page.click("button[type=submit]")
        result = page.locator("#dp-result").inner_text()
        check("missing optional product details do not hide the area result at %dpx" % width,
              "38 m²" in result and "Plaster bag count not calculated" in result and "whole bags" not in result, result)
        page.fill("#dp-openings","1000"); page.click("button[type=submit]")
        check("openings larger than manually measured wall area are rejected at %dpx" % width,
              "cannot exceed" in page.locator("#dp-error").inner_text() and page.locator("#dp-result").inner_text() == "")
        page.locator('[data-remove-section]').click()
        check("visitor can remove a mistakenly added wall section at %dpx" % width,
              page.locator("#dp-sections .dp-section").count() == 1)
        page.locator("#dp-unit").focus(); page.keyboard.press("Tab")
        check("keyboard order moves from unit selector to openings at %dpx" % width,
              page.evaluate("document.activeElement.id === 'dp-openings'"))
        check("no browser console or page errors at %dpx" % width, not errors, errors)
        context.close()

    context = browser.new_context(viewport={"width":390,"height":844})
    context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
    home = context.new_page()
    handoff_errors = []
    home.on("pageerror", lambda e: handoff_errors.append(str(e)))
    home.goto(BASE + "home-project-calculator.html", wait_until="domcontentloaded")
    home.locator("#room-root summary").click()
    home.select_option("#room-unit","ft")
    home.fill("#room-length","12"); home.fill("#room-width","10")
    home.fill("#room-height","8"); home.fill("#room-openings","20")
    with home.expect_popup() as popup_info:
        home.locator('button[data-target="drywall-plaster"]').click()
    popup = popup_info.value
    popup.on("pageerror", lambda e: handoff_errors.append(str(e)))
    popup.on("console", lambda msg: handoff_errors.append(msg.text) if msg.type == "error" else None)
    popup.wait_for_load_state("load")
    check("shared room sends net 332 ft² wall area to drywall/plaster", "332 ft²" in popup.locator("#dp-room-note").inner_text())
    popup.click("button[type=submit]")
    check("shared-room-only wall area calculates without a second unit selection", "30.844 m²" in popup.locator("#dp-result").inner_text() or "30.84 m²" in popup.locator("#dp-result").inner_text())
    check("no browser errors during shared-room handoff", not handoff_errors, handoff_errors)
    context.close()
    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Drywall/plaster Chromium QA failed: " + ", ".join(failures))
print("Drywall/plaster Chromium QA passed at 320, 390 and 1280 px, including shared-room handoff.")
