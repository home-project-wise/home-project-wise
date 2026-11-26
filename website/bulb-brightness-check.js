(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWBulbBrightness = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function roundArea(value) {
    var n = Number(value);
    if (!Number.isFinite(n)) return n;
    var rounded = Number(n.toFixed(6));
    return rounded === 0 && n > 0 ? n : rounded;
  }
  function roomFloorArea(length, width) {
    return roundArea(Number(length) * Number(width));
  }

  var REFERENCES = {
    kitchen: { room: "kitchens", text: "1,000+ lumens per fixture" },
    bathroom: { room: "bathrooms", text: "1,000+ lumens per fixture" },
    "home-office": { room: "home offices", text: "1,000+ lumens per fixture" },
    "living-room": { room: "living rooms", text: "400–800 lumens per fixture" },
    bedroom: { room: "bedrooms", text: "400–800 lumens per fixture" }
  };
  function positive(value, label) {
    if (value === "" || value === null || value === undefined) throw new Error(label + " is required.");
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be greater than zero.");
    return n;
  }
  function positiveInteger(value, label) {
    var n = positive(value, label);
    if (!Number.isInteger(n)) throw new Error(label + " must be a whole number.");
    return n;
  }
  function calculate(input) {
    if (!input || typeof input !== "object") throw new Error("Enter your fixture details.");
    if (input.lumensPerBulb === "" || input.lumensPerBulb === null || input.lumensPerBulb === undefined) return null;
    var fixtures = positiveInteger(input.fixtureCount, "Number of fixtures");
    var bulbs = positiveInteger(input.bulbsPerFixture, "Bulbs per fixture");
    var lumens = positive(input.lumensPerBulb, "Lumens per bulb");
    var lumensPerFixture = bulbs * lumens;
    var totalLumens = fixtures * lumensPerFixture;
    if (!Number.isFinite(totalLumens)) throw new Error("The total is outside the supported number range.");
    var area = null, ratio = null, areaUnit = null;
    if (input.area !== "" && input.area !== null && input.area !== undefined) {
      area = positive(input.area, "Room floor area");
      areaUnit = input.areaUnit === "ft2" ? "ft²" : "m²";
      ratio = totalLumens / area;
      if (!Number.isFinite(ratio)) throw new Error("The floor-area ratio is outside the supported number range.");
    }
    return { fixtureCount: fixtures, bulbsPerFixture: bulbs, lumensPerBulb: lumens,
      lumensPerFixture: lumensPerFixture, totalLumens: totalLumens, area: area,
      areaUnit: areaUnit, ratio: ratio, reference: REFERENCES[input.roomType] || null };
  }
  function init(doc, win) {
    var form = doc.getElementById("brightness-form");
    if (!form) return null;
    var error = doc.getElementById("brightness-error"), result = doc.getElementById("brightness-result");
    var status = doc.getElementById("brightness-status");
    var area = doc.getElementById("room-area"), areaUnit = doc.getElementById("area-unit");
    var roomNote = doc.getElementById("shared-room-note");
    try {
      if (win.opener && !win.opener.closed && win.opener.location.origin === win.location.origin && win.opener.hpwRoom) {
        var room = win.opener.hpwRoom;
        if (Number(room.length) > 0 && Number(room.width) > 0 && (room.unit === "m" || room.unit === "ft")) {
          area.value = String(roomFloorArea(room.length, room.width));
          areaUnit.value = room.unit === "ft" ? "ft2" : "m2";
          roomNote.textContent = "Floor area copied from your shared room: " + area.value + " " + (room.unit === "ft" ? "ft²" : "m²") + ". You can edit it below.";
        }
      }
    } catch (e) { /* Cross-window access is optional; manual area entry remains available. */ }
    form.addEventListener("submit", function (event) {
      event.preventDefault(); error.textContent = ""; result.textContent = ""; status.textContent = "";
      var lumensValue = doc.getElementById("lumens-per-bulb").value;
      if (lumensValue === "") { status.textContent = "Enter the lumens printed on the bulb box to see your totals."; return; }
      try {
        var data = calculate({ roomType: doc.getElementById("room-type").value,
          fixtureCount: doc.getElementById("fixture-count").value,
          bulbsPerFixture: doc.getElementById("bulbs-per-fixture").value,
          lumensPerBulb: lumensValue, area: area.value, areaUnit: areaUnit.value });
        if (!data) return;
        function line(text, strong) {
          var p = doc.createElement("p");
          if (strong) { var b = doc.createElement("strong"); b.textContent = text; p.appendChild(b); }
          else p.textContent = text;
          result.appendChild(p);
        }
        function fmt(n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 }); }
        if (data.reference) line("ENERGY STAR fixture example for " + data.reference.room + ": " + data.reference.text + ". This is an example, not a target or pass/fail check.");
        line("Your output per fixture: " + data.bulbsPerFixture + " bulbs × " + fmt(data.lumensPerBulb) + " lumens per bulb = " + fmt(data.lumensPerFixture) + " lumens per fixture.");
        line("Your total light-source output: " + data.fixtureCount + " fixtures × " + fmt(data.lumensPerFixture) + " lumens per fixture = " + fmt(data.totalLumens) + " lumens.", true);
        if (data.ratio !== null) line("Plain floor-area ratio: " + fmt(data.totalLumens) + " lumens ÷ " + fmt(data.area) + " " + data.areaUnit + " = " + fmt(data.ratio) + " lumens per " + data.areaUnit + " of floor. This is a ratio only, not lux or foot-candles and not a recommendation.");
      } catch (e) { error.textContent = e && e.message ? e.message : "Check the values and try again."; }
    });
    return { calculate: calculate };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { REFERENCES: REFERENCES, calculate: calculate, init: init, roomFloorArea: roomFloorArea };
}));
