'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ArrowCircleLeft } from '@phosphor-icons/react';
import { auth, googleProvider, appleProvider, signInWithPopup } from '../../lib/firebase';
import { useDispatch } from 'react-redux';

interface SignupFormProps {
  onSubmit: () => void;
  mode: 'signup' | 'login';
  onSwitchToLogin: () => void;
  onSwitchToSignup: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit,
  mode,
  onSwitchToLogin,
  onSwitchToSignup,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize the dispatch function
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Wait until the component is mounted on the client
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data: ', formData);
    if (mode === 'signup') {
      router.push('http://localhost:3000/'); // Redirect to localhost:3000 after signup
    } else if (mode === 'login') {
      router.push('http://localhost:3000/'); // Redirect to localhost:3000 after login
    }
    onSubmit();
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await signInWithPopup(auth, googleProvider);
      console.log('--->', response);

      const user = response.user;
      const id = user.uid;
      const name = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const token = await user.getIdToken();

      // try {
      // First establish the session by sending the token
      // await axios.post(
      //     'http://localhost:5000/api/auth/session',
      //     { token },
      //     {
      //         headers: {
      //             'Content-Type': 'application/json',
      //             'Authorization': `Bearer ${token}` // Include the token in the headers
      //         }
      //         // withCredentials: true // Important for cookies
      //     }
      // );

      // const userResponse = await axios.post(
      //     'http://localhost:5000/api/user/create',
      //     { id, name, email, profileImagePath: photoURL },
      //     {
      //         headers: {
      //             'Content-Type': 'application/json',
      //             'Authorization': `Bearer ${token}` // Include the token in the headers
      //         }
      //         // withCredentials: true // Important for cookies
      //     }
      // );

      // if (userResponse.status == 201) {
      //     console.log("User created successfully:", userResponse.data);
      // } else if (userResponse.status == 409) {
      //     console.log("User already exists:", userResponse.data);
      // } else {
      //     console.error("Unexpected response:", userResponse.data);
      // }
      // } catch (error) {
      //     console.error("Error creating user:", error);
      //     // You might want to handle this error specifically or re-throw it
      //     // Depending on your requirements
      // }

      // Navigate to homepage after successful sign-in and user creation
      router.push('http://localhost:3000/'); // Using relative path is better
    } catch (error) {
      console.error('Error during Google sign-in:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      router.push('http://localhost:3000/'); // Redirect to localhost:3000 after successful login
    } catch (error) {
      console.error('Error during Apple sign-in:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
          <div className="w-full max-w-md text-left">
            <div className="flex mb-4">
              <ArrowCircleLeft
                size={45}
                weight="fill"
                color="#FF8B02"
                className="cursor-pointer"
                onClick={() => router.push('/')}
              />
            </div>

            <h2 className="text-3xl font-bold mb-2">
              {mode === 'signup' ? 'Get Started Now' : 'Welcome Back'}
            </h2>
            <p>{mode === 'signup' ? '' : 'Enter your Credentials to access your account'}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded"
                  required
                />
              )}
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
              {mode === 'signup' && (
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
                  <a href="#" className="text-blue-600 underline">
                    terms & policy
                  </a>
                </label>
              )}
              <button
                type="submit"
                className="w-full bg-carrot-orange text-white font-bold p-2 rounded-lg hover:bg-orange-600 transition duration-300"
              >
                {mode === 'signup' ? 'Sign Up' : 'Login'}
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
                className="bg-gray-100 text-black p-2 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Sign in with Google
              </button>
              <button
                onClick={handleAppleSignIn}
                className="bg-gray-100 text-black p-2 rounded-lg hover:bg-gray-200 transition duration-300"
              >
                Sign in with Apple
              </button>
            </div>

            {mode === 'signup' ? (
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
            ) : (
              <p className="text-center mt-4">
                Don’t have an account?{' '}
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
            )}
          </div>
        </div>

        {/* <div className="relative w-full md:w-1/2 h-64 md:h-screen">
          <Image src={loginBackground} alt="Login Background" fill className="rounded-3xl" />
        </div> */}
      </div>
    </div>
  );
};

export default SignupForm;
