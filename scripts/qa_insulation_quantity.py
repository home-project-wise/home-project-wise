"""Responsive Chromium QA for the Insulation Quantity Calculator."""
import functools, http.server, socketserver, threading, os
from playwright.sync_api import sync_playwright
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","website")
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=socketserver.TCPServer(("127.0.0.1",0),functools.partial(Quiet,directory=ROOT))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE="http://127.0.0.1:%d/"%server.server_address[1]
failures=[]
def check(name,ok,detail=""):
    print(("PASS " if ok else "FAIL ")+name+("" if ok else " | "+str(detail)[:300]))
    if not ok: failures.append(name)
with sync_playwright() as p:
    browser=p.chromium.launch(args=["--no-sandbox"])
    for width in (320,390,1280):
        context=browser.new_context(viewport={"width":width,"height":900},color_scheme="light",reduced_motion="reduce")
        context.route("**/*",lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
        page=context.new_page(); errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        page.goto(BASE+"insulation-quantity-calculator.html",wait_until="load")
        check("page loads at %dpx"%width,page.locator("h1").inner_text()=="Insulation Quantity Calculator")
        check("result live region is present and visible at %dpx"%width,page.locator("#ins-result").count()==1 and page.locator("#ins-result").get_attribute("hidden") is None and page.locator("#ins-result").get_attribute("aria-live")=="polite")
        check("inputs start blank at %dpx"%width,page.input_value("#ins-unit")=="" and page.input_value("#ins-length-1")=="" and page.input_value("#ins-pack-coverage")=="" and page.input_value("#ins-coverage-unit")=="")
        page.select_option("#ins-unit","m"); page.fill("#ins-length-1","5"); page.fill("#ins-width-1","4"); page.fill("#ins-openings","2")
        page.click("#ins-form button[type=submit]")
        result=page.locator("#ins-result").inner_text()
        check("metric measured area subtracts openings and remains visible at %dpx"%width,"18 m²" in result and "ft²" in result and "To count packs" not in result,result)
        page.fill("#ins-product-name","Pack Alpha"); page.fill("#ins-pack-coverage","4"); page.select_option("#ins-coverage-unit","m2")
        page.click("#ins-form button[type=submit]")
        result=page.locator("#ins-result").inner_text()
        check("pack arithmetic shows ratio and rounds 4.5 up to 5 at %dpx"%width,"4.5" in result and "5 pack(s)" in result,result)
        page.fill("#ins-product-name",""); page.click("#ins-form button[type=submit]")
        check("partial product details keep area but withhold pack count at %dpx"%width,"18 m²" in page.locator("#ins-result").inner_text() and "To count packs" in page.locator("#ins-result").inner_text())
        page.fill("#ins-product-name","Pack Alpha"); page.fill("#ins-pack-coverage","0"); page.click("#ins-form button[type=submit]")
        check("zero pack coverage withholds count but keeps measured area at %dpx"%width,"greater than zero" in page.locator("#ins-error").inner_text() and "18 m²" in page.locator("#ins-result").inner_text() and "Pack count not shown" in page.locator("#ins-result").inner_text())
        page.fill("#ins-pack-coverage",""); page.fill("#ins-product-name",""); page.select_option("#ins-coverage-unit","")
        page.select_option("#ins-unit","ft"); page.fill("#ins-length-1","10"); page.fill("#ins-width-1","12"); page.fill("#ins-openings","")
        page.click("#ins-form button[type=submit]")
        check("imperial area is shown as 120 ft² and converted to m² at %dpx"%width,"120 ft²" in page.locator("#ins-result").inner_text() and "11.148 m²" in page.locator("#ins-result").inner_text())
        check("clear framing-area instruction is visible at %dpx"%width,"measure the clear area between the framing" in page.locator("main").inner_text().lower())
        check("no horizontal overflow at %dpx"%width,page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        page.locator("#ins-unit").focus(); page.keyboard.press("Tab")
        check("keyboard order reaches first section length at %dpx"%width,page.evaluate("document.activeElement.id === 'ins-length-1'"))
        check("no browser errors at %dpx"%width,not errors,errors)
        context.close()
    context=browser.new_context(viewport={"width":390,"height":844})
    context.route("**/*",lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
    home=context.new_page(); handoff_errors=[]
    home.on("pageerror",lambda e:handoff_errors.append(str(e)))
    home.goto(BASE+"home-project-calculator.html",wait_until="domcontentloaded")
    home.locator("#room-root summary").click()
    home.select_option("#room-unit","ft")
    home.fill("#room-length","12"); home.fill("#room-width","10"); home.fill("#room-height","8"); home.fill("#room-openings","20")
    with home.expect_popup() as popup_info:
        home.locator('button[data-target="insulation-quantity"]').click()
    popup=popup_info.value; popup.on("pageerror",lambda e:handoff_errors.append(str(e))); popup.wait_for_load_state("load")
    check("shared-room handoff labels the gross wall area and its cavity limitation","332 ft²" in popup.locator("#ins-room-note").inner_text() and "not clear cavity area" in popup.locator("#ins-room-note").inner_text())
    popup.click("#ins-form button[type=submit]")
    check("shared-room-only area calculates without a second unit choice","30.844 m²" in popup.locator("#ins-result").inner_text() and "332 ft²" in popup.locator("#ins-result").inner_text())
    check("no browser errors during shared-room handoff",not handoff_errors,handoff_errors)
    context.close()
    browser.close()
server.shutdown()
if failures: raise SystemExit("Insulation Chromium QA failed: "+", ".join(failures))
print("Insulation quantity Chromium QA passed at 320, 390 and 1280 px.")
