export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
}

export interface Vehicle {
  id: number;
  name: string;
  brand: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number;
  price_per_day: number;
  image_url: string;
  description: string;
  country: "India";
  state: string;
  district: string;
  location: string;
  available: boolean;
}

export interface DistrictAvailability {
  name: string;
  vehicle_count: number;
}

export interface StateAvailability {
  name: string;
  vehicle_count: number;
  districts: DistrictAvailability[];
}

export interface LocationAvailability {
  country: "India";
  country_code: "IN";
  states: StateAvailability[];
  total_vehicles: number;
}

export interface Booking {
  id: number;
  vehicle_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
  vehicle: Vehicle;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
