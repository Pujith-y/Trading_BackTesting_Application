import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        navigate("/");
    }

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/dashboard">Trading Backtester</Link>
            </div>

            <ul className="navbar-links">
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/strategies">Strategies</Link></li>
                <li><Link to="/backtests/new">New Backtest</Link></li>
                <li><Link to="/backtests">Backtest History</Link></li>
            </ul>

            <div className="navbar-actions">
                <button className="login-btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;