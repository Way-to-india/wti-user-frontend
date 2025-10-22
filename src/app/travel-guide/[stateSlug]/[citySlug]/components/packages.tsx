import React from 'react';
import Image from 'next/image';
import { Package, Clock, Calendar, Users, Star, ArrowRight } from 'lucide-react';
import { CityDetails } from '@/lib/api/travel-guide.api';

interface PackagesProps {
  cityData: CityDetails;
}

export function Packages({ cityData }: PackagesProps) {
  // Sample package data - in production this would come from API
  const packages = [
    {
      title: `Complete ${cityData.city} Experience`,
      duration: '3 Nights / 4 Days',
      price: '₹12,999',
      rating: 4.8,
      reviews: 245,
      highlights: ['Hotel Stay', 'Sightseeing', 'Meals Included', 'Transport'],
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
      bestFor: 'Families',
    },
    {
      title: `${cityData.city} Heritage Tour`,
      duration: '2 Nights / 3 Days',
      price: '₹8,999',
      rating: 4.6,
      reviews: 189,
      highlights: ['Cultural Sites', 'Local Guide', 'Museums', 'Food Tour'],
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
      bestFor: 'Culture Lovers',
    },
    {
      title: `Weekend Getaway to ${cityData.city}`,
      duration: '1 Night / 2 Days',
      price: '₹5,999',
      rating: 4.5,
      reviews: 156,
      highlights: ['Quick Tour', 'Top Attractions', 'Breakfast', 'Photography'],
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      bestFor: 'Couples',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-bold text-gray-900 lg:text-4xl text-3xl">{cityData.city} Packages</h2>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={pkg.image}
                alt={pkg.title}
                width={800}
                height={600}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-gray-900">{pkg.rating}</span>
                <span className="text-xs text-gray-500">({pkg.reviews})</span>
              </div>

              {/* Best For Badge */}
              <div className="absolute top-4 left-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {pkg.bestFor}
              </div>

              {/* Duration */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                <span className="font-semibold text-sm">{pkg.duration}</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-gray-900 font-bold text-xl mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {pkg.title}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-indigo-600 font-bold text-2xl">{pkg.price}</span>
                  <span className="text-gray-500 text-sm">per person</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 text-sm font-medium">Package Includes:</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group/btn">
                <span>View Details</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hotel Details Section */}
      {cityData.hotelDetails && (
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-3xl shadow-lg p-8 border border-indigo-100">
          <h3 className="font-bold text-gray-900 text-2xl mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            Accommodation Options
          </h3>
          <p className="text-gray-700 lg:text-lg leading-relaxed">{cityData.hotelDetails}</p>
        </div>
      )}
    </div>
  );
}
