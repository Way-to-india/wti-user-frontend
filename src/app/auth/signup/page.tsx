'use client';
import { useState } from 'react';
import endpoints from '@/api/endpoints';
import SignupForm from '@/components/auth/SignForm';
import { useAuth } from '@/context/AuthContext';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSignupSubmit = async (user: any, name = '') => {
    console.log('User signed up:', user);

    try {
      const userData = {
        id: user.uid,
        name: name.length > 0 ? name : user.displayName || '',
        email: user.email,
        profileImagePath: user.photoURL || '',
      };

      const token = await user.getIdToken();

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoints.user.create}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        // Successful user creation
        login(token, userData);
        setIsRedirecting(true);

        // Add a small delay to show the success state
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error during signup process:', error);

      // Handle different error scenarios
      if (error.response?.status === 409) {
        // User already exists - this is actually okay for signup
        console.log('User already exists, logging in...');

        try {
          const token = await user.getIdToken();
          const userData = {
            id: user.uid,
            name: name.length > 0 ? name : user.displayName || '',
            email: user.email,
            profileImagePath: user.photoURL || '',
          };

          login(token, userData);
          setIsRedirecting(true);

          setTimeout(() => {
            router.push('/');
          }, 500);
        } catch (tokenError) {
          console.error('Error getting token for existing user:', tokenError);
          throw new Error('Authentication failed. Please try again.');
        }
      } else if (error.response?.status === 400) {
        throw new Error('Invalid user data. Please check your information.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.code?.startsWith('auth/')) {
        // Firebase authentication errors - let the form handle these
        throw error;
      } else {
        // Network or other errors
        throw new Error('Connection error. Please check your internet and try again.');
      }
    }
  };

  const handleSwitchToLogin = () => {
    if (!isRedirecting) {
      router.push('/auth/login');
    }
  };

  // Show a loading screen during redirect
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-carrot-orange mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Welcome aboard! 🎉</h2>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <SignupForm onSubmit={handleSignupSubmit} onSwitchToLogin={handleSwitchToLogin} />
        </div>
      </div>
    </div>
  );
}
