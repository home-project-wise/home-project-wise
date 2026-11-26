/* HomeProjectWise shared room (Stage 1 of the beginner flow, Issue #362). The visitor enters the room once and sends it to the
 * Flooring, Paint, Wallpaper, bulb brightness, room lighting, concrete slab, drywall/plaster and insulation tools. In memory only: nothing is stored or sent, and no value is assumed
 * (height, openings and slab thickness stay empty unless entered).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWSharedRoom = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function num(v) { return (v === "" || v === null || v === undefined) ? NaN : Number(v); }
  function readRoom(vals) {
    var L = num(vals.length), W = num(vals.width), H = num(vals.height);
    var blankOpen = vals.openings === "" || vals.openings === null || vals.openings === undefined, O = blankOpen ? 0 : num(vals.openings);
    if (!(L > 0) || !(W > 0)) return { ok: false, error: "Enter the length and width of the room, greater than zero." };
    if (!(vals.height === "" || vals.height === null || vals.height === undefined) && !(H > 0)) return { ok: false, error: "Height must be greater than zero, or leave it blank." };
    if (!Number.isFinite(O) || O < 0) return { ok: false, error: "The area of doors and windows cannot be negative." };
    return { ok: true, room: { unit: vals.unit === "ft" ? "ft" : "m", length: L, width: W, height: H > 0 ? H : null, openings: O } };
  }
  function setValue(doc, win, id, value) {
    var el = doc.getElementById(id); if (!el) return false;
    el.value = String(value);
    if (el.dispatchEvent && win && win.Event) el.dispatchEvent(new win.Event(id.slice(-5) === "-unit" ? "change" : "input", { bubbles: true }));
    return true;
  }
  function apply(target, room, doc, win) {
    if (target === "flooring") {
      setValue(doc, win, "material-unit", room.unit); setValue(doc, win, "material-length", room.length); setValue(doc, win, "material-width", room.width);
      return { ok: true, tab: "tab-material" };
    }
    if (target === "paint") {
      if (!room.height) return { ok: false, error: "Paint needs the wall height. Enter it above, then try again." };
      setValue(doc, win, "paint-unit", room.unit); setValue(doc, win, "paint-length", room.length); setValue(doc, win, "paint-width", room.width);
      setValue(doc, win, "paint-height", room.height); setValue(doc, win, "paint-openings", room.openings > 0 ? room.openings : "");
      return { ok: true, tab: "tab-paint" };
    }
    if (target === "wallpaper") {
      if (!room.height) return { ok: false, error: "Wallpaper needs the wall height. Enter it above, then try again." };
      var net = 2 * (room.length + room.width) * room.height - room.openings;
      if (!(net > 0)) return { ok: false, error: "The area of doors and windows must be smaller than the total wall area." };
      var ft = room.unit === "ft", fmt = function (x) { return Number(x).toLocaleString("en-US", { maximumFractionDigits: 2 }); };
      var other = ft ? net * 0.09290304 : net / 0.09290304, el = doc.getElementById("wallpaper-room-area");
      if (el) {
        el.textContent = "Wall area from your room: " + fmt(net) + " " + (ft ? "ft²" : "m²") + " (" + fmt(other) + " " + (ft ? "m²" : "ft²") + "), before any pattern waste. This is only the surface to cover; the number of rolls depends on the roll size and pattern, so enter those under Product label below to count rolls.";
        el.hidden = false;
      }
      return { ok: true, tab: "tab-wallpaper" };
    }
    return { ok: false, error: "Unknown calculator." };
  }
  var MARKUP =
    '<details><summary>Enter your room once (optional)</summary>' +
    '<p class="wp-note">Fill in the size once and send it to the Flooring or Paint calculator, see the wall area for Wallpaper, or send room measurements to the Bulb Brightness Check, Room Lighting Planner, Concrete Slab Volume Calculator, Drywall and Plaster Quantity Calculator or Insulation Quantity Calculator. Nothing is stored or sent.</p>' +
    '<form class="calc" id="room-form" novalidate><div class="calc-grid">' +
    '<div class="calc-field"><label for="room-unit">Measurements</label><select id="room-unit"><option value="m">Metres</option><option value="ft">Feet</option></select></div>' +
    '<div class="calc-field"><label for="room-length">Room length</label><input id="room-length" type="number" min="0" step="any"></div>' +
    '<div class="calc-field"><label for="room-width">Room width</label><input id="room-width" type="number" min="0" step="any"></div>' +
    '<div class="calc-field"><label for="room-height">Wall height (for wall-area tools)</label><input id="room-height" type="number" min="0" step="any"></div>' +
    '<div class="calc-field"><label for="room-openings">Doors and windows to leave out, total area (optional)</label><input id="room-openings" type="number" min="0" step="any"><small>Leave blank if you do not know; nothing is assumed.</small></div>' +
    '</div><p class="calc-error" id="room-error" role="alert"></p>' +
    '<button type="button" class="wp-btn" data-target="flooring">Use for Flooring</button> <button type="button" class="wp-btn" data-target="paint">Use for Paint</button> <button type="button" class="wp-btn" data-target="wallpaper">Use for Wallpaper</button> <button type="button" class="wp-btn" data-target="bulb-brightness">Use for bulb brightness check</button> <button type="button" class="wp-btn" data-target="room-lighting-planner">Use for room lighting</button> <button type="button" class="wp-btn" data-target="concrete-slab">Use for concrete slab volume</button> <button type="button" class="wp-btn" data-target="drywall-plaster">Use for drywall / plaster area</button> <button type="button" class="wp-btn" data-target="insulation-quantity">Use for insulation area</button> <span class="wp-note" id="room-note" role="status"></span></form></details>';
  function init(doc, win) {
    var host = doc.getElementById("room-root"); if (!host) return null;
    host.innerHTML = MARKUP;
    var form = doc.getElementById("room-form");
    function go(target) {
      var r = readRoom({ unit: doc.getElementById("room-unit").value, length: doc.getElementById("room-length").value, width: doc.getElementById("room-width").value,
        height: doc.getElementById("room-height").value, openings: doc.getElementById("room-openings").value });
      var err = doc.getElementById("room-error"), note = doc.getElementById("room-note");
      err.textContent = ""; note.textContent = "";
      if (!r.ok) { err.textContent = r.error; return; }
      if (win) {
        win.hpwRoom = r.room;
        if (win.dispatchEvent && win.Event) win.dispatchEvent(new win.Event("hpw-room"));
      }
      if (target === "concrete-slab") {
        var slabTab = win && typeof win.open === "function" ? win.open("concrete-slab-calculator.html", "_blank") : null;
        note.textContent = slabTab ? "Room length and width sent to the Concrete Slab Volume Calculator in a new tab. Thickness remains blank for you to enter." : "Allow the new tab, or open the Concrete Slab Volume Calculator directly and enter your measurements.";
        return;
      }
      if (target === "drywall-plaster") {
        if (!r.room.height) { err.textContent = "Drywall and plaster wall area needs the wall height. Enter it above, then try again."; return; }
        var wallTab = win && typeof win.open === "function" ? win.open("drywall-plaster-calculator.html", "_blank") : null;
        note.textContent = wallTab ? "Room wall area sent to the Drywall and Plaster Quantity Calculator in a new tab. Openings entered above are deducted once." : "Allow the new tab, or open the Drywall and Plaster Quantity Calculator directly and enter your wall measurements.";
        return;
      }
      if (target === "insulation-quantity") {
        if (!r.room.height) { err.textContent = "Insulation wall area needs the wall height. Enter it above, then try again."; return; }
        var insulationTab = win && typeof win.open === "function" ? win.open("insulation-quantity-calculator.html", "_blank") : null;
        note.textContent = insulationTab ? "Room wall area sent to the Insulation Quantity Calculator in a new tab. Openings entered above are deducted once. This is gross wall surface area, not clear cavity area between framing." : "Allow the new tab, or open the Insulation Quantity Calculator directly. Its shared-room area is gross wall surface area, not clear cavity area between framing.";
        return;
      }
      if (target === "room-lighting-planner") {
        var lightingTab = win && typeof win.open === "function" ? win.open("room-lighting-planner.html", "_blank") : null;
        note.textContent = lightingTab ? "Room floor area sent to the Room Lighting Planner in a new tab. The area remains editable; for task rows, enter the task-zone area instead." : "Allow the new tab, or open the Room Lighting Planner directly and enter the area. For task rows, use the task-zone area.";
        return;
      }
      if (target === "bulb-brightness") {
        var opened = win && typeof win.open === "function" ? win.open("bulb-brightness-check.html", "_blank") : null;
        note.textContent = opened ? "Room area sent to the Bulb Brightness Check in a new tab." : "Allow the new tab, or open the Bulb Brightness Check directly and enter the room area."; return;
      }
      var a = apply(target, r.room, doc, win);
      if (!a.ok) { err.textContent = a.error; return; }
      note.textContent = target === "wallpaper" ? "Wall area shown in Wallpaper. Rolls need the roll size and pattern from the product label." : "Sent to " + (target === "paint" ? "Paint" : "Flooring") + ". Check the values there and calculate.";
      var tab = doc.getElementById(a.tab); if (tab && tab.click) tab.click();
    }
    form.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.getAttribute) return;
      var target = t.getAttribute("data-target"); if (target) go(target);
    });
    form.addEventListener("submit", function (e) { if (e.preventDefault) e.preventDefault(); });
    return { go: go };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { readRoom: readRoom, apply: apply, init: init };
}));
