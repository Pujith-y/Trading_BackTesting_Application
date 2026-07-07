import { useEffect, useState } from "react";
import api from "../api/api";
import StrategyCard from "../components/strategies/StrategyCard";
import './strategies.css'
import Navbar from "../components/common/Navbar";
import StrategyModal from "../components/strategies/StrategyModal";

function Strategies() {
    const [strategies, setStrategies] = useState([]);

    const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);

    const [selectedStrategy, setSelectedStrategy] = useState(null);

        async function loadStrategies() {
            try {
                const response = await api.get("/strategies");
                setStrategies(response.data);
            } catch (err) {
                console.error(err);
                alert("Something went wrong.");
            }
        }

    useEffect(() => {   
        loadStrategies();
    }, []);

    function openCreateModal() {
        setSelectedStrategy(null);
        setIsStrategyModalOpen(true);
    }

    function openEditModal(strategy) {
        setSelectedStrategy(strategy);
        setIsStrategyModalOpen(true);
    }

    function closeModal() {
        setSelectedStrategy(null);
        setIsStrategyModalOpen(false);
    }

    async function saveStrategy(strategyData){
        try {
            if(selectedStrategy == null){
                await api.post("/strategy",strategyData)
            }
            else{
                await api.put(`/strategy/${selectedStrategy.id}`,strategyData);
            }
            await loadStrategies()
            closeModal()

        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    }

    async function deleteStrategy(id) {
        if (!window.confirm("Delete this strategy?")) {
            return;
        }
        try {
            await api.delete(`/strategy/${id}`);
            await loadStrategies();   
        } catch (err) {
            console.error(err);
            alert("Something went wrong.");
        }
    }

    function renderStrategyCards() {
        return strategies.map((strategy) => (
            <StrategyCard
                key={strategy.id}
                onEdit={openEditModal}
                strategy={strategy}
                onDelete={deleteStrategy}
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
                    <button
                        onClick={openCreateModal}
                        className="create-strategy-btn"
                    >
                        + Create New Strategy
                    </button>
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
        {isStrategyModalOpen && (
            <StrategyModal
                strategy={selectedStrategy}
                onClose={closeModal}
                onSave={saveStrategy}
            />
        )}
        </>
    );

}

export default Strategies;