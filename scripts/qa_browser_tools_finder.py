"""Browser QA for the tools-hub finder ("Find my calculator") and cross-page newsletter link.
Chromium via Playwright. Build the site first as the Pages workflow does:
  python scripts/rebuild_site_indexes.py && cat website/article-overrides.css >> website/style.css
Run:  python scripts/qa_browser_tools_finder.py
Checks every finder route end to end: type a question, press Find, follow the result button and
confirm the right calculator panel is actually visible (not only that the href looks right)."""
import os, re, glob, threading, http.server, socketserver, functools, sys
from playwright.sync_api import sync_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'website')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % srv.server_address[1]
res = []
def ck(name, ok, extra=''):
    res.append((name, bool(ok))); print(('PASS ' if ok else 'FAIL ') + name + (' | ' + str(extra) if extra != '' else ''))

# (query, expected tool page, expected visible panel id or None for "default panel")
HOME = 'home-project-calculator.html'
CASES = [
    ('paint for a room', HOME, 'panel-paint'),
    ('how much paint do I need', HOME, 'panel-paint'),
    ('how many rolls of wallpaper do I need', HOME, 'panel-wallpaper'),
    ('wallpaper for a bedroom feature wall', HOME, 'panel-wallpaper'),
    ('flooring for a bedroom', HOME, 'panel-material'),
    ('laminate flooring for a kitchen', HOME, 'panel-material'),
    ('electricity cost of running a heater', HOME, 'panel-energy'),
    ('estimate my project cost', HOME, 'panel-project'),
    ('area and volume of a room', HOME, 'panel-measure'),
    ('What rug size for a 12x15 ft living room?', 'rug-size-calculator.html', None),
    ('Dehumidifier for a 20 x 40 ft damp crawl space', 'crawl-space-dehumidifier-calculator.html', None),
    ('Can I put a 1500 W heater on a smart plug?', 'smart-plug-load-check.html', None),
    ('Where should I start with my home?', 'home-checkup.html', None),
]
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    for label, vp, touch in (('desktop 1280', {'width': 1280, 'height': 900}, False), ('mobile 360', {'width': 360, 'height': 740}, True)):
        ctx = b.new_context(viewport=vp, has_touch=touch, is_mobile=touch)
        pg = ctx.new_page(); cons = []
        pg.on('console', lambda m: cons.append(m.text) if m.type == 'error' else None)
        pg.on('pageerror', lambda e: cons.append(str(e)))
        for q, page, panel in CASES:
            pg.goto(BASE + 'tools.html'); pg.wait_for_timeout(150)
            pg.fill('#askq', q); pg.click('.ask-form button[type=submit]'); pg.wait_for_timeout(100)
            href = pg.get_attribute('.ask-go', 'href') or ''
            pg.click('.ask-go'); pg.wait_for_load_state('load'); pg.wait_for_timeout(250)
            on_page = pg.url.split('?')[0].split('#')[0].endswith(page)
            ok_panel = True
            if panel:
                ok_panel = pg.locator('#' + panel).is_visible()
            ck('[%s] %r -> %s%s' % (label, q, page, ('#' + panel) if panel else ''), on_page and ok_panel, href)
        # example chips still work and open a tool
        pg.goto(BASE + 'tools.html'); pg.wait_for_timeout(150)
        n = pg.locator('.ask-examples .chip').count()
        for i in range(n):
            pg.goto(BASE + 'tools.html'); pg.wait_for_timeout(100)
            pg.locator('.ask-examples .chip').nth(i).click(); pg.wait_for_timeout(100)
            ck('[%s] example chip %d shows a result' % (label, i + 1), pg.locator('.ask-go').count() == 1)
        ck('[%s] no console errors' % label, not cons, cons[:3])
        ctx.close()
    # intent buttons mention the tab they open
    ctx = b.new_context(); pg = ctx.new_page(); pg.goto(BASE + 'tools.html')
    pg.fill('#askq', 'paint for a room'); pg.click('.ask-form button[type=submit]')
    ck('paint result button says which calculator opens', 'Paint' in pg.inner_text('.ask-go'), pg.inner_text('.ask-go'))
    ctx.close()
    b.close()
# one newsletter form URL across every page (the homepage once pointed at a different, dead form)
urls = set()
for f in glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'articles', '*.html')):
    for u in re.findall(r'https://[0-9a-z]+\.sibforms\.com/v2/serve/[^"]+', open(f, encoding='utf-8', errors='ignore').read()):
        urls.add(u)
ck('single newsletter form URL across all pages', len(urls) == 1, len(urls))
failed = [n for n, ok in res if not ok]
print('TOTAL', len(res), 'FAILS', failed)
sys.exit(1 if failed else 0)
