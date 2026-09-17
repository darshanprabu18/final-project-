import axios from "axios";
import { API_URL } from "./constants";

const BASE_URL = API_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for clear error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = "Unable to connect to the backend.";
    } else if (error.response.status === 401) {
      error.message = "Session expired. Please login again.";
    } else if (error.response.status === 403) {
      error.message = "You are not authorized to perform this action.";
    } else if (error.response.status === 404) {
      error.message = error.response.data?.message || "Campaign not found.";
    } else if (error.response.status === 500) {
      error.message = "Server error. Please try again.";
    }
    return Promise.reject(error);
  }
);

export const fetchCampaigns = async (filters = {}) => {
  const response = await api.get("/api/campaigns", {
    params: filters,
  });

  return response.data;
};

export const getCampaigns = fetchCampaigns;

export const fetchCampaignById = async (id) => {
  const response = await api.get(`/api/campaigns/${id}`);
  return response.data;
};

export const getCampaignById = fetchCampaignById;

export const fetchDonations = async (campaignId) => {
  const response = await api.get(
    `/api/campaigns/${campaignId}/donations`
  );

  return response.data;
};

export const getDonations = fetchDonations;

export const makeDonation = async (campaignId, donation) => {
  const response = await api.post(
    `/api/campaigns/${campaignId}/donations`,
    donation
  );

  return response.data;
};

export const createDonation = makeDonation;

export const createCampaign = async (campaign) => {
  const response = await api.post(
    "/api/campaigns",
    campaign
  );

  return response.data;
};

export default api;