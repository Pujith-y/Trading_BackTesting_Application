import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries } from "lightweight-charts";


function CandleChart({ candles }) {

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
        const chartData = candles.map(candle => ({
            time: Math.floor(new Date(candle.timestamp).getTime() / 1000),
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close
        }));
        candleSeries.setData(chartData);
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