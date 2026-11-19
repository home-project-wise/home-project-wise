/* HomeProjectWise beginner paint estimate (Stage 2, Issue #362). Uses the owner-approved per-area assumptions in
 * data/reference_assumptions.json (build copy: reference-assumptions.json): litres and material cost per m2 per coat for ordinary interior
 * wall matt paint on sound, prepared walls, in the visitor's chosen country only. It never gives a tin or package count, never a national
 * average, never a quote, and never mixes markets or currencies. Nothing typed is sent or stored.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWPaintReference = factory(root);
}(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";
  var Currency = typeof module === "object" && module.exports && typeof require === "function" ? require("./currency.js") : root.HPWCurrency;
  var MARKET = { US: "US", Canada: "CA", UK: "GB", Germany: "DE", France: "FR", Spain: "ES", Italy: "IT", Netherlands: "NL" };
  var LABEL = { US: "the United States", Canada: "Canada", UK: "the United Kingdom", Germany: "Germany", France: "France", Spain: "Spain", Italy: "Italy", Netherlands: "the Netherlands" };
  var GAL_PER_L = 0.264172052;
  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; });
  }
  function link(url, label) { return /^https:\/\//.test(String(url || "")) ? '<a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(label) + '</a>' : esc(label); }
  function money(n, cur) { return Currency.format(n, cur); }
  function num(n, d) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 1 : d }); }
  function okRange(r) { return !!r && Number.isFinite(r.low) && Number.isFinite(r.high) && r.low >= 0 && r.low <= r.high; }
  function eligible(r, file) {
    return !!r && r.category === "paint" && r.subtype === "interior-wall-matt" && r.status === "approved-initial" && r.autoEligible === true &&
      r.eligibilityScope === "beginner-area-estimate-only" && r.packagePricingEligible === false && r.nationalAverage === false && okRange(r) &&
      Array.isArray(r.sources) && r.sources.length > 0 && !!file.approval && Array.isArray(file.approval.eligibleMarkets) && file.approval.eligibleMarkets.indexOf(r.market) !== -1;
  }
  // Exactly one eligible coverage record and one eligible cost record for the market; otherwise nothing (never a guess, never another market).
  function pick(file, country) {
    var m = MARKET[country];
    if (!m || !file || !Array.isArray(file.records)) return null;
    var cov = file.records.filter(function (r) { return eligible(r, file) && r.market === m && r.kind === "coverage-range" && r.unit === "L/m2/coat"; });
    var cost = file.records.filter(function (r) { return eligible(r, file) && r.market === m && r.kind === "material-cost-range" && /^[A-Z]{3}$/.test(String(r.currency)) && r.unit === r.currency + "/m2/coat"; });
    if (cov.length !== 1 || cost.length !== 1) return null;
    return { market: m, country: country, coverage: cov[0], cost: cost[0], approval: file.approval };
  }
  function coatsAllowed(file, coats) { return !!file && !!file.approval && Array.isArray(file.approval.allowedCoatChoices) && file.approval.allowedCoatChoices.indexOf(coats) !== -1; }
  function estimate(file, country, netM2, coats, allowPct) {
    var p = pick(file, country);
    if (!p) return { ok: false, reason: "no-market" };
    if (!coatsAllowed(file, coats)) return { ok: false, reason: "coats" };
    if (!(netM2 > 0)) return { ok: false, reason: "area" };
    var k = netM2 * coats, cur = p.cost.currency;
    var res = { ok: true, pick: p, coats: coats, netM2: netM2, litres: { low: k * p.coverage.low, high: k * p.coverage.high }, cost: { low: k * p.cost.low, high: k * p.cost.high, currency: cur } };
    var a = Number.isFinite(allowPct) && allowPct > 0 ? allowPct / 100 : 0;
    if (a > 0) res.withAllowance = { pct: allowPct, litres: { low: res.litres.low * (1 + a), high: res.litres.high * (1 + a) }, cost: { low: res.cost.low * (1 + a), high: res.cost.high * (1 + a), currency: cur } };
    return res;
  }
  function litresText(l, us) {
    var s = num(l.low) + "–" + num(l.high) + " litres";
    return us ? s + " (" + num(l.low * GAL_PER_L) + "–" + num(l.high * GAL_PER_L) + " US gallons)" : s;
  }
  function sourcesHtml(p) {
    var items = [];
    [["Coverage", p.coverage], ["Cost", p.cost]].forEach(function (g) {
      g[1].sources.forEach(function (s) {
        items.push("<li>" + g[0] + ": " + link(s.url, (s.publisher || "Source") + (s.title ? " – " + s.title : "")) + (s.observedAt ? ", observed " + esc(s.observedAt) : "") +
          (g[0] === "Cost" && (s.taxStatus || s.priceType) ? " (" + esc([s.priceType, s.taxStatus && "tax: " + s.taxStatus].filter(Boolean).join("; ")) + ")" : "") + "</li>");
      });
    });
    return "<details><summary>Sources (" + items.length + ")</summary><ul>" + items.join("") + "</ul></details>";
  }
  function fragment(file, country, info) {
    if (!country) return '<br><span class="wp-note">Choose your country at the top to see a typical paint amount and cost range, or enter the coverage from your tin under Advanced settings.</span>';
    if (!file) return '<br><span class="wp-note">Typical estimates are not available right now. Enter the coverage from your tin under Advanced settings.</span>';
    var r = estimate(file, country, info.netM2, info.coats, info.allowPct);
    if (!r.ok) {
      if (r.reason === "coats") return '<br><span class="wp-note">Typical ranges are available for 1 or 2 coats. Choose 1 or 2, or enter the coverage from your tin under Advanced settings.</span>';
      return '<br><span class="wp-note">No typical paint estimate for ' + esc(LABEL[country] || country) + ' yet. Enter the coverage from your tin under Advanced settings.</span>';
    }
    var us = r.pick.market === "US", cur = r.cost.currency;
    var h = '<br>Typical paint for these walls: <strong>' + esc(litresText(r.litres, us)) + '</strong> for ' + r.coats + ' coat' + (r.coats === 1 ? "" : "s") +
      '<br>Typical material cost: <strong>' + esc(money(r.cost.low, cur) + "–" + money(r.cost.high, cur)) + '</strong> (approximate)';
    if (r.withAllowance) h += '<br>With your ' + esc(num(r.withAllowance.pct, 1)) + '% extra: ' + esc(litresText(r.withAllowance.litres, us)) + ', ' + esc(money(r.withAllowance.cost.low, cur) + "–" + money(r.withAllowance.cost.high, cur));
    h += '<br><span class="wp-note">Planning estimate for ordinary interior matt paint on sound, prepared walls in ' + esc(LABEL[country] || country) + ', with ' + r.coats + ' finish coat' + (r.coats === 1 ? "" : "s") +
      (r.coats === 2 ? " (2 is a planning default if you are not sure; change the number of coats above if you know)" : "") + '. This is an amount of paint and its material cost, not a tin or package count and not a quote. ' +
      'New, bare, porous or damaged walls need primer or a different system, which is not included; ceilings, trim, labour, tools and delivery are not included either. ' +
      'Prices are retailer-displayed sample prices and tax treatment varies by source. ' + esc(file.approval.caveat || "") + '</span>' + sourcesHtml(r.pick);
    return h;
  }
  function init(win, opts) {
    if (!win) return null;
    var state = { file: (opts && opts.file) || null };
    win.hpwPaint = function (info) { return fragment(state.file, win.hpwRegion || "", info || {}); };
    if (!state.file && typeof win.fetch === "function") {
      win.fetch("reference-assumptions.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; }).then(function (f) {
        if (f && Array.isArray(f.records) && f.records.length && f.approval) state.file = f;
      }).catch(function () {});
    }
    return { state: state };
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") init(window);
  return { MARKET: MARKET, pick: pick, estimate: estimate, fragment: fragment, init: init, eligible: eligible };
}));
