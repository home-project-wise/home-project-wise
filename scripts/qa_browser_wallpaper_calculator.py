#!/usr/bin/env python3
"""Real-browser checks for the Wallpaper tab. Run: python3 scripts/qa_browser_wallpaper_calculator.py [shots_dir]"""
import sys, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parents[1]
URL = (ROOT / "website" / "home-project-calculator.html").as_uri()
SHOTS = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else None
fails, passes = [], 0
def check(name, cond, extra=""):
    global passes
    if cond: passes += 1
    else: fails.append(name + " " + str(extra)); print("FAIL", name, extra)
SECRET = ["Secret Lounge", "7777", "88.88", "Hidden Label"]
def fill_product(pg, unit="in", rw="20.5", ln="396", sale="double roll", match="straight", rep="20", price="", cur="USD"):
    pg.select_option("#wp-unit", unit); pg.fill("#wp-saleunit", sale); pg.fill("#wp-rollwidth", rw); pg.fill("#wp-length", ln)
    pg.select_option("#wp-match", match)
    if match == "straight": pg.fill("#wp-repeat", rep)
    pg.fill("#wp-price", price); pg.fill("#wp-currency", cur)
def fill_room(pg, idx, label, h, trim, walls):
    room = pg.locator(".wp-room").nth(idx)
    room.locator(".wp-room-label").fill(label); room.locator(".wp-height").fill(h); room.locator(".wp-trim").fill(trim)
    while room.locator(".wp-wallw").count() < len(walls): room.locator(".wp-add-wall").click()
    for i, w in enumerate(walls): room.locator(".wp-wallw").nth(i).fill(str(w))
with sync_playwright() as p:
    b = p.chromium.launch()
    for vw, vh in [(320,700),(360,740),(390,800),(412,880),(768,900),(1280,900),(740,360)]:
        ctx = b.new_context(viewport={"width": vw, "height": vh}); pg = ctx.new_page()
        reqs, cons, nav = [], [], []
        pg.on("request", lambda r: reqs.append(r.url)); pg.on("console", lambda m: cons.append(m.text))
        pg.goto(URL); pg.wait_for_selector("#tab-wallpaper")
        pg.on("framenavigated", lambda f: nav.append(f.url))
        tabs = pg.locator(".calc-tabs button"); check(f"{vw}: six tabs", tabs.count() == 6)
        pg.focus("#tab-project"); pg.keyboard.press("ArrowRight")
        check(f"{vw}: ArrowRight reaches Wallpaper", pg.get_attribute("#tab-wallpaper", "aria-selected") == "true" and pg.evaluate("document.activeElement.id") == "tab-wallpaper")
        check(f"{vw}: panel visible", pg.is_visible("#panel-wallpaper")); check(f"{vw}: other tabs unselected", pg.locator('.calc-tabs [aria-selected="true"]').count() == 1)
        fill_product(pg); fill_room(pg, 0, "Secret Lounge", "96", "6", [144, 180, 144, 180])
        pg.click("#wp-form button[type=submit]")
        txt = pg.inner_text("#wp-result")
        check(f"{vw}: worked example 12 double rolls", "Total to buy: 12" in txt and "34 strip(s)" in txt and "3 strip(s) per double roll" in txt, txt[:200])
        check(f"{vw}: blank price -> cost not entered", "not entered" in txt)
        check(f"{vw}: no horizontal overflow", pg.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), pg.evaluate("document.documentElement.scrollWidth"))
        if vw in (360, 1280) and SHOTS: pg.locator("#panel-wallpaper").screenshot(path=str(SHOTS / f"wallpaper-{vw}.png"))
        if vw == 390:
            # second room is rounded separately
            pg.click("#wp-add-room"); check("focus moves to new room name", pg.evaluate("document.activeElement.className").find("wp-room-label") >= 0)
            fill_room(pg, 1, "Hidden Label", "96", "6", [100])
            pg.click("#wp-form button[type=submit]"); t2 = pg.inner_text("#wp-result")
            check("two rooms rounded separately (12+2=14)", "Total to buy: 14" in t2, t2[:120])
            check("results clear when inputs change", (pg.fill("#wp-rollwidth", "20.5"), pg.inner_text("#wp-result"))[1] == "")
            pg.click("#wp-form button[type=submit]")
            # remove room returns focus
            pg.locator(".wp-remove-room").nth(1).click(); check("remove room focuses Add room", pg.evaluate("document.activeElement.id") == "wp-add-room")
            check("last room cannot be removed", pg.locator(".wp-remove-room").first.is_disabled())
            # unsupported matches disabled
            opts = pg.eval_on_selector_all("#wp-match option", "o=>o.map(x=>[x.textContent,x.disabled])")
            check("half-drop and mural disabled", sum(1 for _, d in opts if d) == 2, opts)
            # invalid inputs
            pg.fill("#wp-rollwidth", ""); pg.click("#wp-form button[type=submit]"); check("invalid roll width alert", "Usable roll width" in pg.inner_text("#wp-error"))
            pg.fill("#wp-rollwidth", "20.5"); pg.fill("#wp-price", "24.99"); pg.fill("#wp-currency", "us"); pg.click("#wp-form button[type=submit]"); check("bad currency alert", "three-letter" in pg.inner_text("#wp-error"))
            pg.fill("#wp-currency", "usd"); pg.click("#wp-form button[type=submit]"); tp = pg.inner_text("#wp-result")
            check("priced: USD 299.88", "USD 299.88" in tp, tp[:200])
            pg.fill("#wp-budget-amount", "400"); pg.click("#wp-budget-btn"); bo = pg.inner_text("#wp-budget-out"); check("budget check returns a result", "Result:" in bo and "contingency" in bo.lower(), bo)
            pg.fill("#wp-budget-currency", "EUR"); pg.click("#wp-budget-btn"); check("currency mismatch blocked", "never converted" in pg.inner_text("#wp-budget-out"))
            # blank price keeps unknown: budget cannot assess
            pg.fill("#wp-price", ""); pg.click("#wp-form button[type=submit]"); pg.fill("#wp-budget-amount", "400"); pg.click("#wp-budget-btn")
            check("unknown price cannot assess", "cannot assess" in pg.inner_text("#wp-budget-out").lower(), pg.inner_text("#wp-budget-out"))
            # other tab untouched
            pg.click("#tab-measure"); pg.fill("#measure-length", "4"); pg.fill("#measure-width", "3"); pg.click("#measure-form button[type=submit]"); check("area tab still works", "12" in pg.inner_text("#measure-result"))
            # privacy
            check("no storage keys", pg.evaluate("localStorage.length+sessionStorage.length") == 0 and pg.evaluate("document.cookie") == "")
            check("URL has no entered values", not any(s in pg.url for s in SECRET) and not any(any(s in u for s in SECRET) for u in nav))
            check("no request carries values", not any(any(s in u for s in SECRET) for u in reqs), reqs)
            check("no console output with values", not any(any(s in c for s in SECRET) for c in cons), cons)
            ext = [u for u in reqs if not u.startswith("file:") and "goatcounter" not in u and "gc.zgo.at" not in u]; check("no unexpected external requests", not ext, ext)
        ctx.close()
    # dark scheme smoke
    ctx = b.new_context(viewport={"width": 390, "height": 800}, color_scheme="dark"); pg = ctx.new_page(); pg.goto(URL); pg.click("#tab-wallpaper")
    if SHOTS: pg.locator("#panel-wallpaper").screenshot(path=str(SHOTS / "wallpaper-390-dark.png"))
    b.close()
print(f"{passes} checks passed, {len(fails)} failed"); sys.exit(1 if fails else 0)
