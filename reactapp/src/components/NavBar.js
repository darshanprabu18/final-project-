import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userName, logout } = useAuth();

  const isHome = location.pathname === "/";
  const isCreate =
    location.pathname === "/create" ||
    location.pathname === "/create-campaign";
  const isRegister = location.pathname === "/register";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">🌱</span>
          <span className="brand-text">
            Crowdfunding Platform
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="navbar-links">

        <Link
          to="/"
          className={isHome ? "active" : ""}
        >
          Home
        </Link>

        <Link
          to="/create-campaign"
          className={isCreate ? "active" : ""}
        >
          Create Campaign
        </Link>

        {isAuthenticated ? (
          <>
            <span className="user-name-display" style={{ fontWeight: 600, color: "#10b981", padding: "0.5rem 0.75rem" }}>
              {userName}
            </span>
            <button
              onClick={handleLogout}
              className="logout-btn"
              style={{
                background: "transparent",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "0.9rem"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/register"
            className={isRegister ? "active" : ""}
          >
            Register
          </Link>
        )}

      </div>

    </nav>
  );
}

export default NavBar;