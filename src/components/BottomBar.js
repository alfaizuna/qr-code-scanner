import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function BottomBar({ handleLogout }) {
    const [activeTab, setActiveTab] = useState("home");
    const navigate = useNavigate();

    const handleTabClick = (tab, path) => {
        setActiveTab(tab);
        navigate(path);
    };

    return (
        <div className="bottom-bar">
            <button
                className={activeTab === "home" ? "active" : ""}
                onClick={() => handleTabClick("home", "/")}
            >
                <span>🏠</span>
                <p>Home</p>
            </button>
            <button
                className={activeTab === "scanner" ? "active" : ""}
                onClick={() => handleTabClick("scanner", "/scanner")}
            >
                <span>📷</span>
                <p>Scanner</p>
            </button>
            <button
                className={activeTab === "list" ? "active" : ""}
                onClick={() => handleTabClick("list", "/list")}
            >
                <span>📋</span>
                <p>Daftar Tamu</p>
            </button>
            <button
                className={activeTab === "logout" ? "active" : ""}
                onClick={() => {
                    setActiveTab("logout");
                    handleLogout();
                }}
            >
                <span>🚪</span>
                <p>Logout</p>
            </button>
        </div>
    );
}

export default BottomBar;