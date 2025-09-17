'use client';
import { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface SignupFormProps {
  onSubmit: (user: any, name: string) => Promise<void>;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSubmit, onSwitchToLogin }: SignupFormProps) {
  const { login } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'form' | 'google' | 'apple' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingType('form');

    const { name, email, password } = formData;

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await onSubmit(response?.user, name);
    } catch (error: any) {
      // Firebase error handling
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email format.');
      } else {
        setErrorMessage('Signup failed. Please try again later.');
      }
      console.error('Error during manual signup:', error);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingType('google');

    try {
      const response = await signInWithPopup(auth, googleProvider);
      await onSubmit(response?.user, '');
    } catch (error) {
      setErrorMessage('Google sign-in failed. Please try again.');
      console.error('Error during Google sign-in:', error);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const handleAppleSignIn = async () => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingType('apple');

    try {
      const response = await signInWithPopup(auth, appleProvider);
      await onSubmit(response?.user, '');
    } catch (error) {
      setErrorMessage('Apple sign-in failed. Please try again.');
      console.error('Error during Apple sign-in:', error);
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  };

  const LoadingSpinner = ({ size = 'w-5 h-5' }: { size?: string }) => (
    <svg
      className={`animate-spin ${size} text-white`}
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
    <>
      <h2 className="text-3xl font-bold mb-2">Get Started Now</h2>
      <p>&nbsp;</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent"
          required
          disabled={isLoading}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent"
          required
          disabled={isLoading}
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent"
          required
          disabled={isLoading}
        />

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{errorMessage}</p>
          </div>
        )}

        <label className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mr-2"
            required
            disabled={isLoading}
          />
          I agree to the{' '}
          <a href="#" className="text-blue-600 underline ml-1">
            terms & policy
          </a>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-carrot-orange text-white font-bold p-2 rounded-lg hover:bg-orange-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px]"
        >
          {loadingType === 'form' ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Creating Account...</span>
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="flex items-center justify-center my-8">
        <hr className="w-full text-gray-300" />
        <span className="mx-4 text-gray-500">Or</span>
        <hr className="w-full border-gray-300" />
      </div>

      <div className="flex justify-evenly gap-4">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex items-center gap-3 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center min-h-[44px]"
        >
          {loadingType === 'google' ? (
            <LoadingSpinner size="w-4 h-4" />
          ) : (
            <Image
              src="/assets/icons/google.png"
              alt="Google logo"
              className="w-5 h-5"
              width={20}
              height={20}
            />
          )}
          <span>{loadingType === 'google' ? 'Signing in...' : 'Sign in with Google'}</span>
        </button>

        <button
          onClick={handleAppleSignIn}
          disabled={isLoading}
          className="flex items-center gap-3 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center min-h-[44px]"
        >
          {loadingType === 'apple' ? (
            <LoadingSpinner size="w-4 h-4" />
          ) : (
            <Image
              src="/assets/icons/apple-logo.png"
              alt="Apple logo"
              className="w-5 h-5"
              width={20}
              height={20}
            />
          )}
          <span>{loadingType === 'apple' ? 'Signing in...' : 'Sign in with Apple'}</span>
        </button>
      </div>

      <p className="text-center mt-4">
        Have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-blue-600 underline hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign In
        </button>
      </p>
    </>
  );
}
