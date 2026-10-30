import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import type { Vehicle } from "../types";

const blank = {
  name: "", brand: "", category: "SUV", transmission: "Automatic", fuel: "Petrol",
  seats: 5, price_per_day: 2500,
  image_url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000",
  description: "", country: "India" as const, state: "Andhra Pradesh", district: "Vizianagaram",
  location: "Vizianagaram", available: true,
};

type VehicleForm = typeof blank;

export default function Admin() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState<VehicleForm>(blank);
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const load = () => api.vehicles().then(setVehicles).catch(e => setError(e.message));
  useEffect(() => { load(); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setError(""); setOk("");
    const payload = { ...form, location: form.district, country: "India" as const };
    try {
      if (editing) await api.updateVehicle(editing, payload);
      else await api.createVehicle(payload);
      setOk(editing ? "Vehicle updated." : "Vehicle added to the India fleet.");
      setForm(blank); setEditing(null); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Save failed"); }
  };

  const edit = (v: Vehicle) => {
    setEditing(v.id);
    setForm({ ...v, country: "India", location: v.district });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const remove = async (id: number) => {
    if (!confirm("Delete this vehicle?")) return;
    try { await api.deleteVehicle(id); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : "Delete failed"); }
  };
  const field = <K extends keyof VehicleForm>(key: K, label: string, type = "text") => (
    <label>{label}<input required type={type} value={String(form[key])}
      onChange={e => setForm({ ...form, [key]: (type === "number" ? Number(e.target.value) : e.target.value) as VehicleForm[K] })}/></label>
  );

  return <main className="page-shell">
    <div className="page-heading left"><p className="eyebrow">FLEET CONTROL · INDIA</p><h1>Admin <em>dashboard.</em></h1><p className="muted">Manage vehicles and the Indian regions where customers can rent them.</p></div>
    {error && <div className="alert error">{error}</div>}{ok && <div className="alert success">{ok}</div>}
    <div className="admin-layout">
      <form className="admin-form" onSubmit={submit}>
        <h2>{editing ? "Edit vehicle" : "Add a vehicle"}</h2>
        <div className="country-lock"><span>Country region</span><strong>🇮🇳 India</strong><small>DriveEase currently accepts Indian vehicle listings only.</small></div>
        {field("name", "Vehicle name")}{field("brand", "Brand")}
        <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{["SUV", "Sedan", "Hatchback", "MUV", "Bike"].map(x => <option key={x}>{x}</option>)}</select></label>
        {field("price_per_day", "Price per day (₹)", "number")}{field("seats", "Seats", "number")}
        <div className="region-fields"><div>{field("state", "State / Union Territory")}</div><div>{field("district", "District")}</div></div>
        {field("image_url", "Image URL")}
        <label>Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/></label>
        <div className="form-row">
          <label>Transmission<select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })}><option>Automatic</option><option>Manual</option></select></label>
          <label>Fuel<select value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value })}><option>Petrol</option><option>Diesel</option><option>Electric</option></select></label>
        </div>
        <button className="btn btn-primary btn-full">{editing ? "Save changes" : "Add vehicle"}</button>
        {editing && <button type="button" className="btn btn-outline btn-full" onClick={() => { setEditing(null); setForm(blank); }}>Cancel edit</button>}
      </form>
      <section className="admin-vehicles"><h2>India fleet inventory <span>{vehicles.length} vehicles</span></h2>
        {vehicles.map(v => <div className="admin-vehicle" key={v.id}><img src={v.image_url} alt=""/><div><b>{v.name}</b><small>{v.district}, {v.state} · ₹{v.price_per_day}/day</small></div><button className="btn btn-outline btn-small" onClick={() => edit(v)}>Edit</button><button className="btn btn-quiet btn-small" onClick={() => remove(v.id)}>Delete</button></div>)}
      </section>
    </div>
  </main>;
}
