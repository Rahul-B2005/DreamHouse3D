import m from 'mongoose';
export default m.model('Room',new m.Schema({projectId:{type:m.Types.ObjectId,ref:'Project',index:true},name:String,width:Number,length:Number,height:{type:Number,default:10},position:[Number],objects:[m.Schema.Types.Mixed]}));
