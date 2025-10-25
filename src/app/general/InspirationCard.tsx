'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiStar, FiClock, FiArrowRight } from 'react-icons/fi';

interface InspirationTour {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    url: string;
    duration: string;
    rating: number;
}

interface InspirationCardProps {
    tour: InspirationTour;
}

const InspirationCard: React.FC<InspirationCardProps> = ({ tour }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(tour.url);
    };

    return (
        <div
            className="group bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-700"
            onClick={handleClick}
        >
            <div className="relative h-52 w-full overflow-hidden">
                <Image
                    src={tour.imageUrl}
                    alt={tour.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                <div className="absolute top-3 right-3 bg-gray-900/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg border border-gray-700">
                    <FiStar className="text-yellow-400 text-sm" />
                    <span className="text-sm font-semibold text-white">{tour.rating}</span>
                </div>

                <div className="absolute top-3 left-3 bg-orange-500/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg">
                    <FiClock className="text-white text-sm" />
                    <span className="text-xs font-semibold text-white">{tour.duration}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-lg text-white line-clamp-2 drop-shadow-lg">
                        {tour.title}
                    </h3>
                </div>
            </div>

            <div className="p-4">
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {tour.description}
                </p>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300">
                    <span>Explore Tour</span>
                    <FiArrowRight className="text-sm" />
                </button>
            </div>
        </div>
    );
};

export default InspirationCard;