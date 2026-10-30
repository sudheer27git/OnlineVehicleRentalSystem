import { Link } from "react-router-dom";
import { Users, Fuel, Settings2, MapPin, ArrowUpRight } from "lucide-react";
import type { Vehicle } from "../types";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return <article className="vehicle-card">
    <Link to={`/vehicles/${vehicle.id}`} className="vehicle-image-wrap">
      <img src={vehicle.image_url} alt={vehicle.name} className="vehicle-image" loading="lazy"/>
      <span className="category-pill">{vehicle.category}</span><span className="image-arrow"><ArrowUpRight size={18}/></span>
    </Link>
    <div className="vehicle-info">
      <div className="vehicle-title-row"><div><p className="eyebrow">{vehicle.brand}</p><h3>{vehicle.name}</h3></div><div className="price"><strong>₹{vehicle.price_per_day.toLocaleString("en-IN")}</strong><small>/ day</small></div></div>
      <div className="vehicle-meta"><span><Users size={15}/>{vehicle.seats} seats</span><span><Fuel size={15}/>{vehicle.fuel}</span><span><Settings2 size={15}/>{vehicle.transmission}</span></div>
      <div className="vehicle-bottom"><span className="location"><MapPin size={14}/>{vehicle.district}, {vehicle.state}</span><Link to={`/vehicles/${vehicle.id}`} className="text-link">View details <ArrowUpRight size={15}/></Link></div>
    </div>
  </article>;
}
