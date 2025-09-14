// src/components/SearchSection.jsx
'use client';
import HotelTab from '@/components/SearchSection/HotelTab';
import ToursTab from '@/components/SearchSection/ToursTab';
import TransportationTab from '@/components/SearchSection/TransportationTab';
import React, { useState } from 'react';

const SearchSection = () => {
  const [selectedTab, setSelectedTab] = useState('Buy Hotels');

  // State for search inputs
  const [location, setLocation] = useState('');
  const [hotelType, setHotelType] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    // Implement search logic based on selectedTab and inputs
    e.preventDefault();
    const searchParams = {
      location,
      hotelType,
      checkInDate,
      checkOutDate,
      rooms,
      adults,
    };
    console.log(searchParams);
    // Add your search logic here (e.g., API call)
  };
  return (
    <div className="relative w-full max-w-7xl mx-auto mt-8">
      <div className="absolute inset-0 bg-milk-white rounded-b-2xl rounded-r-2xl shadow-lg"></div>
      {/* Content for Tours/Package */}
      {selectedTab === 'Tours/Packages' && <ToursTab />}
      {/* Content for Hotels */}
      {selectedTab === 'Buy Hotels' && <HotelTab />}
      {/* Content for Transportation Tab  */}
      {selectedTab === 'Transportation' && <TransportationTab />} {/* Tab Bar */}
      <div className="absolute top-0 left-0 transform -translate-y-full flex w-full rounded-t-lg overflow-hidden">
        {['Tours/Packages', 'Buy Hotels', 'Transportation'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 px-2 sm:px-4 md:px-8 py-2 md:py-4 text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap transition-colors ${
              selectedTab === tab
                ? 'bg-white text-gray-800'
                : 'bg-heavy-metal bg-opacity-80 text-white hover:bg-opacity-90'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSection;
