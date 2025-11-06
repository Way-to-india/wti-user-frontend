import React from 'react';
import { FiShare2 } from 'react-icons/fi';
import { Rating } from '@/components/common/Rating';
import { useTheme } from '@/context/ThemeContext';

interface TourHeaderProps {
  tourDetails: any;
}

const TourHeader: React.FC<TourHeaderProps> = ({ tourDetails }) => {
  const theme = useTheme();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tourDetails?.title,
          text: tourDetails?.description,
          url: window.location.href,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast notification here
    }
  };

  return (
    <header>
      <div className="flex justify-between items-start mb-3">
        <h1
          className="text-xl sm:text-2xl lg:text-3xl font-bold pr-2"
          style={{ color: theme.colors.heavyMetal }}
        >
          {tourDetails?.title || 'Tour Title'}
        </h1>
        <button
          className="p-2 rounded-full bg-orange-500 text-white flex-shrink-0 hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          onClick={handleShare}
          aria-label="Share this tour"
        >
          <FiShare2 className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Rating value={tourDetails?.rating || 4.5} />
          <span className="text-sm text-gray-500">
            {tourDetails?.rating || 4.5} Ratings
          </span>
        </div>
      </div>
    </header>
  );
};

export default TourHeader;