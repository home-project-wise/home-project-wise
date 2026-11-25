(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWConcreteSlab = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var M_PER_FT = 0.3048, M_PER_IN = 0.0254, M_PER_CM = 0.01;
  var M3_PER_FT3 = 0.028316846592, M3_PER_YD3 = 0.764554857984;
  function positive(value, label) {
    if (value === "" || value === null || value === undefined) throw new Error(label + " is required.");
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be greater than zero.");
    return n;
  }
  function calculate(input) {
    if (!input || typeof input !== "object") throw new Error("Enter the slab measurements.");
    var lengthUnit = input.lengthUnit === "m" || input.lengthUnit === "ft" ? input.lengthUnit : null;
    if (!lengthUnit) throw new Error("Choose metres or feet for length and width.");
    var thicknessUnit = input.thicknessUnit === "cm" || input.thicknessUnit === "in" ? input.thicknessUnit : null;
    if (!thicknessUnit) throw new Error("Choose centimetres or inches for thickness.");
    var length = positive(input.length, "Length"), width = positive(input.width, "Width");
    var thickness = positive(input.thickness, "Thickness");
    var lengthFactor = lengthUnit === "ft" ? M_PER_FT : 1;
    var thicknessFactor = thicknessUnit === "in" ? M_PER_IN : M_PER_CM;
    var lengthM = length * lengthFactor, widthM = width * lengthFactor, thicknessM = thickness * thicknessFactor;
    var volumeM3 = lengthM * widthM * thicknessM;
    if (!Number.isFinite(volumeM3) || volumeM3 <= 0) throw new Error("The calculated volume is outside the supported range.");
    var result = {
      length:length, width:width, thickness:thickness, lengthUnit:lengthUnit, thicknessUnit:thicknessUnit,
      lengthM:lengthM, widthM:widthM, thicknessM:thicknessM, volumeM3:volumeM3,
      volumeFt3:volumeM3 / M3_PER_FT3, volumeYd3:volumeM3 / M3_PER_YD3,
      allowancePercent:null, adjustedVolumeM3:volumeM3,
      bagCount:null, bagRatio:null, productName:null, bagYield:null, bagYieldUnit:null, bagDetailsIncomplete:false
    };
    var allowanceBlank = input.allowancePercent === "" || input.allowancePercent === null || input.allowancePercent === undefined;
    if (!allowanceBlank) {
      var allowance = Number(input.allowancePercent);
      if (!Number.isFinite(allowance) || allowance < 0) throw new Error("Extra allowance must be zero or greater, or leave it blank.");
      result.allowancePercent = allowance;
      result.adjustedVolumeM3 = volumeM3 * (1 + allowance / 100);
      if (!Number.isFinite(result.adjustedVolumeM3)) throw new Error("The adjusted volume is outside the supported range.");
    }
    var name = String(input.productName || "").trim();
    var yieldBlank = input.bagYield === "" || input.bagYield === null || input.bagYield === undefined;
    var bagYield = yieldBlank ? null : positive(input.bagYield, "Published yield per bag");
    if (name && !yieldBlank) {
      var bagUnit = input.bagYieldUnit;
      var yieldM3 = bagUnit === "m3" ? bagYield : bagUnit === "ft3" ? bagYield * M3_PER_FT3 : bagUnit === "yd3" ? bagYield * M3_PER_YD3 : NaN;
      if (!Number.isFinite(yieldM3) || yieldM3 <= 0) throw new Error("Choose a valid bag-yield unit.");
      var ratio = result.adjustedVolumeM3 / yieldM3;
      if (!Number.isFinite(ratio) || ratio <= 0) throw new Error("The bag estimate is outside the supported range.");
      result.bagCount = Math.ceil(ratio - Number.EPSILON * Math.max(1, Math.abs(ratio)) * 4);
      result.bagRatio = ratio; result.productName = name; result.bagYield = bagYield; result.bagYieldUnit = bagUnit;
    } else if (name || !yieldBlank) {
      result.bagDetailsIncomplete = true;
    }
    return result;
  }
  function format(result) {
    var fmt = function (n, digits) { return Number(n).toLocaleString("en-US", { maximumFractionDigits:digits === undefined ? 3 : digits }); };
    return {
      metric:fmt(result.volumeM3,4) + " m³", feet:fmt(result.volumeFt3,3) + " ft³", yards:fmt(result.volumeYd3,3) + " yd³",
      adjustedMetric:fmt(result.adjustedVolumeM3,4) + " m³",
      adjustedFeet:fmt(result.adjustedVolumeM3 / M3_PER_FT3,3) + " ft³",
      adjustedYards:fmt(result.adjustedVolumeM3 / M3_PER_YD3,3) + " yd³"
    };
  }
  function init(doc, win) {
    var form = doc.getElementById("concrete-slab-form");
    if (!form) return null;
    var length = doc.getElementById("slab-length"), width = doc.getElementById("slab-width");
    var lengthUnit = doc.getElementById("slab-length-unit"), roomNote = doc.getElementById("slab-room-note");
    try {
      if (win.opener && !win.opener.closed && win.opener.location.origin === win.location.origin && win.opener.hpwRoom) {
        var room = win.opener.hpwRoom;
        if (Number(room.length) > 0 && Number(room.width) > 0 && (room.unit === "m" || room.unit === "ft")) {
          length.value = String(Number(room.length)); width.value = String(Number(room.width)); lengthUnit.value = room.unit;
          roomNote.textContent = "Length and width copied from your shared room. Thickness is still blank; enter the value from your own plan or measurement.";
        }
      }
    } catch (e) { /* Cross-window access is optional; manual measurements remain available. */ }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var error = doc.getElementById("concrete-slab-error"), output = doc.getElementById("concrete-slab-result");
      error.textContent = ""; output.textContent = "";
      try {
        var data = calculate({
          length:length.value, width:width.value, lengthUnit:lengthUnit.value,
          thickness:doc.getElementById("slab-thickness").value,
          thicknessUnit:doc.getElementById("slab-thickness-unit").value,
          productName:doc.getElementById("slab-product-name").value,
          bagYield:doc.getElementById("slab-bag-yield").value,
          allowancePercent:doc.getElementById("slab-allowance").value,
          bagYieldUnit:doc.getElementById("slab-bag-yield-unit").value
        });
        var volume = format(data);
        function line(value, strong) {
          var p = doc.createElement("p");
          if (strong) { var b = doc.createElement("strong"); b.textContent = value; p.appendChild(b); }
          else p.textContent = value;
          output.appendChild(p);
        }
        var lengthText=data.length+" "+(data.lengthUnit==="ft"?"ft":"m");
        var widthText=data.width+" "+(data.lengthUnit==="ft"?"ft":"m");
        var thickText=data.thickness+" "+(data.thicknessUnit==="in"?"in":"cm");
        line("Entered dimensions: "+lengthText+" × "+widthText+" × "+thickText+".");
        line("Convert to metres: "+data.lengthM+" m × "+data.widthM+" m × "+data.thicknessM+" m = "+volume.metric+".");
        line("Equivalent volume: "+volume.feet+" and "+volume.yards+".",true);
        if (data.allowancePercent !== null) {
          line("Your entered extra allowance: "+data.allowancePercent+"%.");
          line("Adjusted volume: base volume × (1 + "+data.allowancePercent+" ÷ 100) = "+volume.adjustedMetric+" ("+volume.adjustedFeet+"; "+volume.adjustedYards+").");
        }
        line("Conversions: 1 ft = 0.3048 m; 1 in = 0.0254 m; 1 cm = 0.01 m. 1 ft³ = 0.028316846592 m³; 1 yd³ = 0.764554857984 m³.");
        if (data.bagCount === null) line(data.bagDetailsIncomplete ? "Bag count not calculated: enter both the named product and its published yield per bag. Your volume result is still shown; no yield is assumed." : "Bag count not calculated. Add a named product and its published yield per bag if you want this optional estimate.");
        else {
          var selectedVolume=data.bagYieldUnit==="m3"?volume.adjustedMetric:data.bagYieldUnit==="ft3"?volume.adjustedFeet:volume.adjustedYards;
          line("Optional bag estimate for "+data.productName+": "+selectedVolume+" ÷ "+data.bagYield+" "+data.bagYieldUnit+" per bag = "+data.bagRatio.toLocaleString("en-US",{maximumFractionDigits:4})+" bags; rounded up to "+data.bagCount+" whole bags. Only the yield you entered was used.");
        }
        line("This is a volume calculation from the measurements entered, not a slab design or engineering assessment.");
      } catch (e) { error.textContent=e&&e.message?e.message:"Check the measurements and try again."; }
    });
    return {calculate:calculate};
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document,window);
  return {calculate:calculate,format:format,init:init};
}));
