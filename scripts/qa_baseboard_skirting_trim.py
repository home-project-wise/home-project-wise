"""Responsive Chromium QA for the Baseboard & Skirting Quantity Calculator."""
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
        context=browser.new_context(viewport={"width":width,"height":900},color_scheme="light",reduced_motion="reduce")
        context.route("**/*",lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
        page=context.new_page();errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        page.on("console",lambda msg:errors.append(msg.text) if msg.type=="error" else None)
        page.goto(BASE+"baseboard-skirting-trim-calculator.html",wait_until="load")
        check("page and live result load at %dpx"%width,page.locator("h1").inner_text()=="Baseboard & Skirting Quantity Calculator" and page.locator("#trim-result").get_attribute("aria-live")=="polite")
        check("required values start blank at %dpx"%width,page.input_value("#trim-unit")=="" and page.input_value("#trim-stock")=="" and page.input_value("#trim-allowance")=="" and page.input_value("#trim-openings-1")=="")
        page.select_option("#trim-unit","m");page.fill("#trim-stock","2.4");page.fill("#trim-allowance","0.2")
        page.fill("#trim-length-1","4");page.fill("#trim-width-1","3");page.fill("#trim-openings-1","0.9")
        page.click("#trim-form button[type=submit]")
        result=page.locator("#trim-result").inner_text()
        check("hand-computed room gives 13.1m net and 6 stock equivalents","13.1 m" in result and "6 pieces" in result,result)
        page.click("#trim-add-room");page.fill("#trim-length-2","5");page.fill("#trim-width-2","2");page.fill("#trim-openings-2","0")
        page.click("#trim-form button[type=submit]")
        result=page.locator("#trim-result").inner_text()
        check("multiple rooms combine to 27.1m net and 12 stock equivalents","27.1 m" in result and "12 pieces" in result,result)
        page.fill("#trim-openings-2","14");page.click("#trim-form button[type=submit]")
        check("opening width greater than room perimeter is rejected","less than the room perimeter" in page.locator("#trim-error").inner_text())
        page.locator("#trim-unit").focus();page.keyboard.press("Tab")
        check("keyboard focus reaches stock length at %dpx"%width,page.evaluate("document.activeElement.id === 'trim-stock'"))
        check("no horizontal overflow at %dpx"%width,page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"))
        check("no browser console or page errors at %dpx"%width,not errors,errors)
        context.close()
    browser.close()
server.shutdown()
if failures: raise SystemExit("Baseboard/skirting Chromium QA failed: "+", ".join(failures))
print("Baseboard/skirting Chromium QA passed at 320, 390 and 1280 px.")
