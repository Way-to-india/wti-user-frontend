'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import CircleLoader from '../../components/CircleLoader';
import SignupForm from './SignUpForm';

const AuthLogic = () => {
  const [step, setStep] = useState<'signup' | 'login'>('signup'); 
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const queryStep = searchParams?.get('step');

    if (queryStep === 'login') {
      setStep('login');
    }
  }, [searchParams]);

  const handleSignupSubmit = () => {
    setStep('login'); // Update step to 'login'
    router.push('/?step=login'); // Redirect to login with query parameter
  };

  const handleLoginSubmit = () => {
    setStep('login');
    router.push('/'); // Redirect to the home page or another route after successful login
  };

  const switchToLogin = () => {
    setStep('login');
    router.push('/?step=login'); // Ensure the URL reflects the login state
  };

  const switchToSignup = () => {
    setStep('signup');
    router.push('/?step=signup'); // Ensure the URL reflects the signup state
  };

  return (
    <div>
      <SignupForm
        mode={step}
        onSubmit={step === 'signup' ? handleSignupSubmit : handleLoginSubmit}
        onSwitchToLogin={switchToLogin}
        onSwitchToSignup={switchToSignup}
      />
    </div>
  );
};

// Main AuthPage component
const AuthPage = () => {
  return (
    <Suspense fallback={<CircleLoader />}>
      <AuthLogic />
    </Suspense>
  );
};

export default AuthPage;
