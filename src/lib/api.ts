import axios from "axios";
import { auth } from "./firebase";

// Detect environment by checking if we're on localhost
const IS_DEV = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Always use HTTPS in production
const BASE_URL = IS_DEV
  ? "http://localhost:8000"
  : "https://quantx-api-production.up.railway.app";

const WS_URL = IS_DEV
  ? "ws://localhost:8000"
  : "wss://quantx-api-production.up.railway.app";

console.log("IS_DEV:", IS_DEV);
console.log("BASE_URL:", BASE_URL);
console.log("WS_URL:", WS_URL);

export { WS_URL };


function getAuthBearer() {
  const token = auth.currentUser?.getIdToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`
  };
}


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  }
});


axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken();

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;