import axios from "axios";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_API_BASE_URL || "";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});


export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  config.headers = config.headers ?? {};

  if (token) {
    config.headers ={
      ...config.headers,
      Authorization:`Bearer ${token}` ,
      "content-type": "application/json",
    };
   
  }

  if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default axiosInstance;
