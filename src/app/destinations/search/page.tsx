'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavBar from '@/components/layout/navbar/NavBar';
import {
  Search,
  Loader2,
  MapPin,
  Clock,
  Star,
  Filter,
  X,
} from 'lucide-react';
import placesOfInterestAPI, {
  Monument,
  Category,
  State,
} from '@/lib/api/places-of-interest.api';

function SearchResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [states, setStates] = useState<State[]>([]);

  const searchQuery = searchParams?.get('q') || '';
  const categoryFilter = searchParams?.get('category') || '';
  const stateFilter = searchParams?.get('state') || '';

  const handleMonumentClick = (monument: Monument) => {
    router.push(`/destinations/${monument.stateSlug}/${monument.citySlug}/${monument.slug}`);
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesData, statesData] = await Promise.all([
          placesOfInterestAPI.getAllCategories(),
          placesOfInterestAPI.getAllStates(),
        ]);
        setCategories(categoriesData);
        setStates(statesData);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const results = await placesOfInterestAPI.searchMonuments(
          searchQuery,
          categoryFilter || undefined,
          stateFilter || undefined,
          20,
          0
        );

        setMonuments(results.monuments);
        setTotal(results.total);
        setHasMore(results.hasMore);
        setOffset(20);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, categoryFilter, stateFilter]);

  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const results = await placesOfInterestAPI.searchMonuments(
        searchQuery,
        categoryFilter || undefined,
        stateFilter || undefined,
        20,
        offset
      );
      setMonuments((prev) => [...prev, ...results.monuments]);
      setHasMore(results.hasMore);
      setOffset((prev) => prev + 20);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const updateFilter = (type: 'category' | 'state', value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }
    router.push(`/destinations/search?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(`/destinations/search?q=${searchQuery}`);
  };

  if (!searchQuery) {
    return (
      <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
        <NavBar />
        <div className="lg:mx-[7%] mx-[4%] mt-12">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8 text-center">
            <Search className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Search Query
            </h2>
            <p className="text-gray-600 mb-4">
              Please enter a search term to find monuments
            </p>
            <button
              onClick={() => router.push('/destinations')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Browse All Places
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
          <p className="text-gray-600 text-lg font-medium">
            Searching for "{searchQuery}"...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-orange-50/30 via-white to-gray-50 min-h-screen">
      <NavBar />

      <div className="text-sm text-gray-600 lg:mb-6 mb-4 md:mt-6 mt-3 lg:mx-[7%] mx-[4%]">
        <button
          onClick={() => router.push('/')}
          className="hover:text-orange-600 transition-colors"
        >
          Home
        </button>
        <span className="mx-2">→</span>
        <button
          onClick={() => router.push('/destinations')}
          className="hover:text-orange-600 transition-colors"
        >
          Places of Interest
        </button>
        <span className="mx-2">→</span>
        <span className="text-orange-600 font-semibold">Search Results</span>
      </div>

      <div className="lg:mx-[7%] mx-[4%] font-sans pb-12">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl p-8 lg:p-12 text-white shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8" />
            <h1 className="text-3xl lg:text-5xl font-bold">Search Results</h1>
          </div>
          <p className="text-orange-100 text-lg">
            Found {total} results for "{searchQuery}"
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                {(categoryFilter || stateFilter) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </button>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name} ({cat.monumentCount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                </label>
                <select
                  value={stateFilter}
                  onChange={(e) => updateFilter('state', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state.slug} value={state.slug}>
                      {state.name} ({state.monumentCount})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {error ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                <h3 className="text-xl font-bold text-red-600 mb-2">
                  Search Error
                </h3>
                <p className="text-red-500">{error}</p>
              </div>
            ) : monuments.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {monuments.map((monument) => (
                    <div
                      key={monument.slug}
                      onClick={() => handleMonumentClick(monument)}
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100 hover:-translate-y-2 duration-300"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300">
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-16 h-16 text-orange-400/50" />
                        </div>
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                          <span className="text-xs font-bold text-orange-600 capitalize">
                            {monument.typeofPlace?.replace(/-/g, ' ')}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                          {monument.monumentName}
                        </h3>

                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-orange-500" />
                          <span className="text-sm">
                            {monument.city}, {monument.state}
                          </span>
                        </div>

                        {monument.besttime && (
                          <div className="flex items-start gap-2 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                            <span className="line-clamp-2">
                              {monument.besttime}
                            </span>
                          </div>
                        )}

                        {monument.rating && (
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold">
                              {monument.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        'Load More Results'
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-500 mb-6">
                  No monuments found matching "{searchQuery}"
                  {categoryFilter && ` in category "${categoryFilter}"`}
                  {stateFilter && ` in state "${stateFilter}"`}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
          <NavBar />
          <div className="flex items-center justify-center h-[70vh]">
            <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
          </div>
        </section>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}