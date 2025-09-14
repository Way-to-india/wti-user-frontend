import React from 'react';
import { FiStar } from 'react-icons/fi';

interface RatingProps {
  value: number;
  max?: number;
}

export const Rating: React.FC<RatingProps> = ({ value, max = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FiStar
            key={index}
            className={`w-4 h-4 ${
              starValue <= value
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        );
      })}
    </div>
  );
}; 