import React from 'react';
import { InclusionsExclusions } from '@/components/tours/InclusionsExclusions';
import { FAQSection } from '@/components/tours/FAQSection';
import { BookingPolicy } from '@/components/tours/BookingPolicy';
import ItineraryContent from './ItineraryContent';

interface TourTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  tourDetails: any;
  onOpenChangeModal: (type: 'hotel' | 'transport') => void;
}

const TourTabs: React.FC<TourTabsProps> = ({
  activeTab,
  setActiveTab,
  selectedDay,
  setSelectedDay,
  tourDetails,
  onOpenChangeModal,
}) => {
  const tabsConfig = [
    { name: 'Itinerary Details', key: 'itinerary' },
    { name: 'Inclusions & Exclusions', key: 'inclusions' },
    { name: "General FAQ's", key: 'faq' },
    { name: 'Booking Policy', key: 'policy' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'itinerary':
        return (
          <ItineraryContent
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            tourDetails={tourDetails}
            onOpenChangeModal={onOpenChangeModal}
          />
        );
      case 'inclusions':
        return (
          <InclusionsExclusions
            inclusions={tourDetails?.inclusions || []}
            exclusions={tourDetails?.exclusions || []}
          />
        );
      case 'faq':
        return <FAQSection faqs={tourDetails?.faqs || []} />;
      case 'policy':
        return (
          <BookingPolicy
            cancellationPolicies={tourDetails?.cancellationPolicies || []}
            termsAndConditions={tourDetails?.termsAndConditions || []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex gap-4">
          {tabsConfig.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="py-6">{renderTabContent()}</div>
    </>
  );
};

export default TourTabs;
