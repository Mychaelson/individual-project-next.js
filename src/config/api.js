import axios from "axios";
import Cookies from "js-cookie";

export const API_URL = "http://localhost:2000";

// the axiosInstance purposes is to ensure taht every axios request has the same directory which is the API_URL
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// the axiosInstance interceptor request will intercept every request sent to backend
// in this case, it will include the token to the headers through authorization
// there is also axiosInstance interceptor for response
axiosInstance.interceptors.request.use((config) => {
  // config.headers.token = "testing123"
  config.headers.authorization = Cookies.get("auth_token") || "";

  return config;
});

export default axiosInstance;
