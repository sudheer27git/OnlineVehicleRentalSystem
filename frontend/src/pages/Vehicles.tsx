import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, CarFront } from "lucide-react";
import { api } from "../api";
import type { LocationAvailability, Vehicle } from "../types";
import VehicleCard from "../components/VehicleCard";

export default function Vehicles() {
  const [params] = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [locations, setLocations] = useState<LocationAvailability | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [state, setState] = useState(params.get("state") || "");
  const [district, setDistrict] = useState(params.get("district") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedState = locations?.states.find(item => item.name === state);
  const districts = selectedState?.districts ?? [];

  useEffect(() => {
    api.locations().then(setLocations).catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    api.vehicles(search, category, state, district)
      .then(setVehicles)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, category, state, district]);

  const clearFilters = () => { setSearch(""); setCategory("All"); setState(""); setDistrict(""); };

  return <main className="page-shell">
    <div className="page-heading">
      <p className="eyebrow">THE DRIVE EASE COLLECTION · INDIA</p>
      <h1>Choose your <em>ride.</em></h1>
      <p className="muted">Explore vehicles by Indian state and district. Availability is based on our listed fleet.</p>
    </div>
    <div className="filter-bar india-filter-bar">
      <div className="search-input"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search vehicle, brand or region…"/></div>
      <div className="select-filter"><MapPin size={17}/><label className="filter-label">State<select value={state} onChange={e=>{setState(e.target.value);setDistrict("");}}><option value="">All available states</option>{locations?.states.map(item=><option key={item.name} value={item.name}>{item.name} ({item.vehicle_count})</option>)}</select></label></div>
      <div className="select-filter"><MapPin size={17}/><label className="filter-label">District<select value={district} disabled={!state} onChange={e=>setDistrict(e.target.value)}><option value="">{state ? "All available districts" : "Select state first"}</option>{districts.map(item=><option key={item.name} value={item.name}>{item.name} ({item.vehicle_count})</option>)}</select></label></div>
      <div className="select-filter"><SlidersHorizontal size={17}/><label className="filter-label">Vehicle<select value={category} onChange={e=>setCategory(e.target.value)}><option>All</option><option>SUV</option><option>Sedan</option><option>Hatchback</option><option>MUV</option><option>Bike</option></select></label></div>
    </div>
    <div className="availability-summary"><span><b>Country:</b> India</span><span><b>States with vehicles:</b> {locations?.states.length ?? "…"}</span><span><b>Listed vehicles:</b> {vehicles.length}</span></div>
    {error && <div className="alert error">{error}. Make sure the backend is running.</div>}
    <p className="result-count">{vehicles.length} vehicle{vehicles.length===1?"":"s"} available{district ? ` in ${district}` : state ? ` in ${state}` : " across India"}</p>
    {loading ? <div className="page-loader">Finding available vehicles in India…</div> : vehicles.length ? <div className="vehicle-grid">{vehicles.map(v=><VehicleCard key={v.id} vehicle={v}/>)}</div> : <div className="empty-state"><span><CarFront size={34}/></span><h3>No vehicles found in this region</h3><p>Try another state or district, or clear your filters.</p><button className="btn btn-outline" onClick={clearFilters}>Clear filters</button></div>}
  </main>;
}
