import {Router} from 'express';import protect from '../middleware/auth.js';import admin from '../middleware/admin.js';import User from '../models/User.js';import Project from '../models/Project.js';
const r=Router();r.use(protect,admin);
const g=f=>Project.aggregate([{$group:{_id:f,n:{$sum:1}}},{$sort:{_id:1}}]);
r.get('/stats',async(q,s)=>{const [users,projects,completed,agg,byStyle,byType,byMonth]=await Promise.all([User.countDocuments(),Project.countDocuments(),Project.countDocuments({status:'completed'}),Project.aggregate([{$group:{_id:null,avg:{$avg:'$budget'},sum:{$sum:'$budget'}}}]),g('$style'),g('$houseType'),g({$dateToString:{format:'%Y-%m',date:'$createdAt'}})]);
s.json({users,projects,active:projects-completed,completed,avgBudget:agg[0]?.avg||0,totalValue:agg[0]?.sum||0,byStyle,byType,byMonth})});
export default r;
