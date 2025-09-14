import React, { useState } from 'react';
import classNames from 'classnames';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'itinerary', label: 'Itinerary Details' },
    { id: 'inclusions', label: 'Inclusions & Exclusions' },
    { id: 'faq', label: 'General FAQ\'s' },
    { id: 'booking', label: 'Booking Policy' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="flex w-full border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={classNames(
            'px-6 py-3 text-base font-medium whitespace-nowrap',
            {
              'text-[#FF8B02] border-b-2 border-[#FF8B02]': activeTab === tab.id,
              'text-gray-500 hover:text-gray-700': activeTab !== tab.id
            }
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;