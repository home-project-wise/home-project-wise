"""Hand-computed fixtures for the three calculators whose arithmetic lives inline in their page:
Rug size, Crawl space dehumidifier and Home Check-up. They run the real page in Chromium (Playwright, local pages only), so what
ships is what is tested. Chromium only: nothing here claims Safari, Firefox, phone or screen-reader coverage.
Usage: python3 scripts/qa_inline_tool_fixtures.py   (exits non-zero on any failed check; run by the Always-on visual QA workflow)
Each expected value is worked out by hand in the comment above its check."""
import os, sys, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'website')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % srv.server_address[1]
fails = []
def ck(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + ('' if ok else ' | ' + str(extra)[:400]))
    if not ok: fails.append(name)
def has(name, text, *needles):
    missing = [n for n in needles if n not in text]
    ck(name, not missing, 'missing %r in %r' % (missing, text))
CUR = []
def page(b, name):
    while CUR: CUR.pop().close()  # one live page at a time keeps the run light
    ctx = b.new_context(viewport={'width': 1280, 'height': 900})
    # Local pages only: the analytics script and any other outside request is blocked, so the run never waits on the network.
    ctx.route('**/*', lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
    CUR.append(ctx)
    pg = ctx.new_page()
    pg.set_default_timeout(8000)
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(BASE + name, wait_until='load')
    return pg, errors
def out(pg): return pg.inner_text('#calc-out')

with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])

    # ---- Crawl space dehumidifier: benchmark 0.07 pint per sq ft per day (70 per 1,000 sq ft), 1 pint = 0.473176 L, 1 m2 = 10.7639 sq ft
    D = 'crawl-space-dehumidifier-calculator.html'
    pg, err = page(b, D)
    # 20 x 30 ft = 600 sq ft; 600 / 10.7639 = 55.7 -> 56 m2; 600 x 0.07 = 42 pints; 42 x 0.473176 = 19.87 -> 19.9 L
    pg.fill('#len', '20'); pg.fill('#wid', '30'); pg.click('#calc button[type=submit]')
    t = out(pg)
    has('dehumidifier 20 x 30 ft: 600 sq ft, 56 m2, 42 pints, 19.9 litres', t, '600 sq ft', '(56 m2)', 'about 42 pints per day', 'about 19.9 litres per day')
    has('dehumidifier with no flags and no humidity reading gives the plain recommendation', t, 'rated capacity at or just above this benchmark')
    ck('dehumidifier: no water warning without a reason', 'Fix the water source first' not in t, t)
    ck('dehumidifier: no page errors', not err, err)
    # 6 x 10 m = 60 m2; 60 x 10.7639 = 645.83 -> 646 sq ft; 645.83 x 0.07 = 45.2 -> 45 pints; 45.208 x 0.473176 = 21.39 -> 21.4 L; back to 60 m2
    pg, err = page(b, D)
    pg.check('input[name=unit][value=m]'); pg.fill('#len', '6'); pg.fill('#wid', '10'); pg.click('#calc button[type=submit]')
    has('dehumidifier 6 x 10 m: 646 sq ft, 60 m2, 45 pints, 21.4 litres', out(pg), '646 sq ft', '(60 m2)', 'about 45 pints per day', 'about 21.4 litres per day')
    # reading above 75% means water first (rule: rh > 75); above 65% also counts as a damp space (rule: rh > 65)
    pg, err = page(b, D)
    pg.fill('#len', '20'); pg.fill('#wid', '30'); pg.fill('#rh', '80'); pg.click('#calc button[type=submit]')
    t = out(pg)
    has('dehumidifier at 80%: fix the water source first and size up', t, 'Fix the water source first', 'A reading above 75%', 'next size up', 'Above 75%: fix the water source first.')
    pg, err = page(b, D)
    pg.fill('#len', '20'); pg.fill('#wid', '30'); pg.fill('#rh', '62'); pg.click('#calc button[type=submit]')
    t = out(pg)
    has('dehumidifier at 62%: mild dampness band, no water warning, no size-up advice', t, '60 to 65%: mild dampness.', 'rated capacity at or just above this benchmark')
    ck('dehumidifier at 62%: no water warning', 'Fix the water source first' not in t, t)
    # 5 x 5 ft = 25 sq ft, below the 50 sq ft the calculator expects
    pg, err = page(b, D)
    pg.fill('#len', '5'); pg.fill('#wid', '5'); pg.click('#calc button[type=submit]')
    has('dehumidifier rejects an unusual area', pg.inner_text('#calc-err'), 'looks unusual')
    ck('dehumidifier shows no result for a rejected area', out(pg).strip() == '', out(pg))

    # ---- Rug size: living room, standard sizes in inches, 12 in border, rounding to the nearest 5 cm
    R = 'rug-size-calculator.html'
    pg, err = page(b, R)
    # Room 12 x 14 ft = 144 x 168 in; seating 7 x 9 ft = 84 x 108 in; border 12 in -> largest rug [120, 144] in.
    # Minimum margin 8 in each side -> [100, 124] in; roomier 12 in -> [108, 132] in. Of 48x72 ... 144x180 only 108 x 144 in (9 x 12 ft) is
    # inside [98.5.., <=121] x [122.5.., <=145], and it also meets the roomier guideline. 108 in x 2.54 = 274.3 cm -> 275; 144 in = 365.8 cm -> 365.
    for k, v in (('rw', '12'), ('rl', '14'), ('gw', '7'), ('gd', '9')): pg.fill('[data-key=%s] .ft' % k, v)
    pg.click('#calc button[type=submit]')
    t = out(pg)
    has('rug living room 12 x 14 ft, seating 7 x 9 ft: best fit 9 x 12 ft', t, 'Best fit: 9 x 12 ft', '(about 275 x 365 cm)', 'meets the minimum and the roomier guideline')
    has('rug living room: minimum, roomier and largest sizes', t,
        'Minimum rug size for this layout: 8 ft 4 in (255 cm) x 10 ft 4 in (315 cm)',
        'Roomier guideline: 9 ft 0 in (275 cm) x 11 ft 0 in (335 cm)',
        'Largest rug that keeps 1 ft 0 in (30 cm) of bare floor: 10 ft 0 in (305 cm) x 12 ft 0 in (365 cm)')
    ck('rug: no page errors', not err, err)
    # Metric twin of a different branch: room 360 x 420 cm, seating 200 x 260 cm, 12 in (30.48 cm) border.
    # Largest rug [299.04, 359.04] cm; minimum [240.64, 300.64] cm; roomier [260.96, 320.96] cm. Standard sizes in cm: only 240 x 340 fits the
    # minimum; it is too small for the roomier guideline (240 < 257.15), so the note says no standard size meets it.
    pg, err = page(b, R)
    pg.check('input[name=unit][value=m]')
    for k, v in (('rw', '360'), ('rl', '420'), ('gw', '200'), ('gd', '260')): pg.fill('[data-key=%s] .cm' % k, v)
    pg.click('#calc button[type=submit]')
    t = out(pg)
    has('rug metric 360 x 420 cm, seating 200 x 260 cm: best fit 240 x 340 cm', t, 'Best fit: 240 x 340 cm', '(about 7.9 x 11.2 ft)', 'No standard size meets the roomier guideline in this room.')
    has('rug metric: minimum size', t, 'Minimum rug size for this layout: 240 cm (7 ft 11 in) x 300 cm (9 ft 10 in)')
    pg, err = page(b, R)
    pg.click('#calc button[type=submit]')
    has('rug asks for the room size when it is empty', pg.inner_text('#calc-err'), 'Enter the room width and length.')

    # ---- Home Check-up: 10 questions, answers 2 / 1 / 0; per area percent = sum / (2 x questions); High > 66, Medium > 33, else Low
    # Areas: storage = questions 1-3, design = 4-5, projects = 6-8, smart = 9-10.
    H = 'home-checkup.html'
    def answer(pg, answers):
        pg.evaluate('a => a.forEach((v, i) => { document.querySelector(\'input[name="q\' + i + \'"][value="\' + v + \'"]\').checked = true; })', answers)
        pg.click('#calc button[type=submit]')
    pg, err = page(b, H)
    # storage 2+2+2 = 6 of 6 = 100 High; smart 0+1 = 1 of 4 = 25 Low; design and projects 0 Low. Order: 100, 25, 0, 0 (design before projects).
    answer(pg, [2, 2, 2, 0, 0, 0, 0, 0, 0, 1])
    names = pg.eval_on_selector_all('.quiz-name', 'e => e.map(x => x.textContent)')
    levels = pg.eval_on_selector_all('.quiz-level', 'e => e.map(x => x.textContent)')
    tops = pg.eval_on_selector_all('.quiz-top > li > strong', 'e => e.map(x => x.textContent)')
    ck('check-up area order', names == ['Storage and organization', 'Smart home', 'Home design', 'Repairs and moisture'], names)
    ck('check-up levels High, Low, Low, Low', levels == ['High', 'Low', 'Low', 'Low'], levels)
    ck('check-up top three are the three highest-scoring questions in page order', tops == [
        'Mail, bills and papers pile up on a counter or table.',
        'You often cannot find everyday things such as keys, chargers or tools.',
        'Cables and chargers form a tangle behind the TV or desk.'], tops)
    ck('check-up: no page errors', not err, err)
    pg, err = page(b, H)
    # all 0: no priorities
    answer(pg, [0] * 10)
    has('check-up with every answer "rarely or never" says the home looks in good shape', out(pg), 'Your home looks in good shape.')
    pg, err = page(b, H)
    # all 1: every area 50 -> Medium
    answer(pg, [1] * 10)
    ck('check-up with every answer "sometimes": all four areas Medium', pg.eval_on_selector_all('.quiz-level', 'e => e.map(x => x.textContent)') == ['Medium'] * 4)
    pg, err = page(b, H)
    # boundaries: storage 2 of 6 = 33 -> Low (needs more than 33); storage 4 of 6 = 67 -> High (more than 66)
    answer(pg, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    ck('check-up: 33 percent is Low', pg.eval_on_selector_all('.quiz-level', 'e => e.map(x => x.textContent)')[0] == 'Low')
    pg, err = page(b, H)
    answer(pg, [2, 2, 0, 0, 0, 0, 0, 0, 0, 0])
    ck('check-up: 67 percent is High', pg.eval_on_selector_all('.quiz-level', 'e => e.map(x => x.textContent)')[0] == 'High')
    pg, err = page(b, H)
    pg.click('#calc button[type=submit]')
    has('check-up asks for every answer', pg.inner_text('#calc-err'), 'Please answer every question.')
    b.close()
print('%d failed' % len(fails)); sys.exit(1 if fails else 0)
