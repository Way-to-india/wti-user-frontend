'use client';
import React, { useState } from 'react';
import HotelSearchTab from '@/components/features/search/HotelSearchTab';
import ToursSearchTab from '@/components/features/search/ToursSearchTab';
import TransportSearchTab from '@/components/features/search/TransportSearchTab';
import { Card } from '@/components/ui';
import { cn } from '@/utils/classNames';

type SearchTabType = 'hotels' | 'tours' | 'transport';

const SearchSection = () => {
  const [selectedTab, setSelectedTab] = useState<SearchTabType>('tours');

  const tabs = [
    { id: 'tours' as const, label: 'Tours/Packages', icon: '🎒' },
    { id: 'hotels' as const, label: 'Hotels', icon: '🏨' },
    { id: 'transport' as const, label: 'Transportation', icon: '🚗' },
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
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-4 sm:mb-6">
        <div className="inline-flex bg-white rounded-lg shadow-lg p-1 border border-gray-200 w-full max-w-full sm:max-w-fit overflow-x-auto">
          <div className="flex min-w-full sm:min-w-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  'flex items-center gap-1 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-initial justify-center',
                  selectedTab === tab.id
                    ? 'bg-carrot-orange text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <span className="text-sm sm:text-base">{tab.icon}</span>
                <span className="ml-1 sm:ml-0">
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === 'hotels' && 'Hotels'}
                    {tab.id === 'tours' && 'Tours'}
                    {tab.id === 'transport' && 'Transport'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <Card className="p-3 sm:p-4 lg:p-6 shadow-lg">{renderTabContent()}</Card>
    </div>
  );
};

export default SearchSection;
