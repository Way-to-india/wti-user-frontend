import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export const endpoints = {
  auth: {
    sendSignupOTP: '/api/user/signup/send-otp',
    verifySignupOTP: '/api/user/signup/verify-otp',
    sendLoginOTP: '/api/user/login/send-otp',
    verifyLoginOTP: '/api/user/login/verify-otp',
    resendOTP: '/api/user/resend-otp',
  },
  user: {
    profile: '/api/user/user-routes/profile',
    update: '/api/user/user-routes/update',
  },
};

export default apiClient;
