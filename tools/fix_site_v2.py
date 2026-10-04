#!/usr/bin/env python3
"""
fix_site_v2.py (v2.1, no backslashes) - repair for HomeProjectWise static site.
Run from repo root: python tools/fix_site_v2.py   (needs beautifulsoup4)
"""
import datetime
import re
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent if Path(__file__).parent.name == 'tools' else Path.cwd()
SITE = ROOT / 'website'
ARTICLES = SITE / 'articles'
BASE = 'https://home-project-wise.github.io/home-project-wise'
NL = chr(10)

RETIRED = [
    'entryway-drop-zone',
    'five-minute-home-reset-that-prevents-clutter',
    'make-bedroom-more-restful',
    'stop-kitchen-counter-clutter',
]
REMOVE_AFFILIATE_NOTE = True
MAX_IMAGES = 4
SITEMAP_EXCLUDE = re.compile('smoke|test|draft|template', re.I)
ART_RE = re.compile('/articles/([^/]+)[.]html')

KEEP_IMAGES = {
    'stop-musty-bathroom-towels': ['1685813223206', '1471880504582', '1581869393747', '1742932759518'],
}
DUPLICATE_SECTIONS = {
    'stop-musty-bathroom-towels': [
        'Give towels enough air to dry between uses',
        'Separate towel drying from towel storage',
        'Check what happens between showers',
        'Build a small towel routine that is easy to repeat',
    ],
    'smart-lighting': ['11. Use a simple decision checklist'],
}
FILLER_PARAGRAPHS = {
    'smart-lighting': [
        'There is also a social test',
        'Keep a simple before-and-after note',
        'That mindset keeps the project practical',
        'Keep the rule visible',
    ],
}


def note(msg):
    print(msg)


def read(p):
    return p.read_text(encoding='utf-8')


def write(p, s):
    p.write_text(s, encoding='utf-8')


def soup_of(html):
    return BeautifulSoup(html, 'html.parser')


def remove_with_caption(img):
    fig = img.find_parent('figure')
    if fig:
        fig.decompose()
        return
    nxt = img.find_next_sibling()
    img.decompose()
    if nxt is not None and nxt.name in ('figcaption', 'em', 'small', 'p'):
        txt = nxt.get_text(' ', strip=True)
        cls = ' '.join(nxt.get('class', []))
        only_em = nxt.name == 'p' and nxt.find('em') is not None and nxt.find('em').get_text(strip=True) == txt
        if nxt.name in ('figcaption', 'em', 'small') or 'caption' in cls or only_em:
            nxt.decompose()


def remove_section_soft(soup, heading_start):
    for h in soup.find_all('h2'):
        if h.get_text(' ', strip=True).lower().startswith(heading_start.lower()):
            sib = h.find_next_sibling()
            h.decompose()
            while sib is not None:
                nxt = sib.find_next_sibling()
                if sib.name == 'h2':
                    break
                if sib.name == 'p' and ('For practical next steps' in sib.get_text() or 'For a calmer room' in sib.get_text()):
                    break
                if sib.name in ('p', 'ul', 'ol', 'h3', 'figure', 'img'):
                    sib.decompose()
                else:
                    break
                sib = nxt
            return True
    return False


def clean_alt_and_captions(html):
    def fix_alt(m):
        alt = m.group(2)
        alt = re.sub(r'[ ]+—[ ]+[^"]*?;[ ]*section:[^"]*$', '', alt)
        alt = re.sub(r';[ ]*section:[^"]*$', '', alt)
        return m.group(1) + alt.strip() + '"'
    html = re.sub(r'(alt=")([^"]*)"', fix_alt, html)
    html = re.sub(r'[ ]*This section focuses on [^.<]*[.]', '', html)
    html = re.sub(r'[ ]*Section context:[^<]*', '', html)
    return html


def fix_article(path, existing_slugs):
    slug = path.stem
    original = read(path)
    soup = soup_of(clean_alt_and_captions(original))

    for a in soup.find_all('a', href=True):
        m = ART_RE.search(a['href'])
        if m and (m.group(1) in RETIRED or m.group(1) not in existing_slugs):
            a.unwrap()

    links = [a for a in soup.find_all('a', href=True) if 'sibforms.com' in a['href']]
    for a in links[1:]:
        block = a
        while block.parent is not None and block.parent.name not in ('body', 'main', 'article', 'html', '[document]'):
            sibs = [x for x in block.parent.find_all('a', href=True) if 'sibforms.com' in x['href']]
            if len(sibs) == 1 and block.parent.find(['h1']) is None:
                block = block.parent
            else:
                break
        block.decompose()
    if len(links) > 1:
        note('  %s: removed %d duplicate CTA block(s)' % (slug, len(links) - 1))

    if REMOVE_AFFILIATE_NOTE and not any('awin' in a['href'] for a in soup.find_all('a', href=True)):
        for p in soup.find_all(['p', 'div']):
            t = p.get_text(strip=True)
            if t.startswith('Affiliate disclosure:') and len(t) < 160:
                p.decompose()
                note('  %s: removed empty affiliate disclosure' % slug)
                break

    for heading in DUPLICATE_SECTIONS.get(slug, []):
        if remove_section_soft(soup, heading):
            note('  %s: removed section %s' % (slug, heading[:40]))
        else:
            note('  %s: section %s not found (already clean?)' % (slug, heading[:40]))
    for start in FILLER_PARAGRAPHS.get(slug, []):
        for p in soup.find_all('p'):
            if p.get_text(' ', strip=True).startswith(start):
                p.decompose()
                note('  %s: removed filler paragraph %s' % (slug, start[:30]))
                break

    body = soup.find('main') or soup.find('article') or soup.body or soup
    imgs = [i for i in body.find_all('img') if 'logo' not in i.get('src', '')]
    if len(imgs) > MAX_IMAGES:
        keep_ids = KEEP_IMAGES.get(slug)
        if keep_ids:
            keep = [i for i in imgs if any(k in i.get('src', '') for k in keep_ids)][:MAX_IMAGES]
        else:
            keep = imgs[:MAX_IMAGES]
        for img in imgs:
            if img not in keep:
                remove_with_caption(img)
        note('  %s: images %d -> %d' % (slug, len(imgs), len(keep)))

    out = str(soup)
    if out != original:
        write(path, out)


