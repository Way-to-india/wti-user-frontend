'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, Calendar, MapPin, Users, DoorOpen, Loader2 } from 'lucide-react';
import NavBar from '@/components/layout/navbar/NavBar';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface City {
  name: string;
  country: string;
}

interface HotelImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

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

const popularCities: City[] = [
  { name: 'Goa', country: 'India' },
  { name: 'Mumbai', country: 'India' },
  { name: 'Delhi', country: 'India' },
  { name: 'Bangalore', country: 'India' },
  { name: 'Singapore', country: 'Singapore' },
  { name: 'Bangkok', country: 'Thailand' },
  { name: 'Dubai', country: 'UAE' },
  { name: 'Maldives', country: 'Maldives' },
];

const hotelsImages: HotelImage[] = [
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/hotels-carousel-images/dreamstimemaximum_16218137.jpg',
    alt: 'Luxury hotel resort with swimming pool',
    title: 'Luxe properties in India',
    description: 'Explore by Luxury brands',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/hotels-carousel-images/dreamstimemaximum_181196776.jpg',
    alt: 'Premium villa with mountain views',
    title: 'Luxe Villas',
    description: 'Premium Villas with Superlative Experience',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/hotels-carousel-images/dreamstimemaximum_25296952.jpg',
    alt: 'Overwater bungalows in Maldives',
    title: 'Luxe International',
    description: 'Dubai, Maldives, Thailand & More',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/hotels-carousel-images/dreamstimemaximum_25372191.jpg',
    alt: 'Beachfront luxury resort',
    title: 'Luxe properties in India',
    description: 'Explore by Luxury brands',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/hotels-carousel-images/dreamstimemaximum_276661875.jpg',
    alt: 'Five star hotel with elegant design',
    title: 'Luxe Villas',
    description: 'Premium Villas with Superlative Experience',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/hotels-carousel-images/dreamstimemaximum_90239678.jpg',
    alt: 'Boutique hotel with mountain views',
    title: 'Luxe International',
    description: 'Dubai, Maldives, Thailand & More',
  },
];

