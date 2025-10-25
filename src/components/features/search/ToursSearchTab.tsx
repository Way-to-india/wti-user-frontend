import { MapPin, Calendar, Users, Tag } from 'lucide-react';
import React from 'react'

const ToursSearchTab = () => {
  return (
    <div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Destination
            </label>
            <div className="relative group">
              <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer">
                <option>Select destination...</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
                <option>Jaipur</option>
                <option>Goa</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" />
              Tour Theme
            </label>
            <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer">
              <option>Any theme...</option>
              <option>Adventure</option>
              <option>Cultural</option>
              <option>Beach</option>
              <option>Wildlife</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Travel Start
            </label>
            <input
              type="date"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Travel End
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
            <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>
                  {num} Guest{num !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
              Search Tours
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ToursSearchTab