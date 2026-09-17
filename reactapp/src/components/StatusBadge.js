import React from "react";

function StatusBadge({ status }) {
  const statusUpper = (status || "ACTIVE").toUpperCase();

  let className = "status-badge active";

  if (statusUpper === "COMPLETED") {
    className = "status-badge completed";
  } else if (statusUpper === "EXPIRED") {
    className = "status-badge expired";
  }

  return (
    <span className={className}>
      {statusUpper}
    </span>
  );
}

export default StatusBadge;
