import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// Tạo instance Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage hoặc sessionStorage
    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    config.headers = config.headers || {};
    if (accessToken) {
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Nếu lỗi 401 (token hết hạn) và chưa retry lần nào
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest!._retry = true;

      try {
        // Lấy refresh token
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        // Gọi API refresh token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const { accessToken: newAccessToken } = refreshResponse.data;

        // Cập nhật localStorage / sessionStorage
        if (localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", newAccessToken);
        } else {
          sessionStorage.setItem("accessToken", newAccessToken);
        }

        // Cập nhật header và retry request gốc
        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng lỗi → logout user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");

        window.location.href = "/login"; // redirect về login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
