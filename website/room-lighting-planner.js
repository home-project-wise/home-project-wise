(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HPWRoomLightingPlanner = factory();
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  var SQFT_TO_SQM = 0.09290304;
  var SOURCES = {
    uk: {
      id: "uk", name: "Thomas Pocklington Trust — A practical guide to improving lighting in existing homes",
      category: "UK good-practice guide for people affected by sight loss; suggested task and floor illuminances",
      year: "May 2015 (2nd edition)", reference: "Table on printed page 22 (PDF page 27)",
      url: "https://www.housinglin.org.uk/_assets/Resources/Housing/OtherOrganisation/A-practical-guide-to-improving-lighting-in-existing-homes.pdf",
      rows: [
        ["uk-shower","Showering / bathing (task)",100,300,"100–300 lx"],
        ["uk-teeth","Brushing teeth (task)",200,300,"200–300 lx"],
        ["uk-washing","Washing in bathroom (task)",100,300,"100–300 lx"],
        ["uk-keys","Finding keys (task)",100,300,"100–300 lx"],
        ["uk-reading","Reading / writing (task)",200,1000,"200–1,000 lx"],
        ["uk-washing-up","Washing up (task)",200,500,"200–500 lx"],
        ["uk-meal","Having a meal (task)",200,500,"200–500 lx"],
        ["uk-clothes","Selecting clothes (task)",100,200,"100–200 lx"],
        ["uk-phone","Using the telephone (task)",100,400,"100–400 lx"],
        ["uk-shoes","Putting on shoes (task)",100,300,"100–300 lx"],
        ["uk-tea","Making a cup of tea (task)",200,1000,"200–1,000 lx"],
        ["uk-cooking","Cooking in the kitchen (task)",200,1000,"200–1,000 lx"],
        ["uk-shaving","Shaving (task)",200,1000,"200–1,000 lx"],
        ["uk-hall","Hallway floor",100,300,"100–300 lx"],
        ["uk-lounge","Lounge floor",100,300,"100–300 lx"],
        ["uk-kitchen","Kitchen floor",200,300,"200–300 lx"],
        ["uk-bathroom","Bathroom floor",100,300,"100–300 lx"],
        ["uk-bedroom","Bedroom floor",100,300,"100–300 lx"],
        ["uk-stairs","Stairs (on treads)",100,200,"100–200 lx"]
      ]
    },
    canada: {
      id: "canada", name: "CSA/ASC B652:23 — Accessible dwellings",
      category: "National Standard of Canada for accessible dwellings; minimum ambient and task lighting levels",
      year: "January 2023", reference: "Table 3, printed page 52 (PDF page 59)",
      url: "https://www.csagroup.org/wp-content/uploads/2430606.pdf",
      rows: [
        ["ca-kitchen-ambient","Kitchen — General / ambient",300,300,"300 lx"],
        ["ca-kitchen-task","Kitchen — Countertop, sink (task)",750,750,"750 lx"],
        ["ca-adult-bedroom-ambient","Bedroom (adult) — General / ambient",100,300,"100–300 lx"],
        ["ca-adult-bedroom-task","Bedroom (adult) — Desk, reading, table (task)",500,500,"500 lx"],
        ["ca-child-bedroom-ambient","Bedroom (child) — General / ambient",500,500,"500 lx"],
        ["ca-child-bedroom-task","Bedroom (child) — Desk, reading, table (task)",800,800,"800 lx"],
        ["ca-bathroom-ambient","Bathroom — General / ambient",300,300,"300 lx"],
        ["ca-bathroom-task","Bathroom — Shave, makeup (task)",300,700,"300–700 lx"],
        ["ca-living-ambient","Living room / den — General / ambient",300,300,"300 lx"],
        ["ca-living-task","Living room / den — Reading (task)",500,500,"500 lx"],
        ["ca-family-ambient","Family room / home theatre — General / ambient",300,300,"300 lx"],
        ["ca-family-tv","Family room / home theatre — TV viewing",150,150,"150 lx"],
        ["ca-family-task","Family room / home theatre — Reading, table (task)",500,500,"500 lx"],
        ["ca-laundry-ambient","Laundry / utility — General / ambient",200,200,"200 lx"],
        ["ca-laundry-task","Laundry / utility — Countertop, equipment (task)",300,300,"300 lx"],
        ["ca-dining","Dining room — General / ambient",200,200,"200 lx"],
        ["ca-hall","Hall, landing / stairway — General / ambient",100,500,"100–500 lx"],
        ["ca-office-ambient","Home office — General / ambient",500,500,"500 lx"],
        ["ca-office-task","Home office — Desk, table (task)",800,800,"800 lx"],
        ["ca-garage-ambient","Garage — General / ambient",500,500,"500 lx"],
        ["ca-garage-task","Garage — Table, bench (task)",750,750,"750 lx"],
        ["ca-workshop-ambient","Workshop — General / ambient",800,800,"800 lx"],
        ["ca-workshop-task","Workshop — Bench, equipment (task)",1100,1100,"1,100 lx"],
        ["ca-exterior","Exterior — patios, balconies, decks, walkways",50,50,"50 lx"]
      ]
    },
    malta: {
      id: "malta", name: "Building & Construction Authority — Technical Document F, Part 3",
      category: "Malta dwelling light-level guidance; indicative values referring to CIBSE Guide A",
      year: "Effective 1 July 2024", reference: "Table 29, printed page 48 (PDF page 48)",
      url: "https://bca.org.mt/wp-content/uploads/2024/01/Technical-Document-F-Part-3.pdf",
      rows: [
        ["mt-bedroom","Bedroom",100,100,"100 lx"],
        ["mt-bathroom","Bathroom",150,150,"150 lx"],
        ["mt-hall","Hall",100,100,"100 lx"],
        ["mt-kitchen","Kitchen",150,300,"150–300 lx"],
        ["mt-living","Living rooms",50,300,"50–300 lx"],
        ["mt-stairs","Stairs",100,100,"100 lx"],
        ["mt-toilets","Toilets",100,100,"100 lx"]
      ]
    },
    australia: {
      id: "australia", name: "Australian Government E3 — Energy efficient lighting and design: training guide for retailers",
      category: "Joint Australian, State and Territory and New Zealand government training guide; AS/NZS 1680 residential recommended average illuminance",
      year: "September 2014", reference: "Table 6, printed page 32 (PDF page 37)",
      url: "https://www.energyrating.gov.au/sites/default/files/2022-12/Lighting%2520Retailer%2520Training%2520Guide%5B1%5D.pdf",
      rows: [
        ["au-kitchen-workbench-initial","Kitchen workbench — Initial",300,300,"300 lx"],
        ["au-kitchen-workbench-maintained","Kitchen workbench — Maintained",240,240,"240 lx"],
        ["au-kitchen-initial","Kitchen — Initial",200,200,"200 lx"],
        ["au-kitchen-maintained","Kitchen — Maintained",160,160,"160 lx"],
        ["au-kitchen-living-initial","Kitchen / living — Initial",200,200,"200 lx"],
        ["au-kitchen-living-maintained","Kitchen / living — Maintained",160,160,"160 lx"],
        ["au-living-dining-initial","Living / dining — Initial",100,100,"100 lx"],
        ["au-living-dining-maintained","Living / dining — Maintained",80,80,"80 lx"],
        ["au-bathroom-initial","Bathroom — Initial",100,100,"100 lx"],
        ["au-bathroom-maintained","Bathroom — Maintained",80,80,"80 lx"],
        ["au-bedroom-initial","Bedroom — Initial",100,100,"100 lx"],
        ["au-bedroom-maintained","Bedroom — Maintained",80,80,"80 lx"],
        ["au-entry-initial","Entry / corridor / stairs — Initial",50,50,"50 lx"],
        ["au-entry-maintained","Entry / corridor / stairs — Maintained",40,40,"40 lx"]
      ]
    }
  };
  function positive(value, label) {
    if (value === "" || value === null || value === undefined) throw new Error(label + " is required.");
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) throw new Error(label + " must be greater than zero.");
    return n;
  }
  function ceilCount(value) { return Math.ceil(value - 1e-10); }
  function calculate(input) {
    if (!input || typeof input !== "object") throw new Error("Choose a source and a room or task.");
    var source = SOURCES[input.sourceId];
    if (!source) throw new Error("Choose one of the listed sources.");
    var row = source.rows.find(function (item) { return item[0] === input.targetId; });
    if (!row) throw new Error("Choose a room or task listed in the selected source.");
    var enteredArea = positive(input.area, "Area to be lit");
    var areaUnit = input.areaUnit === "ft2" ? "ft²" : "m²";
    var areaM2 = areaUnit === "ft²" ? enteredArea * SQFT_TO_SQM : enteredArea;
    if (!Number.isFinite(areaM2) || !(areaM2 > 0)) throw new Error("Area is outside the supported number range.");
    var luxMin = row[2], luxMax = row[3];
    var lumensMin = luxMin * areaM2 / 0.7;
    var lumensMax = luxMax * areaM2 / 0.3;
    if (!Number.isFinite(lumensMin) || !Number.isFinite(lumensMax)) throw new Error("The result is outside the supported number range.");
    var bulbLumens = null, bulbsMin = null, bulbsMax = null;
    if (input.bulbLumens !== "" && input.bulbLumens !== null && input.bulbLumens !== undefined) {
      bulbLumens = positive(input.bulbLumens, "Lumens per bulb");
      bulbsMin = ceilCount(lumensMin / bulbLumens);
      bulbsMax = ceilCount(lumensMax / bulbLumens);
    }
    return {
      source: source, targetId: row[0], targetLabel: row[1], printedLux: row[4],
      luxMin: luxMin, luxMax: luxMax, areaEntered: enteredArea, areaUnit: areaUnit,
      areaM2: areaM2, lumensMin: lumensMin, lumensMax: lumensMax,
      bulbLumens: bulbLumens, bulbsMin: bulbsMin, bulbsMax: bulbsMax,
      coefficientMin: 0.3, coefficientMax: 0.7
    };
  }
  function init(doc, win) {
    var form = doc.getElementById("rl-form");
    if (!form) return null;
    var sourceSelect = doc.getElementById("rl-source"), targetSelect = doc.getElementById("rl-target");
    var detail = doc.getElementById("rl-source-detail"), area = doc.getElementById("rl-area");
    var areaUnit = doc.getElementById("rl-area-unit"), result = doc.getElementById("rl-result");
    var error = doc.getElementById("rl-error"), status = doc.getElementById("rl-status");
    function fmt(n) { return Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 }); }
    function setLine(parent, value, strong) {
      var p = doc.createElement("p");
      if (strong) { var b = doc.createElement("strong"); b.textContent = value; p.appendChild(b); }
      else p.textContent = value;
      parent.appendChild(p);
    }
    function updateSource() {
      var source = SOURCES[sourceSelect.value];
      targetSelect.innerHTML = "";
      var placeholder = doc.createElement("option"); placeholder.value = ""; placeholder.textContent = "Choose a listed room or task"; targetSelect.appendChild(placeholder);
      if (!source) { detail.textContent = "Choose one source. Its room and task rows will appear here; sources are never combined."; return; }
      source.rows.forEach(function (row) {
        var option = doc.createElement("option"); option.value = row[0];
        option.textContent = row[1] + " — " + row[4] + " (" + source.reference + ")";
        targetSelect.appendChild(option);
      });
      detail.textContent = source.name + " | " + source.category + " | " + source.year + " | " + source.reference + ". Only rows printed in this source are available.";
      var link = doc.createElement("a"); link.href = source.url; link.target = "_blank"; link.rel = "noopener"; link.textContent = "Open this source";
      detail.appendChild(doc.createTextNode(" ")); detail.appendChild(link);
      result.textContent = ""; error.textContent = ""; status.textContent = "";
    }
    try {
      if (win.opener && !win.opener.closed && win.opener.location.origin === win.location.origin && win.opener.hpwRoom) {
        var room = win.opener.hpwRoom;
        if (Number(room.length) > 0 && Number(room.width) > 0 && (room.unit === "m" || room.unit === "ft")) {
          area.value = String(Number(room.length) * Number(room.width));
          areaUnit.value = room.unit === "ft" ? "ft2" : "m2";
          status.textContent = "Floor area copied from your shared room: " + area.value + " " + (room.unit === "ft" ? "ft²" : "m²") + ". You can edit it below. For a task row, enter the task-zone area instead.";
        }
      }
    } catch (e) { /* Manual area entry remains available when a popup handoff is unavailable. */ }
    sourceSelect.addEventListener("change", updateSource);
    form.addEventListener("submit", function (event) {
      event.preventDefault(); error.textContent = ""; result.textContent = ""; status.textContent = "";
      try {
        var data = calculate({ sourceId: sourceSelect.value, targetId: targetSelect.value,
          area: area.value, areaUnit: areaUnit.value, bulbLumens: doc.getElementById("rl-bulb-lumens").value });
        var source = data.source;
        setLine(result, data.targetLabel + " — source value: " + data.printedLux + ".", true);
        setLine(result, "Selected source: " + source.name + " (" + source.year + "). " + source.category);
        if (data.areaUnit === "ft²") {
          setLine(result, "Area entered: " + fmt(data.areaEntered) + " ft² × 0.09290304 = " + fmt(data.areaM2) + " m².");
        } else {
          setLine(result, "Area entered: " + fmt(data.areaEntered) + " m².");
        }
        setLine(result, "Planning method: required lumens = Lux × area ÷ coefficient of utilisation (CoU). E3 describes CoU as usually 0.3–0.7, depending on room size/shape and fitting efficiency (printed page 33).");
        setLine(result, "Lower end: " + fmt(data.luxMin) + " lx × " + fmt(data.areaM2) + " m² ÷ 0.7 = " + fmt(data.lumensMin) + " lumens.");
        setLine(result, "Upper end: " + fmt(data.luxMax) + " lx × " + fmt(data.areaM2) + " m² ÷ 0.3 = " + fmt(data.lumensMax) + " lumens.");
        setLine(result, "Estimated light-source output range: " + fmt(data.lumensMin) + "–" + fmt(data.lumensMax) + " lumens.", true);
        if (data.bulbLumens !== null) {
          setLine(result, "Bulb label input: " + fmt(data.bulbLumens) + " lumens per bulb.");
          setLine(result, "Bulb-count range: round each end up — " + fmt(data.lumensMin) + " ÷ " + fmt(data.bulbLumens) + " to " + fmt(data.lumensMax) + " ÷ " + fmt(data.bulbLumens) + " = " + data.bulbsMin + "–" + data.bulbsMax + " bulbs.", true);
        } else {
          setLine(result, "No bulb count shown: enter the lumens printed on one bulb if you want a bulb-count range.");
        }
        setLine(result, "Planning estimate only — not a lighting design, compliance statement or judgement that a room is adequately lit. Actual illuminance depends on fitting, distribution, room geometry and task plane; use a suitable light meter for real readings.");
      } catch (e) { error.textContent = e && e.message ? e.message : "Check the selections and measurements, then try again."; }
    });
    return { calculate: calculate, updateSource: updateSource };
  }
  if (typeof document !== "undefined" && typeof window !== "undefined" && document.getElementById) init(document, window);
  return { SOURCES: SOURCES, calculate: calculate, init: init, SQFT_TO_SQM: SQFT_TO_SQM };
}));
