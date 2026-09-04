import axios from "axios";

const defaultBaseUrl = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
const resolvedBaseUrl = import.meta.env.VITE_API_URL || defaultBaseUrl;

const api = axios.create({
  baseURL: resolvedBaseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallback = "Something went wrong. Please try again.";
    error.userMessage =
      error.response?.data?.message ||
      (error.code === "ECONNABORTED"
        ? "The server took too long to respond. Please try again."
        : error.message || fallback);

    return Promise.reject(error);
  }
);

export const getDonations = () => api.get("/donations");
export const getDonationById = (id) => api.get(`/donations/${id}`);
export const createDonation = (data) => api.post("/donations", data);
export const updateDonation = (id, data) => api.put(`/donations/${id}`, data);
export const deleteDonation = (id) => api.delete(`/donations/${id}`);
export const updateDonationStatus = (id, status) => api.patch(`/donations/${id}/status`, { status });
export const getDonationStats = () => api.get("/donations/stats/summary");

export const getApiError = (error, fallback = "Something went wrong. Please try again.") =>
  error.userMessage || error.response?.data?.message || (error.code === "ECONNABORTED" ? "The server took too long to respond." : fallback);
