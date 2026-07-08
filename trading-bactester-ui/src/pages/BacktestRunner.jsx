import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/api";
import { MARKET_SYMBOLS } from "../constants/marketSymbols";
import CandleChart from "../components/backtest/CandleChart";
import BacktestSetup from "../components/backtest/BacktestSettings";
import "./BacktestRunner.css";
import Navbar from "../components/common/Navbar";

function BacktestRunner() {

    const location = useLocation();

    const [strategy, setStrategy] = useState(null);
    const [strategies, setStrategies] = useState([]);

    const [symbol, setSymbol] = useState("RELIANCE.NS");
    const [timeframe, setTimeframe] = useState("15m");
    const [market, setMarket] = useState("NSE");
    const [period, setPeriod] = useState("5d");
    const [marketData, setMarketData] = useState([]);

    const navigate = useNavigate()

    async function startBacktest() {
        try {
            const response = await api.post(`/backtest/${strategy.id}`, {
                market,
                symbol,
                timeframe,
                period
            });

            navigate(`/backtests/${response.data.id}`);
        } catch (err) {
            console.error(err);
            alert("Failed to start backtest.");
        }
    }

    async function getMarketData() {
        try {
            const response = await api.get("/market-data", {
                params: {
                    symbol,
                    timeframe,
                    period
                }
            });

            setMarketData(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (location.state?.strategy) {
            setStrategy(location.state.strategy);
        }
    }, [location.state]);

    useEffect(() => {
        loadStrategies();
    }, []);
    
    useEffect(() => {
        getMarketData();
    },[market,symbol,period,timeframe]);

    async function loadStrategies() {
        try {
            const response = await api.get("/strategies");
            setStrategies(response.data);
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    }

    return (
        <>
        <Navbar></Navbar>
        <div className="backtest-page">
            <div className="page-header">
                <h1>Backtest Runner</h1>
            </div>

            <div className="backtest-layout">

                <aside className="backtest-sidebar">
                    <BacktestSetup
                        strategy={strategy}
                        strategies={strategies}
                        market={market}
                        symbol={symbol}
                        timeframe={timeframe}
                        period={period}
                        onStrategyChange={(e) => {
                            const selected = strategies.find(
                                s => s.id === Number(e.target.value)
                            );
                            setStrategy(selected);
                        }}
                        onMarketChange={(e) => {
                            const selectedMarket = e.target.value;
                            setMarket(selectedMarket);
                            setSymbol(MARKET_SYMBOLS[selectedMarket][0]);
                        }}
                        onSymbolChange={(e) => setSymbol(e.target.value)}
                        onTimeframeChange={(e) => setTimeframe(e.target.value)}
                        onPeriodChange={(e) => setPeriod(e.target.value)}
                        onStartBacktest={startBacktest}
                    />
                </aside>

                <main className="chart-section">

                    <div className="chart-card">
                        <CandleChart candles={marketData} />
                    </div>

                    <div className="analytics-card">
                        <h2>Analytics</h2>
                        <p>
                            Backtest results and performance metrics will be displayed here.
                        </p>
                    </div>

                </main>

            </div>
        </div>
        </>
    );
}

export default BacktestRunner;