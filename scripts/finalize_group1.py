#!/usr/bin/env python3
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'website/articles'
FILES=['better-evening-home-lighting-without-overcomplicating-it.html','kitchen-counter-zone-that-stays-clear.html','quiet-entryway-storage.html','simple-home-reset-that-prevents-weekend-chaos.html']
MARK='<!-- group1-closure-v1 -->'
for name in FILES:
    p=ART/name
    s=p.read_text(encoding='utf-8')
    if MARK not in s:
        raise SystemExit(f'Group 1 closure marker missing: {name}')
    head, tail=s.split(MARK,1)
    middle, faq=tail.split('<h2>Frequently Asked Questions</h2>',1)
    middle=re.sub(r'<figure\b.*?</figure>','',middle,flags=re.I|re.S)
    s=head+MARK+middle+'<h2>Frequently Asked Questions</h2>'+faq
    s=s.replace('https://images.unsplash.com/photo-1556911073-52527ac437f5?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1400&q=82')
    s=s.replace('https://images.unsplash.com/photo-1610557892470-a7f7e0f7d6f6?auto=format&fit=crop&w=1400&q=82','https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=82')
    if name=='kitchen-counter-zone-that-stays-clear.html':
        s=s.replace('alt="Everyday kitchen appliances arranged without blocking the counter work area"','alt="Everyday kitchen items given permanent counter positions"')
        s=s.replace('The clear counter zone during a normal meal, when the kitchen is actually under pressure.','The kitchen counter system is tested during the busiest meal, when the space is under real pressure.')
        s=s.replace('Test the clear counter zone during a normal meal, when the kitchen is actually under pressure.','The kitchen counter system is tested during the busiest meal, when the space is under real pressure.')
    if name=='simple-home-reset-that-prevents-weekend-chaos.html':
        s=re.sub(r'<figure><img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace\?auto=format&fit=crop&w=1400&q=82" alt="Simple laundry basket and folded clothing during a home reset" loading="lazy"><figcaption>.*?</figcaption></figure>','',s,flags=re.I|re.S)
        s=re.sub(r'<figure><img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7\?auto=format&fit=crop&w=1400&q=82" alt="Clear living room surface after a short clutter reset" loading="lazy"><figcaption>.*?</figcaption></figure>','',s,flags=re.I|re.S)
        head, tail=s.split(MARK,1)
        middle, faq=tail.split('<h2>Frequently Asked Questions</h2>',1)
        middle=re.sub(r'<figure\b.*?</figure>','',middle,flags=re.I|re.S)
        # Add one new, context-specific visual under the final closure section.
        figure='<figure><img src="https://images.unsplash.com/photo-1600566753051-3d2f0b6b2c8f?auto=format&fit=crop&w=1400&q=82" alt="Simple home reset in a practical everyday living space" loading="lazy"><figcaption>A simple home reset should leave an everyday living space easy to use again.</figcaption></figure>'
        middle=middle.replace('</p><p><strong>The goal is not a spotless house every night.</strong>', '</p>'+figure+'<p><strong>The goal is not a spotless house every night.</strong>',1)
        s=head+MARK+middle+'<h2>Frequently Asked Questions</h2>'+faq
    s=s.replace('"@type":"BlogPosting"','"@type": "BlogPosting"')
    s=s.replace('"@type":"FAQPage"','"@type": "FAQPage"')
    s=s.replace('"@type":"BreadcrumbList"','"@type": "BreadcrumbList"')
    p.write_text(s,encoding='utf-8')
print('Group 1 finalization complete.')
