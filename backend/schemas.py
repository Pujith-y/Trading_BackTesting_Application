from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class New_User(BaseModel):
    name : str
    email : EmailStr
    password : str = Field(min_length=8, max_length=64)

class TokenResponse(BaseModel):
    access_token : str
    token_type : str

class New_Strategy(BaseModel):
    name : str
    description : Optional[str]
    ema_slow : int
    ema_fast : int

class Change_Strategy(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    ema_slow: Optional[int] = None
    ema_fast: Optional[int] = None

class New_Backtest(BaseModel):
    market : str
    symbol : str
    timeframe : str
    period : str
    

