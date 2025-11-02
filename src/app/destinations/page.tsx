'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/layout/navbar/NavBar';
import { PlacesHero } from './components/PlacesHero';
import { StatsOverview } from './components/StatsOverview';
import { CategoryGrid } from './components/CategoryGrid';
import { StatesAccordion } from './components/StatesAccordian';
import { SearchBar } from './components/SearchBar';
import placesOfInterestAPI, { HomepageData } from '@/lib/api/places-of-interest.api';
import { Loader2, RefreshCw } from 'lucide-react';

export default function PlacesOfInterestPage() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await placesOfInterestAPI.getHomepageData();
      console.log('Homepage Data:', data);
      setHomepageData(data);
    } catch (err) {
      console.error('Error fetching homepage data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
  }, []);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-blue-50/30 to-white min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="w-16 h-16 from-orange-500 to-orange-600  animate-spin" />
          <p className="text-gray-600 text-lg font-medium">Loading Places of Interest...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
        </div>
      </section>
    );
  }

  if (error || !homepageData) {
    return (
      <section className="bg-gradient-to-b from-blue-50/30 to-white min-h-screen">
        <NavBar />
        <div className="lg:mx-[7%] mx-[4%] mt-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Failed to Load Data</h2>
            <p className="text-red-500 mb-6">{error || 'Something went wrong'}</p>
            <button
              onClick={fetchHomepageData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-b from-blue-50/30 via-white to-gray-50 min-h-screen">
      <NavBar />


      <div className="text-sm text-gray-600 lg:mb-8 mb-4 md:mt-6 mt-3 lg:mx-[7%] mx-[4%]">
        <span className="hover:text-orange-600 transition-colors cursor-pointer">Home</span>
        <span className="mx-2">→</span>
        <span className="text-orange-600 font-semibold">Places of Interest</span>
      </div>

      <div className="lg:mx-[7%] mx-[4%] font-sans space-y-12 pb-16">

        <PlacesHero />

        {homepageData.statistics && <StatsOverview statistics={homepageData.statistics} />}

        <SearchBar />

        {homepageData.categories && homepageData.categories.length > 0 && (
          <CategoryGrid categories={homepageData.categories} />
        )}

        {homepageData.states && homepageData.states.length > 0 && (
          <StatesAccordion states={homepageData.states} />
        )}

        <div className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-3xl p-8 text-gray-900 shadow-xl border border-orange-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold mb-1">{homepageData.statistics.totalStates}</p>
              <p className="text-orange-700 text-sm font-medium">States Covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{homepageData.statistics.totalCities}</p>
              <p className="text-orange-700 text-sm font-medium">Cities Listed</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{homepageData.statistics.totalMonuments}</p>
              <p className="text-orange-700 text-sm font-medium">Monuments</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{homepageData.statistics.totalCategories}</p>
              <p className="text-orange-700 text-sm font-medium">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}