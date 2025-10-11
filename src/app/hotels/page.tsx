'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import NavBar from '@/components/layout/navbar/NavBar';
import { useAuth } from '@/context/AuthContext';

const hotelsImages = [
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

const Hotels = () => {
  const [location, setLocation] = useState('Goa');
  const [checkIn, setCheckIn] = useState('11');
  const [checkOut, setCheckOut] = useState('12');
  const [rooms, setRooms] = useState('1');
  const [adults, setAdults] = useState('2');
  const {token} = useAuth();

  const duplicatedImages = [...hotelsImages, ...hotelsImages, ...hotelsImages];

  const handleSearch = () => {
    const searchData = {
      location,
      checkIn,
      checkOut,
      rooms,
      adults,
      timestamp: new Date().toISOString(),
    };
    console.log('Search Data:', searchData);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <section className="relative h-[400px] md:h-[500px] lg:h-[500px]" aria-label="Hotel search">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80"
            alt="Scenic mountain landscape - luxury travel destination"
            fill
            priority
            quality={85}
            className="object-cover"
            style={{ objectPosition: 'center 40%' }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" aria-hidden="true"></div>
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
              <div role="search">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x lg:divide-gray-200">
                  <div className="lg:px-4">
                    <label htmlFor="location" className="block text-gray-600 text-xs mb-1">
                      City, Property Name Or Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-full border-none outline-none p-0"
                      aria-label="Enter destination"
                      autoComplete="off"
                    />
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">India</p>
                  </div>

                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label htmlFor="checkin" className="text-gray-600 text-xs">
                        Check-In
                      </label>
                      <ChevronDown className="w-3 h-3 text-blue-500" aria-hidden="true" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <input
                        id="checkin"
                        type="text"
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-10 sm:w-12 border-none outline-none p-0"
                        aria-label="Check-in date"
                        autoComplete="off"
                      />
                      <span className="text-base sm:text-lg text-gray-600">Oct'25</span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Saturday</p>
                  </div>

                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label htmlFor="checkout" className="text-gray-600 text-xs">
                        Check-Out
                      </label>
                      <ChevronDown className="w-3 h-3 text-blue-500" aria-hidden="true" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <input
                        id="checkout"
                        type="text"
                        value={checkOut}
                        onChange={e => setCheckOut(e.target.value)}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-10 sm:w-12 border-none outline-none p-0"
                        aria-label="Check-out date"
                        autoComplete="off"
                      />
                      <span className="text-base sm:text-lg text-gray-600">Oct'25</span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Sunday</p>
                  </div>

                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-gray-600 text-xs">Rooms & Guests</label>
                      <ChevronDown className="w-3 h-3 text-blue-500" aria-hidden="true" />
                    </div>
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        {rooms}
                      </span>
                      <span className="text-sm sm:text-base lg:text-lg text-gray-600">Rooms</span>
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                        {adults}
                      </span>
                      <span className="text-sm sm:text-base lg:text-lg text-gray-600">Adults</span>
                    </div>
                  </div>

                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-gray-600 text-xs">Price Per Night</label>
                      <ChevronDown className="w-3 h-3 text-blue-500" aria-hidden="true" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 font-medium mt-2">
                      ₹0-₹1500, ₹1500-₹2500,...
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                  <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                    <span className="text-gray-600 text-xs sm:text-sm font-medium w-full sm:w-auto">
                      Trending Searches:
                    </span>
                    <button
                      type="button"
                      onClick={() => setLocation('Singapore')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm rounded transition-colors"
                      aria-label="Search Singapore"
                    >
                      Singapore, Singapore
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocation('Mumbai')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm rounded transition-colors"
                      aria-label="Search Mumbai"
                    >
                      Mumbai, India
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocation('Bangkok')}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm rounded transition-colors"
                      aria-label="Search Bangkok"
                    >
                      Bangkok, Thailand
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full lg:w-auto px-8 sm:px-12 lg:px-16 py-3 text-white font-bold text-base lg:text-lg rounded-full shadow-lg transition-all hover:shadow-xl bg-orange-500 hover:bg-orange-600"
                    aria-label="Search hotels"
                  >
                    SEND QUERY
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white py-8 sm:py-12 lg:py-16 px-3 sm:px-4"
        aria-labelledby="luxe-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">INTRODUCING</p>
          </div>

          <div
            className="relative overflow-hidden"
            role="region"
            aria-label="Luxury hotel carousel"
          >
            <div className="flex animate-scroll hover:pause">
              {duplicatedImages.map((hotel, idx) => (
                <article key={idx} className="flex-shrink-0 w-64 sm:w-72 lg:w-80 mx-2 sm:mx-3">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={hotel.src}
                      alt={hotel.alt}
                      width={320}
                      height={224}
                      className="w-full h-44 sm:h-52 lg:h-56 object-cover"
                      loading={idx < 6 ? 'eager' : 'lazy'}
                      quality={85}
                      sizes="(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px"
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

        input[type='text']:focus {
          outline: none;
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
