(function(root,factory){
  var api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  if(root&&root.document){root.HPWSmartPlugEnergyCost=api;api.init(root.document,root);}
})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
function number(v){return String(v===undefined||v===null?"":v).trim()===""?NaN:Number(v);}
function calculate(input){
  input=input||{};
  var watts=number(input.watts),hours=number(input.hoursPerDay),days=number(input.daysPerMonth),rate=number(input.ratePerKwh),currency=String(input.currency||"");
  if(!Number.isFinite(watts)||watts<0)return{ok:false,error:"Enter the device's power in watts (zero is allowed)."};
  if(!Number.isFinite(hours)||hours<0||hours>24)return{ok:false,error:"Enter hours per day from 0 to 24."};
  if(!Number.isFinite(days)||days<1||days>31)return{ok:false,error:"Enter days per month from 1 to 31."};
  if(!Number.isFinite(rate)||rate<0)return{ok:false,error:"Enter your electricity rate per kWh (zero is allowed)."};
  if(!/^[A-Z]{3}$/.test(currency))return{ok:false,error:"Choose your country above so the currency is clear."};
  var daily=watts*hours/1000,monthly=daily*days,annual=watts*hours*365/1000;
  return{ok:true,watts:watts,hoursPerDay:hours,daysPerMonth:days,ratePerKwh:rate,currency:currency,dailyKwh:daily,monthlyKwh:monthly,annualKwh:annual,monthlyCost:monthly*rate,annualCost:annual*rate};
}
function money(n,c){return c+" "+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}
function init(doc,win){
  var form=doc.getElementById("energy-cost-form"),out=doc.getElementById("energy-cost-result"),err=doc.getElementById("energy-cost-error");
  if(!form||!out||!err)return null;
  function value(id){var el=doc.getElementById(id);return el?el.value:"";}
  var country=doc.getElementById("region-root"),rates=doc.getElementById("energy-ref-root");
  if(win&&win.addEventListener)win.addEventListener("hpw-region",function(){out.innerHTML="";err.textContent="";});
  if(rates)rates.addEventListener("change",function(e){
    if(e.target&&e.target.id==="energy-ref-choice"){
      var rate=doc.getElementById("energy-rate");if(rate)rate.value="";
      out.innerHTML="";err.textContent="";
    }
  });
  form.addEventListener("submit",function(e){
    e.preventDefault();out.innerHTML="";err.textContent="";
    var r=calculate({watts:value("energy-cost-watts"),hoursPerDay:value("energy-cost-hours"),daysPerMonth:value("energy-cost-days"),ratePerKwh:value("energy-rate"),currency:value("energy-currency")});
    if(!r.ok){err.textContent=r.error;return;}
    out.innerHTML='<h3>Estimated energy use and cost</h3><ul class="calc-list">'+
      '<li>Energy per day: <strong>'+r.dailyKwh.toFixed(4)+' kWh</strong></li>'+
      '<li>Energy per month ('+r.daysPerMonth+' days): <strong>'+r.monthlyKwh.toFixed(4)+' kWh</strong></li>'+
      '<li>Energy per year (365 days): <strong>'+r.annualKwh.toFixed(4)+' kWh</strong></li>'+
      '<li>Estimated monthly cost: <strong>'+money(r.monthlyCost,r.currency)+'</strong></li>'+
      '<li>Estimated yearly cost: <strong>'+money(r.annualCost,r.currency)+'</strong></li></ul>'+
      '<p class="calc-note">Based on the watts and hours you entered and the '+r.currency+' rate shown above. Actual use and bills can vary.</p>';
  });
  return{calculate:calculate};
}
return{calculate:calculate,init:init,money:money};
});
