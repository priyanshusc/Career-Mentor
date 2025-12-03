import axios from 'axios';
import { useAuthStore } from './authStore';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your Django server's address
});

// Use an interceptor to add the access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Use an interceptor to handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // Simply return the response if it's successful
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is a 401 and we haven't already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've retried this request

      const { refreshToken, login } = useAuthStore.getState();

      try {
        // Request a new access token using the refresh token
        const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });
        
        const newAccessToken = response.data.access;
        // Update the tokens in our store and localStorage
        login(newAccessToken, refreshToken);
        
        // Update the header of the original request with the new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also invalid, log the user out
        const { logout } = useAuthStore.getState();
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;