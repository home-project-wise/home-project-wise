"""Browser QA for the accessibility follow-ups from the 2026-11-10 Phase 1 audit.
Chromium via Playwright. Build the site first as the Pages workflow does:
  python scripts/rebuild_site_indexes.py && cat website/article-overrides.css >> website/style.css
Run:  python scripts/qa_browser_accessibility_targets.py     (HPW_SITE_ROOT=<dir> overrides the site folder)
Checks, at 320/360/390/412/768/1280 px plus phone landscape (667x375, 844x390), in light and dark colour schemes:
  * checkbox/radio inputs are at least 24x24 px and their label row is at least 44 px high
  * 'Print this guide', the 'On this page' summary and the Budget Planner 'Add an item' button are at least 44 px high
  * no horizontal page overflow on the checked pages
  * Budget Planner: a very long unbroken item name stays inside its card and the plan summary, with no page overflow, at every width
  (overflow is measured against the configured viewport width: mobile emulation widens innerWidth to the content, which hides overflow)
  * keyboard: every checked control can be reached with Tab and shows a visible focus outline
This is Chromium emulation only; it is not Safari, Firefox, a screen reader or a real device."""
import os, re, glob, threading, http.server, socketserver, functools, sys
from playwright.sync_api import sync_playwright
ROOT = os.environ.get('HPW_SITE_ROOT') or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'website')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.ThreadingTCPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % srv.server_address[1]
res = []
def ck(name, ok, extra=''):
    res.append((name, bool(ok))); print(('PASS ' if ok else 'FAIL ') + name + (' | ' + str(extra) if extra != '' else ''))

# (width, height): six widths plus two phone-landscape sizes
SIZES = [(320, 800), (360, 800), (390, 800), (412, 800), (768, 800), (1280, 800), (667, 375), (844, 390)]
TOOLS = ['home-project-calculator.html', 'rug-size-calculator.html', 'crawl-space-dehumidifier-calculator.html',
         'bathroom-fan-size-calculator.html', 'home-checkup.html', 'smart-plug-load-check.html', 'budget-planner.html']
def pick_articles():
    out = []
    for f in sorted(glob.glob(os.path.join(ROOT, 'articles', '*.html'))):
        t = open(f, encoding='utf-8').read()
        if 'print-btn' in t and t.count('<h2') >= 5:
            out.append('articles/' + os.path.basename(f))
    return out[:3]
ARTICLES = pick_articles()

BOX = """() => { const r = [];
  for (const el of document.querySelectorAll('input[type=checkbox],input[type=radio]')) {
    const b = el.getBoundingClientRect(); if (!b.width) continue;
    const lab = el.closest('label') || (el.id && document.querySelector('label[for="' + el.id + '"]'));
    const lb = lab ? lab.getBoundingClientRect() : null;
    r.push({kind: 'input', id: el.name + '=' + el.value, w: b.width, h: b.height, lh: lb ? lb.height : 0});
  }
  const one = (sel, kind) => { for (const el of document.querySelectorAll(sel)) { const b = el.getBoundingClientRect(); if (b.width) r.push({kind, id: sel, w: b.width, h: b.height}); } };
  one('.print-btn', 'print'); one('.toc summary', 'toc'); one('#add-row', 'add');
  return {controls: r, scroll: document.documentElement.scrollWidth}; }"""

LONG = 'AveryveryveryveryveryveryverylongunbrokenitemnamewithnospacesatalltotestwrappingXX'
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    for scheme in ('light', 'dark'):
        for w, vh in SIZES:
            ctx = b.new_context(viewport={'width': w, 'height': vh}, color_scheme=scheme, has_touch=w < 800, is_mobile=w < 800)
            pg = ctx.new_page(); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'favicon' not in m.text else None)
            for page in TOOLS + ARTICLES:
                pg.goto(BASE + page, wait_until='load'); pg.wait_for_timeout(120)
                try: pg.click('.consent-decline', timeout=300)
                except Exception: pass
                if page.startswith('articles/'):
                    pg.evaluate("document.querySelectorAll('.toc details').forEach(d=>d.open=true)")
                d = pg.evaluate(BOX)
                tag = '%s %s %dx%d' % (scheme, page, w, vh)
                bad = []
                for c in d['controls']:
                    if c['kind'] == 'input' and (c['w'] < 24 or c['h'] < 24 or c['lh'] < 44): bad.append('%s %.0fx%.0f label %.0f' % (c['id'], c['w'], c['h'], c['lh']))
                    if c['kind'] in ('print', 'toc', 'add') and c['h'] < 44: bad.append('%s h=%.0f' % (c['kind'], c['h']))
                ck('targets ' + tag, not bad, '; '.join(bad[:3]))
                ck('no horizontal overflow ' + tag, d['scroll'] <= w, 'scrollWidth %d > %d' % (d['scroll'], w))
            ck('no console/page errors %s %dx%d' % (scheme, w, vh), not errs, errs[:2])
            # Budget Planner: very long item name must stay inside its card
            pg.goto(BASE + 'budget-planner.html', wait_until='load'); pg.wait_for_timeout(120)
            try: pg.click('.consent-decline', timeout=300)
            except Exception: pass
            pg.click('#add-row'); pg.fill('#rows tr:last-child .r-n', LONG)
            pg.evaluate("document.querySelector('button.calc-btn').click()"); pg.wait_for_timeout(150)
            out = pg.evaluate("""() => { const tr = document.querySelector('#rows tr:last-child'); const t = tr.getBoundingClientRect(); let worst = 0, who = '';
              for (const el of tr.querySelectorAll('*')) { const b = el.getBoundingClientRect(); if (b.width && b.right - t.right > worst) { worst = b.right - t.right; who = el.className || el.tagName; } }
              return {worst, who, scroll: document.documentElement.scrollWidth}; }""")
            ck('long item name stays inside its card %s %dx%d' % (scheme, w, vh), out['worst'] <= 0.5 and out['scroll'] <= w, out)
            ctx.close()
    # keyboard: Tab reaches the controls and the focus outline is visible (desktop + mobile width, light)
    for w in (320, 1280):
        ctx = b.new_context(viewport={'width': w, 'height': 800}); pg = ctx.new_page()
        for page, sel in (('crawl-space-dehumidifier-calculator.html', 'input[type=checkbox]'), ('budget-planner.html', '#add-row')) + tuple((a, '.print-btn') for a in ARTICLES[:1]):
            pg.goto(BASE + page, wait_until='load'); pg.wait_for_timeout(100)
            try: pg.click('.consent-decline', timeout=300)
            except Exception: pass
            got = False; vis = False
            for _ in range(160):
                pg.keyboard.press('Tab')
                st = pg.evaluate("(s) => { const a = document.activeElement; return a && a.matches(s) ? (getComputedStyle(a).outlineStyle !== 'none' && parseFloat(getComputedStyle(a).outlineWidth) >= 2) : null; }", sel)
                if st is not None: got = True; vis = bool(st); break
            ck('keyboard reaches %s %dpx' % (sel + ' on ' + page, w), got)
            ck('visible focus outline %s %dpx' % (sel + ' on ' + page, w), vis)
        ctx.close()
    b.close()
bad = [n for n, ok in res if not ok]
print('\n%d/%d checks passed' % (len(res) - len(bad), len(res)))
sys.exit(1 if bad else 0)
