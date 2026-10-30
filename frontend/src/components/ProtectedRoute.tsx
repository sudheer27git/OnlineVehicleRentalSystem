import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";
export default function ProtectedRoute({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loader">Loading your DriveEase account…</div>;
  if (!user) return <Navigate to="/login" replace/>;
  if (admin && user.role !== "admin") return <Navigate to="/" replace/>;
  return <>{children}</>;
}
