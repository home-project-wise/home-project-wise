/* Tile quantity estimator. Quantity only: visitor-entered dimensions, joint, waste and label coverage; no prices or hidden allowance. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWTile = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var M_PER_FT = 0.3048, FT2_PER_M2 = 10.7639104167;
  function positive(value, label) {
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be greater than zero.");
    return n;
  }
  function nonNegative(value, label) {
    var n = Number(value);
    if (!Number.isFinite(n) || n < 0) throw new Error(label + " must be zero or greater.");
    return n;
  }
  function calculate(input) {
    if (!input || !Array.isArray(input.sections) || !input.sections.length) throw new Error("Add at least one rectangular floor area.");
    var unit = input.lengthUnit === "ft" ? "ft" : input.lengthUnit === "m" ? "m" : null;
    if (!unit) throw new Error("Choose metres or feet for floor measurements.");
    var factor = unit === "ft" ? M_PER_FT : 1;
    var gross = input.sections.reduce(function (sum, s, i) {
      return sum + positive(s.length, "Area " + (i + 1) + " length") * factor *
        positive(s.width, "Area " + (i + 1) + " width") * factor;
    }, 0);
    var openings = Array.isArray(input.openings) ? input.openings.reduce(function (sum, a, i) {
      return sum + positive(a, "Opening " + (i + 1) + " area") * factor * factor;
    }, 0) : 0;
    if (openings > gross + 1e-10) throw new Error("Opening areas cannot exceed the measured floor area.");
    var net = Math.max(0, gross - openings);
    if (!(net > 0)) throw new Error("The net floor area must be greater than zero after openings are subtracted.");
    var waste = input.waste === "" || input.waste === null || input.waste === undefined ? 0 : nonNegative(input.waste, "Extra allowance");
    if (waste > 50) throw new Error("Extra allowance must be 0–50%, or leave it blank.");
    var adjusted = net * (1 + waste / 100);
    var tileL = input.tileLength === "" || input.tileLength === null || input.tileLength === undefined ? null : positive(input.tileLength, "Tile length");
    var tileW = input.tileWidth === "" || input.tileWidth === null || input.tileWidth === undefined ? null : positive(input.tileWidth, "Tile width");
    var joint = input.joint === "" || input.joint === null || input.joint === undefined ? 0 : nonNegative(input.joint, "Joint width");
    var jointUnit = input.jointUnit === "in" ? "in" : input.jointUnit === "mm" ? "mm" : null;
    if (joint > 0 && !jointUnit) throw new Error("Choose millimetres or inches for the joint width.");
    var tiles = null, tileAreaM2 = null;
    if ((tileL === null) !== (tileW === null)) throw new Error("Enter both tile dimensions, or leave both blank.");
    if (tileL !== null) {
      var jointM = jointUnit === "in" ? joint * 0.0254 : joint / 1000;
      var tileLM = tileL * factor, tileWM = tileW * factor;
      tileAreaM2 = (tileLM + jointM) * (tileWM + jointM);
      if (!Number.isFinite(tileAreaM2) || tileAreaM2 <= 0) throw new Error("Tile dimensions are outside the supported range.");
      tiles = Math.ceil(adjusted / tileAreaM2 - 1e-12);
    }
    var coverage = input.boxCoverage === "" || input.boxCoverage === null || input.boxCoverage === undefined ? null : positive(input.boxCoverage, "Box coverage");
    var coverageUnit = input.coverageUnit === "ft2" ? "ft2" : input.coverageUnit === "m2" ? "m2" : null;
    if (coverage !== null && !coverageUnit) throw new Error("Choose the unit printed with the box coverage.");
    var coverageM2 = coverage === null ? null : coverage * (coverageUnit === "ft2" ? 1 / FT2_PER_M2 : 1);
    return {
      lengthUnit: unit, grossAreaM2: gross, openingAreaM2: openings, netAreaM2: net,
      adjustedAreaM2: adjusted, grossAreaFt2: gross * FT2_PER_M2, openingAreaFt2: openings * FT2_PER_M2,
      netAreaFt2: net * FT2_PER_M2, adjustedAreaFt2: adjusted * FT2_PER_M2,
      wastePercent: waste, tileCount: tiles, tileFootprintM2: tileAreaM2,
      boxCoverageM2: coverageM2, boxes: coverageM2 === null ? null : Math.ceil(adjusted / coverageM2 - 1e-12)
    };
  }
  function formatArea(m2, preferredUnit) {
    var fmt = function (n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 3 }); };
    var metric = fmt(m2) + " m²", imperial = fmt(m2 * FT2_PER_M2) + " ft²";
    return { primary: preferredUnit === "ft" ? imperial : metric, metric: metric, imperial: imperial };
  }
  function init(doc, win) {
    var host = doc.getElementById("tile-root");
    if (!host) return null;
    host.innerHTML =
      '<section class="wp-room" aria-labelledby="tile-title"><h3 id="tile-title">Tile quantity</h3>' +
      '<p class="wp-note">Measure each rectangular floor area and subtract openings. Tile count uses the dimensions and joint you enter; box count uses coverage printed on your product label. No prices or hidden allowance are added.</p>' +
      '<form class="calc" id="tile-form" novalidate>' +
      '<div class="calc-grid"><div class="calc-field"><label for="tile-unit">Floor measurements</label><select id="tile-unit"><option value="m">Metres</option><option value="ft">Feet</option></select></div></div>' +
      '<div id="tile-sections"><div class="calc-grid tile-section"><div class="calc-field"><label for="tile-length-1">Area 1 length</label><input id="tile-length-1" class="tile-length" type="number" min="0" step="any" required></div><div class="calc-field"><label for="tile-width-1">Area 1 width</label><input id="tile-width-1" class="tile-width" type="number" min="0" step="any" required></div></div></div>' +
      '<p><button type="button" class="wp-btn" id="tile-add-section">Add another rectangular area</button> <button type="button" class="wp-btn" id="tile-use-room">Use shared room length and width (replaces extra areas)</button></p>' +
      '<div class="calc-grid"><div class="calc-field"><label for="tile-openings">Total opening area to subtract (optional)</label><input id="tile-openings" type="number" min="0" step="any" value="0"><small>Enter the combined area of any un-tiled openings in the same unit system.</small></div>' +
      '<div class="calc-field"><label for="tile-waste">Extra allowance (optional, your choice %)</label><input id="tile-waste" type="number" min="0" max="50" step="any" placeholder="Leave blank for none"></div>' +
      '<div class="calc-field"><label for="tile-length">Tile length (optional)</label><input id="tile-length" type="number" min="0" step="any" placeholder="From your tile"></div>' +
      '<div class="calc-field"><label for="tile-width">Tile width (optional)</label><input id="tile-width" type="number" min="0" step="any" placeholder="From your tile"></div>' +
      '<div class="calc-field"><label for="tile-joint">Joint width (optional)</label><input id="tile-joint" type="number" min="0" step="any" placeholder="Your chosen joint"></div>' +
      '<div class="calc-field"><label for="tile-joint-unit">Joint unit</label><select id="tile-joint-unit"><option value="mm">Millimetres</option><option value="in">Inches</option></select></div>' +
      '<div class="calc-field"><label for="tile-box-coverage">Box coverage (optional, from product label)</label><input id="tile-box-coverage" type="number" min="0" step="any" placeholder="Enter label coverage"></div>' +
      '<div class="calc-field"><label for="tile-coverage-unit">Coverage unit on label</label><select id="tile-coverage-unit"><option value="m2">m²</option><option value="ft2">ft²</option></select></div></div>' +
      '<p class="calc-error" id="tile-error" role="alert"></p><button class="calc-btn" type="submit">Calculate tile quantity</button></form>' +
      '<div class="tool-result" id="tile-result" aria-live="polite"></div>' +
      '<p class="formula">Net area = total measured rectangular areas − opening area. Tile count uses (tile length + joint) × (tile width + joint). Box count uses only the coverage you enter from the product label. Extra allowance is optional and never pre-filled. No prices, grout, mortar or installation materials are estimated.</p></section>';
    var sections = doc.getElementById("tile-sections"), count = 1;
    function addSection(length, width) {
      count += 1;
      var row = doc.createElement("div"); row.className = "calc-grid tile-section";
      row.innerHTML = '<div class="calc-field"><label for="tile-length-' + count + '">Area ' + count + ' length</label><input id="tile-length-' + count + '" class="tile-length" type="number" min="0" step="any" required></div><div class="calc-field"><label for="tile-width-' + count + '">Area ' + count + ' width</label><input id="tile-width-' + count + '" class="tile-width" type="number" min="0" step="any" required></div><div class="calc-field"><button type="button" class="wp-btn tile-remove">Remove area</button></div>';
      if (length !== undefined) row.querySelector(".tile-length").value = length;
      if (width !== undefined) row.querySelector(".tile-width").value = width;
      sections.appendChild(row);
    }
    doc.getElementById("tile-add-section").addEventListener("click", function () { addSection(); });
    doc.getElementById("tile-use-room").addEventListener("click", function () {
      var room = win && win.hpwRoom;
      if (!room || !(Number(room.length) > 0) || !(Number(room.width) > 0)) {
        doc.getElementById("tile-error").textContent = "Enter a valid room length and width in “Enter your room once” first.";
        return;
      }
      doc.getElementById("tile-unit").value = room.unit === "ft" ? "ft" : "m";
      var rows = sections.querySelectorAll(".tile-section");
      rows[0].querySelector(".tile-length").value = room.length;
      rows[0].querySelector(".tile-width").value = room.width;
      Array.prototype.slice.call(rows, 1).forEach(function (r) { r.remove(); });
      count = 1;
      doc.getElementById("tile-openings").value = "0";
      doc.getElementById("tile-error").textContent = "";
    });
    sections.addEventListener("click", function (event) {
      var button = event.target && event.target.closest ? event.target.closest(".tile-remove") : null;
      if (!button) return;
      var row = button.closest(".tile-section");
      if (sections.querySelectorAll(".tile-section").length > 1) row.remove();
      Array.prototype.forEach.call(sections.querySelectorAll(".tile-section"), function (r, i) {
        r.querySelectorAll("label")[0].textContent = "Area " + (i + 1) + " length";
        r.querySelectorAll("label")[1].textContent = "Area " + (i + 1) + " width";
        r.querySelectorAll("label")[0].htmlFor = "tile-length-" + (i + 1);
        r.querySelectorAll("label")[1].htmlFor = "tile-width-" + (i + 1);
        r.querySelector(".tile-length").id = "tile-length-" + (i + 1);
        r.querySelector(".tile-width").id = "tile-width-" + (i + 1);
      });
      count = sections.querySelectorAll(".tile-section").length;
    });
    doc.getElementById("tile-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var error = doc.getElementById("tile-error"), output = doc.getElementById("tile-result");
      error.textContent = ""; output.textContent = "";
      try {
        var lengths = sections.querySelectorAll(".tile-length"), widths = sections.querySelectorAll(".tile-width"), data = [];
        for (var i = 0; i < lengths.length; i++) data.push({ length: lengths[i].value, width: widths[i].value });
        var opening = doc.getElementById("tile-openings").value;
        var result = calculate({ lengthUnit: doc.getElementById("tile-unit").value, sections: data,
          openings: opening === "" || Number(opening) === 0 ? [] : [opening], waste: doc.getElementById("tile-waste").value,
          tileLength: doc.getElementById("tile-length").value, tileWidth: doc.getElementById("tile-width").value,
          joint: doc.getElementById("tile-joint").value, jointUnit: doc.getElementById("tile-joint-unit").value,
          boxCoverage: doc.getElementById("tile-box-coverage").value, coverageUnit: doc.getElementById("tile-coverage-unit").value });
        var fmt = function (n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 3 }); };
        var area = formatArea(result.netAreaM2, result.lengthUnit), adjusted = formatArea(result.adjustedAreaM2, result.lengthUnit);
        var p = doc.createElement("p"), strong = doc.createElement("strong");
        strong.textContent = "Net floor area: " + area.primary; p.appendChild(strong); output.appendChild(p);
        var detail = doc.createElement("p");
        detail.textContent = "Measured area: " + formatArea(result.grossAreaM2, result.lengthUnit).primary +
          ". Openings subtracted: " + formatArea(result.openingAreaM2, result.lengthUnit).primary +
          ". Area to plan for: " + adjusted.primary + (result.wastePercent ? " (includes your " + fmt(result.wastePercent) + "% extra allowance)." : " (no extra allowance added).");
        output.appendChild(detail);
        var quantity = doc.createElement("p");
        quantity.textContent = result.tileCount === null ? "Tile count not calculated: enter both tile dimensions to estimate individual tiles." :
          "Estimated tiles: " + result.tileCount + " (using your tile dimensions and joint width).";
        output.appendChild(quantity);
        var boxes = doc.createElement("p");
        boxes.textContent = result.boxes === null ? "Box count not calculated: enter the coverage printed on your product label." :
          "Estimated boxes: " + result.boxes + " (using the label coverage only).";
        output.appendChild(boxes);
      } catch (err) { error.textContent = err.message; }
    });
    return { calculate: calculate };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { calculate: calculate, formatArea: formatArea, init: init };
}));
