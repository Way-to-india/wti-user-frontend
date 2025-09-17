import Image from 'next/image';
import { Hotel } from '@/types/hotel';
import { useTheme } from '@/context/ThemeContext';

interface HotelInfoCardProps {
  hotel: Hotel;
}

export const HotelInfoCard: React.FC<HotelInfoCardProps> = ({ hotel }) => {
  const theme = useTheme();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2
            className="text-lg sm:text-xl font-semibold mb-2 truncate"
            style={{ color: theme.colors.heavyMetal }}
          >
            {hotel.name}
          </h2>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {hotel.location?.address?.addressLine1}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-2 py-1 bg-gray-100 rounded text-xs sm:text-sm">
              {hotel.category || '5 Star Hotel'}
            </span>
          </div>
        </div>
        {hotel.imageUrls?.[0] && (
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={hotel.imageUrls[0]} alt={hotel.name} fill className="object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};
