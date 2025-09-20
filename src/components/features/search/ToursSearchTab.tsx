'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui';
import { useSearch } from '@/context/SearchContext';
import { cn } from '@/utils/classNames';

interface ToursSearchData {
  city: string;
  theme: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  duration?: number;
}

interface ToursSearchTabProps {
  onSearch?: (data: ToursSearchData) => void;
  className?: string;
}

const ToursSearchTab: React.FC<ToursSearchTabProps> = ({ onSearch, className }) => {
  const router = useRouter();
  const { getCachedCities, getCachedThemes, addSearchHistory } = useSearch();
  
  const [searchData, setSearchData] = useState<ToursSearchData>({
    city: '',
    theme: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    duration: undefined
  });

  const [isSearching, setIsSearching] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cities = getCachedCities();
  const themes = getCachedThemes();

  // Get today's date and one week from today as default dates
  const today = new Date().toISOString().split('T')[0];
  const weekFromToday = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Initialize dates if not set and calculate duration
  React.useEffect(() => {
    if (!searchData.checkIn) {
      setSearchData(prev => ({
        ...prev,
        checkIn: today,
        checkOut: weekFromToday
      }));
    }
  }, [today, weekFromToday, searchData.checkIn]);

  // Calculate duration whenever dates change
  React.useEffect(() => {
    if (searchData.checkIn && searchData.checkOut) {
      const startDate = new Date(searchData.checkIn);
      const endDate = new Date(searchData.checkOut);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setSearchData(prev => ({ ...prev, duration: diffDays }));
    }
  }, [searchData.checkIn, searchData.checkOut]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!searchData.city) {
      newErrors.city = 'Please select a destination';
    }

    if (!searchData.checkIn) {
      newErrors.checkIn = 'Please select travel start date';
    }

    if (!searchData.checkOut) {
      newErrors.checkOut = 'Please select travel end date';
    }

    if (searchData.checkIn && searchData.checkOut && searchData.checkIn >= searchData.checkOut) {
      newErrors.checkOut = 'End date must be after start date';
    }

    if (searchData.checkIn && searchData.checkIn < today) {
      newErrors.checkIn = 'Travel date cannot be in the past';
    }

    if (searchData.guests < 1) {
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
      const selectedCity = cities.find(city => city.id === searchData.city);
      const selectedTheme = themes.find(theme => theme.id === searchData.theme);
      
      addSearchHistory({
        type: 'tours',
        query: `${selectedCity?.name || 'Any City'} - ${selectedTheme?.name || 'Any Theme'} - ${searchData.duration} days`,
        filters: searchData
      });

      // Call onSearch if provided
      if (onSearch) {
        onSearch(searchData);
      } else {
        // Navigate to tours page with search parameters
        const params = new URLSearchParams();
        if (searchData.city) params.set('cityId', searchData.city);
        if (searchData.theme) params.set('themeId', searchData.theme);
        if (searchData.duration) params.set('duration', searchData.duration.toString());
        params.set('guests', searchData.guests.toString());
        params.set('startDate', searchData.checkIn);
        params.set('endDate', searchData.checkOut);

        router.push(`/tours?${params.toString()}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchData, onSearch, router, addSearchHistory, cities, themes, today]);

  return (
    <form onSubmit={handleSearch} className={cn('space-y-4', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
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

        {/* Theme */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tour Theme
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={searchData.theme}
              onChange={(e) => setSearchData(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:border-transparent"
              disabled={isSearching}
            >
              <option value="">Any theme...</option>
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Travel Start *
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

        {/* End Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Travel End *
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
          {searchData.duration && (
            <p className="text-xs text-gray-500">
              Duration: {searchData.duration} day{searchData.duration !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Guests *
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
                  {num} Guest{num !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
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
          {isSearching ? 'Searching...' : 'Search Tours'}
        </Button>
      </div>
    </form>
  );
};

export default ToursSearchTab;
