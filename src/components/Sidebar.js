import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen, toggleSidebar, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    if (!isOpen) return null; // Don't render sidebar if it's closed

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-title">My App</h2>
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    ✖
                </button>
            </div>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/" onClick={toggleSidebar}>Scanner</Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;