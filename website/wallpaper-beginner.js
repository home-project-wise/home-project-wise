/* HomeProjectWise beginner wallpaper wall area (Issue #402, under #362). From the wall widths and heights the visitor entered, or from the room
 * entered once, it gives the wall area to cover. It never asks for roll or pattern details, never counts rolls or packages, never applies a hidden
 * waste percentage, and never contains a price. Cost ranges are added only when approved, structured reference data exists (not yet).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWWallpaperBeginner = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var LIN = { ft: 0.3048, "in": 0.0254, m: 1, cm: 0.01 }, M2_PER_FT2 = 0.09290304;
  function pos(x) { return Number.isFinite(x) && x > 0; }
  function area(rooms, unit, shared) {
    var lin = LIN[unit];
    if (!lin) return { ok: false, error: "Choose a unit of measurement." };
    var total = 0, n = 0, noHeight = false;
    (rooms || []).forEach(function (r) {
      var w = 0;
      ((r && r.walls) || []).forEach(function (x) { if (x && pos(x.width)) w += x.width; });
      if (w > 0 && pos(r.wallHeight)) { total += w * r.wallHeight; n++; } else if (w > 0) { noHeight = true; }
    });
    if (n > 0) {
      var m2 = total * lin * lin;
      return { ok: true, source: "walls", rooms: n, m2: m2, ft2: m2 / M2_PER_FT2, deductsOpenings: false };
    }
    if (shared && pos(shared.length) && pos(shared.width) && pos(shared.height)) {
      var sl = shared.unit === "ft" ? LIN.ft : 1, open = Number.isFinite(shared.openings) && shared.openings > 0 ? shared.openings : 0;
      var net = 2 * (shared.length + shared.width) * shared.height - open;
      if (net > 0) { var m2s = net * sl * sl; return { ok: true, source: "shared", rooms: 1, m2: m2s, ft2: m2s / M2_PER_FT2, deductsOpenings: open > 0 }; }
      return { ok: false, error: "The area of doors and windows must be smaller than the total wall area." };
    }
    if (noHeight) return { ok: false, error: "Enter the wall height for each room." };
    return { ok: false, error: "Add at least one wall width and the wall height, or use “Enter your room once” above." };
  }
  function num(n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 1 }); }
  function lines(res) {
    var from = res.source === "shared" ? "your room entered once" : res.rooms + " room" + (res.rooms === 1 ? "" : "s");
    return {
      headline: "Wall area to cover: " + num(res.m2) + " m² (" + num(res.ft2) + " ft²) from " + from,
      notes: [
        res.source === "shared" ? (res.deductsOpenings ? "The doors and windows area you entered is deducted." : "No doors or windows are deducted.") : "Doors and windows are not deducted from the walls you enter.",
        "This is the wall surface only, before any pattern waste or trim. The number of rolls depends on the roll size and the pattern, which come from the product label: open Advanced settings to count rolls and, with your own price, the cost.",
        "A typical wallpaper cost range is not available yet."
      ]
    };
  }
  return { area: area, lines: lines, LIN: LIN };
}));
