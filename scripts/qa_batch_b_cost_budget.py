"""Batch B: independently hand-computed rendered-result QA for project cost and budget planner.

No production calculator code is changed. Expected arithmetic is documented before browser execution.
"""
import functools
import http.server
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1] / "website"

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Quiet, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = "http://127.0.0.1:%d/" % server.server_address[1]
failures = []

def check(name, ok, detail=""):
    print(("PASS " if ok else "FAIL ") + name + ("" if ok else " | " + str(detail)[:400]))
    if not ok:
        failures.append(name)

def project_page(browser):
    context = browser.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
    page = context.new_page()
    page.add_init_script("window.hpwRegion = 'US';")
    page.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
    page.goto(BASE + "home-project-calculator.html#panel-project", wait_until="load")
    page.get_by_role("tab", name="Project cost").click()
    page.wait_for_selector("#plist-root #plist-add-form")
    return context, page

def add_project_item(page, name, qty, unit, mode, price=None):
    page.locator("#plist-name").fill(name)
    page.locator("#plist-qty").fill(str(qty))
    page.locator("#plist-unit").fill(unit)
    page.get_by_role("button", name="Add item", exact=True).click()
    row = page.locator("#plist-items fieldset").filter(has=page.get_by_text(name, exact=True))
    item_id = row.locator("[data-field='quantity']").get_attribute("data-id")
    row.locator("[data-field='mode']").select_option(mode)
    if mode == "known":
        page.locator("#pl-p-" + item_id).fill(str(price))
    return item_id

def calc_project(page):
    page.locator("#plist-calc-form button[type='submit']").click()
    return page.locator("#plist-result").inner_text()

def budget_page(browser):
    context = browser.new_context(viewport={"width": 1280, "height": 900}, reduced_motion="reduce")
    page = context.new_page()
    page.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
    page.goto(BASE + "budget-planner.html", wait_until="load")
    page.select_option("#tmpl", "custom")
    return context, page

def set_budget_rows(page, rows):
    while page.locator("#rows tr").count() < len(rows):
        page.locator("#add-row").click()
    for i, (name, priority, qty, price) in enumerate(rows):
        row = page.locator("#rows tr").nth(i)
        row.locator(".r-n").fill(name)
        row.locator(".r-p").select_option(priority)
        row.locator(".r-q").fill("" if qty is None else str(qty))
        row.locator(".r-u").fill("" if price is None else str(price))
    page.locator("#budget").fill("110")
    page.locator("button.calc-btn").click()

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox"])

    # Project Cost / List — hand calculations are intentionally independent of the app.
    context, page = project_page(browser)
    # 2 × $12.50 = $25; unknown required item excluded; 3 × $4 = $12; known subtotal = $37.
    add_project_item(page, "Primer", 2, "tin", "known", 12.50)
    add_project_item(page, "Unknown labour", 1, "job", "unknown")
    add_project_item(page, "Brushes", 3, "each", "known", 4)
    result = calc_project(page)
    check("Project List normal: known lines total $37 and unknown required line stays excluded",
          "Priced items: $37" in result and "Total: $37" in result and "This total is partial: 1 item(s) have no price and are not included." in result,
          result[:900])
    context.close()

    context, page = project_page(browser)
    # 2.5 × $0.40 = $1.00; explicit zero price is still a known price, not an unknown.
    add_project_item(page, "Fasteners", 2.5, "pack", "known", 0.40)
    add_project_item(page, "Owned tool", 1, "each", "known", 0)
    result = calc_project(page)
    check("Project List boundary: fractional quantity and explicit zero price produce exactly $1",
          "Priced items: $1" in result and "Total: $1" in result and "partial" not in result.lower(),
          result[:700])
    context.close()

    context, page = project_page(browser)
    page.locator("#plist-name").fill("Invalid quantity")
    page.locator("#plist-qty").fill("0")
    page.locator("#plist-unit").fill("box")
    page.get_by_role("button", name="Add item", exact=True).click()
    error = page.locator("#plist-add-error").inner_text()
    check("Project List invalid: zero quantity is rejected before an item is added",
          "Enter a quantity greater than zero." in error and page.locator("#plist-items fieldset").count() == 0,
          error)
    context.close()

    # Budget Planner — USD-only is an explicit product limitation, so a second-currency case is not applicable.
    context, page = budget_page(browser)
    # 2 × $40 + 1 × $30 = $110; at a $110 budget, Must have items fit.
    set_budget_rows(page, [("Hook rail", "must", 2, 40), ("Boot mat", "must", 1, 30)])
    result = page.locator("#calc-out").inner_text()
    check("Budget Planner normal: 2×$40 + $30 = $110 and essentials fit a $110 budget",
          "Must have: $110" in result and "The must-haves fit your budget of $110" in result,
          result[:700])
    context.close()

    context, page = budget_page(browser)
    # A zero price is explicit; $40 + 0 = $40 and is fully priced.
    set_budget_rows(page, [("Hook rail", "must", 1, 40), ("Owned mat", "must", 1, 0)])
    result = page.locator("#calc-out").inner_text()
    check("Budget Planner boundary: explicit zero is priced; total is $40 without missing-price warning",
          "Must have: $40" in result and "The must-haves fit your budget of $110" in result and "no price or quantity yet" not in result,
          result[:700])
    context.close()

    context, page = budget_page(browser)
    # Blank quantity is unknown, not zero; it must prevent a positive affordability claim.
    set_budget_rows(page, [("Hook rail", "must", 1, 40), ("Boot mat", "must", None, 30)])
    result = page.locator("#calc-out").inner_text()
    error = page.locator("#calc-err").inner_text()
    check("Budget Planner invalid: blank quantity remains unknown and blocks a fit claim",
          "The must-haves fit your budget" not in result and "cannot tell yet" in result.lower()
          and "Enter a quantity for: Boot mat" in error,
          {"result": result[:650], "error": error})
    context.close()

    browser.close()
server.shutdown()
if failures:
    raise SystemExit("Batch B rendered QA failed: " + ", ".join(failures))
print("Batch B rendered QA passed: 3 Project List cases + 3 Budget Planner cases.")
