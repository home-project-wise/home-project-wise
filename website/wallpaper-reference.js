/* HomeProjectWise beginner wallpaper material-cost range (Issue #402, under #362). Uses the owner-approved per-area records of category
 * "wallpaper" in data/reference_assumptions.json (build copy: reference-assumptions.json): the visitor's net wall area in m2 times the low and
 * high price per m2 of nominal roll coverage, in the visitor's chosen country only. It never gives a roll, strip or package count, never a
 * pattern, trim, offcut or waste allowance, never a national average or a quote, and never mixes markets or currencies. Nothing typed is
 * sent or stored.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWWallpaperReference = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var MARKET = { US: "US", Canada: "CA", UK: "UK", Germany: "DE", France: "FR", Spain: "ES", Italy: "IT", Netherlands: "NL" };
  var CURRENCY = { US: "USD", CA: "CAD", UK: "GBP", DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR" };
  var LABEL = { US: "the United States", Canada: "Canada", UK: "the United Kingdom", Germany: "Germany", France: "France", Spain: "Spain", Italy: "Italy", Netherlands: "the Netherlands" };
  var DAY = 86400000;
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function money(n, cur, digits) {
    try { return new Intl.NumberFormat("en-US", { style: "currency", currency: cur, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(n); } catch (e) { return cur + " " + Number(n).toFixed(digits); }
  }
  function num(n, d) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: d === undefined ? 1 : d }); }
  function words(s) { return String(s === undefined || s === null ? "" : s).replace(/-/g, " "); }
  function okRange(r) { return !!r && Number.isFinite(r.low) && Number.isFinite(r.high) && r.low >= 0 && r.low <= r.high; }
  function eligible(r, file) {
    var a = file && file.wallpaperApproval;
    return !!r && r.category === "wallpaper" && r.subtype === "beginner-area-cost-envelope" && r.kind === "material-cost-range" && r.status === "approved-initial" &&
      r.autoEligible === true && r.eligibilityScope === "beginner-area-estimate-only" && r.packagePricingEligible === false && r.nationalAverage === false &&
      has(CURRENCY, r.market) && CURRENCY[r.market] === r.currency && r.unit === r.currency + "/m2" && okRange(r) &&
      typeof r.observedAt === "string" && Number.isFinite(Date.parse(r.observedAt)) &&
      Array.isArray(r.sources) && r.sources.length === 2 && r.sources.every(function (s) { return !!s && s.currency === r.currency && typeof s.observedAt === "string" && Number.isFinite(Date.parse(s.observedAt)); }) &&
      !!a && Array.isArray(a.eligibleMarkets) && a.eligibleMarkets.indexOf(r.market) !== -1;
  }
  // Exactly one eligible record for the visitor's market; otherwise nothing (never a guess, never another market, never another currency).
  function pick(file, country) {
    if (typeof country !== "string" || !has(MARKET, country) || !file || !Array.isArray(file.records)) return null;
    var m = MARKET[country], hit = file.records.filter(function (r) { return eligible(r, file) && r.market === m; });
    return hit.length === 1 ? { market: m, country: country, record: hit[0], approval: file.wallpaperApproval } : null;
  }
  function isOlder(observedAt, now) {
    var t = Date.parse(observedAt), n = (now instanceof Date ? now : new Date()).getTime();
    return Number.isFinite(t) && n - t > 365 * DAY;
  }
  // The date shown is the sources' own observation date(s), never a later record or retrieval date.
  function observed(r) {
    var d = r.sources.map(function (s) { return s.observedAt; }).sort();
    return { first: d[0], last: d[d.length - 1], text: d[0] === d[d.length - 1] ? "observed on " + d[0] : "observed between " + d[0] + " and " + d[d.length - 1] };
  }
  function estimate(file, country, netM2, now) {
    var p = pick(file, country);
    if (!p) return { ok: false, reason: "no-market" };
    if (typeof netM2 !== "number" || !Number.isFinite(netM2) || !(netM2 > 0)) return { ok: false, reason: "area" };
    var r = p.record, cur = r.currency;
    return { ok: true, pick: p, netM2: netM2, perM2: { low: r.low, high: r.high, currency: cur }, cost: { low: netM2 * r.low, high: netM2 * r.high, currency: cur }, older: isOlder(observed(r).first, now) };
  }
  function sourceItems(r) {
    return r.sources.map(function (s) {
      var bits = [money(s.pricePerRoll, r.currency, 2) + " per roll"];
      if (Number.isFinite(s.nominalRollCoverageM2)) bits.push(num(s.nominalRollCoverageM2, 2) + " m² nominal coverage");
      if (s.productClass) bits.push(words(s.productClass));
      if (s.taxStatus) bits.push("tax " + words(s.taxStatus));
      return { label: (s.publisher || "Source") + (s.title ? " – " + s.title : ""), url: s.url, detail: ", " + bits.join(", ") + (s.observedAt ? ", observed " + s.observedAt : "") };
    });
  }
  function classNote(r) {
    var a = words(r.sources[0].productClass), b = words(r.sources[1].productClass);
    if (a && b && a !== b) return "The two examples are different kinds of wallpaper (" + a + " and " + b + "), so the range shows how far prices can differ, not a typical price. It is not a national average or a quote.";
    return "The two examples are only a small sample of the market. The range is not a national average or a quote.";
  }
  // Result for the visitor's chosen country and wall area: { ok: true, headline, notes, sources } or { ok: false, reason, message }.
  function lines(file, country, netM2, now) {
    var adv = "Enter the roll size and your own price under Advanced settings.";
    if (!country) return { ok: false, reason: "no-country", message: "Choose your country at the top to see an approximate wallpaper cost range. " + adv };
    if (!file) return { ok: false, reason: "not-loaded", message: "An approximate wallpaper cost range is not available right now. " + adv };
    var e = estimate(file, country, netM2, now);
    if (!e.ok) {
      if (e.reason === "area") return { ok: false, reason: "area", message: "Enter the wall area to see an approximate wallpaper cost range." };
      return { ok: false, reason: "no-market", message: "No approximate wallpaper cost range for " + (LABEL[MARKET[country]] || LABEL[country] || country) + " yet. " + adv };
    }
    var r = e.pick.record, cur = r.currency, label = LABEL[country] || country;
    var notes = [
      "Based on " + money(r.low, cur, 2) + "–" + money(r.high, cur, 2) + " per m² in " + label + ", from two example wallpapers on retailer websites (" + observed(r).text + "). Prices vary by product type and retailer.",
      classNote(r),
      "This is the wall area times the price per m² of the roll's nominal coverage. It does not include pattern matching, trim, offcuts or waste, paste, tools, delivery, labour or installation, and it does not tell you how many rolls to buy."
    ];
    if (e.older) notes.push("This price data is more than 12 months old.");
    return { ok: true, headline: "Approximate sample price range: " + money(e.cost.low, cur, 0) + "–" + money(e.cost.high, cur, 0) + " for " + num(netM2) + " m² of wall", notes: notes, sources: sourceItems(r), estimate: e };
  }
  function init(win, opts) {
    if (!win) return null;
    var state = { file: (opts && opts.file) || null };
    win.hpwWallpaperCost = function (info) { return lines(state.file, win.hpwRegion || "", info && info.netM2, new Date()); };
    if (!state.file && typeof win.fetch === "function") {
      win.fetch("reference-assumptions.json", { cache: "no-cache" }).then(function (r) { return r && r.ok ? r.json() : null; }).then(function (f) {
        if (f && Array.isArray(f.records) && f.records.length && f.wallpaperApproval) state.file = f;
      }).catch(function () {});
    }
    return { state: state };
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") init(window);
  return { MARKET: MARKET, pick: pick, estimate: estimate, lines: lines, init: init, eligible: eligible };
}));
