import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const BASE_URL = API_URL || "http://localhost:8080";

function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        formData
      );

      console.log("Login response:", response.data);

      const token = response.data.token;
      const username = response.data.username || formData.usernameOrEmail;

      if (!token) {
        setError("Login successful, but no token was received.");
        return;
      }

      authLogin(token, username);

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 401) {
        setError("Invalid username/email or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-icon">
          🌱
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue supporting meaningful campaigns.
        </p>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Username or Email</label>

            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Enter username or email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </div>

      </div>
    </div>
  );
}

export default Login;