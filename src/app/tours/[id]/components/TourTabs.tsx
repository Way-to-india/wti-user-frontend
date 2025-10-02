import React from 'react';
import { InclusionsExclusions } from '@/components/tours/InclusionsExclusions';
import { BookingPolicy } from '@/components/tours/BookingPolicy';
import ItineraryContent from './ItineraryContent';
import TravelTipsSection from './TravelTips';
import OverViewTab from './OverViewTab';
import PriceGuideDetail from './PriceGuide';
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
    { name: 'Overview', key: 'overview' },
    { name: 'Itinerary Details', key: 'itinerary' },
    { name: 'Price Guide', key: 'price-guide' },
    { name: 'Inclusions & Exclusions', key: 'inclusions' },
    { name: 'Travel Tips For This Tour', key: 'travel-tips' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverViewTab name={tourDetails.title} overview={tourDetails.overview} />;
      case 'itinerary':
        return (
          <ItineraryContent
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            tourDetails={tourDetails}
            onOpenChangeModal={onOpenChangeModal}
          />
        );
      case 'price-guide':
        return <PriceGuideDetail priceGuide={tourDetails?.price_guide || []} />;
      case 'inclusions':
        return (
          <InclusionsExclusions
            inclusions={tourDetails?.inclusions || []}
            exclusions={tourDetails?.exclusions || []}
          />
        );
      // case 'faq':
      //   return <FAQSection faqs={tourDetails?.faqs || []} />;
      case 'policy':
        return (
          <BookingPolicy
            cancellationPolicies={tourDetails?.cancellationPolicies || []}
            termsAndConditions={tourDetails?.termsAndConditions || []}
          />
        );
      case 'travel-tips':
        return (
          <TravelTipsSection name={tourDetails.title} travelTips={tourDetails?.travel_tips || []} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {tabsConfig.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
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
