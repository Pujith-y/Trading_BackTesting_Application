from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Trade, Backtest, User
from services.security.token_creation import get_current_user

router = APIRouter(tags=["Trades"])

@router.get("/trades/{id}")
def get_tardes_of_a_backtest(id : int, db : Session = Depends(get_db), curr_user : User = Depends(get_current_user)):
    backtest = db.query(Backtest).filter(Backtest.id == id and Backtest.user_id == curr_user.id).first()
    if not backtest:
        return {"error": "Backtest not found"}
    trades = db.query(Trade).filter(Trade.backtest_id == backtest.id).all()
    return trades