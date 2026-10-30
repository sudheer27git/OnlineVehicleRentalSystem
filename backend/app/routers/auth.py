from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, LoginInput, TokenOut, UserOut
from ..security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenOut, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    email = data.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists")
    user = User(name=data.name, email=email, hashed_password=hash_password(data.password), role="customer")
    db.add(user); db.commit(); db.refresh(user)
    return {"access_token": create_access_token(user.id), "user": user}

@router.post("/login", response_model=TokenOut)
def login(data: LoginInput, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return {"access_token": create_access_token(user.id), "user": user}

@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
