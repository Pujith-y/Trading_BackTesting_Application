import { useEffect, useState } from "react";
import api from "../api/api";
import StrategyCard from "../components/strategies/StrategyCard";
import './strategies.css'
import Navbar from "../components/common/Navbar";
import { NavLink } from "react-router-dom";

function Strategies() {
    const [strategies, setStrategies] = useState([]);

    useEffect(() => {
        async function loadStrategies() {
            const response = await api.get("/strategies");
            setStrategies(response.data);
        }

        loadStrategies();
    }, []);

    function renderStrategyCards() {
        return strategies.map((strategy) => (
            <StrategyCard
                key={strategy.id || strategy.name}
                strategy={strategy}
            />
        ));
    }

    return ( 
    <> 
        <Navbar />      
        <main className="strategies-page">
            
            <header className="strategies-header">
                <div>
                    <h1>Strategies</h1>
                    <p>
                        View and manage your trading strategies.
                    </p>
                    <NavLink
                        to="/strategies/new"
                        className="create-strategy-btn"
                    >
                        + Create New Strategy
                    </NavLink>
                </div>
            </header>
            
            {
                strategies.length > 0 ? (
                    <section className="strategies-grid">
                        {renderStrategyCards()}
                    </section>
                ) : (
                    <p className="no-strategies-message">
                        No strategies found. Please create a new strategy to get started.
                    </p>
                )
            }
        </main>
        </>
    );

}

export default Strategies;