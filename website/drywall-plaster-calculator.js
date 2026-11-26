(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWDrywallPlaster = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var M_PER_FT = 0.3048, M2_PER_FT2 = 0.09290304;
  function positive(value, label) {
    if (value === "" || value === null || value === undefined) throw new Error(label + " is required.");
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be greater than zero.");
    return n;
  }
  function nonNegativeOptional(value, label) {
    if (value === "" || value === null || value === undefined) return 0;
    var n = Number(value);
    if (!Number.isFinite(n) || n < 0) throw new Error(label + " must be zero or greater, or leave it blank.");
    return n;
  }
  function ceilCount(value) {
    return Math.ceil(value - Number.EPSILON * Math.max(1, Math.abs(value)) * 4);
  }
  function calculate(input) {
    if (!input || typeof input !== "object") throw new Error("Enter at least one measured surface.");
    var unit = input.lengthUnit === "m" || input.lengthUnit === "ft" ? input.lengthUnit : null;
    var sections = Array.isArray(input.sections) ? input.sections : [];
    var sharedArea = nonNegativeOptional(input.sharedWallAreaM2, "Shared-room wall area");
    var hasManualMeasurements = sections.some(function (section) {
      return !(section.length === "" || section.length === null || section.length === undefined) ||
        !(section.height === "" || section.height === null || section.height === undefined);
    }) || !((input.openingsArea === "" || input.openingsArea === null || input.openingsArea === undefined)) ||
      !((input.ceilingArea === "" || input.ceilingArea === null || input.ceilingArea === undefined));
    if (!unit && !(sharedArea > 0 && !hasManualMeasurements)) {
      throw new Error("Choose metres or feet when entering manual wall dimensions, openings, ceiling area or board dimensions. A shared-room-only area is already in square metres.");
    }
    var factor = unit === "ft" ? M_PER_FT : 1;
    var areaFactor = factor * factor;
    var grossM2 = 0;
    sections.forEach(function (section, index) {
      var lengthBlank = section.length === "" || section.length === null || section.length === undefined;
      var heightBlank = section.height === "" || section.height === null || section.height === undefined;
      if (lengthBlank && heightBlank) return;
      var length = positive(section.length, "Wall section " + (index + 1) + " length");
      var height = positive(section.height, "Wall section " + (index + 1) + " height");
      grossM2 += length * factor * height * factor;
    });
    var openings = nonNegativeOptional(input.openingsArea, "Openings area") * areaFactor;
    if (openings > grossM2 + 1e-12) throw new Error("Openings area cannot exceed the manually measured wall area.");
    var ceiling = nonNegativeOptional(input.ceilingArea, "Ceiling area") * areaFactor;
    var manualNet = Math.max(0, grossM2 - openings);
    var totalAreaM2 = manualNet + sharedArea + ceiling;
    if (!Number.isFinite(totalAreaM2) || totalAreaM2 <= 0) throw new Error("Enter a positive wall or ceiling area.");
    var result = {
      lengthUnit:unit, sectionCount:sections.length, grossWallAreaM2:grossM2, openingsAreaM2:openings,
      manualNetWallAreaM2:manualNet, sharedWallAreaM2:sharedArea, ceilingAreaM2:ceiling, totalAreaM2:totalAreaM2,
      totalAreaFt2:totalAreaM2 / M2_PER_FT2, boardCount:null, boardRatio:null, boardDetailsIncomplete:false,
      plasterBagCount:null, plasterBagRatio:null, plasterDetailsIncomplete:false, plasterThicknessMismatch:false,
      plasterProductName:null, plasterCoverageM2:null, plasterReferenceThicknessMm:null, plasterApplicationThicknessMm:null
    };
    var bwBlank = input.boardWidth === "" || input.boardWidth === null || input.boardWidth === undefined;
    var bhBlank = input.boardHeight === "" || input.boardHeight === null || input.boardHeight === undefined;
    if (!unit && (!bwBlank || !bhBlank)) result.boardDetailsIncomplete = true;
    else if (!bwBlank && !bhBlank) {
      var bw = Number(input.boardWidth), bh = Number(input.boardHeight);
      if (Number.isFinite(bw) && bw > 0 && Number.isFinite(bh) && bh > 0) {
        var boardAreaM2 = bw * factor * bh * factor;
        result.boardRatio = totalAreaM2 / boardAreaM2;
        result.boardCount = ceilCount(result.boardRatio);
      } else result.boardDetailsIncomplete = true;
    } else if (!bwBlank || !bhBlank) result.boardDetailsIncomplete = true;
    var product = String(input.plasterProductName || "").trim();
    var coverageBlank = input.plasterCoverage === "" || input.plasterCoverage === null || input.plasterCoverage === undefined;
    var refBlank = input.plasterReferenceThickness === "" || input.plasterReferenceThickness === null || input.plasterReferenceThickness === undefined;
    var appBlank = input.plasterApplicationThickness === "" || input.plasterApplicationThickness === null || input.plasterApplicationThickness === undefined;
    var anyPlaster = product || !coverageBlank || !refBlank || !appBlank;
    if (product && !coverageBlank && !refBlank && !appBlank) {
      var coverage = Number(input.plasterCoverage), refThickness = Number(input.plasterReferenceThickness), appThickness = Number(input.plasterApplicationThickness);
      var coverageUnit = input.plasterCoverageUnit;
      var thicknessUnit = input.plasterThicknessUnit;
      var coverageFactor = coverageUnit === "ft2" ? M2_PER_FT2 : coverageUnit === "m2" ? 1 : NaN;
      var thicknessFactor = thicknessUnit === "in" ? 25.4 : thicknessUnit === "mm" ? 1 : NaN;
      if (Number.isFinite(coverage) && coverage > 0 && Number.isFinite(refThickness) && refThickness > 0 &&
          Number.isFinite(appThickness) && appThickness > 0 && Number.isFinite(coverageFactor) && Number.isFinite(thicknessFactor)) {
        var coverageM2 = coverage * coverageFactor;
        var refMm = refThickness * thicknessFactor, appMm = appThickness * thicknessFactor;
        result.plasterProductName = product; result.plasterCoverageM2 = coverageM2;
        result.plasterReferenceThicknessMm = refMm; result.plasterApplicationThicknessMm = appMm;
        if (Math.abs(refMm - appMm) <= 1e-9) {
          result.plasterBagRatio = totalAreaM2 / coverageM2;
          if (Number.isFinite(result.plasterBagRatio) && result.plasterBagRatio > 0) result.plasterBagCount = ceilCount(result.plasterBagRatio);
          else result.plasterDetailsIncomplete = true;
        } else {
          result.plasterDetailsIncomplete = true; result.plasterThicknessMismatch = true;
        }
      } else result.plasterDetailsIncomplete = true;
    } else if (anyPlaster) result.plasterDetailsIncomplete = true;
    return result;
  }
  function fmt(value, digits) {
    var n = Number(value), s = n.toLocaleString("en-US", { maximumFractionDigits:digits });
    return n > 0 && Number(s.replace(/,/g, "")) === 0 ? n.toExponential(3) : s;
  }
  function format(result) {
    return { metric:fmt(result.totalAreaM2,3) + " m²", imperial:fmt(result.totalAreaFt2,3) + " ft²",
      boardRatio:result.boardRatio === null ? null : fmt(result.boardRatio,3),
      plasterRatio:result.plasterBagRatio === null ? null : fmt(result.plasterBagRatio,3),
      plasterCoverageM2:result.plasterCoverageM2 === null ? null : fmt(result.plasterCoverageM2,3),
      plasterReferenceThicknessMm:result.plasterReferenceThicknessMm === null ? null : fmt(result.plasterReferenceThicknessMm,3),
      plasterApplicationThicknessMm:result.plasterApplicationThicknessMm === null ? null : fmt(result.plasterApplicationThicknessMm,3) };
  }
  function init(doc, win) {
    var form = doc.getElementById("dp-form");
    if (!form) return null;
    var sections = doc.getElementById("dp-sections"), count = 1, sharedWallAreaM2 = 0;
    function addSection(length, height) {
      count += 1;
      var row = doc.createElement("div"); row.className = "dp-grid dp-section";
      row.innerHTML = '<div class="dp-field"><label for="dp-length-' + count + '">Wall section ' + count + ' length</label><input id="dp-length-' + count + '" class="dp-length" type="number" min="0" step="any" required></div>' +
        '<div class="dp-field"><label for="dp-height-' + count + '">Wall section ' + count + ' height</label><input id="dp-height-' + count + '" class="dp-height" type="number" min="0" step="any" required></div>';
      row.insertAdjacentHTML("beforeend", '<div class="dp-section-controls"><button type="button" class="dp-button" data-remove-section aria-label="Remove wall section ' + count + '">Remove section</button></div>');
      sections.appendChild(row);
      if (length !== undefined) row.querySelector(".dp-length").value = String(length);
      if (height !== undefined) row.querySelector(".dp-height").value = String(height);
    }
    var add = doc.getElementById("dp-add-section");
    add.addEventListener("click", function () { addSection(); });
    sections.addEventListener("click", function (event) {
      var button = event.target.closest("[data-remove-section]");
      if (button) { var row = button.closest(".dp-section"); if (row) row.remove(); }
    });
    try {
      if (win.opener && !win.opener.closed && win.opener.location.origin === win.location.origin && win.opener.hpwRoom) {
        var room = win.opener.hpwRoom;
        if (Number(room.length) > 0 && Number(room.width) > 0 && Number(room.height) > 0 && (room.unit === "m" || room.unit === "ft")) {
          var f = room.unit === "ft" ? M_PER_FT : 1;
          sharedWallAreaM2 = Math.max(0, 2 * (Number(room.length) + Number(room.width)) * Number(room.height) - Number(room.openings || 0)) * f * f;
          if (sharedWallAreaM2 > 0) doc.getElementById("dp-room-note").textContent =
            "Shared-room wall area added: " + fmt(sharedWallAreaM2,3) + " m² (" + fmt(sharedWallAreaM2 / M2_PER_FT2,3) + " ft²), after the openings entered in the shared room. Add separate wall sections only for additional surfaces.";
        } else doc.getElementById("dp-room-note").textContent = "The shared room needs length, width and wall height. Enter wall sections below, or return to the shared room and add its wall height.";
      }
    } catch (e) { /* Manual surface measurements remain available if opener access is unavailable. */ }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var error = doc.getElementById("dp-error"), output = doc.getElementById("dp-result");
      error.textContent = ""; output.textContent = "";
      try {
        var lengthUnit = doc.getElementById("dp-unit").value;
        var data = calculate({
          lengthUnit:lengthUnit,
          sections:Array.from(sections.querySelectorAll(".dp-section")).map(function (row) {
            return { length:row.querySelector(".dp-length").value, height:row.querySelector(".dp-height").value };
          }),
          openingsArea:doc.getElementById("dp-openings").value, ceilingArea:doc.getElementById("dp-ceiling").value,
          sharedWallAreaM2:sharedWallAreaM2,
          boardWidth:doc.getElementById("dp-board-width").value, boardHeight:doc.getElementById("dp-board-height").value,
          plasterProductName:doc.getElementById("dp-plaster-name").value, plasterCoverage:doc.getElementById("dp-plaster-coverage").value,
          plasterCoverageUnit:doc.getElementById("dp-plaster-coverage-unit").value,
          plasterReferenceThickness:doc.getElementById("dp-plaster-reference").value,
          plasterApplicationThickness:doc.getElementById("dp-plaster-application").value,
          plasterThicknessUnit:doc.getElementById("dp-plaster-thickness-unit").value
        });
        function line(value, strong) {
          var p = doc.createElement("p");
          if (strong) { var b = doc.createElement("strong"); b.textContent = value; p.appendChild(b); }
          else p.textContent = value;
          output.appendChild(p);
        }
        var shown = format(data);
        line("Net measured surface area: " + shown.metric + " (" + shown.imperial + ").", true);
        line("Area arithmetic: wall rectangles " + fmt(data.grossWallAreaM2,3) + " m² − openings " + fmt(data.openingsAreaM2,3) + " m² + shared-room walls " + fmt(data.sharedWallAreaM2,3) + " m² + ceiling " + fmt(data.ceilingAreaM2,3) + " m² = " + shown.metric + ".");
        var boardAreaText = lengthUnit === "ft" ? shown.imperial : shown.metric;
        if (data.boardCount !== null) line("Drywall board estimate: " + boardAreaText + " ÷ (" + doc.getElementById("dp-board-width").value + " × " + doc.getElementById("dp-board-height").value + " " + lengthUnit + " panel face) = " + shown.boardRatio + " boards; rounded up to " + data.boardCount + " whole boards.");
        else line(data.boardDetailsIncomplete ? "Drywall board count not calculated: enter both panel face dimensions from the selected board. No standard board size is assumed." : "No drywall board count calculated. Enter the actual panel face width and length from your selected board if you want this estimate.");
        if (data.plasterBagCount !== null) line("Plaster bag estimate for " + data.plasterProductName + ": " + shown.metric + " ÷ " + shown.plasterCoverageM2 + " m² per bag (published at " + shown.plasterReferenceThicknessMm + " mm; your entered application thickness matches) = " + shown.plasterRatio + " bags; rounded up to " + data.plasterBagCount + " whole bags. Only the product-label coverage you entered was used.");
        else if (data.plasterThicknessMismatch) line("Plaster bag count not calculated: your application thickness does not match the thickness stated with the product's published coverage. Use coverage published for your actual thickness; no scaling is assumed. Your area result remains available.");
        else line(data.plasterDetailsIncomplete ? "Plaster bag count not calculated: complete the named product, published coverage per bag, coverage unit, reference thickness and application thickness. Your area result remains available." : "No plaster bag count calculated. Add the exact product-label coverage and the two thickness values if you want this estimate.");
        line("Board count is an area estimate, not a sheet-layout or cut plan. Actual layouts, framing, joints and offcuts can change quantities.");
        line("This tool does not assess product suitability, substrates, moisture, fire or sound ratings, structural performance or code compliance.");
      } catch (e) { error.textContent = e && e.message ? e.message : "Check the measurements and try again."; }
    });
    return { calculate:calculate, addSection:addSection };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document,window);
  return { calculate:calculate, format:format, init:init };
}));
