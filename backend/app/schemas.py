from datetime import date, datetime
from typing import Literal
from pydantic import BaseModel, EmailStr, ConfigDict, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    model_config = ConfigDict(from_attributes=True)


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class VehicleBase(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    brand: str = Field(min_length=2, max_length=80)
    category: str
    transmission: str = "Automatic"
    fuel: str = "Petrol"
    seats: int = Field(default=5, ge=1, le=60)
    price_per_day: float = Field(gt=0)
    image_url: str
    description: str = ""
    country: Literal["India"] = "India"
    state: str = Field(min_length=2, max_length=120)
    district: str = Field(min_length=2, max_length=120)
    # Legacy field retained for compatibility with earlier project iterations.
    location: str = ""
    available: bool = True


class VehicleCreate(VehicleBase):
    pass


class VehicleOut(VehicleBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class BookingCreate(BaseModel):
    vehicle_id: int
    start_date: date
    end_date: date


class BookingOut(BaseModel):
    id: int
    vehicle_id: int
    start_date: date
    end_date: date
    total_days: int
    total_price: float
    status: str
    payment_status: str
    created_at: datetime
    vehicle: VehicleOut
    model_config = ConfigDict(from_attributes=True)
