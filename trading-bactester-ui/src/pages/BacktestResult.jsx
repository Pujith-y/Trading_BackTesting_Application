import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import CandleChart from "../components/backtest/CandleChart";
import AnalyticsCards from "../components/backtest/AnalyticsCards";
import TradeTable from "../components/backtest/TradeTable";
import "./BacktestResult.css";
import Navbar from "../components/common/Navbar";

function BacktestResult(){

    const { id } = useParams();

    const [backtest, setBacktest] = useState(null);

    const [loading, setLoading] = useState(true);

    const [chartData, setChartData] = useState({
        candles: [],
        trades: [],
        indicators: {}
    });

    const [analytics, setAnalytics] = useState(null);

    const [strategy, setStrategy] = useState(null);

    async function loadBacktest() {
        try {
            const response = await api.get(`/backtest/${id}`);
            setBacktest(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    async function loadChartData() {
        try {
            const [chartResponse, analyticsResponse, strategyResponse] = await Promise.all([
                api.get(`/backtest/${id}/charts-data`),
                api.get(`/analytics/${id}`),
                api.get(`/strategy/${backtest.strategy_id}`)
            ]);

            setChartData(chartResponse.data);
            setAnalytics(analyticsResponse.data);
            setStrategy(strategyResponse.data);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        loadBacktest();

        if (backtest?.status === "completed" || backtest?.status === "failed") {
            return;
        }

        const interval = setInterval(loadBacktest, 3000);

        return () => clearInterval(interval);
    }, [backtest?.status]);

    useEffect(() => {

        if(backtest?.status==="completed"){

            loadChartData();

        }

    },[backtest?.status]);

    return (
        <>
            {loading ? (
                <div className="loading-screen">Loading...</div>
            ) : (<>
                <Navbar></Navbar>
                <div className="bt-page">

                    <div className="bt-header">

                        <div className="bt-header-info">
                            <h2>{backtest.symbol}</h2>
                            <span>{backtest.timeframe}</span>
                        </div>

                        <div className={`bt-status bt-status-${backtest.status}`}>
                            {backtest.status}
                        </div>

                    </div>

                    <div className="bt-layout">

                        <aside className="bt-left-panel">

                            <h5>Indicators</h5>

                            <button className="bt-tool-button">EMA Fast</button>
                            <button className="bt-tool-button">EMA Slow</button>
                            <button className="bt-tool-button">Trades</button>

                        </aside>

                        <main className="bt-chart-panel">

                            <CandleChart
                                candles={chartData.candles}
                                trades={chartData.trades}
                                indicators={chartData.indicators}
                            />

                        </main>

                        <aside className="bt-right-panel">

                            <h4>Settings</h4>

                            <div className="bt-setting-row">
                                <label>Symbol</label>
                                <span>{backtest.symbol}</span>
                            </div>

                            <div className="bt-setting-row">
                                <label>Timeframe</label>
                                <span>{backtest.timeframe}</span>
                            </div>

                            <div className="bt-setting-row">
                                <label>Period</label>
                                <span>{backtest.period}</span>
                            </div>

                            <div className="bt-setting-row">
                                <label>Status</label>
                                <span>{backtest.status}</span>
                            </div>

                            {strategy == null ? <></> : (
                            <>
                                <h4>Strategy</h4>
                                <div className="bt-setting-row">
                                    <label>Startegy</label>
                                    <span>{strategy.name}</span>
                                </div>

                                <div className="bt-setting-row">
                                    <label>Ema Fast</label>
                                    <span>{strategy.ema_fast}</span>
                                </div>
                                
                                <div className="bt-setting-row">
                                    <label>Ema Slow</label>
                                    <span>{strategy.ema_slow}</span>
                                </div>
                            </>
                        )}

                        </aside>

                        

                    </div>

                    <section className="bt-analytics">

                        <AnalyticsCards analytics={analytics}/>

                    </section>

                    <section className="bt-trades">

                        <TradeTable trades={chartData.trades}/>

                    </section>

                </div>
                </>
            )}
        </>
    );
}

export default BacktestResult