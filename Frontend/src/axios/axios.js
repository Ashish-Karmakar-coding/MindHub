import axios from 'axios'

// Get API URL from environment variables
const getApiUrl = () => {
  // Check for VITE_API_URL first (for Vercel deployment)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Development mode
  if (import.meta.env.MODE === "development") {
    return "http://localhost:3000/api";
  }
  // Production fallback - use relative path if backend is on same domain
  return "/api";
};

export const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    withCredentials: true 
})