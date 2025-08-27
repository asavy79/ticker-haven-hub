import axios from "axios";

const BASE_URL = "http://localhost:8000";


function getAuthBearer() {
    const accessToken = localStorage.getItem("access_token");
    const apiKey = localStorage.getItem("api_key");

    if(accessToken) {
        return `Bearer ${accessToken}`
    }

    else if(apiKey) {
        return `Bearer ${apiKey}`;
    }


    return {};
}


const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});


axiosInstance.interceptors.response.use((config) => {
    config.headers.Authorization = getAuthBearer();
    return config;
})

export default axiosInstance;