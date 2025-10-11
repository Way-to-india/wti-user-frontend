'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ArrowLeftRight } from 'lucide-react';
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

const Transport = () => {
  const [from, setFrom] = useState('Mumbai');
  const [to, setTo] = useState('Pune');
  const [departureDate, setDepartureDate] = useState('12');
  const [returnDate, setReturnDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00');
  const [timeFormat, setTimeFormat] = useState('AM');

  const duplicatedImages = [
    ...transportImages,
    ...transportImages,
    ...transportImages,
    ...transportImages,
  ];

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSearch = () => {
    const searchData = {
      from,
      to,
      departureDate,
      returnDate: returnDate || null,
      pickupTime: `${pickupTime} ${timeFormat}`,
      timestamp: new Date().toISOString(),
    };
    console.log('Transport Search Data:', searchData);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar/>

      <section className="relative h-[400px] md:h-[500px]" aria-label="Transport search">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80"
            alt="Highway road with buses and cars for travel transportation"
            fill
            priority
            quality={85}
            className="object-cover"
            style={{ objectPosition: 'center' }}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" aria-hidden="true"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-3 sm:px-4 md:px-6">
          <div className="w-full max-w-6xl">
    
            <div className="bg-white rounded-lg shadow-2xl p-3 sm:p-4 md:p-6">
              <div role="search">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x lg:divide-gray-200">
          
                  <div className="relative lg:px-4">
                    <label htmlFor="from" className="block text-gray-600 text-xs mb-1">
                      From
                    </label>
                    <input
                      id="from"
                      type="text"
                      value={from}
                      onChange={e => setFrom(e.target.value)}
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-full border-none outline-none p-0 pr-8"
                      aria-label="Enter departure city"
                      autoComplete="off"
                    />
            
                    <button
                      onClick={handleSwap}
                      className="absolute right-0 sm:right-2 lg:-right-4 top-8 sm:top-1/2 lg:top-1/2 transform lg:-translate-y-1/2 bg-white border-2 border-orange-500 rounded-full p-2 hover:bg-orange-50 transition-colors z-10"
                      aria-label="Swap from and to locations"
                      style={{ marginTop: window.innerWidth >= 1024 ? '8px' : '0' }}
                    >
                      <ArrowLeftRight
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        style={{ color: 'rgb(255, 139, 2)' }}
                      />
                    </button>
                  </div>

          
                  <div className="lg:px-4">
                    <label htmlFor="to" className="block text-gray-600 text-xs mb-1">
                      To
                    </label>
                    <input
                      id="to"
                      type="text"
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-full border-none outline-none p-0"
                      aria-label="Enter destination city"
                      autoComplete="off"
                    />
                  </div>

          
                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label htmlFor="departure" className="text-gray-600 text-xs">
                        Departure
                      </label>
                      <ChevronDown className="w-3 h-3 text-blue-500" aria-hidden="true" />
                    </div>
                    <div className="flex items-baseline gap-1">
                      <input
                        id="departure"
                        type="text"
                        value={departureDate}
                        onChange={e => setDepartureDate(e.target.value)}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-10 sm:w-12 border-none outline-none p-0"
                        aria-label="Departure date"
                        autoComplete="off"
                      />
                      <span className="text-base sm:text-lg text-gray-600">Oct'25</span>
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Sunday</p>
                  </div>

          
                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label htmlFor="return" className="text-gray-600 text-xs">
                        Return
                      </label>
                      <ChevronDown className="w-3 h-3 text-blue-500" aria-hidden="true" />
                    </div>
                    {returnDate ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <input
                            id="return"
                            type="text"
                            value={returnDate}
                            onChange={e => setReturnDate(e.target.value)}
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-10 sm:w-12 border-none outline-none p-0"
                            aria-label="Return date"
                            autoComplete="off"
                          />
                          <span className="text-base sm:text-lg text-gray-600">Oct'25</span>
                        </div>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">Monday</p>
                      </>
                    ) : (
                      <button
                        onClick={() => setReturnDate('13')}
                        className="text-gray-500 text-xs sm:text-sm mt-2 hover:text-gray-700 text-left"
                      >
                        Tap to add a return date
                        <br />
                        for bigger discounts
                      </button>
                    )}
                  </div>

          
                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-1">
                      <label htmlFor="pickup" className="text-gray-600 text-xs">
                        Pickup-Time
                      </label>
                      <ChevronDown className="w-3 h-3 text-blue-500" aria-hidden="true" />
                    </div>
                    <div className="flex items-baseline gap-1 sm:gap-2">
                      <input
                        id="pickup"
                        type="text"
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 w-20 sm:w-24 border-none outline-none p-0"
                        aria-label="Pickup time"
                        autoComplete="off"
                      />
                      <select
                        value={timeFormat}
                        onChange={e => setTimeFormat(e.target.value)}
                        className="text-base sm:text-lg text-gray-600 border-none outline-none cursor-pointer"
                        aria-label="AM or PM"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

        
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-gray-200 gap-4">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-semibold transition-colors text-sm sm:text-base"
                  >
                    <span className="text-xl sm:text-2xl">+</span> Add Stops
                    <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded ml-1">
                      new
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="w-full sm:w-auto px-12 sm:px-16 lg:px-20 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-base lg:text-lg rounded-full shadow-lg transition-all"
                    aria-label="Search transport"
                  >
                    SEARCH
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white py-8 sm:py-12 lg:py-16 px-3 sm:px-4"
        aria-labelledby="transport-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <p className="text-gray-600 text-xs sm:text-sm font-medium mb-2">EXPLORE</p>
          </div>
  
          <div
            className="relative overflow-hidden mb-6 sm:mb-8"
            role="region"
            aria-label="Transport options carousel"
          >
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

  
          <div
            className="relative overflow-hidden"
            role="region"
            aria-label="More transport options"
          >
            <div className="flex animate-scroll-reverse hover:pause">
              {[...duplicatedImages].reverse().map((transport, idx) => (
                <article
                  key={`reverse-${idx}`}
                  className="flex-shrink-0 w-64 sm:w-72 lg:w-80 mx-2 sm:mx-3"
                >
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={transport.src}
                      alt={transport.alt}
                      width={320}
                      height={224}
                      className="w-full h-44 sm:h-52 lg:h-56 object-cover"
                      loading="lazy"
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

        @keyframes scroll-reverse {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll {
          animation: scroll 50s linear infinite;
        }

        .animate-scroll-reverse {
          animation: scroll-reverse 50s linear infinite;
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }

        input[type='text']:focus,
        select:focus {
          outline: none;
        }

        @media (max-width: 1024px) {
          .animate-scroll {
            animation: scroll 40s linear infinite;
          }
          .animate-scroll-reverse {
            animation: scroll-reverse 40s linear infinite;
          }
        }

        @media (max-width: 640px) {
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll-reverse {
            animation: scroll-reverse 30s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default Transport;
