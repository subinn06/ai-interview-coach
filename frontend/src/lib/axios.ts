import axios from "axios";
import { useAuthStore } from "../store/auth-store";
import { normalizeApiError } from "./error-handler";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(normalizeApiError(error));
  }
);

// response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error);
    if (normalized.status === 401) {
      // clear token state to trigger automatic router redirect
      useAuthStore.getState().clear();
    }
    return Promise.reject(normalized);
  }
);

export default api;
