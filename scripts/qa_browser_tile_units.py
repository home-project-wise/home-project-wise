"""Browser QA for the tile calculator's starting units (Chromium via Playwright, local pages only).
Usage: python3 scripts/qa_browser_tile_units.py
Checks that the tile size, joint and label-coverage units start from the floor unit, never override a unit the visitor
picked or sit beside a number they typed, and that the result is the same in both unit systems. Chromium only."""
import os, sys, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'website')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = socketserver.TCPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = 'http://127.0.0.1:%d/home-project-calculator.html' % srv.server_address[1]
fails = []
def ck(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' | ' + str(extra) if extra != '' else ''))
    if not ok: fails.append(name)
def units(pg):
    return [pg.input_value('#tile-size-unit'), pg.input_value('#tile-joint-unit'), pg.input_value('#tile-coverage-unit')]
def fresh(b):
    pg = b.new_context(viewport={'width': 1280, 'height': 900}).new_page()
    errors = []
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(URL, wait_until='load'); pg.click('#tab-material'); pg.wait_for_selector('#tile-unit')
    return pg, errors
with sync_playwright() as p:
    b = p.chromium.launch(args=['--no-sandbox'])
    pg, errors = fresh(b)
    ck('metres start: tile cm, joint mm, coverage m2', units(pg) == ['cm', 'mm', 'm2'], units(pg))
    pg.select_option('#tile-unit', 'ft')
    ck('feet: tile in, joint in, coverage ft2', units(pg) == ['in', 'in', 'ft2'], units(pg))
    pg.select_option('#tile-unit', 'm')
    ck('back to metres: units follow again', units(pg) == ['cm', 'mm', 'm2'], units(pg))
    ck('no page errors', not errors, errors)
    pg, errors = fresh(b)
    pg.select_option('#tile-size-unit', 'mm'); pg.select_option('#tile-unit', 'ft')
    ck('a tile unit the visitor picked is kept; the untouched ones follow', units(pg) == ['mm', 'in', 'ft2'], units(pg))
    pg, errors = fresh(b)
    pg.fill('#tile-length', '12'); pg.fill('#tile-box-coverage', '10'); pg.select_option('#tile-unit', 'ft')
    ck('units beside typed numbers are not changed', units(pg) == ['cm', 'in', 'm2'], units(pg))
    pg, errors = fresh(b)
    pg.select_option('#tile-unit', 'ft')
    pg.fill('#tile-length-1', '12'); pg.fill('#tile-width-1', '10')
    pg.fill('#tile-length', '12'); pg.fill('#tile-width', '12'); pg.fill('#tile-joint', '0.125'); pg.fill('#tile-box-coverage', '10')
    pg.click('#tile-form button[type=submit]')
    out = pg.inner_text('#tile-result')
    ck('feet worked example: 118 tiles and 12 boxes', 'Estimated tiles: 118' in out and 'Estimated boxes: 12' in out, out)
    pg, errors = fresh(b)
    pg.fill('#tile-length-1', '3.6576'); pg.fill('#tile-width-1', '3.048')
    pg.fill('#tile-length', '30.48'); pg.fill('#tile-width', '30.48'); pg.fill('#tile-joint', '3.175'); pg.fill('#tile-box-coverage', '0.9290304')
    pg.click('#tile-form button[type=submit]')
    out = pg.inner_text('#tile-result')
    ck('metric twin of the same room and tile: 118 tiles and 12 boxes', 'Estimated tiles: 118' in out and 'Estimated boxes: 12' in out, out)
    b.close()
print('%d failed' % len(fails)); sys.exit(1 if fails else 0)
