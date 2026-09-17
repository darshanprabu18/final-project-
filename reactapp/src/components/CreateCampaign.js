import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCampaign } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function CreateCampaign() {
  const navigate = useNavigate();
  const { isAuthenticated, userName } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    category: "",
    creatorName: userName || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    "Education",
    "Medical",
    "Animals",
    "Environment",
    "Community",
    "Technology",
    "Arts",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      api: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "This field is required.";
    } else if (
      formData.title.trim().length < 5 ||
      formData.title.trim().length > 100
    ) {
      newErrors.title = "Title must be 5-100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "This field is required.";
    } else if (
      formData.description.trim().length < 20 ||
      formData.description.trim().length > 500
    ) {
      newErrors.description = "Description must be 20-500 characters";
    }

    // Goal amount validation
    if (!formData.goalAmount) {
      newErrors.goalAmount = "This field is required.";
    } else if (Number(formData.goalAmount) < 100) {
      newErrors.goalAmount = "Goal amount must be at least 100.00";
    }

    // Deadline validation
    if (!formData.deadline) {
      newErrors.deadline = "This field is required.";
    } else {
      const today = new Date();
      const todayString = today.toISOString().split("T")[0];

      if (formData.deadline <= todayString) {
        newErrors.deadline = "Deadline must be a future date";
      }
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "This field is required.";
    }

    // Creator name validation
    if (!formData.creatorName.trim()) {
      newErrors.creatorName = "This field is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const createdCampaign = await createCampaign({
        title: formData.title.trim(),
        description: formData.description.trim(),
        goalAmount: Number(formData.goalAmount),
        deadline: formData.deadline,
        category: formData.category,
        creatorName: formData.creatorName.trim(),
      });

      navigate(`/campaign/${createdCampaign.id}`);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to create campaign";

      setErrors({
        api: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const descLength = formData.description ? formData.description.length : 0;

  return (
    <div className="create-campaign">
      <div className="create-campaign-card">
        <h1>Create Campaign</h1>
        <p className="form-subtitle">Launch your fundraising campaign and reach supporters worldwide.</p>

        {errors.api && (
          <p role="alert" className="api-error-alert">
            {errors.api}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {/* TITLE */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Help Local Animal Shelter"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "error" : ""}
            />
            {errors.title && <p className="field-error">{errors.title}</p>}
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <div className="label-counter-row">
              <label htmlFor="description">Description</label>
              <span className="char-counter">{descLength} / 500</span>
            </div>
            <textarea
              id="description"
              name="description"
              placeholder="Describe your campaign goals, background, and how funds will be used..."
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
            />
            {errors.description && <p className="field-error">{errors.description}</p>}
          </div>

          {/* GOAL AMOUNT */}
          <div className="form-group">
            <label htmlFor="goalAmount">Goal amount</label>
            <input
              id="goalAmount"
              name="goalAmount"
              type="number"
              min="100"
              placeholder="e.g. 5000.00"
              value={formData.goalAmount}
              onChange={handleChange}
              className={errors.goalAmount ? "error" : ""}
            />
            {errors.goalAmount && <p className="field-error">{errors.goalAmount}</p>}
          </div>

          {/* DEADLINE */}
          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              className={errors.deadline ? "error" : ""}
            />
            {errors.deadline && <p className="field-error">{errors.deadline}</p>}
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              data-testid="category-select"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? "error" : ""}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="field-error">{errors.category}</p>}
          </div>

          {/* CREATOR NAME */}
          <div className="form-group">
            <label htmlFor="creatorName">Creator name</label>
            <input
              id="creatorName"
              name="creatorName"
              type="text"
              placeholder="e.g. Jane Smith"
              value={formData.creatorName}
              onChange={handleChange}
              className={errors.creatorName ? "error" : ""}
            />
            {errors.creatorName && <p className="field-error">{errors.creatorName}</p>}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            data-testid="submit-button"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Campaign"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCampaign;
