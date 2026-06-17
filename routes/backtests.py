from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Backtest,User,Strategy
from services.security.token_creation import get_current_user
from services.queue.backtestqueue import backtest_queue
from schemas import New_Backtest
from services.backtestworker.worker import run_backtest

router = APIRouter(tags=["Backtests"])

@router.get("/backtests")
def get_backtests(
    market : str = None,
    symbol : str = None,
    strategy_name : str = None,
    db : Session = Depends(get_db),
    curr_user : User = Depends(get_current_user)):

    backtests = db.query(Backtest).filter(curr_user.id == Backtest.user_id).all()

    if market:
        backtests = backtests.filter(Backtest.market == market).all()

    if symbol:
        backtests = backtests.filter(Backtest.symbol == symbol).all()

    if strategy_name:
        backtests = backtests.filter(Backtest.strategy_name == strategy_name).all()

    return backtests

@router.post("/backtest/{id}")
def create_a_backtest(
    id : int, 
    body : New_Backtest, 
    db : Session = Depends(get_db), 
    curr_user : User = Depends(get_current_user)):

    strategy = db.query(Strategy).filter(Strategy.id == id and Strategy.user_id == curr_user.id).first()
    new_backtest = Backtest(
        market = body.market, 
        symbol = body.symbol, 
        timeframe = body.timeframe, 
        strategy_id = id, 
        strategy_name = strategy.name,
        user_id = curr_user.id
        )
    db.add(new_backtest)
    db.commit()
    db.refresh(new_backtest)
    backtest_queue.enqueue(run_backtest, new_backtest.id)
    return new_backtest
