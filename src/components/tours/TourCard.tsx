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
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
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
    router.push(`/tours/${tour.id}`);
  };

  return (
    <div
      className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-700"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={tour.imageUrls[currentImageIndex]}
          alt={tour.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg border border-gray-700">
          <FiStar className="text-yellow-400 text-sm" />
          <span className="text-sm font-semibold text-white">{tour.rating}</span>
        </div>

        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-lg text-white mb-1 line-clamp-2 drop-shadow-lg">
            {tour.title}
          </h3>
        </div>

        {tour.imageUrls.length > 1 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {tour.imageUrls.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-orange-500 w-3' : 'bg-gray-400/70'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
          {tour.description}
        </p>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1 bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/30">
            <FiClock className="text-orange-400 text-sm" />
            <span className="text-xs font-medium text-orange-300">
              {tour.duration.days}D / {tour.duration.nights}N
            </span>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/20 px-2.5 py-1 rounded-lg border border-blue-500/30">
            <FiCalendar className="text-blue-400 text-sm" />
            <span className="text-xs font-medium text-blue-300">{tour.best_time}</span>
          </div>
        </div>

        {tour.themes.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1.5">
              <MdOutlineExplore className="text-orange-400 text-sm" />
              <span className="text-xs font-semibold text-gray-400">Theme</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tour.themes.map((theme) => (
                <span
                  key={theme.id}
                  className="text-xs bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 px-2 py-1 rounded-md font-medium border border-orange-500/30"
                >
                  {theme.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <FiMapPin className="text-orange-400 text-sm" />
            <span className="text-xs font-semibold text-gray-400">Destinations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tour.cities.slice(0, 3).map((city, idx) => (
              <span
                key={idx}
                className="text-xs bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 px-2 py-1 rounded-md font-medium border border-blue-500/30"
              >
                {city.name}
              </span>
            ))}
            {tour.cities.length > 3 && (
              <span className="text-xs bg-gray-700/50 text-gray-400 px-2 py-1 rounded-md font-medium border border-gray-600">
                +{tour.cities.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;