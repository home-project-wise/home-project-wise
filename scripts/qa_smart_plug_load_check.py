"""Chromium checks for the Smart Plug multi-device load flow.
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
    print(("PASS " if ok else "FAIL ")+name+("" if ok else " | "+str(detail)[:300]))
    if not ok: fail.append(name)
with sync_playwright() as p:
    browser=p.chromium.launch(args=["--no-sandbox"])
    for width in (320,390,1280):
        context=browser.new_context(viewport={"width":width,"height":900})
        context.route("**/*",lambda route: route.fulfill(status=200,content_type="application/javascript",body="") if "gc.zgo.at" in route.request.url else (route.continue_() if route.request.url.startswith(BASE) else route.abort()))
        page=context.new_page(); errors=[]; console=[]
        page.on("pageerror",lambda e: errors.append(str(e)))
        page.on("console",lambda m: console.append(m.text) if m.type=="error" and "gc.zgo.at" not in m.text else None)
        responses=[]
        page.on("response",lambda r: responses.append((r.url,r.status)) if "smart-plug-load-check.js" in r.url else None)
        page.goto(BASE+"smart-plug-load-check.html",wait_until="load")
        row_count=page.locator("#device-rows .device-row").count()
        check("page loads at %s px"%width,row_count==1,{"page_errors":errors,"console_errors":console,"module":page.evaluate("typeof window.HPWSmartPlugLoadCheck"),"script_responses":responses})
        if row_count!=1: raise AssertionError("Smart Plug page did not create its first device row")
        # 12 + 65 + 150 = 227 W on 1,800 W plug; 80% line = 1,440 W.
        rows=page.locator("#device-rows .device-row")
        rows.nth(0).locator('[data-role=device]').select_option("lamp")
        rows.nth(0).locator('[data-role=mode]').select_option("w")
        rows.nth(0).locator('[data-role=value]').fill("12")
        page.get_by_role("button",name="Add another device").click()
        rows=page.locator("#device-rows .device-row")
        rows.nth(1).locator('[data-role=device]').select_option("charger")
        rows.nth(1).locator('[data-role=mode]').select_option("w")
        rows.nth(1).locator('[data-role=value]').fill("65")
        page.get_by_role("button",name="Add another device").click()
        rows=page.locator("#device-rows .device-row")
        rows.nth(2).locator('[data-role=device]').select_option("tv")
        rows.nth(2).locator('[data-role=mode]').select_option("w")
        rows.nth(2).locator('[data-role=value]').fill("150")
        page.get_by_role("button",name="Check the combined load").click()
        result=page.locator("#calc-out").inner_text()
        check("multi-device 12 + 65 + 150 = 227 W at %s px"%width,"Combined device load: 227 W" in result and "Plug rating: 1800 W" in result and "80% screening line: 1440 W" in result,result)
        check("static worked examples are present at %s px"%width,"Three devices on a 15 A, 120 V plug" in page.locator("body").inner_text())
        check("no horizontal overflow at %s px"%width,page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth"))
        check("no page or console errors at %s px"%width,not errors and not console,{"page":errors,"console":console})
        context.close()
    # Exact threshold and just-over threshold; then verify UK/EU voltage math.
    context=browser.new_context(viewport={"width":1280,"height":900})
    context.route("**/*",lambda route: route.fulfill(status=200,content_type="application/javascript",body="") if "gc.zgo.at" in route.request.url else (route.continue_() if route.request.url.startswith(BASE) else route.abort()))
    page=context.new_page();page.goto(BASE+"smart-plug-load-check.html",wait_until="load")
    row=page.locator("#device-rows .device-row").first
    row.locator('[data-role=device]').select_option("lamp")
    row.locator('[data-role=mode]').select_option("w")
    row.locator('[data-role=value]').fill("1440")
    page.get_by_role("button",name="Check the combined load").click()
    check("exact 80% boundary is not above the line","Good fit." in page.locator("#calc-out").inner_text())
    row.locator('[data-role=value]').fill("1441")
    page.get_by_role("button",name="Check the combined load").click()
    check("one watt over 80% is not recommended","Not recommended" in page.locator("#calc-out").inner_text())
    page.locator("#region").select_option("2")
    row.locator('[data-role=value]').fill("100")
    page.get_by_role("button",name="Check the combined load").click()
    result=page.locator("#calc-out").inner_text()
    check("230 V × 10 A = 2,300 W and 80% = 1,840 W","Plug rating: 2300 W" in result and "80% screening line: 1840 W" in result,result)
    page.get_by_role("button",name="Add another device").focus()
    page.keyboard.press("Enter")
    check("keyboard Enter adds another device",page.locator("#device-rows .device-row").count()==2)
    page.locator("#device-rows .device-row").nth(1).get_by_role("button",name="Remove device 2").click()
    check("remove button removes only its device",page.locator("#device-rows .device-row").count()==1)
    context.close();browser.close()
server.shutdown()
if fail:
    raise SystemExit("Smart Plug Chromium QA failed: "+", ".join(fail))
print("Smart Plug Chromium QA passed")
