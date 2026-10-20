#!/usr/bin/env node
/* Text contrast check for the light and dark themes (WCAG AA: 4.5:1, 3:1 for large text).
 Usage: node scripts/check_contrast.js <css file> <directory with page_N.html and pages.json> <light|dark>
 Needs jsdom (npm install jsdom). jsdom applies rules in file order and ignores specificity, so the dark block mirrors every colour
 rule of the light theme at the same specificity and later in the file: a failure here is a real problem, a pass is a strong signal,
 not a guarantee. Elements with background images or gradients are skipped. */
const {JSDOM}=require(process.env.JSDOM_PATH||'jsdom');const fs=require('fs');
const [cssFile,dir,mode]=process.argv.slice(2);
const pages=JSON.parse(fs.readFileSync(dir+'/pages.json','utf8'));
function parse(s){if(!s)return null;s=s.trim();let m=s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)/);if(m)return [+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]];m=s.match(/^#([0-9a-f]{3,8})$/i);if(m){let h=m[1];if(h.length===3)h=h.split('').map(c=>c+c).join('');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16),h.length===8?parseInt(h.slice(6,8),16)/255:1];}return null;}
function lum(c){const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(c[0])+0.7152*f(c[1])+0.0722*f(c[2]);}
function ratio(a,b){const l1=lum(a),l2=lum(b);return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);}
function blend(top,bot){const a=top[3];return [top[0]*a+bot[0]*(1-a),top[1]*a+bot[1]*(1-a),top[2]*a+bot[2]*(1-a),1];}
const css=fs.readFileSync(cssFile,'utf8');const canvas=mode==='dark'?[24,33,38,1]:[255,255,255,1];let total=0;
pages.forEach((p,i)=>{const html=fs.readFileSync(dir+'/'+i+'.html','utf8').replace('</head>','<style>'+css.replace(/<\//g,'<\\/')+'</style></head>');const d=new JSDOM(html,{pretendToBeVisual:true});const w=d.window,doc=w.document;const fails={};let n=0;
doc.querySelectorAll('body *').forEach(el=>{if(['SCRIPT','STYLE','SVG','TITLE','PATH','NOSCRIPT'].includes(el.tagName.toUpperCase())||el.closest('svg')||el.closest('[hidden]'))return;let own='';el.childNodes.forEach(c=>{if(c.nodeType===3)own+=c.textContent;});own=own.trim();if(!own)return;
 let col=null;for(let a=el;a;a=a.parentElement){const raw=w.getComputedStyle(a).color;const v=parse(raw);if(v&&raw){col=v;break;}}
 const chain=[];let skip=false;for(let a=el;a;a=a.parentElement){const cs=w.getComputedStyle(a);const bi=cs.backgroundImage;if(bi&&bi!=='none'&&/url|gradient/.test(bi)){skip=true;}const b=parse(cs.backgroundColor);if(b&&b[3]>0){chain.push(b);if(b[3]>=1)break;}}
 if(skip||!col)return;let bg=canvas;for(let k=chain.length-1;k>=0;k--){bg=blend(chain[k],bg);}if(col[3]<1)col=blend(col,bg);
 const r=ratio(col,bg);const cs=w.getComputedStyle(el);const size=parseFloat(cs.fontSize)||16;const bold=(parseInt(cs.fontWeight)||400)>=700;const large=size>=24||(size>=18.66&&bold);n++;
 if(r<(large?3:4.5)){const key=el.tagName.toLowerCase()+'.'+(el.className||'')+' '+col.slice(0,3).map(Math.round)+' on '+bg.slice(0,3).map(Math.round);if(!fails[key])fails[key]={r:Math.round(r*100)/100,txt:own.slice(0,40),count:0};fails[key].count++;}});
 total+=Object.keys(fails).length;console.log((pages[i]||'home'),'checked',n,'failures',Object.keys(fails).length);Object.entries(fails).slice(0,12).forEach(([k,f])=>console.log('   ',k,'|',f.r,'|',JSON.stringify(f.txt),'x'+f.count));});
process.exit(total?1:0);
