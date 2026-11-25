"use strict";
const assert=require("node:assert/strict");
const api=require("../website/smart-plug-energy-cost.js");
let n=0;function t(name,fn){fn();n++;console.log("PASS "+name);}
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-10,String(a)+" != "+String(b));
t("standby bulb: 0.5 W × 8,760 h/year = 4.38 kWh/year",()=>{
 const r=api.calculate({watts:0.5,hoursPerDay:24,daysPerMonth:30,ratePerKwh:0.2,currency:"USD"});
 assert.equal(r.ok,true);near(r.annualKwh,4.38);near(r.annualCost,0.876);near(r.monthlyKwh,0.36);near(r.monthlyCost,0.072);
});
t("running example: 60 W × 5 h/day × 30 days = 9 kWh/month",()=>{
 const r=api.calculate({watts:60,hoursPerDay:5,daysPerMonth:30,ratePerKwh:0.25,currency:"GBP"});
 near(r.dailyKwh,0.3);near(r.monthlyKwh,9);near(r.annualKwh,109.5);near(r.monthlyCost,2.25);near(r.annualCost,27.375);
});
t("fractional watts and a non-US currency are preserved",()=>{
 const r=api.calculate({watts:1.2,hoursPerDay:8,daysPerMonth:31,ratePerKwh:0.31,currency:"EUR"});
 near(r.monthlyKwh,0.2976);assert.equal(r.currency,"EUR");
});
t("zero watts and zero rate are explicit valid values",()=>{
 const a=api.calculate({watts:0,hoursPerDay:24,daysPerMonth:30,ratePerKwh:0.2,currency:"CAD"});
 const b=api.calculate({watts:5,hoursPerDay:1,daysPerMonth:30,ratePerKwh:0,currency:"CAD"});
 near(a.annualKwh,0);near(b.monthlyCost,0);
});
t("blank values are not silently converted to zero",()=>{
 for(const key of ["watts","hoursPerDay","daysPerMonth","ratePerKwh"]){
  const x={watts:1,hoursPerDay:1,daysPerMonth:30,ratePerKwh:0.2,currency:"USD"};x[key]="";
  assert.equal(api.calculate(x).ok,false,key);
 }
});
t("physical hour/day and calendar-day bounds are enforced",()=>{
 for(const [key,val] of [["watts",-1],["hoursPerDay",-0.1],["hoursPerDay",24.1],["daysPerMonth",0],["daysPerMonth",32],["ratePerKwh",-0.01]]) {
  const x={watts:1,hoursPerDay:1,daysPerMonth:30,ratePerKwh:0.2,currency:"USD"};x[key]=val;
  assert.equal(api.calculate(x).ok,false,key+"="+val);
 }
});
t("overflowing derived energy or cost is rejected",()=>{assert.equal(api.calculate({watts:1e308,hoursPerDay:24,daysPerMonth:31,ratePerKwh:100,currency:"USD"}).ok,false);});
t("currency must be an explicit ISO three-letter code",()=>{
 assert.equal(api.calculate({watts:1,hoursPerDay:1,daysPerMonth:30,ratePerKwh:0.2,currency:""}).ok,false);
 assert.equal(api.calculate({watts:1,hoursPerDay:1,daysPerMonth:30,ratePerKwh:0.2,currency:"$"}).ok,false);
});
t("money output retains the ISO currency code",()=>assert.equal(api.money(1.2,"EUR"),"EUR 1.20"));
console.log(n+" Smart Plug energy-cost fixtures passed");
