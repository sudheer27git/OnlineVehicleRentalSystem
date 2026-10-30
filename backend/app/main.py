from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine, SessionLocal
from .config import settings
from .seed import seed_data
from .migrations import migrate_vehicle_locations
from .routers import auth, vehicles, bookings, locations

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    migrate_vehicle_locations()
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()
    yield

app = FastAPI(title="DriveEase Vehicle Rental API", version="1.0.0",
              description="REST API for vehicle discovery, customer accounts and rental bookings.",
              lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=[settings.frontend_origin, "http://127.0.0.1:5173"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(bookings.router)
app.include_router(locations.router)

@app.get("/")
def root():
    return {"message": "DriveEase API is running", "docs": "/docs"}

@app.get("/api/health")
def health():
    return {"status": "ok"}
