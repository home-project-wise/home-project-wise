#!/usr/bin/env python3
# fix_site_v3.py - second cleanup pass (no backslashes, no double quotes).
# Run from repo root: python tools/fix_site_v3.py   (needs beautifulsoup4)
# Does NOT touch index.html, guides.html, sitemap.xml or feed.xml.
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent if Path(__file__).parent.name == 'tools' else Path.cwd()
ARTICLES = ROOT / 'website' / 'articles'
ART_RE = re.compile('/articles/([^/]+)[.]html')
SEP = ' ' + chr(8212) + ' '

# Duplicated or off-topic sections (heading starts with ...). Whole section is removed.
REMOVE_SECTIONS = {
    'calm-room': [
        'Reduce visual decisions one zone at a time',
        'Give worn clothes one honest home',
        'Use a ten-minute evening reset',
        'Make the wardrobe easier to use before adding storage',
    ],
    'fix-wobbly-furniture': [
        'Check the base before changing the furniture',
        'Use a repeatable test instead of pushing harder',
        'Choose the smallest correction that will stay in place',
        'Know when the joint needs repair rather than adjustment',
        'Retest after every change',
        'Check the frame after the wobble is gone',
        'Match the repair to the furniture',
    ],
    'stop-a-drafty-door-without-replacing-it': [
        'Check the door alignment before replacing the seal',
        'Test the threshold and bottom edge separately',
    ],
}

# Generic filler paragraphs (paragraph starts with ...). Removed in any article.
FILLER_PARAGRAPHS = [
    'Another useful check is to leave the room alone',
    'Keep a simple before-and-after note',
    'That mindset keeps the project practical',
    'Keep the rule visible',
    'There is also a social test',
]

# Images to remove (photo id inside src) because they do not match the article.
REMOVE_IMAGES = {
    'fix-wobbly-furniture': ['1600607688969'],
}

report = []


def note(msg):
    report.append(msg)
    print(msg)


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


def remove_section(soup, heading_start):
    for h in soup.find_all('h2'):
        if h.get_text(' ', strip=True).lower().startswith(heading_start.lower()):
            sib = h.find_next_sibling()
            h.decompose()
            while sib is not None:
                nxt = sib.find_next_sibling()
                if sib.name == 'h2':
                    break
                if sib.name in ('p', 'ul', 'ol', 'h3', 'figure', 'img'):
                    sib.decompose()
                else:
                    break
                sib = nxt
            return True
    return False


def clean_alts(soup):
    heads = set()
    for h in soup.find_all('h2'):
        t = re.sub('^[0-9]+[.][ ]*', '', h.get_text(' ', strip=True)).lower()
        heads.add(t)
    count = 0
    for img in soup.find_all('img'):
        alt = img.get('alt', '')
        if SEP in alt:
            base, _, tail = alt.rpartition(SEP)
            if tail.strip().lower() in heads:
                img['alt'] = base.strip()
                count += 1
    return count


def fix(path, existing):
    slug = path.stem
    original = path.read_text(encoding='utf-8')
    soup = BeautifulSoup(original, 'html.parser')

    n = clean_alts(soup)
    if n:
        note('  %s: cleaned %d image alt text(s)' % (slug, n))

    for a in soup.find_all('a', href=True):
        m = ART_RE.search(a['href'])
        if m and m.group(1) not in existing:
            a.unwrap()

    for heading in REMOVE_SECTIONS.get(slug, []):
        if remove_section(soup, heading):
            note('  %s: removed section %s' % (slug, heading[:45]))
        else:
            note('  %s: section not found (already clean?) %s' % (slug, heading[:45]))

    for start in FILLER_PARAGRAPHS:
        for p in soup.find_all('p'):
            if p.get_text(' ', strip=True).startswith(start):
                p.decompose()
                note('  %s: removed filler paragraph %s' % (slug, start[:35]))
                break

    for photo_id in REMOVE_IMAGES.get(slug, []):
        for img in soup.find_all('img'):
            if photo_id in img.get('src', ''):
                remove_with_caption(img)
                note('  %s: removed mismatched image %s' % (slug, photo_id))
                break

    out = str(soup)
    if out != original:
        path.write_text(out, encoding='utf-8')


def main():
    if not ARTICLES.exists():
        print('ERROR: %s not found' % ARTICLES)
        sys.exit(2)
    existing = {p.stem for p in ARTICLES.glob('*.html')}
    print('Cleaning %d articles' % len(existing))
    for p in sorted(ARTICLES.glob('*.html')):
        fix(p, existing)

    problems = []
    for p in ARTICLES.glob('*.html'):
        html = p.read_text(encoding='utf-8')
        for slug in REMOVE_SECTIONS.get(p.stem, []):
            if ('>' + slug) in html:
                problems.append('%s still has section %s' % (p.name, slug))
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
