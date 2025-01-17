import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Home from "./screens/Home/Home";
import Scanner from "./screens/Scanner/Scanner";
import List from "./screens/ListGuest/List";
import Login from "./screens/Login/Login";
import UsersTable from "./screens/User/UsersTable";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from "sweetalert2";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [role, setRole] = useState(localStorage.getItem("role") || null);

    const handleLogout = () => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Anda akan keluar dari aplikasi.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, keluar",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                setToken(null);
                setRole(null);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                Swal.fire("Berhasil!", "Anda telah keluar.", "success");
            }
        });
    };

    if (!token) {
        return (
            <Router>
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} setRole={setRole} />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        );
    }

    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {role === "admin" ? (
                        <Route path="/" element={<UsersTable />} />
                    ) : (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/scanner" element={<Scanner />} />
                            <Route path="/list" element={<List />} />
                        </>
                    )}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <BottomBar handleLogout={handleLogout} isAdmin={role === "admin"} />
            </div>
        </Router>
    );
}

function BottomBar({ handleLogout, isAdmin }) {
    const navigate = useNavigate();

    return (
        <div className="bottom-bar">
            {isAdmin ? (
                <button onClick={handleLogout}>
                    <span>🚪</span>
                    <p>Logout</p>
                </button>
            ) : (
                <>
                    <button onClick={() => navigate("/")}>
                        <span>🏠</span>
                        <p>Home</p>
                    </button>
                    <button onClick={() => navigate("/scanner")}>
                        <span>📷</span>
                        <p>Scanner</p>
                    </button>
                    <button onClick={() => navigate("/list")}>
                        <span>📋</span>
                        <p>Daftar Tamu</p>
                    </button>
                    <button onClick={handleLogout}>
                        <span>🚪</span>
                        <p>Logout</p>
                    </button>
                </>
            )}
        </div>
    );
}

export default App;