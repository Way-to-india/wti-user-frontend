'use client';
import { useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  appleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from '@/lib/firebase';
import Image from 'next/image';

interface LoginFormProps {
  onSubmit: (user: any) => void;
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSubmit, onSwitchToSignup }: LoginFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null); 
    const { email, password } = formData;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onSubmit(userCredential.user);
    } catch (error: any) {
      console.log(error);
      setErrorMessage('Email or Password is wrong');
      console.error('Login error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      onSubmit(response?.user);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, appleProvider);
      onSubmit(response?.user);
    } catch (error) {
      console.error('Error during Apple sign-in:', error);
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
      <p>Enter your credentials to access your account</p>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
        <div className="flex justify-end">
          <a href="#" className="text-blue-600 text-sm">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-carrot-orange text-white font-bold p-2 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Login
        </button>
      </form>

      <div className="flex items-center justify-center my-8">
        <hr className="w-full text-gray-300" />
        <span className="mx-4 text-gray-500">Or</span>
        <hr className="w-full border-gray-300" />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
        Don&apos;t have an account?{' '}
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            onSwitchToSignup();
          }}
          className="text-blue-600 underline"
        >
          Sign Up
        </a>
      </p>
    </>
  );
}
