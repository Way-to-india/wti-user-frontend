import React from 'react';
import { FiShare2 } from 'react-icons/fi';
import { Rating } from '@/components/common/Rating';
import { useTheme } from '@/context/ThemeContext';

interface TourHeaderProps {
  tourDetails: any;
}

const TourHeader: React.FC<TourHeaderProps> = ({ tourDetails }) => {
  const theme = useTheme();

  return (
    <>
      <div className="flex justify-between items-start mb-3">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold pr-2" style={{ color: theme.colors.heavyMetal }}>
          {tourDetails?.title || 'Tour Title'}
        </h1>
        <button className="p-2 rounded-full bg-orange-500 text-white flex-shrink-0">
          <FiShare2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Rating value={tourDetails?.rating || 4.5} />
          <span className="text-sm text-gray-500">{tourDetails?.rating || 4.5} Ratings</span>
        </div>
      </div>
    </>
  );
};

export default TourHeader;
