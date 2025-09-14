// components/UserProfile.tsx
'use client'; // This component should be client-side
import SignInPage from '@/app/auth/page';
import { getAuth, signOut } from 'firebase/auth';
import Image from 'next/image';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  // console.log(user?.displayName);
  if (!user) {
    return (
      <div>
        <SignInPage />
      </div>
    );
  }
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User successfully logged out');
      // You can also redirect the user to a login page or another route if needed
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div className="h-full bg-red-800">
      {user.photoURL && (
        <Image src={user.photoURL} alt={user.displayName || 'User'} width={96} height={96} />
      )}
      <p>{user.displayName || 'Anonymous User'}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserProfile;
