import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import {useNavigate} from "react-router-dom";
import logo from "../../assets/logo.png";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ setToken, setRole }) => {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/login`,
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
            <h2 style={{marginBottom:"20px", fontFamily: "Roboto, sans-serif" }}>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    style={{marginBottom: "10px", borderRadius: "10px"}}
                />
                <div style={{position: "relative"}}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{marginBottom: "10px", borderRadius: "10px", width: "100%"}}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-75%)",
                            cursor: "pointer",
                        }}
                    >
                        {showPassword ? "👁️" : "🙈"}
                    </span>
                </div>
                <button style={{borderRadius: "10px", fontFamily: "Roboto, sans-serif"}} type="submit">Login</button>
            </form>
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
};

export default Login;