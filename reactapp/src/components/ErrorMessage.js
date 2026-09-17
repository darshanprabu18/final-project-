import React from "react";
import { Link } from "react-router-dom";

function ErrorMessage({ message = "Unable to load page. Please try again.", showHomeBtn = true }) {
  return (
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {showHomeBtn && (
        <Link to="/" className="back-btn">
          Back to Campaigns
        </Link>
      )}
    </div>
  );
}

export default ErrorMessage;
