// app/places-of-interest/components/StatesAccordion.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, MapPin, Building2, Search } from 'lucide-react';
import { State } from '@/lib/api/places-of-interest.api';

interface StatesAccordionProps {
    states: State[];
}

export function StatesAccordion({ states }: StatesAccordionProps) {
    const router = useRouter();
    const [openStates, setOpenStates] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');

    const toggleState = (stateSlug: string) => {
        setOpenStates((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(stateSlug)) {
                newSet.delete(stateSlug);
            } else {
                newSet.add(stateSlug);
            }
            return newSet;
        });
    };

    const handleCityClick = (stateSlug: string, citySlug: string) => {
        router.push(`/places-of-interest/${stateSlug}/${citySlug}`);
    };

    const handleStateHeaderClick = (e: React.MouseEvent, stateSlug: string) => {
        e.stopPropagation();
        toggleState(stateSlug);
    };

    const filteredStates = states.filter((state) => {
        const searchLower = searchTerm.toLowerCase();
        const stateMatches = state.name.toLowerCase().includes(searchLower);
        const cityMatches = state.cities?.some((city) =>
            city.name.toLowerCase().includes(searchLower)
        );
        return stateMatches || cityMatches;
    });

    // Filter cities within each state based on search
    const getFilteredCities = (state: State) => {
        if (!searchTerm) return state.cities || [];
        const searchLower = searchTerm.toLowerCase();
        return (
            state.cities?.filter((city) => city.name.toLowerCase().includes(searchLower)) || []
        );
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by State</h2>
                <p className="text-gray-600 mb-6">Select a state to explore cities and monuments</p>

                {/* Search Input */}
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search states or cities..."
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-3">
                {filteredStates.map((state) => {
                    const filteredCities = getFilteredCities(state);
                    const isOpen = openStates.has(state.slug);

                    return (
                        <div
                            key={state.slug}
                            className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 transition-all"
                        >
                            {/* State Header */}
                            <button
                                onClick={(e) => handleStateHeaderClick(e, state.slug)}
                                className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-50/50 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-xl">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-lg font-bold text-gray-900">{state.name}</h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-sm text-gray-600">{state.cityCount} cities</span>
                                            <span className="text-sm text-gray-400">•</span>
                                            <span className="text-sm text-gray-600">
                                                {state.monumentCount} monuments
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronDown
                                    className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Cities Grid */}
                            {isOpen && (
                                <div className="p-5 bg-white border-t-2 border-gray-100 animate-fadeIn">
                                    {filteredCities.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {filteredCities.map((city) => (
                                                <button
                                                    key={city.slug}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCityClick(state.slug, city.slug);
                                                    }}
                                                    className="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-all hover:shadow-md border border-gray-200 hover:border-blue-300"
                                                >
                                                    <div className="bg-white p-2 rounded-lg group-hover:bg-blue-100 transition-colors">
                                                        <Building2 className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                                                    </div>
                                                    <div className="text-left flex-1">
                                                        <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                            {city.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {city.monumentCount} places
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">
                                            No cities found matching "{searchTerm}"
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredStates.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                        <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                            No states or cities found matching "{searchTerm}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}