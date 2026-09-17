import React from "react";

function ProgressBar({ currentAmount = 0, goalAmount = 1 }) {
  const current = Number(currentAmount) || 0;
  const goal = Number(goalAmount) || 1;
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  const displayPercentage = Math.round(percentage);

  return (
    <div className="progress-container">
      <div className="progress-bar-wrapper">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        >
          <span className="progress-text">{displayPercentage}%</span>
        </div>
      </div>
      <div className="progress-meta">
        <span className="progress-percentage">{displayPercentage}% funded</span>
      </div>
    </div>
  );
}

export default ProgressBar;
