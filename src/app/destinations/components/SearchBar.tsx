import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const popularSearches = [
    'Taj Mahal',
    'Red Fort',
    'Gateway of India',
    'Golden Temple',
    'Mysore Palace',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
        router.push(`/destinations/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePopularSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/destinations/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-8 border border-orange-200 shadow-md">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Search for Monuments & Places
        </h3>

        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-500 w-6 h-6" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by monument name, city, or state..."
            className="w-full pl-14 pr-28 py-4 text-lg border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-sm"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-2 text-gray-700">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">Popular:</span>
          </div>
          {popularSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handlePopularSearch(search)}
              className="px-4 py-2 bg-white hover:bg-orange-600 hover:text-white text-gray-700 rounded-full text-sm font-medium transition-all shadow-sm border border-orange-200"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
