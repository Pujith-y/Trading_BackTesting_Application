import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

function BacktestResult(){

    const [backtest,setBacktest] = useState();

    const { id } = useParams();

    async function loadBacktest() {
        const response = await api.get(`/backtest/${id}`);
        setBacktest(response.data);
    }

    useEffect(() => {
        loadBacktest();

        const interval = setInterval(() => {
            loadBacktest();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {backtest ? (
                <div className="backtest-result">
                    <h1>Backtest Result</h1>
                    <p>{backtest.status}</p>
                </div>
            ) : (
                <p>Loading backtest result...</p>
            )}
        </>
    );
}

export default BacktestResult