"""Responsive Chromium QA for the Roof Covering Quantity Calculator."""
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
        page.goto(BASE+"roof-covering-quantity-calculator.html",wait_until="load")
        check("page and live result load at %dpx"%width,page.locator("h1").inner_text()=="Roof Covering Quantity Calculator" and page.locator("#roof-result").get_attribute("aria-live")=="polite")
        check("coverage and measured area start blank at %dpx"%width,page.input_value("#roof-unit")=="" and page.input_value("#roof-coverage")=="" and page.input_value("#roof-area-1")=="")
        page.select_option("#roof-unit","m²");page.fill("#roof-coverage","10");page.fill("#roof-area-1","24")
        page.click("#roof-add-plane");page.fill("#roof-area-2","6")
        page.click("#roof-add-accessory")
        page.fill("#roof-accessory-name-1","Ridge caps — pieces");page.fill("#roof-accessory-required-1","17");page.fill("#roof-accessory-pack-1","6")
        page.click("#roof-form button[type=submit]")
        result=page.locator("#roof-result").inner_text()
        check("hand-computed 30m² roof gives 3 covering packs and 3 ridge-cap packs","30 m²" in result and "3 packs" in result and "Ridge caps" in result,result)
        page.fill("#roof-accessory-name-1","<img src=x onerror=alert(1)>");page.click("#roof-form button[type=submit]")
        check("accessory label is rendered as text, not executable markup",page.locator("#roof-result img").count()==0 and "<img" in page.locator("#roof-result").inner_text())
        page.fill("#roof-area-2","");page.click("#roof-form button[type=submit]")
        check("blank added roof plane is rejected","Roof plane 2 area" in page.locator("#roof-error").inner_text())
        page.locator("#roof-unit").focus();page.keyboard.press("Tab")
        check("keyboard focus reaches product coverage at %dpx"%width,page.evaluate("document.activeElement.id === 'roof-coverage'"))
        check("no horizontal overflow at %dpx"%width,page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("no browser console or page errors at %dpx"%width,not errors,errors)
        context.close()
    browser.close()
server.shutdown()
if failures: raise SystemExit("Roof covering Chromium QA failed: "+", ".join(failures))
print("Roof covering Chromium QA passed at 320, 390 and 1280 px.")