import { useEffect, useState } from "react";
import "./StrategyModal.css"

function StrategyModal({
    strategy,
    onClose,
    onSave
}){


    const [name,setName] = useState("");
    const [description,setDescription] = useState("");
    const [ema_slow,setEmaSlow] = useState(100);
    const [ema_fast,setEmaFast] = useState(50);

    useEffect(() => {
    if (strategy) {
        setName(strategy.name);
        setDescription(strategy.description);
        setEmaFast(strategy.ema_fast);
        setEmaSlow(strategy.ema_slow);
    } else {
        setName("");
        setDescription("");
        setEmaFast(50);
        setEmaSlow(100);
    }},[strategy]);

    return (
    <>
        <div className="strategy-page" onClick={onClose}>
            <div className="strategy-form-card" onClick={(e) => e.stopPropagation()}>
                <div className="card-header">
                    <h1>{strategy ? "Edit Strategy" : "New Strategy"}</h1>
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
                            value={name}
                        />
                    </div>

                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            rows="4"
                            placeholder="Describe your trading strategy..."
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
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
                                onChange={(e) => setEmaFast(Number(e.target.value))}
                                value={ema_fast}
                            />
                        </div>

                        <div className="input-group">
                            <label>EMA Slow</label>
                            <input
                                type="number"
                                required
                                onChange={(e) => setEmaSlow(Number(e.target.value))}
                                value={ema_slow}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button className="cancel-btn" type="button" onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        className="create-btn"
                        onClick={() =>{
                            if (!name.trim()) {
                                alert("Strategy name is required");
                                return;
                            }
                            if (!description.trim()) {
                                alert("Strategy description is required");
                                return;
                            }
                            if (ema_fast <= 0) {
                                alert("EMA Fast value is required");
                                return;
                            }   
                            if (ema_slow <= 0) {
                                alert("EMA Slow value is required");
                                return;
                            }
                            onSave({
                                name,
                                description,
                                ema_fast,
                                ema_slow
                            })
                        }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    </>
);
}

export default StrategyModal;