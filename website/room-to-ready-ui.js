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
      '<div class="calc-field"><label for="plan-floor-type">Floor type (for a reference range)</label><select id="plan-floor-type"><option value="">Choose a type</option></select></div>' +
      '<div class="calc-field" id="plan-floor-price-field" hidden><label for="plan-floor-price">Your price per m² (optional)</label><input id="plan-floor-price" type="number" min="0" step="any" placeholder="Enter a price you confirmed"></div>' +
      '<div class="calc-field"><label for="plan-wall-finish">Wall finish</label><select id="plan-wall-finish"><option value="none">No wall finish selected</option><option value="paint">Paint</option><option value="wallpaper">Wallpaper</option></select></div>' +
      '<div class="calc-field" id="plan-wall-price-field" hidden><label id="plan-wall-price-label" for="plan-wall-price">Your price (optional)</label><input id="plan-wall-price" type="number" min="0" step="any" placeholder="Enter a price you confirmed"></div>' +
      '<div class="calc-field" id="plan-coats-field" hidden><label for="plan-paint-coats">Paint coats</label><select id="plan-paint-coats"><option value="1">1 coat</option><option value="2" selected>2 coats</option></select></div>' +
      '<p class="calc-error" id="room-plan-error" role="alert"></p><button class="calc-btn" type="submit">Build room plan</button>' +
      '</form><div class="tool-result" id="room-plan-result" aria-live="polite"></div>' +
      '</section>';
    var form = doc.getElementById("room-plan-form");
    var floorType = doc.getElementById("plan-floor-type");
    var wallFinish = doc.getElementById("plan-wall-finish");
    var coatsField = doc.getElementById("plan-coats-field");
    var floorPriceField = doc.getElementById("plan-floor-price-field");
    var wallPriceField = doc.getElementById("plan-wall-price-field");
    var wallPriceLabel = doc.getElementById("plan-wall-price-label");
    var floorPriceLabel = floorPriceField.querySelector("label");
    var error = doc.getElementById("room-plan-error");
    var output = doc.getElementById("room-plan-result");
    function region() { return win.hpwRegion || ""; }
    function currencyFor(market) { return Model.MARKET_CURRENCY[market] || ""; }
    function money(n, cur) {
      try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n); }
      catch (e) { return cur + " " + Number(n).toFixed(2); }
    }
    function clearOutput() { output.textContent = ""; error.textContent = ""; if (win) win.hpwRoomToReadyPlan = null; }
    function updatePriceLabels() {
      floorPriceLabel.textContent = "Your price per m² (" + currencyFor(region()) + ", optional)";
      var finish = wallFinish.value;
      wallPriceLabel.textContent = "Your price per " + (finish === "paint" ? "m² per coat" : "m²") + " (" + currencyFor(region()) + ", optional)";
    }
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
      var sources = Array.isArray(record.sources) ? record.sources : (record.source ? [record.source] : []);
      return { id: record.id, name: label, geography: market, geographyResolution: "national", observedAt: record.observedAt,
        urls: sources.map(function (s) { return s.url; }).filter(function (url) { return /^https:\/\//.test(String(url || "")); }) };
    }
    function manualPrice(id, unit, market) {
      var raw = doc.getElementById(id).value;
      if (raw === "") return null;
      var amount = Number(raw);
      if (!Number.isFinite(amount) || amount < 0) throw new Error("Your entered price must be a finite amount of zero or more.");
      return { kind: "user-input", currency: currencyFor(market), unit: unit, amount: amount };
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
      if (win) win.hpwRoomToReadyPlan = plan;
      var h = doc.createElement("p");
      var strong = doc.createElement("strong");
      strong.textContent = "Known material subtotal: " + (plan.estimate.pricedLineCount
        ? money(plan.knownMaterialSubtotal.low, plan.currency) + "–" + money(plan.knownMaterialSubtotal.high, plan.currency)
        : "No priced items yet");
      h.appendChild(strong); output.appendChild(h);
      var count = doc.createElement("p");
      count.textContent = "Unpriced required items: " + plan.unknownRequired.length + (plan.isIncomplete ? " — this plan is incomplete." : " — no selected item is currently unpriced.");
      output.appendChild(count);
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
      plan.estimate.lineItems.forEach(function (item) {
        if (item.priceKind === "user-input") {
          var li = doc.createElement("li"); li.textContent = item.name + ": visitor-confirmed price."; list.appendChild(li);
        }
      });
      plan.sources.forEach(function (source) {
        var li = doc.createElement("li");
        li.appendChild(doc.createTextNode("Source for " + source.item + ": " + source.name + " (observed " + source.observedAt + ") "));
        source.urls.forEach(function (url, index) {
          if (index) li.appendChild(doc.createTextNode("; "));
          var a = doc.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.textContent = "source " + (index + 1); li.appendChild(a);
        });
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
      if (event.target && event.target.id === "plan-wall-finish") {
        coatsField.hidden = event.target.value !== "paint";
        wallPriceField.hidden = event.target.value === "none";
        updatePriceLabels();
      }
      if (event.target && event.target.id === "plan-flooring") { floorPriceField.hidden = !event.target.checked; fillFloorTypes(); }
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
        var manual = manualPrice("plan-floor-price", "m²", market);
        if (!subtype && !manual) { error.textContent = "Choose a floor type for a reference range, or enter your own price per m²."; return; }
        var selected = state.flooring && subtype ? RP.select(state.flooring, { country: market, category: "flooring", subtype: subtype }) : null;
        var price = manual || (selected && selected.ok ? RP.toEngineAreaPrice(selected.record, "m²") : null);
        if (!manual && selected && selected.ok && price && price.source) { price.source.url = selected.record.source.url; price.source.urls = [selected.record.source.url]; }
        flooring = { price: price };
      }
      var finish = wallFinish.value;
      var input = { market: market, room: room, flooring: flooring, wallFinish: finish };
      if (finish === "paint") { input.paintCoats = Number(doc.getElementById("plan-paint-coats").value); input.paintPrice = manualPrice("plan-wall-price", "m²/coat", market) || paintPrice(market); }
      if (finish === "wallpaper") input.wallpaperPrice = manualPrice("plan-wall-price", "m²", market) || wallpaperPrice(market);
      try { render(Model.buildPlan(input, Engine)); }
      catch (e) { error.textContent = e && e.message ? e.message : "The room plan could not be calculated."; }
    });
    if (win && win.addEventListener) win.addEventListener("hpw-region", function () {
      // A manually entered number belongs to the old currency; never silently reinterpret it.
      doc.getElementById("plan-floor-price").value = "";
      doc.getElementById("plan-wall-price").value = "";
      fillFloorTypes(); updatePriceLabels(); clearOutput();
    });
    if (win && typeof win.fetch === "function") {
      win.fetch("reference-prices.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; })
        .then(function (records) { if (Array.isArray(records)) { state.flooring = records; fillFloorTypes(); } }).catch(function () {});
      win.fetch("reference-assumptions.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; })
        .then(function (file) { if (file && Array.isArray(file.records)) state.assumptions = file; }).catch(function () {});
    }
    fillFloorTypes();
    updatePriceLabels();
    return { state: state, build: function () { form.dispatchEvent(new win.Event("submit", { bubbles: true, cancelable: true })); } };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined") init(document, window);
  return { init: init };
}));
