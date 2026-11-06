"""Browser QA for website/bathroom-fan-size-calculator.html (Chromium via Playwright).

Build the site the way the deploy workflow does first:
  python scripts/rebuild_site_indexes.py
  cat website/article-overrides.css >> website/style.css
Needs: pip install playwright ; playwright install --with-deps chromium
Optional: set QA_SHOTS=/some/dir to save screenshots (light/dark, desktop/mobile).
The script starts its own local server on a random port and reads the page from website/."""
import os, re, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'website')
SHOTS = os.environ.get('QA_SHOTS')
if SHOTS:
    os.makedirs(SHOTS, exist_ok=True)


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:%d/bathroom-fan-size-calculator.html' % srv.server_address[1]
res = []


def ck(name, ok, extra=''):
    res.append((name, bool(ok)))
    print(('PASS ' if ok else 'FAIL ') + name + (' | ' + str(extra) if extra != '' else ''))


def fill(pg, **kw):
    for k, v in kw.items():
        pg.fill('#' + k, str(v))


def run(pg, **kw):
    fill(pg, **kw)
    pg.click('.calc-btn')
    pg.wait_for_timeout(120)
    return pg.inner_text('#calc-out'), pg.inner_text('#calc-err')


def lum(rgb):
    def c(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b)


def contrast(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


JS_CONTRAST = """() => {
  const parse = s => (s.match(/[\\d.]+/g) || []).slice(0, 4).map(Number);
  function bg(el) {
    while (el) { const c = parse(getComputedStyle(el).backgroundColor); if (c.length === 3 || (c.length === 4 && c[3] > 0.9)) return c.slice(0, 3); el = el.parentElement; }
    return [255, 255, 255];
  }
  const sel = ['h1', 'main p', '.calc label', '.calc small', '.calc-btn', '#calc-err', 'main a', 'main li'];
  return sel.map(s => { const el = document.querySelector(s); if (!el) return [s, null, null, null]; const cs = getComputedStyle(el); return [s, parse(cs.color).slice(0, 3), bg(el), cs.fontSize]; });
}"""

def _fetch_counter():
    """Real GoatCounter script, fetched once, so the page's integrity hash is checked for real."""
    import urllib.request
    try:
        return urllib.request.urlopen(urllib.request.Request('https://gc.zgo.at/count.v5.js', headers={'User-Agent': 'Mozilla/5.0'}), timeout=20).read()
    except Exception as ex:
        print('NOTE: could not fetch the GoatCounter script (%s); its integrity check is skipped' % ex)
        return None


COUNTER = _fetch_counter()


def ctx(browser, **kw):
    """New context: local pages only. The analytics script is served from a local copy and its beacon is answered
    with 204, so the run never creates real analytics hits and never depends on the network."""
    c = browser.new_context(**kw)

    def handle(route):
        u = route.request.url
        if u.startswith('http://127.0.0.1'):
            return route.continue_()
        if 'gc.zgo.at/count.v5.js' in u and COUNTER is not None:
            return route.fulfill(status=200, body=COUNTER, headers={'content-type': 'application/javascript', 'access-control-allow-origin': '*'})
        if 'goatcounter.com' in u or 'gc.zgo.at' in u:
            return route.fulfill(status=204, body='')
        return route.abort()
    c.route('**/*', handle)
    return c


with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    pg = ctx(b, viewport={'width': 1280, 'height': 900}).new_page()
    reqs, cons = [], []
    pg.on('request', lambda r: reqs.append((r.method, r.url, r.post_data or '')))
    pg.on('console', lambda m: cons.append((m.type, m.text)))
    pg.on('pageerror', lambda e: cons.append(('pageerror', str(e))))
    pg.goto(URL, wait_until='load')
    pg.wait_for_timeout(400)

    ck('title', 'Bathroom' in pg.title() and 'Fan' in pg.title(), pg.title())
    ck('one h1', pg.locator('h1').count() == 1)
    bad = []
    for el in pg.locator('#calc input:not([type=radio]),#calc select').all():
        i = el.get_attribute('id')
        if not i or pg.locator('label[for="%s"]' % i).count() != 1:
            bad.append(i)
    ck('every number input and select has exactly one label[for]', not bad, bad)
    ck('radio group has a legend', pg.locator('#calc fieldset legend').count() >= 1)
    ck('result region aria-live=polite', pg.get_attribute('#calc-out', 'aria-live') == 'polite')
    ck('error element role=alert', pg.get_attribute('#calc-err', 'role') == 'alert')

    out, err = run(pg, len=8, wid=10)
    ck('US 8x10 ft -> 80 sq ft, 80 CFM', 'for a 80 sq ft bathroom' in out and re.search(r'\b80 CFM', out), out[:160].replace('\n', ' / '))
    out, err = run(pg, len=10, wid=12, nt=1, ns=1, nb=0, nj=1)
    ck('120 sq ft, 1 toilet + 1 shower + 1 jetted -> 200 CFM', re.search(r'\b200 CFM', out), out[:160].replace('\n', ' / '))
    out, err = run(pg, nb=1)
    ck('same jetted tub also counted as standard tub -> 250 CFM (documented)', re.search(r'\b250 CFM', out), out[:100].replace('\n', ' / '))
    fill(pg, nb=0, nj=0)
    out, err = run(pg, len=8, wid=10, rating=70)
    ck('duct check names Table 150.0-H and the 25 ft / three elbow limits', 'Table 150.0-H' in out and '25 ft (8 m)' in out and 'three elbows' in out, out[-420:].replace('\n', ' / '))
    ck('duct check says not a code approval', 'not a code approval' in out)
    out, err = run(pg, rating=500)
    ck('very large rating: no undefined/NaN in text', 'undefined' not in out and 'NaN' not in out, out[-200:].replace('\n', ' / '))
    fill(pg, rating='')

    out, err = run(pg, len='', wid=10)
    ck('blank length rejected + result cleared', err.strip() != '' and out.strip() == '', err)
    out, err = run(pg, len=0, wid=10)
    ck('zero length rejected', err.strip() != '' and out.strip() == '', err)
    out, err = run(pg, len=2, wid=2)
    ck('4 sq ft rejected as out of range', err.strip() != '' and out.strip() == '', err)
    out, err = run(pg, len=8, wid=10, nt=1.5)
    ck('fractional fixture count rejected', 'whole numbers' in err and out.strip() == '', err)
    fill(pg, nt=1)

    pg.check('input[name=unit][value=m]')
    out, err = run(pg, len=2.4, wid=3)
    ck('metric 2.4x3 m -> 7.2 m2 (77.5 sq ft)', 'for a 7.2 m\u00b2 (77.5 sq ft) bathroom' in out, out[:160].replace('\n', ' / '))
    ck('unit toggle switches data-unit', pg.get_attribute('#calc', 'data-unit') == 'm')
    pg.check('input[name=unit][value=us]')
    out, err = run(pg, len=8, wid=10)
    ck('back to US: no m2 in result', '\u00b2' not in out, out[:100].replace('\n', ' / '))

    loc = pg.evaluate('() => location.search + location.hash')
    ck('no entered value in location (query/hash)', loc == '', loc)
    leaks = [r for r in reqs if re.search(r'(len|wid|rating)=|8x10', r[1] + r[2])]
    ck('no entered value in any request URL/body', not leaks, leaks)
    ck('no POST requests', all(r[0] == 'GET' for r in reqs), sorted({r[0] for r in reqs}))
    print('EXTERNAL REQUESTS (served locally or answered 204 by the harness):', sorted({r[1] for r in reqs if not r[1].startswith('http://127.0.0.1')}))
    errs = [c for c in cons if c[0] in ('error', 'pageerror')]  # the counter's own 'not counting: localhost' warning is expected here
    ck('no console errors or page errors (desktop)', not errs, errs)

    pg.fill('#len', '8'); pg.fill('#wid', '10'); pg.fill('#rating', '')
    pg.focus('#rating')
    pg.keyboard.press('Tab')
    on_btn = pg.evaluate("() => document.activeElement.className")
    ck('Tab from the last field reaches the Calculate button', 'calc-btn' in on_btn, on_btn)
    fv = pg.evaluate("() => { const s = getComputedStyle(document.activeElement); return [s.outlineStyle, s.outlineWidth, s.boxShadow]; }")
    ck('visible focus indicator on button (keyboard)', (fv[0] != 'none' and fv[1] != '0px') or fv[2] != 'none', fv)
    pg.evaluate("() => { document.getElementById('calc-out').innerHTML=''; }")
    pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
    ck('Enter on the button submits and fills the result', pg.inner_text('#calc-out').strip() != '', pg.inner_text('#calc-out')[:60])
    pg.focus('#len'); pg.keyboard.press('Tab')
    fi = pg.evaluate("() => { const s = getComputedStyle(document.activeElement); return [document.activeElement.id, s.outlineStyle, s.outlineWidth, s.boxShadow]; }")
    ck('visible focus indicator on input (keyboard)', (fi[1] != 'none' and fi[2] != '0px') or fi[3] != 'none', fi)
    if SHOTS:
        pg.fill('#len', '8'); pg.fill('#wid', '10'); pg.fill('#rating', '70'); pg.click('.calc-btn'); pg.wait_for_timeout(150)
        pg.screenshot(path=os.path.join(SHOTS, 'desktop-light.png'), full_page=False)

    dk = ctx(b, viewport={'width': 1280, 'height': 900}, color_scheme='dark').new_page()
    dk.goto(URL, wait_until='load'); dk.wait_for_timeout(300)
    dk.fill('#len', '8'); dk.fill('#wid', '10'); dk.fill('#rating', '70'); dk.click('.calc-btn'); dk.wait_for_timeout(150)
    rows = dk.evaluate(JS_CONTRAST)
    low = [(s, round(contrast(fg, bgc), 2), fg, bgc, fs) for s, fg, bgc, fs in rows if fg is not None and contrast(fg, bgc) < 4.5]
    ck('dark colour-scheme emulation: contrast >= 4.5 for key elements', not low, low)
    if SHOTS:
        dk.screenshot(path=os.path.join(SHOTS, 'desktop-dark.png'), full_page=False)
    dk.context.close()
    pg.fill('#len', '8'); pg.fill('#wid', '10'); pg.fill('#rating', '70'); pg.click('.calc-btn'); pg.wait_for_timeout(150)
    rowsl = pg.evaluate(JS_CONTRAST)
    lowl = [(s, round(contrast(fg, bgc), 2), fg, bgc, fs) for s, fg, bgc, fs in rowsl if fg is not None and contrast(fg, bgc) < 4.5]
    ck('light mode: contrast >= 4.5 for key elements', not lowl, lowl)

    pg.context.close()
    mp = ctx(b, viewport={'width': 360, 'height': 740}, device_scale_factor=2, is_mobile=True, has_touch=True).new_page()
    mc = []
    mp.on('pageerror', lambda e: mc.append(str(e)))
    mp.goto(URL, wait_until='load'); mp.wait_for_timeout(400)
    mp.fill('#len', '10'); mp.fill('#wid', '12'); mp.fill('#nj', '1'); mp.fill('#rating', '70')
    mp.tap('.calc-btn'); mp.wait_for_timeout(200)
    ov = mp.evaluate("() => document.documentElement.scrollWidth <= innerWidth + 1")
    ck('mobile 360px: no horizontal overflow (with result shown)', ov)
    fs = mp.evaluate("() => [...document.querySelectorAll('#calc input:not([type=radio]),#calc select')].map(e => parseFloat(getComputedStyle(e).fontSize))")
    ck('mobile: every input/select font >= 16px', min(fs) >= 16, min(fs))
    bh = mp.evaluate("() => Math.round(document.querySelector('.calc-btn').getBoundingClientRect().height)")
    ck('mobile: submit height >= 40px', bh >= 40, bh)
    small = mp.evaluate("() => [...document.querySelectorAll('#calc input:not([type=radio]),#calc select,.calc-btn')].filter(e => e.getBoundingClientRect().height < 24).map(e => e.id || e.className)")
    ck('mobile: no field or button shorter than 24px', not small, small)
    inside = mp.evaluate("() => { const r = document.getElementById('calc-out').getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; }")
    ck('mobile: result panel inside the viewport', inside)
    wide = mp.evaluate("() => [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('.table-wrap,pre,table')).slice(0, 5).map(e => e.tagName + '.' + e.className)")
    ck('mobile: nothing in main sticks out past the viewport', not wide, wide)
    ck('mobile: no page errors', not mc, mc)
    if SHOTS:
        mp.screenshot(path=os.path.join(SHOTS, 'mobile-light.png'), full_page=False)
        mp.context.close()
        md = ctx(b, viewport={'width': 360, 'height': 740}, device_scale_factor=2, is_mobile=True, has_touch=True, color_scheme='dark').new_page()
        md.goto(URL, wait_until='load'); md.wait_for_timeout(300)
        md.fill('#len', '10'); md.fill('#wid', '12'); md.fill('#nj', '1'); md.fill('#rating', '70'); md.tap('.calc-btn'); md.wait_for_timeout(200)
        md.screenshot(path=os.path.join(SHOTS, 'mobile-dark.png'), full_page=False)
    b.close()

fails = [n for n, ok in res if not ok]
print('TOTAL', len(res), 'FAILS', fails)
raise SystemExit(1 if fails else 0)
