import React, { useState } from 'react';

interface HotelAmenitiesProps {
  amenities: string[];
}

export const HotelAmenities: React.FC<HotelAmenitiesProps> = ({ amenities }) => {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const defaultAmenities = [
    'Gym',
    'Swimming Pool',
    'Spa',
    'Bar',
    'Cafe',
    'Shuttle Service',
    'CCTV',
    'Entertainment',
  ];

  const displayAmenities = amenities.length > 0 ? amenities : defaultAmenities;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Amenities</h2>
      <div className="grid grid-cols-2 gap-3">
        {displayAmenities.slice(0, 6).map((amenity, index) => (
          <div
            key={index}
            className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-white"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF8B0226] flex items-center justify-center text-[#FF8B02]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-sm">{amenity}</span>
          </div>
        ))}
        {displayAmenities.length > 6 && (
          <div
            className="flex items-center justify-center border border-gray-200 rounded-lg p-2 bg-white text-[#FF8B02] text-sm cursor-pointer"
            onClick={() => setShowAllAmenities(true)}
          >
            +{displayAmenities.length - 6} more
          </div>
        )}
      </div>

      {/* Modal for all amenities */}
      {showAllAmenities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">All Amenities</h2>
            <ul className="space-y-2">
              {displayAmenities.map((amenity, index) => (
                <li key={index} className="text-gray-700">
                  {amenity}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-[#FF8B02] text-white rounded-lg hover:bg-[#e67f00]"
                onClick={() => setShowAllAmenities(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
