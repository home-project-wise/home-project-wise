"""Chromium acceptance checks for the additive, source-backed T4c Project List presets."""
import functools
import http.server
import threading
import os
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "website")
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = "http://127.0.0.1:%d/" % server.server_address[1]
failures = []

def check(name, ok, detail=""):
    print(("PASS " if ok else "FAIL ") + name + ("" if ok else " | " + str(detail)[:500]))
    if not ok:
        failures.append(name)

EXPECTED_SMART = [
    "Smart plug", "Smart bulb", "Smart switch or dimmer",
    "Bridge", "Wireless remote", "Switch cover"
]
EXPECTED_HANG = [
    "Stud finder", "Wood screw", "Drywall anchors", "Toggle bolts",
    "Picture hangers", "French cleat", "Rubber bumpers"
]

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox"])
    for width in (320, 390, 1280):
        context = browser.new_context(viewport={"width": width, "height": 1100})
        context.route(
            "**/*",
            lambda route: route.fulfill(status=200, content_type="application/javascript", body="")
            if "gc.zgo.at" in route.request.url
            else (route.continue_() if route.request.url.startswith(BASE) else route.abort())
        )
        page = context.new_page()
        page_errors, console_errors = [], []
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.goto(BASE + "home-project-calculator.html#panel-project", wait_until="load")
        page.get_by_role("tab", name="Project cost").click()
        page.wait_for_selector("#plist-preset-smart-home")
        check("both preset controls are visible at %dpx" % width,
              page.locator("#plist-preset-smart-home").is_visible() and page.locator("#plist-preset-hang-mount").is_visible())

        # Add a visitor-created item first; presets must be additive.
        page.locator("#plist-name").fill("My own paint")
        page.locator("#plist-qty").fill("2")
        page.locator("#plist-unit").fill("tin")
        page.get_by_role("button", name="Add item", exact=True).click()

        # Activate the first preset using the keyboard.
        first = page.locator("#plist-preset-smart-home")
        first.focus()
        page.keyboard.press("Enter")
        state = page.evaluate("window.hpwProjectListState.items.map(x => ({name:x.name, quantity:x.quantity, unit:x.unit, price:x.price, low:x.low, high:x.high, currency:x.currency, mode:x.mode, sources:x.sourceArticles}))")
        expected = ["My own paint"] + EXPECTED_SMART
        check("keyboard activation adds the six Smart home starter names at %dpx" % width,
              [x["name"] for x in state] == expected, state)
        check("preset-added quantity, unit, price and quote fields are blank at %dpx" % width,
              all(not x["quantity"] and not x["unit"] and not x["price"] and not x["low"] and not x["high"] and not x["currency"] and x["mode"] == "unknown" for x in state[1:]), state)
        check("visitor item and its entered quantity/unit remain unchanged at %dpx" % width,
              state[0]["quantity"] == "2" and state[0]["unit"] == "tin" and state[0]["name"] == "My own paint", state[0])
        check("every Smart home preset item visibly links to a source article at %dpx" % width,
              page.locator("#plist-items fieldset").count() == 7 and page.locator("#plist-items a[href^='articles/']").count() >= 6)

        # Re-selecting the same preset must be idempotent.
        first.click()
        count_after_repeat = page.evaluate("window.hpwProjectListState.items.length")
        check("repeated Smart home selection creates no duplicate at %dpx" % width, count_after_repeat == 7, count_after_repeat)

        # Second preset is keyboard operable too.
        second = page.locator("#plist-preset-hang-mount")
        second.focus()
        page.keyboard.press("Enter")
        all_state = page.evaluate("window.hpwProjectListState.items.map(x => ({name:x.name, quantity:x.quantity, unit:x.unit, price:x.price, sources:x.sourceArticles}))")
        names = [x["name"] for x in all_state]
        check("keyboard activation adds Hang and mount without removing earlier items at %dpx" % width,
              names == expected + EXPECTED_HANG, names)
        check("preset list contains no duplicate item names at %dpx" % width,
              len({x.lower() for x in names}) == len(names), names)
        check("all preset items retain source article provenance at %dpx" % width,
              all(x["sources"] for x in all_state[1:]), all_state)

        # Tab navigation must reach the list's quantity and unit controls.
        second.focus()
        keyboard_fields = set()
        for _ in range(20):
            page.keyboard.press("Tab")
            field = page.evaluate("document.activeElement.getAttribute('data-field')")
            if field in ("quantity", "unit"):
                keyboard_fields.add(field)
            if keyboard_fields == {"quantity", "unit"}:
                break
        check("keyboard tab order reaches quantity and unit fields at %dpx" % width,
              keyboard_fields == {"quantity", "unit"}, sorted(keyboard_fields))

        # Source attribution is also present on the actual rows, including both source links for shared items.
        anchor_row = page.locator("#plist-items fieldset").filter(has=page.get_by_text("Drywall anchors", exact=True))
        check("Drywall anchor row shows both source articles at %dpx" % width,
              anchor_row.locator("a").count() == 2, anchor_row.inner_text())
        cleat_row = page.locator("#plist-items fieldset").filter(has=page.get_by_text("French cleat", exact=True))
        check("French cleat row shows both source articles at %dpx" % width,
              cleat_row.locator("a").count() == 2, cleat_row.inner_text())

        # No preset action inserts an amount or computes a total.
        preset_inputs = page.locator("#plist-items input[data-field='quantity'], #plist-items input[data-field='unit']")
        check("quantity and unit cells remain blank for all preset rows at %dpx" % width,
              all(not preset_inputs.nth(i).input_value() for i in range(2, preset_inputs.count())), [preset_inputs.nth(i).input_value() for i in range(preset_inputs.count())])
        check("prices and totals remain empty after either preset at %dpx" % width,
              page.locator("#plist-result").inner_text().strip() == "" and page.locator("#plist-items input[data-field='price']").count() == 0)
        page.get_by_role("button", name="Calculate project list").click()
        check("incomplete preset cannot produce a total at %dpx" % width,
              "Enter a unit for" in page.locator("#plist-error").inner_text() and page.locator("#plist-result").inner_text().strip() == "",
              page.locator("#plist-error").inner_text())

        check("no horizontal overflow at %dpx" % width,
              page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        clipped = page.locator("#plist-presets button").evaluate_all("(els) => els.some(el => el.scrollWidth > el.clientWidth + 1)")
        check("preset button labels are not clipped at %dpx" % width, not clipped)
        check("no page or console errors at %dpx" % width, not page_errors and not console_errors,
              {"page": page_errors, "console": console_errors})
        context.close()
    browser.close()

server.shutdown()
if failures:
    raise SystemExit("T4c Project List preset Chromium QA failed: " + ", ".join(failures))
print("T4c Project List preset Chromium QA passed at 320, 390 and 1280 px.")
