import React from "react";
import { Link } from "react-router-dom";

function EmptyState({
  title = "No campaigns found",
  message = "Try changing your filters or create a new campaign.",
  actionText = "Create Campaign",
  actionLink = "/create-campaign"
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📁</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="empty-action-btn">
          {actionText}
        </Link>
      )}
    </div>
  );
}

export default EmptyState;
