'use client';

import { User } from '@/types/user';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

interface UserProfileProps {
  user: User;
}

const ProfileComponent: React.FC<UserProfileProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || '',
    address: user.address || '',
    bio: user.bio || '',
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { user: authUser, token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const { firstName, lastName, ...rest } = formData;

      const updatedData = {
        ...rest,
        name: `${firstName} ${lastName}`.trim(),
      };
      console.log('User ID: ', authUser.id);
      // Simulate API call success
      const response = await axios.post(
        'http://localhost:5000/api/user/update',
        {
          ...updatedData,
          id: authUser.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="flex flex-col items-center mb-10">
          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              {user.profileImagePath ? (
                <Image
                  src={user.profileImagePath}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                  {user.firstName}
                  {user.lastName}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <div className="flex items-center justify-center">
              <h2 className="text-xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>
              {user.verified && (
                <span className="ml-2 bg-blue-500 text-white rounded-full p-1">
                  <FaCheck size={12} />
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
        </div>

        {/* Notifications */}
        {saveSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
            Profile updated successfully!
          </div>
        )}

        {saveError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">Error: {saveError}</div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit}>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <label htmlFor="firstName" className="block font-medium mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block font-medium mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-medium mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Add your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="address" className="block font-medium mb-2">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Update your location"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="bio" className="block font-medium mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                  placeholder="Tell us about yourself"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              className="bg-orange-500 text-white font-semibold px-6 py-2 rounded disabled:bg-orange-300 text-sm"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="border border-gray-300 text-gray-600 font-semibold px-6 py-2 rounded text-sm"
              onClick={() =>
                setFormData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phone: user.phone || '',
                  address: user.address || '',
                  bio: user.bio || '',
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileComponent;
