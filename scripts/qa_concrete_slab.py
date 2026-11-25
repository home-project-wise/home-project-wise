"""Responsive Chromium QA for concrete slab volume and shared-room handoff."""
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
        context = browser.new_context(viewport={"width": width, "height": 900})
        context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(BASE + "concrete-slab-calculator.html", wait_until="load")
        check("page loads at %dpx" % width, page.locator("h1").inner_text() == "Concrete Slab Volume Calculator")
        check("no horizontal overflow at %dpx" % width, page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("thickness and extra allowance have no assumed defaults at %dpx" % width, page.input_value("#slab-thickness") == "" and page.input_value("#slab-allowance") == "")
        page.click("button[type=submit]")
        check("blank dimensions show validation and no result at %dpx" % width,
              "Length is required" in page.locator("#concrete-slab-error").inner_text() and page.locator("#concrete-slab-result").inner_text() == "")
        page.select_option("#slab-length-unit","ft")
        page.fill("#slab-length","10"); page.fill("#slab-width","10")
        page.select_option("#slab-thickness-unit","in"); page.fill("#slab-thickness","4")
        page.click("button[type=submit]")
        result = page.locator("#concrete-slab-result").inner_text()
        check("imperial example shows hand-computed cubic feet, yards and metres at %dpx" % width,
              "33.333 ft³" in result and "1.235 yd³" in result and "0.9439 m³" in result, result)
        check("entered formula and conversion factors are shown at %dpx" % width,
              "10 ft × 10 ft × 4 in" in result and "0.3048 m" in result)
        page.fill("#slab-product-name","Named test mix"); page.fill("#slab-bag-yield","0.5")
        page.select_option("#slab-bag-yield-unit","ft3"); page.click("button[type=submit]")
        result = page.locator("#concrete-slab-result").inner_text()
        check("named product yield rounds bag count up at %dpx" % width, "67 whole bags" in result and "rounded up" in result, result)
        page.fill("#slab-allowance","10"); page.click("button[type=submit]")
        result = page.locator("#concrete-slab-result").inner_text()
        check("only visitor-entered allowance changes the bag estimate at %dpx" % width, "Your entered extra allowance: 10%" in result and "74 whole bags" in result, result)
        page.fill("#slab-allowance","");
        page.fill("#slab-product-name",""); page.fill("#slab-bag-yield",""); page.fill("#slab-thickness","0")
        page.click("button[type=submit]")
        check("zero thickness is rejected at %dpx" % width,
              "greater than zero" in page.locator("#concrete-slab-error").inner_text() and page.locator("#concrete-slab-result").inner_text() == "")
        page.fill("#slab-thickness","10"); page.select_option("#slab-length-unit","m")
        page.fill("#slab-length","3"); page.fill("#slab-width","2")
        page.select_option("#slab-thickness-unit","cm"); page.click("button[type=submit]")
        result = page.locator("#concrete-slab-result").inner_text()
        check("metric example calculates 0.6 cubic metres at %dpx" % width,
              "0.6 m³" in result and "21.189 ft³" in result and "0.785 yd³" in result, result)
        check("design disclaimer and NIST source are present at %dpx" % width,
              "not a slab design" in result and page.locator('a[href*="nist.gov"]').count() == 1)
        page.locator("#slab-thickness").focus(); page.keyboard.press("Tab")
        check("keyboard order proceeds from thickness to product name at %dpx" % width,
              page.evaluate("document.activeElement.id === 'slab-product-name'"))
        check("no browser errors at %dpx" % width, not errors, errors)
        context.close()

    context = browser.new_context(viewport={"width":390,"height":844})
    context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
    home = context.new_page()
    home.goto(BASE + "home-project-calculator.html", wait_until="domcontentloaded")
    home.locator("#room-root summary").click()
    home.select_option("#room-unit","m"); home.fill("#room-length","5"); home.fill("#room-width","4")
    with home.expect_popup() as popup_info:
        home.locator('button[data-target="concrete-slab"]').click()
    popup = popup_info.value
    popup.wait_for_load_state("load")
    check("shared room sends 5 × 4 metres to slab tool", popup.input_value("#slab-length") == "5" and
          popup.input_value("#slab-width") == "4" and popup.input_value("#slab-length-unit") == "m")
    check("shared-room handoff leaves thickness blank", popup.input_value("#slab-thickness") == "")
    check("shared-room note says thickness remains visitor-entered",
          "Thickness is still blank" in popup.locator("#slab-room-note").inner_text())
    context.close()
    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Concrete slab Chromium QA failed: " + ", ".join(failures))
print("Concrete slab Chromium QA passed at 320, 390 and 1280 px, including shared-room handoff.")
