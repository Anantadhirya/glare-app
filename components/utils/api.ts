import axios from "axios";

// Create axios instance with base URL from environment variable
export const api = axios.create({
  baseURL: `${
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
  }/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
