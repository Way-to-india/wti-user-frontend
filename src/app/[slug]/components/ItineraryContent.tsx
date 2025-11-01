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
        fontFamily: theme.typography.fontFamily.bold,
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
              fontFamily: theme.typography.fontFamily.bold,
            }}
          >
            {currentItinerary?.plan_of_action?.title || `Day ${selectedDay} Activities`}
          </h4>
          <p
            className="text-sm sm:text-base leading-relaxed flex-1"
            style={{
              color: theme.colors.heavyMetal + '90',
              fontFamily: theme.typography.fontFamily.regular,
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

// const HotelInformationCard: React.FC<CardProps> = ({
//   currentItinerary,
//   selectedDay,
//   tourDetails,
//   onOpenChangeModal,
//   theme,
// }) => (
//   <div className="mt-6">
//     <div className="bg-white rounded-lg border shadow-sm">
//       <h3
//         className="text-sm font-medium p-4 border-b"
//         style={{
//           color: theme.colors.heavyMetal,
//           fontFamily: theme.typography.fontFamily.bold,
//         }}
//       >
//         HOTEL INFORMATION
//         <button
//           className="float-right text-sm font-medium"
//           style={{ color: theme.colors.carrotOrange }}
//           onClick={() => onOpenChangeModal && onOpenChangeModal('hotel')}
//         >
//           Change
//         </button>
//       </h3>
//       <div className="p-4 sm:p-6">
//         <p className="text-sm mb-4" style={{ color: theme.colors.heavyMetal }}>
//           1 night stay in {currentItinerary?.accommodation?.location || 'Hotel Location'}
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//           <div className="w-full sm:w-72 h-48 rounded-lg overflow-hidden border flex-shrink-0">
//             <Image
//               src={
//                 currentItinerary?.accommodation?.image ||
//                 tourDetails?.imageUrls?.[0] ||
//                 '/placeholder-hotel.jpg'
//               }
//               alt="Hotel"
//               width={288}
//               height={192}
//               className="object-cover w-full h-full"
//             />
//           </div>
//           <div className="flex-1">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
//               <h3
//                 className="text-lg sm:text-xl font-medium"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 {currentItinerary?.accommodation?.name || 'Hotel Name'}
//               </h3>
//               <div className="flex items-center gap-1">
//                 <FiStar className="w-4 h-4" style={{ color: theme.colors.carrotOrange }} />
//                 <span className="text-sm" style={{ color: theme.colors.heavyMetal }}>
//                   {currentItinerary?.accommodation?.rating || 4.5} Ratings
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-3 mb-6">
//               <div
//                 className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 <FiUsers className="w-4 h-4" style={{ color: theme.colors.heavyMetal + '60' }} />
//                 {currentItinerary?.accommodation?.capacity || '2-3'} Guests
//               </div>
//               <div
//                 className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 <FiHome className="w-4 h-4" style={{ color: theme.colors.heavyMetal + '60' }} />
//                 {currentItinerary?.accommodation?.roomSize || '150'} sq.ft
//               </div>
//               <div
//                 className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 <FiStar className="w-4 h-4" style={{ color: theme.colors.heavyMetal + '60' }} />
//                 {currentItinerary?.accommodation?.starRating || '4'} Star
//               </div>
//               <div
//                 className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 <FiMapPin className="w-4 h-4" style={{ color: theme.colors.heavyMetal + '60' }} />
//                 {currentItinerary?.accommodation?.location || 'Location'}
//               </div>
//             </div>
//             <div>
//               <p className="text-sm mb-2" style={{ color: theme.colors.heavyMetal }}>
//                 {currentItinerary?.accommodation?.roomType || 'Standard Room'} x 1
//               </p>
//               <h4 className="text-sm font-medium mb-2" style={{ color: theme.colors.heavyMetal }}>
//                 Amenities
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {currentItinerary?.accommodation?.amenities ? (
//                   currentItinerary.accommodation.amenities.map((amenity: string, index: number) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                       style={{ color: theme.colors.heavyMetal }}
//                     >
//                       {amenity}
//                     </div>
//                   ))
//                 ) : (
//                   <>
//                     <div
//                       className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                       style={{ color: theme.colors.heavyMetal }}
//                     >
//                       <FiCoffee
//                         className="w-4 h-4"
//                         style={{ color: theme.colors.heavyMetal + '60' }}
//                       />
//                       Only Breakfast
//                     </div>
//                     <div
//                       className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                       style={{ color: theme.colors.heavyMetal }}
//                     >
//                       Comfortable bedding and linens
//                     </div>
//                     <div
//                       className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                       style={{ color: theme.colors.heavyMetal }}
//                     >
//                       Private Bathroom
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const TransportationInformationCard: React.FC<CardProps> = ({
//   currentItinerary,
//   selectedDay,
//   tourDetails,
//   onOpenChangeModal,
//   theme,
// }) => (
//   <div className="mt-6">
//     <div className="bg-white rounded-lg border shadow-sm">
//       <h3
//         className="text-sm font-medium p-4 border-b"
//         style={{
//           color: theme.colors.heavyMetal,
//           fontFamily: theme.typography.fontFamily.bold,
//         }}
//       >
//         TRANSPORTATION INFORMATION
//         <button
//           className="float-right text-sm font-medium"
//           style={{ color: theme.colors.carrotOrange }}
//           onClick={() => onOpenChangeModal && onOpenChangeModal('transport')}
//         >
//           Change
//         </button>
//       </h3>
//       <div className="p-4 sm:p-6">
//         <p className="text-sm mb-4" style={{ color: theme.colors.heavyMetal }}>
//           {currentItinerary?.transportation?.route || 'Transport Route'}
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//           <div className="w-full sm:w-72 h-48 rounded-lg overflow-hidden border flex-shrink-0">
//             <Image
//               src={
//                 currentItinerary?.transportation?.image ||
//                 tourDetails?.imageUrls?.[0] ||
//                 '/placeholder-transport.jpg'
//               }
//               alt="Transportation"
//               width={288}
//               height={192}
//               className="object-cover w-full h-full"
//             />
//           </div>
//           <div className="flex-1">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
//               <h3
//                 className="text-lg sm:text-xl font-medium"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 {currentItinerary?.transportation?.type || 'Volvo'}
//               </h3>
//               <div className="flex items-center gap-1">
//                 <FiStar className="w-4 h-4" style={{ color: theme.colors.carrotOrange }} />
//                 <span className="text-sm" style={{ color: theme.colors.heavyMetal }}>
//                   {currentItinerary?.transportation?.rating || 4.5} Ratings
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-3 mb-6">
//               <div
//                 className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 <FiUsers className="w-4 h-4" style={{ color: theme.colors.heavyMetal + '60' }} />
//                 {currentItinerary?.transportation?.capacity || '24'} Passengers
//               </div>
//               <div
//                 className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                 style={{ color: theme.colors.heavyMetal }}
//               >
//                 <FiTruck className="w-4 h-4" style={{ color: theme.colors.heavyMetal + '60' }} />
//                 {currentItinerary?.transportation?.category || 'Public Transport'}
//               </div>
//               {currentItinerary?.transportation?.pickupLocation && (
//                 <div
//                   className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                   style={{ color: theme.colors.carrotOrange }}
//                 >
//                   <FiMapPin className="w-4 h-4" style={{ color: theme.colors.carrotOrange }} />
//                   Pick up from {currentItinerary.transportation.pickupLocation}
//                 </div>
//               )}
//               {currentItinerary?.transportation?.pickupTime && (
//                 <div
//                   className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                   style={{ color: theme.colors.carrotOrange }}
//                 >
//                   <FiClock className="w-4 h-4" style={{ color: theme.colors.carrotOrange }} />
//                   {currentItinerary.transportation.pickupTime}
//                 </div>
//               )}
//             </div>
//             <div>
//               <p className="text-sm font-medium mb-2" style={{ color: theme.colors.heavyMetal }}>
//                 {currentItinerary?.transportation?.features?.[0] || 'A/C Semi Sleeper'}
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {currentItinerary?.transportation?.features ? (
//                   currentItinerary.transportation.features
//                     .slice(1)
//                     .map((feature: string, index: number) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                         style={{ color: theme.colors.heavyMetal }}
//                       >
//                         {feature}
//                       </div>
//                     ))
//                 ) : (
//                   <>
//                     <div
//                       className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                       style={{ color: theme.colors.heavyMetal }}
//                     >
//                       Reclining Chair
//                     </div>
//                     <div
//                       className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
//                       style={{ color: theme.colors.heavyMetal }}
//                     >
//                       Water Bottle
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

export default ItineraryContent;
