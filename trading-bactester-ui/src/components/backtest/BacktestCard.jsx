import "./BacktestCard.css";

function BacktestCard({ backtest, onResults }) {

    return(
        <div className="backtest_card">

            <h1>EMA Crossover</h1>
            <p>{backtest.symbol}</p>
            <p>{backtest.timeframe}</p>
            <p>{backtest.status}</p>
            <p>{backtest.strategy_name}</p>
            <p>Net Profit: {backtest.net_profit}</p>
            <button
                disabled={backtest.status !== "completed"}
                onClick={onResults}
            >
                {backtest.status === "completed"
                    ? "Open Results"
                    : backtest.status}
            </button>
        </div>
    );
}

export default BacktestCard;