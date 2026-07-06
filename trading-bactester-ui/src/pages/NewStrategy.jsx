import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./NewStrategy.css"
import Navbar from "../components/common/Navbar";

function NewStrategy(){
    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [ema_slow,setEmaSlow] = useState(100);
    const [ema_fast,setEmaFast] = useState(50);
    
    const navigate = useNavigate();

    async function CreateStrategy(){
        if (!name.trim()) {
            alert("Strategy name is required");
            return;
        }

        if (!description.trim()) {
            alert("Description is required");
            return;
        }
        const response = await api.post("/strategy", {
            name,
            description,
            ema_slow,
            ema_fast
        });
        console.log(response)
        navigate("/strategies");
    }
    return (
    <>
        <Navbar></Navbar>
        <div className="strategy-page">
            <div className="strategy-from-card">
                <div className="card-header">
                    <h1>New Strategy</h1>
                    <p>Create a new EMA crossover strategy.</p>
                </div>

                <div className="form-section">
                    <h3>General</h3>

                    <div className="input-group">
                        <label>Strategy Name</label>
                        <input
                            type="text"
                            required
                            placeholder="EMA Crossover"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
                            placeholder="Describe your trading strategy..."
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Indicators</h3>

                    <div className="indicator-grid">
                        <div className="input-group">
                            <label>EMA Fast</label>
                            <input
                                type="number"
                                required
                                onChange={(e) => setEmaFast(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>EMA Slow</label>
                            <input
                                type="number"
                                required
                                onChange={(e) => setEmaSlow(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button className="cancel-btn" type="button" onClick={() => navigate("/strategies")}>
                        Cancel
                    </button>

                    <button
                        className="create-btn"
                        onClick={CreateStrategy}
                    >
                        Create Strategy
                    </button>
                </div>
            </div>
        </div>
    </>
);
}

export default NewStrategy;