import axios from "axios";

<<<<<<< HEAD
const defaultBaseUrl = import.meta.env.DEV ? "http://localhost:5002/api" : "/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseUrl,
=======
const defaultBaseUrl = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
const resolvedBaseUrl = import.meta.env.VITE_API_URL || defaultBaseUrl;

const api = axios.create({
  baseURL: resolvedBaseUrl,
>>>>>>> ba31daf9cc7b3f1d98f3164ed23b0af81e54ce47
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

<<<<<<< HEAD
=======
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

>>>>>>> ba31daf9cc7b3f1d98f3164ed23b0af81e54ce47
export const getDonations = () => api.get("/donations");
export const getDonationById = (id) => api.get(`/donations/${id}`);
export const createDonation = (data) => api.post("/donations", data);
export const updateDonation = (id, data) => api.put(`/donations/${id}`, data);
export const deleteDonation = (id) => api.delete(`/donations/${id}`);
export const updateDonationStatus = (id, status) => api.patch(`/donations/${id}/status`, { status });
export const getDonationStats = () => api.get("/donations/stats/summary");

export const getApiError = (error, fallback = "Something went wrong. Please try again.") =>
<<<<<<< HEAD
  error.response?.data?.message || (error.code === "ECONNABORTED" ? "The server took too long to respond." : fallback);

=======
  error.userMessage || error.response?.data?.message || (error.code === "ECONNABORTED" ? "The server took too long to respond." : fallback);
>>>>>>> ba31daf9cc7b3f1d98f3164ed23b0af81e54ce47
