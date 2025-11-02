'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { FaStar, FaMapMarkerAlt, FaClock, FaChevronRight } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';

interface Tour {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  imageUrls: string[];
  duration: {
    days: number;
    nights: number;
  };
  startCity?: {
    id: string;
    name: string;
  };
  cities?: Array<{
    id: string;
    name: string;
  }>;
  themes?: Array<{
    id: string;
    name: string;
  }>;
}

interface SimilarToursProps {
  tourId: string;
  limit?: number;
}

const SimilarTours: React.FC<SimilarToursProps> = ({ tourId, limit = 6 }) => {
  const [similarTours, setSimilarTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSimilarTours = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/tour/similar-tour/${tourId}?limit=${limit}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch similar tours');
        }

        const data = await response.json();
        setSimilarTours(data.payload || []);
      } catch (err) {
        console.error('Error fetching similar tours:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (tourId) {
      fetchSimilarTours();
    }
  }, [tourId, limit]);

  const handleTourClick = (id: string) => {
    router.push(`/${id}`);
  };

  if (loading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        </div>
      </div>
    );
  }

  if (error || similarTours.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Similar Tours</h2>
            <p className="mt-2 text-gray-600">Discover more tours you might like</p>
          </div>
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {similarTours.map(tour => (
            <TourCard key={tour.id} tour={tour} onTourClick={handleTourClick} />
          ))}
        </div>

        <div className="lg:hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={1.2}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2.5,
                spaceBetween: 24,
              },
            }}
            className="pb-12"
          >
            {similarTours.map(tour => (
              <SwiperSlide key={tour.id}>
                <TourCard tour={tour} onTourClick={handleTourClick} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

interface TourCardProps {
  tour: Tour;
  onTourClick: (id: string) => void;
}

const TourCard: React.FC<TourCardProps> = ({ tour, onTourClick }) => {
  return (
    <div
      onClick={() => onTourClick(tour.id)}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
    >
      <div className="relative h-52 overflow-hidden">
        <Image
          src={tour.imageUrls[0] || '/assets/images/placeholder.jpg'}
          alt={tour.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-md">
          <FaStar className="text-yellow-500 text-sm" />
          <span className="text-sm font-semibold text-gray-900">{tour.rating.toFixed(1)}</span>
        </div>

        {/* {tour.themes && tour.themes.length > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
            <span className="text-xs font-semibold text-white">{tour.themes[0].name}</span>
          </div>
        )} */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors duration-200">
          {tour.title}
        </h3>

        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaClock className="text-orange-500 flex-shrink-0" />
            <span>
              {tour.duration.days} Days / {tour.duration.nights} Nights
            </span>
          </div>

          {tour.startCity && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
              <span className="line-clamp-1">Starting from {tour.startCity.name}</span>
            </div>
          )}

          {tour.cities && tour.cities.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <FaMapMarkerAlt className="text-orange-500 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">
                {tour.cities
                  .slice(0, 3)
                  .map(city => city.name)
                  .join(', ')}
                {tour.cities.length > 3 && ` +${tour.cities.length - 3} more`}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {tour.price > 0 ? (
              <>
                <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
                <p className="text-xl font-bold text-orange-500">
                  ₹{tour.price.toLocaleString('en-IN')}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-gray-600">Price on Request</p>
            )}
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              onTourClick(tour.id);
            }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm group/btn"
          >
            View Details
            <FaChevronRight className="text-xs group-hover/btn:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimilarTours;