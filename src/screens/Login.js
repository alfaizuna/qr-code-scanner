import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import {useNavigate} from "react-router-dom";
import logo from "../assets/logo.png";

const Login = ({ setToken, setRole }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://103.166.228.202:4000/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("Response:", response);

            if (response.data.token) {
                setToken(response.data.token);
                setRole(response.data.role);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("usercode", response.data.usercode);
                setError("");
                navigate("/");
            } else {
                setError("Unexpected response from server");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="login-container">
            <img
                src={logo}
                alt="Logo"
                className="login-logo"
            />
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
};

export default Login;