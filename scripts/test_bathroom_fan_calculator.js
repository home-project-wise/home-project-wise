// Tests for website/bathroom-fan-size-calculator.html: the pure sizing rules and the form handler (DOM stub, no browser).
// Run: node scripts/test_bathroom_fan_calculator.js
const path=require('path');

const fs=require('fs'), assert=require('assert');
const html=fs.readFileSync(process.argv[2]||path.join(__dirname,'..','website','bathroom-fan-size-calculator.html'),'utf8');
const js=html.slice(html.lastIndexOf('<script>')+8, html.lastIndexOf('</script>'));
function run(vals,unit){
  const els={}; let handlers={}; let attrs={'data-unit':unit||'us'};
  function el(id,v){return els[id]=els[id]||{value:v===undefined?'':String(v),textContent:'',innerHTML:'',addEventListener(){},};}
  const ids={len:'',wid:'',mode:'on',nt:'1',ns:'1',nb:'0',nj:'0',rating:''}; Object.assign(ids,vals);
  Object.keys(ids).forEach(k=>el(k,ids[k])); el('calc-out'); el('calc-err');
  const form={getAttribute:k=>attrs[k],setAttribute:(k,v)=>{attrs[k]=v;},querySelectorAll:()=>[],addEventListener:(t,f)=>{handlers[t]=f;}};
  global.document={getElementById:id=>id==='calc'?form:els[id]};
  eval(js); handlers.submit({preventDefault(){}});
  return {out:els['calc-out'].innerHTML,err:els['calc-err'].textContent};
}
let r=run({len:8,wid:10}); assert.match(r.out,/Airflow target: <strong>80 CFM/); assert.match(r.out,/about <strong>110 CFM/); assert.equal(r.err,'');
r=run({len:5,wid:8}); assert.match(r.out,/<strong>50 CFM/); assert.match(r.out,/minimum decides here/); assert.match(r.out,/about <strong>70 CFM/);
r=run({len:10,wid:12,nt:1,ns:1,nb:1}); assert.match(r.out,/<strong>150 CFM/); assert.match(r.out,/Over 100 sq ft|over 100 sq ft/);
r=run({len:10,wid:12,nt:0,ns:0,nb:0,nj:0}); assert.match(r.err,/at least one toilet/); assert.equal(r.out,'');
r=run({len:'',wid:10}); assert.match(r.err,/above zero/);
r=run({len:-3,wid:10}); assert.match(r.err,/above zero/);
r=run({len:0,wid:10}); assert.match(r.err,/above zero/);
r=run({len:'abc',wid:10}); assert.match(r.err,/above zero/);
r=run({len:1,wid:1}); assert.match(r.err,/ordinary bathrooms/);
r=run({len:40,wid:40}); assert.match(r.err,/ordinary bathrooms/);
r=run({len:2.4,wid:3},'m'); assert.match(r.out,/<strong>78 CFM/,'metric 7.2 m2 = 77.5 sq ft, rounded up to 78'); 
// review fixes (2026-11-06): result text in the entered unit, tub wording, California table scope
r=run({len:2.4,wid:3},'m'); assert.match(r.out,/for a 7\.2 m\u00b2 \(77\.5 sq ft\) bathroom/,'metric result shows m2 and sq ft'); assert.ok(!/for a 77\.5 sq ft bathroom/.test(r.out));
r=run({len:8,wid:10}); assert.match(r.out,/for a 80 sq ft bathroom/); assert.ok(!/m\u00b2/.test(r.out),'US result has no m2');
r=run({len:10,wid:12,nt:1,ns:1,nb:0,nj:1}); assert.match(r.out,/<strong>200 CFM/,'one jetted tub counted once, in the jetted field only');
r=run({len:10,wid:12,nt:1,ns:1,nb:1,nj:1}); assert.match(r.out,/<strong>250 CFM/,'documents what happens if the same jetted tub is also entered as a standard tub');
assert.ok(html.includes('Standard bathtubs (not jetted)')); assert.match(html,/Each jetted tub counts here only, not also as a standard bathtub/);
r=run({len:8,wid:10,rating:70}); assert.match(r.out,/Table 150\.0-H/); assert.match(r.out,/not a code approval for your home/); assert.match(r.out,/bend radius at least the duct diameter/);
assert.match(r.out,/25 ft \(8 m\) or less with no more than three elbows/); assert.match(html,/limit its use to systems with a total duct length of 25 ft \(8 m\) or less, no more than three elbows/); assert.match(html,/CEC-400-2025-010-F/);
assert.match(html,/Table 150\.0-H of California's Title 24/); assert.match(html,/not a code approval for your home; elsewhere/);
r=run({len:8,wid:10,nt:1.5}); assert.match(r.err,/whole numbers/);
r=run({len:8,wid:10,nt:9}); assert.match(r.err,/whole numbers/);
r=run({len:8,wid:10,rating:70}); assert.match(r.out,/at least 5 in\. rigid duct or 5 in\. flexible/); assert.match(r.out,/below your target of 80/);
r=run({len:8,wid:10,rating:60}); assert.match(r.out,/below your target of 80/);
r=run({len:8,wid:10,rating:90}); assert.match(r.out,/5 in\. rigid duct or 6 in\. flexible/); assert.ok(!/below your target/.test(r.out));
r=run({len:8,wid:10,rating:150}); assert.match(r.out,/outside the table/);
r=run({len:8,wid:10,rating:-5}); assert.match(r.err,/between 1 and 400/);
r=run({len:8,wid:10,rating:500}); assert.match(r.err,/between 1 and 400/);
r=run({len:14,wid:12,nt:1,ns:1,nb:1,nj:1}); assert.match(r.out,/Above 125 CFM/); assert.match(r.out,/<strong>250 CFM/);
r=run({len:8,wid:10,mode:'cont'}); assert.match(r.out,/<strong>80 CFM/);
r=run({len:4,wid:5,mode:'cont'}); assert.match(r.out,/<strong>20 CFM/);
console.log('fan calculator page: all DOM-stub assertions passed');

// --- pure sizing rules, taken from the page itself ---
const PURE=html.slice(html.indexOf('/*PURE*/'),html.indexOf('/*ENDPURE*/'));
const lib=new Function(PURE+'; return {fanTarget:fanTarget,shopRating:shopRating,ductFor:ductFor};')();
{
const fanTarget=lib.fanTarget, shopRating=lib.shopRating, ductFor=lib.ductFor;


function T(a,n,c){return fanTarget(a,Object.assign({toilets:0,showers:0,tubs:0,jetted:0},n||{}),!!c);}
assert.equal(T(40).target,50); assert.equal(T(40).basis,'floor'); assert.equal(shopRating(50),70);
assert.equal(T(80).target,80); assert.equal(shopRating(80),110);
assert.equal(T(120,{toilets:1,showers:1,tubs:1}).target,150);
assert.equal(T(120,{toilets:1,showers:1,jetted:1}).target,200);
assert.equal(T(100).target,100); assert.equal(T(100.0001,{toilets:1}).target,50);
assert.equal(T(79.2).target,80); assert.equal(T(40,{},true).target,40); assert.equal(T(10,{},true).target,20); assert.equal(T(10,{},false).target,50);
assert.equal(T(120).target,50); // no fixtures: only the floor; the page rejects this input
[[50,4,4],[51,5,5],[80,5,5],[81,5,6],[100,5,6],[101,6,6],[125,6,6]].forEach(function(c){var d=ductFor(c[0]);assert.deepEqual([d.rigid,d.flex],[c[1],c[2]],'duct '+c[0]);});
assert.equal(ductFor(126),null);
assert.ok(shopRating(150)>=150);
console.log('fan calculator logic: all assertions passed');
}