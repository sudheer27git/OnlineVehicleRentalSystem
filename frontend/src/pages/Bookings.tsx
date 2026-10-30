import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CalendarDays, MapPin, CreditCard, XCircle } from "lucide-react";
import { api } from "../api";
import type { Booking } from "../types";

export default function Bookings() {
  const [items,setItems]=useState<Booking[]>([]); const [error,setError]=useState(""); const [busy,setBusy]=useState<number|null>(null);
  const [params]=useSearchParams();
  const load=()=>api.bookings().then(setItems).catch(e=>setError(e.message));
  useEffect(()=>{load();},[]);
  const action=async(id:number,kind:"pay"|"cancel")=>{setBusy(id);setError("");try{if(kind==="pay")await api.pay(id);else await api.cancel(id);await load();}catch(e){setError(e instanceof Error?e.message:"Action failed");}finally{setBusy(null);}};
  return <main className="page-shell"><div className="page-heading left"><p className="eyebrow">YOUR DRIVE EASE ACCOUNT</p><h1>My <em>bookings.</em></h1><p className="muted">All your upcoming plans, in one place.</p></div>{params.get("new")&&<div className="alert success">Your booking has been created. Complete the demo payment below to mark it as paid.</div>}{error&&<div className="alert error">{error}</div>}
    {items.length===0?<div className="empty-state"><span>🗓️</span><h3>No bookings yet</h3><p>Your next adventure is waiting.</p><Link className="btn btn-primary" to="/vehicles">Explore vehicles</Link></div>:<div className="booking-list">{items.map(b=><article className="booking-card" key={b.id}><img src={b.vehicle.image_url} alt={b.vehicle.name}/><div className="booking-info"><p className="eyebrow">BOOKING #{b.id}</p><h3>{b.vehicle.name}</h3><p><CalendarDays size={15}/>{b.start_date} → {b.end_date} · {b.total_days} days</p><p><MapPin size={15}/>{b.vehicle.district}, {b.vehicle.state}, {b.vehicle.country}</p></div><div className="booking-side"><strong>₹{b.total_price.toLocaleString("en-IN")}</strong><span className={`status ${b.status.toLowerCase()}`}>{b.status}</span><span className={`status ${b.payment_status.toLowerCase()}`}>Payment: {b.payment_status}</span>{b.status!=="CANCELLED"&&<div className="booking-actions">{b.payment_status!=="PAID"&&<button className="btn btn-primary btn-small" disabled={busy===b.id} onClick={()=>action(b.id,"pay")}><CreditCard size={14}/> Demo pay</button>}<button className="btn btn-quiet btn-small" disabled={busy===b.id} onClick={()=>action(b.id,"cancel")}><XCircle size={14}/> Cancel</button></div>}</div></article>)}</div>}
    <p className="fine-print">Demo payment updates the booking record only. No real payment is processed.</p>
  </main>;
}
