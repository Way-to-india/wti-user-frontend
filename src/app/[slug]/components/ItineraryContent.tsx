import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

interface ItineraryContentProps {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  tourDetails: any;
  onOpenChangeModal: (type: 'hotel' | 'transport') => void;
}

const ItineraryContent: React.FC<ItineraryContentProps> = ({
  selectedDay,
  setSelectedDay,
  tourDetails,
  onOpenChangeModal,
}) => {
  const theme = useTheme();

  const findItineraryByDay = (day: number) => {
    return tourDetails?.itinerary?.find((item: any) => item.day === day);
  };

  const getAvailableDays = () => {
    if (!tourDetails?.itinerary?.length) {
      return [];
    }
    return [...tourDetails.itinerary]
      .sort((a: any, b: any) => a.day - b.day)
      .map((item: any) => item.day);
  };

  const getDayLabel = (day: number) => {
    return `DAY ${day}`;
  };

  const currentItinerary = findItineraryByDay(selectedDay);
  const availableDays = getAvailableDays();

  return (
    <div>
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8">
        Itinerary Details
      </h2>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <div
          className={`
            flex lg:flex-col gap-2 min-w-[80px] lg:border-dashed lg:border-gray-300 lg:pr-6
            ${
              availableDays.length > 7
                ? 'max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-gray-200'
                : ''
            }
          `}
        >
          <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
            {availableDays.length > 0
              ? availableDays.map((day: number) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium text-left whitespace-nowrap ${
                      selectedDay === day
                        ? 'bg-orange-500 text-white rounded-md'
                        : 'text-gray-500 hover:text-orange-500'
                    }`}
                  >
                    {getDayLabel(day)}
                  </button>
                ))
              : tourDetails?.duration?.days &&
                Array.from({ length: tourDetails.duration.days }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setSelectedDay(i + 1)}
                    className={`px-3 py-2 text-xs sm:text-sm font-medium text-left whitespace-nowrap ${
                      selectedDay === i + 1
                        ? 'bg-orange-500 text-white rounded-md'
                        : 'text-gray-500 hover:text-orange-500'
                    }`}
                  >
                    DAY {i + 1}
                  </button>
                ))}
          </div>
        </div>

        <div className="flex-1">
          <PlanOfActionCard
            currentItinerary={currentItinerary}
            selectedDay={selectedDay}
            tourDetails={tourDetails}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
};
interface CardProps {
  currentItinerary?: any;
  selectedDay?: number;
  tourDetails: any;
  theme: any;
  onOpenChangeModal?: (type: 'hotel' | 'transport') => void;
}

const PlanOfActionCard: React.FC<CardProps> = ({
  currentItinerary,
  selectedDay,
  tourDetails,
  theme,
}) => (
  <div className="bg-white rounded-lg border shadow-sm">
    <h3
      className="text-sm font-medium p-4 border-b"
      style={{
        color: theme.colors.heavyMetal,
      }}
    >
      PLAN OF ACTION
    </h3>
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="w-full sm:w-72 h-48 rounded-lg overflow-hidden border flex-shrink-0">
          <Image
            src={
              currentItinerary?.plan_of_action?.image_url ||
              tourDetails?.imageUrls?.[selectedDay! % tourDetails?.imageUrls?.length] ||
              '/placeholder-image.jpg'
            }
            alt={`Day ${selectedDay} Location`}
            width={288}
            height={192}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <h4
            className="text-base sm:text-lg font-medium mb-3"
            style={{
              color: theme.colors.heavyMetal,
            }}
          >
            {currentItinerary?.plan_of_action?.title || `Day ${selectedDay} Activities`}
          </h4>
          <p
            className="text-sm sm:text-base leading-relaxed flex-1"
            style={{
              color: theme.colors.heavyMetal + '90',
            }}
          >
            {currentItinerary?.plan_of_action?.description ||
              `Activities and description for Day ${selectedDay}. This will be replaced with actual content for each day of the tour.`}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ItineraryContent;