import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Headphones, Wallet, Search, MapPin, CarFront, Sparkles } from "lucide-react";
import { api } from "../api";
import type { LocationAvailability, Vehicle } from "../types";
import VehicleCard from "../components/VehicleCard";

export default function Home() {
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<LocationAvailability | null>(null);
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  const selectedState = locations?.states.find(item => item.name === state);
  useEffect(() => {
    api.vehicles().then(v => setFeatured(v.slice(0, 3))).catch(() => {});
    api.locations().then(setLocations).catch(() => {});
  }, []);
  const search = () => {
    const query = new URLSearchParams();
    if (state) query.set("state", state);
    if (district) query.set("district", district);
    if (category !== "All") query.set("category", category);
    navigate(`/vehicles?${query.toString()}`);
  };
  return <main>
    <section className="hero"><div className="hero-overlay"></div><div className="hero-content">
      <div className="hero-kicker"><Sparkles size={15}/> YOUR JOURNEY, YOUR WAY · INDIA</div>
      <h1>Find the ride.<br/><em>Feel the freedom.</em></h1>
      <p className="hero-copy">From quick city escapes to long road trips, find a vehicle that makes every mile memorable.</p>
      <div className="hero-buttons"><Link to="/vehicles" className="btn btn-primary btn-large">Explore vehicles <ArrowRight size={18}/></Link><span className="hero-note">India-only rentals. Simple booking.</span></div>
      <div className="search-panel">
        <div className="search-field location-selector"><MapPin/><label>Pickup region · India<div className="location-pair"><select value={state} onChange={e=>{setState(e.target.value);setDistrict("");}}><option value="">All states</option>{locations?.states.map(item=><option key={item.name} value={item.name}>{item.name} ({item.vehicle_count})</option>)}</select><select value={district} disabled={!state} onChange={e=>setDistrict(e.target.value)}><option value="">All districts</option>{selectedState?.districts.map(item=><option key={item.name} value={item.name}>{item.name} ({item.vehicle_count})</option>)}</select></div></label></div>
        <div className="search-field"><CarFront/><label>Vehicle type<select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option><option>SUV</option><option>Sedan</option><option>Hatchback</option><option>MUV</option><option>Bike</option></select></label></div>
        <button className="btn btn-primary search-submit" onClick={search}><Search size={18}/> Find a ride</button>
      </div>
    </div><div className="hero-stats"><div><strong>{locations?.total_vehicles ?? "…"}</strong><span>Listed vehicles</span></div><div><strong>{locations?.states.length ?? "…"}</strong><span>States with availability</span></div><div><strong>India</strong><span>Rental region</span></div></div></section>
    <section className="section trust-strip"><div><ShieldCheck/><span><b>Reliable rides</b><small>Vehicles for every plan</small></span></div><div><Wallet/><span><b>Clear pricing</b><small>Know your cost upfront</small></span></div><div><Headphones/><span><b>Here to help</b><small>Support when you need it</small></span></div></section>
    <section className="section"><div className="section-heading"><div><p className="eyebrow">HANDPICKED FOR YOU</p><h2>Popular <em>rides</em></h2><p className="muted">A few favourites to get your next trip started.</p></div><Link to="/vehicles" className="text-link">View all vehicles <ArrowRight size={16}/></Link></div>
      <div className="vehicle-grid">{featured.map(v=><VehicleCard key={v.id} vehicle={v}/>)}</div>
    </section>
    <section className="journey-banner"><div><p className="eyebrow">READY WHEN YOU ARE</p><h2>Good roads are calling.</h2><p>Pick your state, district and vehicle, then let the journey begin.</p></div><Link to="/vehicles" className="btn btn-light">Browse the fleet <ArrowRight size={17}/></Link></section>
  </main>;
}
