#!/usr/bin/env python3
"""Vision guard for HomeProjectWise.

A vision model (Gemini) LOOKS at every article image together with the text of the
section it illustrates and decides keep / weak / replace. In fix mode it can also find a
better photo (Pexels / Unsplash), vet that photo with the same vision check, and swap it in.
No human needs to look at images.

Modes
  audit    read-only report of every image   -> data/image_audit/latest.json + REPORT.md
  fix      audit + safe automatic fixes (alt text, vetted replacements, max N per run)
  check    PR gate: only images added/changed versus BASE_REF must pass
  content  read-only value audit of the article text -> data/image_audit/content_latest.json
"""
import argparse, base64, hashlib, html, json, os, re, subprocess, sys, time
import urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'website'
ART = SITE / 'articles'
DATA = ROOT / 'data'
OUT = DATA / 'image_audit'
CACHE = DATA / 'image_vision_cache.json'
PROTECTED = DATA / 'image_protected.json'
REGISTRY = DATA / 'used_images.json'
MODEL = os.environ.get('VISION_MODEL', '')
GEMINI_KEY = os.environ.get('GEMINI_API_KEY', '')
PROMPT_VERSION = 'v1'
MIN_INTERVAL = float(os.environ.get('VISION_MIN_INTERVAL', '6.5'))
UA = {'User-Agent': 'Mozilla/5.0 (HomeProjectWise vision guard)'}
IMG_RE = re.compile(r'<img\b[^>]*>', re.I)
_last_call = [0.0]


def load_json(p, default):
    try:
        return json.loads(Path(p).read_text(encoding='utf-8'))
    except Exception:
        return default


def save_json(p, data):
    Path(p).parent.mkdir(parents=True, exist_ok=True)
    Path(p).write_text(json.dumps(data, indent=1, ensure_ascii=False, sort_keys=True) + '\n', encoding='utf-8')


def attr(tag, name):
    m = re.search(r'\b' + name + r'="([^"]*)"', tag)
    return m.group(1) if m else ''


def text_of(h):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', h))).strip()


def photo_key(src):
    m = re.search(r'photo-[0-9a-f]+-[0-9a-f]+', src)
    if m:
        return m.group(0)
    m = re.search(r'pexels-photo-(\d+)', src) or re.search(r'pexels\.com/photos/(\d+)', src)
    if m:
        return 'pexels-' + m.group(1)
    return 'local-' + src.split('?')[0].split('/')[-1]


def parse_images_text(t, stem):
    body = re.sub(r'<(script|style)[\s\S]*?</\1>', '', t)
    h1 = re.search(r'<h1[^>]*>([\s\S]*?)</h1>', body)
    title = text_of(h1.group(1)) if h1 else stem
    out = []
    for m in IMG_RE.finditer(body):
        tag = m.group(0)
        src = attr(tag, 'src')
        if not src or src.startswith('data:') or src.split('?')[0].lower().endswith('.svg'):
            continue
        heads = list(re.finditer(r'<h[23][^>]*>([\s\S]*?)</h[23]>', body[:m.start()]))
        section = text_of(heads[-1].group(1)) if heads else 'Introduction'
        before = text_of(body[max(0, m.start() - 1500):m.start()])[-450:]
        after_html = body[m.end():m.end() + 1500]
        cap = re.search(r'<figcaption[^>]*>([\s\S]*?)</figcaption>', after_html[:600])
        out.append(dict(article=stem, index=len(out), role='hero' if not out else 'inner', src=src,
                        alt=html.unescape(attr(tag, 'alt')), caption=text_of(cap.group(1)) if cap else '',
                        section=section, before=before, after=text_of(after_html)[:350], title=title,
                        key=photo_key(src)))
    return out


def parse_images(path):
    return parse_images_text(path.read_text(encoding='utf-8'), path.stem)


def small_url(u):
    p = urllib.parse.urlsplit(u)
    if 'images.unsplash.com' in p.netloc:
        q = dict(urllib.parse.parse_qsl(p.query))
        q.update({'w': '640', 'q': '70', 'auto': 'format', 'fit': 'max'})
        q.pop('h', None)
        return urllib.parse.urlunsplit((p.scheme, p.netloc, p.path, urllib.parse.urlencode(q), ''))
    if 'images.pexels.com' in p.netloc:
        return urllib.parse.urlunsplit((p.scheme, p.netloc, p.path, 'auto=compress&cs=tinysrgb&w=640', ''))
    return u


