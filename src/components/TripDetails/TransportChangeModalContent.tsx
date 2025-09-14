import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { FiUsers } from 'react-icons/fi';

interface TransportChangeModalContentProps {
  onClose: () => void;
}

const busTypes = [
  'A/C Semi-Sleeper bus',
  'A/C Sleeper Bus',
  'A/C Seater Bus',
  'Non A/C',
];

const transports = [
  {
    id: 1,
    name: 'Volvo Bus',
    passengers: 24,
    price: 250,
    image: '/bus1.jpg',
    amenities: [
      'Semi-Sleeper',
      'Air Conditioner',
      'Water Bottle',
      'Blanket',
      'Wifi-access',
      'Reading Lamp',
    ],
    description:
      "Sherpa Hotel's standard rooms in Rishikesh offer a comfortable and cozy retreat. Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities.",
  },
  {
    id: 2,
    name: 'Volvo Bus',
    passengers: 24,
    price: 250,
    image: '/bus1.jpg',
    amenities: [
      'Semi-Sleeper',
      'Air Conditioner',
      'Water Bottle',
      'Blanket',
      'Wifi-access',
      'Reading Lamp',
    ],
    description:
      "Sherpa Hotel's standard rooms in Rishikesh offer a comfortable and cozy retreat. Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities.",
  },
];

const TransportChangeModalContent: React.FC<TransportChangeModalContentProps> = ({ onClose }) => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState(busTypes[0]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Sticky header */}
      <div
        className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-6 py-4"
        style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.bold }}
      >
        <h2 className="text-lg font-bold" style={{ fontFamily: theme.typography.fontFamily.bold }}>
          Select a Transportation
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full transition-colors focus:outline-none focus:ring-2"
          style={{
            color: theme.colors.carrotOrange,
            fontFamily: theme.typography.fontFamily.bold,
            border: `1px solid ${theme.colors.carrotOrange}`,
            background: 'transparent',
          }}
          title="Close"
        >
          &#10005;
        </button>
      </div>
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
        <div className="mb-4">
          <div className="uppercase text-xs font-bold mb-2" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.bold }}>
            In Rishikesh
          </div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {busTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-1 rounded-full text-sm font-medium border transition-colors ${
                  selectedType === type
                    ? ''
                    : 'bg-white'
                }`}
                style={
                  selectedType === type
                    ? {
                        backgroundColor: theme.colors.carrotOrange,
                        color: theme.colors.milkWhite,
                        borderColor: theme.colors.carrotOrange,
                        fontFamily: theme.typography.fontFamily.bold,
                      }
                    : {
                        backgroundColor: theme.colors.milkWhite,
                        color: theme.colors.carrotOrange,
                        borderColor: theme.colors.carrotOrange,
                        fontFamily: theme.typography.fontFamily.bold,
                      }
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {transports.map((transport) => (
            <div key={transport.id} className="border rounded-lg p-4 flex gap-4 items-start bg-white shadow-sm">
              <Image src={transport.image} alt={transport.name} width={120} height={90} className="rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.bold }}>{transport.name}</h3>
                  <span className="text-xs bg-gray-100 rounded px-2 py-0.5 flex items-center gap-1" style={{ color: theme.colors.heavyMetal }}>
                    <FiUsers className="inline-block mr-1" />
                    {transport.passengers} Passengers
                  </span>
                </div>
                <p className="text-xs mt-1 mb-2" style={{ color: theme.colors.heavyMetal + '90', fontFamily: theme.typography.fontFamily.regular }}>{transport.description}</p>
                <div className="mb-2">
                  <div className="text-xs font-bold mb-1" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.bold }}>AMENITIES</div>
                  <div className="flex flex-wrap gap-2">
                    {transport.amenities.map((amenity, idx) => (
                      <span key={idx} className="text-xs border rounded px-2 py-0.5 bg-white" style={{ color: theme.colors.heavyMetal }}>{amenity}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-semibold text-base" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.bold }}>₹{transport.price}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center border rounded px-2 py-1 text-sm" style={{ color: theme.colors.heavyMetal, fontFamily: theme.typography.fontFamily.regular }}>
                      <FiUsers className="mr-1" />1
                    </span>
                    <button
                      className="px-4 py-1 rounded border text-sm font-medium ml-2"
                      style={{
                        backgroundColor: theme.colors.carrotOrange,
                        borderColor: theme.colors.carrotOrange,
                        color: theme.colors.milkWhite,
                        fontFamily: theme.typography.fontFamily.bold,
                      }}
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
                <div className="text-xs mt-1" style={{ color: theme.colors.heavyMetal + '80', fontFamily: theme.typography.fontFamily.regular }}>
                  Price per person <span className="italic">(excluding tax)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransportChangeModalContent; 