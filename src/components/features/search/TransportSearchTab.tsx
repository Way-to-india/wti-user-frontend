import React from 'react'
import { MapPin, Calendar, Users, Tag } from 'lucide-react';

const TransportSearchTab = () => {
  return (
    <div>              <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center cursor-pointer">
          <input type="radio" name="tripType" defaultChecked className="w-4 h-4 text-orange-500 focus:ring-orange-500" />
          <span className="ml-2 text-sm font-medium text-gray-700">One Way</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input type="radio" name="tripType" className="w-4 h-4 text-orange-500 focus:ring-orange-500" />
          <span className="ml-2 text-sm font-medium text-gray-700">Round Trip</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            From
          </label>
          <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer">
            <option>Select departure...</option>
            <option>Mumbai</option>
            <option>Delhi</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            To
          </label>
          <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer">
            <option>Select destination...</option>
            <option>Delhi</option>
            <option>Bangalore</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Departure
          </label>
          <input
            type="date"
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            Passengers
          </label>
          <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none appearance-none cursor-pointer">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} Passenger{num !== 1 ? 's' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
          Search Transport
        </button>
      </div>
    </div></div>
  )
}

export default TransportSearchTab