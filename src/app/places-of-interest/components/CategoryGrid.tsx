// app/places-of-interest/components/CategoryGrid.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/lib/api/places-of-interest.api';

interface CategoryGridProps {
    categories: Category[];
}

const categoryIcons: Record<string, string> = {
    temple: '🛕',
    'religious-site': '🛕',
    fort: '🏰',
    museum: '🏛️',
    beach: '🏖️',
    'park': '🌳',
    'parkgarden': '🌳',
    wildlife: '🦁',
    'historical-monument': '🏛️',
    'heritage-site': '🏺',
    monumentsite: '🗿',
    hillmountain: '⛰️',
    'water-body': '💧',
    unknown: '📍',
};

const categoryColors: Record<string, string> = {
    temple: 'from-orange-400 to-orange-500',
    'religious-site': 'from-orange-400 to-orange-500',
    fort: 'from-red-400 to-red-500',
    museum: 'from-purple-400 to-purple-500',
    beach: 'from-blue-400 to-blue-500',
    park: 'from-green-400 to-green-500',
    parkgarden: 'from-green-400 to-green-500',
    wildlife: 'from-yellow-400 to-yellow-500',
    'historical-monument': 'from-indigo-400 to-indigo-500',
    'heritage-site': 'from-pink-400 to-pink-500',
    monumentsite: 'from-gray-400 to-gray-500',
    hillmountain: 'from-teal-400 to-teal-500',
    'water-body': 'from-cyan-400 to-cyan-500',
    unknown: 'from-gray-300 to-gray-400',
};

export function CategoryGrid({ categories }: CategoryGridProps) {
    const router = useRouter();

    const getCategoryIcon = (categorySlug: string): string => {
        return categoryIcons[categorySlug] || categoryIcons.unknown;
    };

    const getCategoryColor = (categorySlug: string): string => {
        return categoryColors[categorySlug] || categoryColors.unknown;
    };

    const handleCategoryClick = (categorySlug: string) => {
        router.push(`/places-of-interest/category/${categorySlug}`);
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore by Category</h2>
                <p className="text-gray-600">Discover places based on your interests</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <button
                        key={category.slug}
                        onClick={() => handleCategoryClick(category.slug)}
                        className="group relative bg-gradient-to-br from-gray-50 to-gray-100 hover:from-white hover:to-gray-50 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl border border-gray-200"
                    >
                        <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform">
                            {getCategoryIcon(category.slug)}
                        </div>
                        <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 capitalize">
                            {category.name.replace(/-/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                            {category.monumentCount} places
                        </p>

                        {/* Decorative gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category.slug)} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`}></div>
                    </button>
                ))}
            </div>
        </div>
    );
}