const Hotels: React.FC = () => {
  const [location, setLocation] = useState<string>('Goa');
  const [locationCountry, setLocationCountry] = useState<string>('India');
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {token} = useAuth();

  const getDefaultCheckIn = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDefaultCheckOut = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const [checkInDate, setCheckInDate] = useState<string>(getDefaultCheckIn());
  const [checkOutDate, setCheckOutDate] = useState<string>(getDefaultCheckOut());
  const [rooms, setRooms] = useState<number>(1);
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showPriceDropdown, setShowPriceDropdown] = useState<boolean>(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const duplicatedImages: HotelImage[] = [...hotelsImages, ...hotelsImages, ...hotelsImages];

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

  const filteredCities: City[] = popularCities.filter(
    (city: City) =>
      city.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
      city.country.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleLocationSelect = (city: City): void => {
    setLocation(city.name);
    setLocationCountry(city.country);
    setShowLocationDropdown(false);
    setLocationSearch('');
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

  const checkInFormatted: DateFormatted = formatDate(checkInDate);
  const checkOutFormatted: DateFormatted = formatDate(checkOutDate);

  const handleSearch = async (): Promise<void> => {
    try {
      setIsSubmitting(true);

      // Client-side validation
      if (!location || !checkInDate || !checkOutDate) {
        toast.error('Please fill in all required fields');
        return;
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
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

      const queryData = {
        location: `${location}, ${locationCountry}`,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        rooms,
        adults,
        children,
        priceRange,
      };

      const response = await axiosInstance.post('/api/user/hotel-query', queryData);

      if (response.data.success) {
        toast.success('Query submitted successfully! We will get back to you soon.');

        // Optional: Reset form or redirect
        // resetForm();
      } else {
        toast.error(response.data.message || 'Failed to submit query');
      }
    } catch (error: any) {
      console.error('Error submitting query:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error('Please login to submit a query');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || 'Invalid query data');
      } else {
        toast.error('Failed to submit query. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const priceRanges: PriceRange[] = [
    { label: 'All Prices', value: 'all' },
    { label: '₹0 - ₹1500', value: '0-1500' },
    { label: '₹1500 - ₹2500', value: '1500-2500' },
    { label: '₹2500 - ₹5000', value: '2500-5000' },
    { label: '₹5000+', value: '5000+' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <section className="relative h-[400px] md:h-[500px] lg:h-[500px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
            alt="Scenic mountain landscape"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 40%' }}
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-full px-3 sm:px-4 md:px-6">
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
            <div className="bg-white rounded-lg shadow-2xl p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x lg:divide-gray-200">
                <div className="lg:px-4 relative" ref={locationRef}>
                  <label className="block text-gray-600 text-xs mb-1">
                    City, Property Name Or Location
                  </label>
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                          {location}
                        </p>
                        <p className="text-gray-500 text-xs sm:text-sm">{locationCountry}</p>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-3">
                        <input
                          type="text"
                          placeholder="Search city..."
                          value={locationSearch}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setLocationSearch(e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {filteredCities.map((city: City, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => handleLocationSelect(city)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                          >
                            <MapPin className="w-4 h-4 text-gray-400" />
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
                  <div className="flex items-center gap-1 mb-1">
                    <label className="text-gray-600 text-xs">Check-In</label>
                    <Calendar className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={e => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full h-full cursor-pointer border-0 bg-transparent text-transparent caret-transparent focus:outline-none"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 30,
                        colorScheme: 'light',
                      }}
                    />
                    <div className="pointer-events-none">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                          {checkInFormatted.day}
                        </span>
                        <span className="text-base sm:text-lg text-gray-600">
                          {checkInFormatted.month}'{checkInFormatted.year}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        {checkInFormatted.dayName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:px-4 relative">
                  <div className="flex items-center gap-1 mb-1">
                    <label className="text-gray-600 text-xs">Check-Out</label>
                    <Calendar className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={e => setCheckOutDate(e.target.value)}
                      min={checkInDate}
                      className="w-full h-full cursor-pointer border-0 bg-transparent text-transparent caret-transparent focus:outline-none"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 30,
                        colorScheme: 'light',
                      }}
                    />
                    <div className="pointer-events-none">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                          {checkOutFormatted.day}
                        </span>
                        <span className="text-base sm:text-lg text-gray-600">
                          {checkOutFormatted.month}'{checkOutFormatted.year}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1">
                        {checkOutFormatted.dayName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:px-4 relative" ref={guestsRef}>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="text-gray-600 text-xs">Rooms & Guests</label>
                    <Users className="w-3 h-3 text-blue-500" />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}
                  >
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        {rooms}
                      </span>
                      <span className="text-sm sm:text-base lg:text-lg text-gray-600">
                        Room{rooms > 1 ? 's' : ''}
                      </span>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        {adults + children}
                      </span>
                      <span className="text-sm sm:text-base lg:text-lg text-gray-600">
                        Guest{adults + children > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {showGuestsDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DoorOpen className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium">Rooms</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setRooms(Math.max(1, rooms - 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{rooms}</span>
                            <button
                              onClick={() => setRooms(Math.min(10, rooms + 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
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
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{adults}</span>
                            <button
                              onClick={() => setAdults(Math.min(20, adults + 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
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
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium">{children}</span>
                            <button
                              onClick={() => setChildren(Math.min(10, children + 1))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowGuestsDropdown(false)}
                          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:px-4 relative" ref={priceRef}>
                  <div className="flex items-center gap-1 mb-1">
                    <label className="text-gray-600 text-xs">Price Per Night</label>
                    <ChevronDown className="w-3 h-3 text-blue-500" />
                  </div>
                  <div
                    className="cursor-pointer"
                    onClick={() => setShowPriceDropdown(!showPriceDropdown)}
                  >
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                      {priceRanges.find(p => p.value === priceRange)?.label || 'All Prices'}
                    </p>
                  </div>
                  {showPriceDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-3">
                      {priceRanges.map((range, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setPriceRange(range.value);
                            setShowPriceDropdown(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                            priceRange === range.value
                              ? 'bg-blue-100 text-blue-600 font-medium'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSearch}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full text-sm uppercase tracking-wide flex items-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Send Query'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-12 lg:py-16 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">INTRODUCING</p>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll hover:pause">
              {duplicatedImages.map((hotel, idx) => (
                <div key={idx} className="flex-shrink-0 w-64 sm:w-72 lg:w-80 mx-2 sm:mx-3">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={hotel.src}
                      alt={hotel.alt}
                      width={400}
                      height={300}
                      className="w-full h-44 sm:h-52 lg:h-56 object-cover"
                    />
                  </div>
                </div>
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
        @media (max-width: 1024px) {
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        }
        @media (max-width: 640px) {
          .animate-scroll {
            animation: scroll 25s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default Hotels;
