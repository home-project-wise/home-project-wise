import fs from 'node:fs';
const required=['index.html','guides.html','about.html','robots.txt','sitemap.xml','feed.xml'];
for(const f of required) if(!fs.existsSync('website/'+f)) throw new Error('Missing '+f);
if(!fs.readFileSync('website/feed.xml','utf8').includes('<rss')) throw new Error('Invalid RSS');
if(!fs.readFileSync('website/sitemap.xml','utf8').includes('<urlset')) throw new Error('Invalid sitemap');
console.log('Editorial quality gate passed.');
