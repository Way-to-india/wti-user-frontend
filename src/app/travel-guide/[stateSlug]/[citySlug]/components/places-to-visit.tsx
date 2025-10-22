import React from 'react';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import { CityDetails } from '@/lib/api/travel-guide.api';

interface PlacesToVisitProps {
  cityData: CityDetails;
}

export function PlacesToVisit({ cityData }: PlacesToVisitProps) {
  // Sample places data - in real implementation, this would come from API
  const samplePlaces = [
    {
      name: 'Historic Temple',
      image: 'https://images.unsplash.com/photo-1588519949436-e6d8489095e3?w=600&h=800&fit=crop',
      rating: 4.8,
    },
    {
      name: 'Cultural Museum',
      image: 'https://images.unsplash.com/photo-1608037521244-f1c6c7635194?w=600&h=800&fit=crop',
      rating: 4.6,
    },
    {
      name: 'Scenic Waterfall',
      image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&h=800&fit=crop',
      rating: 4.9,
    },
    {
      name: 'Ancient Fort',
      image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=800&fit=crop',
      rating: 4.7,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-bold text-gray-900 lg:text-4xl text-3xl">
          Places to Visit in {cityData.city}
        </h2>
      </div>

      {cityData.placesToSeeTop && (
        <p className="text-gray-700 lg:text-lg leading-relaxed max-w-4xl">
          {cityData.placesToSeeTop}
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {samplePlaces.map((place, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={place.image}
                alt={place.name}
                width={600}
                height={800}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-900">{place.rating}</span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-xl mb-1">{place.name}</h3>
                <p className="text-white/80 text-sm">{cityData.city}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cityData.placesToSeeBottom && (
        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
          <p className="text-gray-700 lg:text-lg leading-relaxed">{cityData.placesToSeeBottom}</p>
        </div>
      )}
    </div>
  );
}
