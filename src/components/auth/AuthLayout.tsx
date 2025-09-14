'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowCircleLeft } from "@phosphor-icons/react";
import loginBackground from "@/assets/images/loginImage.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const handleBackNavigation = () => {
    // Use browser history to go back to the previous page
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to homepage if there's no previous page in history
      router.push('/');
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
                onClick={handleBackNavigation} 
              />
            </div>
            {children}
          </div>
        </div>

        <div className="relative w-full md:w-1/2 h-64 md:h-screen">
          <Image src={loginBackground} alt="Login Background" fill className="rounded-3xl" />
        </div>
      </div>
    </div>
  );
}