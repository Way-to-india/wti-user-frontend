import React from 'react';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-6">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-orange-500"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-10 h-10 bg-orange-100 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-gray-600 text-lg font-medium">Loading destinations...</p>
        <p className="text-gray-400 text-sm">Please wait while we fetch the information</p>
      </div>
    </div>
  );
}
