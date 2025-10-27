// app/places-of-interest/components/SearchBar.tsx
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
            router.push(`/places-of-interest/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handlePopularSearch = (query: string) => {
        setSearchQuery(query);
        router.push(`/places-of-interest/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Search for Monuments & Places
                </h3>

                <form onSubmit={handleSearch} className="relative mb-6">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by monument name, city, or state..."
                        className="w-full pl-14 pr-6 py-4 text-lg border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all shadow-lg"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-3 flex-wrap justify-center">
                    <div className="flex items-center gap-2 text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Popular:</span>
                    </div>
                    {popularSearches.map((search, index) => (
                        <button
                            key={index}
                            onClick={() => handlePopularSearch(search)}
                            className="px-4 py-2 bg-white hover:bg-blue-600 hover:text-white text-gray-700 rounded-full text-sm font-medium transition-all shadow-sm border border-gray-200"
                        >
                            {search}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}