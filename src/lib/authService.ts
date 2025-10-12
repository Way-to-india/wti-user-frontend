import axiosInstance from '@/api/axios';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';

interface SignupData {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

interface VerifyOTPData {
  phone: string;
  otp: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: {
      uid: string;
      firstName: string;
      lastName: string;
      phone: string;
      email?: string;
      role: string;
      isPhoneVerified: boolean;
    };
  };
}

class AuthService {
  /**
   * Sign up new user
   */
  async signup(data: SignupData): Promise<{ success: boolean; message: string; phone: string }> {
    try {
      const response = await axiosInstance.post('/api/auth/signup', data);

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          phone: response.data.data.phone,
        };
      }

      throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  }

  /**
   * Send OTP to phone number
   */
  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post('/api/auth/send-otp', { phone });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP and login
   */
  async verifyOTP(data: VerifyOTPData): Promise<AuthResponse['data']> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/api/auth/verify-otp', data);

      if (response.data.success) {
        const { token, user } = response.data.data;

        // Sign in to Firebase with custom token
        const userCredential = await signInWithCustomToken(auth, token);

        // Get Firebase ID token
        const idToken = await userCredential.user.getIdToken();

        // Store token in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', idToken);
        }

        return response.data.data;
      }

      throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Verification failed');
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axiosInstance.post('/api/auth/resend-otp', { phone });

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
        };
      }

      throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<any> {
    try {
      const response = await axiosInstance.get('/api/auth/profile');

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: any): Promise<any> {
    try {
      const response = await axiosInstance.put('/api/auth/profile', data);

      if (response.data.success) {
        return response.data.data;
      }

      throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await axiosInstance.post('/api/auth/logout');

      // Sign out from Firebase
      await firebaseSignOut(auth);

      // Clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } catch (error: any) {
      console.error('Logout error:', error);

      // Even if backend fails, clear local data
      await firebaseSignOut(auth);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    }
  }

  /**
   * Format phone number to E.164 format
   */
  formatPhoneNumber(phone: string, countryCode: string = '+91'): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // If it doesn't start with country code, add it
    if (!phone.startsWith('+')) {
      // Remove leading 0 if present
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
      }
      return `${countryCode}${cleaned}`;
    }

    return phone;
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    // E.164 format: +[country code][number]
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
}

export default new AuthService();
