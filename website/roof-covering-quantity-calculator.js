"use strict";
(function (root, factory) {
  var utils = root && root.HPWCalculatorUtils;
  if (!utils && typeof module === "object" && module.exports) utils = require("./calculator-utils.js");
  var api = factory(utils);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RoofCoveringQuantity = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (utils) {
  "use strict";
  var blank = utils.blank;
  var positive = utils.positive;
  var nonNegative = function (value, label) { return utils.nonNegative(value, label, false); };
  var ceilCount = utils.ceilCountNearest;
  function calculate(input) {
    input = input || {};
    if (input.unit !== "m²" && input.unit !== "ft²") throw new Error("Choose square metres or square feet.");
    var coverage = positive(input.coveragePerPack, "Product coverage per pack");
    if (!Array.isArray(input.planes) || input.planes.length === 0) throw new Error("Add at least one measured roof plane.");
    var totalArea = 0, planes = [];
    input.planes.forEach(function (plane, index) {
      var area = positive(plane.area, "Roof plane " + (index + 1) + " area");
      totalArea += area;
      if (!Number.isFinite(totalArea)) throw new Error("The combined roof area is too large to calculate safely.");
      planes.push({plane:index+1,area:area});
    });
    var exactCoveringPacks = totalArea / coverage;
    var coveringPacks = ceilCount(exactCoveringPacks);
    if (!Number.isSafeInteger(coveringPacks)) throw new Error("The covering pack quantity is too large to calculate safely.");
    var accessories = [];
    (input.accessories || []).forEach(function (item, index) {
      var label = "Accessory " + (index + 1);
      var name = String(item.name || "").trim();
      if (!name) throw new Error(label + " needs an item name and unit.");
      var requiredQuantity = nonNegative(item.requiredQuantity, label + " required quantity");
      var unitsPerPack = positive(item.unitsPerPack, label + " units per pack");
      var exactPacks = requiredQuantity / unitsPerPack;
      var packs = ceilCount(exactPacks);
      if (!Number.isSafeInteger(packs)) throw new Error(label + " pack quantity is too large to calculate safely.");
      accessories.push({name:name,requiredQuantity:requiredQuantity,unitsPerPack:unitsPerPack,exactPacks:exactPacks,packs:packs});
    });
    return {unit:input.unit,coveragePerPack:coverage,totalArea:totalArea,exactCoveringPacks:exactCoveringPacks,
      coveringPacks:coveringPacks,planes:planes,accessories:accessories};
  }
  var format = utils.format;
  var element = utils.element;
  function init(doc) {
    var form=doc.getElementById("roof-form"); if(!form) return null;
    var planeHost=doc.getElementById("roof-planes"),accessoryHost=doc.getElementById("roof-accessories");
    var planeSequence=1,accessorySequence=0;
    var error=doc.getElementById("roof-error"),result=doc.getElementById("roof-result");
    function clearOutput(){error.textContent="";result.textContent="";}
    function planeMarkup(n) {
      return '<section class="fq-panel rc-plane" data-plane="'+n+'"><div class="fq-run-head"><h3>Roof plane '+n+'</h3><button type="button" class="fq-small-button" data-remove-plane>Remove plane</button></div>'+
      '<div class="fq-field"><label for="roof-area-'+n+'">Measured roof-plane area (<span data-area-unit>area unit</span>)</label><input id="roof-area-'+n+'" class="rc-area" type="number" min="0" step="any" placeholder="Enter measured surface area"></div></section>';
    }
    function accessoryMarkup(n) {
      return '<section class="fq-panel rc-accessory" data-accessory="'+n+'"><div class="fq-run-head"><h3>Accessory '+n+'</h3><button type="button" class="fq-small-button" data-remove-accessory>Remove accessory</button></div><div class="fq-grid">'+
      '<div class="fq-field"><label for="roof-accessory-name-'+n+'">Item name and unit</label><input id="roof-accessory-name-'+n+'" class="rc-name" type="text" maxlength="80" placeholder="e.g. Ridge caps — pieces"></div>'+
      '<div class="fq-field"><label for="roof-accessory-required-'+n+'">Total quantity required</label><input id="roof-accessory-required-'+n+'" class="rc-required" type="number" min="0" step="any" placeholder="Enter measured quantity"></div>'+
      '<div class="fq-field"><label for="roof-accessory-pack-'+n+'">Units in each pack</label><input id="roof-accessory-pack-'+n+'" class="rc-pack" type="number" min="0" step="any" placeholder="Enter supplier pack quantity"></div></div></section>';
    }
    function setUnits() {
      var unit=doc.getElementById("roof-unit").value || "area unit";
      Array.prototype.forEach.call(doc.querySelectorAll("[data-area-unit]"),function(node){node.textContent=unit;});
      clearOutput();
    }
    doc.getElementById("roof-unit").addEventListener("change",setUnits);
    doc.getElementById("roof-add-plane").addEventListener("click",function(){planeSequence+=1;planeHost.insertAdjacentHTML("beforeend",planeMarkup(planeSequence));clearOutput();});
    doc.getElementById("roof-add-accessory").addEventListener("click",function(){accessorySequence+=1;accessoryHost.insertAdjacentHTML("beforeend",accessoryMarkup(accessorySequence));clearOutput();});
    planeHost.addEventListener("click",function(event){
      var button=event.target.closest("[data-remove-plane]");if(!button)return;
      var node=button.closest(".rc-plane");if(node&&planeHost.querySelectorAll(".rc-plane").length>1){node.remove();clearOutput();}
    });
    accessoryHost.addEventListener("click",function(event){
      var button=event.target.closest("[data-remove-accessory]");if(!button)return;
      var node=button.closest(".rc-accessory");if(node){node.remove();clearOutput();}
    });
    form.addEventListener("submit",function(event){
      event.preventDefault();clearOutput();
      try{
        var planes=Array.prototype.map.call(planeHost.querySelectorAll(".rc-plane"),function(node){return {area:node.querySelector(".rc-area").value};});
        var accessories=Array.prototype.map.call(accessoryHost.querySelectorAll(".rc-accessory"),function(node){return {
          name:node.querySelector(".rc-name").value,requiredQuantity:node.querySelector(".rc-required").value,
          unitsPerPack:node.querySelector(".rc-pack").value
        };});
        var estimate=calculate({unit:doc.getElementById("roof-unit").value,
          coveragePerPack:doc.getElementById("roof-coverage").value,planes:planes,accessories:accessories});
        var heading=element(doc,"h2","Roof covering quantity estimate");result.appendChild(heading);
        result.appendChild(element(doc,"p","Total measured roof-plane area: "+format(estimate.totalArea)+" "+estimate.unit));
        result.appendChild(element(doc,"p","Product coverage per pack: "+format(estimate.coveragePerPack)+" "+estimate.unit));
        result.appendChild(element(doc,"p","Covering packs required: "+estimate.coveringPacks+" packs"));
        var list=element(doc,"ul");
        estimate.planes.forEach(function(plane){list.appendChild(element(doc,"li","Roof plane "+plane.plane+": "+format(plane.area)+" "+estimate.unit));});
        result.appendChild(list);
        if(estimate.accessories.length){
          result.appendChild(element(doc,"h3","Accessory packs"));
          var accessoryList=element(doc,"ul");
          estimate.accessories.forEach(function(item){accessoryList.appendChild(element(doc,"li",item.name+": "+format(item.requiredQuantity)+" required ÷ "+format(item.unitsPerPack)+" per pack = "+item.packs+" packs"));});
          result.appendChild(accessoryList);
        } else result.appendChild(element(doc,"p","No accessories were entered."));
        result.appendChild(element(doc,"p","Pack counts are rounded up to whole packs. No waste, overlap, breakage or extra allowance has been added."));
      }catch(e){error.textContent=e&&e.message?e.message:"Check the measurements and product details and try again.";}
    });
    return {form:form,calculate:calculate};
  }
  return {calculate:calculate,init:init};
});