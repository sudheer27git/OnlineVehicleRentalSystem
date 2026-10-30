# DriveEase — Online Vehicle Rental System

A full-stack vehicle rental application built in the progressive, experiment-based style of the supplied SmartCart project.

## Technology
- Frontend: React, Vite, TypeScript, React Router
- Backend: Python, FastAPI, SQLAlchemy
- Database: PostgreSQL (no Docker)
- Authentication: JWT + bcrypt password hashing
- API validation: Pydantic
- Demo payment: simulated payment confirmation (no real money is charged)

## Features
- Responsive landing page and vehicle catalogue
- India-only inventory with cascading State → District availability filters
- Location availability counts derived from the vehicles currently listed in PostgreSQL
- Search, category and availability filters
- Vehicle detail view
- Customer registration and login
- JWT-protected booking creation and booking history
- Booking date validation and price calculation
- Admin dashboard with vehicle create/update/delete
- PostgreSQL persistence and automatic demo data seeding
- Demo payment flow, with clear separation for future Razorpay/Stripe integration

## Requirements
Install:
1. Python 3.11 or newer
2. Node.js 20 or newer (npm included)
3. PostgreSQL 15 or newer
4. VS Code

## PART 1 — Database setup
1. Open pgAdmin and connect to your local PostgreSQL server.
2. Create a database named `onlinevehiclerental_db`.
3. Keep your PostgreSQL username and password ready.
4. The backend uses this connection string by default:
   `postgresql+psycopg://postgres:YOUR_PASSWORD@localhost:5432/onlinevehiclerental_db`

If your PostgreSQL username/password differs, edit `backend/.env` after copying `.env.example`.

## PART 2 — Backend setup (VS Code terminal)
Open the extracted `DriveEase` folder in VS Code.

```powershell
cd backend
py -m venv .venv
```

Activate the environment on Windows PowerShell:
```powershell
.\.venv\Scripts\Activate.ps1
```
If PowerShell blocks activation, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

Install dependencies:
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Create your environment file:
```powershell
copy .env.example .env
```
Open `.env` and set `DATABASE_URL` to your PostgreSQL credentials. Example:
```env
DATABASE_URL=postgresql+psycopg://postgres:YourPostgresPassword@localhost:5432/onlinevehiclerental_db
SECRET_KEY=replace-this-with-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_ORIGIN=http://localhost:5173
```

Start the backend:
```powershell
uvicorn app.main:app --reload
```
Backend: http://127.0.0.1:8000  
Interactive API docs: http://127.0.0.1:8000/docs

On first startup, DriveEase creates the tables, upgrades the older vehicle table with India/state/district columns, backfills older vehicle records and maps the original demo fleet to Indian State/District locations, and inserts sample vehicles if the vehicle table is empty. The country is fixed to India; the State and District selectors only show regions with listed vehicles. The starter fleet spans Andhra Pradesh, Telangana, Karnataka, Maharashtra and Tamil Nadu.

## PART 3 — Frontend setup (open a second VS Code terminal)
From the project root:
```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```
Open the URL printed by Vite, normally http://localhost:5173.

## PART 4 — Demo accounts
The backend seeds these accounts when the database is empty:
- Admin: `admin@onlinevehiclerental.com` / `Admin123!`
- Customer: `customer@onlinevehiclerental.com` / `Customer123!`

Change these credentials before deploying publicly. Seed credentials are for local learning only.

## PART 5 — Suggested experiment-wise learning path
| Module | Work |
|---|---|
| EXP 1 | Create React + TypeScript + Vite application |
| EXP 2 | TypeScript Vehicle interface and sample vehicle data |
| EXP 3 | Reusable VehicleCard and VehicleGrid components |
| EXP 4 | Search, category filters, India State → District availability filters and responsive CSS |
| EXP 5 | FastAPI project, routes and Pydantic schemas |
| EXP 6 | PostgreSQL connection, SQLAlchemy models, India location columns and region availability API |
| EXP 7 | Registration, login, password hashing and JWT |
| EXP 8 | Booking creation, date validation and booking history |
| EXP 9 | Admin vehicle management and protected routes |
| EXP 10 | Demo payment workflow and booking status updates |
| EXP 11 | Testing, API documentation and deployment preparation |

## Project structure
```text
DriveEase/
├── backend/
│   ├── app/
│   │   ├── routers/ (auth, vehicles, bookings, locations)
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── migrations.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── security.py
│   │   └── seed.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
└── README.md
```

## Important notes
- This is a local learning/demo project. Do not expose the development server directly to the public internet.
- Demo payment only changes the booking's payment status in the database. It does not collect card details or move money.
- For production, add a real payment provider with server-side signature verification and webhooks, database migrations, email verification, rate limiting, audit logs, HTTPS, and stronger operational security.
- Vehicle images are loaded from remote Unsplash image URLs; an internet connection is needed to display them.


## India-only region availability
- Country is fixed as **India**; the API rejects vehicle writes for other countries.
- Every vehicle stores `country`, `state`, and `district` separately.
- `/api/locations` returns only states and districts that currently have listed vehicles, including vehicle counts.
- The vehicle catalogue accepts `state` and `district` query parameters. The district selector remains disabled until a state is selected.
- Add new Indian regions from the Admin dashboard by entering the State/UT and District. The customer filters automatically start showing those regions once vehicles are listed there.
- The project does not claim that every Indian district is served: a district appears only after at least one vehicle is listed there. The included sample fleet starts with availability in Andhra Pradesh (Vizianagaram and Visakhapatnam), Telangana (Hyderabad), Karnataka (Bengaluru Urban), Maharashtra (Mumbai Suburban), and Tamil Nadu (Chennai).
