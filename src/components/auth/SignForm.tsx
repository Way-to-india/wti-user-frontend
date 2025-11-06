'use client';
import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

interface SignupFormProps {
  onSuccess: (token: string, userData: any) => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name');
      return false;
    }

    if (formData.name.trim().length < 2) {
      setErrorMessage('Name must be at least 2 characters long');
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setErrorMessage('Please enter a password');
      return false;
    }

    if (formData.password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/auth/signup`,
        {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }
      );

      if (response.data.status) {
        const { token, user } = response.data.payload;
        onSuccess(token, user);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to create account. Please try again.';
      setErrorMessage(errorMsg);
      console.error('Error during signup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!;


  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold mb-2">Get Started Now</h2>
      <p className="text-gray-600 mb-6">Create your account to continue</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password (min. 8 characters)"
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={handleCaptchaChange}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-500 text-white font-semibold p-3 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[48px]"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Creating account...</span>
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <p className="text-center text-gray-600 mt-6">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          disabled={isLoading || !captchaToken}
          className="text-orange-500 font-semibold hover:text-orange-600 disabled:opacity-50"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}