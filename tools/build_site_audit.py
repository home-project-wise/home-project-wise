#!/usr/bin/env python3
# build_site_audit.py - writes website/site-audit.html (private review page, noindex).
# Run from repo root: python tools/build_site_audit.py   (needs beautifulsoup4)
# Read-only for articles: it never modifies any article, index, guides, sitemap or feed.
import re
from html import escape
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent if Path(__file__).parent.name == 'tools' else Path.cwd()
SITE = ROOT / 'website'
ARTICLES = SITE / 'articles'
ART_RE = re.compile('/articles/([^/]+)[.]html')
PHOTO_RE = re.compile('photo-[0-9]+')
SEP = ' ' + chr(8212) + ' '


def meta(soup, key, value):
    for m in soup.find_all('meta'):
        if m.get(key) == value and m.get('content'):
            return m.get('content')
    return ''


def analyse(path, existing):
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    raw = str(soup)
    body = soup.find('main') or soup.find('article') or soup.body or soup
    words = len(body.get_text(' ', strip=True).split())
    title = soup.title.get_text(strip=True) if soup.title else ''
    desc = meta(soup, 'name', 'description')
    h1 = len(soup.find_all('h1'))
    h2 = len(soup.find_all('h2'))
    flags = []
    if not title:
        flags.append('no title')
    elif len(title) > 70:
        flags.append('title too long (%d)' % len(title))
    if not desc:
        flags.append('no meta description')
    elif len(desc) < 70 or len(desc) > 165:
        flags.append('description length %d' % len(desc))
    if h1 != 1:
        flags.append('h1 count %d' % h1)
    if not soup.find('link', rel='canonical'):
        flags.append('no canonical')
    for key, val in (('property', 'og:title'), ('property', 'og:description'), ('property', 'og:image'), ('name', 'twitter:card')):
        if not meta(soup, key, val):
            flags.append('no ' + val)
    if chr(34) + '@type' + chr(34) not in raw:
        flags.append('no JSON-LD')
    if not soup.html or not soup.html.get('lang'):
        flags.append('no html lang')
    if words < 900:
        flags.append('thin (%d words)' % words)
    if words > 2200:
        flags.append('very long (%d words)' % words)
    if raw.count('sibforms.com') != 1:
        flags.append('sibforms count %d' % raw.count('sibforms.com'))
    for a in soup.find_all('a', href=True):
        m = ART_RE.search(a['href'])
        if m and m.group(1) not in existing:
            flags.append('broken link to ' + m.group(1))
    images = []
    for img in body.find_all('img'):
        src = img.get('src', '')
        if 'logo' in src:
            continue
        alt = img.get('alt', '')
        h = img.find_previous('h2')
        cap = ''
        fig = img.find_parent('figure')
        if fig and fig.find('figcaption'):
            cap = fig.find('figcaption').get_text(' ', strip=True)
        else:
            nxt = img.find_next_sibling()
            if nxt is not None and nxt.name in ('figcaption', 'em', 'small'):
                cap = nxt.get_text(' ', strip=True)
        pid = PHOTO_RE.search(src)
        images.append({'src': src, 'alt': alt, 'cap': cap, 'pid': pid.group(0) if pid else src[-30:],
                       'section': h.get_text(' ', strip=True) if h else '(intro)'})
        if not alt:
            flags.append('image without alt')
        if SEP in alt or 'section:' in alt.lower():
            flags.append('stuffed alt text')
    if len(images) > 4:
        flags.append('%d images (max 4)' % len(images))
    if len(images) == 0:
        flags.append('no images')
    return {'slug': path.stem, 'title': title, 'words': words, 'h2': h2, 'flags': flags, 'images': images}


def main():
    files = sorted(ARTICLES.glob('*.html'))
    existing = {p.stem for p in files}
    rows = [analyse(p, existing) for p in files]
    usage = {}
    for r in rows:
        for im in r['images']:
            usage.setdefault(im['pid'], set()).add(r['slug'])
    for r in rows:
        for im in r['images']:
            if len(usage[im['pid']]) > 1:
                r['flags'].append('shared image ' + im['pid'][-13:])
    out = []
    out.append('<!doctype html><html lang=en><head><meta charset=utf-8>')
    out.append('<meta name=viewport content=' + chr(34) + 'width=device-width,initial-scale=1' + chr(34) + '>')
    out.append('<meta name=robots content=noindex,nofollow><title>Site audit (private)</title>')
    out.append('<style>body{font-family:system-ui,sans-serif;margin:0;padding:12px;background:#faf8f5;color:#222}')
    out.append('h1{font-size:20px}h2{font-size:17px;margin:22px 0 6px}table{border-collapse:collapse;width:100%;font-size:13px}')
    out.append('td,th{border:1px solid #ddd;padding:5px;vertical-align:top;text-align:left}.bad{color:#b00020}.ok{color:#1b7f3b}')
    out.append('.card{background:#fff;border:1px solid #ddd;border-radius:8px;padding:8px;margin:10px 0}')
    out.append('.card img{width:100%;max-height:260px;object-fit:cover;border-radius:6px}.id{font-weight:700;font-size:15px}')
    out.append('small{color:#555}</style></head><body>')
    out.append('<h1>Site audit - %d articles</h1><p><small>Private page. Not in the sitemap. Delete after use.</small></p>' % len(rows))
    out.append('<h2>1. Summary</h2><table><tr><th>#</th><th>Article</th><th>Words</th><th>H2</th><th>Img</th><th>Problems</th></tr>')
    for i, r in enumerate(rows, 1):
        probs = '<span class=ok>OK</span>' if not r['flags'] else '<span class=bad>' + escape('; '.join(sorted(set(r['flags'])))) + '</span>'
        out.append('<tr><td>%02d</td><td>%s</td><td>%d</td><td>%d</td><td>%d</td><td>%s</td></tr>' % (i, escape(r['slug']), r['words'], r['h2'], len(r['images']), probs))
    out.append('</table>')
    out.append('<h2>2. Images - tell Claude the IDs that do not match (example: 03-2, 07-1)</h2>')
    for i, r in enumerate(rows, 1):
        out.append('<h2>%02d %s</h2>' % (i, escape(r['title'] or r['slug'])))
        for j, im in enumerate(r['images'], 1):
            shared = ' <span class=bad>(also used in: %s)</span>' % escape(', '.join(sorted(usage[im['pid']] - {r['slug']}))) if len(usage[im['pid']]) > 1 else ''
            out.append('<div class=card><div class=id>%02d-%d%s</div><img src=%s loading=lazy alt=%s>' % (i, j, shared, chr(34) + escape(im['src'], quote=True) + chr(34), chr(34) + escape(im['alt'], quote=True) + chr(34)))
            out.append('<small>Section: %s<br>Alt: %s<br>Caption: %s<br>%s</small></div>' % (escape(im['section']), escape(im['alt']), escape(im['cap'] or '-'), escape(im['pid'])))
    out.append('</body></html>')
    (SITE / 'site-audit.html').write_text(chr(10).join(out), encoding='utf-8')
    print('Wrote website/site-audit.html for %d articles' % len(rows))
    for i, r in enumerate(rows, 1):
        print('%02d %s: %d words, %d images, %d problems' % (i, r['slug'], r['words'], len(r['images']), len(set(r['flags']))))


if __name__ == '__main__':
    main()
