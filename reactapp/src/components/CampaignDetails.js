import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  fetchCampaignById,
  fetchDonations,
  makeDonation,
} from "../utils/api";
import StatusBadge from "./StatusBadge";
import { useAuth } from "../context/AuthContext";

function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userName } = useAuth();

  const [campaign, setCampaign] = useState(null);
  const [donations, setDonations] = useState([]);

  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState(userName || "");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [donateError, setDonateError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    if (userName && !donorName) {
      setDonorName(userName);
    }
  }, [userName, donorName]);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setLoading(true);
        setError("");

        const campaignData = await fetchCampaignById(id);
        setCampaign(campaignData);

        const donationData = await fetchDonations(id);
        setDonations(donationData || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
          "Failed to load campaign"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCampaign();
    }
  }, [id]);

  const handleDonation = async (event) => {
    event.preventDefault();
    setDonateError("");
    setSuccessToast("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setDonateError("Amount must be greater than 0");
      return;
    }

    if (!donorName || !donorName.trim()) {
      setDonateError("Donor name is required");
      return;
    }

    try {
      setSubmitting(true);
      await makeDonation(id, {
        amount: numericAmount,
        donorName: donorName.trim(),
        message: message.trim(),
      });

      setAmount("");
      setDonorName("");
      setMessage("");
      setSuccessToast("Donation successful! Thank you for supporting this campaign.");

      // Refresh campaign details and donations list
      const updatedCampaign = await fetchCampaignById(id);
      setCampaign(updatedCampaign);

      const updatedDonations = await fetchDonations(id);
      setDonations(updatedDonations || []);
    } catch (err) {
      setDonateError(
        err?.response?.data?.message ||
        "Failed to make donation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="campaign-details-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaign-details-container">
        <div className="error-card">
          <p>{error}</p>
          <Link to="/" className="back-btn">
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="campaign-details-container">
        <div className="error-card">
          <p>Campaign not found.</p>
          <Link to="/" className="back-btn">
            Back to Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const isActive = campaign.status === "ACTIVE";
  const goalAmount = Number(campaign.goalAmount || 0);
  const currentAmount = Number(campaign.currentAmount || 0);
  const progress = goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0;
  const roundedProgress = Math.round(progress);

  return (
    <div className="campaign-details-container">
      <div className="back-nav-bar">
        <Link to="/" className="back-link">
          ← Back to Campaigns
        </Link>
      </div>

      <div className="details-layout">
        {/* LEFT / MAIN COLUMN: CAMPAIGN INFO & DONATIONS LIST */}
        <div className="main-details-col">
          <div className="details-card">
            <div className="details-header">
              <div className="details-tags">
                <span className="category-tag">{campaign.category}</span>
                <StatusBadge status={campaign.status} />
              </div>

              <h1>{campaign.title}</h1>

              <div className="creator-meta">
                <span>Created by <strong>{campaign.creatorName}</strong></span>
                {campaign.createdAt && (
                  <span className="created-date">• {formatDate(campaign.createdAt)}</span>
                )}
              </div>
            </div>

            <div className="details-body">
              <h3>About this campaign</h3>
              <p className="full-description">{campaign.description}</p>
            </div>

            {/* FINANCIAL STATS */}
            <div className="details-stats">
              <div className="stat-box">
                <span className="stat-label">Goal Amount</span>
                <span className="stat-value">{formatCurrency(campaign.goalAmount)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Current Raised</span>
                <span className="stat-value highlight">{formatCurrency(campaign.currentAmount)}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Deadline</span>
                <span className="stat-value">{formatDate(campaign.deadline) || campaign.deadline}</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-label-row">
                <span>Progress ({roundedProgress}%)</span>
                <span>{formatCurrency(campaign.currentAmount)} of {formatCurrency(campaign.goalAmount)}</span>
              </div>
              <div className="progress">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                >
                  {roundedProgress}%
                </div>
              </div>
            </div>
          </div>

          {/* RECENT DONATIONS SECTION */}
          <div className="donations-section">
            <h2>Donations</h2>

            {donations.length === 0 ? (
              <div className="no-donations-box">
                <p>No donations yet.</p>
                <p className="sub-text">Be the first person to support this campaign.</p>
              </div>
            ) : (
              <div className="donations-list">
                {donations.map((donation) => (
                  <div key={donation.id} className="donation-item">
                    <div className="donor-avatar">
                      {(donation.donorName || "D")[0].toUpperCase()}
                    </div>
                    <div className="donation-details">
                      <div className="donor-header">
                        <strong className="donor-name">{donation.donorName}</strong>
                        <span className="donation-amount">{formatCurrency(donation.amount)}</span>
                      </div>
                      {donation.message && (
                        <p className="donor-message">"{donation.message}"</p>
                      )}
                      {donation.donatedAt && (
                        <span className="donation-time">{formatDate(donation.donatedAt)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DONATION FORM */}
        <div className="side-donation-col">
          <div className="donation-card">
            <h2>Make Donation</h2>

            {successToast && (
              <div className="success-toast">
                {successToast}
              </div>
            )}

            {!isActive && (
              <div className="inactive-notice">
                Donations are currently closed for this campaign.
              </div>
            )}

            <form onSubmit={handleDonation}>
              <div className="form-group">
                <label htmlFor="donation-amount">Amount (₹)</label>
                <input
                  id="donation-amount"
                  data-testid="donation-amount"
                  type="number"
                  placeholder="Enter amount (min ₹1)"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  disabled={!isActive || submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="donorName-input">Donor Name</label>
                <input
                  id="donorName-input"
                  data-testid="donorName-input"
                  type="text"
                  placeholder="Your full name"
                  value={donorName}
                  onChange={(event) => setDonorName(event.target.value)}
                  disabled={!isActive || submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="donation-message">Message (Optional)</label>
                <textarea
                  id="donation-message"
                  data-testid="donation-message"
                  placeholder="Leave a word of encouragement..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  disabled={!isActive || submitting}
                />
              </div>

              {donateError && (
                <p className="error-message" data-testid="donate-error">
                  {donateError}
                </p>
              )}

              <button
                type="submit"
                className="donate-btn"
                data-testid="donate-submit"
                disabled={!isActive || submitting}
              >
                Donate Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignDetails;