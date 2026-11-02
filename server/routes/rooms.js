import {Router} from 'express';import Room from '../models/Room.js';import Project from '../models/Project.js';import protect from '../middleware/auth.js';
const r=Router();r.use(protect);
r.post('/projects/:id/rooms',async(req,res)=>{if(!(await Project.exists({_id:req.params.id,userId:req.user._id})))return res.status(404).json({message:'Project or room not found'});res.status(201).json(await Room.create({...req.body,projectId:req.params.id}))});
const mine=async req=>{const rm=await Room.findById(req.params.id);return rm&&await Project.exists({_id:rm.projectId,userId:req.user._id})?rm:null};
r.put('/rooms/:id',async(req,res)=>{const rm=await mine(req);if(!rm)return res.status(404).json({message:'Project or room not found'});const {projectId,...b}=req.body;res.json(await Room.findByIdAndUpdate(rm._id,b,{new:true}))});
r.delete('/rooms/:id',async(req,res)=>{const rm=await mine(req);if(!rm)return res.status(404).json({message:'Project or room not found'});await rm.deleteOne();res.json({ok:true})});
export default r;
