// Tests for website/shared-room.js (Stage 1: enter the room once). Run: node scripts/test_shared_room.js
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const SR = require("../website/shared-room.js");
let n = 0; function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
function makeDoc() {
  const els = {}, events = [];
  const mk = (id) => els[id] || (els[id] = { id, value: "", innerHTML: "", textContent: "", handlers: {}, clicked: 0, attrs: {},
    addEventListener(t, f) { (this.handlers[t] = this.handlers[t] || []).push(f); }, getAttribute(k) { return this.attrs[k] === undefined ? null : this.attrs[k]; },
    dispatchEvent(ev) { events.push([this.id, ev.type]); }, click() { this.clicked++; } });
  return { els, events, getElementById: mk };
}
class Ev { constructor(type, o) { this.type = type; this.o = o; } }
function setup(vals) {
  const d = makeDoc(); d.getElementById("room-root"); const c = SR.init(d, { Event: Ev });
  const e = new Proxy(d.els, { get: (t, k) => d.getElementById(k) });
  Object.entries(Object.assign({ "room-unit": "m", "room-length": "", "room-width": "", "room-height": "", "room-openings": "" }, vals)).forEach(([k, v]) => { e[k].value = v; });
  return { d, c, e };
}
const click = (x, target) => x.e["room-form"].handlers.click.forEach((f) => f({ target: { getAttribute: (k) => (k === "data-target" ? target : null) } }));
ok("readRoom validates length and width, optional height and openings, and assumes nothing", () => {
  assert.equal(SR.readRoom({ unit: "m", length: "", width: "4" }).ok, false);
  assert.equal(SR.readRoom({ unit: "m", length: "5", width: "0" }).ok, false);
  assert.equal(SR.readRoom({ unit: "m", length: "5", width: "4", height: "-1" }).ok, false);
  assert.equal(SR.readRoom({ unit: "m", length: "5", width: "4", openings: "-2" }).ok, false);
  const r = SR.readRoom({ unit: "ft", length: "12", width: "10", height: "", openings: "" });
  assert.deepEqual(r.room, { unit: "ft", length: 12, width: 10, height: null, openings: 0 });
});
ok("Use for Flooring sends unit, length and width, fires the unit change, and moves to the Flooring tab", () => {
  const x = setup({ "room-unit": "ft", "room-length": "12", "room-width": "10" }); click(x, "flooring");
  assert.deepEqual([x.e["material-unit"].value, x.e["material-length"].value, x.e["material-width"].value], ["ft", "12", "10"]);
  assert.ok(x.d.events.some((v) => v[0] === "material-unit" && v[1] === "change"));
  assert.equal(x.e["tab-material"].clicked, 1); assert.equal(x.e["room-error"].textContent, ""); assert.ok(x.e["room-note"].textContent.startsWith("Sent to Flooring"));
  assert.equal(x.e["paint-height"].value, "");
});
ok("Use for Paint needs the wall height, sends openings only when given, and moves to the Paint tab", () => {
  const x = setup({ "room-length": "5", "room-width": "4" }); click(x, "paint");
  assert.match(x.e["room-error"].textContent, /needs the wall height/); assert.equal(x.e["paint-length"].value, ""); assert.equal(x.e["tab-paint"].clicked, 0);
  x.e["room-height"].value = "2.4"; click(x, "paint");
  assert.deepEqual([x.e["paint-unit"].value, x.e["paint-length"].value, x.e["paint-width"].value, x.e["paint-height"].value, x.e["paint-openings"].value], ["m", "5", "4", "2.4", ""]);
  x.e["room-openings"].value = "3.5"; click(x, "paint"); assert.equal(x.e["paint-openings"].value, "3.5"); assert.equal(x.e["tab-paint"].clicked, 2);
});
ok("bad input shows an error and sends nothing", () => {
  const x = setup({ "room-length": "5", "room-width": "" }); click(x, "flooring");
  assert.match(x.e["room-error"].textContent, /length and width/); assert.equal(x.e["material-length"].value, ""); assert.equal(x.e["tab-material"].clicked, 0);
});
ok("source: no storage, no network, no eval", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "shared-room.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "fetch(", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket"]) assert.ok(!src.includes(bad), bad);
});
ok("the page hosts the room above the tabs and loads the script; the tab ids it targets exist", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  assert.ok(html.indexOf('id="room-root"') < html.indexOf('class="calc-tabs"') && html.includes('<script src="shared-room.js"></script>'));
  for (const id of ["tab-material", "tab-paint", "material-unit", "material-length", "material-width", "paint-unit", "paint-length", "paint-width", "paint-height", "paint-openings"]) assert.ok(html.includes('id="' + id + '"'), id);
});
ok("Use for Wallpaper shows the net wall area in both units, assumes nothing, gives no roll count, and opens the Wallpaper tab", () => {
  const x = setup({ "room-unit": "ft", "room-length": "12", "room-width": "10", "room-height": "8", "room-openings": "20" }); click(x, "wallpaper");
  const t = x.e["wallpaper-room-area"].textContent, net = 2 * (12 + 10) * 8 - 20;
  assert.ok(t.startsWith("Wall area from your room: 332 ft² (" + Number(net * 0.09290304).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " m²)"), t);
  assert.ok(t.includes("before any pattern waste") && t.includes("number of rolls depends on the roll size and pattern") && !/\brolls?:?\s*\d/.test(t.replace("number of rolls depends", "")));
  assert.equal(x.e["wallpaper-room-area"].hidden, false); assert.equal(x.e["tab-wallpaper"].clicked, 1); assert.equal(x.e["room-error"].textContent, "");
  assert.equal(x.e["wp-width"].value, ""); assert.equal(x.e["paint-length"].value, ""); assert.equal(x.e["material-length"].value, "");
  const y = setup({ "room-unit": "m", "room-length": "5", "room-width": "4", "room-height": "2.4" }); click(y, "wallpaper");
  assert.ok(y.e["wallpaper-room-area"].textContent.startsWith("Wall area from your room: 43.2 m² (" + Number(43.2 / 0.09290304).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " ft²)"));
});
ok("Wallpaper needs the height and openings smaller than the walls; otherwise an error and nothing shown", () => {
  const a = setup({ "room-length": "5", "room-width": "4" }); click(a, "wallpaper");
  assert.match(a.e["room-error"].textContent, /needs the wall height/); assert.notEqual(a.e["wallpaper-room-area"].hidden, false); assert.equal(a.e["tab-wallpaper"].clicked, 0);
  const b = setup({ "room-length": "5", "room-width": "4", "room-height": "2.4", "room-openings": "50" }); click(b, "wallpaper");
  assert.match(b.e["room-error"].textContent, /smaller than the total wall area/); assert.equal(b.e["tab-wallpaper"].clicked, 0);
});
ok("the page has the Wallpaper wall-area note (hidden until used) above the product form, and the button", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
  assert.ok(/id="wallpaper-room-area" hidden/.test(html) && html.indexOf('id="wallpaper-room-area"') < html.indexOf('id="wp-form"') && html.indexOf('id="wallpaper-room-area"') > html.indexOf('id="panel-wallpaper"'));
  assert.ok(html.includes('id="tab-wallpaper"')); assert.ok(fs.readFileSync(path.join(__dirname, "..", "website", "shared-room.js"), "utf8").includes('data-target="wallpaper"'));
});
ok("shared room opens the bulb brightness check with the validated room available to its same-origin opener", () => {
  const d = makeDoc(); d.getElementById("room-root"); let opened = null;
  const w = { Event: Ev, open: (...args) => { opened = args; return {}; } };
  SR.init(d, w);
  const e = new Proxy(d.els, { get: (t, k) => d.getElementById(k) });
  Object.entries({ "room-unit":"m", "room-length":"5", "room-width":"4", "room-height":"", "room-openings":"" }).forEach(([k,v]) => { e[k].value=v; });
  e["room-form"].handlers.click.forEach(f => f({ target: { getAttribute: k => k === "data-target" ? "bulb-brightness" : null } }));
  assert.deepEqual(opened, ["bulb-brightness-check.html", "_blank"]);
  assert.equal(w.hpwRoom.length * w.hpwRoom.width, 20);
  assert.match(e["room-note"].textContent, /new tab/);
});
ok("shared room opens the concrete slab tool with dimensions in memory and does not assume thickness", () => {
  const d = makeDoc(); d.getElementById("room-root"); let opened = null;
  const w = { Event: Ev, open: (...args) => { opened = args; return {}; } };
  SR.init(d, w);
  const e = new Proxy(d.els, { get: (t, k) => d.getElementById(k) });
  Object.entries({ "room-unit":"ft", "room-length":"12", "room-width":"10", "room-height":"", "room-openings":"" }).forEach(([k,v]) => { e[k].value=v; });
  e["room-form"].handlers.click.forEach(f => f({ target: { getAttribute: k => k === "data-target" ? "concrete-slab" : null } }));
  assert.deepEqual(opened, ["concrete-slab-calculator.html", "_blank"]);
  assert.deepEqual(w.hpwRoom, { unit:"ft", length:12, width:10, height:null, openings:0 });
  assert.match(e["room-note"].textContent, /Thickness remains blank/);
});
ok("shared room opens drywall/plaster with room area and requires wall height", () => {
  const d = makeDoc(); d.getElementById("room-root"); let opened = null;
  const w = { Event: Ev, open: (...args) => { opened = args; return {}; } };
  SR.init(d, w);
  const e = new Proxy(d.els, { get: (t, k) => d.getElementById(k) });
  Object.entries({ "room-unit":"ft", "room-length":"12", "room-width":"10", "room-height":"8", "room-openings":"20" }).forEach(([k,v]) => { e[k].value=v; });
  e["room-form"].handlers.click.forEach(f => f({ target: { getAttribute: k => k === "data-target" ? "drywall-plaster" : null } }));
  assert.deepEqual(opened, ["drywall-plaster-calculator.html", "_blank"]);
  assert.deepEqual(w.hpwRoom, { unit:"ft", length:12, width:10, height:8, openings:20 });
  assert.match(e["room-note"].textContent, /deducted once/);
  const y = setup({ "room-length":"5", "room-width":"4", "room-height":"" }); click(y, "drywall-plaster");
  assert.match(y.e["room-error"].textContent, /needs the wall height/);
});
console.log("\n" + n + " shared-room tests passed");
