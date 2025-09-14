'use client';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleLoginSubmit = async (user: any) => {
    const userData = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      profileImagePath: user.photoURL,
    };
    const token = await user.getIdToken();
    login(token, userData);
    router.push('/');
  };

  const handleSwitchToSignup = () => {
    router.push('/auth/signup');
  };

  return <LoginForm onSubmit={handleLoginSubmit} onSwitchToSignup={handleSwitchToSignup} />;
}
