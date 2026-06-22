from database import SessionLocal
from models import Backtest,Strategy,Trade
from services.queue.backtestqueue import backtest_queue
from services.indicators.ema import calculate_ema
from routes.marketdata import get_market_data

def run_backtest(backtest_id : int):
    db = SessionLocal()
    backtest = db.query(Backtest).filter(Backtest.id == backtest_id).first()
    if not backtest:
        print(f"Backtest with id {backtest_id} not found.")
        return
    
    startegy = db.query(Strategy).filter(Strategy.id == backtest.strategy_id).first()
    ema_fast = calculate_ema(backtest.symbol, backtest.timeframe, startegy.ema_fast, backtest.period)
    ema_slow = calculate_ema(backtest.symbol, backtest.timeframe, startegy.ema_slow, backtest.period)
    candles = get_market_data(backtest.symbol,backtest.timeframe,backtest.period)
    list_of_trades = []
    for i in range(0, len(ema_fast)):
        if ema_fast[i] <= ema_slow[i] and (i == 0 or ema_fast[i-1] > ema_slow[i-1]):
            new_trade = Trade(entry_price = candles[i]["close"], entry_datetime = candles[i]["Datetime"], entry_discription = "Ema fast crosses below Ema slow", backtest_id = backtest.id)
            db.add(new_trade)
            db.commit()
            db.refresh(new_trade)
            list_of_trades.append(new_trade)
        elif ema_fast[i] > ema_slow[i]:
            for trade in list_of_trades:
                if trade.exit_price is None:
                    trade.exit_price = candles[i]["close"]
                    trade.exit_datetime = candles[i]["Datetime"]
                    trade.exit_discription = "Ema fast crosses above Ema slow"
                    db.commit()
            

    db.commit()
    db.close()
    print(backtest.strategy_name)
    print("completed")
    return 