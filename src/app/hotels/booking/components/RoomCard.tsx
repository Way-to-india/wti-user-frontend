import Image from 'next/image';
import { FiUsers } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';
import { RoomDetails } from '@/types/booking';

interface RoomCardProps {
  roomType: string;
  details: RoomDetails;
  numberOfNights: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onShowAmenities: () => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  roomType,
  details,
  numberOfNights,
  onIncrement,
  onDecrement,
  onRemove,
  onShowAmenities,
}) => {
  const theme = useTheme();

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Room image */}
        {details.imageUrls?.[0] && (
          <div className="w-full lg:w-1/4 relative">
            <div className="h-48 sm:h-32 lg:h-36 relative">
              <Image src={details.imageUrls[0]} alt={roomType} fill className="object-cover" />
            </div>
          </div>
        )}

        {/* Room details */}
        <div className={`w-full ${details.imageUrls?.[0] ? 'lg:w-3/4' : 'lg:w-full'} p-4 sm:p-6`}>
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3
                className="font-medium text-gray-800 mb-2 text-base sm:text-lg"
                style={{
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                {roomType}{' '}
                <span className="text-[#FF8B02] text-sm sm:text-base">₹{details.price}</span>
                <span className="text-xs text-gray-500">/night</span>
              </h3>

              {/* Room amenities */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                  <FiUsers className="h-3 w-3" />
                  {details.maxOccupancy || 2} Guests
                </span>

                {details.mealsIncluded && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                    {details.mealsIncluded.breakfast ? 'Breakfast Included' : 'No Meals'}
                  </span>
                )}
              </div>

              {/* Amenities */}
              {details.amenities && details.amenities.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {details.amenities.slice(0, 3).map((amenity, i) => (
                      <div key={i} className="inline-flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-[#FF8B02] flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-xs text-gray-600 truncate">{amenity}</span>
                      </div>
                    ))}
                    {details.amenities.length > 3 && (
                      <span
                        className="text-[#FF8B02] text-xs cursor-pointer hover:underline"
                        onClick={onShowAmenities}
                      >
                        +{details.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col items-start lg:items-end gap-3 lg:text-right">
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 w-full lg:w-auto">
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm bg-gray-100 border-r border-gray-300 hover:bg-gray-200 transition-colors ${
                      details.count <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={onDecrement}
                    disabled={details.count <= 1}
                    title={details.count <= 1 ? 'Minimum 1 room required' : 'Remove one room'}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm min-w-[3rem] text-center">
                    {details.count}
                  </span>
                  <button
                    type="button"
                    className={`px-3 py-2 text-sm bg-gray-100 border-l border-gray-300 hover:bg-gray-200 transition-colors ${
                      details.count >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={onIncrement}
                    disabled={details.count >= 5}
                    title={
                      details.count >= 5 ? 'Maximum 5 rooms of each type' : 'Add one more room'
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 px-2"
                  onClick={onRemove}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remove
                </button>
              </div>

              <div className="text-left lg:text-right">
                <p
                  className="text-sm font-medium mb-1"
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  {details.count} room(s) × ₹{details.price} per night
                </p>
                {details.taxRate !== undefined && (
                  <p
                    className="text-xs text-gray-500 mb-1"
                    style={{ fontFamily: theme.typography.fontFamily.regular }}
                  >
                    Including {details.taxRate}% tax
                  </p>
                )}
                <p
                  className="font-medium text-lg text-[#FF8B02]"
                  style={{ fontFamily: theme.typography.fontFamily.bold }}
                >
                  ₹{details.price * details.count * numberOfNights}
                </p>
                <p
                  className="text-xs text-gray-500"
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  for {numberOfNights} night(s)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
