import {Router} from 'express';import protect from '../middleware/auth.js';import {cost,energy,solar} from '../calc.js';
const r=Router();r.use(protect);
r.post('/cost',(q,s)=>s.json(cost(q.body)));r.post('/energy',(q,s)=>s.json(energy(q.body)));r.post('/solar',(q,s)=>s.json(solar(q.body)));
export default r;