def fetch_image(src, art_path=None):
    u = html.unescape(src)
    if not u.startswith('http'):
        rel = u.split('?')[0]
        if rel.startswith('/home-project-wise/'):
            p = SITE / rel[len('/home-project-wise/'):]
        else:
            p = (art_path.parent / rel) if art_path else (SITE / rel)
        p = p.resolve()
        if ROOT not in p.parents or not p.exists():
            raise FileNotFoundError(u)
        data = p.read_bytes()
        mime = {'.png': 'image/png', '.webp': 'image/webp'}.get(p.suffix.lower(), 'image/jpeg')
    else:
        req = urllib.request.Request(small_url(u), headers=UA)
        with urllib.request.urlopen(req, timeout=40) as r:
            data = r.read()
            mime = (r.headers.get('content-type') or 'image/jpeg').split(';')[0]
    if len(data) > 6_000_000:
        raise ValueError('image too large')
    return data, mime


def gemini_json(prompt, image=None, retries=5):
    if not GEMINI_KEY:
        raise RuntimeError('GEMINI_API_KEY missing')
    parts = [{'text': prompt}]
    if image:
        parts.append({'inline_data': {'mime_type': image[1], 'data': base64.b64encode(image[0]).decode()}})
    body = json.dumps({'contents': [{'parts': parts}],
                       'generationConfig': {'temperature': 0, 'responseMimeType': 'application/json'}}).encode()
    url = 'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent' % MODEL
    for attempt in range(retries):
        wait = MIN_INTERVAL - (time.time() - _last_call[0])
        if wait > 0:
            time.sleep(wait)
        _last_call[0] = time.time()
        req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                resp = json.load(r)
            txt = resp['candidates'][0]['content']['parts'][0]['text']
            txt = re.sub(r'^```(?:json)?|```$', '', txt.strip()).strip()
            return json.loads(txt)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 503) and attempt < retries - 1:
                time.sleep(20 * (attempt + 1))
                continue
            raise RuntimeError('Gemini HTTP %s: %r' % (e.code, e.read()[:200]))
        except (KeyError, IndexError, json.JSONDecodeError) as e:
            if attempt < retries - 1:
                continue
            raise RuntimeError('Gemini bad response: %s' % e)


def image_prompt(it):
    return (
        "You are a strict visual editor for a practical home-improvement website. Look at the attached photo and judge it "
        "for ONE exact place in an article.\n"
        "Article title: " + it['title'] + "\n"
        "Image role: " + ('HERO image at the top of the article' if it['role'] == 'hero' else 'inner image') + "\n"
        "Section heading it sits under: " + it['section'] + "\n"
        "Text just before the image: " + it['before'] + "\n"
        "Text just after the image: " + it['after'] + "\n"
        "Current alt text: " + it['alt'] + "\nCaption: " + it['caption'] + "\n\n"
        "Rules: describe only what is literally visible. matches_section = how directly the photo SHOWS the object, problem or "
        "solution the section is about (10 = unmistakable, 5 = same room or topic but not the subject, 0 = unrelated). A generic "
        "room that merely fits the mood scores at most 5.\n"
        "Return ONLY JSON with exactly these keys: "
        '{"visible_description": "<=40 words, literal", "matches_section": <0-10 integer>, '
        '"hero_appeal": <0-10 integer>, "looks_ai_generated": <true|false>, "has_text_or_watermark": <true|false>, '
        '"is_generic_stock": <true|false>, "alt_is_accurate": <true|false>, '
        '"better_alt": "<=120 chars honest literal alt text, no keyword stuffing", "reason": "<=25 words", '
        '"search_query": "3-6 English words to find a photo that would directly show this section"}')


def _b(x):
    return x is True or str(x).lower() == 'true'


def _i(x):
    try:
        return max(0, min(10, int(float(x))))
    except Exception:
        return 0


def normalize(v):
    return dict(visible_description=str(v.get('visible_description', ''))[:400], matches_section=_i(v.get('matches_section')),
                hero_appeal=_i(v.get('hero_appeal')), looks_ai_generated=_b(v.get('looks_ai_generated')),
                has_text_or_watermark=_b(v.get('has_text_or_watermark')), is_generic_stock=_b(v.get('is_generic_stock')),
                alt_is_accurate=_b(v.get('alt_is_accurate', True)), better_alt=str(v.get('better_alt', ''))[:160].strip(),
                reason=str(v.get('reason', ''))[:240], search_query=str(v.get('search_query', ''))[:80].strip())


