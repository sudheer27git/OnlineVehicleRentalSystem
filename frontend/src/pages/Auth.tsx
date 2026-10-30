import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CarFront, ShieldCheck } from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }: { mode: "login" | "register" }) {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const {signIn}=useAuth(); const navigate=useNavigate(); const location=useLocation();
  const submit=async(e:FormEvent)=>{e.preventDefault();setError("");setBusy(true);try{const data=mode==="login"?await api.login(email,password):await api.register(name,email,password);signIn(data);navigate(location.state?.from||"/vehicles",{replace:true});}catch(err){setError(err instanceof Error?err.message:"Unable to continue");}finally{setBusy(false);}};
  return <main className="auth-page"><div className="auth-visual"><div className="auth-visual-content"><Link className="brand brand-light" to="/"><span className="brand-mark"><CarFront/></span>drive<span>ease</span></Link><p className="eyebrow">THE OPEN ROAD IS YOURS</p><h1>Every journey<br/>starts <em>somewhere.</em></h1><p>Find a vehicle that fits your plans, your pace, and your sense of adventure.</p><div className="auth-promise"><ShieldCheck/> Secure account access</div></div></div><div className="auth-form-side"><form className="auth-form" onSubmit={submit}><p className="eyebrow">{mode==="login"?"WELCOME BACK":"JOIN THE JOURNEY"}</p><h2>{mode==="login"?"Good to see you.":"Create your account."}</h2><p className="muted">{mode==="login"?"Sign in to manage your bookings.":"A few details and you're ready to roll."}</p>
    {mode==="register"&&<label>Full name<input required minLength={2} value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label>}
    <label>Email address<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
    <label>Password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters"/></label>
    {error&&<div className="alert error">{error}</div>}<button className="btn btn-primary btn-full" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in":"Create account"}</button>
    <p className="auth-switch">{mode==="login"?"New to DriveEase?":"Already have an account?"} <Link to={mode==="login"?"/register":"/login"}>{mode==="login"?"Create an account":"Sign in"}</Link></p>
    <div className="demo-hint"><b>Local demo accounts</b><span>Customer: customer@onlinevehiclerental.com / Customer123!</span><span>Admin: admin@onlinevehiclerental.com / Admin123!</span></div>
  </form></div></main>;
}
