import { useEffect, useState } from "react";
import api from "../../api/api";
import Card from "../common/Card.jsx"
import './dashboard.css'
import Navbar from "../common/Navbar.jsx";


const Dashboard = () => {
    const [dashboard, setDashboard] = useState({});
    useEffect(() => {
        async function loadDashboard() {
            const response = await api.get("/dashboard");
            setDashboard(response.data);
        }
        
        loadDashboard();
            
    }, []);
    const cards = [
        {
            title: "Strategies",
            content: dashboard.total_strategies
        },
        {
            title: "Backtests",
            content: dashboard.total_backtests
        },
        {
            title: "Completed",
            content: dashboard.completed_backtests
        },
        {
            title: "Running",
            content: dashboard.pending_backtests
        },
        {
            title: "Failed",
            content: dashboard.failed_backtests
        },
        {
            title : "Avarage Win Rate",
            content: dashboard.average_win_rate
        }
    ];
    function renderCards(){
        const arr = cards.map((card) => {
            return (
                <Card key={card.title} title={card.title} content={card.content} />
            )
        })
        return arr;
    }
    return (
        <div>
            <Navbar></Navbar>
            <h1>Dashboard</h1>
            <div className="cards">{renderCards()}</div>
            
        </div>
    )
}

export default Dashboard;