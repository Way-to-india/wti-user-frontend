'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ArrowLeftRight, Calendar, Loader2 } from 'lucide-react';
import NavBar from '@/components/layout/navbar/NavBar';
import axiosInstance from '@/api/axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
  const [stops, setStops] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

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

  const convertTo24Hour = (time: string, format: string): string => {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);

    if (format === 'PM' && hour !== 12) {
      hour += 12;
    } else if (format === 'AM' && hour === 12) {
      hour = 0;
    }

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleSearch = async (): Promise<void> => {
    try {
      if (!token) {
        toast.error('Please login to submit a query');
        router.push('/auth');
        return;
      }

      if (!from.trim()) {
        toast.error('Please enter departure location');
        return;
      }

      if (!to.trim()) {
        toast.error('Please enter destination location');
        return;
      }

      if (!departureDate) {
        toast.error('Please select departure date');
        return;
      }

      if (!returnDate) {
        toast.error('Please select return date');
        return;
      }

      if (!pickupTime) {
        toast.error('Please enter pickup time');
        return;
      }

      const departure = new Date(departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (departure < today) {
        toast.error('Departure date cannot be in the past');
        return;
      }

      const returnDateObj = new Date(returnDate);
      if (returnDateObj <= departure) {
        toast.error('Return date must be after departure date');
        return;
      }

      setIsSubmitting(true);

      const time24Hour = convertTo24Hour(pickupTime, timeFormat);

      const queryData = {
        from: from.trim(),
        to: to.trim(),
        departureDate,
        returnDate,
        pickupTime: time24Hour,
        stops: stops.filter(stop => stop.trim() !== ''),
      };

      const response = await axiosInstance.post('/api/user/transport-query', queryData);

      if (response.data.status) {
        toast.success('Query submitted successfully! We will get back to you soon.');
        setFrom('Mumbai');
        setTo('Pune');
        setDepartureDate(new Date().toISOString().split('T')[0]);
        setReturnDate('');
        setPickupTime('10:00');
        setTimeFormat('AM');
        setStops([]);
      } else {
        toast.error(response.data.message || 'Failed to submit query');
      }
    } catch (error: any) {
      console.error('Error submitting query:', error);

      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        router.push('/auth');
        return;
      }

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to submit query. Please try again.';

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <section className="relative h-auto min-h-[500px] md:h-[600px] pt-20 md:pt-24">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80"
            alt="Highway road with buses and cars for travel transportation"
            fill
            priority
            quality={75}
            className="object-cover"
            style={{ objectPosition: 'center' }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-[500px] md:h-[600px] px-3 sm:px-4 md:px-6 py-8">
          <div className="w-full max-w-6xl">
            <div className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
              <div role="search">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-0 lg:divide-x lg:divide-gray-200">
                  <div className="relative lg:px-4">
                    <label className="block text-gray-600 text-xs mb-2">From</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 w-full border-none outline-none p-0"
                        autoComplete="off"
                      />
                      <button
                        onClick={handleSwap}
                        className="bg-white border-2 border-orange-500 rounded-full p-2 hover:bg-orange-50 transition-colors flex-shrink-0"
                        aria-label="Swap locations"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-orange-500" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:px-4">
                    <label className="block text-gray-600 text-xs mb-2">To</label>
                    <input
                      type="text"
                      value={to}
                      onChange={e => setTo(e.target.value)}
                      className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 w-full border-none outline-none p-0"
                      autoComplete="off"
                    />
                  </div>

                  <div className="lg:px-4 relative">
                    <div className="flex items-center gap-1 mb-2">
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
                          <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                            {departureFormatted.day}
                          </span>
                          <span className="text-sm sm:text-base text-gray-600">
                            {departureFormatted.month}'{departureFormatted.year}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">{departureFormatted.dayName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="lg:px-4 relative">
                    <div className="flex items-center gap-1 mb-2">
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
                              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                                {returnFormatted.day}
                              </span>
                              <span className="text-sm sm:text-base text-gray-600">
                                {returnFormatted.month}'{returnFormatted.year}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs mt-1">{returnFormatted.dayName}</p>
                          </>
                        ) : (
                          <p className="text-gray-400 text-xs">Tap to add return date</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:px-4">
                    <div className="flex items-center gap-1 mb-2">
                      <label className="text-gray-600 text-xs">Pickup Time</label>
                      <ChevronDown className="w-3 h-3 text-blue-500" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 border-none outline-none p-0"
                      />
                      <select
                        value={timeFormat}
                        onChange={e => setTimeFormat(e.target.value)}
                        className="text-sm sm:text-base text-gray-600 border-none outline-none cursor-pointer bg-transparent"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-6 border-t border-gray-200 gap-4">
                  <button className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-semibold transition-colors text-sm">
                    <span className="text-xl">+</span> Add Stops
                    <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded ml-1">
                      new
                    </span>
                  </button>

                  <div className="mt-6 pt-6 border-t border-gray-200 flex justify-center">
                    <button
                      type="button"
                      onClick={handleSearch}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 sm:px-12 lg:px-16 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 disabled:cursor-not-allowed text-white font-bold text-base rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
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
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-gray-600 text-sm font-medium mb-2">EXPLORE</p>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex animate-scroll hover:pause">
              {duplicatedImages.map((transport, idx) => (
                <article key={idx} className="flex-shrink-0 w-72 lg:w-80 mx-3">
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={transport.src}
                      alt={transport.alt}
                      width={320}
                      height={224}
                      className="w-full h-56 object-cover"
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      quality={75}
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
        input[type='time']:focus,
        input[type='date']:focus,
        select:focus {
          outline: none;
        }

        input[type='time']::-webkit-calendar-picker-indicator {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Transport;