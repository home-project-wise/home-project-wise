"""Browser QA for website/home-project-calculator.html (Chromium via Playwright).
Build the site first as described in docs/HOME-PROJECT-CALCULATOR-QA.md."""
import os, re, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','website')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
srv=socketserver.TCPServer(('127.0.0.1',0),functools.partial(Q,directory=ROOT)); threading.Thread(target=srv.serve_forever,daemon=True).start()
URL='http://127.0.0.1:%d/home-project-calculator.html'%srv.server_address[1]
res=[]
def ck(name,ok,extra=''):
    res.append((name,bool(ok))); print(('PASS ' if ok else 'FAIL ')+name+(' | '+str(extra) if extra!='' else ''))
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox'])
    pg=b.new_context(viewport={'width':1280,'height':900}).new_page()
    reqs=[]; cons=[]
    pg.on('request',lambda r: reqs.append((r.method,r.url,r.post_data or '')))
    pg.on('console',lambda m: cons.append((m.type,m.text)))
    pg.on('pageerror',lambda e: cons.append(('pageerror',str(e))))
    pg.goto(URL,wait_until='load'); pg.wait_for_timeout(500)
    ck('title',pg.title().startswith('Home Project Calculator'),pg.title())
    ck('one h1',pg.locator('h1').count()==1)
    ck('six tabs',pg.locator('[role=tab]').count()==6)
    bad=[]
    for el in pg.locator('input,select').all():
        i=el.get_attribute('id')
        if not i or pg.locator('label[for="%s"]'%i).count()!=1: bad.append(i)
    ck('every input/select has exactly one label[for]',not bad,bad)
    ck('tab/tabpanel ARIA wiring',pg.evaluate("()=>[...document.querySelectorAll('[role=tab]')].every(t=>{const p=document.getElementById(t.getAttribute('aria-controls'));return p&&p.getAttribute('aria-labelledby')===t.id&&p.getAttribute('role')==='tabpanel';})"))
    ck('error elements role=alert',pg.evaluate("()=>[...document.querySelectorAll('.calc-error')].every(e=>e.getAttribute('role')==='alert')"))
    ck('result regions aria-live=polite',pg.evaluate("()=>[...document.querySelectorAll('.tool-result')].every(e=>e.getAttribute('aria-live')==='polite')"))
    act=lambda: pg.evaluate("()=>document.activeElement.id")
    pg.locator('#tab-measure').focus(); pg.keyboard.press('ArrowRight'); pg.wait_for_timeout(100)
    ck('ArrowRight -> paint selected+focused',act()=='tab-paint' and pg.get_attribute('#tab-paint','aria-selected')=='true')
    ck('paint panel visible, measure hidden',pg.locator('#panel-paint').is_visible() and not pg.locator('#panel-measure').is_visible())
    pg.keyboard.press('End'); ck('End -> last tab',act()=='tab-wallpaper')
    pg.keyboard.press('Home'); ck('Home -> first tab',act()=='tab-measure')
    pg.keyboard.press('ArrowLeft'); ck('ArrowLeft wraps to last',act()=='tab-wallpaper')
    pg.keyboard.press('Tab'); ck('Tab from tablist enters active panel',pg.evaluate("()=>!!document.activeElement.closest('.tool-panel.active')"),act())
    ck('exactly one tab in tab order',pg.evaluate("()=>[...document.querySelectorAll('[role=tab]')].filter(t=>t.tabIndex===0).length")==1)
    tab=lambda n: pg.click('#tab-'+n)
    def fill(d):
        for k,v in d.items(): pg.fill('#'+k,str(v))
    txt=lambda i: pg.inner_text('#'+i)
    sub=lambda f: pg.click('#%s-form button[type=submit]'%f)
    tab('measure'); fill({'measure-length':'4.5','measure-width':'3.2','measure-depth':'0.1'}); sub('measure'); r=txt('measure-result')
    ck('measure 4.5x3.2x0.1',('14.4 m²' in r) and ('15.4 m' in r) and ('1.44 m³' in r),r.replace('\n',' / '))
    fill({'measure-depth':'0'}); sub('measure'); r=txt('measure-result'); ck('depth 0 accepted -> volume 0',('Volume: 0 m³' in r),r.replace('\n',' / '))
    fill({'measure-depth':''}); sub('measure'); r=txt('measure-result'); ck('blank depth -> no volume',('Volume' not in r) and '14.4' in r)
    fill({'measure-length':'0'}); sub('measure'); ck('zero length rejected + result cleared',txt('measure-error')!='' and txt('measure-result')=='',txt('measure-error'))
    pg.select_option('#measure-unit','ft'); fill({'measure-length':'10','measure-width':'10'}); sub('measure'); r=txt('measure-result'); ck('10x10 ft = 9.29 m2',('9.29 m²' in r) and ('100 ft²' in r),r.replace('\n',' / '))
    tab('paint'); fill({'paint-length':'4','paint-width':'3','paint-height':'2.5','paint-openings':'2','paint-coats':'2','paint-coverage':'10','paint-waste':'10','paint-price':'25'}); sub('paint'); r=txt('paint-result')
    ck('paint 33 m2 -> 8 tins -> $200',('33 m²' in r) and ('8 tin' in r) and ('$200' in r),r.replace('\n',' / '))
    fill({'paint-openings':'40'}); sub('paint'); ck('openings > wall area rejected',txt('paint-error')!='' and txt('paint-result')=='',txt('paint-error'))
    tab('material'); fill({'material-length':'4','material-width':'3','material-coverage':'2.5','material-waste':'10','material-price':'30'}); sub('material'); r=txt('material-result')
    ck('material 12 m2 -> 6 packs -> $180',('6 pack' in r) and ('$180' in r),r.replace('\n',' / '))
    tab('energy'); fill({'energy-watts':'800','energy-hours':'3','energy-days':'30','energy-rate':'0.2'}); sub('energy'); r=txt('energy-result')
    ck('energy 800W 3h 30d @0.2 = 72 kWh, $14.4',('72 kWh' in r) and ('$14.4' in r),r.replace('\n',' / '))
    fill({'energy-rate':'0'}); sub('energy'); r=txt('energy-result'); ck('tariff 0 accepted',('$0' in r),r.replace('\n',' / '))
    fill({'energy-days':''}); sub('energy'); ck('blank days rejected (not silently 0)',txt('energy-error')!='' and txt('energy-result')=='',txt('energy-error'))
    fill({'energy-days':'32'}); sub('energy'); ck('32 days rejected',txt('energy-error')!='')
    tab('project'); fill({'project-quantity':'1','project-unit-price':'300','project-extra':'0','project-contingency':'10','project-tax':'20'}); sub('project'); r=txt('project-result')
    ck('project 300 +10% +20% tax = 396',('396' in r),r.replace('\n',' / '))
    fill({'project-unit-price':''}); sub('project'); ck('blank unit price rejected (not silent 0) + result cleared',txt('project-error')!='' and txt('project-result')=='',txt('project-error'))
    fill({'project-unit-price':'0','project-extra':'50'}); sub('project'); r=txt('project-result'); ck('explicit 0 unit price accepted',txt('project-error')=='' and ('$50' in r),r.replace('\n',' / '))
    fill({'project-unit-price':'300','project-extra':'0','project-tax':''}); sub('project'); r=txt('project-result'); ck('blank optional tax accepted as 0 -> 330',txt('project-error')=='' and ('$330' in r),r.replace('\n',' / '))
    fill({'project-tax':'20'})
    fill({'project-currency':'<i>€'}); sub('project'); ck('currency symbol escaped as text',pg.locator('#project-result i').count()==0 and '<i>€' in txt('project-result'))
    tab('energy'); fill({'energy-watts':'7777','energy-hours':'5','energy-days':'30','energy-rate':'0.4242'}); sub('energy'); pg.wait_for_timeout(800)
    leak=[u for m,u,d in reqs if any(s in (u+d) for s in ('7777','0.4242'))]
    ck('no entered value in any request URL/body',not leak,leak)
    ck('no POST requests',all(m=='GET' for m,u,d in reqs),sorted(set(m for m,u,d in reqs)))
    print('EXTERNAL REQUESTS:',sorted(set(re.sub(r'\?.*','',u) for m,u,d in reqs if not u.startswith('http://127.0.0.1'))))
    errs=[c for c in cons if c[0] in ('error','pageerror') and 'gc.zgo.at' not in c[1]]
    ck('no console/page errors (desktop)',not errs,errs)
    mp=b.new_context(viewport={'width':360,'height':740},device_scale_factor=2,is_mobile=True,has_touch=True).new_page(); mc=[]
    mp.on('pageerror',lambda e: mc.append(str(e)))
    mp.goto(URL,wait_until='load'); mp.wait_for_timeout(400)
    ov=lambda: mp.evaluate("()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth")
    ck('mobile 360px: no horizontal overflow',ov())
    ck('mobile: tabs within viewport',mp.evaluate("()=>[...document.querySelectorAll('[role=tab]')].every(t=>{const r=t.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;})"))
    h=mp.evaluate("()=>[...document.querySelectorAll('[role=tab]')].map(t=>Math.round(t.getBoundingClientRect().height))"); ck('mobile: tab height >=36px',min(h)>=36,h)
    for n in ('measure','paint','material','energy','project'):
        mp.click('#tab-'+n)
        fs=mp.evaluate("()=>[...document.querySelectorAll('.tool-panel.active input,.tool-panel.active select')].map(e=>parseFloat(getComputedStyle(e).fontSize))")
        bh=mp.evaluate("()=>Math.round(document.querySelector('.tool-panel.active .calc-btn').getBoundingClientRect().height)")
        ck('mobile %s: no overflow'%n,ov()); ck('mobile %s: input font >=16px'%n,min(fs)>=16,min(fs)); ck('mobile %s: submit height >=40px'%n,bh>=40,bh)
    ck('mobile: no page errors',not mc,mc)
    b.close()
print('TOTAL',len(res),'FAILS',[r[0] for r in res if not r[1]])
raise SystemExit(1 if [r for r in res if not r[1]] else 0)
