import React from 'react';
import { FiClock, FiMapPin, FiHeart, FiUsers, FiHome } from 'react-icons/fi';

interface TourOverviewProps {
  tourDetails: any;
}

const TourOverview: React.FC<TourOverviewProps> = ({ tourDetails }) => {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <FiClock className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-medium text-sm">
                {tourDetails?.duration?.nights || 0} Nights/{tourDetails?.duration?.days || 0} Days
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <FiMapPin className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Starting From</p>
              <p className="font-medium text-sm">{tourDetails?.startingLocation || 'Delhi'}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <FiHeart className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Best Time</p>
              <p className="font-medium text-sm">{tourDetails?.bestTime || 'Year-round'}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <FiUsers className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Ideal For</p>
              <p className="font-medium text-sm">{tourDetails?.idealFor || 'Friends/Couples'}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <FiHome className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cities Covering</p>
              <p className="font-medium text-sm">{tourDetails?.city_ids?.length || '1'}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">Description</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {tourDetails?.description || 'No description available for this tour.'}
        </p>
      </div>
    </>
  );
};

export default TourOverview;
