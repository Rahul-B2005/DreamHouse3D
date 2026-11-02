import React,{useState} from 'react';
const TOOLS=[['live-house','Live house','Animated day and night cycle, pool, car and camera views.'],['build-your-home','Build your home','Six-step builder: plot, floors, rooms, extras, colours, estimate.'],['furniture-library','Furniture library','Place, move, rotate and restyle 12 furniture items in a 2BHK or 3BHK plan.']];
export default()=>{const [t,setT]=useState(TOOLS[2][0]);
return <div className="page"><h1>Design tools</h1><p className="note">Standalone 3D tools. They keep data in your browser and are not yet linked to saved projects.</p>
<div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}>{TOOLS.map(x=><button key={x[0]} className={'btn'+(t===x[0]?'':' ghost')} onClick={()=>setT(x[0])}>{x[1]}</button>)}</div>
<p className="note">{TOOLS.find(x=>x[0]===t)[2]} <a href={`/showcase/${t}.html`} target="_blank" rel="noreferrer">Open full screen</a></p>
<iframe title={t} src={`/showcase/${t}.html`} style={{width:'100%',height:'70vh',border:'1px solid var(--line)',borderRadius:12,background:'#fff'}}/></div>};
