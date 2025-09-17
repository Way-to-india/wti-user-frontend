'use client';
import HotelTab from '@/components/SearchSection/HotelTab';
import ToursTab from '@/components/SearchSection/ToursTab';
import TransportationTab from '@/components/SearchSection/TransportationTab';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
import { fetchThemes, fetchCities } from '@/app/redux/toursSlice';

const SearchSection = () => {
  const [selectedTab, setSelectedTab] = useState('Buy Hotels');
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { themes, cities } = useSelector((state: RootState) => state.tours);

  useEffect(() => {
    dispatch(fetchThemes());
    dispatch(fetchCities());
  }, [dispatch]);

  const themeOptions = themes.map(theme => ({
    id: theme.id,
    label: theme.label,
  }));

  const handleToursSearch = (
    page: number,
    themeId?: string | null,
    cityId?: string | null,
    duration?: number | null
  ) => {
    const query = new URLSearchParams();
    if (themeId) query.set('themeId', themeId);
    if (cityId) query.set('cityId', cityId);
    if (duration) query.set('duration', duration.toString());

    router.push(`/tours?${query.toString()}`);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-8">
      <div className="absolute inset-0 bg-milk-white rounded-b-2xl rounded-r-2xl shadow-lg"></div>

      {selectedTab === 'Tours/Packages' && (
        <ToursTab
          onSearchResults={data => console.log('Results:', data)}
          onSearchStart={() => console.log('Search started')}
          onSearchError={err => console.error('Error:', err)}
          onSearch={handleToursSearch}
          selectedCity={null}
          selectedTheme={null}
          typesOptions={themeOptions} 
          typeLabel="Tour Theme"
        />
      )}

      {selectedTab === 'Buy Hotels' && <HotelTab />}
      {selectedTab === 'Transportation' && <TransportationTab />}

      <div className="absolute top-0 left-0 transform -translate-y-full flex w-full rounded-t-lg overflow-hidden">
        {['Tours/Packages', 'Buy Hotels', 'Transportation'].map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 px-4 py-2 font-semibold ${
              selectedTab === tab ? 'bg-white text-gray-800' : 'bg-heavy-metal text-white'
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
