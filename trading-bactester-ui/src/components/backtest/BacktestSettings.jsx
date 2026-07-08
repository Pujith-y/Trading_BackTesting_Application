import { MARKET_SYMBOLS } from "../../constants/marketSymbols";

function BacktestSetup({
    strategy,
    strategies,
    market,
    symbol,
    timeframe,
    period,
    onStrategyChange,
    onMarketChange,
    onSymbolChange,
    onTimeframeChange,
    onPeriodChange,
    onStartBacktest,
}) {
    return (
        <div className="backtest_form">

            <div className="form-group">
                <label>Strategy</label>
                <select
                    className="tv-select"
                    value={strategy?.id || ""}
                    onChange={onStrategyChange}
                >
                    <option value="">Select a strategy</option>

                    {strategies.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Market</label>

                <select
                    className="tv-select"
                    value={market}
                    onChange={onMarketChange}
                >
                    {Object.keys(MARKET_SYMBOLS).map((m) => (
                        <option key={m} value={m}>
                            {m}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Symbol</label>

                <select
                    className="tv-select"
                    value={symbol}
                    onChange={onSymbolChange}
                >
                    {MARKET_SYMBOLS[market].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Timeframe</label>

                <select
                    className="tv-select"
                    value={timeframe}
                    onChange={onTimeframeChange}
                >
                    <option value="1m">1 Minute</option>
                    <option value="2m">2 Minutes</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                    <option value="1h">1 Hour</option>
                    <option value="4h">4 Hours</option>
                    <option value="1d">1 Day</option>
                </select>
            </div>

            <div className="form-group">
                <label>Period</label>

                <select
                    className="tv-select"
                    value={period}
                    onChange={onPeriodChange}
                >
                    <option value="1d">1 Day</option>
                    <option value="5d">5 Days</option>
                    <option value="1mo">1 Month</option>
                    <option value="3mo">3 Months</option>
                    <option value="6mo">6 Months</option>
                    <option value="1y">1 Year</option>
                    <option value="2y">2 Years</option>
                    <option value="5y">5 Years</option>
                    <option value="10y">10 Years</option>
                    <option value="ytd">Year to Date</option>
                    <option value="max">Max</option>
                </select>
            </div>

            <div className="start_button">
                <button className="tv-button" onClick={onStartBacktest}>
                    Start Backtest
                </button>
            </div>

        </div>
    );
}

export default BacktestSetup;