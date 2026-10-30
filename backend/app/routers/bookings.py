from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from ..database import get_db
from ..models import Booking, Vehicle, User
from ..schemas import BookingCreate, BookingOut
from ..security import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", response_model=BookingOut, status_code=201)
def create_booking(data: BookingCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if data.start_date < date.today():
        raise HTTPException(status_code=400, detail="Pickup date cannot be in the past")
    if data.end_date <= data.start_date:
        raise HTTPException(status_code=400, detail="Return date must be after pickup date")
    vehicle = db.query(Vehicle).filter(Vehicle.id == data.vehicle_id, Vehicle.available.is_(True)).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle is unavailable")
    overlap = db.query(Booking).filter(
        Booking.vehicle_id == vehicle.id,
        Booking.status != "CANCELLED",
        Booking.start_date < data.end_date,
        Booking.end_date > data.start_date
    ).first()
    if overlap:
        raise HTTPException(status_code=409, detail="This vehicle is already booked for those dates")
    days = (data.end_date - data.start_date).days
    booking = Booking(user_id=user.id, vehicle_id=vehicle.id, start_date=data.start_date,
                      end_date=data.end_date, total_days=days,
                      total_price=round(days * vehicle.price_per_day, 2))
    db.add(booking); db.commit()
    return db.query(Booking).options(joinedload(Booking.vehicle)).filter(Booking.id == booking.id).first()

@router.get("/mine", response_model=list[BookingOut])
def my_bookings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Booking).options(joinedload(Booking.vehicle)).filter(Booking.user_id == user.id).order_by(Booking.created_at.desc()).all()

@router.post("/{booking_id}/demo-pay", response_model=BookingOut)
def demo_pay(booking_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    booking = db.query(Booking).options(joinedload(Booking.vehicle)).filter(Booking.id == booking_id, Booking.user_id == user.id).first()
    if not booking: raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "CANCELLED": raise HTTPException(status_code=400, detail="Cancelled bookings cannot be paid")
    booking.payment_status = "PAID"
    booking.status = "CONFIRMED"
    db.commit(); db.refresh(booking)
    return booking

@router.post("/{booking_id}/cancel", response_model=BookingOut)
def cancel_booking(booking_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    booking = db.query(Booking).options(joinedload(Booking.vehicle)).filter(Booking.id == booking_id, Booking.user_id == user.id).first()
    if not booking: raise HTTPException(status_code=404, detail="Booking not found")
    if booking.status == "CANCELLED": raise HTTPException(status_code=400, detail="Booking is already cancelled")
    booking.status = "CANCELLED"
    db.commit(); db.refresh(booking)
    return booking
