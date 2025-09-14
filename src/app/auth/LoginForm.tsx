'use client';
import axios from "axios";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import loginBackground from "@/assets/images/loginImage.png";
import { auth, googleProvider, appleProvider, signInWithPopup } from "../../lib/firebase";

interface LoginFormProps {
    onSubmit: () => void;
    onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSwitchToSignup }) => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
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
        console.log("Login Form Data: ", formData);
        router.push('/'); // Redirect to home after login
        onSubmit();
    };

    const handleGoogleSignIn = async () => {
        try {
            const response = await signInWithPopup(auth, googleProvider);
    
            const user = response.user;
            const token = await user.getIdToken();

            console.log("User: ", user)
            
            try {
                // Establish the session by sending the token
                await axios.post(
                    'http://localhost:5000/api/auth/session',
                    { token },
                    { 
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
            } catch (error) {
                console.error("Error during session creation:", error);
            }
    
            // Navigate to homepage after successful sign-in
            router.push('/');
        } catch (error) {
            console.error("Error during Google sign-in:", error);
        }
    };

    const handleAppleSignIn = async () => {
        try {
            await signInWithPopup(auth, appleProvider);
            router.push('/');
        } catch (error) {
            console.error("Error during Apple sign-in:", error);
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

                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p>Enter your Credentials to access your account</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            
                            <div className="flex justify-between items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Remember me
                                </label>
                                <a href="#" className="text-blue-600 text-sm">Forgot Password?</a>
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

                        <p className="text-center mt-4">
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }} className="text-blue-600 underline">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>

                <div className="relative w-full md:w-1/2 h-64 md:h-screen">
                    <Image src={loginBackground} alt="Login Background" fill className="rounded-3xl" />
                </div>
            </div>
        </div>
    );
};

export default LoginForm;