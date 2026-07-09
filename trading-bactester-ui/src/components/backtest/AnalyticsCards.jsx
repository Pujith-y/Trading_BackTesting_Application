import Card from "../common/Card";
import './AnalyticsCards.css';

function AnalyticsCards({ analytics }) {
    if (!analytics) return null;

    const cards = [
        { title: "Total Trades", value: analytics.total_trades },
        { title: "Winning Trades", value: analytics.winning_trades },
        { title: "Losing Trades", value: analytics.losing_trades },
        { title: "Win Rate", value: `${analytics.win_rate}%` },
        { title: "Net Profit", value: analytics.net_profit },
        { title: "Average Profit", value: analytics.average_profit },
    ];

    return (
        <div className="analytics-grid">
            {cards.map((card) => (
                <Card
                    key={card.title}
                    title={card.title}
                    content={card.value}
                />
            ))}
        </div>
    );
}

export default AnalyticsCards;