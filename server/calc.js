// Planning estimates only. Keep in sync with client/src/utils/*Calculator.js
const n=(v,d)=>Number.isFinite(+v)&&+v>0?+v:d;
export const cost=({area=1500,costPerSqFt=1800,furnitureCount=20,pool=false,garden=false,solarKw=0})=>{area=n(area,1500);costPerSqFt=n(costPerSqFt,1800);
const construction=area*costPerSqFt,materials=construction*.18,furniture=furnitureCount*15000,electrical=area*120,plumbing=area*90,landscaping=(garden?150000:30000)+(pool?600000:0),solarCost=solarKw*55000;
return {construction,materials,furniture,electrical,plumbing,landscaping,solar:solarCost,total:construction+materials+furniture+electrical+plumbing+landscaping+solarCost,note:'Planning estimate only'}};
export const energy=({area=1500,floors=1,glazing=.2,solarKw=0})=>{area=n(area,1500);const monthly=Math.round(area*.18*(1+.05*(floors-1)));const score=Math.max(40,Math.min(98,Math.round(88-glazing*40+solarKw*2)));
return {monthlyKwh:monthly,annualKwh:monthly*12,efficiencyScore:score,note:'Planning estimate only'}};
export const solar=({roofArea=800,rate=8,panelWatt=550})=>{roofArea=n(roofArea,800);const panelSqFt=21.5;const panels=Math.floor(roofArea*.6/panelSqFt);const kw=+(panels*panelWatt/1000).toFixed(1);const monthly=Math.round(kw*120);
return {roofArea,panels,panelWatt,capacityKw:kw,monthlyKwh:monthly,annualKwh:monthly*12,monthlySavings:monthly*rate,note:'Planning estimate only'}};
