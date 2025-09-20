'use client';
import React, { useState } from 'react';
import HotelSearchTab from '@/components/features/search/HotelSearchTab';
import ToursSearchTab from '@/components/features/search/ToursSearchTab';
import TransportSearchTab from '@/components/features/search/TransportSearchTab';
import { Card } from '@/components/ui';
import { cn } from '@/utils/classNames';

type SearchTabType = 'hotels' | 'tours' | 'transport';

const SearchSection = () => {
  const [selectedTab, setSelectedTab] = useState<SearchTabType>('hotels');

  const tabs = [
    { id: 'hotels' as const, label: 'Hotels', icon: '🏨' },
    { id: 'tours' as const, label: 'Tours/Packages', icon: '🎒' },
    { id: 'transport' as const, label: 'Transportation', icon: '🚗' }
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'hotels':
        return <HotelSearchTab />;
      case 'tours':
        return <ToursSearchTab />;
      case 'transport':
        return <TransportSearchTab />;
      default:
        return <HotelSearchTab />;
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Tab Headers */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white rounded-lg shadow-lg p-1 border border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm',
                selectedTab === tab.id
                  ? 'bg-carrot-orange text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Form */}
      <Card className="p-6 shadow-lg">
        {renderTabContent()}
      </Card>
    </div>
  );
};

export default SearchSection;
