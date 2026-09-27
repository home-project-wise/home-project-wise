import fs from 'node:fs';
import path from 'node:path';

const required=['index.html','guides.html','about.html','robots.txt','sitemap.xml','feed.xml'];
for(const f of required) if(!fs.existsSync('website/'+f)) throw new Error('Missing '+f);
if(!fs.readFileSync('website/feed.xml','utf8').includes('<rss')) throw new Error('Invalid RSS');
if(!fs.readFileSync('website/sitemap.xml','utf8').includes('<urlset')) throw new Error('Invalid sitemap');

const articleDir='website/articles';
const files=fs.readdirSync(articleDir).filter(f=>f.endsWith('.html') && f!=='test.txt');
if(files.length<1) throw new Error('No published articles found');

const globalImages=new Map();
const blocked=['1503387762-592deb58ef4e'];
const failures=[];

for(const file of files){
  const html=fs.readFileSync(path.join(articleDir,file),'utf8');
  const name=file;
  const h1=(html.match(/<h1\b/gi)||[]).length;
  const h2=(html.match(/<h2\b/gi)||[]).length;
  const h3=(html.match(/<h3\b/gi)||[]).length;
  const paragraphs=(html.match(/<p\b/gi)||[]).length;
  const images=[...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
  const alts=[...html.matchAll(/<img\b[^>]*\balt=["']([^"']*)["'][^>]*>/gi)].map(m=>m[1].trim());
  const internal=[...html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)].map(m=>m[1]).filter(h=>h.endsWith('.html') && !h.startsWith('http'));
  const text=html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

  if(!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${name}: missing title`);
  if(!/<meta[^>]+name=["']description["'][^>]+content=["'][^"']{80,}["']/i.test(html)) failures.push(`${name}: weak/missing meta description`);
  if(h1!==1) failures.push(`${name}: expected exactly one H1, found ${h1}`);
  if(h2<5) failures.push(`${name}: incomplete structure (${h2} H2 headings; need at least 5)`);
  if(h3<3) failures.push(`${name}: incomplete FAQ/FAQ-like section (${h3} H3 headings; need at least 3)`);
  if(paragraphs<8 || text.length<1800) failures.push(`${name}: content is too thin for a useful guide`);
  if(images.length<2) failures.push(`${name}: needs at least 2 useful images`);
  if(images.length>7) failures.push(`${name}: too many images (${images.length}; maximum 7)`);
  if(alts.some(a=>!a || /home improvement project/i.test(a))) failures.push(`${name}: generic or missing image alt text`);
  if(new Set(images).size!==images.length) failures.push(`${name}: duplicate image used inside the same article`);
  if(internal.length<1) failures.push(`${name}: missing internal link`);

  for(const src of images){
    const idMatch=src.match(/photo-([0-9]+-[a-z0-9]+)/i);
    const id=idMatch?.[1] ?? src;
    if(blocked.some(b=>id.includes(b))) failures.push(`${name}: blocked generic image ${id}`);
    globalImages.set(id,(globalImages.get(id)||[]).concat(name));
  }
}

for(const [id,owners] of globalImages){
  const unique=[...new Set(owners)];
  if(unique.length>1) failures.push(`duplicate image across articles: ${id} -> ${unique.join(', ')}`);
}

if(failures.length){
  console.error('Editorial quality gate failed.');
  for(const f of failures) console.error(' - '+f);
  process.exit(1);
}
console.log(`Editorial quality gate passed: ${files.length} articles checked, ${globalImages.size} unique article images verified.`);
