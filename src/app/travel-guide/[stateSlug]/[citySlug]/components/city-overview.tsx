import React from 'react';
import Image from 'next/image';
import { Calendar, MapPin } from 'lucide-react';
import { CityDetails } from '@/lib/api/travel-guide.api';

interface CityOverviewProps {
  cityData: CityDetails;
}

export function CityOverview({ cityData }: CityOverviewProps) {
  const getImageUrl = (cityImage?: string) => {
    if (cityImage && cityImage.startsWith('http')) {
      return cityImage;
    }
    // Default beautiful India destination image
    return 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&h=900&fit=crop';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-orange-600">
          <MapPin className="w-6 h-6" />
          <span className="text-lg font-medium">{cityData.state}</span>
        </div>

        <h1 className="font-bold text-gray-900 lg:text-6xl md:text-5xl text-3xl tracking-tight">
          {cityData.city} Travel Guide
        </h1>

        {cityData.bestTimeToVisit && (
          <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
            <Calendar className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              Best time to visit: {cityData.bestTimeToVisit}
            </span>
          </div>
        )}
      </div>

      {cityData.introduction && (
        <p className="text-gray-700 text-md text-base leading-relaxed max-w-4xl text-wrap">
          {cityData.introduction}
        </p>
      )}
    </div>
  );
}
