import os

from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from database import get_db
from sqlalchemy.orm import Session
from models import User

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def create_a_token(data : dict):

    to_encode = data.copy()

    expiere = datetime.utcnow() + timedelta(hours=2)

    to_encode.update({"exp" : expiere})

    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,ALGORITHM)

    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    
    user_id = payload.get("user_id")

    user = db.query(User).filter(User.id == user_id).first()

    return user