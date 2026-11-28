"""Responsive Chromium QA for Siding / Cladding Quantity Calculator."""
import functools,http.server,socketserver,threading,os
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
        context=browser.new_context(viewport={"width":width,"height":950},color_scheme="light",reduced_motion="reduce")
        context.route("**/*",lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
        page=context.new_page();errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        page.on("console",lambda msg:errors.append(msg.text) if msg.type=="error" else None)
        page.goto(BASE+"siding-cladding-quantity-calculator.html",wait_until="load")
        check("page and live result load at %dpx"%width,page.locator("h1").inner_text()=="Siding & Cladding Quantity Calculator" and page.locator("#siding-result").get_attribute("aria-live")=="polite")
        check("unit, product coverage and first wall face start blank",page.input_value("#siding-unit")=="" and page.input_value("#siding-coverage")=="" and page.input_value("#siding-area-1")=="")
        page.select_option("#siding-unit","m²");page.fill("#siding-coverage","10");page.fill("#siding-area-1","24")
        page.click("#siding-add-face");page.fill("#siding-area-2","6");page.click("#siding-form button[type=submit]")
        result=page.locator("#siding-result").inner_text()
        check("hand-computed 30m² net wall area gives 3 packs","30 m²" in result and "3 packs" in result,result)
        page.fill("#siding-coverage","");page.click("#siding-form button[type=submit]")
        check("missing product coverage is rejected","coverage per pack" in page.locator("#siding-error").inner_text())
        page.fill("#siding-coverage","10");page.fill("#siding-area-2","");page.click("#siding-form button[type=submit]")
        check("blank additional wall face is rejected","Wall face 2 net area" in page.locator("#siding-error").inner_text())
        page.locator("#siding-unit").focus();page.keyboard.press("Tab")
        check("keyboard focus reaches product coverage",page.evaluate("document.activeElement.id === 'siding-coverage'"))
        check("no horizontal overflow at %dpx"%width,page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("no browser console or page errors at %dpx"%width,not errors,errors)
        context.close()
    browser.close()
server.shutdown()
if failures: raise SystemExit("Siding / cladding Chromium QA failed: "+", ".join(failures))
print("Siding / cladding Chromium QA passed at 320, 390 and 1280 px.")
