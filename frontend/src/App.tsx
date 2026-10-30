import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import Auth from "./pages/Auth";
import Bookings from "./pages/Bookings";
import Admin from "./pages/Admin";
import { AuthProvider } from "./context/AuthContext";

function Footer(){return <footer className="footer"><div className="footer-inner"><div className="brand brand-light">drive<span>ease</span></div><p>Make room for the journey.</p><small>© {new Date().getFullYear()} DriveEase. Built for learning and exploration.</small></div></footer>}
function Layout(){return <><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/vehicles" element={<Vehicles/>}/><Route path="/vehicles/:id" element={<VehicleDetails/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/my-bookings" element={<ProtectedRoute><Bookings/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/><Route path="*" element={<main className="page-shell"><h1>Page not found</h1></main>}/></Routes><Footer/></>}
export default function App(){return <AuthProvider><BrowserRouter><Layout/></BrowserRouter></AuthProvider>}
