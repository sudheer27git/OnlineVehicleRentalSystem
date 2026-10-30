import type { AuthResponse, Booking, LocationAvailability, Vehicle, User } from "./types";

const BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export function getToken() { return localStorage.getItem("onlinevehiclerental_token"); }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = "Something went wrong";
    try { const body = await response.json(); message = body.detail || message; } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
export const api = {
  vehicles: (search = "", category = "", state = "", district = "") => request<Vehicle[]>(`/vehicles?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`),
  locations: () => request<LocationAvailability>("/locations"),
  vehicle: (id: number) => request<Vehicle>(`/vehicles/${id}`),
  login: (email: string, password: string) => request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  me: () => request<User>("/auth/me"),
  bookings: () => request<Booking[]>("/bookings/mine"),
  createBooking: (vehicle_id: number, start_date: string, end_date: string) => request<Booking>("/bookings", { method: "POST", body: JSON.stringify({ vehicle_id, start_date, end_date }) }),
  pay: (id: number) => request<Booking>(`/bookings/${id}/demo-pay`, { method: "POST" }),
  cancel: (id: number) => request<Booking>(`/bookings/${id}/cancel`, { method: "POST" }),
  createVehicle: (data: Omit<Vehicle, "id">) => request<Vehicle>("/vehicles", { method: "POST", body: JSON.stringify(data) }),
  updateVehicle: (id: number, data: Omit<Vehicle, "id">) => request<Vehicle>(`/vehicles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteVehicle: (id: number) => request<void>(`/vehicles/${id}`, { method: "DELETE" })
};
