import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(), 'website');
const articlesDir = path.join(root, 'articles');
const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.html'));
let errors = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  const h1 = (html.match(/<h1\b/gi) || []).length;
  const faq = /Frequently Asked Questions|FAQ/i.test(html);
  const faqSchema = /"@type"\s*:\s*"FAQPage"/i.test(html);
  const title = (html.match(/<title>(.*?)<\/title>/is) || [])[1] || '';
  const meta = /<meta[^>]+name=["']description["'][^>]+content=/i.test(html);
  const canonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const badAlt = imgs.some(tag => !/\balt=["'][^"']+["']/i.test(tag));
  const wordCount = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;

  if (h1 !== 1) errors.push(`${file}: expected exactly one H1`);
  if (!title || title.length < 25 || title.length > 90) errors.push(`${file}: title length is outside the editorial range`);
  if (!meta) errors.push(`${file}: missing meta description`);
  if (!canonical) errors.push(`${file}: missing canonical`);
  if (badAlt) errors.push(`${file}: image without useful alt text`);
  if (imgs.length > 7) errors.push(`${file}: more than 7 images`);
  if (wordCount < 350) errors.push(`${file}: too little useful text (${wordCount} words)`);
  if (!faq) errors.push(`${file}: missing FAQ section`);
  if (!faqSchema) errors.push(`${file}: missing FAQPage structured data`);
}

const seenImages = new Set();
for (const file of files) {
  const html = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
    if (seenImages.has(m[1])) errors.push(`duplicate article image URL: ${m[1]}`);
    seenImages.add(m[1]);
  }
}

for (const file of files) {
  const html = fs.readFileSync(path.join(articlesDir, file), 'utf8');
  const links = [...html.matchAll(/href=["']([^"'#][^"']*)["']/gi)].map(m => m[1]);
  for (const u of links) {
    if (/^https?:\/\//i.test(u)) continue;
    if (!u.endsWith('.html')) continue;
    const clean = u.split('?')[0].split('#')[0];
    const target = path.resolve(path.dirname(path.join(articlesDir, file)), clean);
    if (!fs.existsSync(target)) errors.push(`${file}: broken internal link: ${u}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Quality gate passed: ${files.length} article(s), ${seenImages.size} unique article image URL(s).`);
