import React from 'react';
const FILL={bed:'#3b3566',wet:'#0f5a4a',common:'#2f3a4d'};
export default function FloorPlanner({rooms=[],plot=[30,30]}){
if(!rooms.length)return <div className="page"><p>No floor plan yet. Pick a 2BHK or 3BHK template to start.</p></div>;
const S=Math.min(900/plot[0],560/plot[1]),W=plot[0]*S,H=plot[1]*S,sq=a=>(a*0.092903).toFixed(1);
return <div style={{height:'100%',overflow:'auto',background:'#0c1626',display:'grid',placeItems:'center',padding:16}}>
<svg width="100%" style={{maxWidth:W+60}} viewBox={`-30 -30 ${W+60} ${H+60}`} role="img" aria-label="2D floor plan">
{Array.from({length:plot[0]+1}).map((_,i)=><line key={'v'+i} x1={i*S} y1="0" x2={i*S} y2={H} stroke="#1c2d47" strokeWidth=".5"/>)}
{Array.from({length:plot[1]+1}).map((_,i)=><line key={'h'+i} x1="0" y1={i*S} x2={W} y2={i*S} stroke="#1c2d47" strokeWidth=".5"/>)}
{rooms.map(r=><g key={r.name}><rect x={r.x*S} y={r.y*S} width={r.w*S} height={r.l*S} fill={FILL[r.kind]||FILL.common} stroke="#e8edf5" strokeWidth="2"/>
<text x={(r.x+r.w/2)*S} y={(r.y+r.l/2)*S-6} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="600">{r.name}</text>
<text x={(r.x+r.w/2)*S} y={(r.y+r.l/2)*S+12} textAnchor="middle" fill="#cbd5e1" fontSize="11">{r.w} x {r.l} ft · {r.w*r.l} sq ft / {sq(r.w*r.l)} sq m</text></g>)}
<text x="0" y={H+20} fill="#94a3b8" fontSize="12">Plot {plot[0]} x {plot[1]} ft</text></svg></div>}
