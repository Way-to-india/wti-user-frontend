import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or use cookies if SSR
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration, logging, global error handling, etc.
    // if (error.response?.status === 401) {
    //   window.location.href = 'auth/login';
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
