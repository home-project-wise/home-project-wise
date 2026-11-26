(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWFenceQuantity = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var M_PER_FT = 0.3048;
  function positive(value, label) {
    if (value === "" || value === null || value === undefined) throw new Error(label + " is required.");
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be greater than zero.");
    return n;
  }
  function nonNegative(value, label) {
    if (value === "" || value === null || value === undefined) throw new Error(label + " is required.");
    var n = Number(value);
    if (!Number.isFinite(n) || n < 0) throw new Error(label + " must be zero or greater.");
    return n;
  }
  function whole(value, label, min) {
    var n = Number(value);
    if (!Number.isSafeInteger(n) || n < min) throw new Error(label + " must be a whole number of " + min + " or more.");
    return n;
  }
  function ceilCount(value) {
    return Math.ceil(value - Number.EPSILON * Math.max(1, Math.abs(value)) * 4);
  }
  function blank(v) { return v === "" || v === null || v === undefined; }
  function calculate(input) {
    if (!input || typeof input !== "object") throw new Error("Enter at least one measured straight run.");
    var unit = input.lengthUnit === "m" || input.lengthUnit === "ft" ? input.lengthUnit : null;
    if (!unit) throw new Error("Choose metres or feet for all run, spacing and product measurements.");
    var spacing = positive(input.postSpacing, "Your chosen post spacing");
    var runs = Array.isArray(input.runs) ? input.runs : [];
    if (!runs.length) throw new Error("Add at least one straight fence run.");
    var panelWidth = blank(input.panelWidth) ? null : positive(input.panelWidth, "Panel or board width");
    var piecesPerSpan = null, pieceLength = null, piecesIncomplete = false;
    var perSpanBlank = blank(input.piecesPerSpan), pieceLengthBlank = blank(input.pieceLength);
    if (!perSpanBlank || !pieceLengthBlank) {
      if (perSpanBlank || pieceLengthBlank) piecesIncomplete = true;
      else {
        piecesPerSpan = whole(input.piecesPerSpan, "Pieces per span", 1);
        pieceLength = positive(input.pieceLength, "Length of each piece");
      }
    }
    var spans = 0, netLength = 0, rawPosts = 0, terminalPosts = 0, linePosts = 0, panelCount = 0;
    var details = [], gateCount = 0;
    runs.forEach(function (run, runIndex) {
      var length = positive(run.length, "Run " + (runIndex + 1) + " length");
      var gates = Array.isArray(run.gates) ? run.gates.slice() : [];
      gates = gates.map(function (gate, gateIndex) {
        var offset = nonNegative(gate.offset, "Run " + (runIndex + 1) + " gate " + (gateIndex + 1) + " position");
        var width = positive(gate.width, "Run " + (runIndex + 1) + " gate " + (gateIndex + 1) + " opening width");
        if (offset + width > length + 1e-10) throw new Error("Run " + (runIndex + 1) + " gate " + (gateIndex + 1) + " extends beyond the measured run.");
        return { offset:offset, width:width };
      }).sort(function (a,b) { return a.offset - b.offset; });
      var cursor = 0, positions = [], terminals = [], runNet = length;
      function addPosition(list, value) {
        if (!list.some(function (v) { return Math.abs(v - value) <= 1e-9; })) list.push(value);
      }
      function addSegment(start, end, segmentIndex) {
        var segmentLength = end - start;
        if (segmentLength <= 1e-10) return;
        var bayCount = ceilCount(segmentLength / spacing);
        var actualSpacing = segmentLength / bayCount;
        spans += bayCount;
        if (panelWidth !== null) panelCount += ceilCount(segmentLength / panelWidth);
        for (var i = 0; i <= bayCount; i++) {
          var position = start + segmentLength * i / bayCount;
          addPosition(positions, position);
          if (i === 0 || i === bayCount) addPosition(terminals, position);
        }
        details.push({
          run:runIndex + 1, segment:segmentIndex, length:segmentLength,
          spans:bayCount, actualSpacing:actualSpacing
        });
      }
      gates.forEach(function (gate, gateIndex) {
        if (gate.offset < cursor - 1e-10) throw new Error("Gate openings on run " + (runIndex + 1) + " overlap. Enter separate, non-overlapping positions.");
        addSegment(cursor, gate.offset, gateIndex + 1);
        addPosition(positions, gate.offset); addPosition(positions, gate.offset + gate.width);
        addPosition(terminals, gate.offset); addPosition(terminals, gate.offset + gate.width);
        cursor = gate.offset + gate.width;
        runNet -= gate.width;
      });
      addSegment(cursor, length, gates.length + 1);
      netLength += runNet;
      gateCount += gates.length;
      rawPosts += positions.length;
      terminalPosts += terminals.length;
      linePosts += positions.filter(function (p) {
        return !terminals.some(function (t) { return Math.abs(t-p) <= 1e-9; });
      }).length;
    });
    var sharedCorners = null;
    if (runs.length === 1 && blank(input.sharedCorners)) sharedCorners = 0;
    else if (!blank(input.sharedCorners)) sharedCorners = whole(input.sharedCorners, "Shared corners", 0);
    if (sharedCorners !== null && sharedCorners > runs.length) {
      throw new Error("Shared corners cannot exceed the number of straight runs in this simple, non-branching layout.");
    }
    if (sharedCorners !== null && sharedCorners > terminalPosts - 2) {
      throw new Error("The shared-corner count exceeds the available run-end and gate-edge post positions.");
    }
    var posts = sharedCorners === null ? null : rawPosts - sharedCorners;
    if (posts !== null && posts < 1) throw new Error("The shared-corner deduction leaves no posts. Check the layout.");
    var pieces = piecesPerSpan === null || piecesIncomplete ? null : spans * piecesPerSpan;
    return {
      unit:unit, postSpacing:spacing, runCount:runs.length, gateCount:gateCount,
      netLength:netLength, spans:spans, rawPosts:rawPosts, terminalPosts:terminalPosts,
      linePosts:linePosts, sharedCorners:sharedCorners, posts:posts,
      panelWidth:panelWidth, panelCount:panelWidth === null ? null : panelCount,
      piecesPerSpan:piecesPerSpan, pieceLength:pieceLength, piecesIncomplete:piecesIncomplete,
      repeatedPieces:pieces, repeatedPiecesLength:pieces === null ? null : pieces * pieceLength,
      segments:details
    };
  }
  function fmt(n, digits) {
    return Number(n).toLocaleString("en-US", { maximumFractionDigits:digits === undefined ? 3 : digits });
  }
  function init(doc) {
    var form = doc.getElementById("fence-form");
    if (!form) return null;
    var runsHost = doc.getElementById("fence-runs"), runSeq = 1, gateSeq = 0;
    function addGate(runRow) {
      gateSeq += 1;
      var gate = doc.createElement("div"); gate.className = "fq-gate";
      gate.innerHTML =
        '<div class="fq-field"><label for="fq-gate-offset-' + gateSeq + '">Gate position from this run start (' + runSeq + ')</label><input id="fq-gate-offset-' + gateSeq + '" class="fq-gate-offset" type="number" min="0" step="any" placeholder="Distance to first gate post"></div>' +
        '<div class="fq-field"><label for="fq-gate-width-' + gateSeq + '">Clear gate opening width</label><input id="fq-gate-width-' + gateSeq + '" class="fq-gate-width" type="number" min="0" step="any" placeholder="Measured opening width"></div>' +
        '<button type="button" class="fq-small-button" data-remove-gate>Remove gate</button>';
      runRow.querySelector(".fq-gates").appendChild(gate);
    }
    function addRun() {
      runSeq += 1;
      var row = doc.createElement("section"); row.className = "fq-run";
      row.innerHTML =
        '<div class="fq-run-head"><h3>Straight run ' + runSeq + '</h3><button type="button" class="fq-small-button" data-remove-run>Remove run</button></div>' +
        '<div class="fq-field"><label for="fq-run-length-' + runSeq + '">Measured total run length</label><input id="fq-run-length-' + runSeq + '" class="fq-run-length" type="number" min="0" step="any" placeholder="Enter measured length"></div>' +
        '<div class="fq-gates"></div><button type="button" class="fq-small-button" data-add-gate>Add gate opening to this run</button>';
      runsHost.appendChild(row);
      return row;
    }
    runsHost.addEventListener("click", function (event) {
      var target = event.target;
      if (target.closest("[data-remove-run]")) {
        var row = target.closest(".fq-run");
        if (row && runsHost.querySelectorAll(".fq-run").length > 1) row.remove();
      } else if (target.closest("[data-add-gate]")) addGate(target.closest(".fq-run"));
      else if (target.closest("[data-remove-gate]")) {
        var gate = target.closest(".fq-gate"); if (gate) gate.remove();
      }
    });
    doc.getElementById("fence-add-run").addEventListener("click", addRun);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var error = doc.getElementById("fence-error"), output = doc.getElementById("fence-result");
      error.textContent = ""; output.textContent = "";
      try {
        var input = {
          lengthUnit:doc.getElementById("fence-unit").value,
          postSpacing:doc.getElementById("fence-spacing").value,
          panelWidth:doc.getElementById("fence-panel-width").value,
          sharedCorners:doc.getElementById("fence-shared-corners").value,
          piecesPerSpan:doc.getElementById("fence-pieces-per-span").value,
          pieceLength:doc.getElementById("fence-piece-length").value,
          runs:Array.from(runsHost.querySelectorAll(".fq-run")).map(function (row) {
            return {
              length:row.querySelector(".fq-run-length").value,
              gates:Array.from(row.querySelectorAll(".fq-gate")).map(function (gate) {
                return { offset:gate.querySelector(".fq-gate-offset").value, width:gate.querySelector(".fq-gate-width").value };
              })
            };
          })
        };
        var r = calculate(input), unit = r.unit === "ft" ? "ft" : "m";
        function line(value, strong) {
          var p = doc.createElement("p");
          if (strong) { var b = doc.createElement("strong"); b.textContent = value; p.appendChild(b); }
          else p.textContent = value;
          output.appendChild(p);
        }
        var gross = r.netLength;
        r.segments.forEach(function (s) { /* details are emitted below without reconstructing gross run geometry */ });
        line("Net fenced length after gate openings: " + fmt(r.netLength) + " " + unit + ".", true);
        r.segments.forEach(function (s) {
          line("Run " + s.run + ", fenced segment " + s.segment + ": " + fmt(s.length) + " " + unit + " ÷ " +
            fmt(r.postSpacing) + " " + unit + " chosen spacing = " + s.spans + " spans; equalised spacing " +
            fmt(s.actualSpacing) + " " + unit + ".");
        });
        line("Total spans: " + r.spans + ". Each uninterrupted segment is rounded up separately; its length is divided evenly across those spans, so the displayed spacing does not exceed your chosen spacing.", true);
        if (r.posts === null) {
          line("Post count not calculated: enter how many shared corners join two of your measured runs using one physical post. Each run end is otherwise counted separately.");
        } else {
          line("Post count: " + r.posts + " (" + (r.terminalPosts - r.sharedCorners) + " run-end / gate-edge positions + " +
            r.linePosts + " intermediate line posts; " + r.sharedCorners + " shared-corner duplicate(s) removed).", true);
        }
        if (r.panelCount !== null) line("Panel quantity estimate: " + r.panelCount + " panels using your entered " + fmt(r.panelWidth) + " " + unit + " panel width. Each uninterrupted segment is rounded up separately; this does not verify fixed-panel fit or a manufacturer layout.");
        else line("No panel quantity calculated. Enter the actual panel width only if you are using panels.");
        if (r.repeatedPieces !== null) line("Repeated rails / boards estimate: " + r.repeatedPieces + " pieces (" + r.piecesPerSpan + " per span × " + r.spans + " spans), each " + fmt(r.pieceLength) + " " + unit + " long; total entered piece length " + fmt(r.repeatedPiecesLength) + " " + unit + ".");
        else if (r.piecesIncomplete) line("Rails / boards not calculated: enter both a whole-number pieces-per-span count and the length of each piece. No count is assumed.");
        else line("No rails / boards count calculated. Enter pieces per span and piece length if you want this separate estimate.");
        line("Counting rule: both ends of every straight fenced segment are posts; the two edges of each gate opening are gate-post positions; a shared corner between two runs is deducted once only when you enter it. Complex branching junctions are not modelled.");
        line("This is a quantity calculation from your measurements and chosen spacing, not a fence design. It does not assess post size, foundations, concrete, fence height, wind, frost, boundaries, permits, materials or code requirements.");
      } catch (e) { error.textContent = e && e.message ? e.message : "Check the measurements and try again."; }
    });
    return { addRun:addRun };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document);
  return { calculate:calculate, init:init };
}));