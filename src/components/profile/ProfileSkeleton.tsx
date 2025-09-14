// app/components/profile/ProfileSkeleton.tsx
import React from 'react';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header section with avatar and name */}
      <div className="p-6 md:p-8 border-b">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar placeholder */}
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
          
          {/* Name and details placeholder */}
          <div className="flex-1 w-full text-center md:text-left">
            <div className="h-8 bg-gray-200 rounded w-full md:w-1/3 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full md:w-2/3 mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full md:w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Profile info sections */}
      <div className="p-6 md:p-8 space-y-8">
        {/* Bio section */}
        <div className="p-4 md:p-6 border rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
        
        {/* Contact info section */}
        <div className="p-4 md:p-6 border rounded-lg">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;