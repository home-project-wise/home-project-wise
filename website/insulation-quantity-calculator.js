"use strict";
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.InsulationQuantity = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var M_PER_FT = 0.3048, M2_PER_FT2 = 0.09290304;
  function blank(value) {  function roundArea(value) {
    var n = Number(value);
    if (!Number.isFinite(n)) return n;
    var rounded = Number(n.toFixed(6));
    return rounded === 0 && n > 0 ? n : rounded;
  }
  function sharedRoomWallAreaM2(room) {
    var factor = room.unit === "ft" ? M_PER_FT : 1;
    return roundArea(Math.max(0, 2 * (Number(room.length) + Number(room.width)) * Number(room.height) -
      Number(room.openings || 0)) * factor * factor);
  }
 return value === "" || value === null || value === undefined; }
  function positive(value, label) {
    if (blank(value)) throw new Error(label + " is required.");
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be greater than zero.");
    return n;
  }
  function nonNegative(value, label) {
    if (blank(value)) return 0;
    var n = Number(value);
    if (!Number.isFinite(n) || n < 0) throw new Error(label + " must be zero or greater.");
    return n;
  }
  function ceilCount(value) {
    return Math.ceil(value - Number.EPSILON * Math.max(1, Math.abs(value)) * 4);
  }
  function calculate(input) {
    input = input || {};
    var unit = input.unit === "m" || input.unit === "ft" ? input.unit : null;
    var sections = Array.isArray(input.sections) ? input.sections : [];
    var sharedArea = nonNegative(input.sharedWallAreaM2, "Shared-room wall area");
    var hasManual = sections.some(function (s) { return !blank(s.length) || !blank(s.width); }) || !blank(input.openingsArea);
    if (!unit && !(sharedArea > 0 && !hasManual)) {
      throw new Error("Choose metres or feet when entering manual section dimensions or openings. A shared-room-only area is already in square metres.");
    }
    var factor = unit === "ft" ? M_PER_FT : 1, areaFactor = factor * factor;
    var gross = 0, sectionCount = 0;
    sections.forEach(function (s, i) {
      if (blank(s.length) && blank(s.width)) return;
      var length = positive(s.length, "Section " + (i + 1) + " length");
      var width = positive(s.width, "Section " + (i + 1) + " width");
      gross += length * width * areaFactor;
      sectionCount += 1;
    });
    var openings = nonNegative(input.openingsArea, "Openings area") * areaFactor;
    if (openings > gross + 1e-12) throw new Error("Openings area cannot exceed the manually measured section area.");
    var manualNet = Math.max(0, gross - openings);
    var totalM2 = manualNet + sharedArea;
    if (!Number.isFinite(totalM2) || totalM2 <= 0) throw new Error("Enter a positive measured area to cover.");
    var productName = String(input.productName || "").trim();
    var coverageBlank = blank(input.packCoverage), unitBlank = blank(input.coverageUnit);
    var anyProduct = productName !== "" || !coverageBlank || !unitBlank;
    var packCount = null, packRatio = null, coverageM2 = null, productDetailsIncomplete = anyProduct, productDetailsError = null;
    if (productName && !coverageBlank && !unitBlank) {
      productDetailsIncomplete = false;
      try {
        var coverage = positive(input.packCoverage, "Coverage per pack");
        if (input.coverageUnit !== "m2" && input.coverageUnit !== "ft2") throw new Error("Choose square metres or square feet for pack coverage.");
        coverageM2 = coverage * (input.coverageUnit === "ft2" ? M2_PER_FT2 : 1);
        packRatio = totalM2 / coverageM2;
        if (!Number.isFinite(packRatio) || packRatio <= 0) throw new Error("The pack calculation is outside the supported number range.");
        packCount = ceilCount(packRatio);
      } catch (e) {
        productDetailsError = e && e.message ? e.message : "Check the product coverage and unit.";
        packRatio = null; coverageM2 = null; packCount = null;
      }
    }
    return {
      unit: unit, sectionCount: sectionCount, grossManualAreaM2: gross, openingsAreaM2: openings,
      manualNetAreaM2: manualNet, sharedWallAreaM2: sharedArea, totalAreaM2: totalM2,
      totalAreaFt2: totalM2 / M2_PER_FT2, productName: productName || null,
      coverageUnit: input.coverageUnit || null, coverageM2: coverageM2,
      packRatio: packRatio, packCount: packCount, productDetailsIncomplete: productDetailsIncomplete, productDetailsError: productDetailsError
    };
  }
  function fmt(value, digits) {
    var n = Number(value), s = n.toLocaleString("en-US", { maximumFractionDigits: digits });
    return n > 0 && Number(s.replace(/,/g, "")) === 0 ? n.toExponential(3) : s;
  }
  function init(doc, win) {
    var form = doc.getElementById("ins-form");
    if (!form) return null;
    var sections = doc.getElementById("ins-sections"), count = 1, sharedWallAreaM2 = 0;
    function addSection() {
      count += 1;
      var row = doc.createElement("section");
      row.className = "fq-panel ins-section";
      row.innerHTML = '<h3>Measured section ' + count + '</h3>' +
        '<div class="fq-field"><label for="ins-length-' + count + '">Section ' + count + ' length</label><input id="ins-length-' + count + '" class="ins-length" type="number" min="0" step="any" placeholder="Measured length"></div>' +
        '<div class="fq-field"><label for="ins-width-' + count + '">Section ' + count + ' width</label><input id="ins-width-' + count + '" class="ins-width" type="number" min="0" step="any" placeholder="Measured width"></div>' +
        '<button type="button" class="fq-small-button" data-remove-section>Remove section</button>';
      sections.appendChild(row);
    }
    doc.getElementById("ins-add-section").addEventListener("click", addSection);
    sections.addEventListener("click", function (event) {
      var button = event.target.closest("[data-remove-section]");
      if (button) { var row = button.closest(".ins-section"); if (row) row.remove(); }
    });
    try {
      if (win && win.opener && !win.opener.closed && win.opener.location.origin === win.location.origin && win.opener.hpwRoom) {
        var room = win.opener.hpwRoom;
        if (Number(room.length) > 0 && Number(room.width) > 0 && Number(room.height) > 0 && (room.unit === "m" || room.unit === "ft")) {
          sharedWallAreaM2 = sharedRoomWallAreaM2(room);
          if (sharedWallAreaM2 > 0) {
            doc.getElementById("ins-room-note").textContent =
              "Shared-room gross wall area added: " + fmt(sharedWallAreaM2, 3) + " m² (" + fmt(sharedWallAreaM2 / M2_PER_FT2, 3) + " ft²), after shared-room openings. This is wall surface area, not clear cavity area between studs or joists.";
          }
        } else {
          doc.getElementById("ins-room-note").textContent = "The shared room needs length, width and wall height. Enter measured sections below, or return to the shared room and add its wall height.";
        }
      }
    } catch (e) { /* Manual area entry remains available if opener access is unavailable. */ }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var error = doc.getElementById("ins-error"), output = doc.getElementById("ins-result");
      error.textContent = ""; output.textContent = "";
      try {
        var data = calculate({
          unit: doc.getElementById("ins-unit").value,
          sections: Array.from(sections.querySelectorAll(".ins-section")).map(function (row) {
            return { length: row.querySelector(".ins-length").value, width: row.querySelector(".ins-width").value };
          }),
          openingsArea: doc.getElementById("ins-openings").value,
          sharedWallAreaM2: sharedWallAreaM2,
          productName: doc.getElementById("ins-product-name").value,
          packCoverage: doc.getElementById("ins-pack-coverage").value,
          coverageUnit: doc.getElementById("ins-coverage-unit").value
        });
        function line(value, strong) {
          var p = doc.createElement("p");
          if (strong) { var b = doc.createElement("strong"); b.textContent = value; p.appendChild(b); }
          else p.textContent = value;
          output.appendChild(p);
        }
        line("Measured area to cover: " + fmt(data.totalAreaM2, 3) + " m² (" + fmt(data.totalAreaFt2, 3) + " ft²).", true);
        line("Manual sections: " + fmt(data.manualNetAreaM2, 3) + " m² after subtracting " + fmt(data.openingsAreaM2, 3) + " m² of entered openings; shared-room wall area: " + fmt(data.sharedWallAreaM2, 3) + " m².");
        if (data.productDetailsError) {
          error.textContent = data.productDetailsError;
          line("Area remains available. Pack count not shown: " + data.productDetailsError);
        } else if (data.packCount !== null) {
          var shownCoverage = Number(doc.getElementById("ins-pack-coverage").value);
          var coverageUnit = doc.getElementById("ins-coverage-unit").value;
          var areaInCoverageUnit = coverageUnit === "ft2" ? data.totalAreaFt2 : data.totalAreaM2;
          line("Product: " + data.productName + ". Pack arithmetic: " + fmt(areaInCoverageUnit, 3) + " " + (coverageUnit === "ft2" ? "ft²" : "m²") + " ÷ " + fmt(shownCoverage, 3) + " " + (coverageUnit === "ft2" ? "ft²" : "m²") + " per pack = " + fmt(data.packRatio, 3) + "; rounded up to " + data.packCount + " pack(s).", true);
        } else if (data.productDetailsIncomplete) {
          line("Area is calculated above. To count packs, enter the product name, coverage per pack and its unit.");
        } else {
          line("No pack count requested. Enter product details only if you want the optional pack calculation.");
        }
      } catch (e) {
        error.textContent = e && e.message ? e.message : "Check the measurements and try again.";
      }
    });
    return { calculate: calculate };
  }
  return { calculate: calculate, init: init, sharedRoomWallAreaM2: sharedRoomWallAreaM2 };
});