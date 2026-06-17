from database import SessionLocal
from models import Backtest
from services.queue.backtestqueue import backtest_queue

def run_backtest(backtest_id : int):
    db = SessionLocal()
    backtest = db.query(Backtest).filter(Backtest.id == backtest_id).first()
    db.close()
    print(backtest.strategy_name)
    print("completed")
    return 