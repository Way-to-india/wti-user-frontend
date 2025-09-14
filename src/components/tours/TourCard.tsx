'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiMapPin, FiStar, FiClock } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

interface LocationObject {
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface Tour {
  id: string;
  title: string;
  description?: string;
  price: string | number;
  rating?: number;
  imageUrls: string[];
  duration_count?: number;
  city_ids?: string[];
  location: string | LocationObject;
}

interface TourCardProps {
  tour: Tour;
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const router = useRouter();
  const theme = useTheme();
  
  // Get the first image or use a placeholder
  const imageUrl = Array.isArray(tour.imageUrls) && tour.imageUrls.length > 0 
    ? tour.imageUrls[0] 
    : '/assets/images/destination.png';

  // Helper: is this a local static image?
  const isLocalImage = imageUrl.startsWith('/assets/');

  // Format price to display with comma separators
  const formattedPrice = typeof tour.price === 'number' 
    ? `₹${tour.price.toLocaleString()}`
    : `₹${tour.price}`;
  
  const handleClick = () => {
    router.push(`/tours/${tour.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
      style={{ fontFamily: theme.typography.fontFamily.regular }}
    >      {/* Image */}
      <div className="relative h-48 w-full">
        {isLocalImage ? (
          <Image
            src={imageUrl}
            alt={tour.title}
            width={400}
            height={192}
            className="object-cover w-full h-full"
            priority={false}
            quality={75}
            onError={(e) => {
              console.error('Image load error:', imageUrl);
              // Fallback to placeholder if local image fails
              const target = e.target as HTMLImageElement;
              target.src = '/assets/images/destination.png';
            }}
          />
        ) : (
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            quality={75}
            onError={(e) => {
              console.error('Remote image load error:', imageUrl);
              // Fallback to local placeholder if remote image fails
              const target = e.target as HTMLImageElement;
              target.src = '/assets/images/destination.png';
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2" style={{ color: theme.colors.heavyMetal }}>
          {tour.title}
        </h3>
          {/* Location & Rating */}        <div className="flex items-center mb-3">
          <div className="flex items-center mr-4">
            <FiMapPin className="mr-1" style={{ color: theme.colors.carrotOrange }} />
            <span className="text-sm text-gray-600">
              {typeof tour.location === 'string' 
                ? tour.location 
                : (tour.location && tour.location.address) || "Various Cities"}
            </span>
          </div>
          
          <div className="flex items-center">
            <FiStar className="mr-1" style={{ color: theme.colors.carrotOrange }} />
            <span className="text-sm text-gray-600">{tour.rating || 4.5}</span>
          </div>
        </div>
        
        {/* Duration if available */}
        {tour.duration_count && (
          <div className="flex items-center mb-3">
            <FiClock className="mr-1" style={{ color: theme.colors.carrotOrange }} />
            <span className="text-sm text-gray-600">
              {tour.duration_count} Days / {tour.duration_count - 1} Nights
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-lg" style={{ color: theme.colors.carrotOrange }}>
            {formattedPrice}
          </span>
          <button 
            className="px-4 py-2 rounded-md text-white text-sm" 
            style={{ backgroundColor: theme.colors.carrotOrange }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