def fix_index_pages(existing_slugs):
    n = len(existing_slugs)
    for name in ('index.html', 'guides.html'):
        p = SITE / name
        if not p.exists():
            note('  %s: missing' % name)
            continue
        soup = soup_of(read(p))
        removed = 0
        for a in soup.find_all('a', href=True):
            m = ART_RE.search(a['href'])
            if m and m.group(1) not in existing_slugs:
                card = a
                while card.parent is not None and card.parent.name not in ('body', 'main', 'section', 'html', '[document]'):
                    inside = set()
                    for x in card.parent.find_all('a', href=True):
                        mm = ART_RE.search(x['href'])
                        if mm:
                            inside.add(mm.group(1))
                    if len(inside) == 1:
                        card = card.parent
                    else:
                        break
                if card.parent is not None:
                    card.decompose()
                    removed += 1
        html = str(soup)
        html = re.sub('[0-9]+ guides', '%d guides' % n, html)
        write(p, html)
        note('  %s: removed %d retired card(s), count set to %d' % (name, removed, n))


def git_date(path):
    try:
        out = subprocess.run(['git', 'log', '-1', '--format=%cs', '--', str(path)],
                             capture_output=True, text=True, cwd=str(ROOT)).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    return datetime.date.today().isoformat()


def build_sitemap():
    urls = [('', SITE / 'index.html')]
    for name in ('guides', 'about', 'editorial-policy', 'privacy', 'terms', 'contact'):
        if (SITE / (name + '.html')).exists():
            urls.append((name + '.html', SITE / (name + '.html')))
    for p in sorted(ARTICLES.glob('*.html')):
        if not SITEMAP_EXCLUDE.search(p.stem):
            urls.append(('articles/' + p.name, p))
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for rel, p in urls:
        pri = '1.0' if rel == '' else ('0.8' if rel.startswith('articles/') else '0.5')
        lines.append('  <url><loc>%s/%s</loc><lastmod>%s</lastmod><priority>%s</priority></url>' % (BASE, rel, git_date(p), pri))
    lines.append('</urlset>')
    write(SITE / 'sitemap.xml', NL.join(lines) + NL)
    note('  sitemap.xml rebuilt: %d URLs' % len(urls))


def main():
    if not ARTICLES.exists():
        print('ERROR: %s not found. Run from the repo root.' % ARTICLES)
        sys.exit(2)

    note('[1] Retired articles')
    for slug in RETIRED:
        p = ARTICLES / (slug + '.html')
        if p.exists():
            p.unlink()
            note('  deleted ' + p.name)

    existing = {p.stem for p in ARTICLES.glob('*.html') if not SITEMAP_EXCLUDE.search(p.stem)}
    note('[2] Fixing %d articles' % len(existing))
    for p in sorted(ARTICLES.glob('*.html')):
        if p.stem in existing:
            fix_article(p, existing)

    note('[3] Index pages')
    fix_index_pages(existing)

    note('[4] Sitemap')
    build_sitemap()

    note('[5] Verification')
    problems = []
    sm = read(SITE / 'sitemap.xml')
    if re.search('smoke', sm, re.I):
        problems.append('sitemap still contains smoke tests')
    if 'stop-musty-bathroom-towels' not in sm:
        problems.append('sitemap missing stop-musty-bathroom-towels')
    for slug in RETIRED:
        for p in SITE.rglob('*.html'):
            if '/' + slug + '.html' in read(p):
                problems.append('%s still links to %s' % (p.relative_to(SITE), slug))
    for p in ARTICLES.glob('*.html'):
        h = read(p)
        if re.search('alt="[^"]*section:', h) or 'Section context:' in h:
            problems.append(p.name + ' still has stuffed alt/caption')
        if h.count('sibforms.com') > 1:
            problems.append(p.name + ' has duplicate CTA')
    if problems:
        print()
        print('PROBLEMS:')
        for x in problems:
            print('  - ' + x)
        sys.exit(1)
    print()
    print('ALL CHECKS PASSED')


if __name__ == '__main__':
    main()
