// app/places-of-interest/[stateSlug]/[placeId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/layout/navbar/NavBar';
import { MapPin, Clock, Info } from 'lucide-react';
import { placesOfInterestAPI, MonumentsByPlace } from '@/lib/api/places-of-interest.api';

export default function MonumentsListPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<MonumentsByPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonuments = async () => {
      try {
        setLoading(true);
        const placeId = params?.placeId as string;
        const monumentsData = await placesOfInterestAPI.getMonumentsByPlace(placeId);
        setData(monumentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load monuments');
      } finally {
        setLoading(false);
      }
    };

    fetchMonuments();
  }, [params]);

  const handleMonumentClick = (monumentUrl: string) => {
    router.push(`/places-of-interest/monument/${monumentUrl}`);
  };

  if (loading) {
    return (
      <section className="bg-gray-50 min-h-screen">
        <NavBar />
        <div className="flex justify-center items-center h-[70vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 text-lg">Loading monuments...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-gray-50 min-h-screen">
        <NavBar />
        <div className="lg:mx-[7%] mx-[4%] mt-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Place Not Found</h2>
            <p className="text-red-500">{error || 'Unable to load monuments'}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-blue-50/30 to-white min-h-screen">
      <NavBar />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 lg:mb-6 mb-4 md:mt-6 mt-3 lg:mx-[7%] mx-[4%]">
        <span className="hover:text-blue-600 transition-colors cursor-pointer">Home</span>
        <span className="mx-2">→</span>
        <span
          className="hover:text-blue-600 transition-colors cursor-pointer"
          onClick={() => router.push('/places-of-interest')}
        >
          Places of Interest
        </span>
        <span className="mx-2">→</span>
        <span className="text-blue-600 font-semibold">{data.place.stateName}</span>
        <span className="mx-2">→</span>
        <span className="text-blue-600 font-semibold">{data.place.name}</span>
      </div>

      <div className="lg:mx-[7%] mx-[4%] font-sans space-y-8 mb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-8 h-8" />
            <h1 className="text-4xl lg:text-5xl font-bold">{data.place.name}</h1>
          </div>
          <p className="text-blue-100 text-lg">
            {data.place.stateName} • {data.monumentCount} attractions to explore
          </p>
        </div>

        {/* Monuments Grid */}
        {data.monuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.monuments.map(monument => (
              <div
                key={monument.id}
                onClick={() => handleMonumentClick(monument.monumentUrl)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                  {monument.indexImage ? (
                    // <img
                    //   src={monument.indexImage}
                    //   alt={monument.monumentName}
                    //   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    //   onError={e => {
                    //     (e.target as HTMLImageElement).src =
                    //       'https://via.placeholder.com/400x300?text=No+Image';
                    //   }}
                    // />
                    <div></div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-blue-300" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-semibold text-blue-600">
                      Type: {monument.typeOfPlace}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {monument.monumentName}
                  </h3>

                  {monument.bestTime && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                      <span className="line-clamp-2">{monument.bestTime}</span>
                    </div>
                  )}

                  <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center">
            <Info className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Monuments Found</h3>
            <p className="text-gray-500">
              There are currently no monuments listed for this location.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
