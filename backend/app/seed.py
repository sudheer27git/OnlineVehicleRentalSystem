from sqlalchemy.orm import Session
from .models import Vehicle, User
from .security import hash_password

# Demonstration inventory is intentionally located only in India.
SAMPLE_VEHICLES = [
    dict(name="Hyundai Creta", brand="Hyundai", category="SUV", transmission="Automatic", fuel="Petrol", seats=5, price_per_day=3200,
         image_url="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1000",
         description="Comfortable premium SUV with generous luggage space and a smooth automatic drive.", country="India", state="Andhra Pradesh", district="Vizianagaram", location="Vizianagaram"),
    dict(name="Maruti Swift", brand="Maruti Suzuki", category="Hatchback", transmission="Manual", fuel="Petrol", seats=5, price_per_day=1800,
         image_url="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1000",
         description="Compact, economical and easy to drive around the city.", country="India", state="Andhra Pradesh", district="Visakhapatnam", location="Visakhapatnam"),
    dict(name="Honda City", brand="Honda", category="Sedan", transmission="Automatic", fuel="Petrol", seats=5, price_per_day=2600,
         image_url="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000",
         description="Refined sedan with a spacious cabin for business trips and weekend drives.", country="India", state="Telangana", district="Hyderabad", location="Hyderabad"),
    dict(name="Kia Seltos", brand="Kia", category="SUV", transmission="Automatic", fuel="Diesel", seats=5, price_per_day=3500,
         image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000",
         description="Feature-rich SUV for comfortable highway journeys.", country="India", state="Karnataka", district="Bengaluru Urban", location="Bengaluru Urban"),
    dict(name="Toyota Innova Crysta", brand="Toyota", category="MUV", transmission="Manual", fuel="Diesel", seats=7, price_per_day=4800,
         image_url="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1000",
         description="A roomy family and group travel option with seven seats.", country="India", state="Maharashtra", district="Mumbai Suburban", location="Mumbai Suburban"),
    dict(name="Royal Enfield Classic 350", brand="Royal Enfield", category="Bike", transmission="Manual", fuel="Petrol", seats=2, price_per_day=900,
         image_url="https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1000",
         description="Classic motorcycle for relaxed local rides and scenic routes.", country="India", state="Tamil Nadu", district="Chennai", location="Chennai"),
]


def seed_data(db: Session):
    if db.query(Vehicle).count() == 0:
        db.add_all([Vehicle(**vehicle) for vehicle in SAMPLE_VEHICLES])
    if not db.query(User).filter(User.email == "admin@onlinevehiclerental.com").first():
        db.add(User(name="DriveEase Admin", email="admin@onlinevehiclerental.com", hashed_password=hash_password("Admin123!"), role="admin"))
    if not db.query(User).filter(User.email == "customer@onlinevehiclerental.com").first():
        db.add(User(name="Demo Customer", email="customer@onlinevehiclerental.com", hashed_password=hash_password("Customer123!"), role="customer"))
    db.commit()
