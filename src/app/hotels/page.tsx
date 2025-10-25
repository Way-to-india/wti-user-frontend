'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { ChevronDown, Calendar, MapPin, Users, DoorOpen, Loader2 } from 'lucide-react';
import NavBar from '@/components/layout/navbar/NavBar';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { popularCities } from '@/app/hotels/helpers/cities';
import { hotelsImages } from './helpers/images';
import { City } from './helpers/cities';


interface PriceRange {
  label: string;
  value: string;
}

interface DateFormatted {
  day: number;
  month: string;
  year: string;
  dayName: string;
}

const priceRanges: PriceRange[] = [
  { label: 'All Prices', value: 'all' },
  { label: '₹0 - ₹1500', value: '0-1500' },
  { label: '₹1500 - ₹2500', value: '1500-2500' },
  { label: '₹2500 - ₹5000', value: '2500-5000' },
  { label: '₹5000+', value: '5000+' },
];

const getDefaultCheckIn = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getDefaultCheckOut = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const formatDate = (dateString: string): DateFormatted => {
  if (!dateString) {
    return { day: 0, month: '', year: '', dayName: '' };
  }
  const date = new Date(dateString + 'T00:00:00');
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  return { day, month, year, dayName };
};

const Hotels: React.FC = () => {
  const [location, setLocation] = useState<string>('Goa');
  const [locationCountry, setLocationCountry] = useState<string>('India');
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [checkInDate, setCheckInDate] = useState<string>(getDefaultCheckIn);
  const [checkOutDate, setCheckOutDate] = useState<string>(getDefaultCheckOut);
  const [rooms, setRooms] = useState<number>(1);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showPriceDropdown, setShowPriceDropdown] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { token } = useAuth();
  const router = useRouter();

  const locationRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);

  const duplicatedImages = useMemo(
    () => [...hotelsImages, ...hotelsImages, ...hotelsImages],
    []
  );

  const checkInFormatted = useMemo(() => formatDate(checkInDate), [checkInDate]);
  const checkOutFormatted = useMemo(() => formatDate(checkOutDate), [checkOutDate]);
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const filteredCities = useMemo(
    () =>
      popularCities.filter(
        city =>
          city.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
          city.country.toLowerCase().includes(locationSearch.toLowerCase())
      ),
    [locationSearch]
  );

  const selectedPriceLabel = useMemo(
    () => priceRanges.find(p => p.value === priceRange)?.label || 'All Prices',
    [priceRange]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setShowGuestsDropdown(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setShowPriceDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationSelect = useCallback((city: City): void => {
    setLocation(city.name);
    setLocationCountry(city.country);
    setShowLocationDropdown(false);
    setLocationSearch('');
  }, []);

  const toggleLocationDropdown = useCallback(() => {
    setShowLocationDropdown(prev => !prev);
  }, []);

  const toggleGuestsDropdown = useCallback(() => {
    setShowGuestsDropdown(prev => !prev);
  }, []);

  const togglePriceDropdown = useCallback(() => {
    setShowPriceDropdown(prev => !prev);
  }, []);

  const handleLocationSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationSearch(e.target.value);
  }, []);

  const handleCheckInChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    setCheckInDate(newCheckIn);

    // Auto-adjust checkout if it's before or equal to new check-in
    const checkIn = new Date(newCheckIn);
    const checkOut = new Date(checkOutDate);
    if (checkOut <= checkIn) {
      const newCheckOut = new Date(checkIn);
      newCheckOut.setDate(newCheckOut.getDate() + 1);
      setCheckOutDate(newCheckOut.toISOString().split('T')[0]);
    }
  }, [checkOutDate]);

  const handleCheckOutChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckOutDate(e.target.value);
  }, []);

  const incrementRooms = useCallback(() => {
    setRooms(prev => Math.min(10, prev + 1));
  }, []);

  const decrementRooms = useCallback(() => {
    setRooms(prev => Math.max(1, prev - 1));
  }, []);

  const incrementAdults = useCallback(() => {
    setAdults(prev => Math.min(20, prev + 1));
  }, []);

  const decrementAdults = useCallback(() => {
    setAdults(prev => Math.max(1, prev - 1));
  }, []);

  const incrementChildren = useCallback(() => {
    setChildren(prev => Math.min(10, prev + 1));
  }, []);

  const decrementChildren = useCallback(() => {
    setChildren(prev => Math.max(0, prev - 1));
  }, []);

  const closeGuestsDropdown = useCallback(() => {
    setShowGuestsDropdown(false);
  }, []);

  const handlePriceSelect = useCallback((value: string) => {
    setPriceRange(value);
    setShowPriceDropdown(false);
  }, []);

  const handleSearch = useCallback(async (): Promise<void> => {
    try {
      // Check authentication first
      if (!token) {
        toast.error('Please login to submit a query');
        router.push('/auth/login');
        return;
      }

      // Validate required fields
      if (!location || !checkInDate || !checkOutDate) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate dates
      const checkIn = new Date(checkInDate + 'T00:00:00');
      const checkOut = new Date(checkOutDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        toast.error('Check-in date cannot be in the past');
        return;
      }

      if (checkOut <= checkIn) {
        toast.error('Check-out date must be after check-in date');
        return;
      }

      // Validate guests
      if (adults < 1) {
        toast.error('At least 1 adult is required');
        return;
      }

      if (rooms < 1) {
        toast.error('At least 1 room is required');
        return;
      }

      setIsSubmitting(true);

      // Prepare data in the exact format expected by backend
      const queryData = {
        location: `${location}, ${locationCountry}`,
        checkInDate: checkInDate, // Backend expects YYYY-MM-DD string
        checkOutDate: checkOutDate, // Backend expects YYYY-MM-DD string
        rooms: Number(rooms),
        adults: Number(adults),
        children: Number(children),
        priceRange: priceRange,
      };

      console.log('Submitting hotel query:', queryData);

      const response = await axiosInstance.post('/api/user/hotel-query', queryData);

      if (response.data.status) {
        toast.success('Query submitted successfully! We will get back to you soon.');
        setLocation('Goa');
        setLocationCountry('India');
        setCheckInDate(getDefaultCheckIn());
        setCheckOutDate(getDefaultCheckOut());
        setRooms(1);
        setAdults(2);
        setChildren(0);
        setPriceRange('all');
      } else {
        toast.error(response.data.message || 'Failed to submit query');
      }
    } catch (error: any) {
      console.error('Error submitting hotel query:', error);

      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        router.push('/auth/login');
        return;
      }

      // Handle rate limiting (too many queries)
      if (error.response?.status === 429 || error.message?.includes('maximum limit')) {
        toast.error('You have reached the maximum limit of 5 active queries. Please delete some queries before creating new ones.');
        return;
      }

      // Handle validation errors
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Please check your input and try again';
        toast.error(errorMessage);
        return;
      }

      // Generic error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to submit query. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [token, location, locationCountry, checkInDate, checkOutDate, rooms, adults, children, priceRange, router]);

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <section className="relative h-auto min-h-[500px] md:h-[600px] pt-20 md:pt-24">
        <div className="absolute inset-0">
          <Image
            src="/hotel-banner.jpeg"
            alt="Scenic mountain landscape"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 40%' }}
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[500px] md:h-[600px] px-3 sm:px-4 md:px-6 py-8">
          <div className="w-full max-w-6xl">
            <div className="hidden md:flex items-center gap-3 lg:gap-6 mb-4 lg:mb-6 flex-wrap">
              <div className="hidden lg:block ml-auto">
                <span className="text-white text-xs lg:text-sm">
                  Book Domestic and International Property Online. To list your property{' '}
                </span>
                <a
                  href="#"
                  className="text-blue-400 text-xs lg:text-sm font-semibold hover:text-blue-300"
                >
                  Click Here
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-gray-200">
                <div className="lg:px-4 relative" ref={locationRef}>
                  <label className="block text-gray-600 text-xs mb-2">
                    City, Property Name Or Location
                  </label>
                  <div className="cursor-pointer" onClick={toggleLocationDropdown}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                          {location}
                        </p>
                        <p className="text-gray-500 text-xs">{locationCountry}</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full sm:w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-3">
                        <input
                          type="text"
                          placeholder="Search city..."
                          value={locationSearch}
                          onChange={handleLocationSearchChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredCities.map((city, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleLocationSelect(city)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                          >
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-900">{city.name}</p>
                              <p className="text-xs text-gray-500">{city.country}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:px-4 relative">
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-gray-600 text-xs">Check-In</label>
                    <Calendar className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={handleCheckInChange}
                      min={minDate}
                      className="w-full h-full cursor-pointer border-0 bg-transparent text-transparent caret-transparent focus:outline-none absolute inset-0 z-20"
                    />
                    <div className="pointer-events-none">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                          {checkInFormatted.day}
                        </span>
                        <span className="text-sm sm:text-base text-gray-600">
                          {checkInFormatted.month}'{checkInFormatted.year}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{checkInFormatted.dayName}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:px-4 relative">
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-gray-600 text-xs">Check-Out</label>
                    <Calendar className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={handleCheckOutChange}
                      min={checkInDate}
                      className="w-full h-full cursor-pointer border-0 bg-transparent text-transparent caret-transparent focus:outline-none absolute inset-0 z-20"
                    />
                    <div className="pointer-events-none">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                          {checkOutFormatted.day}
                        </span>
                        <span className="text-sm sm:text-base text-gray-600">
                          {checkOutFormatted.month}'{checkOutFormatted.year}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{checkOutFormatted.dayName}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:px-4 relative" ref={guestsRef}>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-gray-600 text-xs">Rooms & Guests</label>
                    <Users className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="cursor-pointer" onClick={toggleGuestsDropdown}>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {rooms}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600">
                        Room{rooms > 1 ? 's' : ''}
                      </span>
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        {adults + children}
                      </span>
                      <span className="text-sm sm:text-base text-gray-600">
                        Guest{adults + children > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {showGuestsDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DoorOpen className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Rooms</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={decrementRooms}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              type="button"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{rooms}</span>
                            <button
                              onClick={incrementRooms}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Adults</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={decrementAdults}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              type="button"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{adults}</span>
                            <button
                              onClick={incrementAdults}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Children</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={decrementChildren}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              type="button"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{children}</span>
                            <button
                              onClick={incrementChildren}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={closeGuestsDropdown}
                          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                          type="button"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:px-4 relative" ref={priceRef}>
                  <div className="flex items-center gap-1 mb-2">
                    <label className="text-gray-600 text-xs">Price Per Night</label>
                    <ChevronDown className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="cursor-pointer" onClick={togglePriceDropdown}>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                      {selectedPriceLabel}
                    </p>
                  </div>
                  {showPriceDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-full sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3">
                      {priceRanges.map((range, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePriceSelect(range.value)}
                          className={`block w-full text-left px-3 py-2 rounded-md text-sm ${priceRange === range.value
                            ? 'bg-blue-100 text-blue-600 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          type="button"
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center">
                <button
                  onClick={handleSearch}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 sm:px-12 lg:px-16 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold text-base rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
                  type="button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'SEND QUERY'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-gray-600 text-sm font-medium mb-2">INTRODUCING</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll hover:pause">
              {duplicatedImages.map((hotel, idx) => (
                <article key={idx} className="flex-shrink-0 w-72 lg:w-80 mx-3">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={hotel.src}
                      alt={hotel.alt}
                      width={320}
                      height={224}
                      className="w-full h-56 object-cover"
                      loading={idx < 6 ? 'eager' : 'lazy'}
                      quality={85}
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .hover\\:pause:hover {
          animation-play-state: paused;
        }
        input[type='date']:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Hotels;