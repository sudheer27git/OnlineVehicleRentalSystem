import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api";
import type { User, AuthResponse } from "../types";

interface AuthValue { user: User | null; loading: boolean; signIn: (data: AuthResponse) => void; signOut: () => void; }
const AuthContext = createContext<AuthValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("onlinevehiclerental_token")) { setLoading(false); return; }
    api.me().then(setUser).catch(() => localStorage.removeItem("onlinevehiclerental_token")).finally(() => setLoading(false));
  }, []);
  const signIn = (data: AuthResponse) => { localStorage.setItem("onlinevehiclerental_token", data.access_token); setUser(data.user); };
  const signOut = () => { localStorage.removeItem("onlinevehiclerental_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
