import React,{useState} from 'react';import {useNavigate,Link} from 'react-router-dom';import api,{errMsg} from '../services/api';
export function AuthForm({register}){const [f,setF]=useState({name:'',email:'',password:'',confirm:''});const [err,setErr]=useState('');const nav=useNavigate();
const submit=async e=>{e.preventDefault();setErr('');if(register&&f.password!==f.confirm)return setErr('Passwords do not match');
try{const {data}=await api.post(register?'/auth/register':'/auth/login',f);localStorage.setItem('token',data.token);localStorage.setItem('user',JSON.stringify(data.user));nav('/dashboard')}catch(x){setErr(errMsg(x))}};
const k=n=>({value:f[n],onChange:e=>setF({...f,[n]:e.target.value}),required:true});
return <div className="page" style={{maxWidth:420}}><form className="card" onSubmit={submit}><h2>{register?'Create your account':'Log in'}</h2>{err&&<div className="toast">{err}</div>}
{register&&<input placeholder="Name" {...k('name')}/>}<input type="email" placeholder="Email" {...k('email')}/><input type="password" placeholder="Password" {...k('password')}/>{register&&<input type="password" placeholder="Confirm password" {...k('confirm')}/>}
<button className="btn">{register?'Register':'Log in'}</button><p>{register?<Link to="/login">Have an account?</Link>:<Link to="/register">Create an account</Link>}</p></form></div>}
export default()=><AuthForm/>;
