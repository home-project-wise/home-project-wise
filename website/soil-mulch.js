/* Mulch and garden-soil quantity estimator. Quantity only: no prices, density assumptions or hidden allowance. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWSoilMulch = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var M_PER_FT = 0.3048, L_PER_M3 = 1000, FT3_PER_M3 = 35.3146667215, YD3_PER_M3 = 1.3079506193;
  function positive(v, name) {
    var n = Number(v);
    if (!Number.isFinite(n) || n <= 0) throw new Error(name + " must be greater than zero.");
    return n;
  }
  function calculate(input) {
    if (!input || !Array.isArray(input.sections) || !input.sections.length) throw new Error("Add at least one rectangular bed area.");
    var unit = input.lengthUnit === "ft" ? "ft" : input.lengthUnit === "m" ? "m" : null;
    if (!unit) throw new Error("Choose metres or feet for bed dimensions.");
    var depthUnit = input.depthUnit === "in" ? "in" : input.depthUnit === "cm" ? "cm" : null;
    if (!depthUnit) throw new Error("Choose centimetres or inches for application depth.");
    var areaM2 = input.sections.reduce(function (sum, section, index) {
      var length = positive(section.length, "Section " + (index + 1) + " length");
      var width = positive(section.width, "Section " + (index + 1) + " width");
      var factor = unit === "ft" ? M_PER_FT : 1;
      return sum + length * factor * width * factor;
    }, 0);
    var depth = positive(input.depth, "Application depth");
    var depthM = depth * (depthUnit === "in" ? 0.0254 : 0.01);
    var volumeM3 = areaM2 * depthM;
    if (!Number.isFinite(volumeM3) || volumeM3 <= 0) throw new Error("The calculated volume is outside the supported range.");
    var result = {
      material: ["mulch", "topsoil", "raised-bed-mix", "compost"].indexOf(input.material) >= 0 ? input.material : null,
      areaM2: areaM2, areaFt2: areaM2 * 10.7639104167,
      depthM: depthM, volumeM3: volumeM3, volumeFt3: volumeM3 * FT3_PER_M3,
      volumeYd3: volumeM3 * YD3_PER_M3, bags: null
    };
    if (!result.material) throw new Error("Choose mulch, topsoil, raised-bed mix or compost.");
    if (input.bagVolume !== "" && input.bagVolume !== null && input.bagVolume !== undefined) {
      var bag = positive(input.bagVolume, "Bag volume");
      var bagUnit = input.bagUnit;
      var bagM3 = bagUnit === "L" ? bag / L_PER_M3 : bagUnit === "ft3" ? bag / FT3_PER_M3 : bagUnit === "yd3" ? bag / YD3_PER_M3 : NaN;
      if (!Number.isFinite(bagM3) || bagM3 <= 0) throw new Error("Choose a valid bag-volume unit: litres, cubic feet or cubic yards.");
      result.bags = Math.ceil(volumeM3 / bagM3 - 1e-12);
      result.bagVolumeM3 = bagM3;
    }
    return result;
  }
  function init(doc, win) {
    var host = doc.getElementById("soil-mulch-root");
    if (!host) return null;
    host.innerHTML =
      '<section class="wp-room" aria-labelledby="soil-mulch-title"><h3 id="soil-mulch-title">Mulch and garden-soil quantity</h3>' +
      '<p class="wp-note">Work out volume from measured bed areas and the depth you choose. No prices or extra allowance are added.</p>' +
      '<form class="calc" id="soil-mulch-form" novalidate>' +
      '<div class="calc-grid"><div class="calc-field"><label for="soil-material">Material</label><select id="soil-material"><option value="mulch">Mulch</option><option value="topsoil">Topsoil</option><option value="raised-bed-mix">Raised-bed mix</option><option value="compost">Compost</option></select></div>' +
      '<div class="calc-field"><label for="soil-length-unit">Bed dimensions</label><select id="soil-length-unit"><option value="m">Metres</option><option value="ft">Feet</option></select></div></div>' +
      '<div id="soil-sections"><div class="calc-grid soil-section"><div class="calc-field"><label>Bed section 1 length</label><input class="soil-length" type="number" min="0" step="any" required></div><div class="calc-field"><label>Bed section 1 width</label><input class="soil-width" type="number" min="0" step="any" required></div></div></div>' +
      '<p><button type="button" class="wp-btn" id="soil-add-section">Add another rectangular section</button> <button type="button" class="wp-btn" id="soil-use-room">Use shared room length and width</button></p>' +
      '<div class="calc-grid"><div class="calc-field"><label for="soil-depth">Application depth</label><input id="soil-depth" type="number" min="0" step="any" required placeholder="Enter your chosen depth"></div>' +
      '<div class="calc-field"><label for="soil-depth-unit">Depth unit</label><select id="soil-depth-unit"><option value="cm">Centimetres</option><option value="in">Inches</option></select></div>' +
      '<div class="calc-field"><label for="soil-bag-volume">Bag volume (optional, from product label)</label><input id="soil-bag-volume" type="number" min="0" step="any" placeholder="Enter label volume"></div>' +
      '<div class="calc-field"><label for="soil-bag-unit">Bag volume unit</label><select id="soil-bag-unit"><option value="L">Litres</option><option value="ft3">Cubic feet</option><option value="yd3">Cubic yards</option></select></div></div>' +
      '<p class="calc-error" id="soil-mulch-error" role="alert"></p><button class="calc-btn" type="submit">Calculate material volume</button></form>' +
      '<div class="tool-result" id="soil-mulch-result" aria-live="polite"></div>' +
      '<p class="formula">Volume = total measured bed area × chosen depth. 1 cubic yard = 27 cubic feet. Bag count is rounded up using only the volume you enter from the product label. No density, settling, waste or depth recommendation is assumed.</p></section>';
    var form = doc.getElementById("soil-mulch-form"), sections = doc.getElementById("soil-sections"), count = 1;
    function addSection(length, width) {
      count += 1;
      var row = doc.createElement("div"); row.className = "calc-grid soil-section";
      row.innerHTML = '<div class="calc-field"><label for="soil-length-' + count + '">Bed section ' + count + ' length</label><input id="soil-length-' + count + '" class="soil-length" type="number" min="0" step="any" required></div><div class="calc-field"><label for="soil-width-' + count + '">Bed section ' + count + ' width</label><input id="soil-width-' + count + '" class="soil-width" type="number" min="0" step="any" required></div><div class="calc-field"><button type="button" class="wp-btn soil-remove">Remove section</button></div>';
      if (length !== undefined) row.querySelector(".soil-length").value = length;
      if (width !== undefined) row.querySelector(".soil-width").value = width;
      sections.appendChild(row);
    }
    doc.getElementById("soil-add-section").addEventListener("click", function () { addSection(); });
    doc.getElementById("soil-use-room").addEventListener("click", function () {
      var room = win && win.hpwRoom;
      if (!room || !(Number(room.length) > 0) || !(Number(room.width) > 0)) {
        doc.getElementById("soil-mulch-error").textContent = "Enter a valid room length and width in “Enter your room once” first.";
        return;
      }
      doc.getElementById("soil-length-unit").value = room.unit === "ft" ? "ft" : "m";
      var rows = sections.querySelectorAll(".soil-section");
      rows[0].querySelector(".soil-length").value = room.length;
      rows[0].querySelector(".soil-width").value = room.width;
      Array.prototype.slice.call(rows, 1).forEach(function (r) { r.remove(); });
      count = 1;
      doc.getElementById("soil-mulch-error").textContent = "";
    });
    sections.addEventListener("click", function (event) {
      var button = event.target && event.target.closest ? event.target.closest(".soil-remove") : null;
      if (!button) return;
      var row = button.closest(".soil-section");
      if (sections.querySelectorAll(".soil-section").length > 1) row.remove();
      Array.prototype.forEach.call(sections.querySelectorAll(".soil-section"), function (r, i) {
        r.querySelectorAll("label")[0].textContent = "Bed section " + (i + 1) + " length";
        r.querySelectorAll("label")[1].textContent = "Bed section " + (i + 1) + " width";
        r.querySelectorAll("label")[0].htmlFor = "soil-length-" + (i + 1);
        r.querySelectorAll("label")[1].htmlFor = "soil-width-" + (i + 1);
        r.querySelector(".soil-length").id = "soil-length-" + (i + 1);
        r.querySelector(".soil-width").id = "soil-width-" + (i + 1);
      });
      count = sections.querySelectorAll(".soil-section").length;
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var error = doc.getElementById("soil-mulch-error"), output = doc.getElementById("soil-mulch-result");
      error.textContent = ""; output.textContent = "";
      try {
        var lengths = sections.querySelectorAll(".soil-length"), widths = sections.querySelectorAll(".soil-width"), data = [];
        for (var i = 0; i < lengths.length; i++) data.push({ length: lengths[i].value, width: widths[i].value });
        var result = calculate({ material: doc.getElementById("soil-material").value, lengthUnit: doc.getElementById("soil-length-unit").value,
          sections: data, depth: doc.getElementById("soil-depth").value, depthUnit: doc.getElementById("soil-depth-unit").value,
          bagVolume: doc.getElementById("soil-bag-volume").value, bagUnit: doc.getElementById("soil-bag-unit").value });
        var fmt = function (n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 3 }); };
        var title = doc.createElement("p"), strong = doc.createElement("strong");
        strong.textContent = result.material.replace(/-/g, " ") + ": " + fmt(result.volumeM3) + " m³";
        title.appendChild(strong); output.appendChild(title);
        var detail = doc.createElement("p");
        detail.textContent = "Bed area: " + fmt(result.areaM2) + " m² (" + fmt(result.areaFt2) + " ft²). Volume: " + fmt(result.volumeFt3) + " ft³ (" + fmt(result.volumeYd3) + " yd³).";
        output.appendChild(detail);
        var bag = doc.createElement("p");
        bag.textContent = result.bags === null ? "Bag count not calculated: enter the volume printed on your bag label if you need a bag estimate." :
          "Estimated quantity: " + result.bags + " bag(s), using the entered label volume only.";
        output.appendChild(bag);
      } catch (err) { error.textContent = err.message; }
    });
    return { calculate: calculate };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { calculate: calculate, init: init };
}));
