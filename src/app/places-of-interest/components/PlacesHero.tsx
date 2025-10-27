// app/places-of-interest/components/PlacesHero.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';

export function PlacesHero() {
    return (
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

            <div className="relative z-10 max-w-4xl">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-6 h-6" />
                    <span className="text-blue-200 font-medium">Explore India</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                    Discover India's Rich Heritage
                </h1>

                <p className="text-lg lg:text-xl text-blue-100 leading-relaxed max-w-3xl">
                    Explore magnificent monuments, ancient temples, historic forts, and breathtaking natural
                    wonders across India. From UNESCO World Heritage Sites to hidden gems, embark on a
                    journey through time and culture spanning over 5000 years of history.
                </p>
            </div>
        </div>
    );
}