/* HomeProjectWise project list: a shopping list that works with or without prices.
 * Quantities come first; each item is priced by "I know the price", "Two quotes" (a range)
 * or "Not sure yet" (price unknown). No prices are ever invented, stored or sent.
 * Pure logic is exported for tests; init() wires the page.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWProjectList = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var MAX_ITEMS = 30;
  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }
  function createState() { return { items: [], nextId: 1, currency: "USD", contingency: "10", budget: "" }; }
  function toNumber(v) { return (v === "" || v === null || v === undefined) ? NaN : Number(v); }
  function addItem(state, spec) {
    var name = String(spec.name || "").trim(), unit = String(spec.unit || "").trim();
    var quantity = toNumber(spec.quantity);
    if (!name || name.length > 60) return { ok: false, error: "Enter an item name (up to 60 characters)." };
    if (!unit || unit.length > 20) return { ok: false, error: "Enter the unit it is sold in, such as tin, box or roll." };
    if (!Number.isFinite(quantity) || quantity <= 0) return { ok: false, error: "Enter a quantity greater than zero." };
    if (state.items.length >= MAX_ITEMS) return { ok: false, error: "The list is limited to " + MAX_ITEMS + " items." };
    var known = spec.price !== undefined && spec.price !== null && Number.isFinite(Number(spec.price)) && Number(spec.price) >= 0;
    var item = { id: "i" + state.nextId++, name: name, unit: unit, quantity: String(quantity),
      mode: known ? "known" : "unknown", price: known ? String(spec.price) : "", low: "", high: "" };
    state.items.push(item);
    return { ok: true, item: item };
  }
  function removeItem(state, id) { state.items = state.items.filter(function (it) { return it.id !== id; }); }
  function findItem(state, id) { for (var i = 0; i < state.items.length; i++) if (state.items[i].id === id) return state.items[i]; return null; }
  function setField(state, id, field, value) {
    var it = findItem(state, id);
    if (!it || ["quantity", "mode", "price", "low", "high"].indexOf(field) === -1) return false;
    if (field === "mode" && ["known", "range", "unknown"].indexOf(value) === -1) return false;
    it[field] = String(value);
    return true;
  }
  function buildEstimateInput(state) {
    var currency = String(state.currency || "").trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Enter a 3-letter currency code, such as USD.");
    var contingency = toNumber(state.contingency);
    if (!Number.isFinite(contingency) || contingency < 0 || contingency > 100) throw new Error("Contingency must be between 0 and 100%.");
    if (!state.items.length) throw new Error("Add at least one item to the list first.");
    var lineItems = state.items.map(function (it) {
      var quantity = toNumber(it.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) throw new Error("Check the quantity for \"" + it.name + "\".");
      var price = null;
      if (it.mode === "known") {
        var p = toNumber(it.price);
        if (!Number.isFinite(p) || p < 0) throw new Error("Enter a price for \"" + it.name + "\", or choose \"Not sure yet\".");
        price = { kind: "user-input", currency: currency, unit: it.unit, amount: p };
      } else if (it.mode === "range") {
        var a = toNumber(it.low), b = toNumber(it.high);
        if (!Number.isFinite(a) || a < 0 || !Number.isFinite(b) || b < 0) throw new Error("Enter both quotes for \"" + it.name + "\", or choose \"Not sure yet\".");
        price = { kind: "user-range", currency: currency, unit: it.unit, low: Math.min(a, b), high: Math.max(a, b) };
      }
      return { id: it.id, name: it.name, unit: it.unit, quantity: quantity, required: true, price: price };
    });
    return { currency: currency, contingencyPct: contingency, lineItems: lineItems };
  }
  function money(n, currency) {
    try { return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(n); }
    catch (e) { return currency + " " + Number(n).toFixed(2); }
  }
  function span(lo, hi, currency) { return lo === hi ? money(lo, currency) : money(lo, currency) + "–" + money(hi, currency); }
  function qty(n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 4 }); }
  function summarize(state, estimator) {
    var input;
    try { input = buildEstimateInput(state); } catch (e) { return { ok: false, error: e.message }; }
    var est;
    try { est = estimator.calculateEstimate(input); } catch (e2) { return { ok: false, error: e2.message }; }
    var cur = est.currency, lines = [], byId = {};
    est.lineItems.forEach(function (li) { byId[li.id] = li; });
    state.items.forEach(function (it) {
      var li = byId[it.id], head = it.name + ": " + qty(it.quantity) + " " + it.unit;
      if (!li) { lines.push(head + " – price not known yet"); return; }
      var per = li.unitPriceLow === li.unitPriceHigh ? money(li.unitPriceLow, cur) : money(li.unitPriceLow, cur) + "–" + money(li.unitPriceHigh, cur);
      lines.push(head + " × " + per + " per " + it.unit + " = " + span(li.totalLow, li.totalHigh, cur));
    });
    var totals = [], unknown = est.unknownRequired.length;
    if (est.pricedLineCount > 0) {
      totals.push("Priced items: " + span(est.subtotalLow, est.subtotalHigh, cur));
      totals.push("Contingency (" + est.contingencyPct + "% of priced items): " + span(est.contingencyLow, est.contingencyHigh, cur));
      totals.push("Total with contingency: " + span(est.totalLow, est.totalHigh, cur));
      if (unknown) totals.push("This total is partial: " + unknown + " item(s) have no price and are not included.");
    } else {
      totals.push("No prices yet, so this list shows quantities only. Add a price or two quotes per item to get a cost range.");
    }
    var budgetLine = "", budgetAmount = toNumber(state.budget);
    if (state.budget !== "" && Number.isFinite(budgetAmount) && budgetAmount > 0) {
      try {
        var b = estimator.assessBudget(est, { amount: budgetAmount, currency: cur });
        if (b.status === "cannot-assess") {
          budgetLine = b.unknownRequired && b.unknownRequired.length
            ? "Can’t compare with your " + money(budgetAmount, cur) + " budget yet: no price for " + b.unknownRequired.join(", ") + "."
            : "Can’t compare with your budget yet: no item has a price.";
        } else if (b.status === "likely-within-budget") {
          budgetLine = "Likely within your " + money(budgetAmount, cur) + " budget. Remaining: " + span(b.remainingLow, b.remainingHigh, cur) + ".";
        } else if (b.status === "range-overlaps-budget") {
          budgetLine = "Your " + money(budgetAmount, cur) + " budget falls inside this estimate range. Tighter quotes will show which side you are on.";
        } else {
          budgetLine = "Likely over your " + money(budgetAmount, cur) + " budget: even the low estimate is above it.";
        }
      } catch (e3) { budgetLine = ""; }
    } else if (state.budget !== "") { budgetLine = "Budget must be a number greater than zero."; }
    var text = ["HomeProjectWise project list (planning estimate, not a quote)"].concat(lines, [""], totals, budgetLine ? [budgetLine] : []).join("\n");
    return { ok: true, estimate: est, lines: lines, totals: totals, budgetLine: budgetLine, text: text };
  }
  function rowHtml(it) {
    var id = it.id, sel = function (m) { return it.mode === m ? " selected" : ""; };
    var h = "<fieldset class=\"wp-room\"><legend>" + esc(it.name) + "</legend><div class=\"calc-grid\">";
    h += "<div class=\"calc-field\"><label for=\"pl-q-" + id + "\">Quantity (" + esc(it.unit) + ")</label><input id=\"pl-q-" + id + "\" type=\"number\" min=\"0\" step=\"any\" value=\"" + esc(it.quantity) + "\" data-id=\"" + id + "\" data-field=\"quantity\"></div>";
    h += "<div class=\"calc-field\"><label for=\"pl-m-" + id + "\">How will you price this?</label><select id=\"pl-m-" + id + "\" data-id=\"" + id + "\" data-field=\"mode\"><option value=\"known\"" + sel("known") + ">I know the price</option><option value=\"range\"" + sel("range") + ">Two quotes (a range)</option><option value=\"unknown\"" + sel("unknown") + ">Not sure yet</option></select></div>";
    if (it.mode === "known") {
      h += "<div class=\"calc-field\"><label for=\"pl-p-" + id + "\">Price per " + esc(it.unit) + "</label><input id=\"pl-p-" + id + "\" type=\"number\" min=\"0\" step=\"any\" value=\"" + esc(it.price) + "\" data-id=\"" + id + "\" data-field=\"price\"></div>";
    } else if (it.mode === "range") {
      h += "<div class=\"calc-field\"><label for=\"pl-l-" + id + "\">First quote per " + esc(it.unit) + "</label><input id=\"pl-l-" + id + "\" type=\"number\" min=\"0\" step=\"any\" value=\"" + esc(it.low) + "\" data-id=\"" + id + "\" data-field=\"low\"></div>";
      h += "<div class=\"calc-field\"><label for=\"pl-h-" + id + "\">Second quote per " + esc(it.unit) + "</label><input id=\"pl-h-" + id + "\" type=\"number\" min=\"0\" step=\"any\" value=\"" + esc(it.high) + "\" data-id=\"" + id + "\" data-field=\"high\"></div>";
    } else {
      h += "<div class=\"calc-field\"><small>No price yet: this item stays on the list with its quantity and is left out of the total.</small></div>";
    }
    return h + "</div><button type=\"button\" class=\"wp-btn\" data-action=\"remove\" data-id=\"" + id + "\">Remove " + esc(it.name) + "</button></fieldset>";
  }
  function itemsHtml(state) {
    return state.items.length ? state.items.map(rowHtml).join("") : "<p class=\"wp-note\">Your list is empty. Add a result from the Paint or Flooring tab, or add an item below.</p>";
  }
  function resultHtml(s) {
    var h = "<ul>" + s.lines.map(function (l) { return "<li>" + esc(l) + "</li>"; }).join("") + "</ul>";
    h += s.totals.map(function (t) { return /^Total/.test(t) ? "<p><strong>" + esc(t) + "</strong></p>" : "<p>" + esc(t) + "</p>"; }).join("");
    if (s.budgetLine) h += "<p>" + esc(s.budgetLine) + "</p>";
    h += "<p class=\"wp-note\">Planning estimate from the numbers you entered; not a quote. Taxes, delivery and labour are not included unless you add them as items.</p>";
    h += "<div class=\"calc-field\"><label for=\"plist-text\">List as text</label><textarea id=\"plist-text\" readonly rows=\"" + Math.min(14, s.lines.length + 6) + "\" style=\"width:100%\">" + esc(s.text) + "</textarea></div>";
    return h + "<button type=\"button\" class=\"wp-btn\" data-action=\"copy\">Copy list</button> <span class=\"wp-note\" id=\"plist-copy-note\" role=\"status\"></span>";
  }
  var SKELETON =
    "<h3>Project list</h3>" +
    "<p class=\"wp-note\">Build one shopping list from your Paint and Flooring results, or add your own items. Nothing is stored or sent; the list clears when you leave the page.</p>" +
    "<details><summary>Don’t know the prices yet?</summary><ol>" +
    "<li>Check the unit the product is sold in (a tin or gallon, a box, a roll). Enter the price for one of that unit, the way the product page shows it.</li>" +
    "<li>Look at two stores or websites. Choose “Two quotes” and enter both prices. You get a cost range instead of a guess.</li>" +
    "<li>Short on time? Choose “Not sure yet”. The list still shows what to buy; items without a price are marked and left out of the total.</li></ol>" +
    "<p class=\"wp-note\">Prices vary by store, region, delivery and tax. This tool never makes up a price, so every number you see comes from you.</p></details>" +
    "<div id=\"plist-items\"></div>" +
    "<form class=\"calc\" id=\"plist-add-form\" novalidate><div class=\"calc-grid\">" +
    "<div class=\"calc-field\"><label for=\"plist-name\">Item name</label><input id=\"plist-name\" type=\"text\" maxlength=\"60\" placeholder=\"e.g. Primer\"></div>" +
    "<div class=\"calc-field\"><label for=\"plist-qty\">Quantity</label><input id=\"plist-qty\" type=\"number\" min=\"0\" step=\"any\" value=\"1\"></div>" +
    "<div class=\"calc-field\"><label for=\"plist-unit\">Sold by (unit)</label><input id=\"plist-unit\" type=\"text\" maxlength=\"20\" placeholder=\"e.g. gallon, box, roll\"></div></div>" +
    "<p class=\"calc-error\" id=\"plist-add-error\" role=\"alert\"></p><button class=\"wp-btn\" type=\"submit\">Add item</button></form>" +
    "<form class=\"calc\" id=\"plist-calc-form\" novalidate><div class=\"calc-grid\">" +
    "<div class=\"calc-field\"><label for=\"plist-currency\">Currency code</label><input id=\"plist-currency\" type=\"text\" maxlength=\"3\" value=\"USD\"><small>Three letters, such as USD.</small></div>" +
    "<div class=\"calc-field\"><label for=\"plist-contingency\">Contingency allowance (%)</label><input id=\"plist-contingency\" type=\"number\" min=\"0\" max=\"100\" step=\"any\" value=\"10\"></div>" +
    "<div class=\"calc-field\"><label for=\"plist-budget\">Budget (optional)</label><input id=\"plist-budget\" type=\"number\" min=\"0\" step=\"any\"></div></div>" +
    "<p class=\"calc-error\" id=\"plist-error\" role=\"alert\"></p><button class=\"calc-btn\" type=\"submit\">Calculate project list</button></form>" +
    "<div class=\"tool-result\" id=\"plist-result\" aria-live=\"polite\"></div>";
  function init(doc, estimator, win) {
    var rootEl = doc.getElementById("plist-root");
    if (!rootEl || !estimator) return null;
    var state = createState();
    rootEl.innerHTML = SKELETON;
    var itemsEl = doc.getElementById("plist-items");
    function paintItems() { itemsEl.innerHTML = itemsHtml(state); }
    function clearResult() { doc.getElementById("plist-result").innerHTML = ""; }
    paintItems();
    itemsEl.addEventListener("input", function (e) {
      var t = e.target; if (!t || !t.getAttribute) return;
      var id = t.getAttribute("data-id"), f = t.getAttribute("data-field");
      if (id && f && f !== "mode") setField(state, id, f, t.value);
    });
    itemsEl.addEventListener("change", function (e) {
      var t = e.target; if (!t || !t.getAttribute) return;
      var id = t.getAttribute("data-id"), f = t.getAttribute("data-field");
      if (id && f === "mode" && setField(state, id, "mode", t.value)) {
        paintItems();
        var again = doc.getElementById("pl-m-" + id); if (again && again.focus) again.focus();
      }
    });
    itemsEl.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.getAttribute || t.getAttribute("data-action") !== "remove") return;
      removeItem(state, t.getAttribute("data-id")); paintItems(); clearResult();
      var n = doc.getElementById("plist-name"); if (n && n.focus) n.focus();
    });
    doc.getElementById("plist-add-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var r = addItem(state, { name: doc.getElementById("plist-name").value, quantity: doc.getElementById("plist-qty").value, unit: doc.getElementById("plist-unit").value });
      doc.getElementById("plist-add-error").textContent = r.ok ? "" : r.error;
      if (r.ok) { doc.getElementById("plist-name").value = ""; doc.getElementById("plist-unit").value = ""; paintItems(); clearResult(); }
    });
    doc.getElementById("plist-calc-form").addEventListener("submit", function (e) {
      e.preventDefault();
      state.currency = doc.getElementById("plist-currency").value;
      state.contingency = doc.getElementById("plist-contingency").value;
      state.budget = doc.getElementById("plist-budget").value;
      var s = summarize(state, estimator);
      doc.getElementById("plist-error").textContent = s.ok ? "" : s.error;
      doc.getElementById("plist-result").innerHTML = s.ok ? resultHtml(s) : "";
    });
    doc.getElementById("plist-result").addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.getAttribute || t.getAttribute("data-action") !== "copy") return;
      var ta = doc.getElementById("plist-text"), note = doc.getElementById("plist-copy-note");
      var can = win && win.navigator && win.navigator.clipboard && win.navigator.clipboard.writeText;
      if (can) {
        win.navigator.clipboard.writeText(ta.value).then(function () { note.textContent = "Copied."; }, function () { note.textContent = "Select the text above and copy it."; });
      } else { if (ta.select) ta.select(); note.textContent = "Select the text above and copy it."; }
    });
    ["paint", "material"].forEach(function (pid) {
      var btn = doc.getElementById(pid + "-add"), form = doc.getElementById(pid + "-form"), note = doc.getElementById(pid + "-add-note");
      if (!btn || !form) return;
      function stale() { btn.hidden = true; if (note) note.textContent = ""; }
      form.addEventListener("input", stale); form.addEventListener("change", stale);
      btn.addEventListener("click", function () {
        var last = win && win.hpwLast && win.hpwLast[pid];
        if (!last) return;
        var r = addItem(state, last);
        if (note) note.textContent = r.ok ? "Added to your project list (Project cost tab)." : r.error;
        if (r.ok) { paintItems(); clearResult(); }
      });
    });
    return { state: state };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) {
    init(document, window.HPWProjectEstimator, window);
  }
  return { createState: createState, addItem: addItem, removeItem: removeItem, setField: setField, buildEstimateInput: buildEstimateInput, summarize: summarize, init: init, esc: esc };
}));
