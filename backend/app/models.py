from datetime import datetime, date
from sqlalchemy import String, Integer, Float, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(20), default="customer")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    bookings = relationship("Booking", back_populates="customer")


class Vehicle(Base):
    __tablename__ = "vehicles"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    brand: Mapped[str] = mapped_column(String(80))
    category: Mapped[str] = mapped_column(String(40))
    transmission: Mapped[str] = mapped_column(String(30), default="Automatic")
    fuel: Mapped[str] = mapped_column(String(30), default="Petrol")
    seats: Mapped[int] = mapped_column(Integer, default=5)
    price_per_day: Mapped[float] = mapped_column(Float)
    image_url: Mapped[str] = mapped_column(Text)
    description: Mapped[str] = mapped_column(Text, default="")
    # DriveEase is intentionally restricted to India.
    country: Mapped[str] = mapped_column(String(80), default="India")
    state: Mapped[str] = mapped_column(String(120), default="Andhra Pradesh")
    district: Mapped[str] = mapped_column(String(120), default="Vizianagaram")
    # Kept for compatibility with the earlier project version; this mirrors district.
    location: Mapped[str] = mapped_column(String(120), default="Vizianagaram")
    available: Mapped[bool] = mapped_column(Boolean, default=True)
    bookings = relationship("Booking", back_populates="vehicle")


class Booking(Base):
    __tablename__ = "bookings"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    vehicle_id: Mapped[int] = mapped_column(ForeignKey("vehicles.id"))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    total_days: Mapped[int] = mapped_column(Integer)
    total_price: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(30), default="CONFIRMED")
    payment_status: Mapped[str] = mapped_column(String(30), default="PENDING")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    customer = relationship("User", back_populates="bookings")
    vehicle = relationship("Vehicle", back_populates="bookings")
