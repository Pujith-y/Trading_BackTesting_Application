import { useEffect, useState } from "react";
import api from "../api/api";
import BacktestCard from "../components/backtest/BacktestCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import "./Backtests.css";

function Backtests(){

    const [backtests, setBacktests] = useState([]);

    const navigate = useNavigate()

    async function loadBacktests(){
        try{
            const response = await api.get("/backtest/history");   
            setBacktests(response.data);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(() => {
        loadBacktests();
    }, []);

    return(
        <>
        <Navbar></Navbar>
        <div className="backtests-container">
            <h1>Backtest History</h1>
            {backtests.map((backtest) => (
                <BacktestCard 
                    key={backtest.id} 
                    backtest={backtest}
                    onResults={() => navigate(`/backtests/${backtest.id}`)}                         
                />
            ))}
        </div>
        </>
    );
}

export default Backtests;