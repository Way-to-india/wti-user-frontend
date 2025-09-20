'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSearch } from '@/context/SearchContext';
import { cn } from '@/utils/classNames';

interface HotelSearchData {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    seniorAdults: number;
    children: number;
  };
}

interface HotelSearchTabProps {
  onSearch?: (data: HotelSearchData) => void;
  className?: string;
}

const HotelSearchTab: React.FC<HotelSearchTabProps> = ({ onSearch, className }) => {
  const router = useRouter();
  const { getCachedCities, addSearchHistory } = useSearch();
  
  const [searchData, setSearchData] = useState<HotelSearchData>({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: {
      adults: 1,
      seniorAdults: 0,
      children: 0
    }
  });

  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  const cities = getCachedCities();

  // Get today's date and one week from today as default dates
  const today = new Date().toISOString().split('T')[0];
  const weekFromToday = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Initialize dates if not set
  React.useEffect(() => {
    if (!searchData.checkIn) {
      setSearchData(prev => ({
        ...prev,
        checkIn: today,
        checkOut: weekFromToday
      }));
    }
  }, [today, weekFromToday, searchData.checkIn]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!searchData.city) {
      newErrors.city = 'Please select a destination';
    }

    if (!searchData.checkIn) {
      newErrors.checkIn = 'Please select check-in date';
    }

    if (!searchData.checkOut) {
      newErrors.checkOut = 'Please select check-out date';
    }

    if (searchData.checkIn && searchData.checkOut && searchData.checkIn >= searchData.checkOut) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }

    if (searchData.checkIn && searchData.checkIn < today) {
      newErrors.checkIn = 'Check-in date cannot be in the past';
    }

    if (searchData.guests.adults + searchData.guests.seniorAdults + searchData.guests.children === 0) {
      newErrors.guests = 'At least one guest is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSearching(true);

    try {
      // Add to search history
      addSearchHistory({
        type: 'hotels',
        query: `${searchData.city} - ${searchData.checkIn} to ${searchData.checkOut}`,
        filters: searchData
      });

      // Call onSearch if provided
      if (onSearch) {
        onSearch(searchData);
      } else {
        // Navigate to hotels page with search parameters
        const params = new URLSearchParams({
          city: searchData.city,
          checkIn: searchData.checkIn,
          checkOut: searchData.checkOut,
          guests: (searchData.guests.adults + searchData.guests.seniorAdults + searchData.guests.children).toString(),
          adults: searchData.guests.adults.toString(),
          seniorAdults: searchData.guests.seniorAdults.toString(),
          children: searchData.guests.children.toString()
        });

        router.push(`/hotels?${params.toString()}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchData, onSearch, router, addSearchHistory, today]);

  const updateGuests = (type: keyof HotelSearchData['guests'], delta: number) => {
    setSearchData(prev => ({
      ...prev,
      guests: {
        ...prev.guests,
        [type]: Math.max(0, prev.guests[type] + delta)
      }
    }));
  };

  const totalGuests = searchData.guests.adults + searchData.guests.seniorAdults + searchData.guests.children;

  return (
    <form onSubmit={handleSearch} className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Destination *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchData.city}
              onChange={(e) => setSearchData(prev => ({ ...prev, city: e.target.value }))}
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                errors.city ? 'border-red-500' : 'border-gray-300'
              )}
              disabled={isSearching}
            >
              <option value="">Select destination...</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          {errors.city && <p className="text-sm text-red-600">{errors.city}</p>}
        </div>

        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Check-in *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={searchData.checkIn}
              onChange={(e) => setSearchData(prev => ({ ...prev, checkIn: e.target.value }))}
              min={today}
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                errors.checkIn ? 'border-red-500' : 'border-gray-300'
              )}
              disabled={isSearching}
            />
          </div>
          {errors.checkIn && <p className="text-sm text-red-600">{errors.checkIn}</p>}
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Check-out *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={searchData.checkOut}
              onChange={(e) => setSearchData(prev => ({ ...prev, checkOut: e.target.value }))}
              min={searchData.checkIn || today}
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                errors.checkOut ? 'border-red-500' : 'border-gray-300'
              )}
              disabled={isSearching}
            />
          </div>
          {errors.checkOut && <p className="text-sm text-red-600">{errors.checkOut}</p>}
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Guests *
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <button
              type="button"
              onClick={() => setShowGuestSelector(!showGuestSelector)}
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-left text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                errors.guests ? 'border-red-500' : 'border-gray-300'
              )}
              disabled={isSearching}
            >
              {totalGuests} Guest{totalGuests !== 1 ? 's' : ''}
            </button>
            
            {/* Guest Selector Dropdown */}
            {showGuestSelector && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 space-y-3">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuests('adults', -1)}
                      disabled={searchData.guests.adults <= 1}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{searchData.guests.adults}</span>
                    <button
                      type="button"
                      onClick={() => updateGuests('adults', 1)}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Senior Adults */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Senior Adults</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuests('seniorAdults', -1)}
                      disabled={searchData.guests.seniorAdults <= 0}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{searchData.guests.seniorAdults}</span>
                    <button
                      type="button"
                      onClick={() => updateGuests('seniorAdults', 1)}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Children</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateGuests('children', -1)}
                      disabled={searchData.guests.children <= 0}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{searchData.guests.children}</span>
                    <button
                      type="button"
                      onClick={() => updateGuests('children', 1)}
                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGuestSelector(false)}
                  className="w-full mt-3 py-2 bg-carrot-orange text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
          {errors.guests && <p className="text-sm text-red-600">{errors.guests}</p>}
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center lg:justify-end">
        <Button
          type="submit"
          size="lg"
          isLoading={isSearching}
          disabled={isSearching}
          className="w-full lg:w-auto px-8 py-3"
        >
          {isSearching ? 'Searching...' : 'Search Hotels'}
        </Button>
      </div>

      {/* Close guest selector when clicking outside */}
      {showGuestSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowGuestSelector(false)}
        />
      )}
    </form>
  );
};

export default HotelSearchTab;
