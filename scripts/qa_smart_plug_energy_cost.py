"""Chromium checks for Smart Plug running/standby energy cost and source-rate integration.
Run after scripts/rebuild_site_indexes.py; local pages only."""
import functools, http.server, threading, os
from playwright.sync_api import sync_playwright
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","website")
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=http.server.ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Quiet,directory=ROOT))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE="http://127.0.0.1:%d/"%server.server_address[1]
fail=[]
def check(name,ok,detail=""):
    print(("PASS " if ok else "FAIL ")+name+("" if ok else " | "+str(detail)[:400]))
    if not ok: fail.append(name)
with sync_playwright() as p:
    browser=p.chromium.launch(args=["--no-sandbox"])
    for width in (320,390,1280):
        context=browser.new_context(viewport={"width":width,"height":1100})
        context.route("**/*",lambda route: route.fulfill(status=200,content_type="application/javascript",body="") if "gc.zgo.at" in route.request.url else (route.continue_() if route.request.url.startswith(BASE) else route.abort()))
        page=context.new_page();errors=[];console=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        page.on("console",lambda m:console.append(m.text) if m.type=="error" and "gc.zgo.at" not in m.text else None)
        page.goto(BASE+"smart-plug-load-check.html",wait_until="load")
        page.wait_for_selector("#energy-cost-form")
        check("energy cost form and module load at %s px"%width,page.locator("#energy-cost-form").count()==1 and page.evaluate("typeof window.HPWSmartPlugEnergyCost")=="object")
        check("no horizontal overflow at %s px"%width,page.evaluate("document.documentElement.scrollWidth<=document.documentElement.clientWidth"))
        check("no page/console errors at %s px"%width,not errors and not console,{"page":errors,"console":console})
        context.close()
    context=browser.new_context(viewport={"width":390,"height":1100})
    context.route("**/*",lambda route: route.fulfill(status=200,content_type="application/javascript",body="") if "gc.zgo.at" in route.request.url else (route.continue_() if route.request.url.startswith(BASE) else route.abort()))
    page=context.new_page();page.goto(BASE+"smart-plug-load-check.html",wait_until="load")
    page.locator("#region-country").select_option("US")
    check("US country sets USD without inventing a rate",page.locator("#energy-currency").input_value()=="USD" and page.locator("#energy-rate").input_value()=="")
    page.locator("#energy-cost-watts").fill("0.5")
    page.locator("#energy-cost-hours").fill("24")
    page.locator("#energy-cost-days").fill("30")
    page.locator("#energy-rate").fill("0.2")
    page.get_by_role("button",name="Calculate running and standby cost").click()
    result=page.locator("#energy-cost-result").inner_text()
    check("0.5 W standby fixture shows 4.38 kWh/year and USD 0.88/year","4.3800 kWh" in result and "USD 0.88" in result,result)
    examples=page.locator("#energy-cost-estimate").inner_text()
    check("static standby and running examples match hand-computed fixtures","0.5 W × 24 hours × 365 days ÷ 1,000 = 4.38 kWh per year per bulb." in examples and "60 W × 5 hours × 30 days ÷ 1,000 = 9 kWh per month." in examples,examples)
    page.wait_for_selector("#energy-ref-choice")
    choices=page.locator("#energy-ref-choice option").evaluate_all("(xs)=>xs.map(x=>x.value).filter(Boolean)")
    used=False
    used_choice=None
    for choice in choices:
        page.locator("#energy-ref-choice").select_option(choice)
        if page.locator('#energy-ref-root [data-action="use"]').count():
            page.locator('#energy-ref-root [data-action="use"]').click()
            used=True
            used_choice=choice
            break
    check("eligible single sourced rate can be explicitly used",used and page.locator("#energy-rate").input_value()!="" and page.locator("#energy-currency").input_value()=="USD")
    other_choice=next((x for x in choices if x!=used_choice),None)
    if other_choice:
        page.locator("#energy-ref-choice").select_option(other_choice)
        check("changing the selected tariff clears the previously copied rate",page.locator("#energy-rate").input_value()=="")
    page.locator("#region-country").select_option("Canada")
    page.wait_for_selector("#energy-ref-choice")
    page.locator("#energy-ref-choice").select_option("CA-electricity-ontario-oeb-residential-2026-11")
    tou=page.locator("#energy-ref-root").inner_text()
    check("Ontario TOU range is displayed but never averaged or auto-filled","Reference range:" in tou and page.locator('#energy-ref-root [data-action="use"]').count()==0 and page.locator("#energy-rate").input_value()=="",tou)
    page.locator("#energy-rate").fill("0.19")
    page.locator("#region-country").select_option("US")
    check("changing market clears the previous rate and changes currency",page.locator("#energy-rate").input_value()=="" and page.locator("#energy-currency").input_value()=="USD")
    faq=page.evaluate("""() => {
      const data=[...document.querySelectorAll('script[type="application/ld+json"]')].map(x=>{try{return JSON.parse(x.textContent)}catch(e){return null}}).find(x=>x&&x['@type']==='FAQPage');
      const q=[...document.querySelectorAll('h3')].find(x=>x.textContent.trim()==='How many watts can a smart plug handle?');
      return {structured:data&&data.mainEntity.find(x=>x.name==='How many watts can a smart plug handle?')?.acceptedAnswer?.text,visible:q&&q.nextElementSibling?.textContent.trim()};
    }""")
    check("visible 80% FAQ exactly matches FAQ JSON-LD",faq.structured==faq.visible,faq)
    page.locator('a[href="home-project-calculator.html#panel-energy"]').click()
    check("electricity-cost deep link opens its tab",page.url.endswith("home-project-calculator.html#panel-energy"),page.url)
    context.close();browser.close()
server.shutdown()
if fail: raise SystemExit("Smart Plug energy-cost QA failed: "+", ".join(fail))
print("Smart Plug energy-cost Chromium QA passed")
