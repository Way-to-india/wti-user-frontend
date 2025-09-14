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
  onSubmit: (user: any, name: string) => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSubmit, onSwitchToLogin }: SignupFormProps) {
  const { login } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const { name, email, password } = formData;

    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      onSubmit(response?.user, name);
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
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      onSubmit(response?.user, '');
    } catch (error) {
      setErrorMessage('Google sign-in failed. Please try again.');
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, appleProvider);
      onSubmit(response?.user, '');
    } catch (error) {
      setErrorMessage('Apple sign-in failed. Please try again.');
      console.error('Error during Apple sign-in:', error);
    }
  };

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
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className="w-full p-2 border rounded"
          required
        />
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
        <label className="flex items-center">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mr-2"
            required
          />
          I agree to the{' '}
          <a href="#" className="text-blue-600 underline ml-1">
            terms & policy
          </a>
        </label>
        <button
          type="submit"
          className="w-full bg-carrot-orange text-white font-bold p-2 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Sign Up
        </button>
      </form>

      <div className="flex items-center justify-center my-8">
        <hr className="w-full text-gray-300" />
        <span className="mx-4 text-gray-500">Or</span>
        <hr className="w-full border-gray-300" />
      </div>

      <div className="flex justify-evenly">
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center gap-3 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
        >
          <Image
            src="/assets/icons/google.png"
            alt="Google logo"
            className="w-5 h-5"
            width={20}
            height={20}
          />
          Sign in with Google
        </button>
        <button
          onClick={handleAppleSignIn}
          className="flex items-center gap-3 bg-white text-black border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition duration-300"
        >
          <Image
            src="/assets/icons/apple-logo.png"
            alt="Apple logo"
            className="w-5 h-5"
            width={20}
            height={20}
          />
          Sign in with Apple
        </button>
      </div>

      <p className="text-center mt-4">
        Have an account?{' '}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            onSwitchToLogin();
          }}
          className="text-blue-600 underline"
        >
          Sign In
        </a>
      </p>
    </>
  );
}
