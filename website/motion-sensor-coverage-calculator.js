(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWMotionSensorCoverage = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  function positive(value, label) {  function roundArea(value) {
    var n = Number(value);
    if (!Number.isFinite(n)) return n;
    var rounded = Number(n.toFixed(6));
    return rounded === 0 && n > 0 ? n : rounded;
  }
  function roomFloorArea(length, width) {
    return roundArea(Number(length) * Number(width));
  }


    if (value === "" || value === null || value === undefined) {
      throw new Error(label + " is required. If the manufacturer lists only detection distance and angle, this calculator cannot convert them into an area.");
    }
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be a finite number greater than zero.");
    return n;
  }

  function decimalParts(value) {
    var raw = String(value).trim().toLowerCase();
    var match = /^\+?(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/.exec(raw);
    if (!match || !(match[1] || match[2])) throw new Error("Enter a valid positive decimal area value.");
    var fraction = match[2] || "";
    var digits = (match[1] + fraction).replace(/^0+/, "") || "0";
    var scale = fraction.length - Number(match[3] || 0);
    if (scale < 0) { digits += "0".repeat(-scale); scale = 0; }
    while (scale > 0 && digits.endsWith("0")) { digits = digits.slice(0, -1); scale -= 1; }
    return { integer: BigInt(digits), scale: scale };
  }

  function exactCeilCount(areaValue, coverageValue) {
    var a = decimalParts(areaValue);
    var c = decimalParts(coverageValue);
    var numerator = a.integer * (10n ** BigInt(c.scale));
    var denominator = c.integer * (10n ** BigInt(a.scale));
    var count = (numerator + denominator - 1n) / denominator;
    if (count > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error("The sensor count is outside the supported number range.");
    return Number(count);
  }

  function calculate(input) {
    if (!input || typeof input !== "object") throw new Error("Enter both areas before calculating.");
    var area = positive(input.area, "Area to cover");
    var coverage = positive(input.coverage, "Manufacturer-stated coverage area");
    if (input.unit !== "m2" && input.unit !== "ft2") throw new Error("Choose square metres or square feet for both area values.");
    var ratio = area / coverage;
    if (!Number.isFinite(ratio) || !(ratio > 0)) throw new Error("The result is outside the supported number range.");
    var count = exactCeilCount(input.area, input.coverage);
    if (!Number.isSafeInteger(count) || count < 1) throw new Error("The sensor count is outside the supported number range.");
    return {
      area: area,
      coverage: coverage,
      unit: input.unit === "ft2" ? "ft²" : "m²",
      ratio: ratio,
      count: count
    };
  }

  function init(doc, win) {
    var form = doc.getElementById("msc-form");
    if (!form) return null;
    var area = doc.getElementById("msc-area");
    var coverage = doc.getElementById("msc-coverage");
    var unit = doc.getElementById("msc-unit");
    var error = doc.getElementById("msc-error");
    var status = doc.getElementById("msc-status");
    var result = doc.getElementById("msc-result");

    try {
      if (win.opener && !win.opener.closed && win.opener.location.origin === win.location.origin && win.opener.hpwRoom) {
        var room = win.opener.hpwRoom;
        if (Number(room.length) > 0 && Number(room.width) > 0 && (room.unit === "m" || room.unit === "ft")) {
          area.value = String(roomFloorArea(room.length, room.width));
          unit.value = room.unit === "ft" ? "ft2" : "m2";
          status.textContent = "Floor area copied from your shared room: " + area.value + " " + (room.unit === "ft" ? "ft²" : "m²") + ". It remains editable. Confirm this is the area you intend to cover.";
        }
      }
    } catch (e) { /* Manual area entry remains available when the popup handoff is unavailable. */ }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      error.textContent = "";
      result.textContent = "";
      status.textContent = "";
      try {
        var data = calculate({ area: area.value, coverage: coverage.value, unit: unit.value });
        function line(value, strong) {
          var p = doc.createElement("p");
          if (strong) {
            var b = doc.createElement("strong");
            b.textContent = value;
            p.appendChild(b);
          } else p.textContent = value;
          result.appendChild(p);
        }
        line("Minimum by area only: " + data.count + (data.count === 1 ? " sensor." : " sensors."), true);
        line("Area to cover: " + data.area.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + data.unit + ".");
        line("Manufacturer-stated coverage per sensor: " + data.coverage.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + data.unit + ".");
        line("Calculation: " + data.area.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " ÷ " + data.coverage.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " = " + data.ratio.toLocaleString("en-US", { maximumFractionDigits: 4 }) + "; rounded up = " + data.count + ".");
        line("This is not a placement plan, a security assessment or a safety assessment. Coverage depends on mounting height, field of view, obstacles and sensor type. Overlap is not included.", false);
      } catch (e) {
        error.textContent = e.message;
      }
    });
    return { calculate: calculate };
  }

  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { calculate: calculate, init: init, roomFloorArea: roomFloorArea };
}));
