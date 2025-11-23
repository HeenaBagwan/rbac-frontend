// src/api/api.js
import axios from "axios";

// Detect environment
const isProduction = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.includes("https");

const baseURL = isProduction
  ? import.meta.env.VITE_API_URL // deployed backend URL, e.g., https://rbac-backend.vercel.app/api
  : "http://localhost:5000/api";  // local backend

const api = axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true, // allow cookies if your backend uses them
});

// Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
