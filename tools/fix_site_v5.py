#!/usr/bin/env python3
# fix_site_v5.py - fourth cleanup pass (no backslashes, no double quotes).
# Run from repo root: python tools/fix_site_v5.py   (needs beautifulsoup4)
# Removes wrong or shared images and shortens over-long page titles.
# Does NOT touch index.html, guides.html, sitemap.xml or feed.xml.
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent if Path(__file__).parent.name == 'tools' else Path.cwd()
ARTICLES = ROOT / 'website' / 'articles'

# Photo ids (inside the img src) to remove together with their caption.
REMOVE_IMAGES = {
    'reduce-bathroom-condensation': ['1600573472592'],
    'simple-home-reset-that-prevents-weekend-chaos': ['1556911220'],
    'stop-musty-bathroom-towels': ['1626690394167'],
}

# New page titles (max 60 characters, brand name is added by Google).
NEW_TITLES = {
    'better-evening-home-lighting-without-overcomplicating-it': 'Better Evening Home Lighting Without Overcomplicating It',
    'calm-room': 'How to Make a Room Feel Calmer Without Buying New Things',
    'fix-wobbly-furniture': 'How to Fix Wobbly Furniture Without Guessing',
    'motion-lighting-that-actually-helps': 'Motion Lighting: Where It Helps and Where It Annoys',
    'reduce-bathroom-condensation': 'How to Reduce Bathroom Condensation Before It Gets Worse',
    'reduce-cable-clutter': 'Reduce Cable Clutter With a System That Stays Serviceable',
    'smart-lighting': 'Smart Lighting Without Turning Your Home Into a Showroom',
}


def note(msg):
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


def fix(path):
    slug = path.stem
    original = path.read_text(encoding='utf-8')
    soup = BeautifulSoup(original, 'html.parser')

    for photo_id in REMOVE_IMAGES.get(slug, []):
        found = False
        for img in soup.find_all('img'):
            if photo_id in img.get('src', ''):
                remove_with_caption(img)
                found = True
                note('  %s: removed image %s' % (slug, photo_id))
                break
        if not found:
            note('  %s: image %s not found (already removed?)' % (slug, photo_id))

    new_title = NEW_TITLES.get(slug)
    if new_title and soup.title is not None:
        if soup.title.get_text(strip=True) != new_title:
            soup.title.string = new_title
            note('  %s: title set (%d chars)' % (slug, len(new_title)))

    out = str(soup)
    if out != original:
        path.write_text(out, encoding='utf-8')


def main():
    if not ARTICLES.exists():
        print('ERROR: %s not found' % ARTICLES)
        sys.exit(2)
    for p in sorted(ARTICLES.glob('*.html')):
        fix(p)

    problems = []
    for slug, ids in REMOVE_IMAGES.items():
        p = ARTICLES / (slug + '.html')
        if p.exists():
            html = p.read_text(encoding='utf-8')
            for photo_id in ids:
                if photo_id in html:
                    problems.append('%s still contains image %s' % (slug, photo_id))
    for slug, title in NEW_TITLES.items():
        p = ARTICLES / (slug + '.html')
        if p.exists() and ('<title>' + title + '</title>') not in p.read_text(encoding='utf-8'):
            problems.append('%s title was not updated' % slug)
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
