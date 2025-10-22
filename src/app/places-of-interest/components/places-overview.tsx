import React from 'react';
import { MapPin, Camera, Mountain, Building2 } from 'lucide-react';

export function PlacesOverview() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Discover India's Rich Heritage</h1>
          <p className="text-lg lg:text-xl text-blue-100 leading-relaxed">
            Explore magnificent monuments, ancient temples, historic forts, and breathtaking natural
            wonders across India. From UNESCO World Heritage Sites to hidden gems, embark on a
            journey through time and culture.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total States</p>
              <p className="text-2xl font-bold text-gray-900">31+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Monuments</p>
              <p className="text-2xl font-bold text-gray-900">1000+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Mountain className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Natural Wonders</p>
              <p className="text-2xl font-bold text-gray-900">200+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Camera className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Photo Spots</p>
              <p className="text-2xl font-bold text-gray-900">500+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Temples', icon: '🛕', color: 'from-orange-400 to-orange-500' },
            { name: 'Forts', icon: '🏰', color: 'from-red-400 to-red-500' },
            { name: 'Museums', icon: '🏛️', color: 'from-purple-400 to-purple-500' },
            { name: 'Beaches', icon: '🏖️', color: 'from-blue-400 to-blue-500' },
            { name: 'Parks', icon: '🌳', color: 'from-green-400 to-green-500' },
            { name: 'Wildlife', icon: '🦁', color: 'from-yellow-400 to-yellow-500' },
          ].map(category => (
            <button
              key={category.name}
              className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                {category.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
