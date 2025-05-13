import axios from 'axios';
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
} from './localStoreService';

const noAuthUrls = ["/auth/"];

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8686/api/v1',
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (!noAuthUrls.some((url) => config.url?.includes(url))) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        window.location.href = '/auth';
        return Promise.reject(new Error('No access token'));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !noAuthUrls.some((url) => originalRequest.url?.includes(url)) &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          'http://localhost:8686/api/v1/auth/refresh',
          { refreshToken }
        );

        const newAccessToken = response.data.data.accessToken;
        setAccessToken(newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        removeAccessToken();
        removeRefreshToken();
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Các status code khác
    if (!noAuthUrls.some((url) => error.config.url?.includes(url))) {
      switch (error.response?.status) {
        case 403:
          console.error("Forbidden: Access denied");
          window.location.href = '/auth';
          break;

        case 404:
          console.error("Not Found: Redirecting to 404 page");
          window.location.href = '/404';
          break;

        case 500:
          console.error(error.response.data.errMess);
          if (error.response.data.errMess === 'Access Denied') {
            window.location.href = '/no-permission';
            alert("Bạn không có quyền truy cập vào trang này");
          }
          // window.location.href = '/auth';
          break;

        default:
          console.error(`Unhandled status code: ${error.response.status}`);
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
