'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSearch } from '@/context/SearchContext';
import { cn } from '@/utils/classNames';

interface TransportSearchData {
  fromCity: string;
  toCity?: string;
  departureDate: string;
  returnDate?: string;
  guests: number;
  isRoundTrip: boolean;
}

interface TransportSearchTabProps {
  onSearch?: (data: TransportSearchData) => void;
  className?: string;
}

const TransportSearchTab: React.FC<TransportSearchTabProps> = ({ onSearch, className }) => {
  const router = useRouter();
  const { getCachedCities, addSearchHistory } = useSearch();
  
  const [searchData, setSearchData] = useState<TransportSearchData>({
    fromCity: '',
    toCity: '',
    departureDate: '',
    returnDate: '',
    guests: 1,
    isRoundTrip: false
  });

  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = getCachedCities();

  // Get today's date and tomorrow as default dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Initialize dates if not set
  React.useEffect(() => {
    if (!searchData.departureDate) {
      setSearchData(prev => ({
        ...prev,
        departureDate: tomorrow,
        returnDate: searchData.isRoundTrip ? dayAfterTomorrow : ''
      }));
    }
  }, [tomorrow, dayAfterTomorrow, searchData.departureDate, searchData.isRoundTrip]);

  // Update return date when round trip is toggled
  React.useEffect(() => {
    if (searchData.isRoundTrip && !searchData.returnDate) {
      setSearchData(prev => ({
        ...prev,
        returnDate: dayAfterTomorrow
      }));
    } else if (!searchData.isRoundTrip) {
      setSearchData(prev => ({
        ...prev,
        returnDate: ''
      }));
    }
  }, [searchData.isRoundTrip, dayAfterTomorrow, searchData.returnDate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!searchData.fromCity) {
      newErrors.fromCity = 'Please select departure city';
    }

    if (!searchData.departureDate) {
      newErrors.departureDate = 'Please select departure date';
    }

    if (searchData.departureDate && searchData.departureDate < today) {
      newErrors.departureDate = 'Departure date cannot be in the past';
    }

    if (searchData.isRoundTrip) {
      if (!searchData.returnDate) {
        newErrors.returnDate = 'Please select return date for round trip';
      } else if (searchData.returnDate <= searchData.departureDate) {
        newErrors.returnDate = 'Return date must be after departure date';
      }
    }

    if (searchData.guests < 1) {
      newErrors.guests = 'At least one passenger is required';
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
      const selectedFromCity = cities.find(city => city.id === searchData.fromCity);
      const selectedToCity = searchData.toCity ? cities.find(city => city.id === searchData.toCity) : null;
      
      const query = `${selectedFromCity?.name || ''} ${selectedToCity ? `to ${selectedToCity.name}` : ''} - ${searchData.isRoundTrip ? 'Round Trip' : 'One Way'}`;
      
      addSearchHistory({
        type: 'transport',
        query,
        filters: searchData
      });

      // Call onSearch if provided
      if (onSearch) {
        onSearch(searchData);
      } else {
        // Navigate to transport page with search parameters
        const params = new URLSearchParams({
          startCityId: searchData.fromCity,
          departureDate: searchData.departureDate,
          guests: searchData.guests.toString(),
          tripType: searchData.isRoundTrip ? 'round' : 'one-way'
        });
        
        if (searchData.toCity) {
          params.set('toCityId', searchData.toCity);
        }
        
        if (searchData.returnDate) {
          params.set('returnDate', searchData.returnDate);
        }

        router.push(`/transport?${params.toString()}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchData, onSearch, router, addSearchHistory, cities, today]);

  return (
    <form onSubmit={handleSearch} className={cn('space-y-4', className)}>
      {/* Trip Type Toggle */}
      <div className="flex items-center space-x-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="tripType"
            checked={!searchData.isRoundTrip}
            onChange={() => setSearchData(prev => ({ ...prev, isRoundTrip: false }))}
            className="w-4 h-4 text-carrot-orange bg-gray-100 border-gray-300 focus:ring-carrot-orange"
            disabled={isSearching}
          />
          <span className="ml-2 text-sm font-medium text-gray-700">One Way</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="tripType"
            checked={searchData.isRoundTrip}
            onChange={() => setSearchData(prev => ({ ...prev, isRoundTrip: true }))}
            className="w-4 h-4 text-carrot-orange bg-gray-100 border-gray-300 focus:ring-carrot-orange"
            disabled={isSearching}
          />
          <span className="ml-2 text-sm font-medium text-gray-700">Round Trip</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* From City */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            From *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchData.fromCity}
              onChange={(e) => setSearchData(prev => ({ ...prev, fromCity: e.target.value }))}
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                errors.fromCity ? 'border-red-500' : 'border-gray-300'
              )}
              disabled={isSearching}
            >
              <option value="">Select departure city...</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          {errors.fromCity && <p className="text-sm text-red-600">{errors.fromCity}</p>}
        </div>

        {/* To City (Optional) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            To (Optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchData.toCity || ''}
              onChange={(e) => setSearchData(prev => ({ ...prev, toCity: e.target.value || undefined }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent"
              disabled={isSearching}
            >
              <option value="">Select destination city...</option>
              {cities
                .filter(city => city.id !== searchData.fromCity)
                .map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Departure Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Departure *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={searchData.departureDate}
              onChange={(e) => setSearchData(prev => ({ ...prev, departureDate: e.target.value }))}
              min={today}
              className={cn(
                'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                errors.departureDate ? 'border-red-500' : 'border-gray-300'
              )}
              disabled={isSearching}
            />
          </div>
          {errors.departureDate && <p className="text-sm text-red-600">{errors.departureDate}</p>}
        </div>

        {/* Return Date (Conditional) */}
        {searchData.isRoundTrip ? (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Return *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={searchData.returnDate || ''}
                onChange={(e) => setSearchData(prev => ({ ...prev, returnDate: e.target.value }))}
                min={searchData.departureDate || today}
                className={cn(
                  'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                  errors.returnDate ? 'border-red-500' : 'border-gray-300'
                )}
                disabled={isSearching}
              />
            </div>
            {errors.returnDate && <p className="text-sm text-red-600">{errors.returnDate}</p>}
          </div>
        ) : (
          /* Passengers */
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Passengers *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                className={cn(
                  'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                  errors.guests ? 'border-red-500' : 'border-gray-300'
                )}
                disabled={isSearching}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} Passenger{num !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            {errors.guests && <p className="text-sm text-red-600">{errors.guests}</p>}
          </div>
        )}
      </div>

      {/* Passengers for Round Trip */}
      {searchData.isRoundTrip && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div></div> {/* Empty space */}
          <div></div> {/* Empty space */}
          <div></div> {/* Empty space */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Passengers *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={searchData.guests}
                onChange={(e) => setSearchData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                className={cn(
                  'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent',
                  errors.guests ? 'border-red-500' : 'border-gray-300'
                )}
                disabled={isSearching}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} Passenger{num !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            {errors.guests && <p className="text-sm text-red-600">{errors.guests}</p>}
          </div>
        </div>
      )}

      {/* Search Button */}
      <div className="flex justify-center lg:justify-end">
        <Button
          type="submit"
          size="lg"
          isLoading={isSearching}
          disabled={isSearching}
          className="w-full lg:w-auto px-8 py-3"
        >
          {isSearching ? 'Searching...' : 'Search Transport'}
        </Button>
      </div>
    </form>
  );
};

export default TransportSearchTab;
