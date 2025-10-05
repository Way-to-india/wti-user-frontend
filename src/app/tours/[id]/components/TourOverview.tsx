import React, { useState } from 'react';
import { Clock, MapPin, Heart, Users, Home, Palette } from 'lucide-react';

interface TourOverviewProps {
  tourDetails: any;
}

const TourOverview: React.FC<TourOverviewProps> = ({ tourDetails }) => {
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);

  const cities = tourDetails?.cities || [];
  const themes = tourDetails?.themes || [];

  const displayedCities = showAllCities ? cities : cities.slice(0, 4);
  const displayedThemes = showAllThemes ? themes : themes.slice(0, 4);

  return (
    <>
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Duration */}
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <Clock className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="font-medium text-sm">
                {tourDetails?.duration?.nights || 0} Nights / {tourDetails?.duration?.days || 0}{' '}
                Days
              </p>
            </div>
          </div>

          {/* Starting City */}
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <MapPin className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Starting From</p>
              <p className="font-medium text-sm">{tourDetails?.startCity?.name || 'Not Found'}</p>
            </div>
          </div>

          {/* Best Time */}
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <Heart className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Best Time</p>
              <p className="font-medium text-sm">{tourDetails?.bestTime || 'Year-round'}</p>
            </div>
          </div>

          {/* Ideal For */}
          <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Ideal For</p>
              <p className="font-medium text-sm">{tourDetails?.idealFor || 'Friends/Couples'}</p>
            </div>
          </div>

          {/* Destination Covered */}
          {cities.length > 0 && (
            <div className="bg-white rounded-lg p-3 border flex items-start gap-2">
              <div className="p-1.5 bg-orange-50 rounded-lg mt-0.5">
                <Home className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">Destination Covered</p>
                <div className="flex flex-wrap gap-1.5">
                  {displayedCities.map((city: any, idx: number) => (
                    <span
                      key={idx}
                      className="inline-block px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100"
                    >
                      {city.name}
                    </span>
                  ))}
                  {cities.length > 4 && (
                    <button
                      onClick={() => setShowAllCities(!showAllCities)}
                      className="inline-block px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium hover:bg-orange-600 transition-colors"
                    >
                      {showAllCities ? '- Less' : `+${cities.length - 4} More`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {themes.length > 0 && (
            <div className="bg-white rounded-lg p-3 border flex items-start gap-2">
              <div className="p-1.5 bg-orange-50 rounded-lg mt-0.5">
                <Home className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-2">Themes</p>
                <div className="flex flex-wrap gap-1.5">
                  {displayedThemes.map((city: any, idx: number) => (
                    <span
                      key={idx}
                      className="inline-block px-2.5 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium border border-orange-100"
                    >
                      {city.name}
                    </span>
                  ))}
                  {themes.length > 4 && (
                    <button
                      onClick={() => setShowAllThemes(!showAllThemes)}
                      className="inline-block px-2.5 py-1 bg-orange-500 text-white rounded-full text-xs font-medium hover:bg-orange-600 transition-colors"
                    >
                      {showAllThemes ? '- Less' : `+${themes.length - 4} More`}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Highlights Section */}
      {tourDetails?.highlights && tourDetails.highlights.length > 0 && (
        <div className="mb-6 ml-5">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-orange-500 capitalize">
            Highlights of {tourDetails.title}:
          </h2>
          <ul className="list-disc ml-5 space-y-1">
            {tourDetails.highlights.map((highlight: string, index: number) => (
              <li key={index} className="text-gray-700 text-sm sm:text-base">
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3">Description</h2>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-justify">
          {tourDetails?.description || 'No description available for this tour.'}
        </p>
      </div>
    </>
  );
};

export default TourOverview;
