'use client';
import endpoints from '@/api/endpoints';
import SignupForm from '@/components/auth/SignForm';
import { useAuth } from '@/context/AuthContext';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const handleSignupSubmit = async (user: any, name = '') => {
    console.log('User signed up:', user);
    const userData = {
      id: user.uid,
      name: name.length > 0 ? name : user.displayName,
      email: user.email,
      profileImagePath: user.photoURL,
    };
    const token = await user.getIdToken();
    try {
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
        login(token, userData);
        router.push('/');
      } else {
        throw new Error(`Error signing up: ${response.statusText}`);
      }
    } catch (error: AxiosError | any) {
      if (error.status === 409) {
        console.error('User already exists:', error);
        login(token, userData);
        router.push('/');
      }
      console.error('Error signing up:', error);
    }
  };

  const handleSwitchToLogin = () => {
    router.push('/auth/login');
  };

  return <SignupForm onSubmit={handleSignupSubmit} onSwitchToLogin={handleSwitchToLogin} />;
}
