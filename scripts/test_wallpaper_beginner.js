// Tests for website/wallpaper-beginner.js and the Wallpaper tab structure (Issue #402). Run: node scripts/test_wallpaper_beginner.js
"use strict";
const assert = require("node:assert/strict");
const fs = require("fs"), path = require("path");
const B = require("../website/wallpaper-beginner.js");
let n = 0; function ok(name, fn) { fn(); n++; console.log("PASS " + name); }
const room = (w, h) => ({ label: "R", wallHeight: h, trimAllowance: 0, walls: w.map((x, i) => ({ label: "Wall " + (i + 1), width: x })) });
ok("area from entered walls, in each unit", () => {
  const m = B.area([room([8, 4, 8, 4], 2.4)], "m"); assert.equal(m.ok, true); assert.ok(Math.abs(m.m2 - 57.6) < 1e-9 && m.rooms === 1 && m.source === "walls");
  const ft = B.area([room([12, 10, 12, 10], 8)], "ft"); assert.ok(Math.abs(ft.m2 - 352 * 0.09290304) < 1e-9 && Math.abs(ft.ft2 - 352) < 1e-9);
  assert.ok(Math.abs(B.area([room([100], 100)], "cm").m2 - 1) < 1e-12); assert.ok(Math.abs(B.area([room([39.3700787], 39.3700787)], "in").m2 - 1) < 1e-6);
});
ok("several rooms add up; rooms without a usable width or height are not counted silently", () => {
  const r = B.area([room([5, 4], 2.5), room([3], 2.5), room([], 2.5)], "m"); assert.ok(Math.abs(r.m2 - (9 * 2.5 + 3 * 2.5)) < 1e-9 && r.rooms === 2);
  assert.match(B.area([room([5, 4], NaN)], "m").error, /wall height for each room/);
  assert.match(B.area([], "m").error, /Add at least one wall width/); assert.match(B.area([room([5], 2.4)], "yd").error, /unit/);
  assert.equal(B.area([room([-1, 0, NaN], 2.4)], "m").ok, false);
});
ok("the owner's example: 15 x 8 x 4 m with 6 m2 of openings is 178 m2, used only when no walls were entered", () => {
  const shared = { unit: "m", length: 15, width: 8, height: 4, openings: 6 };
  const s = B.area([], "m", shared); assert.equal(s.ok, true); assert.ok(Math.abs(s.m2 - 178) < 1e-9 && s.source === "shared" && s.deductsOpenings === true);
  const entered = B.area([room([8], 3)], "m", shared); assert.equal(entered.source, "walls"); assert.ok(Math.abs(entered.m2 - 24) < 1e-9);
  assert.ok(Math.abs(B.area([], "m", { unit: "ft", length: 12, width: 10, height: 8, openings: 0 }).m2 - 352 * 0.09290304) < 1e-9);
  assert.match(B.area([], "m", { unit: "m", length: 5, width: 4, height: 2.4, openings: 80 }).error, /smaller than the total wall area/);
  assert.equal(B.area([], "m", { unit: "m", length: 5, width: 4, height: null, openings: 0 }).ok, false);
});
ok("the text states the area and the limits, and contains no roll count, package, price or hidden waste", () => {
  const L = B.lines(B.area([room([8, 4, 8, 4], 2.4)], "m")), all = [L.headline].concat(L.notes).join(" ");
  assert.ok(L.headline.startsWith("Wall area to cover: 57.6 m² (620 ft²) from 1 room"), L.headline);
  assert.ok(all.includes("before any pattern waste or trim") && all.includes("roll size and the pattern") && all.includes("not available yet") && all.includes("not deducted"));
  assert.ok(!/\d+\s*(rolls?|packages?|strips?|×)|waste of|\d+\s*%|[$€£]\s*\d|\bUSD\b/.test(all.replace("number of rolls depends", "")), all);
  assert.ok(B.lines(B.area([], "m", { unit: "m", length: 15, width: 8, height: 4, openings: 6 })).headline.includes("from your room entered once"));
  assert.ok(B.lines(B.area([], "m", { unit: "m", length: 15, width: 8, height: 4, openings: 0 })).notes[0].includes("No doors or windows are deducted"));
});
ok("source: no storage, network or eval; no price or currency in it", () => {
  const src = fs.readFileSync(path.join(__dirname, "..", "website", "wallpaper-beginner.js"), "utf8");
  for (const bad of ["localStorage", "sessionStorage", "indexedDB", "fetch(", "XMLHttpRequest", "eval(", "document.cookie", "sendBeacon", "WebSocket", "USD", "EUR"]) assert.ok(!src.includes(bad), bad);
});
const html = fs.readFileSync(path.join(__dirname, "..", "website", "home-project-calculator.html"), "utf8");
const panel = html.slice(html.indexOf('id="panel-wallpaper"'), html.indexOf("</section>", html.indexOf('id="panel-wallpaper"')));
ok("the Wallpaper tab: unit and rooms first, the product label, pattern and price under Advanced settings", () => {
  const adv = panel.indexOf('id="wp-advanced"'); assert.ok(adv > 0);
  assert.ok(panel.includes('<details id="wp-advanced" open>'), "open by default: the protected visual QA script drives these fields directly");
  assert.ok(panel.indexOf('id="wp-unit"') < panel.indexOf('id="wp-rooms"') && panel.indexOf('id="wp-rooms"') < adv);
  for (const id of ["wp-saleunit", "wp-rollwidth", "wp-length", "wp-match", "wp-price", "wp-currency", "wp-compare", "wp2-saleunit"]) assert.ok(panel.indexOf('id="' + id + '"') > adv, id);
  assert.ok(panel.indexOf('id="wp-unit"') < adv && panel.indexOf('class="calc-btn" type="submit">Calculate wallpaper') > panel.indexOf("</details>"));
});
ok("no USD default: the currency fields start empty and come from the chosen country", () => {
  assert.ok(!/id="wp-currency"[^>]*value=/.test(panel) && !/id="wp2-currency"[^>]*value=/.test(panel));
  assert.ok(html.includes("wpRegionCurrency()") && html.includes("(byId(p+'-currency').value.trim()||wpRegionCurrency()).toUpperCase()"));
  assert.ok(/US:'USD',Canada:'CAD',UK:'GBP',Germany:'EUR',France:'EUR',Spain:'EUR',Italy:'EUR',Netherlands:'EUR'/.test(html));
});
ok("the beginner path runs only when the label, pattern and price fields are not used, before the exact calculation", () => {
  assert.ok(html.includes("['wp-saleunit','wp-rollwidth','wp-length'].some(") && html.indexOf("wpBeginner();return;") < html.indexOf("WP.estimateWallpaperProject(input)"));
  assert.ok(html.indexOf("wallpaper-beginner.js") < html.lastIndexOf("<script>") && html.includes("window.HPWWallpaperBeginner"));
});
ok("the shared room remembers the room for this path", () => {
  assert.ok(fs.readFileSync(path.join(__dirname, "..", "website", "shared-room.js"), "utf8").includes("win.hpwRoom = r.room"));
});
console.log("\n" + n + " wallpaper-beginner tests passed");
