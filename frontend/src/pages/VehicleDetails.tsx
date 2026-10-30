import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CheckCircle2, Fuel, MapPin, Settings2, Users } from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import type { Vehicle } from "../types";

export default function VehicleDetails() {
  const { id } = useParams(); const [vehicle,setVehicle]=useState<Vehicle|null>(null);
  const [start,setStart]=useState(""); const [end,setEnd]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  const {user}=useAuth(); const navigate=useNavigate();
  useEffect(()=>{if(id)api.vehicle(Number(id)).then(setVehicle).catch(e=>setMessage(e.message));},[id]);
  const days = start && end ? Math.max(0, Math.round((new Date(end+"T00:00:00").getTime()-new Date(start+"T00:00:00").getTime())/86400000)) : 0;
  const book=async()=>{if(!user){navigate("/login");return;} if(!vehicle||!start||!end){setMessage("Please choose pickup and return dates.");return;} setBusy(true);setMessage("");try{const b=await api.createBooking(vehicle.id,start,end);navigate(`/my-bookings?new=${b.id}`);}catch(e){setMessage(e instanceof Error?e.message:"Booking failed");}finally{setBusy(false);}};
  if(!vehicle) return <div className="page-loader">{message||"Loading vehicle…"}</div>;
  return <main className="page-shell"><Link to="/vehicles" className="back-link"><ArrowLeft size={16}/> Back to vehicles</Link><div className="detail-layout">
    <div className="detail-main"><img className="detail-image" src={vehicle.image_url} alt={vehicle.name}/><div className="detail-title"><div><p className="eyebrow">{vehicle.brand} · {vehicle.category}</p><h1>{vehicle.name}</h1><p className="muted"><MapPin size={15}/> {vehicle.district}, {vehicle.state}, {vehicle.country}</p></div><div className="detail-price"><strong>₹{vehicle.price_per_day.toLocaleString("en-IN")}</strong><span>per day</span></div></div><p className="detail-description">{vehicle.description}</p><div className="spec-grid"><div><Users/><b>{vehicle.seats} seats</b><small>Capacity</small></div><div><Fuel/><b>{vehicle.fuel}</b><small>Fuel type</small></div><div><Settings2/><b>{vehicle.transmission}</b><small>Transmission</small></div><div><CheckCircle2/><b>Available</b><small>Vehicle status</small></div></div></div>
    <aside className="booking-box"><p className="eyebrow">MAKE IT YOURS</p><h2>Reserve this ride</h2><label>Pickup date<input type="date" min={new Date().toISOString().slice(0,10)} value={start} onChange={e=>setStart(e.target.value)}/></label><label>Return date<input type="date" min={start||new Date().toISOString().slice(0,10)} value={end} onChange={e=>setEnd(e.target.value)}/></label><div className="booking-total"><span>{days} rental day{days===1?"":"s"}</span><strong>₹{(days*vehicle.price_per_day).toLocaleString("en-IN")}</strong></div>{message&&<div className="alert error">{message}</div>}<button className="btn btn-primary btn-full" disabled={busy||days<=0} onClick={book}>{busy?"Creating booking…":"Continue to booking"}</button><small className="booking-footnote"><CalendarDays size={14}/> No payment is collected at this step.</small></aside>
  </div></main>;
}
