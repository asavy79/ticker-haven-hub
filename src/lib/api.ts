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
        ...getAuthBearer()
    }
});


axiosInstance.interceptors.response.use((config) => {
    config.headers = {
        ...config.headers,
        ...getAuthBearer()
    };
    return config;
})

export default axiosInstance;