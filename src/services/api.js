// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://flash-print.uz/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
