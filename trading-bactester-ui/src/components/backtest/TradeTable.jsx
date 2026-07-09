import './TradeTable.css';

function TradeTable({ trades }) {
    const firsttradeid = trades.length > 0 ? trades[0].id : 0;
    return (
        <div className="overflow-x-auto">
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Entry Price</th>
                        <th>Entry Date & Time</th>
                        <th>Entry Description</th>
                        <th>Exit Price</th>
                        <th>Exit Date & Time</th>
                        <th>Exit Description</th>
                    </tr>
                </thead>
                <tbody>
                    {trades && trades.length > 0 ? (
                        trades.map((trade) => (
                            <tr key={trade.id}>
                                <td>{trade.id - firsttradeid + 1}</td>
                                <td>{trade.entry_price}</td>
                                <td>
                                    {trade.entry_datetime
                                        ? new Date(trade.entry_datetime).toLocaleString()
                                        : "-"}
                                </td>
                                <td>{trade.entry_discription}</td>
                                <td>{trade.exit_price ?? "-"}</td>
                                <td>
                                    {trade.exit_datetime
                                        ? new Date(trade.exit_datetime).toLocaleString()
                                        : "-"}
                                </td>
                                <td>{trade.exit_discription ?? "-"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                No trades available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default TradeTable;