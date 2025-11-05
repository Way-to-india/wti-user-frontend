'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiStar, FiClock, FiCalendar } from 'react-icons/fi';
import { MdOutlineExplore } from 'react-icons/md';

interface Tour {
  id: string;
  title: string;
  description: string;
  duration: { nights: number; days: number };
  price: string;
  rating: number;
  best_time: string;
  ideal_for: string;
  imageUrls: string[];
  cities: { name: string; label: string }[];
  themes: { id: string; name: string }[];
}

interface TourCardProps {
  tour: Tour;
  priority?: boolean; // Add priority for above-the-fold images
}

const TourCard: React.FC<TourCardProps> = ({ tour, priority = false }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || tour.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % tour.imageUrls.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, tour.imageUrls.length]);

  const handleClick = () => {
    router.push(`/${tour.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <article
      className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-700"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${tour.title}`}
    >
      {/* Optimized Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-800">
        <Image
          src={tour.imageUrls[currentImageIndex]}
          alt={`${tour.title} - View ${currentImageIndex + 1} of ${tour.imageUrls.length}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={75}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Improved gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Rating Badge - Improved contrast */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg border border-yellow-500/40">
          <FiStar className="text-yellow-400 text-sm" aria-hidden="true" />
          <span className="text-sm font-semibold text-white">
            {tour.rating}
            <span className="sr-only"> out of 5 stars</span>
          </span>
        </div>

        {/* Title with better contrast */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {tour.title}
          </h3>
        </div>

        {/* Image carousel indicators */}
        {tour.imageUrls.length > 1 && (
          <div
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1"
            role="status"
            aria-label={`Image ${currentImageIndex + 1} of ${tour.imageUrls.length}`}
          >
            {tour.imageUrls.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-orange-500 w-3' : 'bg-white/70'
                  }`}
                aria-current={idx === currentImageIndex ? 'true' : 'false'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4">
        {/* Description with improved contrast */}
        <p className="text-gray-200 text-sm mb-3 line-clamp-2 leading-relaxed">
          {tour.description}
        </p>

        {/* Duration and Best Time badges with improved contrast */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1 bg-orange-500/30 px-2.5 py-1 rounded-lg border border-orange-400/40">
            <FiClock className="text-orange-300 text-sm" aria-hidden="true" />
            <span className="text-xs font-medium text-orange-100">
              {tour.duration.days}D / {tour.duration.nights}N
            </span>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/30 px-2.5 py-1 rounded-lg border border-blue-400/40">
            <FiCalendar className="text-blue-300 text-sm" aria-hidden="true" />
            <span className="text-xs font-medium text-blue-100">{tour.best_time}</span>
          </div>
        </div>

        {/* Themes section with improved contrast */}
        {tour.themes.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <MdOutlineExplore className="text-orange-300 text-sm" aria-hidden="true" />
              <span className="text-xs font-semibold text-gray-300">Theme</span>
            </div>
            <div className="flex flex-wrap gap-1.5" role="list">
              {tour.themes.map((theme) => (
                <span
                  key={theme.id}
                  role="listitem"
                  className="text-xs bg-orange-500/30 text-orange-100 px-2 py-1 rounded-md font-medium border border-orange-400/40"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Destinations section with improved contrast */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <FiMapPin className="text-orange-300 text-sm" aria-hidden="true" />
            <span className="text-xs font-semibold text-gray-300">Destinations</span>
          </div>
          <div className="flex flex-wrap gap-1.5" role="list">
            {tour.cities.slice(0, 3).map((city, idx) => (
              <span
                key={idx}
                role="listitem"
                className="text-xs bg-blue-500/30 text-blue-100 px-2 py-1 rounded-md font-medium border border-blue-400/40"
              >
                {city.name}
              </span>
            ))}
            {tour.cities.length > 3 && (
              <span className="text-xs bg-gray-700/70 text-gray-200 px-2 py-1 rounded-md font-medium border border-gray-500">
                +{tour.cities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default TourCard;