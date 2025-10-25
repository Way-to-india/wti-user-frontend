'use client';

import React, { useState } from 'react';
import InspirationCard from './InspirationCard';
import { inspirationData } from '@/helpers/inspiration-data';

const Inspiration: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(inspirationData[0].name);

  const getActiveTours = () => {
    const activeTheme = inspirationData.find(group => group.name === selectedTab);
    return activeTheme?.tours || [];
  };

  return (
    <div className="px-4 my-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-[#FF8B02] text-2xl md:text-3xl font-firaSans font-semibold pb-2 md:pb-0">
          Travel Inspiration
        </h2>
      </div>

      <div className="mb-6">
        <p className="text-[#2D2F37] text-sm md:text-base mb-6">
          Discover handpicked travel experiences curated just for you
        </p>

        <div className="flex flex-wrap gap-3">
          {inspirationData.map(group => (
            <button
              key={group.id}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selectedTab === group.name
                ? 'bg-gradient-to-r from-[#FF8B02] to-[#FF6B02] text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              onClick={() => setSelectedTab(group.name)}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getActiveTours().map(tour => (
          <InspirationCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  );
};

export default Inspiration;