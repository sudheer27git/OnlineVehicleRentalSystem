from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Vehicle
from ..schemas import VehicleOut, VehicleCreate
from ..security import require_admin

router = APIRouter(prefix="/api/vehicles", tags=["Vehicles"])


def normalized_vehicle_data(data: VehicleCreate) -> dict:
    values = data.model_dump()
    # Country is fixed to India in the schema; keep the legacy location field in sync.
    values["country"] = "India"
    values["state"] = values["state"].strip()
    values["district"] = values["district"].strip()
    values["location"] = values["district"]
    return values


@router.get("", response_model=list[VehicleOut])
def list_vehicles(search: str = "", category: str = "", state: str = "", district: str = "", db: Session = Depends(get_db)):
    # The customer catalogue can never return vehicles outside India.
    q = db.query(Vehicle).filter(Vehicle.country == "India", Vehicle.available.is_(True))
    if search:
        term = f"%{search}%"
        q = q.filter(
            (Vehicle.name.ilike(term)) |
            (Vehicle.brand.ilike(term)) |
            (Vehicle.state.ilike(term)) |
            (Vehicle.district.ilike(term))
        )
    if category and category.lower() != "all":
        q = q.filter(Vehicle.category.ilike(category))
    if state:
        q = q.filter(Vehicle.state.ilike(state.strip()))
    if district:
        q = q.filter(Vehicle.district.ilike(district.strip()))
    return q.order_by(Vehicle.id.desc()).all()


@router.get("/{vehicle_id}", response_model=VehicleOut)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id, Vehicle.country == "India").first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found in the India rental region")
    return vehicle


@router.post("", response_model=VehicleOut, status_code=201)
def create_vehicle(data: VehicleCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    vehicle = Vehicle(**normalized_vehicle_data(data))
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleOut)
def update_vehicle(vehicle_id: int, data: VehicleCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id, Vehicle.country == "India").first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    for key, value in normalized_vehicle_data(data).items():
        setattr(vehicle, key, value)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=204)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db), _=Depends(require_admin)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id, Vehicle.country == "India").first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    db.delete(vehicle)
    db.commit()
