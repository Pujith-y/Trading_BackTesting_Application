import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://trading-backtester-rz8p.onrender.com",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
        config.headers["Authorization"] =
            `${localStorage.getItem("token_type")} ${token}`;
    }

    return config;   // <-- THIS WAS MISSING
});

export default api;