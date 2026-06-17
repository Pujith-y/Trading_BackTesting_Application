from http.client import HTTPException
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import New_User, TokenResponse
from services.security.passwordHash import hash_password, verify_password
from services.security.token_creation import create_a_token, get_current_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(body: New_User, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == body.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")


    hashed_password = hash_password(body.password)

    new_user = User(
        name=body.name,
        email=body.email,
        password_hash=hashed_password
    )

    db.add(new_user) 
    db.commit()
    db.refresh(new_user)

    return {"new_user": new_user}

@router.post("/login", response_model=TokenResponse)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user:
        return {"message" : "Invalid email or password"}
    
    if not verify_password(form_data.password, user.password_hash):
        return {"message" : "Invalid email or password"}
    
    token = create_a_token(data={"user_id" : user.id})
    return TokenResponse(access_token=token, token_type="bearer")

@router.get("/me")
def get_me(current_user : User = Depends(get_current_user)):
    return current_user
    