import React, { useState } from 'react';
import { Clock, MapPin, Heart, Users, Home, X, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TourOverviewProps {
  tourDetails: any;
}

const TourOverview: React.FC<TourOverviewProps> = ({ tourDetails }) => {
  const [showCitiesModal, setShowCitiesModal] = useState(false);
  const [showThemesModal, setShowThemesModal] = useState(false);

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
                {tourDetails?.duration?.nights || 0} Nights/{tourDetails?.duration?.days || 0} Days
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

          {/* Cities Covering */}
          <div
            className="bg-white rounded-lg p-3 border flex items-center gap-2 cursor-pointer hover:bg-orange-50 transition-colors"
            onClick={() => setShowCitiesModal(true)}
          >
            <div className="p-1.5 bg-orange-50 rounded-lg">
              <Home className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Destination Covered</p>
              <p className="font-medium text-sm text-orange-500 hover:underline">
                {tourDetails?.cities?.length || '1'}
              </p>
            </div>
          </div>

          {/* Themes */}
          {tourDetails?.themes && tourDetails.themes.length > 0 && (
            <div
              className="bg-white rounded-lg p-3 border flex items-center gap-2 cursor-pointer hover:bg-orange-50 transition-colors"
              onClick={() => setShowThemesModal(true)}
            >
              <div className="p-1.5 bg-orange-50 rounded-lg">
                <Palette className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Themes</p>
                <p className="font-medium text-sm text-orange-500 hover:underline">
                  {tourDetails?.themes?.length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cities Modal */}
      <AnimatePresence>
        {showCitiesModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-auto shadow-lg"
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Cities Covered</h3>
                <button
                  onClick={() => setShowCitiesModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                {tourDetails?.cities && tourDetails.cities.length > 0 ? (
                  <ul className="space-y-3">
                    {tourDetails.cities.map((city: any, index: number) => (
                      <li
                        key={city.id || index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <div className="p-2 bg-orange-100 rounded-full">
                          <MapPin className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{city.name}</p>
                          {city.state_id && (
                            <p className="text-xs text-gray-500">{city.state_id}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 py-8">No cities information available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Themes Modal */}
      <AnimatePresence>
        {showThemesModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-auto shadow-lg"
            >
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Themes</h3>
                <button
                  onClick={() => setShowThemesModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="p-4">
                {tourDetails?.themes && tourDetails.themes.length > 0 ? (
                  <ul className="space-y-3">
                    {tourDetails.themes.map((theme: any, index: number) => (
                      <li
                        key={theme.id || index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors"
                      >
                        <div className="p-2 bg-orange-100 rounded-full">
                          <Palette className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{theme.name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500 py-8">No themes available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Highlights Section */}
      {tourDetails?.highlights && tourDetails.highlights.length > 0 && (
        <div className="mb-6 ml-5">
          <h2 className="text-lg sm:text-xl font-bold mb-3 text-orange-500">HIGHLIGHTS :</h2>
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
