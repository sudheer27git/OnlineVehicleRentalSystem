from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Vehicle

router = APIRouter(prefix="/api/locations", tags=["India vehicle availability"])


@router.get("")
def available_locations(db: Session = Depends(get_db)):
    """Return only Indian states and districts that currently have listed vehicles."""
    rows = (
        db.query(Vehicle.state, Vehicle.district, func.count(Vehicle.id).label("vehicle_count"))
        .filter(Vehicle.country == "India", Vehicle.available.is_(True))
        .group_by(Vehicle.state, Vehicle.district)
        .order_by(Vehicle.state.asc(), Vehicle.district.asc())
        .all()
    )
    grouped = {}
    for state, district, count in rows:
        if state not in grouped:
            grouped[state] = {"name": state, "vehicle_count": 0, "districts": []}
        grouped[state]["vehicle_count"] += count
        grouped[state]["districts"].append({"name": district, "vehicle_count": count})
    return {
        "country": "India",
        "country_code": "IN",
        "states": list(grouped.values()),
        "total_vehicles": sum(row["vehicle_count"] for row in rows),
    }
