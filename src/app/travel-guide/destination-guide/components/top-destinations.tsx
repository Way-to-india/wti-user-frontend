import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { State } from '@/lib/api/travel-guide.api';

interface TopDestinationsProps {
  states: State[];
}

export function TopDestinations({ states }: TopDestinationsProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSticky, setIsSticky] = useState(false);

  const filteredStates = states.filter(
    state =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.cities.some(city => city.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCityClick = (citySlug: string, stateSlug: string) => {
    router.push(`/travel-guide/${stateSlug}/${citySlug}`);
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {isSticky && <h2 className="font-bold text-gray-900 text-xl">Explore Destinations</h2>}

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
              placeholder="Search states or cities..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {filteredStates.map(state => (
          <div key={state.id} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-3">
              Top Destinations in {state.name}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {state.cities.map(city => (
                <button
                  key={city.id}
                  onClick={() =>
                    handleCityClick(city.citySlug, state.name.toLowerCase().replace(/\s+/g, '-'))
                  }
                  className="flex items-start gap-3 text-left group hover:translate-x-1 transition-transform"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-700 group-hover:text-orange-500 transition-colors">
                    {city.name}
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
          <p className="text-gray-500 text-lg">No destinations found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
