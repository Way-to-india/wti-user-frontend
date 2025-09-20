import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

let currentUser: FirebaseUser | null = null;
let authReady: boolean = false;

onAuthStateChanged(auth, (user: FirebaseUser | null) => {
  currentUser = user;
  authReady = true;
  if (user) {
    user
      .getIdToken()
      .then((token: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      })
      .catch(console.error);
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
});

const waitForAuthState = (): Promise<FirebaseUser | null> => {
  return new Promise(resolve => {
    if (authReady) {
      resolve(currentUser);
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
        unsubscribe();
        resolve(user);
      });
    }
  });
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const user = await waitForAuthState();

        if (user) {
          try {
            const newToken: string = await user.getIdToken(true);
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', newToken);
            }

            // Retry the original request with new token
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${newToken}`;
              return axiosInstance.request(error.config);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Token refresh failed, redirect to login
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              window.location.href = '/auth/login';
            }
          }
        } else {
          // No user signed in, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            window.location.href = '/auth/login';
          }
        }
      } catch (authError) {
        console.error('Auth state check failed:', authError);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/auth/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
