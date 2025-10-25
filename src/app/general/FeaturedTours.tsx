'use client';

import TourCard from '@/components/tours/TourCard';
import { featuredToursData } from '@/helpers/featured-tour-data';
import { useRouter } from 'next/navigation';
import React from 'react';

const FeaturedTours: React.FC = () => {
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/tours');
  };

  return (
    <div className="mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-[#FF8B02] text-2xl md:text-3xl font-firaSans font-semibold md:pb-0">
          Featured Tours
        </h2>
      </div>

      <div className="mb-6">
        <p className="text-[#2D2F37] text-sm md:text-base">
          Discover our most popular tour packages handpicked for unforgettable adventures across India
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredToursData.map(tour => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={handleViewAll}
          className="px-6 py-2 rounded-md border border-[#FF8B02] text-[#FF8B02] hover:bg-[#FF8B02] hover:text-white transition-all duration-300"
        >
          View All Tours
        </button>
      </div>
    </div>
  );
};

export default FeaturedTours;