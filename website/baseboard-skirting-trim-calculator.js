"use strict";
(function (root, factory) {
  var utils = root && root.HPWCalculatorUtils;
  if (!utils && typeof module === "object" && module.exports) utils = require("./calculator-utils.js");
  var api = factory(utils);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.BaseboardTrim = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (utils) {
  "use strict";
  var blank = utils.blank;
  var positive = utils.positive;
  var nonNegative = function (value, label) { return utils.nonNegative(value, label, true); };
  var ceilCount = utils.ceilCount;
  function calculate(input) {
    input = input || {};
    if (input.unit !== "m" && input.unit !== "ft") throw new Error("Choose metres or feet for all measurements.");
    var stockLength = positive(input.stockLength, "Stock length");
    var allowance = nonNegative(input.cuttingAllowance, "Cutting allowance");
    if (!Array.isArray(input.rooms) || input.rooms.length === 0) throw new Error("Add at least one measured room.");
    var perimeter = 0, openings = 0, netLength = 0, rooms = [];
    input.rooms.forEach(function (room, index) {
      var label = "Room " + (index + 1);
      var length = positive(room.length, label + " length");
      var width = positive(room.width, label + " width");
      var openingWidth = nonNegative(room.openingWidth, label + " opening width");
      var roomPerimeter = 2 * (length + width);
      if (!Number.isFinite(roomPerimeter)) throw new Error(label + ": dimensions are too large to calculate safely.");
      if (openingWidth >= roomPerimeter) throw new Error(label + ": opening width must be less than the room perimeter.");
      var roomNet = roomPerimeter - openingWidth;
      perimeter += roomPerimeter; openings += openingWidth; netLength += roomNet;
      if (!Number.isFinite(perimeter) || !Number.isFinite(openings) || !Number.isFinite(netLength)) {
        throw new Error("The combined room lengths are too large to calculate safely.");
      }
      rooms.push({room:index+1,length:length,width:width,perimeter:roomPerimeter,openingWidth:openingWidth,netTrimLength:roomNet});
    });
    var requiredLength = netLength + allowance;
    if (!Number.isFinite(requiredLength)) throw new Error("The required trim length is too large to calculate safely.");
    var exactPieces = requiredLength / stockLength;
    var stockPieces = ceilCount(exactPieces);
    if (!Number.isSafeInteger(stockPieces)) throw new Error("The stock-piece quantity is too large to calculate safely.");
    return {unit:input.unit,stockLength:stockLength,cuttingAllowance:allowance,perimeter:perimeter,
      openingWidth:openings,netTrimLength:netLength,requiredLength:requiredLength,
      exactStockPieces:exactPieces,stockPieces:stockPieces,rooms:rooms};
  }
  var format = utils.format;
  function init(doc) {
    var form=doc.getElementById("trim-form"); if(!form) return null;
    var host=doc.getElementById("trim-rooms"),sequence=1;
    var error=doc.getElementById("trim-error"),result=doc.getElementById("trim-result");
    function roomMarkup(n) {
      return '<section class="fq-panel tr-room" data-room="'+n+'"><div class="fq-run-head"><h3>Room '+n+'</h3><button type="button" class="fq-small-button" data-remove-room>Remove room</button></div><div class="fq-grid">'+
      '<div class="fq-field"><label for="trim-length-'+n+'">Room length</label><input id="trim-length-'+n+'" class="tr-length" type="number" min="0" step="any" placeholder="Enter room length"></div>'+
      '<div class="fq-field"><label for="trim-width-'+n+'">Room width</label><input id="trim-width-'+n+'" class="tr-width" type="number" min="0" step="any" placeholder="Enter room width"></div>'+
      '<div class="fq-field"><label for="trim-openings-'+n+'">Total width with no trim</label><input id="trim-openings-'+n+'" class="tr-openings" type="number" min="0" step="any" placeholder="Enter 0 if none"></div></div>'+
      '<p class="fq-help">Enter the combined width of perimeter gaps where this trim will not be fitted. Do not subtract openings where trim continues.</p></section>';
    }
    function clearOutput(){error.textContent="";result.textContent="";}
    doc.getElementById("trim-add-room").addEventListener("click",function(){sequence+=1;host.insertAdjacentHTML("beforeend",roomMarkup(sequence));clearOutput();});
    host.addEventListener("click",function(event){
      var button=event.target.closest("[data-remove-room]"); if(!button)return;
      var room=button.closest(".tr-room"); if(room && host.querySelectorAll(".tr-room").length>1){room.remove();clearOutput();}
    });
    form.addEventListener("submit",function(event){
      event.preventDefault();clearOutput();
      try{
        var rooms=Array.prototype.map.call(host.querySelectorAll(".tr-room"),function(node){return {
          length:node.querySelector(".tr-length").value,width:node.querySelector(".tr-width").value,
          openingWidth:node.querySelector(".tr-openings").value
        };});
        var estimate=calculate({unit:doc.getElementById("trim-unit").value,
          stockLength:doc.getElementById("trim-stock").value,
          cuttingAllowance:doc.getElementById("trim-allowance").value,rooms:rooms});
        var lines=estimate.rooms.map(function(room){return '<li>Room '+room.room+': '+format(room.perimeter)+' '+estimate.unit+' perimeter − '+format(room.openingWidth)+' '+estimate.unit+' openings = '+format(room.netTrimLength)+' '+estimate.unit+' trim.</li>';}).join("");
        result.innerHTML='<h2>Trim quantity estimate</h2><p>Measured perimeter: <strong>'+format(estimate.perimeter)+' '+estimate.unit+'</strong></p>'+
          '<p>Openings without trim: '+format(estimate.openingWidth)+' '+estimate.unit+'</p>'+
          '<p>Net trim length: <strong>'+format(estimate.netTrimLength)+' '+estimate.unit+'</strong></p>'+
          '<p>Cutting allowance you entered: '+format(estimate.cuttingAllowance)+' '+estimate.unit+'</p>'+
          '<p>Total length to provide: <strong>'+format(estimate.requiredLength)+' '+estimate.unit+'</strong></p>'+
          '<p>Stock length: '+format(estimate.stockLength)+' '+estimate.unit+'</p>'+
          '<p>Stock-piece equivalent: <strong>'+estimate.stockPieces+' pieces</strong></p><ul>'+lines+'</ul>'+
          '<p>This is a total-length equivalent, not a board-by-board cut plan. It does not assume offcut reuse or account for individual segment and corner cuts.</p>';
      }catch(e){error.textContent=e&&e.message?e.message:"Check the measurements and try again.";}
    });
    return {form:form,calculate:calculate};
  }
  return {calculate:calculate,init:init};
});