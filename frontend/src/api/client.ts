import axios from "axios";

// Create axios instance
const client = axios.create({
  baseURL: "/api", // We will proxy this in vite.config.ts to avoid CORS
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
client.interceptors.request.use(
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

// Response interceptor
client.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default client;
