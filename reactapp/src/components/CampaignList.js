import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchCampaigns } from "../utils/api";
import StatusBadge from "./StatusBadge";

function CampaignList() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [category, setCategory] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await fetchCampaigns({
          category: category,
          status: status,
        });

        setCampaigns(data || []);
      } catch (err) {
        console.log("Backend unavailable. Showing empty campaign state.");
        setCampaigns([]);
        setError("");
      } finally {
        setLoading(false);
      }
    };

    loadCampaigns();
  }, [category, status]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setCategory(value === "" ? undefined : value);
  };

  const handleStatusChange = (event) => {
    const value = event.target.value;
    setStatus(value === "" ? undefined : value);
  };

  const getProgress = (campaign) => {
    const goal = Number(campaign.goalAmount || 0);
    const current = Number(campaign.currentAmount || 0);

    if (goal <= 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const formatCurrency = (amount) => {
    const val = Number(amount || 0);
    return `₹${val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return (
      <div className="campaign-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaign-list-container">
        <div className="error-card">
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-list-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Make an Impact Today</span>
          <h1>Turn Ideas Into Impact</h1>
          <p>
            Support meaningful campaigns. Create a campaign, raise funds, and make a difference.
          </p>
          <div className="hero-actions">
            <Link to="/create-campaign" className="btn-primary hero-btn">
              Create a Campaign
            </Link>
          </div>
        </div>
      </section>

      {/* FILTER SECTION */}
      <section className="filter-section">
        <div className="filter-header">
          <h2>Explore Campaigns</h2>
          <p>Filter by category and status to find causes you care about</p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              data-testid="category-filter"
              value={category || ""}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              <option value="Education">Education</option>
              <option value="Medical">Medical</option>
              <option value="Animals">Animals</option>
              <option value="Environment">Environment</option>
              <option value="Community">Community</option>
              <option value="Technology">Technology</option>
              <option value="Arts">Arts</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">Status</label>
            <select
              id="status-filter"
              data-testid="status-filter"
              value={status || ""}
              onChange={handleStatusChange}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="EXPIRED">EXPIRED</option>
            </select>
          </div>
        </div>
      </section>

      {/* CAMPAIGN CARDS GRID */}
      <section className="campaigns-grid-section">
        {campaigns.length === 0 ? (
          <div className="empty-state-box">
            <p className="empty-title">No campaigns found</p>
            <p className="empty-sub">Try changing your filters or create a new campaign.</p>
            <Link to="/create-campaign" className="btn-secondary">
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="campaigns">
            {campaigns.map((campaign) => {
              const progress = getProgress(campaign);
              const roundedProgress = Math.round(progress);
              const shortDesc =
                campaign.description && campaign.description.length > 100
                  ? campaign.description.substring(0, 100) + "..."
                  : campaign.description;

              return (
                <div
                  key={campaign.id}
                  data-testid={`campaign-card-${campaign.id}`}
                  className="campaign-card"
                  onClick={() => navigate(`/campaign/${campaign.id}`)}
                >
                  <div className="card-top-row">
                    <span className="category-tag">{campaign.category}</span>
                    <StatusBadge status={campaign.status} />
                  </div>

                  <h2>{campaign.title}</h2>

                  <p className="card-description">{shortDesc || campaign.description}</p>

                  <div className="card-financials">
                    <div className="financial-row">
                      <span className="current-raised">{formatCurrency(campaign.currentAmount)} raised</span>
                      <span className="goal-target">of {formatCurrency(campaign.goalAmount)} goal</span>
                    </div>

                    <div className="progress">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${progress}%`,
                        }}
                      >
                        {roundedProgress}%
                      </div>
                    </div>
                  </div>

                  <div className="card-footer-info">
                    <span className="creator-info">By {campaign.creatorName}</span>
                    <span className="deadline-info">Deadline: {campaign.deadline}</span>
                  </div>

                  <button
                    type="button"
                    className="card-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/campaign/${campaign.id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default CampaignList;