#!/usr/bin/env python3
"""Warnings-only sanity fixtures for the Home Project Calculator.

Every warning trigger is an exact zero condition, not an invented magnitude limit.
The fixtures compare hand-calculated outputs at zero and positive values and
confirm that existing negative-input validation is unchanged.
"""
from __future__ import annotations
import functools
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1] / "website"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = "http://127.0.0.1:%d/" % server.server_address[1]
failures: list[str] = []
checks = 0


def check(name: str, ok: bool, detail: object = "") -> None:
    global checks
    checks += 1
    print(("PASS " if ok else "FAIL ") + name + ("" if ok else " | " + str(detail)[:500]))
    if not ok:
        failures.append(name)


def text(page, selector: str) -> str:
    return page.locator(selector).inner_text()


try:
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])
        for width in (320, 390, 1280):
            context = browser.new_context(viewport={"width": width, "height": 900})
            page = context.new_page()
            page_errors: list[str] = []
            console_errors: list[str] = []
            page.on("pageerror", lambda exc: page_errors.append(str(exc)))
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

            def route_request(route):
                req = route.request
                if req.resource_type == "document":
                    response = route.fetch()
                    html = response.text()
                    html = re.sub(
                        r'<script\b(?=[^>]*(?:gc\.zgo\.at|goatcounter))[^>]*>\s*</script>',
                        "",
                        html,
                        flags=re.IGNORECASE,
                    )
                    route.fulfill(response=response, body=html)
                elif (urlparse(req.url).hostname or "").lower() == "gc.zgo.at":
                    route.abort()
                else:
                    route.continue_()

            page.route("**/*", route_request)
            response = page.goto(BASE + "home-project-calculator.html", wait_until="load")
            check("calculator page loads at %dpx" % width, bool(response and response.status == 200))
            page.evaluate("() => { window.hpwRegion = 'US'; window.dispatchEvent(new Event('hpw-region')); }")

            # Area & volume: zero depth is a meaningful zero result, but can be accidental.
            page.fill("#measure-length", "4")
            page.fill("#measure-width", "3")
            page.fill("#measure-depth", "0")
            page.locator("#measure-form button[type=submit]").click()
            result = text(page, "#measure-result")
            check("zero depth warns without blocking at %dpx" % width,
                  "Does this look right?" in result and "Depth is 0" in result, result)
            check("zero depth keeps hand-calculated area, perimeter and volume at %dpx" % width,
                  "Floor area: 12 m²" in result and "Perimeter: 14 m" in result and "Volume: 0 m³" in result, result)

            page.fill("#measure-depth", "0.01")
            page.locator("#measure-form button[type=submit]").click()
            result = text(page, "#measure-result")
            check("positive depth just above zero has no warning at %dpx" % width,
                  "Does this look right?" not in result and "Volume: 0.12 m³" in result, result)

            page.fill("#measure-depth", "")
            page.locator("#measure-form button[type=submit]").click()
            result = text(page, "#measure-result")
            check("blank optional depth remains omitted, not treated as zero at %dpx" % width,
                  "Does this look right?" not in result and "Volume:" not in result, result)

            page.fill("#measure-depth", "-0.01")
            page.locator("#measure-form button[type=submit]").click()
            check("negative depth still follows existing validation at %dpx" % width,
                  "Depth or height cannot be negative" in text(page, "#measure-error") and text(page, "#measure-result") == "")

            # Electricity: exact zero usage produces a numeric zero; warn, but preserve the result.
            page.locator('.calc-tabs button[aria-controls="panel-energy"]').click()
            page.fill("#energy-watts", "100")
            page.fill("#energy-hours", "0")
            page.fill("#energy-days", "30")
            page.fill("#energy-rate", "0.2")
            page.locator("#energy-form button[type=submit]").click()
            result = text(page, "#energy-result")
            check("zero hours warns without blocking at %dpx" % width,
                  "Does this look right?" in result and "Hours used per day is 0" in result, result)
            check("zero hours keeps monthly kWh and cost at zero at %dpx" % width,
                  "0 kWh per month" in result and "Estimated monthly cost: USD 0.00" in result, result)

            page.fill("#energy-hours", "0.01")
            page.locator("#energy-form button[type=submit]").click()
            result = text(page, "#energy-result")
            check("positive hours just above zero has no warning and keeps arithmetic at %dpx" % width,
                  "Does this look right?" not in result and "0.03 kWh per month" in result, result)

            page.fill("#energy-hours", "3")
            page.fill("#energy-days", "0")
            page.locator("#energy-form button[type=submit]").click()
            result = text(page, "#energy-result")
            check("zero days warns without blocking at %dpx" % width,
                  "Does this look right?" in result and "Days used per month is 0" in result, result)
            check("zero days keeps monthly kWh and cost at zero at %dpx" % width,
                  "0 kWh per month" in result and "Estimated monthly cost: USD 0.00" in result, result)

            page.fill("#energy-days", "0.5")
            page.locator("#energy-form button[type=submit]").click()
            result = text(page, "#energy-result")
            check("positive days just above zero has no warning and keeps arithmetic at %dpx" % width,
                  "Does this look right?" not in result and "0.15 kWh per month" in result, result)

            page.fill("#energy-days", "-0.01")
            page.locator("#energy-form button[type=submit]").click()
            check("negative days still follows existing validation at %dpx" % width,
                  "Hours must be 0–24, days 0–31" in text(page, "#energy-error") and text(page, "#energy-result") == "")

            # Quick estimate: a zero unit price can be deliberate, but should be confirmed.
            page.locator('.calc-tabs button[aria-controls="panel-project"]').click()
            page.locator("details.quick-estimate summary").click()
            page.fill("#project-quantity", "2")
            page.fill("#project-unit-price", "0")
            page.fill("#project-extra", "0")
            page.fill("#project-contingency", "0")
            page.fill("#project-tax", "0")
            page.locator("#project-form button[type=submit]").click()
            result = text(page, "#project-result")
            check("zero unit price warns without blocking at %dpx" % width,
                  "Does this look right?" in result and "Price per unit is 0" in result, result)
            check("zero unit price preserves the hand-calculated zero total at %dpx" % width,
                  "Materials and extras: USD 0.00" in result and "Estimated project total: USD 0.00" in result, result)

            page.fill("#project-unit-price", "0.01")
            page.locator("#project-form button[type=submit]").click()
            result = text(page, "#project-result")
            check("positive unit price just above zero has no warning and preserves arithmetic at %dpx" % width,
                  "Does this look right?" not in result and "Materials and extras: USD 0.02" in result and "Estimated project total: USD 0.02" in result, result)

            page.fill("#project-unit-price", "-0.01")
            page.locator("#project-form button[type=submit]").click()
            check("negative unit price still follows existing validation at %dpx" % width,
                  "Prices and extras must be non-negative" in text(page, "#project-error") and text(page, "#project-result") == "")

            check("no horizontal overflow at %dpx" % width,
                  page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"),
                  page.evaluate("({doc:document.documentElement.scrollWidth, viewport:innerWidth})"))
            check("no browser page errors at %dpx" % width, not page_errors, page_errors)
            check("no browser console errors at %dpx" % width, not console_errors, console_errors)
            context.close()
        browser.close()
finally:
    server.shutdown()
    server.server_close()

print("%d sanity browser checks; %d failed" % (checks, len(failures)))
if failures:
    raise SystemExit("Failed checks: " + ", ".join(failures))
