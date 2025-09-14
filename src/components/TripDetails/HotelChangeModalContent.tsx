import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

interface HotelChangeModalContentProps {
  onClose: () => void;
}

const hotels = [
  {
    id: 1,
    name: 'Standard Room',
    guests: '2-3 Guests',
    size: '150 sq.ft',
    price: 2500,
    selected: true,
    image: '/hotel1.jpg',
    amenities: [
      'Comfortable bedding and linens',
      'Private Bathroom',
      'Hot Water',
      'Television',
      'Wifi-access',
      'Desk',
      'Wardrobe',
    ],
    description:
      "Sherpa Hotel's standard rooms in Rishikesh offer a comfortable and cozy retreat. Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities.",
  },
  {
    id: 2,
    name: 'Standard Room with Balcony',
    guests: '2-3 Guests',
    size: '175 sq.ft',
    price: 3500,
    selected: false,
    image: '/hotel2.jpg',
    amenities: [
      'Comfortable bedding and linens',
      'Private Bathroom',
      'Hot Water',
      'Television',
      'Wifi-access',
      'Desk',
      'Wardrobe',
      'Balcony',
    ],
    description:
      "Sherpa Hotel's standard rooms in Rishikesh offer a comfortable and cozy retreat. Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities.",
  },
];

const HotelChangeModalContent: React.FC<HotelChangeModalContentProps> = ({ onClose }) => {
  const theme = useTheme();
  return (
    <div className="flex flex-col h-full w-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-6 py-4"
        style={{
          color: theme.colors.heavyMetal,
          fontFamily: theme.typography.fontFamily.bold
        }}
      >
        <h2 className="text-lg font-bold" style={{ fontFamily: theme.typography.fontFamily.bold }}>
          Select a Hotel
        </h2>
        <button
          onClick={onClose}
          className="text-2xl leading-none p-2 rounded-full transition-colors focus:outline-none focus:ring-2"
          style={{
            color: theme.colors.heavyMetal,
            fontFamily: theme.typography.fontFamily.bold,
            // border: `1px solid ${theme.colors.carrotOrange}`
          }}
        >
          &times;
        </button>
      </div>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.regular }}>Viewing rooms in</span>
            <span className="ml-2 text-sm font-semibold" style={{ color: theme.colors.carrotOrange, fontFamily: theme.typography.fontFamily.bold }}>Room Category: Standard</span>
          </div>
          <select className="border rounded px-2 py-1 text-sm" style={{ fontFamily: theme.typography.fontFamily.regular }}>
            <option>Sort by: Relevant</option>
          </select>
        </div>
        <div className="space-y-4">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="border rounded-lg p-4 flex gap-4 items-start bg-white shadow-sm">
              <Image src={hotel.image} alt={hotel.name} width={120} height={90} className="rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.bold }}>{hotel.name}</h3>
                  <span className="text-xs bg-gray-100 rounded px-2 py-0.5" style={{ color: theme.colors.heavyMetal }}>{hotel.guests}</span>
                  <span className="text-xs bg-gray-100 rounded px-2 py-0.5 ml-2" style={{ color: theme.colors.heavyMetal }}>{hotel.size}</span>
                </div>
                <p className="text-xs mt-1 mb-2" style={{ color: theme.colors.heavyMetal + '90', fontFamily: theme.typography.fontFamily.regular }}>{hotel.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {hotel.amenities.slice(0, 6).map((amenity, idx) => (
                    <span key={idx} className="text-xs border rounded-full px-2 py-0.5 bg-white" style={{ color: theme.colors.heavyMetal }}>{amenity}</span>
                  ))}
                  {hotel.amenities.length > 6 && (
                    <span className="text-xs border rounded-full px-2 py-0.5 bg-white" style={{ color: theme.colors.heavyMetal }}>+{hotel.amenities.length - 6} more</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-base" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.bold }}>₹{hotel.price}</span>
                  <button
                    className={`px-4 py-1 rounded border text-sm font-medium ml-2 ${
                      hotel.selected
                        ? ''
                        : 'hover:bg-orange-600'
                    }`}
                    style={hotel.selected
                      ? {
                          backgroundColor: theme.colors.milkWhite,
                          borderColor: theme.colors.carrotOrange,
                          color: theme.colors.carrotOrange,
                          cursor: 'default',
                          fontFamily: theme.typography.fontFamily.bold
                        }
                      : {
                          backgroundColor: theme.colors.carrotOrange,
                          borderColor: theme.colors.carrotOrange,
                          color: theme.colors.milkWhite,
                          fontFamily: theme.typography.fontFamily.bold
                        }
                    }
                    disabled={hotel.selected}
                  >
                    {hotel.selected ? 'Selected' : 'Select room'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelChangeModalContent; 