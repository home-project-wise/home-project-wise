/* Room-to-Ready Stage A browser adapter. All calculations remain in room-to-ready.js and
 * project-estimator-engine.js. Registry data is read-only and all visitor choices stay in memory.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWRoomToReadyUI = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function init(doc, win, opts) {
    var host = doc.getElementById("room-plan-root");
    var Model = (opts && opts.model) || win.HPWRoomToReady;
    var Engine = (opts && opts.estimator) || win.HPWProjectEstimator;
    var RP = (opts && opts.rp) || win.HPWReferencePrices;
    var Paint = (opts && opts.paint) || win.HPWPaintReference;
    var Wallpaper = (opts && opts.wallpaper) || win.HPWWallpaperReference;
    if (!host || !Model || !Engine || !RP || !Paint || !Wallpaper) return null;
    var state = { flooring: null, assumptions: null };
    host.innerHTML =
      '<section class="wp-room" aria-labelledby="room-plan-title">' +
      '<h3 id="room-plan-title">Room-to-Ready plan</h3>' +
      '<p class="wp-note">Use the room you entered above. Choose the work you plan to do; this combines only selected materials and keeps unknown costs visible.</p>' +
      '<form class="calc" id="room-plan-form" novalidate>' +
      '<label class="wp-check"><input id="plan-flooring" type="checkbox"> Include flooring</label>' +
      '<div class="calc-field"><label for="plan-floor-type">Floor type</label><select id="plan-floor-type"><option value="">Choose a type</option></select></div>' +
      '<div class="calc-field"><label for="plan-wall-finish">Wall finish</label><select id="plan-wall-finish"><option value="none">No wall finish selected</option><option value="paint">Paint</option><option value="wallpaper">Wallpaper</option></select></div>' +
      '<div class="calc-field" id="plan-coats-field" hidden><label for="plan-paint-coats">Paint coats</label><select id="plan-paint-coats"><option value="1">1 coat</option><option value="2" selected>2 coats</option></select></div>' +
      '<p class="calc-error" id="room-plan-error" role="alert"></p><button class="calc-btn" type="submit">Build room plan</button>' +
      '</form><div class="tool-result" id="room-plan-result" aria-live="polite"></div>' +
      '</section>';
    var form = doc.getElementById("room-plan-form");
    var floorType = doc.getElementById("plan-floor-type");
    var wallFinish = doc.getElementById("plan-wall-finish");
    var coatsField = doc.getElementById("plan-coats-field");
    var error = doc.getElementById("room-plan-error");
    var output = doc.getElementById("room-plan-result");
    function region() { return win.hpwRegion || ""; }
    function currencyFor(market) { return Model.MARKET_CURRENCY[market] || ""; }
    function money(n, cur) {
      try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n); }
      catch (e) { return cur + " " + Number(n).toFixed(2); }
    }
    function clearOutput() { output.textContent = ""; error.textContent = ""; }
    function fillFloorTypes() {
      var market = region();
      var choices = state.flooring && market ? RP.flooringOptions(state.flooring, market) : [];
      floorType.innerHTML = '<option value="">Choose a type</option>' + choices.map(function (s) {
        return '<option value="' + String(s).replace(/[&<>"']/g, "") + '">' + (RP.SUBTYPE_LABEL[s] || s) + '</option>';
      }).join("");
      if (doc.getElementById("plan-flooring").checked && !choices.length) {
        floorType.disabled = true;
      } else floorType.disabled = false;
    }
    function sourceFor(record, label, market) {
      return { id: record.id, name: label, geography: market, geographyResolution: "national", observedAt: record.observedAt };
    }
    function paintPrice(market) {
      if (!state.assumptions) return null;
      var p = Paint.pick(state.assumptions, market);
      if (!p) return null;
      return { kind: "editorial-range", currency: p.cost.currency, unit: "m²/coat",
        low: p.cost.low, high: p.cost.high,
        source: sourceFor(p.cost, "Approved interior paint sample range", market) };
    }
    function wallpaperPrice(market) {
      if (!state.assumptions) return null;
      var p = Wallpaper.pick(state.assumptions, market);
      if (!p) return null;
      return { kind: "editorial-range", currency: p.record.currency, unit: "m²",
        low: p.record.low, high: p.record.high,
        source: sourceFor(p.record, "Approved wallpaper sample range", market) };
    }
    function render(plan) {
      output.textContent = "";
      var h = doc.createElement("p");
      var strong = doc.createElement("strong");
      strong.textContent = "Known material subtotal: " + (plan.estimate.pricedLineCount
        ? money(plan.knownMaterialSubtotal.low, plan.currency) + "–" + money(plan.knownMaterialSubtotal.high, plan.currency)
        : "No priced items yet");
      h.appendChild(strong); output.appendChild(h);
      var areas = doc.createElement("p");
      areas.textContent = "Floor area: " + plan.areas.floorM2.toFixed(2) + " m². " +
        (plan.areas.wallAreaKnown ? "Net wall area: " + plan.areas.wallNetM2.toFixed(2) + " m²." :
          "Wall area is not measured because wall height is missing.");
      output.appendChild(areas);
      var list = doc.createElement("ul");
      plan.estimate.lineItems.forEach(function (item) {
        var li = doc.createElement("li");
        li.textContent = item.name + ": " + money(item.totalLow, plan.currency) +
          (item.totalLow === item.totalHigh ? "" : "–" + money(item.totalHigh, plan.currency));
        if (item.source) li.textContent += " — " + item.source.name + " (observed " + item.source.observedAt + ")";
        list.appendChild(li);
      });
      plan.unknownRequired.forEach(function (item) {
        var li = doc.createElement("li"); li.textContent = item.name + ": price or measurement needed; not included as zero.";
        list.appendChild(li);
      });
      if (list.children.length) output.appendChild(list);
      var note = doc.createElement("p"); note.className = "wp-note"; note.textContent = plan.disclaimer; output.appendChild(note);
      var energy = doc.createElement("p"); energy.className = "wp-note";
      energy.textContent = "Electricity running cost is separate and is not included in this one-time materials subtotal. See the Electricity tab for usage cost.";
      output.appendChild(energy);
    }
    form.addEventListener("change", function (event) {
      if (event.target && event.target.id === "plan-wall-finish") coatsField.hidden = event.target.value !== "paint";
      if (event.target && event.target.id === "plan-flooring") fillFloorTypes();
      clearOutput();
    });
    form.addEventListener("submit", function (event) {
      if (event.preventDefault) event.preventDefault();
      clearOutput();
      var market = region(), room = win.hpwRoom;
      if (!room) { error.textContent = "Enter your room above and use one of the room buttons first. Your measurements are kept in this browser only."; return; }
      if (!market) { error.textContent = "Choose your country at the top before building a plan."; return; }
      var flooring = null;
      if (doc.getElementById("plan-flooring").checked) {
        var subtype = floorType.value;
        if (!subtype) { error.textContent = "Choose a floor type, or untick Include flooring."; return; }
        var selected = state.flooring ? RP.select(state.flooring, { country: market, category: "flooring", subtype: subtype }) : null;
        var price = selected && selected.ok ? RP.toEngineAreaPrice(selected.record, "m²") : null;
        flooring = { price: price };
      }
      var finish = wallFinish.value;
      var input = { market: market, room: room, flooring: flooring, wallFinish: finish };
      if (finish === "paint") { input.paintCoats = Number(doc.getElementById("plan-paint-coats").value); input.paintPrice = paintPrice(market); }
      if (finish === "wallpaper") input.wallpaperPrice = wallpaperPrice(market);
      try { render(Model.buildPlan(input, Engine)); }
      catch (e) { error.textContent = e && e.message ? e.message : "The room plan could not be calculated."; }
    });
    if (win && win.addEventListener) win.addEventListener("hpw-region", function () { fillFloorTypes(); clearOutput(); });
    if (win && typeof win.fetch === "function") {
      win.fetch("reference-prices.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; })
        .then(function (records) { if (Array.isArray(records)) { state.flooring = records; fillFloorTypes(); } }).catch(function () {});
      win.fetch("reference-assumptions.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; })
        .then(function (file) { if (file && Array.isArray(file.records)) state.assumptions = file; }).catch(function () {});
    }
    fillFloorTypes();
    return { state: state, build: function () { form.dispatchEvent(new win.Event("submit", { bubbles: true, cancelable: true })); } };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined") init(document, window);
  return { init: init };
}));
