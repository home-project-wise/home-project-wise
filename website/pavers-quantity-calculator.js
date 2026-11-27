"use strict";
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.PaversQuantity = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var EPS = 1e-10;
  function blank(v) { return v === "" || v === null || v === undefined; }
  function positive(v, label) {
    if (blank(v) || !Number.isFinite(Number(v)) || Number(v) <= 0) {
      throw new Error(label + " must be greater than zero.");
    }
    return Number(v);
  }
  function nonNegative(v, label) {
    if (blank(v) || !Number.isFinite(Number(v)) || Number(v) < 0) {
      throw new Error(label + " must be zero or greater. Enter 0 if none.");
    }
    return Number(v);
  }
  function ceilCount(value) {
    return Math.ceil(value - EPS * Math.max(1, Math.abs(value)));
  }
  function calculate(input) {
    input = input || {};
    if (input.unit !== "m" && input.unit !== "ft") {
      throw new Error("Choose metres or feet for all measurements.");
    }
    var paverLength = positive(input.paverLength, "Paver length");
    var paverWidth = positive(input.paverWidth, "Paver width");
    var joint = nonNegative(input.jointWidth, "Joint width");
    var moduleLength = paverLength + joint;
    var moduleWidth = paverWidth + joint;
    var moduleArea = moduleLength * moduleWidth;
    if (!Number.isFinite(moduleArea) || moduleArea <= 0) throw new Error("Check the paver dimensions and joint width.");
    if (!Array.isArray(input.sections) || input.sections.length === 0) {
      throw new Error("Add at least one measured rectangular patio section.");
    }
    var totalArea = 0, fieldArea = 0, borderArea = 0;
    var fieldPavers = 0, borderPavers = 0, details = [];
    input.sections.forEach(function (section, index) {
      var label = "Section " + (index + 1);
      var length = positive(section.length, label + " length");
      var width = positive(section.width, label + " width");
      var border = nonNegative(section.borderWidth, label + " border width");
      if (section.orientation !== "along-length" && section.orientation !== "along-width") {
        throw new Error(label + ": choose the paver direction.");
      }
      if (border * 2 >= length || border * 2 >= width) {
        if (border > 0) throw new Error(label + ": the border leaves no positive inner field. Reduce the border width.");
      }
      var innerLength = length - 2 * border;
      var innerWidth = width - 2 * border;
      var outerArea = length * width;
      var innerArea = innerLength * innerWidth;
      var sectionBorderArea = outerArea - innerArea;
      var runLength = section.orientation === "along-length" ? innerLength : innerWidth;
      var acrossWidth = section.orientation === "along-length" ? innerWidth : innerLength;
      var runPavers = ceilCount((runLength + joint) / (moduleLength));
      var acrossPavers = ceilCount((acrossWidth + joint) / (moduleWidth));
      var sectionFieldPavers = runPavers * acrossPavers;
      var sectionBorderPavers = sectionBorderArea > 0 ? ceilCount(sectionBorderArea / moduleArea) : 0;
      if (!Number.isSafeInteger(sectionFieldPavers) || !Number.isSafeInteger(sectionBorderPavers)) {
        throw new Error(label + ": the entered dimensions produce a quantity too large to calculate safely.");
      }
      totalArea += outerArea;
      fieldArea += innerArea;
      borderArea += sectionBorderArea;
      fieldPavers += sectionFieldPavers;
      borderPavers += sectionBorderPavers;
      details.push({
        section: index + 1, length: length, width: width, borderWidth: border,
        area: outerArea, fieldArea: innerArea, borderArea: sectionBorderArea,
        orientation: section.orientation, runPavers: runPavers, acrossPavers: acrossPavers,
        fieldPavers: sectionFieldPavers, borderPavers: sectionBorderPavers,
        totalPavers: sectionFieldPavers + sectionBorderPavers
      });
    });
    return {
      unit: input.unit, paverLength: paverLength, paverWidth: paverWidth,
      jointWidth: joint, moduleArea: moduleArea, totalArea: totalArea,
      fieldArea: fieldArea, borderArea: borderArea, fieldPavers: fieldPavers,
      borderPavers: borderPavers, totalPavers: fieldPavers + borderPavers,
      sections: details
    };
  }
  function format(value) {
    return Number(value).toLocaleString("en-US", { maximumFractionDigits: 3 });
  }
  function init(doc) {
    var form = doc.getElementById("pavers-form");
    if (!form) return null;
    var host = doc.getElementById("pavers-sections");
    var sequence = 1;
    var error = doc.getElementById("pavers-error");
    var result = doc.getElementById("pavers-result");
    function sectionMarkup(n) {
      return '<section class="fq-panel pv-section" data-section="' + n + '">' +
        '<div class="fq-run-head"><h3>Patio section ' + n + '</h3>' +
        (n > 1 ? '<button type="button" class="fq-small-button" data-remove-section>Remove section</button>' : '') + '</div>' +
        '<div class="fq-grid">' +
        '<div class="fq-field"><label for="pavers-length-' + n + '">Measured length</label><input id="pavers-length-' + n + '" class="pv-length" type="number" min="0" step="any" placeholder="Enter length"></div>' +
        '<div class="fq-field"><label for="pavers-width-' + n + '">Measured width</label><input id="pavers-width-' + n + '" class="pv-width" type="number" min="0" step="any" placeholder="Enter width"></div>' +
        '<div class="fq-field"><label for="pavers-border-' + n + '">Border width on each side</label><input id="pavers-border-' + n + '" class="pv-border" type="number" min="0" step="any" placeholder="Enter width; use 0 for no border"></div>' +
        '<div class="fq-field"><label for="pavers-direction-' + n + '">Paver direction</label><select id="pavers-direction-' + n + '" class="pv-direction"><option value="">Choose direction</option><option value="along-length">Paver length runs along section length</option><option value="along-width">Paver length runs along section width</option></select></div>' +
        '</div></section>';
    }
    function clearOutput() { error.textContent = ""; result.textContent = ""; }
    doc.getElementById("pavers-add-section").addEventListener("click", function () {
      sequence += 1;
      host.insertAdjacentHTML("beforeend", sectionMarkup(sequence));
      clearOutput();
    });
    host.addEventListener("click", function (event) {
      var button = event.target.closest("[data-remove-section]");
      if (!button) return;
      var section = button.closest(".pv-section");
      if (section && host.querySelectorAll(".pv-section").length > 1) {
        section.remove(); clearOutput();
      }
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault(); clearOutput();
      try {
        var sections = Array.prototype.map.call(host.querySelectorAll(".pv-section"), function (node) {
          return {
            length: node.querySelector(".pv-length").value,
            width: node.querySelector(".pv-width").value,
            borderWidth: node.querySelector(".pv-border").value,
            orientation: node.querySelector(".pv-direction").value
          };
        });
        var estimate = calculate({
          unit: doc.getElementById("pavers-unit").value,
          paverLength: doc.getElementById("pavers-length").value,
          paverWidth: doc.getElementById("pavers-paver-width").value,
          jointWidth: doc.getElementById("pavers-joint").value,
          sections: sections
        });
        var lines = estimate.sections.map(function (item) {
          return '<li>Section ' + item.section + ': ' + format(item.area) + ' ' + estimate.unit + '² total; ' +
            format(item.fieldArea) + ' ' + estimate.unit + '² field; ' +
            format(item.borderArea) + ' ' + estimate.unit + '² border; ' +
            item.fieldPavers + ' field pavers + ' + item.borderPavers + ' border paver equivalents.</li>';
        }).join("");
        result.innerHTML = '<h2>Paver quantity estimate</h2>' +
          '<p>Measured patio area: <strong>' + format(estimate.totalArea) + ' ' + estimate.unit + '²</strong></p>' +
          '<p>Inner field area: ' + format(estimate.fieldArea) + ' ' + estimate.unit + '²; border area: ' + format(estimate.borderArea) + ' ' + estimate.unit + '².</p>' +
          '<p>Field pavers: <strong>' + estimate.fieldPavers + '</strong></p>' +
          '<p>Border paver equivalents: <strong>' + estimate.borderPavers + '</strong></p>' +
          '<p>Total quantity estimate: <strong>' + estimate.totalPavers + ' pavers</strong></p>' +
          '<ul>' + lines + '</ul>' +
          '<p>Paver face size: ' + format(estimate.paverLength) + ' × ' + format(estimate.paverWidth) + ' ' + estimate.unit +
          '; joint width: ' + format(estimate.jointWidth) + ' ' + estimate.unit + '.</p>' +
          '<p>Border quantities are area-based full-paver equivalents using the same paver size. The calculator does not lay out a pattern, plan cuts, reuse offcuts or calculate a separate border product. Actual quantities can differ at edges and around curves.</p>';
      } catch (e) {
        error.textContent = e && e.message ? e.message : "Check the measurements and try again.";
      }
    });
    return { form: form, calculate: calculate };
  }
  return { calculate: calculate, init: init };
});
