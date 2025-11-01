import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Calendar, Tag } from 'lucide-react';

interface Duration {
  days?: number;
  nights?: number;
}

interface City {
  id: string;
  name: string;
  label: string;
  slug: string;
}

interface Theme {
  id: string;
  name: string;
  label: string;
  slug: string;
}

interface TourCardProps {
  id?: string;
  imageUrls: string[];
  title: string;
  description?: string;
  overview?: string;
  price: number | string;
  rating?: number;
  duration?: Duration;
  cities?: City[];
  themes?: Theme[];
  best_time?: string;
}

const TourCard: React.FC<TourCardProps> = ({
  id,
  imageUrls,
  title,
  description,
  overview,
  price,
  rating = 0,
  duration,
  cities,
  themes,
}) => {
  const imageUrl = imageUrls?.[0] || '/placeholder-image.jpg';
  const priceText = price === 0 ? 'On Request' : `₹${typeof price === 'number' ? price.toLocaleString() : price}`;
  const displayText = description || overview || '';
  const cardLink = id ? `/${id}` : '#';

  return (
    <Link href={cardLink} className="block h-full">
      <article className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl shadow-md h-full flex flex-col border border-gray-100">
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority={false}
            quality={85}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Rating Badge */}
          {rating > 0 && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold text-xs shadow-md z-10">
              <Star className="w-3.5 h-3.5 fill-gray-900" />
              <span>{rating}</span>
            </div>
          )}

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-white text-lg font-bold leading-tight line-clamp-2 drop-shadow-lg">
              {title}
            </h3>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3 flex-1 flex flex-col bg-white">
          {/* Description */}
          <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
            {displayText}
          </p>

          {/* Duration Badge */}
          {duration?.days && (
            <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 px-3 py-1.5 rounded-lg w-fit">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-semibold text-xs">
                {duration.days}D / {duration.nights}N
              </span>
            </div>
          )}

          {/* Theme */}
          {themes && themes.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Tag className="w-3.5 h-3.5" />
                <span className="font-semibold text-[10px] uppercase tracking-wider">Theme</span>
              </div>
              <div className="inline-block bg-orange-50 border border-orange-200 text-orange-600 px-2.5 py-1 rounded-md">
                <span className="text-xs font-medium">{themes[0].label}</span>
              </div>
            </div>
          )}

          {/* Destinations */}
          {cities && cities.length > 0 && (
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-semibold text-[10px] uppercase tracking-wider">Destinations</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cities.slice(0, 4).map((city) => (
                  <div
                    key={city.id}
                    className="bg-gray-50 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs"
                  >
                    {city.name}
                  </div>
                ))}
                {cities.length > 4 && (
                  <div className="bg-gray-50 border border-gray-200 text-gray-500 px-2.5 py-1 rounded-md text-xs">
                    +{cities.length - 4} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price Section */}
          <div className="pt-3 mt-auto border-t border-gray-100">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-gray-500 text-[10px] mb-0.5">Starting from</p>
                <p className="text-orange-500 text-xl font-bold leading-none">{priceText}</p>
              </div>
              <span className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-xs whitespace-nowrap">
                View Details
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default TourCard;