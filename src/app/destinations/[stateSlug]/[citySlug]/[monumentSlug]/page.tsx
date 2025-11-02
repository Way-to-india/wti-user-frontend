'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import NavBar from '@/components/layout/navbar/NavBar';
import {
  MapPin,
  Clock,
  Loader2,
  ArrowLeft,
  Star,
  Phone,
  Globe,
  Calendar,
  Cloud,
  Train,
  Plane,
  Car,
  Navigation,
} from 'lucide-react';
import placesOfInterestAPI, {
  MonumentDetails,
  Monument,
} from '@/lib/api/places-of-interest.api';

export default function MonumentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [monument, setMonument] = useState<MonumentDetails | null>(null);
  const [nearbyMonuments, setNearbyMonuments] = useState<Monument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const monumentSlug = params?.monumentSlug as string;

  useEffect(() => {
    const fetchMonumentData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [monumentData, nearby] = await Promise.all([
          placesOfInterestAPI.getMonumentBySlug(monumentSlug),
          placesOfInterestAPI.getNearbyMonuments(monumentSlug, 6),
        ]);

        setMonument(monumentData);
        setNearbyMonuments(nearby);
      } catch (err) {
        console.error('Error fetching monument:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to load monument details'
        );
      } finally {
        setLoading(false);
      }
    };

    if (monumentSlug) fetchMonumentData();
  }, [monumentSlug]);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
          <Loader2 className="w-16 h-16 text-orange-600 animate-spin" />
          <p className="text-gray-600 text-lg font-medium">
            Loading monument details...
          </p>
        </div>
      </section>
    );
  }

  if (error || !monument) {
    return (
      <section className="bg-gradient-to-b from-orange-50/30 to-white min-h-screen">
        <NavBar />
        <div className="lg:mx-[7%] mx-[4%] mt-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Monument Not Found
            </h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => router.push('/places-of-interest')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
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
        <button
          onClick={() => router.push('/')}
          className="hover:text-orange-600 transition-colors"
        >
          Home
        </button>
        <span className="mx-2">→</span>
        <button
          onClick={() => router.push('/places-of-interest')}
          className="hover:text-orange-600 transition-colors"
        >
          Places
        </button>
        <span className="mx-2">→</span>
        <span className="text-gray-800">{monument.state}</span>
        <span className="mx-2">→</span>
        <span className="text-gray-800">{monument.city}</span>
        <span className="mx-2">→</span>
        <span className="text-orange-600 font-semibold">
          {monument.monumentName}
        </span>
      </div>

      <div className="lg:mx-[7%] mx-[4%] font-sans space-y-8 pb-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 rounded-3xl p-8 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                {monument.typeofPlace?.replace(/-/g, ' ').toUpperCase()}
              </span>
              {monument.rating && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                  <span className="font-bold">{monument.rating}/5</span>
                  {monument.totalRatings && (
                    <span className="text-sm">
                      ({monument.totalRatings})
                    </span>
                  )}
                </div>
              )}
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              {monument.monumentName}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-orange-100 mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">
                  {monument.city}, {monument.state}
                </span>
              </div>
              {monument.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span>{monument.phone}</span>
                </div>
              )}
            </div>

            {monument.website && (
              <a
                href={monument.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition"
              >
                <Globe className="w-5 h-5" />
                Visit Website
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {monument.description && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {monument.description}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Timings & Best Time to Visit
              </h2>
              <div className="space-y-3">
                {monument.openingtime && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Opening Time
                      </p>
                      <p className="text-gray-700">{monument.openingtime}</p>
                    </div>
                  </div>
                )}
                {monument.clossingtime && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Closing Time
                      </p>
                      <p className="text-gray-700">{monument.clossingtime}</p>
                    </div>
                  </div>
                )}
                {monument.weeklyoff && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-gray-200 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Weekly Off</p>
                      <p className="text-gray-700">{monument.weeklyoff}</p>
                    </div>
                  </div>
                )}
                {monument.besttime && (
                  <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Best Time to Visit
                      </p>
                      <p className="text-gray-700">{monument.besttime}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {monument.entryFees && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  ₹ Entry Fees
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {monument.entryFees.indianAdult > 0 && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Indian Adult</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{monument.entryFees.indianAdult}
                      </p>
                    </div>
                  )}
                  {monument.entryFees.foreignAdult > 0 && (
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <p className="text-sm text-gray-600">Foreign Adult</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{monument.entryFees.foreignAdult}
                      </p>
                    </div>
                  )}
                  {monument.entryFees.indianChild > 0 && (
                    <div className="p-4 bg-orange-100 rounded-lg">
                      <p className="text-sm text-gray-600">Indian Child</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{monument.entryFees.indianChild}
                      </p>
                    </div>
                  )}
                  {monument.entryFees.foreignChild > 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-600">Foreign Child</p>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{monument.entryFees.foreignChild}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {monument.connectivity && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  How to Reach
                </h2>
                <div className="space-y-4">
                  {monument.connectivity.road && (
                    <div className="flex items-start gap-3">
                      <Car className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          By Road
                        </p>
                        <p className="text-gray-700">
                          {monument.connectivity.road}
                        </p>
                      </div>
                    </div>
                  )}
                  {monument.connectivity.rail && (
                    <div className="flex items-start gap-3">
                      <Train className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          By Train
                        </p>
                        <p className="text-gray-700">
                          {monument.connectivity.rail}
                        </p>
                      </div>
                    </div>
                  )}
                  {monument.connectivity.air && (
                    <div className="flex items-start gap-3">
                      <Plane className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          By Air
                        </p>
                        <p className="text-gray-700">
                          {monument.connectivity.air}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {monument.location && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-orange-600" />
                  Location
                </h3>
                {monument.location.googleMapUrl && (
                  <a
                    href={monument.location.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-3 rounded-lg font-semibold transition mb-3"
                  >
                    Open in Google Maps
                  </a>
                )}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <span className="font-medium">Latitude:</span>{' '}
                    {monument.location.latitude}
                  </p>
                  <p>
                    <span className="font-medium">Longitude:</span>{' '}
                    {monument.location.longitude}
                  </p>
                </div>
              </div>
            )}

            {monument.weather && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-orange-600" />
                  Weather Info
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">
                      Temperature Range
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {monument.weather.temperature}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <p className="text-xs text-gray-600">Summer</p>
                      <p className="font-bold text-orange-600">
                        {monument.weather.humiditySummer}%
                      </p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <p className="text-xs text-gray-600">Winter</p>
                      <p className="font-bold text-amber-600">
                        {monument.weather.humidityWinter}%
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <p className="text-xs text-gray-600">Monsoon</p>
                      <p className="font-bold text-yellow-600">
                        {monument.weather.humidityMonsoon}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {nearbyMonuments.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Nearby Attractions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyMonuments.map((nearby) => (
                <div
                  key={nearby.slug}
                  onClick={() =>
                    router.push(`/destinations/${nearby.stateSlug}/${nearby.citySlug}/${nearby.slug}`)
                  }
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-100 hover:-translate-y-2 duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100">
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-16 h-16 text-orange-300/50" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
                      {nearby.monumentName}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {nearby.typeofPlace?.replace(/-/g, ' ')}
                    </p>
                    {nearby.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">
                          {nearby.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}