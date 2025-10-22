import React from 'react';
import { InclusionsExclusions } from '@/components/tours/InclusionsExclusions';
import { BookingPolicy } from '@/components/tours/BookingPolicy';
import ItineraryContent from './ItineraryContent';
import TravelTipsSection from './TravelTips';
import OverViewTab from './OverViewTab';
import TourReviews from './TourReviews';
import WhatsAppContactPage from './WhatsappContactPage';
import TourFAQ from './TourFAQ';

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
    { name: 'Inclusions & Exclusions', key: 'inclusions' },
    { name: 'FAQ', key: 'faq', badge: tourDetails?.faq?.faqs?.length },
    { name: 'Travel Tips For This Tour', key: 'travel-tips' },
    { name: 'Reviews', key: 'reviews' },
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
      case 'inclusions':
        return (
          <InclusionsExclusions
            inclusions={tourDetails?.inclusions || []}
            exclusions={tourDetails?.exclusions || []}
          />
        );
      case 'faq':
        return (
          <TourFAQ
            faqs={tourDetails?.faq?.faqs || []}
            tourTitle={tourDetails?.title}
          />
        );
      case 'policy':
        return (
          <BookingPolicy
            title={tourDetails.title}
            cancellationPolicies={tourDetails?.cancellationPolicies || []}
            termsAndConditions={tourDetails?.termsAndConditions || []}
          />
        );
      case 'travel-tips':
        return (
          <TravelTipsSection name={tourDetails.title} travelTips={tourDetails?.travel_tips || []} />
        );
      case 'reviews':
        return <TourReviews tourId={tourDetails.id} />;
      case 'whatsapp':
        return <WhatsAppContactPage />;
      default:
        return null;
    }
  };

  const allTabs = [...tabsConfig, { name: 'WhatsApp', key: 'whatsapp', isWhatsApp: true }];

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-2">
          {allTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-3 lg:px-3 py-3 sm:py-2 sm:text-sm lg:text-md font-semibold rounded-xl whitespace-nowrap transition-colors inline-flex items-center gap-2 shadow-sm ${tab.key === 'whatsapp'
                ? activeTab === tab.key
                  ? 'bg-green-500 text-white'
                  : 'bg-green-500 text-white hover:bg-green-600'
                : activeTab === tab.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50'
                }`}
            >
              {tab.key === 'whatsapp' && (
                <svg className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              )}
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
