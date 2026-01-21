import axios from "axios";
import { auth } from "./firebase";

const IS_DEV = import.meta.env.VITE_ENV === "development";

let BASE_URL = "http://localhost:8000";

if (!IS_DEV) {
  BASE_URL = "https://quantx-api-production.up.railway.app";
}

console.log("BASE_URL", BASE_URL);


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