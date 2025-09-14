// app/components/common/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  title?: string;
  icon?: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  title = "Something went wrong", 
  icon = <span className="text-5xl">🧭</span> 
}) => {
  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-sm text-center">
      <div className="flex justify-center mb-6">
        {icon}
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 mb-8">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
          aria-label="Try again"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;