"""Small, safe schema/data migration for users upgrading an earlier DriveEase database."""
from sqlalchemy import text
from .database import engine


def migrate_vehicle_locations() -> None:
    statements = [
        "ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS country VARCHAR(80)",
        "ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS state VARCHAR(120)",
        "ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS district VARCHAR(120)",
        "UPDATE vehicles SET country = 'India' WHERE country IS NULL OR country = ''",
        """UPDATE vehicles SET state = CASE
            WHEN lower(coalesce(location, '')) IN ('hyderabad') THEN 'Telangana'
            WHEN lower(coalesce(location, '')) IN ('bengaluru', 'bangalore', 'bengaluru urban') THEN 'Karnataka'
            WHEN lower(coalesce(location, '')) IN ('mumbai', 'mumbai suburban') THEN 'Maharashtra'
            WHEN lower(coalesce(location, '')) IN ('chennai') THEN 'Tamil Nadu'
            ELSE 'Andhra Pradesh' END
            WHERE state IS NULL OR state = ''""",
        """UPDATE vehicles SET district = CASE
            WHEN lower(coalesce(location, '')) IN ('vizianagaram') THEN 'Vizianagaram'
            WHEN lower(coalesce(location, '')) IN ('visakhapatnam', 'vizag') THEN 'Visakhapatnam'
            WHEN lower(coalesce(location, '')) IN ('hyderabad') THEN 'Hyderabad'
            WHEN lower(coalesce(location, '')) IN ('bengaluru', 'bangalore', 'bengaluru urban') THEN 'Bengaluru Urban'
            WHEN lower(coalesce(location, '')) IN ('mumbai', 'mumbai suburban') THEN 'Mumbai Suburban'
            WHEN lower(coalesce(location, '')) IN ('chennai') THEN 'Chennai'
            ELSE coalesce(nullif(location, ''), 'Vizianagaram') END
            WHERE district IS NULL OR district = ''""",
        # Reclassify the six original demonstration vehicles into a wider set of Indian regions.
        """UPDATE vehicles SET state = 'Andhra Pradesh', district = 'Vizianagaram', location = 'Vizianagaram'
            WHERE lower(name) = 'hyundai creta'""",
        """UPDATE vehicles SET state = 'Andhra Pradesh', district = 'Visakhapatnam', location = 'Visakhapatnam'
            WHERE lower(name) = 'maruti swift'""",
        """UPDATE vehicles SET state = 'Telangana', district = 'Hyderabad', location = 'Hyderabad'
            WHERE lower(name) = 'honda city'""",
        """UPDATE vehicles SET state = 'Karnataka', district = 'Bengaluru Urban', location = 'Bengaluru Urban'
            WHERE lower(name) = 'kia seltos'""",
        """UPDATE vehicles SET state = 'Maharashtra', district = 'Mumbai Suburban', location = 'Mumbai Suburban'
            WHERE lower(name) = 'toyota innova crysta'""",
        """UPDATE vehicles SET state = 'Tamil Nadu', district = 'Chennai', location = 'Chennai'
            WHERE lower(name) = 'royal enfield classic 350'""",
        "UPDATE vehicles SET location = district WHERE location IS NULL OR location = ''",
        "ALTER TABLE vehicles ALTER COLUMN country SET DEFAULT 'India'",
        "ALTER TABLE vehicles ALTER COLUMN state SET DEFAULT 'Andhra Pradesh'",
        "ALTER TABLE vehicles ALTER COLUMN district SET DEFAULT 'Vizianagaram'",
    ]
    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
        # Legacy records are all mapped into India. Any new API write is country-validated.
        connection.execute(text("UPDATE vehicles SET country = 'India' WHERE country <> 'India'"))
