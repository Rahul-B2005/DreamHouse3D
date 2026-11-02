import {Router} from 'express';import protect from '../middleware/auth.js';
const r=Router();const W={one:1,two:2,three:3,four:4,five:5,six:6};
const num=(t,re,d)=>{const m=t.match(re);return m?(W[m[1]]??parseInt(m[1])):d};
// Rule-based fallback; plug an external LLM in here when available.
export const parsePrompt=(p='')=>{const t=p.toLowerCase();const has=k=>k.some(x=>t.includes(x));
const style=['minimalist','luxury','contemporary','traditional','tropical','industrial','modern'].find(s=>t.includes(s))||'modern';
return {floors:num(t,/(\d|one|two|three)[- ]?(?:floor|storey|story)/,has(['duplex'])?2:1),bedrooms:num(t,/(\d|one|two|three|four|five)[- ]?(?:bed|bhk)/,3),bathrooms:num(t,/(\d|one|two|three|four)[- ]?bath/,2),livingRoom:true,kitchen:true,diningRoom:true,garage:has(['garage']),garden:has(['garden','lawn']),pool:has(['pool']),style}};
r.post('/generate-house',protect,(req,res)=>{if(!req.body.prompt?.trim())return res.status(400).json({message:'Describe your house first'});res.json({config:parsePrompt(req.body.prompt),source:'fallback'})});
export default r;
