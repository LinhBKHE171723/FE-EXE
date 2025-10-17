import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Interceptor để tự động thêm token vào header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
