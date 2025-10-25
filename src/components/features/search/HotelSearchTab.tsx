"use client";
import React, { useState } from 'react'
import { MapPin, Calendar, Users, Tag } from 'lucide-react';

const HotelSearchTab = () => {
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  return (
    <div>              <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Destination
          </label>
          <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer">
            <option>Select destination...</option>
            <option>Mumbai</option>
            <option>Delhi</option>
            <option>Bangalore</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Check-in
          </label>
          <input
            type="date"
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Check-out
          </label>
          <input
            type="date"
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            Guests
          </label>
          <button
            onClick={() => setShowGuestSelector(!showGuestSelector)}
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-left text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
          >
            2 Guests
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
          Search Hotels
        </button>
      </div>
    </div></div>
  )
}

export default HotelSearchTab