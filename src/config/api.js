import axios from "axios";
import Cookies from "js-cookie";

export const API_URL = "http://localhost:2000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  // config.headers.token = "testing123"
  config.headers.authorization = Cookies.get("auth_token") || "";

  return config;
});

export default axiosInstance;
