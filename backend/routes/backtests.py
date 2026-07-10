from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Analytics, Backtest, Trade,User,Strategy
from services.security.token_creation import get_current_user
from services.queue.backtestqueue import backtest_queue
from schemas import New_Backtest
from services.backtestworker.worker import run_backtest
from routes.marketdata import get_market_data
from services.indicators.ema import calculate_ema

router = APIRouter(tags=["Backtests"])

@router.get("/backtests")
def get_backtests(
    market : str = None,
    symbol : str = None,
    strategy_name : str = None,
    db : Session = Depends(get_db),
    curr_user : User = Depends(get_current_user)):

    backtests = db.query(Backtest).filter(curr_user.id == Backtest.user_id)

    if market:
        backtests = backtests.filter(Backtest.market == market)

    if symbol:
        backtests = backtests.filter(Backtest.symbol == symbol)

    if strategy_name:
        backtests = backtests.filter(Backtest.strategy_name == strategy_name)

    return backtests.all()

@router.post("/backtest/{id}")
def create_a_backtest(
    id : int, 
    body : New_Backtest, 
    db : Session = Depends(get_db), 
    curr_user : User = Depends(get_current_user)):

    strategy = db.query(Strategy).filter(Strategy.id == id and Strategy.user_id == curr_user.id).first()
    if not strategy:
        return {"error": "Strategy not found"}
    new_backtest = Backtest(
        market = body.market, 
        symbol = body.symbol, 
        timeframe = body.timeframe, 
        period = body.period,
        strategy_id = id, 
        strategy_name = strategy.name,
        user_id = curr_user.id
        )
    db.add(new_backtest)
    db.commit()
    db.refresh(new_backtest)
    backtest_queue.enqueue(run_backtest, new_backtest.id)
    return new_backtest

@router.get("/backtest/history")
def get_backtest_history(db : Session = Depends(get_db), curr_user : User = Depends(get_current_user)):
    backtests = (
        db.query(
            Backtest,
            Strategy.name.label("strategy_name"),
            Analytics.net_profit.label("net_profit")
        )
        .join(Strategy, Strategy.id == Backtest.strategy_id)
        .outerjoin(Analytics, Analytics.backtest_id == Backtest.id)
        .filter(Backtest.user_id == curr_user.id)
    ).order_by(Backtest.created_at.desc()).all()

    if not backtests:
        return {"error": "No backtests found for the user"}

    result = []

    for backtest, strategy_name, net_profit in backtests:
        result.append({
            "id": backtest.id,
            "symbol": backtest.symbol,
            "market": backtest.market,
            "timeframe": backtest.timeframe,
            "status": backtest.status,
            "strategy_name": strategy_name,
            "net_profit": net_profit
        })

    return result                                                     

@router.get("/backtest/{id}/charts-data")
def get_charts_data_for_backtests(id : int, db : Session = Depends(get_db), curr_user : User = Depends(get_current_user)):
    backtest = db.query(Backtest).filter(Backtest.id == id and Backtest.user_id == curr_user.id).first()
    if not backtest:
        return {"error": "Backtest not found"}
    
    if backtest.status != "completed":
        return {"error": f"Backtest is not completed yet. Current status: {backtest.status}"}
    startegy = db.query(Strategy).filter(Strategy.id == backtest.strategy_id, Strategy.user_id == curr_user.id).first()
    ema_fast = calculate_ema(backtest.symbol, backtest.timeframe, startegy.ema_fast, backtest.period)
    ema_slow = calculate_ema(backtest.symbol, backtest.timeframe, startegy.ema_slow, backtest.period)
    candles = get_market_data(backtest.symbol, backtest.timeframe, backtest.period)
    trades = db.query(Trade).filter(Trade.backtest_id == backtest.id).all()
    return {"candles": candles, "trades": trades, "indicators": {"ema_fast": ema_fast, "ema_slow": ema_slow}}

@router.get("/backtest/{id}")
def get_backtest(id : int, db : Session = Depends(get_db), curr_user : User = Depends(get_current_user)):
    backtest = db.query(Backtest).filter(Backtest.id == id and Backtest.user_id == curr_user.id).first()
    if not backtest:
        return {"error": "Backtest not found"}
    return backtest