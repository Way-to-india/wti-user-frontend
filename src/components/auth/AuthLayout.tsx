'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowCircleLeft } from '@phosphor-icons/react';
import loginBackground from '@/assets/images/loginImage.png';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { token, user } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (token && user) {
      router.replace('/');
    } else {
      setIsCheckingAuth(false);
    }
  }, [token, user, router]);

  if (isCheckingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={50} thickness={4} />
      </Box>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
          <div className="w-full max-w-md text-left">
            <div className="flex items-center mb-4 gap-2">
              <ArrowCircleLeft
                size={45}
                weight="fill"
                color="#FF8B02"
                className="cursor-pointer"
                onClick={handleBackNavigation}
              />
              <h1 className="text-xl font-bold text-gray-700 hidden sm:block">Way To India</h1>
            </div>
            {children}
          </div>
        </div>

        <div className="relative w-full md:w-1/2 h-64 md:h-screen hidden md:block">
          <Image
            src={loginBackground}
            alt="Login Background"
            fill
            className="rounded-3xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}
