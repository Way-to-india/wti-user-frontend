'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/layout/navbar/NavBar';
import { MapPin, Clock, Loader2, Info, Star, ArrowLeft } from 'lucide-react';
import placesOfInterestAPI, { Monument } from '@/lib/api/places-of-interest.api';

export default function MonumentsListPage() {
  const params = useParams();
  const router = useRouter();
  const [cityData, setCityData] = useState<any | null>(null);
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const stateSlug = params?.stateSlug as string;
  const citySlug = params?.citySlug as string;

  useEffect(() => {
    const fetchCityAndMonuments = async () => {
      try {
        setLoading(true);
        setError(null);
        const cityDetails = await placesOfInterestAPI.getCityDetails(stateSlug, citySlug);
        setCityData(cityDetails);
        const monumentsData = await placesOfInterestAPI.getMonumentsByCity(
          stateSlug,
          citySlug,
          12,
          0
        );
        setMonuments(monumentsData.monuments);
        setHasMore(monumentsData.hasMore);
        setOffset(12);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load monuments');
      } finally {
        setLoading(false);
      }
    };
    if (stateSlug && citySlug) fetchCityAndMonuments();
  }, [stateSlug, citySlug]);

  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const monumentsData = await placesOfInterestAPI.getMonumentsByCity(
        stateSlug,
        citySlug,
        12,
        offset
      );
      setMonuments((prev) => [...prev, ...monumentsData.monuments]);
      setHasMore(monumentsData.hasMore);
      setOffset((prev) => prev + 12);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleMonumentClick = (monument: Monument) => {
    router.push(`/destinations/${monument.stateSlug}/${monument.citySlug}/${monument.slug}`);
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-orange-50/40 to-white min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
          <p className="text-gray-600 text-lg font-medium">Loading monuments...</p>
        </div>
      </section>
    );
  }

  if (error || !cityData) {
    return (
      <section className="bg-gradient-to-b from-orange-50/40 to-white min-h-screen">
        <NavBar />
        <div className="lg:mx-[7%] mx-[4%] mt-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">City Not Found</h2>
            <p className="text-red-500 mb-4">{error || 'Unable to load monuments'}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              Go Back
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
        <span className="hover:text-orange-600 transition-colors cursor-pointer">Home</span>
        <span className="mx-2">→</span>
        <span
          className="hover:text-orange-600 transition-colors cursor-pointer"
          onClick={() => router.push('/destinations')}
        >
          Places of Interest
        </span>
        <span className="mx-2">→</span>
        <span className="text-orange-600 font-semibold">{cityData.city.state}</span>
        <span className="mx-2">→</span>
        <span className="text-orange-600 font-semibold">{cityData.city.name}</span>
      </div>

      <div className="lg:mx-[7%] mx-[4%] font-sans space-y-8 pb-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl p-8 lg:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8" />
              <h1 className="text-4xl lg:text-5xl font-bold">{cityData.city.name}</h1>
            </div>
            <p className="text-orange-100 text-lg mb-6">
              {cityData.city.state} • {cityData.city.monumentCount} attractions to explore
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-medium">🏛️ Historical Sites</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-medium">📸 Photo Spots</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-white font-medium">🎫 Tourist Attractions</span>
              </div>
            </div>
          </div>
        </div>

        {monuments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monuments.map((monument) => (
                <div
                  key={monument.slug}
                  onClick={() => handleMonumentClick(monument)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100 hover:-translate-y-2 duration-300"
                >
                  <div className="relative h-56 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-20 h-20 text-orange-300/50" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-orange-600 capitalize">
                        {monument.typeofPlace?.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[56px]">
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
                        <span className="line-clamp-2">{monument.besttime}</span>
                      </div>
                    )}

                    {monument.rating && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold text-gray-700">
                          {monument.rating}/5
                        </span>
                        {monument.totalRatings && (
                          <span className="text-xs text-gray-500">
                            ({monument.totalRatings} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMonumentClick(monument);
                      }}
                      className="w-full mt-4 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg group-hover:shadow-xl"
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
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <div className="bg-orange-50 rounded-2xl p-12 text-center">
            <Info className="w-16 h-16 text-orange-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Monuments Found</h3>
            <p className="text-gray-500">
              There are currently no monuments listed for {cityData.city.name}.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}