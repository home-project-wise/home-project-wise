"""Browser QA for website/budget-planner.html (Chromium via Playwright).

Build the site the way the deploy workflow does first:
  python scripts/rebuild_site_indexes.py
  cat website/article-overrides.css >> website/style.css
Needs: pip install playwright ; playwright install --with-deps chromium
The script starts its own local server; the analytics script is served from a local copy and its beacon answered
with 204, so no real analytics hits are created."""
import os, re, json, base64, threading, http.server, socketserver, functools, urllib.parse
from playwright.sync_api import sync_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'website')


class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % srv.server_address[1]
URL = BASE + 'budget-planner.html'
res = []


def ck(name, ok, extra=''):
    res.append((name, bool(ok)))
    print(('PASS ' if ok else 'FAIL ') + name + (' | ' + str(extra) if extra != '' else ''))


def counter():
    import urllib.request
    try:
        return urllib.request.urlopen(urllib.request.Request('https://gc.zgo.at/count.v5.js', headers={'User-Agent': 'Mozilla/5.0'}), timeout=20).read()
    except Exception as ex:
        print('NOTE: GoatCounter script not fetched (%s)' % ex)
        return None


COUNTER = counter()


def ctx(browser, **kw):
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


def setrows(pg, rows):
    """rows: list of (name, priority, qty, price) typed into the custom list."""
    pg.select_option('#tmpl', 'custom')
    pg.wait_for_timeout(80)
    while pg.locator('#rows tr').count() < len(rows):
        pg.click('#add-row')
    for i, (n, p, q, u) in enumerate(rows):
        tr = pg.locator('#rows tr').nth(i)
        tr.locator('.r-n').fill(n)
        tr.locator('.r-p').select_option(p)
        tr.locator('.r-q').fill('' if q is None else str(q))
        tr.locator('.r-u').fill('' if u is None else str(u))
    pg.wait_for_timeout(120)


def verdict(pg):
    return pg.inner_text('#calc-out')


