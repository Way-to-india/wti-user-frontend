import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { State } from '@/lib/api/places-of-interest.api';

interface TopPlacesProps {
  states: State[];
}

export function TopPlaces({ states }: TopPlacesProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSticky, setIsSticky] = useState(false);

  // Add safety check for states
  const filteredStates = (states || []).filter(
    state =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.places?.some(place => place.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePlaceClick = (stateId: string, placeId: string, stateName: string) => {
    const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-');
    router.push(`/places-of-interest/${stateSlug}/${placeId}`);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show loading state if no states yet
  if (!states || states.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Loading places...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div
        className={`${
          isSticky
            ? 'fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4 lg:px-[7%] px-[4%]'
            : ''
        } transition-all duration-300`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {isSticky && <h2 className="font-bold text-gray-900 text-xl">Explore Tourist Places</h2>}

          <div
            className={`relative ${
              isSticky ? 'md:flex-1 md:max-w-md md:ml-auto' : 'max-w-md'
            } w-full`}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search states or places..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {filteredStates.map(state => (
          <div key={state.id} className="space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-gray-200 pb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Places of Interest in {state.name}
              </h2>
              <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {state.placeCount} places
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {state.places?.map(place => (
                <button
                  key={place.id}
                  onClick={() => handlePlaceClick(state.id, place.id, state.name)}
                  className="flex items-start gap-3 text-left group hover:translate-x-1 transition-transform"
                >
                  <svg
                    className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                    {place.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredStates.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No places found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
