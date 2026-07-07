import "./StrategyCard.css"

function StrategyCard({ strategy,
    onEdit,
    onDelete,
    onRunBacktest
 }) {
    return (
        <div className="strategy-card">
            <div className="card-header">
                <div>
                    <h2>{strategy.name}</h2>
                    <span className="strategy-date">
                        Created {new Date(strategy.created_at).toLocaleDateString()}
                    </span>
                </div>

                <span className="status-badge">
                    EMA Strategy
                </span>
            </div>

            <p className="strategy-description">
                {strategy.description.length > 40
                    ? strategy.description.substring(0, 30) + "..."
                    : strategy.description}
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
                <button className="primary-btn" onClick={() => onRunBacktest(strategy)}>
                    ▶ Run Backtest
                </button>

                <button className="secondary-btn" onClick={() => onEdit(strategy)}>
                    Edit
                </button>

                <button className="danger-btn" onClick={() => onDelete(strategy.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default StrategyCard;