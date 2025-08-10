import axios from "axios";

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Request interceptor: add token before request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle expired/invalid token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
