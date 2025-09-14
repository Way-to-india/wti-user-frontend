import React from 'react';
import { FiShare2, FiStar } from 'react-icons/fi';
import { Hotel } from '@/types/hotel';

interface HotelHeaderProps {
  hotel: Hotel;
}

export const HotelHeader: React.FC<HotelHeaderProps> = ({ hotel }) => {
  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold text-[#FF8B02]">{hotel.name}</h1>
        <button className="p-3 bg-[#FF8B02] rounded-md text-white hover:bg-[#e67f00]">
          <FiShare2 size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
          {hotel.category || '5 Star Hotel'}
        </div>
        <div className="flex items-center">
          <div className="flex text-[#FF8B02]">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <FiStar
                  key={i}
                  className={i < (hotel.userRating || 4.5) ? 'text-[#FF8B02]' : 'text-gray-300'}
                  size={16}
                />
              ))}
          </div>
          <span className="text-sm ml-2">{hotel.userRating || 4.5} Ratings</span>
        </div>
      </div>
    </div>
  );
};
