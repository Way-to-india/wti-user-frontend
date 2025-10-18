'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/layout/navbar/NavBar';
import ProfileComponent from '@/components/profile/ProfileComponent';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import apiClient, { endpoints } from '@/api/axios';

interface User {
  id: string;
  title: 'mr' | 'ms' | 'mrs' | 'none';
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  profileImagePath: string;
  pincode: number;
  bio: string;
  isPhoneVerified: boolean;
  role: string;
  cityId: string;
  stateId: string;
  countryId: string;
  bookingsIds: string[];
  paymentsIds: string[];
  reviewsIds: string[];
  cartId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth?step=login');
      return;
    }
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get(endpoints.user.profile);
      if (response.data.status) {
        setUserData(response.data.payload);
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        router.push('/auth?step=login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <ProfileSkeleton />
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Unable to load profile</h2>
            <button
              onClick={() => router.push('/auth?step=login')}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <ProfileComponent user={userData} onUserUpdate={fetchUserProfile} />
    </>
  );
};

export default ProfilePage;
