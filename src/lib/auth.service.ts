import axiosInstance from '@/api/axios';

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  sessionId?: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
  sessionId?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    phoneNumber: string;
    name: string;
  };
}

export interface SignupRequest {
  phoneNumber: string;
  name: string;
  otp: string;
  sessionId?: string;
}

export interface SignupResponse {
  success: boolean;
  token: string;
  refreshToken?: string;
  user: {
    id: string;
    phoneNumber: string;
    name: string;
  };
}

export const authService = {
  // Send OTP for login
  sendLoginOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
    const response = await axiosInstance.post('/auth/send-otp', { phoneNumber });
    return response.data;
  },

  // Verify OTP and login
  verifyLoginOtp: async (data: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await axiosInstance.post('/auth/verify-otp', data);
    
    // Store tokens
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  // Send OTP for signup
  sendSignupOtp: async (phoneNumber: string): Promise<SendOtpResponse> => {
    const response = await axiosInstance.post('/auth/signup/send-otp', { phoneNumber });
    return response.data;
  },

  // Signup with phone number, name, and OTP
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post('/auth/signup', data);
    
    // Store tokens
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
