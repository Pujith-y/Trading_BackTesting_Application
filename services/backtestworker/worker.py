from database import SessionLocal
from models import Backtest,Strategy,Trade
from services.queue.backtestqueue import backtest_queue
from services.indicators.ema import calculate_ema
from routes.marketdata import get_market_data

def run_backtest(backtest_id : int):
    try:
        db = SessionLocal()
        backtest = db.query(Backtest).filter(Backtest.id == backtest_id).first()
        if not backtest:
            print(f"Backtest with id {backtest_id} not found.")
            return
        
        backtest.status = "processing"
        db.commit()

        startegy = db.query(Strategy).filter(Strategy.id == backtest.strategy_id).first()
        ema_fast = calculate_ema(backtest.symbol, backtest.timeframe, startegy.ema_fast, backtest.period)
        ema_slow = calculate_ema(backtest.symbol, backtest.timeframe, startegy.ema_slow, backtest.period)
        candles = get_market_data(backtest.symbol,backtest.timeframe,backtest.period)
        #print(ema_fast[:30])
        #print(ema_slow[:30])
        start_index = max(startegy.ema_fast, startegy.ema_slow)
        list_of_trades = []
        for i in range(start_index, len(ema_slow)):

            # BUY SIGNAL
            if ema_fast[i] > ema_slow[i] and (
                i == start_index or ema_fast[i - 1] <= ema_slow[i - 1]
            ):

                new_trade = Trade(
                    entry_price=candles[i]["close"],
                    entry_datetime=candles[i]["timestamp"],
                    entry_discription="Ema fast crosses above Ema slow",
                    backtest_id=backtest.id
                )

                db.add(new_trade)
                db.commit()
                db.refresh(new_trade)

                list_of_trades.append(new_trade)

            # SELL SIGNAL
            if ema_fast[i] < ema_slow[i] and (
                i == start_index or ema_fast[i - 1] >= ema_slow[i - 1]
            ):
                open_trades = [t for t in list_of_trades if t.exit_price is None]
                for trade in open_trades:
                    trade.exit_price = candles[i]["close"]
                    trade.exit_datetime = candles[i]["timestamp"]
                    trade.exit_discription = "Ema fast crosses below Ema slow"

                    db.commit()
        backtest.status = "completed"
        db.commit()
            
    except Exception as e:
        print(f"Error occurred while running backtest {backtest_id}: {e}")

        if 'backtest' in locals() and backtest:
            backtest.status = "failed"
            db.commit()

    finally:
        if 'db' in locals():
            db.close()
            #print("completed")
            return 