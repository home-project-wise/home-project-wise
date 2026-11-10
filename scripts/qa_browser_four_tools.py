#!/usr/bin/env python3
"""Real-browser smoke suite for the four tools that had no dedicated browser tests:
Home Check-up, Rug Size, Smart Plug Load Check, Crawl Space Dehumidifier.

Usage: python3 scripts/qa_browser_four_tools.py [BASE_URL]
Default BASE_URL serves ./website (with article-overrides.css appended, as pages.yml does) on 127.0.0.1.
Local pages only; the analytics script is served from a real copy when reachable and its beacon is answered with 204.
Exits non-zero on any failed check. Chromium only (nothing here claims Safari/Firefox/phone/screen-reader coverage).
"""
import os, re, sys, shutil, subprocess, tempfile, threading, functools, http.server, socketserver, urllib.request
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FAILS, PASSES = [], 0


def ck(name, ok, detail=''):
    global PASSES
    if ok:
        PASSES += 1
        print('PASS', name)
    else:
        FAILS.append(name)
        print('FAIL', name, '|', str(detail)[:300])


def serve():
    tmp = tempfile.mkdtemp()
    site = os.path.join(tmp, 'site')
    shutil.copytree(os.path.join(ROOT, 'website'), site)
    with open(os.path.join(site, 'style.css'), 'a') as f, open(os.path.join(site, 'article-overrides.css')) as o:
        f.write(o.read())
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=site)
    h.log_message = lambda *a, **k: None
    srv = socketserver.TCPServer(('127.0.0.1', 0), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return 'http://127.0.0.1:%d/' % srv.server_address[1]


BASE = sys.argv[1] if len(sys.argv) > 1 else serve()
VIEWPORTS = [(320, 800), (360, 740), (390, 844), (412, 915), (768, 1024), (1280, 900)]


def fetch_counter():
    try:
        return urllib.request.urlopen(urllib.request.Request('https://gc.zgo.at/count.v5.js', headers={'User-Agent': 'Mozilla/5.0'}), timeout=15).read()
    except Exception as ex:
        print('NOTE: analytics script not fetched (%s); its integrity error is ignored, nothing else is' % ex)
        return None


COUNTER = fetch_counter()


def ctx(b, **kw):
    c = b.new_context(**kw)
    local = urlparse(BASE).netloc

    def handle(route):
        u = route.request.url
        if urlparse(u).netloc == local:
            return route.continue_()
        if 'gc.zgo.at/count.v5.js' in u and COUNTER is not None:
            return route.fulfill(status=200, body=COUNTER, headers={'content-type': 'application/javascript', 'access-control-allow-origin': '*'})
        if 'goatcounter.com' in u or 'gc.zgo.at' in u:
            return route.fulfill(status=204, body='')
        return route.abort()
    c.route('**/*', handle)
    return c


def real_errors(cons):
    cons = [c for c in cons if 'not counting because of: localhost' not in c[1]]  # analytics' own localhost notice
    return [c for c in cons if not (COUNTER is None and 'integrity' in c[1] and 'gc.zgo.at' in c[1])]


def fill_num(pg, sel, v):
    pg.fill(sel, str(v))


def rug_fill(pg, label, v):
    pg.fill('input[aria-label="%s"]' % label, str(v))


TOOLS = {
    'smart-plug-load-check': dict(
        valid=lambda pg: (pg.fill('#val', '1500')),
        invalid=lambda pg: (pg.fill('#val', '-5')),
        keys=['1500']),
    'crawl-space-dehumidifier-calculator': dict(
        valid=lambda pg: (pg.fill('#len', '30'), pg.fill('#wid', '20'), pg.fill('#rh', '70')),
        invalid=lambda pg: (pg.fill('#len', '0'), pg.fill('#wid', '20')),
        keys=['30', '20', '70'], unit=True,
        metric=lambda pg: (pg.fill('#len', '9'), pg.fill('#wid', '6'), pg.fill('#rh', '70'))),
    'home-checkup': dict(valid=None, invalid=None, keys=[]),
    'rug-size-calculator': dict(
        valid=lambda pg: (rug_fill(pg, 'Room width feet', 12), rug_fill(pg, 'Room length feet', 15),
                          rug_fill(pg, 'Seating area width feet', 9), rug_fill(pg, 'Seating area depth feet', 7)),
        invalid=lambda pg: (rug_fill(pg, 'Room width feet', 0), rug_fill(pg, 'Room length feet', 15)),
        keys=['12', '', '15', '', '9', '', '7', ''], unit=True, share=True,  # ft, inch pairs per field
        metric=lambda pg: (rug_fill(pg, 'Room width centimetres', 366), rug_fill(pg, 'Room length centimetres', 457),
                           rug_fill(pg, 'Seating area width centimetres', 274), rug_fill(pg, 'Seating area depth centimetres', 213))),
}


def answer_checkup(pg):
    names = pg.eval_on_selector_all('#calc input[type=radio]', 'els => [...new Set(els.map(e => e.name))]')
    for n in names:
        pg.check('#calc input[name="%s"] >> nth=0' % n)
    return len(names)


def submit(pg):
    pg.click('.calc-btn')
    pg.wait_for_timeout(150)
    return pg.inner_text('#calc-out').strip(), pg.inner_text('#calc-err').strip()


def keyboard_complete(pg, spec):
    """Reach the button using only Tab/Space/typing, then press Enter."""
    pg.evaluate('document.activeElement && document.activeElement.blur()')
    vals = list(spec['keys'])
    stops = 0
    for _ in range(80):
        pg.keyboard.press('Tab')
        stops += 1
        info = pg.evaluate('(() => { const e = document.activeElement; return [e.tagName, e.type || "", e.className || "", e.name || ""]; })()')
        if info[0] == 'BUTTON' and 'calc-btn' in info[2]:
            pg.keyboard.press('Enter')
            pg.wait_for_timeout(200)
            return stops, True
        if info[0] == 'INPUT' and info[1] == 'number' and vals:
            v = vals.pop(0)
            if v:
                pg.keyboard.type(v)
        elif info[0] == 'INPUT' and info[1] == 'radio' and not info[3].startswith('unit'):
            pg.keyboard.press('Space')
    return stops, False


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--no-sandbox'])
        for slug, spec in TOOLS.items():
            print('\n== %s' % slug)
            url = BASE + slug + '.html'
            pg = ctx(b, viewport={'width': 1280, 'height': 900}).new_page()
            reqs, cons = [], []
            pg.on('request', lambda r: reqs.append((r.method, r.url, r.post_data or '')))
            pg.on('console', lambda m: cons.append((m.type, m.text)) if m.type in ('error', 'warning') else None)
            pg.on('pageerror', lambda e: cons.append(('pageerror', str(e))))
            pg.goto(url, wait_until='load')
            pg.wait_for_timeout(300)

            ck(slug + ': one h1', pg.locator('h1').count() == 1)
            bad = []
            for el in pg.locator('#calc input:not([type=radio]):not([type=checkbox]),#calc select').all():
                i = el.get_attribute('id')
                if not (el.get_attribute('aria-label') or (i and pg.locator('label[for="%s"]' % i).count() == 1)):
                    bad.append(i or el.get_attribute('class'))
            ck(slug + ': every field has a label', not bad, bad)
            ck(slug + ': result region aria-live=polite', pg.get_attribute('#calc-out', 'aria-live') == 'polite')
            ck(slug + ': error region role=alert', pg.get_attribute('#calc-err', 'role') == 'alert')

            out, err = submit(pg)
            ck(slug + ': empty submit shows an error and no result', err != '' and out == '', (out[:60], err))

            if slug == 'home-checkup':
                n = answer_checkup(pg)
                out, err = submit(pg)
                ck(slug + ': all %d questions answered gives a result and no error' % n, n >= 3 and out != '' and err == '', (n, out[:80], err))
                pg.reload(wait_until='load')
                pg.wait_for_timeout(200)
                answer_checkup(pg)
                first = pg.locator('#calc input[type=radio]').first.get_attribute('name')
                pg.evaluate('n => document.querySelectorAll(`#calc input[name="${n}"]`).forEach(e => e.checked = false)', first)
                out, err = submit(pg)
                ck(slug + ': unanswering one question blocks the result', err != '' and out == '', (out[:60], err))
                pg.reload(wait_until='load')
                pg.wait_for_timeout(200)
                stops, ok = keyboard_complete(pg, spec)
                ck(slug + ': keyboard-only reaches the button (%d stops)' % stops, ok)
                out, err = pg.inner_text('#calc-out').strip(), pg.inner_text('#calc-err').strip()
                ck(slug + ': keyboard-only with every question unanswered is rejected, not silently scored', out == '' or err == '' , (out[:60], err))
            else:
                spec['valid'](pg)
                out, err = submit(pg)
                ck(slug + ': valid input gives a result and no error', out != '' and err == '', (out[:80], err))
                spec['invalid'](pg)
                out2, err2 = submit(pg)
                ck(slug + ': invalid input after a valid run clears the stale result', out2 == '' and err2 != '', (out2[:60], err2))
                if spec.get('unit'):
                    spec['valid'](pg)
                    submit(pg)
                    pg.check('input[name=unit][value=m]')
                    pg.wait_for_timeout(150)
                    ck(slug + ': switching unit clears the previous result', pg.inner_text('#calc-out').strip() == '')
                    spec['metric'](pg)
                    out3, err3 = submit(pg)
                    ck(slug + ': metric input gives a result', out3 != '' and err3 == '', (out3[:80], err3))
                if spec.get('share'):
                    pg.check('input[name=unit][value=us]')
                    spec['valid'](pg)
                    submit(pg)
                    q = pg.evaluate('location.search')
                    ck(slug + ': result writes a shareable URL', 'rw=' in q, q)
                    pg2 = ctx(b, viewport={'width': 390, 'height': 844}).new_page()
                    pg2.goto(url + q, wait_until='load')
                    pg2.wait_for_timeout(300)
                    ck(slug + ': shared URL reproduces the result in a fresh page', pg2.inner_text('#calc-out').strip() != '')
                    pg2.close()
                pg.reload(wait_until='load')
                pg.wait_for_timeout(200)
                pg.goto(url, wait_until='load')
                pg.wait_for_timeout(200)
                stops, ok = keyboard_complete(pg, spec)
                out4, err4 = pg.inner_text('#calc-out').strip(), pg.inner_text('#calc-err').strip()
                ck(slug + ': keyboard-only completion (%d stops) ends in a result' % stops, ok and out4 != '' and err4 == '', (ok, out4[:60], err4))

            ck(slug + ': no console errors or page errors', not real_errors(cons), real_errors(cons)[:2])
            posts = [r for r in reqs if r[0] != 'GET']
            ext = [r for r in reqs if urlparse(r[1]).netloc not in (urlparse(BASE).netloc,) and 'gc.zgo.at' not in r[1] and 'goatcounter' not in r[1] and not r[1].startswith('data:')]
            ck(slug + ': no inputs leave the page (no non-GET, no third-party beyond analytics)', not [r for r in posts if 'goatcounter' not in r[1]] and not ext, (posts[:2], ext[:2]))
            pg.close()

            for w, h in VIEWPORTS:
                pv = ctx(b, viewport={'width': w, 'height': h}).new_page()
                pv.goto(url, wait_until='load')
                pv.wait_for_timeout(200)
                if slug == 'home-checkup':
                    answer_checkup(pv)
                else:
                    spec['valid'](pv)
                out, err = submit(pv)
                over = pv.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
                vis = pv.evaluate('(() => { const r = document.querySelector("#calc-out").getBoundingClientRect(); return r.width > 0 && r.height > 0; })()')
                ck('%s @%d: result visible, no horizontal overflow' % (slug, w), out != '' and vis and over <= 0, (over, vis))
                pv.close()
        b.close()
    print('\n%d passed, %d failed' % (PASSES, len(FAILS)))
    for f in FAILS:
        print('  FAILED:', f)
    sys.exit(1 if FAILS else 0)


main()
