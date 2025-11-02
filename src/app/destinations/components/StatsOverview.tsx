import React from 'react';
import { MapPin, Building2, Mountain, Tag } from 'lucide-react';
import { Statistics } from '@/lib/api/places-of-interest.api';

interface StatsOverviewProps {
    statistics: Statistics;
}

export function StatsOverview({ statistics }: StatsOverviewProps) {
    const stats = [
        {
            label: 'States & UTs',
            value: statistics.totalStates,
            icon: MapPin,
        },
        {
            label: 'Cities',
            value: statistics.totalCities,
            icon: Building2,
        },
        {
            label: 'Monuments',
            value: statistics.totalMonuments,
            icon: Mountain,
        },
        {
            label: 'Categories',
            value: statistics.totalCategories,
            icon: Tag,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-orange-100 p-3 rounded-xl shadow-md">
                            <stat.icon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900 group-hover:scale-110 transition-transform">
                                {stat.value}+
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}
