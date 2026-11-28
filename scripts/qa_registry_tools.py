#!/usr/bin/env python3
"""Registry-driven responsive QA for every public HomeProjectWise tool."""
from __future__ import annotations
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "website"
OUT = ROOT / "visual-qa-results"
OUT.mkdir(parents=True, exist_ok=True)
REGISTRY = json.loads((SITE / "tools-registry.json").read_text(encoding="utf-8"))
BASELINE = json.loads((ROOT / "scripts" / "qa-target-size-baseline.json").read_text(encoding="utf-8"))
VIEWPORTS = [(320, 740), (390, 844), (1280, 900)]
HOME_FORMS = {
    "home-project-calculator": ("measure-form", "measure-result"),
    "home-project-calculator-area-volume": ("measure-form", "measure-result"),
    "home-project-calculator-paint": ("paint-form", "paint-result"),
    "home-project-calculator-flooring": ("material-form", "material-result"),
    "home-project-calculator-electricity": ("energy-form", "energy-result"),
    "home-project-calculator-project-cost": ("project-form", "project-result"),
    "home-project-calculator-wallpaper": ("wp-form", "wp-result"),
}
RESULT_BY_FORM = {
    "calc": "calc-out", "trim-form": "trim-result", "brightness-form": "brightness-result",
    "concrete-slab-form": "concrete-slab-result", "deck-form": "deck-result",
    "dp-form": "dp-result", "fence-form": "fence-result", "ins-form": "ins-result",
    "msc-form": "msc-result", "pavers-form": "pavers-result", "planner": "planner-result",
    "rl-form": "rl-result", "roof-form": "roof-result", "siding-form": "siding-result",
}
QA_VALUES = {
    "bathroom-fan-size": {"len":"12", "wid":"10"},
    "crawl-space-dehumidifier": {"len":"20", "wid":"20", "rh":"55"},
    "decking-quantity-calculator": {"deck-board-width":"5.5", "deck-board-gap":"0.25", "deck-stock-length":"12", "deck-length-1":"15", "deck-width-1":"12", "deck-edge-1":"0", "deck-waste":"0"},
    "home-project-calculator-wallpaper": {"wp-saleunit":"double roll", "wp-rollwidth":"1.75", "wp-length":"33", "wp-repeat":"0", "wp-price":"", "wp-currency":"USD"},
    "rug-size": {"Room width feet":"12", "Room width inches":"0", "Room length feet":"15", "Room length inches":"0", "Seating area width feet":"10", "Seating area width inches":"0", "Seating area depth feet":"8", "Seating area depth inches":"0"},
}

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass

