'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/layout/navbar/NavBar';
import { Loader2, MapPin, Clock, Star, ArrowLeft, Filter } from 'lucide-react';
import placesOfInterestAPI, { State } from '@/lib/api/places-of-interest.api';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();

  const [categoryData, setCategoryData] = useState<any>(null);
  const [monuments, setMonuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [states, setStates] = useState<State[]>([]);
  const [selectedState, setSelectedState] = useState('');

  const categorySlug = params?.categorySlug as string;

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const statesData = await placesOfInterestAPI.getAllStates();
        setStates(statesData);
      } catch (err) {
        console.error('Error fetching states:', err);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await placesOfInterestAPI.getMonumentsByCategory(
          categorySlug,
          24,
          0,
          selectedState || undefined
        );
        setCategoryData(data.category);
        setMonuments(data.monuments);
        setHasMore(data.hasMore);
        setOffset(24);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err instanceof Error ? err.message : 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    if (categorySlug) fetchCategoryData();
  }, [categorySlug, selectedState]);

  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const data = await placesOfInterestAPI.getMonumentsByCategory(
        categorySlug,
        24,
        offset,
        selectedState || undefined
      );
      setMonuments((prev) => [...prev, ...data.monuments]);
      setHasMore(data.hasMore);
      setOffset((prev) => prev + 24);
    } catch (err) {
      console.error('Error loading more:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
          <p className="text-gray-600 text-lg font-medium">Loading category...</p>
        </div>
      </section>
    );
  }

  if (error || !categoryData) {
    return (
      <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
        <NavBar />
        <div className="lg:mx-[7%] mx-[4%] mt-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Category Not Found</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push('/destinations')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Back to Places
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-orange-50/30 via-white to-gray-50 min-h-screen">
      <NavBar />

      <div className="text-sm text-gray-600 lg:mb-6 mb-4 md:mt-6 mt-3 lg:mx-[7%] mx-[4%]">
        <button onClick={() => router.push('/')} className="hover:text-orange-600 transition-colors">
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
        <span className="text-orange-600 font-semibold capitalize">
          {categoryData.name.replace(/-/g, ' ')}
        </span>
      </div>

      <div className="lg:mx-[7%] mx-[4%] font-sans pb-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group mb-6"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 capitalize">
              {categoryData.name.replace(/-/g, ' ')}
            </h1>
            <p className="text-orange-100 text-lg">
              {categoryData.monumentCount} monuments in this category
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Filter className="w-5 h-5 text-orange-600" />
              <span>Filter by State:</span>
            </div>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="flex-1 sm:max-w-xs p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state.slug} value={state.slug}>
                  {state.name}
                </option>
              ))}
            </select>

            {selectedState && (
              <button
                onClick={() => setSelectedState('')}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        {monuments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monuments.map((monument, index) => (
                <div
                  key={`${monument.slug}-${index}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:-translate-y-2 duration-300"
                >
                  <div className="relative h-56 bg-gradient-to-br from-orange-100 via-orange-50 to-white">
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-20 h-20 text-orange-300/60" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[56px]">
                      {monument.monumentName}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm truncate">
                        {monument.city}, {monument.state}
                      </span>
                    </div>

                    {monument.besttime && (
                      <div className="flex items-start gap-2 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                        <span className="line-clamp-2">{monument.besttime}</span>
                      </div>
                    )}

                    {monument.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{monument.rating}/5</span>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        router.push(
                          `/destinations/${monument.stateSlug}/${monument.citySlug}/${monument.slug}`
                        )
                      }
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg group-hover:shadow-xl"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Monuments Found</h3>
            <p className="text-gray-500 mb-6">
              No monuments found in this category
              {selectedState && ' for the selected state'}.
            </p>
            {selectedState && (
              <button
                onClick={() => setSelectedState('')}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Clear State Filter
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
