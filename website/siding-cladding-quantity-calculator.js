"use strict";
(function(root,factory){
  var utils=root&&root.HPWCalculatorUtils;
  if(!utils&&typeof module==="object"&&module.exports) utils=require("./calculator-utils.js");
  var api=factory(utils);
  if(typeof module==="object"&&module.exports) module.exports=api;
  if(root) root.SidingCladdingQuantity=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(utils){
  "use strict";
  var blank=utils.blank;
  var positive=utils.positive;
  var ceilCount=utils.ceilCountNearest;
  function calculate(input){
    input=input||{};
    if(input.unit!=="m²"&&input.unit!=="ft²") throw new Error("Choose square metres or square feet.");
    var coverage=positive(input.coveragePerPack,"Product coverage per pack");
    if(!Array.isArray(input.faces)||input.faces.length===0) throw new Error("Add at least one measured wall face.");
    var totalArea=0,faces=[];
    input.faces.forEach(function(face,index){
      var area=positive(face.area,"Wall face "+(index+1)+" net area");
      totalArea+=area;
      if(!Number.isFinite(totalArea)) throw new Error("The combined wall area is too large to calculate safely.");
      faces.push({face:index+1,area:area});
    });
    var exactPacks=totalArea/coverage,packs=ceilCount(exactPacks);
    if(!Number.isSafeInteger(packs)) throw new Error("The pack quantity is too large to calculate safely.");
    return {unit:input.unit,coveragePerPack:coverage,totalArea:totalArea,exactPacks:exactPacks,packs:packs,faces:faces};
  }
  var format=utils.format;
  var node=utils.element;
  function init(doc){
    var form=doc.getElementById("siding-form");if(!form)return null;
    var host=doc.getElementById("siding-faces"),sequence=1;
    var error=doc.getElementById("siding-error"),result=doc.getElementById("siding-result");
    function clear(){error.textContent="";result.textContent="";}
    function addFace(){
      sequence+=1;
      var section=node(doc,"section");section.className="fq-run siding-face";section.setAttribute("data-face",String(sequence));
      var head=node(doc,"div");head.className="fq-run-head";
      head.appendChild(node(doc,"h3","Wall face "+sequence));
      var remove=node(doc,"button","Remove wall face");remove.type="button";remove.className="fq-small-button";remove.setAttribute("data-remove-face","");
      head.appendChild(remove);section.appendChild(head);
      var field=node(doc,"div");field.className="fq-field";
      var label=node(doc,"label","Net cladding area (");label.setAttribute("for","siding-area-"+sequence);
      var unit=node(doc,"span","area unit");unit.setAttribute("data-area-unit","");label.appendChild(unit);label.appendChild(doc.createTextNode(")"));
      var input=node(doc,"input");input.type="number";input.min="0";input.step="any";input.id="siding-area-"+sequence;input.className="siding-area";input.placeholder="Enter measured net wall area";
      field.appendChild(label);field.appendChild(input);section.appendChild(field);host.appendChild(section);
      setUnits();clear();
    }
    function setUnits(){
      var unit=doc.getElementById("siding-unit").value||"area unit";
      Array.prototype.forEach.call(doc.querySelectorAll("[data-area-unit]"),function(el){el.textContent=unit;});
      clear();
    }
    doc.getElementById("siding-unit").addEventListener("change",setUnits);
    doc.getElementById("siding-add-face").addEventListener("click",addFace);
    host.addEventListener("click",function(event){
      var button=event.target.closest("[data-remove-face]");if(!button)return;
      var face=button.closest(".siding-face");
      if(face&&host.querySelectorAll(".siding-face").length>1){face.remove();clear();}
    });
    form.addEventListener("submit",function(event){
      event.preventDefault();clear();
      try{
        var faces=Array.prototype.map.call(host.querySelectorAll(".siding-face"),function(face){
          return {area:face.querySelector(".siding-area").value};
        });
        var estimate=calculate({unit:doc.getElementById("siding-unit").value,coveragePerPack:doc.getElementById("siding-coverage").value,faces:faces});
        result.appendChild(node(doc,"h2","Siding / cladding quantity estimate"));
        result.appendChild(node(doc,"p","Total net wall-face area: "+format(estimate.totalArea)+" "+estimate.unit));
        result.appendChild(node(doc,"p","Exact product coverage per pack: "+format(estimate.coveragePerPack)+" "+estimate.unit));
        result.appendChild(node(doc,"p","Packs required: "+estimate.packs+" packs"));
        var list=node(doc,"ul");
        estimate.faces.forEach(function(face){list.appendChild(node(doc,"li","Wall face "+face.face+": "+format(face.area)+" "+estimate.unit));});
        result.appendChild(list);
        result.appendChild(node(doc,"p","Pack count is rounded up to a whole pack. No waste, overlap, breakage or extra allowance has been added."));
      }catch(e){error.textContent=e&&e.message?e.message:"Check the wall measurements and product coverage and try again.";}
    });
    return {form:form,addFace:addFace};
  }
  return {calculate:calculate,init:init};
});
