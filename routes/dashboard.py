from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Backtest, Trade,User,Strategy
from services.security.token_creation import get_current_user
from services.queue.backtestqueue import backtest_queue

router = APIRouter(tags=["dashboard"])

@router.get("/dashboard")
def get_dashboard_data(db : Session = Depends(get_db), curr_user : User = Depends(get_current_user)):
    backtests = db.query(Backtest).filter(Backtest.user_id == curr_user.id).all()
    strategies = db.query(Strategy).filter(Strategy.user_id == curr_user.id).all()
    analytics = db.query(Trade).join(Backtest).filter(Backtest.user_id == curr_user.id).all()
    total_backtests = len(backtests)
    completed_backtests = len([b for b in backtests if b.status == "completed"])
    pending_backtests = len([b for b in backtests if b.status == "pending"])
    failed_backtests = len([b for b in backtests if b.status == "failed"])
    total_strategies = len(strategies)
    best_backtest_profit = max([b for b in backtests if b.status == "completed"], key=lambda x: sum([(t.exit_price - t.entry_price) for t in db.query(Trade).filter(Trade.backtest_id == x.id).all() if t.exit_price]), default=None)
    average_win_rate = (
        len([a for a in analytics if a.exit_price and a.exit_price > a.entry_price])
        / len(analytics) * 100
        if analytics else 0
    )
    return {
        "total_backtests": total_backtests,
        "completed_backtests": completed_backtests,
        "pending_backtests": pending_backtests,
        "failed_backtests": failed_backtests,
        "total_strategies": total_strategies,
        "best_backtest_profit": best_backtest_profit,
        "average_win_rate": f"{average_win_rate:.2f}"
    }