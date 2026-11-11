#!/usr/bin/env python3
"""Real-browser checks for the Wallpaper tab's two-product comparison and UI state.
Run: python3 scripts/qa_browser_wallpaper_compare.py   (needs: pip install playwright; playwright install chromium)
Automated checks only: this is not visual sign-off, Safari/Firefox, screen-reader or real-device testing."""
import sys, os, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parents[1]
# Deployed pages get article-overrides.css appended to style.css; build that copy and pass HPW_SITE_ROOT=<dir> to test it.
SITE = pathlib.Path(os.environ.get("HPW_SITE_ROOT", ROOT / "website"))
URL = (SITE / "home-project-calculator.html").as_uri()
fails, passes = [], 0
def check(name, cond, extra=""):
    global passes
    if cond: passes += 1
    else: fails.append(name); print("FAIL", name, str(extra)[:300])
SECRET = ["Zeta Lounge", "Omega Hall", "5555", "Brand Alpha", "Brand Beta", "31.37"]
def fill_p(pg, pre, unit=None, sale="double roll", rw="20.5", ln="396", match="free", rep="", price="", cur="USD"):
    if unit: pg.select_option("#wp-unit", unit)
    pg.fill(f"#{pre}-saleunit", sale); pg.fill(f"#{pre}-rollwidth", rw); pg.fill(f"#{pre}-length", ln)
    pg.select_option(f"#{pre}-match", match)
    if match == "straight": pg.fill(f"#{pre}-repeat", rep)
    pg.fill(f"#{pre}-price", price); pg.fill(f"#{pre}-currency", cur)
def fill_room(pg, idx, label, h, trim, walls):
    room = pg.locator(".wp-room").nth(idx)
    room.locator(".wp-room-label").fill(label); room.locator(".wp-height").fill(h); room.locator(".wp-trim").fill(trim)
    while room.locator(".wp-wallw").count() < len(walls): room.locator(".wp-add-wall").click()
    for i, w in enumerate(walls): room.locator(".wp-wallw").nth(i).fill(str(w))
def go(pg): pg.click("#wp-form button[type=submit]")
def lum(c):
    def f(v):
        v /= 255; return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])
def ratio(a, b):
    la, lb = lum(a), lum(b); hi, lo = max(la, lb), min(la, lb); return (hi + 0.05) / (lo + 0.05)
