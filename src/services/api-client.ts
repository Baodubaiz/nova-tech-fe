import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/config';
import { useAuthStore } from '@/store/useAuthStore';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Interceptor đính kèm AccessToken vào mỗi request gửi đi
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('novatech_access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Quản lý hàng đợi cho kịch bản nhiều API đồng thời bị lỗi Token
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor xử lý phản hồi dữ liệu và tự động Refresh Token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const status = error.response?.status;

    // Hứng cả 401 (Unauthorized) lẫn 403 (Forbidden) do hết hạn Token
    if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry) {

      // Kịch bản: Đang có một request khác tiến hành Refresh Token ngầm rồi
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest); // Chạy lại request cũ với token mới tinh
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Kịch bản: Đây là request đầu tiên phát hiện lỗi Token -> Đứng ra kích hoạt Refresh
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('novatech_refresh_token') : null;

      try {
        // Sử dụng direct axios post có withCredentials: true để trình duyệt truyền HttpOnly Cookie refresh_token
        const response = await axios.post(
          `${env.apiBaseUrl}/auth/refresh`,
          { refreshToken: refreshToken || "" },
          { withCredentials: true }
        );

        // Hỗ trợ bọc lót cả 2 trường hợp: data lồng trong data hoặc trả về trực tiếp ở root
        const responseData = response.data?.data || response.data;

        if (responseData && responseData.accessToken) {
          const newAccessToken = responseData.accessToken;
          const newRefreshToken = responseData.refreshToken || refreshToken;

          const store = useAuthStore.getState();
          const user = responseData.user || store.user;

          // 1. Cập nhật dữ liệu mới vào Zustand Store
          if (user) {
            store.setAuth(user, newAccessToken, newRefreshToken);
          }

          // 2. Đồng bộ trực tiếp xuống LocalStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('novatech_access_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('novatech_refresh_token', newRefreshToken);
            }
          }

          // Giải phóng hàng đợi, cấp token mới cho các request đang xếp hàng chờ
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Tiến hành tái kích hoạt lại chính request ban đầu đã gây lỗi
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(originalRequest);
        } else {
          throw new Error('Cấu trúc dữ liệu phản hồi không hợp lệ');
        }
      } catch (refreshError) {
        // Kịch bản tồi tệ: Refresh Token cũng hết hạn hoặc bị Revoke nốt dưới Backend
        processQueue(refreshError, null);
        isRefreshing = false;

        // Xóa sạch trạng thái đăng nhập
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('novatech_access_token');
          localStorage.removeItem('novatech_refresh_token');
          window.location.href = '/login?message=session_expired';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;