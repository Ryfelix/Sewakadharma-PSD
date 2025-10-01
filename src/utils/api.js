// src/utils/api.js
import axios from "axios";

const API_BASE_URL = "https://rag-chatbot-be.azurewebsites.net";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// interceptor buat otomatis nambah token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // atau dari Vuex/Pinia
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
