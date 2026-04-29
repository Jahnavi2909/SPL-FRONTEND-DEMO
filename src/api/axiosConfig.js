import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function isFormDataPayload(data) {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  const isMultipartRequest = isFormDataPayload(config.data);

  config.headers = config.headers ?? {};

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  if (isMultipartRequest) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
    return config;
  }

  if (
    !config.headers["Content-Type"] &&
    !config.headers["content-type"]
  ) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default axiosInstance;
