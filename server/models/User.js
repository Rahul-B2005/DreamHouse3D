import m from 'mongoose';
export default m.model('User',new m.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true},password:{type:String,required:true},role:{type:String,enum:['user','admin'],default:'user'}},{timestamps:{createdAt:true,updatedAt:false}}));
