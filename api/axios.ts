import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const resolvedBaseURL = API_URL?.trim();
const baseURLNormalized = resolvedBaseURL?.replace(/\/+$/, "");

console.log("🌐 [API Config]");
console.log("   Raw API_URL:", API_URL);
console.log("   Normalized baseURL:", baseURLNormalized);

if (!resolvedBaseURL) {
  // Helpful log during development if .env isn't configured
  console.warn(
    "[api] Missing API_URL environment variable. Set it in your .env file (e.g., API_URL=https://your.api)."
  );
}

const apiClient = axios.create({
  baseURL: baseURLNormalized,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

/**
 * Attach Bearer token to all outgoing requests
 * Automatically includes the saved auth token
 */
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Bearer token attached to request");
    } else {
      console.log("ℹ️ No token found - request without auth");
    }
    
    // Log full URL for debugging
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log(`📡 ${config.method?.toUpperCase()} ${fullUrl}`);
    
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

/**
 * Handle response errors globally
 * Log 401 (unauthorized) for easier debugging
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized - Token may be invalid or expired");
      // Optionally: Clear token and redirect to login
      // await AsyncStorage.removeItem("@auth_token");
      // await AsyncStorage.removeItem("@auth_user");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
