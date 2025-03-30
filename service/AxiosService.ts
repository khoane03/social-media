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

axiosInstance.interceptors.request.use(
  (config) => {
    if (!noAuthUrls.some((url) => config.url?.includes(url))) {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        window.location.href = '/login';
        return Promise.reject(new Error('No access token'));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (!noAuthUrls.some((url) => error.config.url?.includes(url))) {
      console.error("Axios error:", error);
      console.log("calling axiosInstance.interceptors.response.use");
      if (!error.response) {
        console.error("Network error or server not reachable");
        return Promise.reject(error);
      }
      const originalRequest = error.config;
      switch (error.response.status) {
        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshToken = getRefreshToken();
              if (refreshToken) {
                const response = await axios.post(
                  'http://localhost:8686/api/v1/auth/refresh',
                  { refreshToken }
                );

                const newAccessToken = response.data.data.accessToken;
                setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                console.log("calling refresh token");
                return axiosInstance(originalRequest);
              } else {
                throw new Error('No refresh token available');
              }
            } catch (refreshError) {
              console.error("Refresh token failed:", refreshError);
              removeAccessToken();
              removeRefreshToken();
              // window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
          break;

        case 403:
          console.error("Forbidden: Access denied");
          // window.location.href = '/login';
          break;

        case 404:
          console.error("Not Found: Redirecting to 404 page");
          // window.location.href = '/404';
          break;

        case 500:
          console.error(error.response.data.errMess);
          if (error.response.data.errMess === 'Access Denied') {
            window.location.href = '/no-permission';
            alert("Bạn không có quyền truy cập vào trang này");
            // window.location.href = '/login';
          }
          // window.location.href = '/login';
          break;

        default:
          // window.location.href = '/login';
          console.error(`Unhandled status code: ${error.response.status}`);
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