def vision(it, art_path, cache, use_cache=True):
    ck = hashlib.sha1('|'.join([PROMPT_VERSION, MODEL, it['key'], it['section'], it['title'], it['role']]).encode()).hexdigest()
    if use_cache and ck in cache:
        return cache[ck]
    v = normalize(gemini_json(image_prompt(it), fetch_image(it['src'], art_path)))
    if use_cache:
        cache[ck] = v
    return v


def classify(v):
    problems = []
    if v['looks_ai_generated']:
        problems.append('ai-look')
    if v['has_text_or_watermark']:
        problems.append('text-or-watermark')
    if v['matches_section'] <= 5:
        problems.append('mismatch')
    if problems:
        return 'replace', problems
    weak = []
    if v['matches_section'] <= 7:
        weak.append('weak-match')
    if v['is_generic_stock']:
        weak.append('generic')
    return ('weak', weak) if weak else ('keep', [])


def protected_articles():
    return set(load_json(PROTECTED, {}).get('articles', []))


def site_files():
    return [f for f in sorted(SITE.glob('*.html')) + sorted(ART.glob('*.html')) if f.name != 'site-audit.html']


def keys_in_site():
    used = {}
    for f in site_files():
        for k in {photo_key(m) for m in re.findall(r'https?://images\.(?:unsplash|pexels)\.com/[^"\'\s<>)]+', f.read_text(encoding='utf-8'))}:
            used.setdefault(k, set()).add(f.stem)
    return used


def audit(paths, cache, only_keys=None, log=print):
    rows = []
    for p in paths:
        for it in parse_images(p):
            if only_keys is not None and it['key'] not in only_keys.get(p.stem, set()):
                continue
            try:
                v = vision(it, p, cache)
                status, problems = classify(v)
            except Exception as e:
                v, status, problems = None, 'error', [str(e)[:120]]
            rows.append(dict(it, vision=v, status=status, problems=problems, path=str(p.relative_to(ROOT))))
            log('  %-52s %-5s %-7s %s' % (p.stem[:52], it['role'], status, ','.join(problems)))
    # duplicate photos between different articles (later article loses; homepage reuse is allowed)
    by_key = {}
    for f in ART.glob('*.html'):
        for it in parse_images(f):
            by_key.setdefault(it['key'], set()).add(f.stem)
    for r in rows:
        others = by_key.get(r['key'], set()) - {r['article']}
        if others and r['article'] > min(others | {r['article']}) and r['status'] != 'error':
            r['problems'] = list(r['problems']) + ['duplicate-with:' + ','.join(sorted(others))]
            r['status'] = 'replace'
    return rows


