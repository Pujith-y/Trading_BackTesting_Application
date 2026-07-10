from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import yfinance as yf

from database import get_db

router = APIRouter(tags=["Market Data"])

@router.get("/market-data")
def get_market_data(symbol: str, timeframe: str, period: str):
    data = yf.download(
        symbol,
        interval=timeframe,
        period=period
    )

    data.columns = [col[0] if isinstance(col, tuple) else col for col in data.columns]

    data = data.reset_index()

    candles = []

    for _, row in data.iterrows():
        candles.append({
            "timestamp": row["Datetime"].isoformat() if "Datetime" in row else row["Date"].isoformat(),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": int(row["Volume"])
        })

    return candles