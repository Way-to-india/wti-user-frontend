'use client';

import { getUserProfileById } from '@/services/userService';
import { User } from '@/types/user';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavBar from '@/components/layout/navbar/NavBar';
import ProfileComponent from '../../components/profile/ProfileComponent';
import ProfileSkeleton from '../../components/profile/ProfileSkeleton';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: NextPage = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token || !user) {
      setLoading(false);
      return;
    }

    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      if (!user?.id) {
        throw new Error('User ID is missing');
      }
      const response = await getUserProfileById(user.id);
      console.log('User profile response:', response);
      if (response.success) {
        setUserData(response?.data);
      } else {
        throw new Error(response?.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <CircleLoader />
  //     </div>
  //   );
  // }

  return (
    <>
      <NavBar />
      {!user || !token ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">You are not logged in</h2>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : !userData ? (
        loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <div className="text-4xl mb-4">🧭</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">User data not available</h2>
            <p className="text-gray-500 mb-4">
              We couldn’t find your profile information. Please try again later or make sure you're
              logged in.
            </p>
            <button
              onClick={() => location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Reload
            </button>
          </div>
        )
      ) : (
        <ProfileComponent user={userData} onUserUpdate={fetchUserProfile} />
      )}
    </>
  );
};

export default ProfilePage;
