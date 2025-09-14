import React from 'react';
import Image from 'next/image';
import { Button } from '@mui/material';
import { FiUsers } from 'react-icons/fi';
import { Hotel } from '@/types/hotel';
import placeholderImage from '@/assets/images/destination.png';
import { useTheme } from '@/context/ThemeContext';
import PriceSummaryCard from './PriceSummaryCard';

interface RoomsSectionProps {
  hotel: Hotel;
  roomSelection: {
    selectedRooms: {
      [key: string]: { price: number; count: number; taxRate?: number; priceWithTax?: number };
    };
    handleRoomCountChange: (
      roomId: string,
      action: 'increment' | 'decrement',
      price: number,
      taxRate?: number,
      priceWithTax?: number
    ) => void;
    calculateTotalPrice: () => number;
    calculateTaxAmount: () => number;
    calculateTotalWithTax: () => number;
  };
  hotelId: string;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({ hotel, roomSelection, hotelId }) => {
  const theme = useTheme();
  const {
    selectedRooms,
    handleRoomCountChange,
    calculateTotalPrice,
    calculateTaxAmount,
    calculateTotalWithTax,
  } = roomSelection;

  const handleRoomSelection = (
    roomType: string,
    count: number,
    price: number,
    taxRate?: number,
    priceWithTax?: number
  ) => {
    // This could be enhanced to handle direct room selection
    handleRoomCountChange(
      roomType,
      count > 0 ? 'increment' : 'decrement',
      price,
      taxRate,
      priceWithTax
    );
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Rooms ({hotel.rooms?.length || 0} types)
      </h2>

      <div className="flex flex-col md:flex-row">
        {/* Room cards in left column */}
        <div className="w-full md:w-3/4 pr-0 md:pr-6 space-y-8">
          {hotel.rooms && hotel.rooms.length > 0 ? (
            hotel.rooms.map((room, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left column: Room Image and Price */}
                  <div className="w-full md:w-1/3 flex flex-col">
                    <div className="relative h-[200px]">
                      <Image
                        src={room.imageUrls?.[0] || placeholderImage}
                        alt={room.roomType}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-4 bg-white">
                      <div className="mb-2">
                        <p className="text-xs text-gray-500">Price per room for 1 night</p>
                        <p className="text-xs text-gray-500">(excluding tax)</p>
                        <p className="text-xl font-bold">₹{room.price}</p>
                        {room.taxRate && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">Tax: {room.taxRate}%</p>
                            {room.priceWithTax && (
                              <p className="text-sm font-semibold text-gray-700">
                                ₹{room.priceWithTax} with tax
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right column: Room Details */}
                  <div className="w-full md:w-2/3 p-6">
                    <div className="mb-4">
                      <h3
                        className="text-xl font-semibold"
                        style={{
                          color: theme.colors.heavyMetal,
                          fontFamily: theme.typography.fontFamily.bold,
                        }}
                      >
                        {room.roomType}
                      </h3>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700">
                          <FiUsers className="h-4 w-4" />
                          {room.maxOccupancy} Guests
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700">
                          {room.mealsIncluded?.breakfast ? 'Breakfast Included' : 'No Meals'}
                        </span>
                      </div>
                    </div>

                    {/* Room amenities */}
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Room Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 5).map((amenity, i) => (
                          <div key={i} className="inline-flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-gray-600"
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
                            <span className="text-sm text-gray-600">{amenity}</span>
                          </div>
                        ))}
                        {room.amenities.length > 5 && (
                          <span className="text-[#FF8B02] text-sm font-medium cursor-pointer hover:underline">
                            +{room.amenities.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Room selection controls */}
                    <div className="flex justify-end mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          <button
                            className="p-1 rounded-l border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              handleRoomCountChange(
                                room.roomType,
                                'decrement',
                                room.price,
                                room.taxRate,
                                room.priceWithTax
                              )
                            }
                            disabled={!selectedRooms[room.roomType]?.count}
                          >
                            -
                          </button>
                          <span className="px-3 py-1 border-t border-b border-gray-300 bg-white min-w-[40px] text-center">
                            {selectedRooms[room.roomType]?.count || 0}
                          </span>
                          <button
                            className="p-1 rounded-r border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              handleRoomCountChange(
                                room.roomType,
                                'increment',
                                room.price,
                                room.taxRate,
                                room.priceWithTax
                              )
                            }
                            disabled={(selectedRooms[room.roomType]?.count || 0) >= 4}
                          >
                            +
                          </button>
                        </div>

                        <Button
                          variant="contained"
                          onClick={() =>
                            handleRoomSelection(
                              room.roomType,
                              1,
                              room.price,
                              room.taxRate,
                              room.priceWithTax
                            )
                          }
                          className="py-2 px-4"
                          sx={{
                            bgcolor: selectedRooms[room.roomType]
                              ? '#DDFFD7'
                              : theme.colors.carrotOrange,
                            color: selectedRooms[room.roomType] ? '#31A31C' : 'white',
                            fontFamily: theme.typography.fontFamily.regular,
                            '&:hover': {
                              bgcolor: selectedRooms[room.roomType] ? '#C5F6BA' : '#E67E02',
                            },
                          }}
                        >
                          {selectedRooms[room.roomType] ? 'Selected' : 'Select room'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No rooms available</p>
            </div>
          )}
        </div>

        <PriceSummaryCard
          selectedRooms={selectedRooms}
          calculateTotalPrice={calculateTotalPrice}
          calculateTaxAmount={calculateTaxAmount}
          calculateTotalWithTax={calculateTotalWithTax}
          hotelId={hotelId}
          theme={theme}
        />
      </div>
    </>
  );
};
