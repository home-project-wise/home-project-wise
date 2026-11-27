"""Responsive Chromium QA for the Paver & Patio Quantity Calculator."""
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
        page.on("console",lambda msg:errors.append(msg.text) if msg.type=="error" else None)
        page.goto(BASE+"pavers-quantity-calculator.html",wait_until="load")
        check("page and visible live result load at %dpx"%width,page.locator("h1").inner_text()=="Paver & Patio Quantity Calculator" and page.locator("#pavers-result").get_attribute("aria-live")=="polite")
        check("all required inputs start blank at %dpx"%width,page.input_value("#pavers-unit")=="" and page.input_value("#pavers-length")=="" and page.input_value("#pavers-paver-width")=="" and page.input_value("#pavers-joint")=="" and page.input_value("#pavers-border-1")=="")
        page.select_option("#pavers-unit","m")
        page.fill("#pavers-length","0.2"); page.fill("#pavers-paver-width","0.1"); page.fill("#pavers-joint","0.005")
        page.fill("#pavers-length-1","4"); page.fill("#pavers-width-1","3"); page.fill("#pavers-border-1","0.2")
        page.select_option("#pavers-direction-1","along-length")
        page.click("#pavers-form button[type=submit]")
        result=page.locator("#pavers-result").inner_text()
        check("hand-computed metric patio gives 450 field + 123 border equivalents", "450" in result and "123" in result and "573 pavers" in result,result)
        page.fill("#pavers-border-1","0")
        page.click("#pavers-form button[type=submit]")
        check("zero border leaves all measured area in the field","12 m²" in page.locator("#pavers-result").inner_text() and "border area: 0 m²" in page.locator("#pavers-result").inner_text())
        page.click("#pavers-add-section")
        page.fill("#pavers-length-2","2"); page.fill("#pavers-width-2","1"); page.fill("#pavers-border-2","0")
        page.select_option("#pavers-direction-2","along-width")
        page.click("#pavers-form button[type=submit]")
        check("multiple sections are added and independently calculated","14 m²" in page.locator("#pavers-result").inner_text() and "Section 2" in page.locator("#pavers-result").inner_text())
        page.fill("#pavers-border-2","1")
        page.click("#pavers-form button[type=submit]")
        check("border consuming inner field shows validation", "leaves no positive inner field" in page.locator("#pavers-error").inner_text())
        page.fill("#pavers-border-2","0")
        page.locator("#pavers-unit").focus(); page.keyboard.press("Tab")
        check("keyboard focus order reaches paver length at %dpx"%width,page.evaluate("document.activeElement.id === 'pavers-length'"))
        check("no horizontal overflow at %dpx"%width,page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("no browser console or page errors at %dpx"%width,not errors,errors)
        context.close()
    browser.close()
server.shutdown()
if failures: raise SystemExit("Paver Chromium QA failed: "+", ".join(failures))
print("Paver quantity Chromium QA passed at 320, 390 and 1280 px.")
