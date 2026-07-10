from routes.marketdata import get_market_data

def calculate_ema(symbol: str, timeframe: str, period: int, candlePeriod: str):
    candles = get_market_data(symbol, timeframe, candlePeriod)

    closes = [candle["close"] for candle in candles]

    if len(closes) < period:
        raise ValueError(f"Need at least {period} candles")

    multiplier = 2 / (period + 1)

    ema = [None] * len(closes)

    # First EMA = SMA of first period closes
    sma = sum(closes[:period]) / period
    ema[period - 1] = sma

    # Calculate remaining EMAs
    for i in range(period, len(closes)):
        ema[i] = (
            closes[i] * multiplier
            + ema[i - 1] * (1 - multiplier)
        )

    return ema

#ema_values = calculate_ema("BTC-USD", "1h", 10 , "5d")

#print(ema_values)