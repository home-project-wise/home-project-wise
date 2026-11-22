"""Chromium QA for the picture hanging planner at phone and desktop widths."""
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
        page.goto(BASE + "picture-hanging-planner.html", wait_until="load")
        check("planner loads at %dpx" % width, page.locator("h1").inner_text() == "Picture Hanging Planner")
        check("no horizontal overflow at %dpx" % width, page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("three semantic worked examples at %dpx" % width, page.locator(".ph-example").count() == 3)
        # Nothing is assumed for the frame height: only the labelled 57 in starting centre is pre-filled.
        check("frame height starts empty at %dpx" % width, page.input_value("#open-height") == "" and page.input_value("#open-centre") == "57")
        page.fill("#open-drop", "3"); page.click("button[type=submit]")
        check("missing frame height is asked for, not assumed, at %dpx" % width, "Enter Frame height" in page.locator("#planner-error").inner_text() and page.locator("#planner-result").is_hidden())
        # Mode A: 36 high, centre 57, measured drop 3 => hook 72 in.
        page.fill("#open-height", "36"); page.click("button[type=submit]")
        check("open wall result at %dpx" % width, "72.00 in" in page.locator("#planner-result").inner_text())
        # Metric twin: 91.44 cm frame, centre 144.78 cm, drop 7.62 cm => 182.88 cm hook.
        page.check('input[name=unit][value=cm]')
        page.fill("#open-height", "91.44"); page.fill("#open-centre", "144.78"); page.fill("#open-drop", "7.62")
        page.click("button[type=submit]")
        check("metric open-wall result at %dpx" % width, "182.9 cm" in page.locator("#planner-result").inner_text())
        page.check('input[name=unit][value=in]')
        # Mode B.
        page.select_option("#mode", "furniture")
        for selector, value in (("#furn-top","30"),("#furn-gap","8"),("#furn-height","24"),("#furn-drop","2")): page.fill(selector,value)
        page.click("button[type=submit]")
        check("furniture result at %dpx" % width, "60.00 in" in page.locator("#planner-result").inner_text())
        # Mode C.
        page.select_option("#mode", "two")
        for selector,value in (("#two-left","20"),("#two-bottom","16"),("#two-height","24"),("#two-width","48"),("#two-x1","5"),("#two-drop1","3"),("#two-x2","43"),("#two-drop2","3")): page.fill(selector,value)
        page.click("button[type=submit]")
        t=page.locator("#planner-result").inner_text()
        check("two-hook coordinates at %dpx" % width, "25.00 in" in t and "63.00 in" in t and "37.00 in" in t)
        # Mode D.
        page.select_option("#mode", "studs")
        for selector,value in (("#stud-first","14"),("#stud-left","20"),("#stud-width","40")): page.fill(selector,value)
        page.select_option("#stud-spacing","16"); page.click("button[type=submit]")
        t=page.locator("#planner-result").inner_text()
        check("confirmed studs at %dpx" % width, "30.00 in" in t and "46.00 in" in t and "62.00 in" in t)
        # Irregular positions are accepted as visitor-confirmed data.
        page.select_option("#stud-spacing","individual"); page.fill("#stud-list","13, 31, 47, 59")
        page.click("button[type=submit]")
        check("individual confirmed studs at %dpx" % width, "31.00 in" in page.locator("#planner-result").inner_text())
        # Mode E: two rows, row heights 24 and 20, total 47.
        page.select_option("#mode","gallery")
        page.fill("#gallery-rows","18x24, 12x18\n16x20, 14x16")
        for selector,value in (("#gallery-hgap","2.5"),("#gallery-vgap","3"),("#gallery-cx","60"),("#gallery-cy","60")): page.fill(selector,value)
        page.click("button[type=submit]")
        t=page.locator("#planner-result").inner_text()
        check("two-row gallery at %dpx" % width, "32.50 in" in t and "47.00 in" in t)
        check("gallery states its alignment and datum at %dpx" % width, "share a bottom edge" in t and "finished floor" in t)
        check("no browser errors at %dpx" % width, not errors, errors)
        context.close()
    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Picture planner browser QA failed: " + ", ".join(failures))
print("Picture planner Chromium QA passed at 320, 390 and 1280 px.")
