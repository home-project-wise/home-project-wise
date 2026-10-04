#!/usr/bin/env python3
# fix_site_v4.py - third cleanup pass (no backslashes, no double quotes).
# Run from repo root: python tools/fix_site_v4.py   (needs beautifulsoup4)
# Does NOT touch index.html, guides.html, sitemap.xml or feed.xml.
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent if Path(__file__).parent.name == 'tools' else Path.cwd()
ARTICLES = ROOT / 'website' / 'articles'
ART_RE = re.compile('/articles/([^/]+)[.]html')
SEP = ' ' + chr(8212) + ' '
NUM_RE = re.compile('^[0-9]+[.][ ]*')

# Headings are matched without their leading number, case-insensitive, by prefix.
REMOVE_SECTIONS = {
    'kitchen-counter-zone-that-stays-clear': [
        'Separate work from storage',
        'Know when the zone is finished',
        'Build a landing rule for things that do not belong',
        'Make the clear zone easy for other people to follow',
        'Leave enough spare capacity',
        'Give incoming paper one landing point',
        'Fix the storage location of the repeat offender',
    ],
    'motion-lighting-that-actually-helps': [
        'Tune one variable at a time',
        'Use trustworthy product guidance',
        'Make the installation easy to understand later',
        'Connect motion lighting to the rest of the home routine',
    ],
    'quiet-entryway-storage': [
        'Keep the visual language quiet',
        'Make the storage forgiving on bad days',
        'Use labels only when they solve a real problem',
        'Separate incoming mail from the drop zone',
    ],
    'reduce-bathroom-condensation': [
        'Improve airflow around problem areas',
        'Make the bathroom easier to monitor',
        'Connect condensation control with the rest of the home',
    ],
    'reduce-cable-clutter': [
        'Keep the system easy to change',
        'Leave service space for the cables you change',
        'Make the finished layout easy to troubleshoot',
    ],
    'simple-home-reset-that-prevents-weekend-chaos': [
        'Connect the reset to existing habits',
        'Prevent clutter at the point where it starts',
        'Use a simple decision ladder when you are tired',
        'Make the reset easier to start',
    ],
    'better-evening-home-lighting-without-overcomplicating-it': [
        'Match lighting to the room',
        'Keep screens, pathways and faces comfortable',
        'Make changes in the safest order',
        'Make the final setup easy to live with',
    ],
}

FILLER_PARAGRAPHS = [
    'Another useful check is to leave the room alone',
    'Keep a simple before-and-after note',
    'That mindset keeps the project practical',
    'Keep the rule visible',
    'There is also a social test',
]


def plain(text):
    return NUM_RE.sub('', text.strip()).lower()


def note(msg):
    print(msg)


def remove_section(soup, heading_start):
    target = plain(heading_start)
    for h in soup.find_all('h2'):
        if plain(h.get_text(' ', strip=True)).startswith(target):
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
    heads = [plain(h.get_text(' ', strip=True)) for h in soup.find_all('h2')]
    count = 0
    for img in soup.find_all('img'):
        alt = img.get('alt', '')
        if SEP in alt:
            base, _, tail = alt.rpartition(SEP)
            t = tail.strip().lower()
            if len(t) >= 8 and any(h.startswith(t) for h in heads):
                img['alt'] = base.strip()
                count += 1
    return count


def renumber(soup):
    i = 0
    changed = 0
    for h in soup.find_all('h2'):
        text = h.get_text(' ', strip=True)
        if NUM_RE.match(text) and h.string is not None:
            i += 1
            new = NUM_RE.sub('', str(h.string), count=1)
            new = str(i) + '. ' + new
            if new != str(h.string):
                h.string = new
                changed += 1
    return changed


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

    c = renumber(soup)
    if c:
        note('  %s: renumbered %d heading(s)' % (slug, c))

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
    for p in sorted(ARTICLES.glob('*.html')):
        html = p.read_text(encoding='utf-8')
        for m in ART_RE.finditer(html):
            if m.group(1) not in existing:
                problems.append('%s links to missing article %s' % (p.name, m.group(1)))
        if html.count('sibforms.com') > 1:
            problems.append(p.name + ' has duplicate CTA')
    if problems:
        print()
        print('PROBLEMS:')
        for x in sorted(set(problems)):
            print('  - ' + x)
        sys.exit(1)
    print()
    print('ALL CHECKS PASSED')


if __name__ == '__main__':
    main()
