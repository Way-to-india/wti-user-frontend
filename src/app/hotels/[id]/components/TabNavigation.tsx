import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabClick: (tab: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabClick }) => {
  const tabs = ['rooms', 'location', 'property rules', 'similar properties'];

  return (
    <div className="border-b border-gray-200 mt-8">
      <div className="flex overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => onTabClick(tab)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap
              ${
                activeTab === tab
                  ? 'border-b-2 border-[#FF8B02] text-[#FF8B02]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
