import axios from "axios";
import { getItemAsync, deleteItemAsync } from "expo-secure-store";

const instance = axios.create({
  baseURL: "https://bank-app-be-eapi-btf5b.ondigitalocean.app",
});

//Problem: The axios instance has a request interceptor to attach tokens, but no response interceptor to handle 401 (unauthorized) errors. When the token expires or is invalid, the app should clear the token and handle logout.
//Fix: Add a response interceptor to handle 401 errors.

instance.interceptors.request.use(
  async (config) => {
    const token = await getItemAsync("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData - let axios handle it automatically with boundary
    if (config.data instanceof FormData) {
      config.headers = config.headers || {};
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (err) => Promise.reject(err)
);

// Response interceptor: Handle 401 errors (unauthorized)
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired - clear it
      try {
        await deleteItemAsync("token");
      } catch (deleteError) {
        // Silently fail if token deletion fails
      }

      // Reject with a clear error that components can handle
      return Promise.reject({
        ...error,
        isUnauthorized: true,
        message: "Your session has expired. Please sign in again.",
      });
    }

    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default instance;
