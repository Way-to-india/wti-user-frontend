'use client';

import React, { useEffect, useState } from 'react';
import NavBar from '@/components/layout/navbar/NavBar';
import { CityOverview } from './components/city-overview';
import { CityFacts } from './components/city-facts';
import { FoodAndShopping } from './components/food-and-shopping';
import { NearbyPlaces } from './components/nearby-places';
import { travelGuideAPI, CityDetails } from '@/lib/api/travel-guide.api';
import Link from 'next/link';

interface CityDetailsClientProps {
    params: { stateSlug: string; citySlug: string };
}

export default function CityDetailsClient({ params }: CityDetailsClientProps) {
    const [cityData, setCityData] = useState<CityDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCityData = async () => {
            try {
                setLoading(true);
                const data = await travelGuideAPI.getCityDetailsBySlug(
                    params.citySlug,
                    params.stateSlug
                );
                setCityData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load city details');
            } finally {
                setLoading(false);
            }
        };

        fetchCityData();
    }, [params.citySlug, params.stateSlug]);

    if (loading) {
        return (
            <section className="bg-gray-50 min-h-screen">
                <NavBar />
                <div className="flex justify-center items-center h-[70vh]">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-orange-500 mx-auto"></div>
                        <p className="text-gray-600 text-lg">Loading destination details...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error || !cityData) {
        return (
            <section className="bg-gray-50 min-h-screen">
                <NavBar />
                <div className="lg:mx-[7%] mx-[4%] mt-8">
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Destination Not Found</h2>
                        <p className="text-red-500">{error || 'Unable to load city details'}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
            <NavBar />

            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 lg:mb-6 mb-4 md:mt-6 mt-3 lg:mx-[7%] mx-[4%]">
                <Link href="/" className="hover:text-orange-500 transition-colors cursor-pointer">Home</Link>
                <span className="mx-2">→</span>
                <Link href="/travel-guide" className="hover:text-orange-500 transition-colors cursor-pointer">
                    Travel Guide
                </Link>
                <span className="mx-2">→</span>
                <span className="text-orange-500 font-semibold">{cityData.state}</span>
                <span className="mx-2">→</span>
                <span className="text-orange-500 font-semibold">{cityData.city}</span>
            </div>

            <div className="flex flex-col gap-12 mb-8 lg:mx-[7%] mx-[4%] font-sans">
                <CityOverview cityData={cityData} />

                {cityData.facts && <CityFacts cityData={cityData} />}

                {(cityData.foodAndDining || cityData.shopping) && <FoodAndShopping cityData={cityData} />}

                {cityData.nearbyPlaces && <NearbyPlaces cityData={cityData} />}
            </div>
        </section>
    );
}