'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/layout/navbar/NavBar';
import { PlacesOverview } from './components/places-overview';
import { TopPlaces } from './components/top-places';
import { placesOfInterestAPI, State } from '@/lib/api/places-of-interest.api';

export default function PlacesOfInterestPage() {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
        const data = await placesOfInterestAPI.getAllStatesWithPlaces();
        console.log(data);
        setStates(data);
      } catch (err) {
        console.log(err);
        setError(err instanceof Error ? err.message : 'Failed to load places');
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  return (
    <section className="bg-gradient-to-b from-blue-50/30 to-white min-h-screen">
      <NavBar />
      <div className="text-sm text-gray-600 lg:mb-8 mb-4 md:mt-6 mt-3 lg:mx-[7%] mx-[4%]">
        <span className="hover:text-blue-600 transition-colors cursor-pointer">Home</span>
        <span className="mx-2">→</span>
        <span className="text-blue-600 font-semibold">Places of Interest</span>
      </div>

      <div className="flex flex-col gap-12 mb-8 lg:mx-[7%] mx-[4%] font-sans">
        <PlacesOverview />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <TopPlaces states={states} />
        )}
      </div>
    </section>
  );
}
