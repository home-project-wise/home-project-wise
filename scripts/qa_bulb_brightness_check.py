"""Responsive Chromium QA for the Bulb Brightness Check and shared-room handoff."""
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
        page.goto(BASE + "bulb-brightness-check.html", wait_until="load")
        check("page loads at %dpx" % width, page.locator("h1").inner_text() == "Bulb Brightness Check")
        check("no horizontal overflow at %dpx" % width, page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("lumens starts blank at %dpx" % width, page.input_value("#lumens-per-bulb") == "" and page.locator("#brightness-result").inner_text() == "")
        page.fill("#fixture-count","2"); page.fill("#bulbs-per-fixture","3"); page.select_option("#room-type","kitchen")
        page.fill("#room-area","24"); page.select_option("#area-unit","m2"); page.click("button[type=submit]")
        check("blank lumens shows a neutral live-region prompt, not a zero or result, at %dpx" % width, page.locator("#brightness-result").inner_text() == "Enter the lumens printed on the bulb box to see your totals." and "0 lumens" not in page.locator("#brightness-result").inner_text())
        page.fill("#lumens-per-bulb","800"); page.click("button[type=submit]")
        result = page.locator("#brightness-result").inner_text()
        check("kitchen example and hand-computed fixture/total arithmetic at %dpx" % width, "1,000+ lumens per fixture" in result and "2,400 lumens per fixture" in result and "4,800 lumens" in result, result)
        check("area ratio is plain lumens per m², not lux at %dpx" % width, "200 lumens per m² of floor" in result and "not lux or foot-candles" in result, result)
        page.select_option("#room-type","living-room"); page.click("button[type=submit]")
        check("living-room source example is 400–800 and explicitly not a target at %dpx" % width, "400–800 lumens per fixture" in page.locator("#brightness-result").inner_text() and "not a target" in page.locator("#brightness-result").inner_text())
        page.select_option("#room-type",""); page.fill("#room-area",""); page.click("button[type=submit]")
        result = page.locator("#brightness-result").inner_text()
        check("no room reference and no area ratio when not entered at %dpx" % width, "ENERGY STAR fixture example" not in result and "floor-area ratio" not in result)
        page.fill("#lumens-per-bulb","0"); page.click("button[type=submit]")
        check("zero lumens is rejected and never shown as a result at %dpx" % width, "greater than zero" in page.locator("#brightness-error").inner_text() and page.locator("#brightness-result").inner_text() == "")
        check("article and source links are present at %dpx" % width, page.locator('a[href*="better-evening-home-lighting"]').count() == 1 and page.locator('a[href*="ES_Fixtures_FactSheet"]').count() == 1)
        page.locator("#room-type").focus(); page.keyboard.press("Tab")
        check("keyboard moves from room type to fixture count at %dpx" % width, page.evaluate("document.activeElement.id === 'fixture-count'"))
        check("no browser errors at %dpx" % width, not errors, errors)
        context.close()

    context = browser.new_context(viewport={"width":390,"height":844})
    context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
    home = context.new_page()
    home.goto(BASE + "home-project-calculator.html", wait_until="domcontentloaded")
    home.locator("#room-root summary").click()
    home.fill("#room-length","5"); home.fill("#room-width","4")
    with home.expect_popup() as popup_info:
        home.locator('button[data-target="bulb-brightness"]').click()
    popup = popup_info.value
    popup.wait_for_load_state("load")
    check("shared room pre-fills 20 m² in the new tool tab", popup.input_value("#room-area") == "20" and popup.input_value("#area-unit") == "m2", popup.input_value("#room-area"))
    check("shared-room handoff note is visible", "copied from your shared room" in popup.locator("#shared-room-note").inner_text())
    context.close()
    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Bulb brightness Chromium QA failed: " + ", ".join(failures))
print("Bulb brightness Chromium QA passed at 320, 390 and 1280 px, including shared-room handoff.")
