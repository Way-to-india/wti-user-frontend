'use client';

import React, { useState, useEffect } from 'react';
import {
  FaCheck,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
} from 'react-icons/fa';
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
}

interface ProfileComponentProps {
  user: User;
  onUserUpdate?: () => void;
}

const ProfileComponent: React.FC<ProfileComponentProps> = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: user.title,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    address: user.address,
    pincode: user.pincode?.toString() || '',
    bio: user.bio || '',
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      pincode: user.pincode?.toString() || '',
      bio: user.bio || '',
    });
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      const response = await apiClient.put(endpoints.user.update, {
        ...formData,
        pincode: formData.pincode ? Number(formData.pincode) : 0,
      });

      if (response.data.success) {
        setSaveSuccess(true);
        setIsEditing(false);

        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);

        if (onUserUpdate) {
          onUserUpdate();
        }
      }
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setSaveError(err?.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: user.title,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      pincode: user.pincode?.toString() || '',
      bio: user.bio || '',
    });
    setIsEditing(false);
    setSaveError(null);
  };

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  const getTitleDisplay = (title: string) => {
    const titles: Record<string, string> = {
      mr: 'Mr.',
      ms: 'Ms.',
      mrs: 'Mrs.',
      none: '',
    };
    return titles[title] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FaCheck className="text-green-500 mr-3" />
              <p className="text-green-800 font-medium">Profile updated successfully!</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {saveError && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FaTimes className="text-red-500 mr-3" />
              <p className="text-red-800 font-medium">Error: {saveError}</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="h-32 bg-gradient-to-r from-orange-400 via-orange-500 to-purple-500 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-orange-400 to-purple-500">
                  {user.profileImagePath ? (
                    <img
                      src={user.profileImagePath}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                      {getInitials()}
                    </div>
                  )}
                </div>
                {user.isPhoneVerified && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-2 border-2 border-white shadow-lg">
                    <FaCheck className="text-white text-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-8 px-4 sm:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {getTitleDisplay(user.title)} {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center">
                  <FaPhone className="mr-2" />
                  {user.phone}
                </span>
                {user.isPhoneVerified && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-4">
                <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}

            {/* Profile Form */}
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaUser className="mr-3 text-orange-500" />
                    Personal Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Title
                      </label>
                      <select
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                      >
                        <option value="none">Select</option>
                        <option value="mr">Mr.</option>
                        <option value="ms">Ms.</option>
                        <option value="mrs">Mrs.</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaMapMarkerAlt className="mr-3 text-orange-500" />
                    Location Details
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your complete address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your pincode"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaEnvelope className="mr-3 text-orange-500" />
                    About You
                  </h2>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-center space-x-4 pt-4">
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSave />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center space-x-2 px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">0</div>
              <div className="text-gray-600 font-medium">Total Bookings</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
              <div className="text-gray-600 font-medium">Reviews</div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                {user.isPhoneVerified ? 'Active' : 'Pending'}
              </div>
              <div className="text-gray-600 font-medium">Account Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
