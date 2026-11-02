import m from 'mongoose';
export default m.model('Furniture',new m.Schema({projectId:{type:m.Types.ObjectId,ref:'Project',index:true},roomId:m.Types.ObjectId,type:String,position:[Number],rotation:[Number],scale:{type:[Number],default:[1,1,1]},material:String,glbUrl:String}));
