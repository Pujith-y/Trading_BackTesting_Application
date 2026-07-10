from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Analytics, Trade, Backtest, User
from services.security.token_creation import get_current_user

router = APIRouter(tags=["Analytics"])

@router.get("/analytics/{id}")
def get_analytics_of_a_backtest(id : int, db : Session = Depends(get_db), curr_user : User = Depends(get_current_user)):
    backtest = db.query(Backtest).filter(Backtest.id == id and Backtest.user_id == curr_user.id).first()
    trades = db.query(Trade).filter(Trade.backtest_id == backtest.id).all()
    if not backtest:
        return {"error": "Backtest not found"}
    analytics = db.query(Analytics).filter(Analytics.backtest_id == backtest.id).first()
    if not analytics:
        new_analytics = Analytics(
            backtest_id = backtest.id,
            total_trades = len(trades),
            winning_trades = len([t for t in trades if t.exit_price and t.exit_price > t.entry_price]),
            losing_trades = len([t for t in trades if t.exit_price and t.exit_price < t.entry_price]),
            win_rate = len([t for t in trades if t.exit_price and t.exit_price > t.entry_price]) / len(trades) * 100 if trades else 0,
            net_profit = sum([(t.exit_price - t.entry_price) for t in trades if t.exit_price]),
            average_profit = sum([(t.exit_price - t.entry_price) for t in trades if t.exit_price]) / len(trades) if trades else 0,
            longest_win = max([((t.exit_datetime - t.entry_datetime).total_seconds() / 3600) for t in trades if t.exit_price and t.exit_price > t.entry_price], default=0),
            longest_loss = max([((t.exit_datetime - t.entry_datetime).total_seconds() / 3600) for t in trades if t.exit_price and t.exit_price < t.entry_price], default=0)     
        )
        db.add(new_analytics)
        db.commit()
        db.refresh(new_analytics)
        analytics = new_analytics

    return analytics