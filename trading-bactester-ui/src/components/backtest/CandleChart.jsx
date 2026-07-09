import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, LineSeries, createSeriesMarkers } from "lightweight-charts";


function CandleChart({ candles = [], trades = [],     indicators = {ema_fast: [],ema_slow: [],}, }) {

    const chartContainerRef = useRef(null);

    useEffect(() => {
        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: 600,

            layout: {
                background: { color: "#131722" }, // TradingView dark background
                textColor: "#d1d4dc",
            },

            grid: {
                vertLines: {
                    color: "#2A2E39",
                },
                horzLines: {
                    color: "#2A2E39",
                },
            },

            crosshair: {
                mode: 1,
                vertLine: {
                    color: "#758696",
                    width: 1,
                    style: 2, // dashed
                },
                horzLine: {
                    color: "#758696",
                    width: 1,
                    style: 2,
                },
            },

            rightPriceScale: {
                borderColor: "#2A2E39",
            },

            timeScale: {
                borderColor: "#2A2E39",
                timeVisible: true,
                secondsVisible: false,
            },
        });
        const candleSeries = chart.addSeries(CandlestickSeries);
        const fastEmaSeries = chart.addSeries(LineSeries, {
            color: "#2962FF",
            lineWidth: 2,
            title: "EMA Fast",
        });

        const slowEmaSeries = chart.addSeries(LineSeries, {
            color: "#FF6D00",
            lineWidth: 2,
            title: "EMA Slow",
        });
        const fastEMAData = candles
            .map((candle, index) => ({
                time: Math.floor(
                    new Date(candle.timestamp).getTime() / 1000
                ),
                value: indicators.ema_fast[index]
            }))
            .filter(point => point.value !== null);

        const slowEMAData = candles
            .map((candle, index) => ({
                time: Math.floor(
                    new Date(candle.timestamp).getTime() / 1000
                ),
                value: indicators.ema_slow[index]
            }))
            .filter(point => point.value !== null);
        
        fastEmaSeries.setData(fastEMAData);
        slowEmaSeries.setData(slowEMAData);
        const markers = [];
        trades.forEach((trade) => {

            markers.push({
                time: Math.floor(
                    new Date(trade.entry_datetime).getTime() / 1000
                ),
                position: "belowBar",
                color: "#22c55e",
                shape: "arrowUp",
                text: "BUY",
            });

            if (trade.exit_datetime) {

                markers.push({
                    time: Math.floor(
                        new Date(trade.exit_datetime).getTime() / 1000
                    ),
                    position: "aboveBar",
                    color: "#ef4444",
                    shape: "arrowDown",
                    text: "SELL",
                });

            }

        });
        const chartData = candles.map(candle => ({
            time: Math.floor(new Date(candle.timestamp).getTime() / 1000),
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close
        }));
        candleSeries.setData(chartData);
        createSeriesMarkers(candleSeries, markers);
        chart.timeScale().fitContent();

        return () => {
            chart.remove();
        };
    }, [candles]);

    return (
        <div className="chart-wrapper">
            <div
                className="tv-chart"
                ref={chartContainerRef}
                style={{
                    width: "100%",
                    height: "600px"
                }}
            />
        </div>
    );
}

export default CandleChart;