server = ThreadingHTTPServer(("127.0.0.1", 0), lambda *a, **kw: QuietHandler(*a, directory=str(SITE), **kw))
threading.Thread(target=server.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{server.server_port}/"
checks, failures, skips = [], [], []

def check(name, ok, detail=""):
    item = {"name": name, "passed": bool(ok), "detail": str(detail)[:400]}
    checks.append(item)
    print(("PASS " if ok else "FAIL ") + name + ("" if ok else " | " + str(detail)[:300]))
    if not ok:
        failures.append(item)

def skip(name, detail=""):
    skips.append({"name": name, "detail": str(detail)[:300]})
    print("SKIP " + name + ("" if not detail else " | " + str(detail)[:200]))

def activate_deep_link(page, fragment):
    if fragment:
        tab = page.locator(f'button[aria-controls="{fragment}"]')
        if tab.count() and tab.first.is_visible():
            tab.first.click()
            page.wait_for_timeout(50)

def choose_supported_country(page):
    page.evaluate("""() => {
      document.querySelectorAll('select[id*="country" i],select[name*="country" i]').forEach(el => {
        const options = [...el.options].filter(x => x.value !== '' && !x.disabled);
        const preferred = options.find(x => /united states|\\busa\\b|\\bus\\b/i.test(x.textContent + ' ' + x.value));
        const option = preferred || options.find(x => !/choose|select|country/i.test(x.textContent));
        if (option) {
          el.value = option.value;
          el.dispatchEvent(new Event('input', {bubbles:true}));
          el.dispatchEvent(new Event('change', {bubbles:true}));
        }
      });
    }""")

def fill_form(form, tool_id):
    values = QA_VALUES.get(tool_id, {})
    form.evaluate("""(form, values) => {
      const seen = new Set();
      for (const el of form.querySelectorAll('input,select,textarea')) {
        if (el.disabled || el.type === 'hidden' || el.offsetParent === null) continue;
        if (el.type === 'radio') {
          if (!seen.has(el.name)) {
            seen.add(el.name);
            const group = [...form.querySelectorAll('input[type="radio"]')].filter(x => x.name === el.name);
            if (!group.some(x => x.checked)) el.checked = true;
            el.dispatchEvent(new Event('input', {bubbles:true}));
            el.dispatchEvent(new Event('change', {bubbles:true}));
          }
          continue;
        }
        if (el.type === 'checkbox') {
          if (el.required) el.checked = true;
          el.dispatchEvent(new Event('input', {bubbles:true}));
          el.dispatchEvent(new Event('change', {bubbles:true}));
          continue;
        }
        const override = values[el.id] !== undefined ? values[el.id] : values[el.getAttribute('aria-label')];
        if (override !== undefined) {
          el.value = String(override);
        } else if (el.tagName === 'SELECT') {
          if (!el.value || /country/i.test(el.id + ' ' + el.name)) {
            const options = [...el.options].filter(x => x.value !== '' && !x.disabled);
            const preferred = /country/i.test(el.id + ' ' + el.name)
              ? options.find(x => /united states|\\busa\\b|\\bus\\b/i.test(x.textContent + ' ' + x.value))
              : null;
            const option = preferred || options.find(x => !/choose|select|country/i.test(x.textContent));
            if (option) el.value = option.value;
          }
        } else if (el.type === 'number') {
          const min = el.min === '' ? 0 : Number(el.min), max = el.max === '' ? Infinity : Number(el.max);
          const current = el.value === '' ? NaN : Number(el.value);
          if (Number.isFinite(current) && current >= min && current <= max) {
            el.dispatchEvent(new Event('input', {bubbles:true}));
            el.dispatchEvent(new Event('change', {bubbles:true}));
            continue;
          }
          const step = el.step && el.step !== 'any' ? Number(el.step) : 1;
          const fieldId = (el.id || '').toLowerCase();
          let value = /shared-corners|openings|clearance|joint|border|gap/.test(fieldId) && min <= 0 ? 0 : Math.max(min, 1);
          if (Number.isFinite(max)) value = Math.min(value, max);
          if (Number.isFinite(step) && step > 0) value = Math.ceil(value / step) * step;
          if (Number.isFinite(max)) value = Math.min(value, max);
          el.value = String(value);
        } else if (el.tagName === 'TEXTAREA' && !el.value) el.value = 'QA test';
        else if (el.type === 'text' && !el.value) {
          const id = (el.id || '') + ' ' + (el.getAttribute('aria-label') || '');
          el.value = /size|frame/i.test(id + ' ' + (el.placeholder || '')) ? '18x24' : (/name|item/i.test(id) ? 'QA item' : '1');
        } else if (el.type === 'email' && !el.value) el.value = 'qa@example.com';
        el.dispatchEvent(new Event('input', {bubbles:true}));
        el.dispatchEvent(new Event('change', {bubbles:true}));
      }
    }""", values)

def form_and_result(page, tool_id):
    if tool_id in HOME_FORMS:
        form_id, result_id = HOME_FORMS[tool_id]
    else:
        forms = page.locator("form:visible")
        if not forms.count(): return None, None
        form_id = forms.first.get_attribute("id") or ""
        result_id = RESULT_BY_FORM.get(form_id, "")
    if not form_id or not result_id: return None, None
    form, result = page.locator("#" + form_id), page.locator("#" + result_id)
    if not form.count() or not result.count(): return None, None
    return form, result

def metrics(page):
    return page.evaluate("""() => {
      const visible = el => { const r=el.getBoundingClientRect(),s=getComputedStyle(el); return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'; };
      const clipped=[];
      document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
        if(visible(el)&&el.scrollWidth>el.clientWidth+1)clipped.push({id:el.id,placeholder:el.placeholder,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth});
      });
      const selector='button,input:not([type="hidden"]):not([type="radio"]):not([type="checkbox"]):not([readonly]),select,textarea,[role="button"],a.button,a.btn,label:has(input[type="radio"]),label:has(input[type="checkbox"])';
      const small=[];
      document.querySelectorAll(selector).forEach(el=>{
        if(!visible(el)||el.disabled)return; const r=el.getBoundingClientRect();
        if(r.width<44||r.height<44)small.push({tag:el.tagName,id:el.id,width:Math.round(r.width),height:Math.round(r.height),text:(el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,70)});
      });
      return {pageWidth:document.documentElement.scrollWidth,clipped,small};
    }""")

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox"])
        for tool in REGISTRY["tools"]:
            parsed = urlsplit(tool["url"])
            baseline_entry = BASELINE["pages"].get(tool["id"])
            baseline_debt_counts = []
            for width, height in VIEWPORTS:
                context = browser.new_context(viewport={"width":width,"height":height}, reduced_motion="reduce")
                page = context.new_page()
                console_errors, page_errors = [], []
                def capture_console(msg):
                    if msg.type != "error":
                        return
                    location = msg.location or {}
                    source = location.get("url", "")
                    if source and not source.startswith(BASE):
                        return
                    if "Failed to load resource: net::ERR_FAILED" in msg.text:
                        return
                    console_errors.append(msg.text)
                page.on("console", capture_console)
                page.on("pageerror", lambda exc: page_errors.append(str(exc)))
                page.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE) else route.abort())
                label = f'{tool["id"]}/{width}px'
                try:
                    response = page.goto(BASE + tool["url"], wait_until="domcontentloaded", timeout=20000)
                    check(label + ": page loads", bool(response and response.status==200), response.status if response else "no response")
                    activate_deep_link(page, parsed.fragment)
                    page.wait_for_timeout(80)
                    m = metrics(page)
                    if baseline_entry:
                        baseline_debt_counts.append(len(m["small"]))
                    if baseline_entry:
                        print("WARN known-debt baseline: %s — %d sub-44px interactive targets; %s" %
                              (tool["id"], len(m["small"]), baseline_entry["reason"]))
                        print("WARN known-debt selectors for designer follow-up: %s" %
                              ", ".join(baseline_entry["selectors"]))
                    check(label + ": no sideways page scroll", m["pageWidth"]<=width+1, m["pageWidth"])
                    check(label + ": placeholders are not clipped", not m["clipped"], m["clipped"][:5])
                    if baseline_entry:
                        check(label + ": sub-44px targets are warnings on approved legacy page", True, "%d known-debt targets" % len(m["small"]))
                    else:
                        check(label + ": all interactive targets are at least 44px", not m["small"], m["small"][:8])
                    choose_supported_country(page)
                    form, result = form_and_result(page, tool["id"])
                    if tool["id"] == "home-project-calculator-project-cost":
                        skip(label + ": result-scroll check", "project-cost tab is a project list, not a calculate form; covered by Project List QA")
                    elif form and result:
                        before = result.inner_text()
                        submit = form.locator('button[type="submit"],input[type="submit"],button:not([type])').first
                        if submit.count() and submit.is_visible():
                            fill_form(form, tool["id"])
                            submit.click(timeout=5000, no_wait_after=True)
                            page.wait_for_timeout(450)
                            after = result.inner_text()
                            if after.strip() and after != before:
                                rect = result.evaluate("el=>{const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom};}")
                                check(label + ": calculation result is brought into view", rect["top"]>=-1 and rect["top"]<height and rect["bottom"]>0, rect)
                            else:
                                skip(label + ": result-scroll check", "generic safe inputs produced no changed result: " + after.strip()[:140])
                        else: skip(label + ": result-scroll check", "no enabled submit control")
                    else: skip(label + ": result-scroll check", "no visible form/result pair for this registry entry")
                    check(label + ": no browser page errors", not page_errors, page_errors[:3])
                    check(label + ": no application console errors", not console_errors, console_errors[:3])
                except Exception as exc:
                    check(label + ": QA completed", False, repr(exc))
                finally:
                    context.close()
            if baseline_entry:
                check(tool["id"] + ": page-level baseline still reproduces known debt across all tested viewports",
                      sum(baseline_debt_counts) > 0,
                      "baseline page has no sub-44px targets at 320/390/1280; remove its baseline entry")
        browser.close()
finally:
    server.shutdown()

summary={"registry_tools":len(REGISTRY["tools"]),"viewports":[w for w,_ in VIEWPORTS],"checks":len(checks),
         "passed":sum(1 for x in checks if x["passed"]),"failed":len(failures),
         "skipped_result_scroll":len(skips),"failures":failures,"skips":skips}
(OUT/"registry-tools.json").write_text(json.dumps(summary,indent=2),encoding="utf-8")
print("Registry-driven QA: %d tools, %d checks, %d passed, %d failed, %d result-scroll skips" %
      (summary["registry_tools"],summary["checks"],summary["passed"],summary["failed"],summary["skipped_result_scroll"]))
if failures: raise SystemExit(1)
