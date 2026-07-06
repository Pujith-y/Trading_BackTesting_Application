import { useEffect, useState } from "react";
import api from "../../api/api";
import Card from "../common/Card.jsx";
import "./dashboard.css";
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
            title: "Avarage Win Rate",
            content: dashboard.average_win_rate
        }
    ];

    function renderCards() {
        return cards.map((card) => (
            <Card
                key={card.title}
                title={card.title}
                content={card.content}
            />
        ));
    }

    return (
        <div className="dashboard-page">
            <Navbar />

            <main className="dashboard-container">

                <section className="dashboard-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Monitor your trading strategies and backtests.</p>
                    </div>
                </section>

                <section className="cards">
                    {renderCards()}
                </section>

            </main>
        </div>
    );
};

export default Dashboard;