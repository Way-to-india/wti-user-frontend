import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    console.log("token is coming",token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  (error: AxiosError) => {
    // if (error.response) {
    //   const status = error.response.status;

      // Handle 401 Unauthorized - Token expired or invalid
    //   if (status === 401) {
    //     localStorage.removeItem('authToken');
    //     localStorage.removeItem('userData');

    //     // Only redirect if not already on auth page
    //     if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
    //       window.location.href = '/auth?step=login';
    //     }
    //   }

    //   // Handle 403 Forbidden
    //   if (status === 403) {
    //     console.error('Access forbidden');
    //   }

    //   // Handle 500 Internal Server Error
    //   if (status === 500) {
    //     console.error('Server error occurred');
    //   }
    // } else if (error.request) {
    //   // Network error
    //   console.error('Network error - please check your connection');
    // }

    return Promise.reject(error);
  }
);

// API endpoints
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
