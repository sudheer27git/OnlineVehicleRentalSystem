import { Link, NavLink, useNavigate } from "react-router-dom";
import { CarFront, Menu, X, UserRound, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const logout = () => { signOut(); setOpen(false); navigate("/"); };
  return <header className="navbar"><div className="nav-inner">
    <Link className="brand" to="/"><span className="brand-mark"><CarFront size={22}/></span>drive<span>ease</span></Link>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? "nav-links open" : "nav-links"}>
      <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/vehicles" onClick={() => setOpen(false)}>Explore cars</NavLink>
      {user && <NavLink to="/my-bookings" onClick={() => setOpen(false)}>My bookings</NavLink>}
      {user?.role === "admin" && <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>}
    </nav>
    <div className="nav-actions">{user ? <><span className="welcome"><UserRound size={16}/> {user.name.split(" ")[0]}</span><button className="btn btn-outline btn-small" onClick={logout}><LogOut size={15}/> Logout</button></> : <><Link className="login-link" to="/login">Log in</Link><Link className="btn btn-primary btn-small" to="/register">Get started</Link></>}</div>
  </div></header>;
}
