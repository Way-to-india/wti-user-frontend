import axios from 'axios';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      let user = auth.currentUser;
      if (!user) {
        user = await new Promise(resolve => {
          const unsubscribe = onAuthStateChanged(auth, u => {
            unsubscribe();
            resolve(u);
          });
        });
      }
      if (user) {
        try {
          const newToken = await user.getIdToken(true);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          window.location.href = '/auth/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle token expiration, logging, global error handling, etc.
    // if (error.response?.status === 401) {
    //   window.location.href = 'auth/login';
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
