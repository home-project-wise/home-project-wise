/* Tile quantity and exact-market material-cost estimator. No hidden geometry, waste or price assumptions. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(typeof globalThis !== "undefined" ? globalThis : root);
  else root.HPWTile = factory(root);
}(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";
  var RP = typeof module === "object" && module.exports && typeof require === "function" ? require("./reference-prices.js") : root.HPWReferencePrices;
  var Currency = typeof module === "object" && module.exports && typeof require === "function" ? require("./currency.js") : root.HPWCurrency;
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
  var UNIT_DEFAULTS = {
    m: { tileUnit: "cm", jointUnit: "mm", coverageUnit: "m2" },
    ft: { tileUnit: "in", jointUnit: "in", coverageUnit: "ft2" }
  };
  /* Starting unit for the tile size, joint and label coverage selects, taken only from the floor-measurement unit the visitor
   * chose. A starting choice, never a conversion: it is never applied over a unit the visitor picked or beside a number they typed. */
  function defaultUnits(floorUnit) {
    var d = floorUnit === "ft" ? UNIT_DEFAULTS.ft : floorUnit === "m" ? UNIT_DEFAULTS.m : null;
    return d ? { tileUnit: d.tileUnit, jointUnit: d.jointUnit, coverageUnit: d.coverageUnit } : null;
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
    var tileUnit = ["mm","cm","in","m","ft"].indexOf(input.tileUnit) >= 0 ? input.tileUnit : null;
    var joint = input.joint === "" || input.joint === null || input.joint === undefined ? 0 : nonNegative(input.joint, "Joint width");
    var jointUnit = input.jointUnit === "in" ? "in" : input.jointUnit === "mm" ? "mm" : null;
    if (joint > 0 && !jointUnit) throw new Error("Choose millimetres or inches for the joint width.");
    var tiles = null, tileAreaM2 = null;
    if ((tileL === null) !== (tileW === null)) throw new Error("Enter both tile dimensions, or leave both blank.");
    if (tileL !== null) {
      if (!tileUnit) throw new Error("Choose the unit used for your tile dimensions.");
      var tileFactorM = tileUnit === "mm" ? 0.001 : tileUnit === "cm" ? 0.01 : tileUnit === "in" ? 0.0254 : tileUnit === "ft" ? M_PER_FT : 1;
      var jointM = jointUnit === "in" ? joint * 0.0254 : joint / 1000;
      var tileLM = tileL * tileFactorM, tileWM = tileW * tileFactorM;
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
  function selectTileReference(records, country, subtype) {
    if (!RP || !country || !subtype || ["ceramic-tile", "porcelain-tile"].indexOf(subtype) === -1) return { ok: false, message: RP ? RP.NO_REFERENCE : "No reference range yet." };
    var query = { country: country, category: "flooring", subtype: subtype };
    var selected = RP.select(records || [], query);
    if (!selected.ok && typeof RP.selectDisplayOnly === "function") {
      var observed = RP.selectDisplayOnly(records || [], query);
      if (observed.ok) return { ok: true, record: observed.record, displayOnly: true };
    }
    return selected.ok ? { ok: true, record: selected.record, displayOnly: false } : selected;
  }
  function estimateMaterialCost(input) {
    input = input || {};
    var country = input.country || "", currency = Currency && Currency.codeForMarket ? Currency.codeForMarket(country) : "";
    var manual = input.manualPrice === "" || input.manualPrice === null || input.manualPrice === undefined ? null : Number(input.manualPrice);
    var pack = input.packPrice === "" || input.packPrice === null || input.packPrice === undefined ? null : Number(input.packPrice);
    if (manual !== null && (!Number.isFinite(manual) || manual <= 0)) throw new Error("Your material price per area must be greater than zero, or leave it blank.");
    if (pack !== null && (!Number.isFinite(pack) || pack <= 0)) throw new Error("Your price per box must be greater than zero, or leave it blank.");
    var areaUnit = input.areaUnit === "sq ft" ? "sq ft" : "m²";
    var area = areaUnit === "sq ft" ? Number(input.areaFt2) : Number(input.areaM2);
    if (!Number.isFinite(area) || area <= 0) throw new Error("The floor area must be greater than zero before estimating material cost.");
    var result = { ok: false, currency: currency, kind: "unpriced", displayOnly: false, record: null, areaCost: null, packTotal: null, packCount: null, message: "" };
    if (!currency) {
      result.message = "Choose your country above to show material prices in the correct market currency. The quantity calculation still works.";
    } else if (manual !== null) {
      var total = Number((manual * area).toFixed(2));
      result.ok = true; result.kind = "manual"; result.areaCost = { low: total, high: total, currency: currency, quantity: area, quantityUnit: areaUnit };
      result.message = "Your entered price replaces the reference range.";
    } else {
      var selected = selectTileReference(input.records, country, input.subtype);
      if (!input.subtype) {
        result.message = "Choose ceramic or porcelain tile to check the exact-market reference. You can still enter your own local price per " + areaUnit + ".";
      } else if (!selected.ok) {
        result.message = "No reference range is available for this tile type in " + country + ". Enter your own local price per " + areaUnit + "; no price from another country is substituted.";
      } else {
        var areaCost = RP.areaCost(selected.record, area, areaUnit);
        if (areaCost) {
          result.ok = true; result.kind = "reference"; result.displayOnly = selected.displayOnly;
          result.record = selected.record; result.areaCost = areaCost;
          result.description = RP.describe(selected.record, input.now || new Date());
        } else result.message = "A reference price could not be calculated for this area. Enter your own local price instead.";
      }
    }
    if (pack !== null && currency) {
      if (Number.isInteger(input.boxes) && input.boxes > 0) {
        result.packCount = input.boxes;
        result.packTotal = Number((pack * input.boxes).toFixed(2));
      } else result.packMessage = "Enter the box coverage from the product label to calculate the separate pack-price estimate.";
    }
    return result;
  }
  function init(doc, win) {
    var host = doc.getElementById("tile-root");
    if (!host) return null;
    host.innerHTML =
      '<section class="wp-room" aria-labelledby="tile-title"><h3 id="tile-title">Tile quantity and material cost</h3>' +
      '<p class="wp-note">Measure each rectangular floor area and subtract any untiled floor openings. Tile count uses the dimensions and joint you enter. Material prices appear only when a source exists for your selected country and tile type; no allowance is added unless you enter one.</p>' +
      '<form class="calc" id="tile-form" novalidate>' +
      '<div class="calc-grid"><div class="calc-field"><label for="tile-unit">Floor measurements</label><select id="tile-unit"><option value="m">Metres</option><option value="ft">Feet</option></select></div></div>' +
      '<div id="tile-sections"><div class="calc-grid tile-section"><div class="calc-field"><label for="tile-length-1">Area 1 length</label><input id="tile-length-1" class="tile-length" type="number" min="0" step="any" required></div><div class="calc-field"><label for="tile-width-1">Area 1 width</label><input id="tile-width-1" class="tile-width" type="number" min="0" step="any" required></div></div></div>' +
      '<p><button type="button" class="wp-btn" id="tile-add-section">Add another rectangular area</button> <button type="button" class="wp-btn" id="tile-use-room" hidden>Use shared room length and width (replaces extra areas)</button></p><p class="wp-note" id="tile-room-note" hidden>Using the dimensions entered in “Enter your room once”. Tile floor openings remain a separate optional measurement.</p>' +
      '<div class="calc-grid"><div class="calc-field"><label for="tile-openings">Total opening area to subtract (optional)</label><input id="tile-openings" type="number" min="0" step="any" value="0"><small>Enter the combined area of any un-tiled openings in the same unit system.</small></div>' +
      '<div class="calc-field"><label for="tile-waste">Extra allowance (optional, your choice %)</label><input id="tile-waste" type="number" min="0" max="50" step="any" placeholder="Leave blank for none"></div>' +
      '<div class="calc-field"><label for="tile-length">Tile length (optional)</label><input id="tile-length" type="number" min="0" step="any" placeholder="From your tile"></div>' +
      '<div class="calc-field"><label for="tile-width">Tile width (optional)</label><input id="tile-width" type="number" min="0" step="any" placeholder="From your tile"></div>' +
      '<div class="calc-field"><label for="tile-size-unit">Tile size unit</label><select id="tile-size-unit"><option value="mm">Millimetres (mm)</option><option value="cm" selected>Centimetres (cm)</option><option value="in">Inches (in)</option><option value="m">Metres (m)</option><option value="ft">Feet (ft)</option></select></div>' +
      '<div class="calc-field"><label for="tile-joint">Joint width (optional)</label><input id="tile-joint" type="number" min="0" step="any" placeholder="Your chosen joint"></div>' +
      '<div class="calc-field"><label for="tile-joint-unit">Joint unit</label><select id="tile-joint-unit"><option value="mm">Millimetres</option><option value="in">Inches</option></select></div>' +
      '</div>' +
      '<div class="calc-grid"><div class="calc-field"><label for="tile-type">Tile type</label><select id="tile-type"><option value="">Choose a tile type</option><option value="ceramic-tile">Ceramic tile</option><option value="porcelain-tile">Porcelain tile</option></select><small>Prices use your selected country and this tile type only.</small></div>' +
      '<div class="calc-field"><label id="tile-manual-price-label" for="tile-manual-price">Your material price per m² (optional)</label><input id="tile-manual-price" type="number" min="0.01" step="any" placeholder="Enter your local price"><small>Your price replaces the reference estimate. Use the currency shown for your selected country.</small></div>' +
      '<div class="calc-field"><label for="tile-currency">Currency code</label><input id="tile-currency" type="text" readonly value=""></div></div>' +
      '<details class="calc-advanced"><summary>Advanced: pack details and price (optional)</summary><div class="calc-grid"><div class="calc-field"><label for="tile-box-coverage">Box coverage (from product label)</label><input id="tile-box-coverage" type="number" min="0" step="any" placeholder="Enter label coverage"></div>' +
      '<div class="calc-field"><label for="tile-coverage-unit">Coverage unit on label</label><select id="tile-coverage-unit"><option value="m2">m²</option><option value="ft2">ft²</option></select></div>' +
      '<div class="calc-field"><label for="tile-pack-price">Your price per box</label><input id="tile-pack-price" type="number" min="0.01" step="any" placeholder="Enter price from the shop"></div></div><p class="wp-note">Box count uses label coverage only. The pack-price estimate is separate and does not replace the per-area material estimate.</p></details>' +
      '<p class="calc-error" id="tile-error" role="alert"></p><button class="calc-btn" type="submit">Calculate tile quantity and cost</button></form>' +
      '<div class="tool-result" id="tile-result" aria-live="polite"></div>' +
      '<p class="formula">Net area = total measured rectangular areas − opening area. Tile count uses your tile dimensions in the selected tile-size unit plus the joint width. Box count uses only the coverage you enter from the product label. Extra allowance is optional and never pre-filled. Material cost uses the selected exact-market tile reference or your own price per area. No default allowance, currency conversion, grout, mortar or installation cost is added.</p></section>';
    var sections = doc.getElementById("tile-sections"), count = 1, priceRecords = null, sharedRoomApplied = false;
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
        doc.getElementById("tile-error").textContent = "Open “Enter your room once” and press one of its “Use for…” buttons to share the room dimensions first.";
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
          tileLength: doc.getElementById("tile-length").value, tileWidth: doc.getElementById("tile-width").value, tileUnit: doc.getElementById("tile-size-unit").value,
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
        var areaUnit = result.lengthUnit === "ft" ? "sq ft" : "m²";
        var cost = estimateMaterialCost({ records: priceRecords, country: win && win.hpwRegion, subtype: doc.getElementById("tile-type").value,
          areaM2: result.adjustedAreaM2, areaFt2: result.adjustedAreaFt2, areaUnit: areaUnit,
          manualPrice: doc.getElementById("tile-manual-price").value, packPrice: doc.getElementById("tile-pack-price").value,
          boxes: result.boxes, now: new Date() });
        if (cost.areaCost) {
          var costTitle = doc.createElement("p"), costStrong = doc.createElement("strong");
          costStrong.textContent = cost.kind === "manual" ? "Your material cost for this area:" :
            (cost.displayOnly ? "Observed sample material cost for this area (display only; not a typical market range):" :
              "Observed sample material cost for this area:");
          costTitle.appendChild(costStrong); output.appendChild(costTitle);
          var total = cost.areaCost.low === cost.areaCost.high ? Currency.format(cost.areaCost.low, cost.currency) :
            Currency.format(cost.areaCost.low, cost.currency) + "–" + Currency.format(cost.areaCost.high, cost.currency);
          var costLine = doc.createElement("p");
          var pricedArea = areaUnit === "sq ft" ? result.adjustedAreaFt2 : result.adjustedAreaM2;
          costLine.textContent = total + " for " + fmt(pricedArea) + " " + areaUnit +
            (result.wastePercent ? " (includes your " + fmt(result.wastePercent) + "% extra allowance)" : " (no extra allowance added)") +
            (cost.kind === "manual" ? " (your price; replaces the reference range)." : " (approximate).");
          output.appendChild(costLine);
          if (cost.description) {
            var sourceLine = doc.createElement("p"), desc = cost.description;
            sourceLine.className = "wp-note";
            sourceLine.textContent = (cost.displayOnly ? "Display only — " : "") +
              (desc.sample ? "Based on " + desc.sample.count + " observed product listings; " + desc.sample.description + " " : "") +
              "Source: " + desc.sourceName + ", observed " + desc.observedAt + ", retrieved " + desc.retrievedAt +
              (desc.older ? " (older data)" : "") + ". " + (desc.caveats || "") + " " + (desc.notes || "") + " " + desc.disclaimer;
            if (desc.url && /^https:\/\//.test(desc.url)) {
              var sourceLink = doc.createElement("a"); sourceLink.href = desc.url; sourceLink.target = "_blank"; sourceLink.rel = "noopener";
              sourceLink.textContent = "Source page"; sourceLine.appendChild(doc.createTextNode(" ")); sourceLine.appendChild(sourceLink);
            }
            output.appendChild(sourceLine);
          }
        } else {
          var noPrice = doc.createElement("p"); noPrice.className = "wp-note";
          noPrice.textContent = cost.message || "No price is shown until a supported country and a source or your own price are available.";
          output.appendChild(noPrice);
        }
        if (doc.getElementById("tile-pack-price").value !== "") {
          var packLine = doc.createElement("p"); packLine.className = "wp-note";
          packLine.textContent = cost.packTotal !== null ? "Separate pack-price estimate: " + Currency.format(cost.packTotal, cost.currency) +
            " (" + cost.packCount + " boxes × " + Currency.format(Number(doc.getElementById("tile-pack-price").value), cost.currency) + " per box)." :
            (cost.packMessage || "Choose a country and enter box coverage to calculate the separate pack-price estimate.");
          output.appendChild(packLine);
        }
      } catch (err) { error.textContent = err.message; }
    });
    var touched = {};
    ["tile-size-unit", "tile-joint-unit", "tile-coverage-unit"].forEach(function (id) {
      doc.getElementById(id).addEventListener("change", function () { touched[id] = true; });
    });
    function filled(ids) {
      return ids.some(function (id) { return doc.getElementById(id).value !== ""; });
    }
    function applyUnitDefaults() {
      var d = defaultUnits(doc.getElementById("tile-unit").value);
      if (!d) return;
      if (!touched["tile-size-unit"] && !filled(["tile-length", "tile-width"])) doc.getElementById("tile-size-unit").value = d.tileUnit;
      if (!touched["tile-joint-unit"] && !filled(["tile-joint"])) doc.getElementById("tile-joint-unit").value = d.jointUnit;
      if (!touched["tile-coverage-unit"] && !filled(["tile-box-coverage"])) doc.getElementById("tile-coverage-unit").value = d.coverageUnit;
    }
    doc.getElementById("tile-unit").addEventListener("change", applyUnitDefaults);
    var useRoom = doc.getElementById("tile-use-room");
    useRoom.addEventListener("click", applyUnitDefaults);
    var manualLabel = doc.getElementById("tile-manual-price-label"), manualPrice = doc.getElementById("tile-manual-price");
    var packPriceField = doc.getElementById("tile-pack-price");
    var lastManualUnit = doc.getElementById("tile-unit").value;
    function syncCurrency(clearManual) {
      var code = Currency && Currency.codeForMarket ? Currency.codeForMarket(win && win.hpwRegion) : "";
      doc.getElementById("tile-currency").value = code;
      manualPrice.disabled = !code; packPriceField.disabled = !code;
      if (clearManual) {
        manualPrice.value = "";
        doc.getElementById("tile-pack-price").value = "";
        doc.getElementById("tile-result").textContent = "";
      }
    }
    function updateManualUnit() {
      var currentUnit = doc.getElementById("tile-unit").value;
      if (currentUnit !== lastManualUnit && manualPrice.value !== "") {
        manualPrice.value = "";
        doc.getElementById("tile-result").textContent = "";
      }
      lastManualUnit = currentUnit;
      if (manualLabel) manualLabel.textContent = "Your material price per " + (currentUnit === "ft" ? "ft²" : "m²") + " (optional)";
    }
    function applySharedRoom(room) {
      if (!room || !(Number(room.length) > 0) || !(Number(room.width) > 0)) return false;
      doc.getElementById("tile-unit").value = room.unit === "ft" ? "ft" : "m";
      var rows = sections.querySelectorAll(".tile-section");
      if (!rows.length) return false;
      rows[0].querySelector(".tile-length").value = room.length;
      rows[0].querySelector(".tile-width").value = room.width;
      Array.prototype.slice.call(rows, 1).forEach(function (r) { r.remove(); });
      count = 1; sharedRoomApplied = true;
      doc.getElementById("tile-room-note").hidden = false;
      applyUnitDefaults(); updateManualUnit();
      return true;
    }
    function syncSharedRoomFromFields() {
      var length = doc.getElementById("room-length"), width = doc.getElementById("room-width"), unit = doc.getElementById("room-unit");
      if (!length || !width || !unit) return;
      if (Number(length.value) > 0 && Number(width.value) > 0) {
        applySharedRoom({ length: length.value, width: width.value, unit: unit.value });
      } else if (sharedRoomApplied) {
        sections.querySelectorAll(".tile-section").forEach(function (row) {
          row.querySelector(".tile-length").value = ""; row.querySelector(".tile-width").value = "";
        });
        sharedRoomApplied = false; doc.getElementById("tile-room-note").hidden = true;
      }
    }
    doc.addEventListener("input", function (event) {
      if (event.target && /^(room-length|room-width|room-unit)$/.test(event.target.id || "")) syncSharedRoomFromFields();
    });
    doc.addEventListener("change", function (event) {
      if (event.target && /^(room-length|room-width|room-unit)$/.test(event.target.id || "")) syncSharedRoomFromFields();
    });
    if (win && win.addEventListener) {
      win.addEventListener("hpw-room", function () { applySharedRoom(win.hpwRoom); });
      win.addEventListener("hpw-region", function () { syncCurrency(true); });
    }
    doc.getElementById("tile-type").addEventListener("change", function () {
      manualPrice.value = ""; packPriceField.value = "";
      doc.getElementById("tile-result").textContent = "";
    });
    doc.getElementById("tile-unit").addEventListener("change", updateManualUnit);
    syncCurrency(false); updateManualUnit();
    if (win && win.hpwRoom) applySharedRoom(win.hpwRoom);
    if (win && typeof win.fetch === "function") {
      win.fetch("reference-prices.json", { cache: "no-cache" }).then(function (response) {
        return response && response.ok ? response.json() : null;
      }).then(function (records) { if (Array.isArray(records)) priceRecords = records; }).catch(function () {});
    }
    return { calculate: calculate, defaultUnits: defaultUnits, selectTileReference: selectTileReference, estimateMaterialCost: estimateMaterialCost,
      applySharedRoom: applySharedRoom };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { calculate: calculate, defaultUnits: defaultUnits, formatArea: formatArea, selectTileReference: selectTileReference, estimateMaterialCost: estimateMaterialCost, init: init };
}));
