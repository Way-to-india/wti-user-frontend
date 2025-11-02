import React from 'react';
import {
  MapPin,
  Camera,
  Mountain,
  Building2,
  Landmark,
  Castle,
  Banknote,
  Waves,
  TreePalm,
  PawPrint,
} from 'lucide-react';

export function PlacesOverview() {
  const categories = [
    { name: 'Temples', icon: Landmark },
    { name: 'Forts', icon: Castle },
    { name: 'Museums', icon: Banknote },
    { name: 'Beaches', icon: Waves },
    { name: 'Parks', icon: TreePalm },
    { name: 'Wildlife', icon: PawPrint },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 lg:p-12 text-white shadow-xl">
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Discover India's Rich Heritage</h1>
          <p className="text-lg lg:text-xl text-orange-100 leading-relaxed">
            Explore magnificent monuments, ancient temples, historic forts, and breathtaking natural
            wonders across India. From UNESCO World Heritage Sites to hidden gems, embark on a
            journey through time and culture.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total States</p>
              <p className="text-2xl font-bold text-gray-900">31+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Building2 className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Monuments</p>
              <p className="text-2xl font-bold text-gray-900">1000+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Mountain className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Natural Wonders</p>
              <p className="text-2xl font-bold text-gray-900">200+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <Camera className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Photo Spots</p>
              <p className="text-2xl font-bold text-gray-900">500+</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className="group bg-gray-50 hover:bg-orange-50 rounded-xl p-4 transition-all hover:scale-105 border border-gray-100 hover:border-orange-200"
            >
              <div className="bg-orange-100 p-3 rounded-xl w-fit mx-auto mb-3 group-hover:bg-orange-200 transition-all">
                <Icon className="w-6 h-6 text-orange-600 group-hover:text-orange-700" />
              </div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-700 text-center">
                {name}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
