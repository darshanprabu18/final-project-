import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="back-home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