def write_report(rows, changes=None):
    OUT.mkdir(parents=True, exist_ok=True)
    save_json(OUT / 'latest.json', dict(generated=datetime.now(timezone.utc).isoformat(timespec='seconds'), model=MODEL, rows=rows))
    cnt = {}
    for r in rows:
        cnt[r['status']] = cnt.get(r['status'], 0) + 1
    L = ['# Image vision report', '', 'Generated %s with `%s`.' % (datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC'), MODEL),
         '', 'Totals: ' + ', '.join('%s=%d' % kv for kv in sorted(cnt.items())), '']
    if changes:
        L += ['## Changes applied', ''] + ['- ' + c for c in changes] + ['']
    L += ['## All images', '', '| Article | Role | Section | Match | Status | What the model sees | Problems |', '|---|---|---|---|---|---|---|']
    for r in sorted(rows, key=lambda r: (r['status'] == 'keep', r['article'], r['index'])):
        v = r['vision'] or {}
        L.append('| %s | %s | %s | %s | %s | %s | %s |' % (r['article'], r['role'], r['section'][:40].replace('|', '/'), v.get('matches_section', '-'),
                 r['status'], (v.get('visible_description', '') or '')[:110].replace('|', '/'), ', '.join(r['problems'])))
    (OUT / 'REPORT.md').write_text('\n'.join(L) + '\n', encoding='utf-8')


def http_json(u, headers):
    req = urllib.request.Request(u, headers=dict(UA, **headers))
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


def resolve_model():
    """Pick the newest plain 'gemini-X-flash' model this key can call (models are retired often)."""
    if os.environ.get('VISION_MODEL'):
        return os.environ['VISION_MODEL']
    best = None
    try:
        d = http_json('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000', {'x-goog-api-key': GEMINI_KEY})
        cands = []
        for m in d.get('models', []):
            name = m['name'].split('/')[-1]
            if 'generateContent' not in m.get('supportedGenerationMethods', []):
                continue
            mm = re.fullmatch(r'gemini-(\d+(?:\.\d+)?)-flash', name)
            if mm:
                cands.append((float(mm.group(1)), name))
        if cands:
            best = max(cands)[1]
        print('Models offering generateContent (flash): %s' % sorted(n for _, n in cands))
    except Exception as e:
        print('Model discovery failed: %s' % str(e)[:150])
    return best or 'gemini-flash-latest'


def search_pexels(q):
    key = os.environ.get('PEXELS_API_KEY')
    if not key:
        return []
    d = http_json('https://api.pexels.com/v1/search?query=%s&per_page=15&orientation=landscape' % urllib.parse.quote(q), {'Authorization': key})
    return [dict(provider='pexels', key='pexels-%s' % p['id'], person=p.get('photographer', ''),
                 url=p['src']['original'].split('?')[0] + '?auto=compress&cs=tinysrgb&w=1400') for p in d.get('photos', [])]


def search_unsplash(q):
    key = os.environ.get('UNSPLASH_ACCESS_KEY')
    if not key:
        return []
    d = http_json('https://api.unsplash.com/search/photos?query=%s&per_page=15&orientation=landscape' % urllib.parse.quote(q),
                  {'Authorization': 'Client-ID ' + key})
    out = []
    for p in d.get('results', []):
        raw = p['urls']['raw']
        out.append(dict(provider='unsplash', key=photo_key(raw), person=(p.get('user') or {}).get('name', ''),
                        url=raw.split('?')[0] + '?auto=format&fit=crop&w=1400&q=82'))
    return out


def in_script(t, pos):
    for m in re.finditer(r'<script[\s\S]*?</script>', t):
        if m.start() <= pos < m.end():
            return True
    return False


def set_alt(path, src_raw, new_alt):
    t = path.read_text(encoding='utf-8')
    done = [False]

    def fix(m):
        tag = m.group(0)
        if src_raw not in tag or done[0]:
            return tag
        done[0] = True
        esc = html.escape(new_alt, quote=True)
        return re.sub(r'\balt="[^"]*"', lambda _: 'alt="%s"' % esc, tag) if 'alt="' in tag else tag.replace('<img', '<img alt="%s"' % esc, 1)
    n = IMG_RE.sub(fix, t)
    if n != t:
        path.write_text(n, encoding='utf-8')
    return n != t


def apply_replacement(it, cand, v):
    new_attr = cand['url'].replace('&', '&amp;')
    old = it['key']
    if old.startswith('photo-'):
        pat = r'https://images\.unsplash\.com/' + re.escape(old) + r'[^"\'\s<>)]*'
    elif old.startswith('pexels-'):
        pat = r'https://images\.pexels\.com/photos/' + re.escape(old.split('-', 1)[1]) + r'/[^"\'\s<>)]*'
    else:
        pat = r'[^"\'\s(<>=]*/' + re.escape(old[len('local-'):]) + r'(?:\?[^"\'\s<>)]*)?'
    touched = []
    others = set(keys_in_site().get(old, set())) - {it['article'], 'index', 'guides'}
    targets = [ART / (it['article'] + '.html')]
    if it['role'] == 'hero' and not others:
        targets += [SITE / 'index.html', SITE / 'guides.html']
    for f in targets:
        if not f.exists():
            continue
        t = f.read_text(encoding='utf-8')
        n = re.sub(pat, lambda m: cand['url'] if in_script(t, m.start()) else new_attr, t)
        if n != t:
            f.write_text(n, encoding='utf-8')
            touched.append(f.name)
    art = ART / (it['article'] + '.html')
    if v.get('better_alt'):
        set_alt(art, new_attr, v['better_alt'])
    return touched


def registry_add(cand):
    r = load_json(REGISTRY, {})
    for k, val in (('used_ids', cand['key']), ('used_urls', cand['url'])):
        r.setdefault(k, [])
        if val not in r[k]:
            r[k].append(val)
    if cand.get('person'):
        r.setdefault('used_photographers', [])
        if isinstance(r['used_photographers'], list) and cand['person'] not in r['used_photographers']:
            r['used_photographers'].append(cand['person'])
    save_json(REGISTRY, r)


def find_replacement(it, cache, used, blocked, log=print):
    queries = [q for q in [it['vision'].get('search_query'), (it['section'] + ' ' + it['title'])[:70]] if q]
    tried = 0
    best = None
    for q in queries:
        cands = []
        for fn in (search_pexels, search_unsplash):
            try:
                cands += fn(q)
            except Exception as e:
                log('    search error: %s' % str(e)[:100])
        for c in cands:
            if c['key'] in used or c['key'] in blocked or tried >= 8:
                continue
            tried += 1
            cit = dict(it, src=c['url'], key=c['key'])
            try:
                v = vision(cit, None, cache, use_cache=False)
            except Exception as e:
                log('    candidate error: %s' % str(e)[:100])
                continue
            ok = v['matches_section'] >= 8 and not v['looks_ai_generated'] and not v['has_text_or_watermark'] and not v['is_generic_stock']
            log('    candidate %-22s match=%s ok=%s %s' % (c['key'][:22], v['matches_section'], ok, v['visible_description'][:70]))
            if ok:
                score = (v['matches_section'], v['hero_appeal'] if it['role'] == 'hero' else 0)
                if not best or score > best[0]:
                    best = (score, c, v)
        if best:
            break
    return best


def run_fix(rows, cache, max_replace, log=print):
    changes = []
    prot = protected_articles()
    used = keys_in_site()
    reg = load_json(REGISTRY, {})
    blocked = set(reg.get('blocked_ids', []) or []) | set(reg.get('used_ids', []) or [])
    n_rep = 0
    for r in rows:
        if r['article'] in prot or not r.get('vision'):
            continue
        v = r['vision']
        if r['status'] == 'replace' and n_rep < max_replace:
            log('  replacing %s #%s (%s)' % (r['article'], r['index'], ','.join(r['problems'])))
            best = find_replacement(r, cache, set(used), blocked, log)
            if best:
                _, cand, cv = best
                touched = apply_replacement(r, cand, cv)
                registry_add(cand)
                used[cand['key']] = {r['article']}
                n_rep += 1
                changes.append('%s image #%d (%s): replaced %s -> %s (%s, match %d/10: %s) files: %s' % (
                    r['article'], r['index'], r['section'][:40], r['key'], cand['key'], cand['provider'], cv['matches_section'],
                    cv['visible_description'][:90], ', '.join(touched)))
                r['status'] = 'replaced'
            else:
                changes.append('%s image #%d: NO suitable candidate found (kept current; reasons: %s)' % (r['article'], r['index'], ','.join(r['problems'])))
        elif r['status'] in ('keep', 'weak') and not v['alt_is_accurate'] and v['better_alt']:
            if set_alt(ROOT / r['path'], r['src'], v['better_alt']):
                changes.append('%s image #%d: alt text corrected -> %s' % (r['article'], r['index'], v['better_alt'][:100]))
    return changes


def cmd_check(cache):
    if not GEMINI_KEY:
        print('WARNING: GEMINI_API_KEY not available (fork PR?) - vision gate skipped')
        return 0
    base = os.environ.get('BASE_REF', 'origin/main')
    files = subprocess.run(['git', 'diff', '--name-only', base + '...HEAD', '--', 'website/articles'], capture_output=True, text=True, cwd=ROOT).stdout.split()
    only = {}
    for f in files:
        p = ROOT / f
        if not f.endswith('.html') or not p.exists():
            continue
        old = subprocess.run(['git', 'show', '%s:%s' % (base, f)], capture_output=True, text=True, cwd=ROOT).stdout
        old_keys = {i['key'] for i in parse_images_text(old, p.stem)} if old else set()
        new_keys = {i['key'] for i in parse_images(p)} - old_keys
        if new_keys:
            only[p.stem] = new_keys
    if not only:
        print('No new or changed article images in this PR.')
        return 0
    print('Checking new images in: ' + ', '.join(sorted(only)))
    rows = audit([ART / (s + '.html') for s in sorted(only)], cache, only_keys=only)
    bad = [r for r in rows if r['status'] in ('replace', 'error')]
    for r in rows:
        v = r['vision'] or {}
        print('%s #%s %s: %s | %s' % (r['article'], r['index'], r['status'], v.get('visible_description', '')[:140], ','.join(r['problems'])))
    if bad:
        print('FAIL: %d new image(s) do not fit their section (see above)' % len(bad))
        return 1
    print('PASS: all new images fit their sections')
    return 0


CONTENT_PROMPT = (
    "You are a strict editor for a practical home-improvement site for beginners (US/UK). Judge the article below against these rules: "
    "it must solve one clearly stated real problem; give steps a beginner can follow; contain real value beyond generic advice; be accurate and "
    "not misleading (no invented statistics, costs or tests); avoid filler and keyword stuffing; say what to do, not only what looks nice; "
    "include practical limits and common mistakes where relevant.\n"
    'Return ONLY JSON: {"problem_clear": <0-10>, "actionable": <0-10>, "adds_value": <0-10>, "accurate_honest": <0-10>, '
    '"filler_level": <0-10, 10 = lots of filler>, "decision": "green|yellow|red", '
    '"top_issues": ["<=3 concrete issues, naming the section"], "unsupported_claims": ["<=3 numbers or claims that look unsupported"]}\n')


def cmd_content(cache):
    rows = []
    for p in sorted(ART.glob('*.html')):
        t = p.read_text(encoding='utf-8')
        body = re.sub(r'<(script|style)[\s\S]*?</\1>', '', t)
        txt = text_of(body)[:14000]
        ck = hashlib.sha1((PROMPT_VERSION + MODEL + 'content' + txt).encode()).hexdigest()
        if ck not in cache:
            try:
                cache[ck] = gemini_json(CONTENT_PROMPT + 'TEXT:\n' + txt)
            except Exception as e:
                cache[ck] = {'error': str(e)[:150]}
        rows.append(dict(article=p.stem, result=cache[ck]))
        print('  %-52s %s' % (p.stem[:52], json.dumps(cache[ck], ensure_ascii=False)[:230]))
    save_json(OUT / 'content_latest.json', dict(generated=datetime.now(timezone.utc).isoformat(timespec='seconds'), rows=rows))
    L = ['# Content value report', '', '| Article | Decision | Problem | Actionable | Value | Honest | Filler | Top issues |', '|---|---|---|---|---|---|---|---|']
    for r in rows:
        c = r['result']
        L.append('| %s | %s | %s | %s | %s | %s | %s | %s |' % (r['article'], c.get('decision', 'error'), c.get('problem_clear', '-'), c.get('actionable', '-'),
                 c.get('adds_value', '-'), c.get('accurate_honest', '-'), c.get('filler_level', '-'), '; '.join(c.get('top_issues', []) or [c.get('error', '')])[:260].replace('|', '/')))
    (OUT / 'CONTENT_REPORT.md').write_text('\n'.join(L) + '\n', encoding='utf-8')
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('mode', choices=['audit', 'fix', 'check', 'content'])
    ap.add_argument('--max-replace', type=int, default=4)
    ap.add_argument('--only', default='')
    a = ap.parse_args()
    global MODEL
    if GEMINI_KEY and a.mode != 'check' or (GEMINI_KEY and a.mode == 'check'):
        MODEL = resolve_model()
        print('Vision model: %s' % MODEL)
    cache = load_json(CACHE, {})
    rc = 0
    try:
        if a.mode == 'check':
            rc = cmd_check(cache)
            if os.environ.get('VISION_FULL_AUDIT') == '1':
                rows = audit(sorted(ART.glob('*.html')), cache)
                write_report(rows)
        elif a.mode == 'content':
            rc = cmd_content(cache)
            if all('error' in c for c in [json.loads(json.dumps(v)) for v in cache.values() if isinstance(v, dict) and ('decision' in v or 'error' in v)] or [{}]) and cache:
                pass
        else:
            if not GEMINI_KEY:
                print('ERROR: GEMINI_API_KEY missing')
                return 1
            paths = sorted(ART.glob('*.html'))
            if a.only:
                paths = [p for p in paths if p.stem in a.only.split(',')]
            rows = audit(paths, cache)
            changes = run_fix(rows, cache, a.max_replace) if a.mode == 'fix' else None
            write_report(rows, changes)
            print('\n'.join(changes or []))
            summary = {}
            for r in rows:
                summary[r['status']] = summary.get(r['status'], 0) + 1
            print('SUMMARY', summary)
            if rows and all(r['status'] == 'error' for r in rows):
                print('FAIL: every image check errored - the vision model is unavailable')
                rc = 1
    finally:
        save_json(CACHE, cache)
    return rc


if __name__ == '__main__':
    sys.exit(main())