with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    c = ctx(b, viewport={'width': 1280, 'height': 900})
    pg = c.new_page()
    reqs, cons = [], []
    pg.on('request', lambda r: reqs.append((r.method, r.url, r.post_data or '')))
    pg.on('console', lambda m: cons.append((m.type, m.text)))
    pg.on('pageerror', lambda e: cons.append(('pageerror', str(e))))
    pg.goto(URL, wait_until='load')
    pg.wait_for_timeout(300)

    ck('title and one h1', 'Budget Planner' in pg.title() and pg.locator('h1').count() == 1, pg.title())

    # --- privacy: typing never writes the plan into the address bar
    pg.fill('#budget', '123456')
    setrows(pg, [('Secret item', 'must', 2, 777), ('Other thing', 'nice', 1, 31)])
    pg.click('button.calc-btn'); pg.wait_for_timeout(150)
    ck('address bar has no query or hash after typing and submitting', pg.evaluate('() => location.search + location.hash') == '', pg.evaluate('() => location.href'))
    leaks = [r for r in reqs if re.search(r'Secret|777|123456|\?s=', urllib.parse.unquote(r[1]) + r[2])]
    ck('no entered value in any request URL or body', not leaks, leaks)
    ck('no POST requests', all(r[0] == 'GET' for r in reqs), sorted({r[0] for r in reqs}))
    hist = pg.evaluate('() => history.length')

    # --- the copy link is built only on click and restores the plan
    pg.evaluate("() => { window.__copied = null; Object.defineProperty(navigator, 'clipboard', {value: {writeText: t => { window.__copied = t; return Promise.resolve(); }}, configurable: true}); }")
    pg.click('#copy-link'); pg.wait_for_timeout(150)
    link = pg.evaluate('() => window.__copied')
    ck('copy link puts a link with ?s= on the clipboard', bool(link) and '?s=' in link, (link or '')[:80])
    ck('address bar still clean after copying', pg.evaluate('() => location.search') == '')
    ck('copy-link note says what the link contains', 'contains your list, budget, entered prices and any rough guesses' in verdict(pg) and 'private note' in verdict(pg))
    pg2 = c.new_page()
    pg2.goto(link, wait_until='load'); pg2.wait_for_timeout(300)
    ck('opening the copied link restores the list, budget and prices', pg2.locator('#rows tr').count() == 2 and pg2.input_value('#budget') == '123456' and pg2.locator('#rows tr').nth(0).locator('.r-n').input_value() == 'Secret item' and pg2.locator('#rows tr').nth(0).locator('.r-u').input_value() == '777')
    ck('after opening a shared link the address bar is cleaned', pg2.evaluate('() => location.search') == '', pg2.evaluate('() => location.href'))
    pg2.close()

    # --- verdicts
    pg.fill('#budget', '100')
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Boot mat', 'must', 1, 30)])
    t = verdict(pg)
    ck('all must-haves priced and within budget: says they fit', 'The must-haves fit your budget of $100' in t, t[:160].replace('\n', ' / '))
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Boot mat', 'must', 1, None)])
    t = verdict(pg)
    ck('a must-have without a price: no "fit" claim', 'The must-haves fit your budget' not in t and 'We cannot tell yet whether the must-haves fit your budget of $100' in t, t[:200].replace('\n', ' / '))
    ck('...and it says how many are unpriced and that the figure is a minimum', '1 must-have item has no price or quantity yet' in t and '$40 is only a minimum' in t)
    pg.fill('#budget', '30')
    t = verdict(pg)
    ck('unpriced must-have but the priced ones already exceed the budget: says at least over', 'already at least $10 over your budget of $30' in t and 'cannot tell' not in t.lower(), t[:200].replace('\n', ' / '))
    pg.fill('#budget', '100')
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Mirror', 'nice', 1, None)])
    t = verdict(pg)
    ck('must-haves fit but a nice-to-have is unpriced: says so', 'The must-haves fit your budget of $100' in t and '1 of them still has no price' in t, t[:220].replace('\n', ' / '))
    setrows(pg, [('Hook rail', 'must', 1, 140)])
    t = verdict(pg)
    ck('over budget with all priced: unchanged message', 'The must-haves are $40 over your budget of $100' in t, t[:160].replace('\n', ' / '))
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Boot mat', 'must', 1, None)])
    t = verdict(pg)
    ck('missing-price note says unpriced items are left out, minimums, and no longer says empty = zero', 'leave them out and are only minimums' in t and 'counts as zero' not in t and 'Type 0 if you already own an item' in t, t[-260:].replace('\n', ' / '))

    # --- explicit zero is a real price, blank is not
    pg.fill('#budget', '100')
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Boot mat', 'must', 1, 0)])
    t = verdict(pg)
    ck('an explicit 0 price counts as priced: must-haves fit', 'The must-haves fit your budget of $100' in t and 'no price or quantity yet' not in t, t[:200].replace('\n', ' / '))

    # --- a blank quantity is unknown, never zero; an explicit 0 is valid
    pg.fill('#budget', '100')
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Boot mat', 'must', None, 30)])
    t = verdict(pg)
    alert = pg.inner_text('#calc-err')
    ck('a price with a blank quantity: no "fit" claim, counted as missing', 'The must-haves fit your budget' not in t and 'We cannot tell yet whether the must-haves fit your budget of $100' in t and 'no price or quantity yet' in t, t[:230].replace('\n', ' / '))
    ck('a visible alert names the item that has no quantity', 'Enter a quantity for: Boot mat' in alert and 'Type 0 if you do not need it' in alert, alert)
    ck('the quantity field is marked invalid, the other is not', pg.locator('#rows tr').nth(1).locator('.r-q').get_attribute('aria-invalid') == 'true' and pg.locator('#rows tr').nth(0).locator('.r-q').get_attribute('aria-invalid') is None)
    pg.click('#copy-link'); pg.wait_for_timeout(150)
    qlink = pg.evaluate('() => window.__copied')
    pg3 = c.new_page()
    pg3.goto(qlink, wait_until='load'); pg3.wait_for_timeout(300)
    ck('a shared link keeps the blank quantity blank (not 0 and not 1)', pg3.locator('#rows tr').nth(1).locator('.r-q').input_value() == '' and 'Enter a quantity for: Boot mat' in pg3.inner_text('#calc-err'), pg3.locator('#rows tr').nth(1).locator('.r-q').input_value())
    pg3.close()
    pg.locator('#rows tr').nth(1).locator('.r-q').fill('0')
    pg.wait_for_timeout(120)
    t = verdict(pg)
    ck('an explicit quantity 0 is valid: alert gone and the must-haves fit', pg.inner_text('#calc-err').strip() == '' and 'The must-haves fit your budget of $100' in t and pg.locator('#rows tr').nth(1).locator('.r-q').get_attribute('aria-invalid') is None, t[:200].replace('\n', ' / '))

    # --- rough guesses stay apart from prices
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Boot mat', 'must', 1, None)])
    pg.locator('#rows tr').nth(1).locator('.r-g').fill('4242')
    pg.wait_for_timeout(120)
    t = verdict(pg)
    ck('a rough guess is shown separately, labelled as a guess', 'With your own rough guesses added' in t and 'guesses, not prices' in t and 'about $4282' in t, t[:330].replace('\n', ' / '))
    ck('...and the priced total and the verdict ignore it', 'Must have: $40' in t and 'We cannot tell yet whether the must-haves fit' in t and 'The must-haves fit your budget' not in t)
    ck('the row total column does not use the guess', pg.locator('#rows tr').nth(1).locator('.r-t').inner_text().strip() == '-')
    leaks = [r for r in reqs if '4242' in urllib.parse.unquote(r[1]) + r[2]]
    ck('the guess is sent in no request', not leaks, leaks)
    ck('address bar still clean with a guess', pg.evaluate('() => location.search + location.hash') == '')
    pg.evaluate("() => { window.__copied = null; Object.defineProperty(navigator, 'clipboard', {value: {writeText: t => { window.__copied = t; return Promise.resolve(); }}, configurable: true}); }")
    pg.click('#copy-link'); pg.wait_for_timeout(150)
    link2 = pg.evaluate('() => window.__copied')
    ck('one click on Copy link works right after typing in a field (no redraw on blur swallows it)', bool(link2) and '?s=' in link2, (link2 or '')[:60])
    pg3 = c.new_page(); pg3.goto(link2, wait_until='load'); pg3.wait_for_timeout(300)
    ck('the copied link restores the guess and keeps the price blank', pg3.locator('#rows tr').nth(1).locator('.r-g').input_value() == '4242' and pg3.locator('#rows tr').nth(1).locator('.r-u').input_value() == '', pg3.locator('#rows tr').nth(1).locator('.r-g').input_value())
    pg3.close()

    # --- engine scenarios: independent arithmetic, USD only, required vs optional unknowns
    ck('the planner is USD only: no currency selector and the page says so', pg.locator('#cur').count() == 0 and 'US dollars (USD)' in pg.inner_text('#calc'))
    pg.fill('#budget', '200')
    setrows(pg, [('Hook rail', 'must', 2, 40), ('Boot mat', 'nice', 1, 30), ('Mirror', 'later', 1, 25.5)])
    t = verdict(pg)
    ck('three scenarios match independent arithmetic (80 / 110 / 135.50)', 'Must have: $80' in t and 'Must have + nice to have: $110' in t and 'Everything: $135.50' in t and 'known costs only' not in t, t[:260].replace('\n', ' / '))
    ck('...and the verdict agrees with those numbers', 'The must-haves fit your budget of $200' in t and 'The nice-to-haves fit too, with $90 left' in t, t[:420].replace('\n', ' / '))
    ck('no rough-guess scenario is rendered when no guess is entered', 'rough-guess scenario' not in t)
    setrows(pg, [('Hook rail', 'must', 1, 40), ('Boot mat', 'nice', 1, None), ('Mirror', 'later', 1, None)])
    t = verdict(pg)
    ck('unknown optional lines: the must-haves can still be assessed, subtotals say known costs only', 'The must-haves fit your budget of $200' in t and t.count('known costs only') == 2 and 'Must have: $40' in t and 'Everything: $40' in t, t[:420].replace('\n', ' / '))
    setrows(pg, [('Hook rail', 'must', 1, None), ('Boot mat', 'must', 1, 30), ('Mirror', 'nice', 1, 25)])
    t = verdict(pg)
    ck('unknown required line: cannot tell, partial subtotal labelled known costs only, never a fit', 'We cannot tell yet' in t and 'The must-haves fit' not in t and 'Must have: $30 (known costs only)' in t and t.count('known costs only') == 3, t[:420].replace('\n', ' / '))
    # a guess is a separate scenario: the main numbers and verdict do not move
    before = verdict(pg)
    pg.locator('#rows tr').nth(0).locator('.r-g').fill('9999')
    pg.wait_for_timeout(150)
    after = verdict(pg)
    stripped = re.sub(r'Your rough-guess scenario.*?This does not change the results above\.', '', after, flags=re.S)
    norm = lambda x: re.sub(r'\s+', ' ', x).strip()
    ck('the guess scenario is labelled and lists the guessed item', 'Your rough-guess scenario, not verified prices.' in after and 'Guessed items: Hook rail' in after and 'about $10029' in after, after[:520].replace('\n', ' / '))
    ck('the main scenarios and the verdict are unchanged by the guess', norm(stripped) == norm(before), (norm(before)[:160], norm(stripped)[:160]))
    pg.locator('#rows tr').nth(0).locator('.r-g').fill('')
    # more than 4 decimals is never rounded silently
    setrows(pg, [('Hook rail', 'must', 1, 0.12345)])
    ck('a price with more than 4 decimals: visible alert, counted as no price', 'at most 4 decimal places for the price of: Hook rail' in pg.inner_text('#calc-err') and 'We cannot tell yet' in verdict(pg), pg.inner_text('#calc-err'))
    # a shared link made before the USD-only release (pound symbol) still opens, with an honest note
    import base64 as _b64
    old = {'t': 'custom', 'b': '100', 'c': '\u00a3', 'r': [['Hook rail', 'must', 1, 40, None]]}
    enc = _b64.urlsafe_b64encode(json.dumps(old, ensure_ascii=False).encode('utf-8')).decode().rstrip('=')
    pgl = c.new_page(); pgl.goto(BASE + 'budget-planner.html?s=' + enc, wait_until='load'); pgl.wait_for_timeout(300)
    tl = verdict(pgl)
    ck('an old link with a pound symbol opens in dollars with a no-conversion note', 'Must have: $40' in tl and 'US dollars only' in tl and 'no conversion' in tl, tl[:300].replace('\n', ' / '))
    pgl.close()
    # the copy about the link matches the URL: list, budget, entered prices and rough guesses
    full = pg.inner_text('main')
    ck('every visible description of the share link mentions rough guesses', full.count('entered prices and any rough guesses') >= 3 and 'list, budget and prices' not in full, full.count('entered prices and any rough guesses'))

    # --- review fixes: a rejected >4-decimal price is unknown everywhere; an empty Must scenario is not a fit
    pg.fill('#budget', '100')
    setrows(pg, [('Hook rail', 'must', 2, 0.12345), ('Boot mat', 'must', 1, 5)])
    t = verdict(pg)
    row0 = pg.locator('#rows tr').nth(0)
    ck('rejected 4+ decimal price: typed value kept, no line total on the row', row0.locator('.r-u').input_value() == '0.12345' and row0.locator('.r-t').inner_text().strip() == '-', row0.locator('.r-t').inner_text())
    ck('...totals use only the accepted price and say known costs only', 'Must have: $5' in t and 'known costs only' in t and '$0.25' not in t and '$0.24' not in t and 'We cannot tell yet' in t, t[:260].replace('\n', ' / '))
    ck('...the missing-price message and the buying order treat it as missing', '1 must-have item has no price or quantity yet' in t and 'Hook rail (Must have)' in t and 'Hook rail (Must have, $' not in t and 'at most 4 decimal places for the price of: Hook rail' in pg.inner_text('#calc-err'), t[-330:].replace('\n', ' / '))
    setrows(pg, [('Mirror', 'nice', 1, 25), ('Basket', 'later', 1, 15)])
    t = verdict(pg)
    ck('a Nice/Later-only plan: no must-have items selected, never a fit, no $0 cost claimed for the essentials', 'No must-have items selected.' in t and 'The must-haves fit' not in t and 'Must have: none selected' in t and 'Must have: $0' not in t, t[:300].replace('\n', ' / '))
    ck('...the other scenarios still show their real totals', 'Must have + nice to have: $25' in t and 'Everything: $40' in t, t[:300].replace('\n', ' / '))
    setrows(pg, [('Old chair', 'must', 1, 0)])
    t = verdict(pg)
    ck('an explicit 0 price on a Must is a priced zero-cost scope, still assessed', 'Must have: $0' in t and 'The must-haves fit your budget of $100' in t and 'No must-have items selected' not in t, t[:240].replace('\n', ' / '))

    # --- template list with no prices at all and a budget
    pg.select_option('#tmpl', 'entryway'); pg.fill('#budget', '200'); pg.wait_for_timeout(150)
    t = verdict(pg)
    hints = pg.evaluate("() => [...document.querySelectorAll('#rows .r-h')].map(e => e.textContent.trim())")
    ck('every item of a ready-made project has a short tip and no tip mentions a price', len(hints) == 7 and all(hints) and not any('$' in h or '£' in h or '€' in h for h in hints), hints[:2])
    ck('fresh template with a budget and no prices: cannot tell, never "fit"', 'The must-haves fit your budget' not in t and 'cannot tell yet' in t.lower(), t[:200].replace('\n', ' / '))

    # --- escaping, console, keyboard focus
    setrows(pg, [('<img src=x onerror=window.__x=1>', 'must', 1, 5)])
    ck('item names are escaped (no injected element)', pg.evaluate('() => !window.__x && !document.querySelector("#calc-out img")'))
    errs = [x for x in cons if x[0] in ('error', 'pageerror')]
    ck('no console errors or page errors (desktop)', not errs, errs)
    pg.focus('#budget'); pg.keyboard.press('Tab')
    fi = pg.evaluate("() => { const s = getComputedStyle(document.activeElement); return [document.activeElement.className || document.activeElement.id, s.outlineStyle, s.outlineWidth, s.boxShadow]; }")
    ck('visible keyboard focus indicator', (fi[1] != 'none' and fi[2] != '0px') or fi[3] != 'none', fi)
    ck('browser history was not filled with states while typing', hist <= 3, hist)
    pg.goto(URL, wait_until='load'); pg.wait_for_timeout(300)  # fresh load: the default 7-item template, as on the owner's desktop-site screenshot
    dgeo = pg.evaluate("""() => {
      const w = document.querySelector('.budget-wrap'); const rows = [...document.querySelectorAll('#rows tr')];
      const vis = e => { const r = e.getBoundingClientRect(); const wr = w.getBoundingClientRect(); return r.left >= wr.left - 1 && r.right <= wr.right + 1 && r.width > 30; };
      return { wrapScroll: w.scrollWidth - w.clientWidth, rows: rows.length,
        fields: rows.every(tr => ['.r-n', '.r-p', '.r-q', '.r-u', '.r-g', '.r-x'].every(s => vis(tr.querySelector(s))) && vis(tr.querySelector('.r-t'))),
        clipped: rows.map(tr => tr.querySelector('.r-n')).filter(i => i.scrollWidth > i.clientWidth + 1).map(i => i.value),
        w: innerWidth };
    }""")
    ck('desktop: no sideways scroll, every field and the Total column visible in every row', dgeo['wrapScroll'] <= 1 and dgeo['fields'] and dgeo['rows'] >= 3, dgeo)
    ck('desktop: no item name is cut off', dgeo['clipped'] == [], dgeo['clipped'])
    for dw in (720, 820, 980):
        pg.set_viewport_size({'width': dw, 'height': 900}); pg.wait_for_timeout(150)
        g2 = pg.evaluate("""() => { const w = document.querySelector('.budget-wrap'); const rows = [...document.querySelectorAll('#rows tr')];
          return { scroll: w.scrollWidth - w.clientWidth, clipped: rows.map(tr => tr.querySelector('.r-n')).filter(i => i.scrollWidth > i.clientWidth + 1).map(i => i.value),
                   totalIn: rows.every(tr => tr.querySelector('.r-t').getBoundingClientRect().right <= w.getBoundingClientRect().right + 1) }; }""")
        ck('tablet/desktop-site width %d px: no sideways scroll, names whole, Total inside the box' % dw, g2['scroll'] <= 1 and g2['clipped'] == [] and g2['totalIn'], g2)
    pg.set_viewport_size({'width': 1280, 'height': 900})
    c.close()

    # --- mobile
    mc = ctx(b, viewport={'width': 360, 'height': 740}, device_scale_factor=2, is_mobile=True, has_touch=True)
    mp = mc.new_page()
    merr = []
    mp.on('pageerror', lambda e: merr.append(str(e)))
    mp.goto(URL, wait_until='load'); mp.wait_for_timeout(300)
    mp.fill('#budget', '200')
    ck('mobile 360px: no horizontal overflow of the page', mp.evaluate('() => document.documentElement.scrollWidth <= innerWidth + 1'), mp.evaluate('() => [document.documentElement.scrollWidth, innerWidth]'))
    fs = mp.evaluate("() => [...document.querySelectorAll('#calc input:not([type=hidden]),#calc select')].map(e => parseFloat(getComputedStyle(e).fontSize))")
    ck('mobile: every field font >= 16px', min(fs) >= 16, min(fs))
    bh = mp.evaluate("() => Math.round(document.querySelector('.calc-btn').getBoundingClientRect().height)")
    ck('mobile: submit height >= 40px', bh >= 40, bh)
    setrows(mp, [('Hook rail', 'must', 2, 40), ('Boot mat', 'nice', 1, None), ('Mirror', 'later', 1, None)])
    mp.locator('#rows tr').nth(1).locator('.r-g').fill('30')
    mp.wait_for_timeout(200)
    ck('mobile 360px with three scenarios and a guess scenario: no horizontal overflow', mp.evaluate('() => document.documentElement.scrollWidth <= innerWidth + 1'), mp.evaluate('() => [document.documentElement.scrollWidth, innerWidth]'))
    ck('mobile: scenarios and the guess scenario are rendered', 'Must have: $80' in mp.inner_text('#calc-out') and 'Your rough-guess scenario' in mp.inner_text('#calc-out'), mp.inner_text('#calc-out')[:200].replace('\n', ' / '))
    # --- owner's real phone (8 Nov): the table scrolled sideways, so Qty and Price were off-screen and names were cut
    mp.goto(URL, wait_until='load'); mp.wait_for_timeout(300)  # fresh load: the default 7-item template, as on the owner's phone
    geo = mp.evaluate("""() => {
      const w = document.querySelector('.budget-wrap'); const rows = [...document.querySelectorAll('#rows tr')];
      const inView = e => { const r = e.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.width > 40; };
      return { wrapScroll: w.scrollWidth - w.clientWidth, rows: rows.length,
        fields: rows.every(tr => ['.r-n', '.r-p', '.r-q', '.r-u', '.r-g'].every(s => inView(tr.querySelector(s)))),
        clipped: rows.map(tr => tr.querySelector('.r-n')).filter(i => i.scrollWidth > i.clientWidth + 1).map(i => i.value),
        stacked: rows.every(tr => Math.abs(tr.querySelector('.r-q').getBoundingClientRect().top - tr.querySelector('.r-u').getBoundingClientRect().top) < 5),
        tap: rows.every(tr => tr.querySelector('.r-x').getBoundingClientRect().height >= 40),
        theadHidden: document.querySelector('.budget-table thead').getBoundingClientRect().width <= 2 };
    }""")
    ck('mobile 360px: the table does not scroll sideways any more', geo['wrapScroll'] <= 1, geo)
    ck('mobile 360px: item, priority, qty, price and guess of every row are fully on screen', geo['fields'] and geo['rows'] >= 7, geo)
    ck('mobile 360px: no item name is cut off in its field', geo['clipped'] == [], geo['clipped'])
    ck('mobile 360px: rows are cards (qty and price side by side), remove button is tap-sized, header only for screen readers', geo['stacked'] and geo['tap'] and geo['theadHidden'], geo)
    lab = mp.evaluate("() => [...document.querySelectorAll('#rows tr:first-child td[data-label]')].map(td => td.dataset.label)")
    ck('mobile cards show a visible label above every field', lab == ['Item', 'Priority', 'Qty', 'Price each ($)', 'Rough guess (optional)', 'Total'], lab)
    ck('mobile: no page errors', not merr, merr)
    mc.close()
    b.close()

fails = [n for n, ok in res if not ok]
print('TOTAL', len(res), 'FAILS', fails)
raise SystemExit(1 if fails else 0)
