'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ArrowLeftRight, Calendar } from 'lucide-react';
import NavBar from '@/components/layout/navbar/NavBar';

const transportImages = [
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/transport-carousel-images/dreamstimemaximum_112750806.jpg',
    alt: 'Luxury bus with comfortable seating for intercity travel',
    title: 'Premium Buses',
    description: 'Comfortable AC coaches with reclining seats',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/transport-carousel-images/dreamstimemaximum_171715682.jpg',
    alt: 'Modern taxi cab service for city transportation',
    title: 'City Cabs',
    description: 'Reliable and affordable taxi services',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/transport-carousel-images/dreamstimemaximum_184753736.jpg',
    alt: 'Sleeper bus interior with beds for overnight journeys',
    title: 'Sleeper Coaches',
    description: 'Overnight journeys with sleeping berths',
  },
  {
    src: 'https://dbagut2mvh0lo.cloudfront.net/transport-carousel-images/dreamstimemaximum_200411068.jpg',
    alt: 'Executive car rental for business travel',
    title: 'Executive Cars',
    description: 'Premium vehicles for business travelers',
  },
];

interface DateFormatted {
  day: number;
  month: string;
  year: string;
  dayName: string;
}

const Transport: React.FC = () => {
  const [from, setFrom] = useState('Mumbai');
  const [to, setTo] = useState('Pune');
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [timeFormat, setTimeFormat] = useState('AM');

  const duplicatedImages = [...transportImages, ...transportImages, ...transportImages];

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const formatDate = (dateString: string): DateFormatted => {
    if (!dateString) return { day: 0, month: '', year: '', dayName: '' };
    const date = new Date(dateString + 'T00:00:00');
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return { day, month, year, dayName };
  };

  const departureFormatted = formatDate(departureDate);
  const returnFormatted = formatDate(returnDate);

  const handleSearch = () => {
    console.log({
      from,
      to,
      departureDate,
      returnDate,
      pickupTime: `${pickupTime} ${timeFormat}`,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <section className="relative h-[400px] md:h-[500px]">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80"
            alt="Highway road with buses and cars for travel transportation"
            fill
            priority
            quality={85}
            className="object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-3 sm:px-4 md:px-6">
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-lg shadow-2xl p-3 sm:p-4 md:p-6">
              <div role="search">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x lg:divide-gray-200">
                  {/* From */}
                  <div className="relative lg:px-4">
                    <label className="block text-gray-600 text-xs mb-1">From</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-full border-none outline-none p-0"
                        autoComplete="off"
                      />
                      <button
                        onClick={handleSwap}
                        className="bg-white border-2 border-orange-500 rounded-full p-2 hover:bg-orange-50 transition-colors"
                        aria-label="Swap locations"
                      >
                        <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                      </button>
                    </div>
                  </div>

                  {/* To */}
                  <div className="lg:px-4">
                    <label className="block text-gray-600 text-xs mb-1">To</label>
                    <input
                      type="text"
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-full border-none outline-none p-0"
                      autoComplete="off"
                    />
                  </div>

                  {/* Departure */}
                  <div className="lg:px-4 relative">
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-gray-600 text-xs">Departure</label>
                      <Calendar className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={departureDate}
                        onChange={e => setDepartureDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full h-full cursor-pointer border-0 bg-transparent text-transparent caret-transparent focus:outline-none absolute inset-0 z-20"
                      />
                      <div className="pointer-events-none">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                            {departureFormatted.day}
                          </span>
                          <span className="text-base sm:text-lg text-gray-600">
                            {departureFormatted.month}'{departureFormatted.year}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                          {departureFormatted.dayName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Return */}
                  <div className="lg:px-4 relative">
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-gray-600 text-xs">Return</label>
                      <Calendar className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="relative">
                      <input
                        type="date"
                        value={returnDate}
                        onChange={e => setReturnDate(e.target.value)}
                        min={departureDate}
                        className="w-full h-full cursor-pointer border-0 bg-transparent text-transparent caret-transparent focus:outline-none absolute inset-0 z-20"
                      />
                      <div className="pointer-events-none">
                        {returnDate ? (
                          <>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                                {returnFormatted.day}
                              </span>
                              <span className="text-base sm:text-lg text-gray-600">
                                {returnFormatted.month}'{returnFormatted.year}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                              {returnFormatted.dayName}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            Tap to add a return date
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pickup Time */}
                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-gray-600 text-xs">Pickup-Time</label>
                      <ChevronDown className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <input
                        type="text"
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-20 sm:w-24 border-none outline-none p-0"
                        autoComplete="off"
                      />
                      <select
                        value={timeFormat}
                        onChange={e => setTimeFormat(e.target.value)}
                        className="text-base sm:text-lg text-gray-600 border-none outline-none cursor-pointer"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                  <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-semibold transition-colors text-sm sm:text-base">
                    <span className="text-xl sm:text-2xl">+</span> Add Stops
                    <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded ml-1">
                      new
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full sm:w-auto px-12 sm:px-16 lg:px-20 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base lg:text-lg rounded-full shadow-lg transition-all"
                  >
                    SEND QUERY 
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="bg-white py-8 sm:py-12 lg:py-16 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">EXPLORE</p>
          </div>

          <div className="relative overflow-hidden mb-6 sm:mb-8">
            <div className="flex animate-scroll hover:pause">
              {duplicatedImages.map((transport, idx) => (
                <article key={idx} className="flex-shrink-0 w-64 sm:w-72 lg:w-80 mx-2 sm:mx-3">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={transport.src}
                      alt={transport.alt}
                      width={320}
                      height={224}
                      className="w-full h-44 sm:h-52 lg:h-56 object-cover"
                      loading={idx < 4 ? 'eager' : 'lazy'}
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
            transform: translateX(-25%);
          }
        }

        .animate-scroll {
          animation: scroll 50s linear infinite;
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }

        input[type='text']:focus,
        select:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Transport;
