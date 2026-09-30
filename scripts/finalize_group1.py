from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'website/articles'

def once(path, heading, figure, extra):
    s=path.read_text(encoding='utf-8')
    faq='<h2>Frequently Asked Questions</h2>'
    if heading not in s: raise SystemExit(f'missing heading {heading} in {path.name}')
    src=figure.split('src="',1)[1].split('"',1)[0]
    if src not in s: s=s.replace(f'<h2>{heading}</h2>',f'<h2>{heading}</h2>{figure}',1)
    if extra not in s: s=s.replace(faq,extra+faq,1)
    path.write_text(s,encoding='utf-8')

once(ART/'better-evening-home-lighting-without-overcomplicating-it.html','13. Keep screens, pathways and faces comfortable','<figure><img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=82" alt="comfortable evening screens and pathways with practical low lighting" loading="lazy"><figcaption>Check screens and pathways under real evening lighting before adding more brightness. — Unsplash</figcaption></figure>','''<h2>15. Make the final setup easy to live with</h2><p>A lighting plan is finished when it quietly supports the evening instead of asking for attention. Keep the number of controls small, leave a manual fallback, and make the useful lights easy to reach. If one person prefers a brighter reading area, solve that locally instead of brightening the whole room. If a hallway needs light after dark, use a small source rather than turning on every ceiling fixture.</p><p>Give the setup a week before making another purchase. Notice whether people naturally use the lights in the way you expected. If they do not, treat that as useful information. The best improvement may be moving a switch, changing an angle, or removing an unnecessary source. Good lighting is not a collection of products; it is a room that works comfortably for ordinary activities.</p>''')

once(ART/'kitchen-counter-zone-that-stays-clear.html','13. Make the clear zone easy for other people to follow','<figure><img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=82" alt="clear kitchen counter with simple shared storage rules" loading="lazy"><figcaption>A shared counter system should remain clear when another person uses it. — Unsplash</figcaption></figure>','''<h2>16. Leave enough spare capacity</h2><p>A useful counter zone needs a little empty capacity. If every inch is assigned to an appliance, container, tray, or decorative object, one normal grocery delivery can break the system. Keep the center working area open and allow a small amount of temporary space for items that are genuinely in use. This makes the routine more forgiving and reduces the temptation to create another pile elsewhere.</p><p>After a normal week, remove only what still causes friction. If an item is rarely used, store it away. If a daily item is awkward to return, move its home closer. If the clear zone works during the busiest meal and can be reset in a few minutes, stop. The goal is a reliable preparation surface, not an endlessly optimized kitchen.</p>''')
print('Group 1 finalization v2 complete.')
