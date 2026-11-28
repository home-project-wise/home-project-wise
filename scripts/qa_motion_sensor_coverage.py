#!/usr/bin/env python3
"""Responsive browser checks for the T4f area-only motion sensor coverage calculator."""
from __future__ import annotations
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "website"
OUT = ROOT / "visual-qa-results"
OUT.mkdir(parents=True, exist_ok=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass

import os
os.chdir(SITE)
server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
Thread(target=server.serve_forever, daemon=True).start()
base = f"http://127.0.0.1:{server.server_port}"
checks = []
failures = []

def check(name, condition, detail=""):
    item = {"name": name, "passed": bool(condition), "detail": str(detail)[:500]}
    checks.append(item)
    if not condition:
        failures.append(item)
        print("FAIL", name, detail)
    else:
        print("PASS", name)

def route_request(route):
    host = (urlparse(route.request.url).hostname or "").lower()
    if host == "gc.zgo.at" or "goatcounter" in host:
        route.abort()
    else:
        route.continue_()

try:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for label, width, height in (("mobile-320", 320, 740), ("mobile-390", 390, 844), ("desktop-1280", 1280, 900)):
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme="light", reduced_motion="reduce")
            page = context.new_page()
            page_errors, console_errors = [], []
            page.on("pageerror", lambda exc, acc=page_errors: acc.append(str(exc)))
            page.on("console", lambda msg, acc=console_errors: acc.append(msg.text) if msg.type == "error" and "gc.zgo.at" not in (msg.location or {}).get("url", "") and "goatcounter" not in (msg.location or {}).get("url", "") else None)
            page.route("**/*", route_request)
            try:
                response = page.goto(base + "/motion-sensor-coverage-calculator.html", wait_until="domcontentloaded", timeout=30000)
                check(f"{label}: page responds 200", bool(response and response.status == 200), response.status if response else "no response")
                page.wait_for_selector("#msc-form", timeout=15000)
                check(f"{label}: one H1 and no prefilled measurement or unit",
                      page.locator("h1").count() == 1 and page.input_value("#msc-area") == "" and
                      page.input_value("#msc-coverage") == "" and page.input_value("#msc-unit") == "")
                page.fill("#msc-area", "70")
                page.fill("#msc-coverage", "20")
                page.select_option("#msc-unit", "m2")
                page.click("#msc-form button[type=submit]")
                result = page.inner_text("#msc-result")
                check(f"{label}: 70 m² / 20 m² returns four sensors",
                      "Minimum by area only: 4 sensors." in result and "70 ÷ 20 = 3.5" in result and "rounded up = 4" in result, result)
                check(f"{label}: output includes all limits",
                      "not a placement plan" in result and "security assessment" in result and
                      "safety assessment" in result and "Overlap is not included" in result, result)
                page.fill("#msc-coverage", "0")
                page.click("#msc-form button[type=submit]")
                check(f"{label}: zero coverage stops and clears result",
                      "greater than zero" in page.inner_text("#msc-error") and page.locator("#msc-result").inner_text() == "")
                page.fill("#msc-coverage", "")
                page.click("#msc-form button[type=submit]")
                check(f"{label}: missing manufacturer area explains range/angle stop",
                      "cannot convert them into an area" in page.inner_text("#msc-error") and page.locator("#msc-result").inner_text() == "")
                page.fill("#msc-coverage", "20")
                page.select_option("#msc-unit", "")
                page.click("#msc-form button[type=submit]")
                check(f"{label}: missing unit stops calculation",
                      "Choose square metres or square feet" in page.inner_text("#msc-error"))
                check(f"{label}: no horizontal overflow", page.evaluate("document.documentElement.scrollWidth") <= width + 1,
                      page.evaluate("document.documentElement.scrollWidth"))
                if width == 1280:
                    page.select_option("#msc-unit", "m2")
                    page.locator("#msc-area").focus()
                    page.keyboard.press("Tab")
                    check(f"{label}: keyboard order reaches coverage input", page.evaluate("document.activeElement.id === 'msc-coverage'"))
                    page.keyboard.press("Enter")
                    check(f"{label}: Enter submits calculation", "Minimum by area only: 4 sensors." in page.inner_text("#msc-result"))
                check(f"{label}: no page or console errors", not page_errors and not console_errors, (page_errors + console_errors)[:5])
                shot = OUT / f"t4f-motion-sensor-{width}x{height}.png"
                page.screenshot(path=str(shot), full_page=True, animations="disabled")
            except Exception as exc:
                check(f"{label}: browser scenario completes", False, repr(exc))
            finally:
                context.close()

        # Shared-room action row: confirm the ninth action still fits at phone and desktop widths.
        for label, width, height in (("shared-room-320", 320, 740), ("shared-room-390", 390, 844), ("shared-room-1280", 1280, 900)):
            context = browser.new_context(viewport={"width": width, "height": height}, color_scheme="light", reduced_motion="reduce")
            page = context.new_page()
            page.route("**/*", route_request)
            try:
                page.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
                page.locator("#room-root summary").click()
                buttons = page.locator('#room-form button[data-target]')
                check(f"{label}: all nine shared-room actions are present", buttons.count() == 9, buttons.count())
                check(f"{label}: expanded shared-room row has no horizontal overflow",
                      page.evaluate("document.documentElement.scrollWidth") <= width, page.evaluate("document.documentElement.scrollWidth"))
            except Exception as exc:
                check(f"{label}: shared-room responsive row", False, repr(exc))
            finally:
                context.close()

        # Shared-room integration: only the measured floor area and unit are transferred.
        context = browser.new_context(viewport={"width": 390, "height": 844}, color_scheme="light", reduced_motion="reduce")
        opener = context.new_page()
        opener_errors, popup_errors = [], []
        opener.on("pageerror", lambda exc: opener_errors.append(str(exc)))
        opener.route("**/*", route_request)
        try:
            opener.goto(base + "/home-project-calculator.html", wait_until="domcontentloaded", timeout=30000)
            opener.locator("#room-root summary").click()
            opener.select_option("#room-unit", "ft")
            opener.fill("#room-length", "12")
            opener.fill("#room-width", "10")
            with opener.expect_popup() as popup_info:
                opener.click('#room-form button[data-target="motion-sensor-coverage"]')
            popup = popup_info.value
            popup.route("**/*", route_request)
            popup.on("pageerror", lambda exc: popup_errors.append(str(exc)))
            popup.wait_for_selector("#msc-form", timeout=15000)
            check("shared-room: 12 × 10 ft transfers editable 120 ft² only",
                  popup.input_value("#msc-area") == "120" and popup.input_value("#msc-unit") == "ft2" and
                  popup.input_value("#msc-coverage") == "",
                  {"area": popup.input_value("#msc-area"), "unit": popup.input_value("#msc-unit"),
                   "coverage": popup.input_value("#msc-coverage")})
            check("shared-room: no page errors", not opener_errors and not popup_errors, opener_errors + popup_errors)
            popup.close()

            # Regression: binary 3 * 1.1 must be handed off as decimal 3.3.
            opener.select_option("#room-unit", "m")
            opener.fill("#room-length", "3")
            opener.fill("#room-width", "1.1")
            with opener.expect_popup() as popup_info:
                opener.click('#room-form button[data-target="motion-sensor-coverage"]')
            popup = popup_info.value
            popup.route("**/*", route_request)
            popup.on("pageerror", lambda exc: popup_errors.append(str(exc)))
            popup.wait_for_selector("#msc-form", timeout=15000)
            check("shared-room: 3 × 1.1 m is prefilled as exact 3.3 m²",
                  popup.input_value("#msc-area") == "3.3" and popup.input_value("#msc-unit") == "m2",
                  popup.input_value("#msc-area"))
            popup.fill("#msc-coverage", "3.3")
            popup.click('#msc-form button[type="submit"]')
            check("shared-room: 3.3 m² / 3.3 m² returns one sensor",
                  "Minimum by area only: 1 sensor." in popup.inner_text("#msc-result"),
                  popup.inner_text("#msc-result"))
            popup.fill("#msc-coverage", "1.1")
            popup.click('#msc-form button[type="submit"]')
            check("shared-room: 3.3 m² / 1.1 m² returns three sensors",
                  "Minimum by area only: 3 sensors." in popup.inner_text("#msc-result"),
                  popup.inner_text("#msc-result"))
            popup.close()
        except Exception as exc:
            check("shared-room: popup handoff completes", False, repr(exc))
        finally:
            context.close()
        browser.close()
finally:
    server.shutdown()

report = {"status": "fail" if failures else "pass", "checks": checks, "failures": failures}
(OUT / "t4f-motion-sensor-coverage-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print(f"T4f Chromium QA: {len(checks) - len(failures)}/{len(checks)} checks passed")
raise SystemExit(1 if failures else 0)
