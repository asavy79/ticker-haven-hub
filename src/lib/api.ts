import axios from "axios";
import { auth } from "./firebase";

const BASE_URL = "http://localhost:8000";


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
        const token = await user.getIdToken(); // get *real* token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`, // correct place & format
        };
      }
  
      return config;
    },
    (error) => Promise.reject(error)
  );

export default axiosInstance;