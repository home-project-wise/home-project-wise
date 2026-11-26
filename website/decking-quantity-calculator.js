"use strict";
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.DeckingQuantity = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var EPS = 1e-9;
  function blank(v) { return v === "" || v === null || v === undefined; }
  function positive(v, label) {
    if (blank(v) || !Number.isFinite(Number(v)) || Number(v) <= 0) throw new Error(label + " must be greater than zero.");
    return Number(v);
  }
  function nonNegative(v, label) {
    if (blank(v) || !Number.isFinite(Number(v)) || Number(v) < 0) throw new Error(label + " must be zero or greater. Enter 0 if none.");
    return Number(v);
  }
  function calculate(input) {
    input = input || {};
    if (input.unit !== "m" && input.unit !== "ft") throw new Error("Choose metres or feet for all measurements.");
    var boardWidth = positive(input.boardWidth, "Actual board face width");
    var gap = nonNegative(input.boardGap, "Gap between boards");
    var stockLength = positive(input.stockLength, "Stock board length");
    var waste = blank(input.wastePercent) ? 0 : nonNegative(input.wastePercent, "Extra allowance");
    if (waste > 100) throw new Error("Extra allowance must be between 0% and 100%.");
    if (!Array.isArray(input.sections) || input.sections.length === 0) throw new Error("Add at least one measured rectangular deck section.");
    var totalArea = 0, baseBoards = 0, details = [];
    input.sections.forEach(function (section, index) {
      var label = "Section " + (index + 1);
      var length = positive(section.length, label + " length");
      var width = positive(section.width, label + " width");
      var edge = nonNegative(section.edgeClearance, label + " edge clearance per side");
      if (section.orientation !== "along-length" && section.orientation !== "along-width") {
        throw new Error(label + ": choose whether boards run along the length or width.");
      }
      var runLength = section.orientation === "along-length" ? length : width;
      var acrossWidth = section.orientation === "along-length" ? width : length;
      var usableWidth = acrossWidth - 2 * edge;
      if (usableWidth <= EPS) throw new Error(label + ": edge clearance leaves no usable board width.");
      var rows = Math.ceil((usableWidth + gap - EPS) / (boardWidth + gap));
      var boardsPerRow = Math.ceil((runLength - EPS) / stockLength);
      if (rows < 1 || boardsPerRow < 1) throw new Error(label + ": check the entered dimensions and board details.");
      var boards = rows * boardsPerRow;
      totalArea += length * width;
      baseBoards += boards;
      details.push({
        section: index + 1, length: length, width: width, area: length * width,
        orientation: section.orientation, runLength: runLength, acrossWidth: acrossWidth,
        edgeClearance: edge, usableWidth: usableWidth, rows: rows,
        boardsPerRow: boardsPerRow, boards: boards
      });
    });
    var extraBoards = waste > 0 ? Math.ceil(baseBoards * waste / 100 - EPS) : 0;
    return {
      unit: input.unit, boardWidth: boardWidth, boardGap: gap, stockLength: stockLength,
      wastePercent: waste, totalArea: totalArea, baseBoards: baseBoards,
      extraBoards: extraBoards, totalBoards: baseBoards + extraBoards, sections: details
    };
  }
  function format(value) {
    return Number(value).toLocaleString("en-US", { maximumFractionDigits: 3 });
  }
  function init(doc) {
    var form = doc.getElementById("deck-form");
    if (!form) return null;
    var sectionsHost = doc.getElementById("deck-sections");
    var sequence = 1;
    var error = doc.getElementById("deck-error");
    var result = doc.getElementById("deck-result");
    function sectionMarkup(n) {
      return '<section class="fq-panel dk-section" data-section="' + n + '">' +
        '<h3>Deck section ' + n + '</h3>' +
        '<div class="fq-field"><label for="deck-length-' + n + '">Measured length (' + n + ')</label><input id="deck-length-' + n + '" class="dk-length" type="number" min="0" step="any" placeholder="Enter the measured length"></div>' +
        '<div class="fq-field"><label for="deck-width-' + n + '">Measured width (' + n + ')</label><input id="deck-width-' + n + '" class="dk-width" type="number" min="0" step="any" placeholder="Enter the measured width"></div>' +
        '<div class="fq-field"><label for="deck-orientation-' + n + '">Board direction</label><select id="deck-orientation-' + n + '" class="dk-orientation"><option value="">Choose direction</option><option value="along-length">Boards run along this section length</option><option value="along-width">Boards run along this section width</option></select></div>' +
        '<div class="fq-field"><label for="deck-edge-' + n + '">Edge clearance at each side (' + n + ')</label><input id="deck-edge-' + n + '" class="dk-edge" type="number" min="0" step="any" placeholder="Enter clearance; use 0 if flush"></div>' +
        (n > 1 ? '<button type="button" class="fq-small-button" data-remove-section>Remove section</button>' : '') +
        '</section>';
    }
    function clearOutput() {
      error.textContent = "";
      result.hidden = true;
      result.textContent = "";
    }
    doc.getElementById("deck-add-section").addEventListener("click", function () {
      sequence += 1;
      sectionsHost.insertAdjacentHTML("beforeend", sectionMarkup(sequence));
      clearOutput();
    });
    sectionsHost.addEventListener("click", function (event) {
      var button = event.target.closest("[data-remove-section]");
      if (!button) return;
      var section = button.closest(".dk-section");
      if (section && sectionsHost.querySelectorAll(".dk-section").length > 1) {
        section.remove();
        clearOutput();
      }
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearOutput();
      try {
        var sections = Array.prototype.map.call(sectionsHost.querySelectorAll(".dk-section"), function (node, index) {
          return {
            length: node.querySelector(".dk-length").value,
            width: node.querySelector(".dk-width").value,
            orientation: node.querySelector(".dk-orientation").value,
            edgeClearance: node.querySelector(".dk-edge").value
          };
        });
        var estimate = calculate({
          unit: doc.getElementById("deck-unit").value,
          boardWidth: doc.getElementById("deck-board-width").value,
          boardGap: doc.getElementById("deck-board-gap").value,
          stockLength: doc.getElementById("deck-stock-length").value,
          wastePercent: doc.getElementById("deck-waste").value,
          sections: sections
        });
        var lines = estimate.sections.map(function (item) {
          return '<li>Section ' + item.section + ': ' + item.rows + ' rows × ' + item.boardsPerRow +
            ' stock boards per row = ' + item.boards + ' boards (' + format(item.area) + ' ' +
            estimate.unit + '²; boards run along ' + (item.orientation === "along-length" ? "length" : "width") + ').</li>';
        }).join("");
        result.innerHTML = '<h2>Deck-board quantity estimate</h2>' +
          '<p>Measured surface area: <strong>' + format(estimate.totalArea) + ' ' + estimate.unit + '²</strong></p>' +
          '<p>Base stock boards before extra allowance: <strong>' + estimate.baseBoards + '</strong></p>' +
          (estimate.wastePercent > 0
            ? '<p>Visitor-selected extra allowance: ' + format(estimate.wastePercent) + '% (' + estimate.extraBoards + ' extra boards).</p>'
            : '<p>No extra allowance added.</p>') +
          '<p>Total stock boards: <strong>' + estimate.totalBoards + '</strong></p>' +
          '<ul>' + lines + '</ul>' +
          '<p>Board face width: ' + format(estimate.boardWidth) + ' ' + estimate.unit +
          '; gap between boards: ' + format(estimate.boardGap) + ' ' + estimate.unit +
          '; stock length: ' + format(estimate.stockLength) + ' ' + estimate.unit + '.</p>' +
          '<p>Rows start and finish at the entered edge clearance. Stock-board counts are rounded up per row; offcuts are not reused between rows or sections.</p>';
        result.hidden = false;
      } catch (e) {
        error.textContent = e && e.message ? e.message : "Check the measurements and try again.";
      }
    });
    return { form: form, calculate: calculate };
  }
  return { calculate: calculate, init: init };
});