JS_COLORS = """sel => { const e = document.querySelector(sel); if (!e) return null;
 const parse = s => { const m = s.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return {c: p.slice(0,3), a: p.length > 3 ? p[3] : 1}; };
 const fg = parse(getComputedStyle(e).color); let n = e, bg = null;
 while (n) { const b = parse(getComputedStyle(n).backgroundColor); if (b && b.a > 0.99) { bg = b.c; break; } n = n.parentElement; }
 return {fg: fg.c, bg: bg || [255,255,255]}; }"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for vw, vh in [(320,700),(360,740),(390,800),(412,880),(768,900),(1280,900),(740,360)]:
        ctx = b.new_context(viewport={"width": vw, "height": vh}); pg = ctx.new_page()
        reqs, cons, nav = [], [], []
        pg.on("request", lambda r: reqs.append(r.url)); pg.on("console", lambda m: cons.append(m.text))
        pg.goto(URL); pg.wait_for_selector("#tab-wallpaper"); pg.on("framenavigated", lambda f: nav.append(f.url))
        pg.click("#tab-wallpaper")
        check(f"{vw}: compare hidden by default", not pg.is_visible("#wp-compare-fields"))
        pg.check("#wp-compare"); check(f"{vw}: compare fields shown", pg.is_visible("#wp-compare-fields"))
        pg.uncheck("#wp-compare"); check(f"{vw}: compare fields hidden again", not pg.is_visible("#wp-compare-fields"))
        pg.check("#wp-compare")
        pg.select_option("#wp2-match", "straight"); check(f"{vw}: second repeat field appears", pg.is_visible("#wp2-repeat"))
        pg.select_option("#wp2-match", "free"); check(f"{vw}: second repeat field hides", not pg.is_visible("#wp2-repeat"))
        # worked comparison: same rooms, two products
        fill_p(pg, "wp", unit="in", sale="double roll", match="straight", rep="20", price="24.99")
        fill_p(pg, "wp2", sale="single roll", ln="198", match="free", price="12.5")
        pg.fill("#wp-name1", "Brand Alpha"); pg.fill("#wp-name2", "Brand Beta")
        fill_room(pg, 0, "Zeta Lounge", "96", "6", [144, 180, 144, 180])
        go(pg); t = pg.inner_text("#wp-result")
        check(f"{vw}: product 1 = 12 double roll", "Brand Alpha: 12 × double roll" in t, t[:400])
        check(f"{vw}: product 2 = 34 single roll", "Brand Beta: 34 × single roll" in t, t[:400])
        check(f"{vw}: costs 299.88 and 425", "USD 299.88" in t and "USD 425" in t, t)
        check(f"{vw}: lower cost named", "Lower estimated material cost: Brand Alpha" in t, t)
        check(f"{vw}: main result still first product", t.startswith("Total to buy: 12 × double roll"), t[:80])
        check(f"{vw}: budget section follows first product", pg.is_visible("#wp-budget"))
        check(f"{vw}: no horizontal overflow (compare open + result)", pg.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), pg.evaluate("document.documentElement.scrollWidth"))
        if vw == 390:
            # currency mismatch -> quantities only
            pg.fill("#wp2-currency", "EUR"); go(pg); t = pg.inner_text("#wp-result")
            check("mismatched currencies: no cost winner", "Lower estimated material cost" not in t and "same currency" in t, t)
            # blank second price stays unknown (not zero)
            pg.fill("#wp2-price", ""); go(pg); t = pg.inner_text("#wp-result")
            check("blank second price -> not entered, not zero", "Brand Beta: 34 × single roll\nCost: not entered" in t and "USD 0" not in t and "Lower estimated" not in t, t)
            # invalid second product blocks everything and names the product
            pg.fill("#wp2-rollwidth", ""); go(pg)
            check("invalid product 2 alerts with its number", pg.inner_text("#wp-error").startswith("Product 2:"), pg.inner_text("#wp-error"))
            check("invalid product 2 shows no result", pg.inner_text("#wp-result") == "")
            pg.fill("#wp2-rollwidth", "20.5")
            # unsupported match for product 1 still blocked by engine message
            # compare unchecked returns to single-product output with no comparison block
            pg.uncheck("#wp-compare"); go(pg); t = pg.inner_text("#wp-result")
            check("compare off: no comparison block", "Product comparison" not in t and "Total to buy: 12" in t, t[:150])
            # unit change relabels second-product units
            pg.check("#wp-compare"); pg.select_option("#wp-unit", "cm")
            check("unit change relabels second product fields", pg.inner_text("label[for=wp2-rollwidth]").find("cm") >= 0, pg.inner_text("label[for=wp2-rollwidth]"))
            pg.select_option("#wp-unit", "in")
            # unique ids after adding rooms and walls, then removing
            pg.click("#wp-add-room"); fill_room(pg, 1, "Omega Hall", "96", "6", [100, 100]); pg.locator(".wp-remove-wall").first.click()
            ids = pg.evaluate("Array.from(document.querySelectorAll('[id]')).map(e=>e.id)")
            check("all element ids unique", len(ids) == len(set(ids)), [i for i in ids if ids.count(i) > 1])
            # other tab state untouched by wallpaper work
            pg.click("#tab-measure"); pg.fill("#measure-length", "4"); pg.fill("#measure-width", "3")
            pg.click("#tab-wallpaper"); go(pg); pg.click("#tab-measure")
            check("area tab values survive wallpaper use", pg.input_value("#measure-length") == "4" and pg.input_value("#measure-width") == "3")
            # label coverage + target sizes inside the panel
            unl = pg.evaluate("""() => Array.from(document.querySelectorAll('#panel-wallpaper input,#panel-wallpaper select')).filter(e => {
              if (e.getAttribute('aria-label')) return false; if (e.labels && e.labels.length) return false; return true; }).map(e => e.id || e.className)""")
            check("every field in the panel has a label", not unl, unl)
            pg.click("#tab-wallpaper")
            small = pg.evaluate("""() => Array.from(document.querySelectorAll('#panel-wallpaper button, #panel-wallpaper .wp-check')).filter(e => e.offsetParent !== null).map(e => [e.className, Math.round(e.getBoundingClientRect().height), Math.round(e.getBoundingClientRect().width)]).filter(x => x[1] < 44 || x[2] < 24)""")
            check("buttons and checkbox row >= 44px tall", not small, small)
            cb = pg.evaluate("(() => { const r = document.getElementById('wp-compare').getBoundingClientRect(); return [r.width, r.height]; })()")
            check("checkbox control >= 24px", cb[0] >= 24 and cb[1] >= 24, cb)
            # privacy
            check("no storage keys or cookies", pg.evaluate("localStorage.length+sessionStorage.length") == 0 and pg.evaluate("document.cookie") == "")
            check("URL has no entered values", not any(s in pg.url for s in SECRET) and not any(any(s in u for s in SECRET) for u in nav))
            check("no request carries values", not any(any(s in u for s in SECRET) for u in reqs), reqs)
            check("no console output with values", not any(any(s in c for s in SECRET) for c in cons), cons)
            ext = [u for u in reqs if not u.startswith("file:") and "goatcounter" not in u and "gc.zgo.at" not in u]; check("no unexpected external requests", not ext, ext)
        ctx.close()
    # contrast of the new elements, light and dark (computed colours, not a visual review)
    for scheme in ("light", "dark"):
        ctx = b.new_context(viewport={"width": 390, "height": 800}, color_scheme=scheme); pg = ctx.new_page(); pg.goto(URL); pg.click("#tab-wallpaper"); pg.check("#wp-compare")
        for sel in ("#wp-compare-fields .wp-note", ".wp-check span", "label[for=wp2-saleunit]"):
            c = pg.evaluate(JS_COLORS, sel); r = ratio(c["fg"], c["bg"]) if c else 0
            check(f"{scheme}: contrast {sel} >= 4.5 ({r:.2f})", r >= 4.5, c)
        ctx.close()
    b.close()
print(f"{passes} checks passed, {len(fails)} failed"); sys.exit(1 if fails else 0)
