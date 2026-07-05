import "./StrategyCard.css"

function StrategyCard({ strategy }) {
    return (
        <div className="strategy-card">
            <div className="card-header">
                <div>
                    <h2>{strategy.name}</h2>
                    <span className="strategy-date">
                        Created {strategy.created_at}
                    </span>
                </div>

                <span className="status-badge">
                    EMA Strategy
                </span>
            </div>

            <p className="strategy-description">
                {strategy.description}
            </p>

            <div className="strategy-info">
                <div className="info-item">
                    <span>Fast EMA</span>
                    <strong>{strategy.ema_fast}</strong>
                </div>

                <div className="info-item">
                    <span>Slow EMA</span>
                    <strong>{strategy.ema_slow}</strong>
                </div>
            </div>

            <div className="card-actions">
                <button className="primary-btn">
                    ▶ Run Backtest
                </button>

                <button className="secondary-btn">
                    Edit
                </button>

                <button className="danger-btn">
                    Delete
                </button>
            </div>
        </div>
    );
}

export default StrategyCard;