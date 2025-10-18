'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SignupForm from '@/components/auth/SignForm';
import LoginForm from '@/components/auth/LoginForm';
import GoogleSignInButton from '@/components/auth/GoogleLogin';
import { useAuth } from '@/context/AuthContext';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    const step = searchParams?.get('step');
    if (step === 'login') {
      setMode('login');
    } else {
      setMode('signup');
    }
  }, [searchParams]);

  const handleAuthSuccess = (token: string, userData: any) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    login(token, userData);
    setIsRedirecting(true);
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const handleSwitchMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setGoogleError(null);
    router.push(`/auth?step=${newMode}`, { scroll: false });
  };

  const handleGoogleError = (error: string) => {
    setGoogleError(error);
  };

  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome! 🎉</h2>
          <p className="text-gray-600">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 p-6 md:p-12 flex items-center justify-center bg-white">
          <div className="w-full max-w-md">
            {mode === 'signup' ? (
              <SignupForm
                onSuccess={handleAuthSuccess}
                onSwitchToLogin={() => handleSwitchMode('login')}
              />
            ) : (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToSignup={() => handleSwitchMode('signup')}
              />
            )}

            {/* Google Sign-In Section - Now properly placed inside the form container */}
            <div className="mt-6">
              <div className="flex items-center justify-center my-6">
                <hr className="w-full border-gray-300" />
                <span className="mx-4 text-gray-500 text-sm whitespace-nowrap">Or</span>
                <hr className="w-full border-gray-300" />
              </div>

              {googleError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm text-center">{googleError}</p>
                </div>
              )}

              {/* <GoogleSignInButton onSuccess={handleAuthSuccess} onError={handleGoogleError} /> */}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-orange-400 to-orange-600 items-center justify-center p-12">
          <div className="text-white text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">Welcome to Our Platform</h1>
              <p className="text-xl text-orange-100">
                {mode === 'signup'
                  ? 'Join thousands of users who trust us for secure authentication'
                  : "We're glad to see you back! Login to continue your journey"}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <p className="text-sm text-orange-100">Secure OTP Authentication</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⚡</div>
                <p className="text-sm text-orange-100">Lightning Fast</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📱</div>
                <p className="text-sm text-orange-100">WhatsApp Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
