'use client';

import { AppDispatch, RootState } from '@/app/redux/store';
import { fetchTourById } from '@/app/redux/toursSlice';
import HotelChangeModalContent from '@/components/TripDetails/HotelChangeModalContent';
import ImageModal from '@/components/TripDetails/ImageModal';
import TransportChangeModalContent from '@/components/TripDetails/TransportChangeModalContent';
import { Rating } from '@/components/common/Rating';
import NavBar from '@/components/navbar/NavBar';
import { BookingPolicy } from '@/components/tours/BookingPolicy';
import EnquireNowModal from '@/components/tours/EnquireNowModal';
import { FAQSection } from '@/components/tours/FAQSection';
import { InclusionsExclusions } from '@/components/tours/InclusionsExclusions';
import { useTheme } from '@/context/ThemeContext';
import Modal from '@/lib/modals/modals';
import { CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FiClock,
  FiCoffee,
  FiHeart,
  FiHome,
  FiMapPin,
  FiShare2,
  FiStar,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

interface TourDetailsProps {
  params: {
    id: string;
  };
}

const TourDetails: React.FC<TourDetailsProps> = ({ params }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDay, setSelectedDay] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const { tourDetails, loading, error } = useSelector((state: RootState) => state.tours);

  // Add new state for image gallery modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Add new state for change modal
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeModalType, setChangeModalType] = useState<'hotel' | 'transport' | null>(null);

  // Add new state for enquiry modal
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);

  // Function to open the modal with a specific image index
  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  // Set selected day to first day when tour details load
  useEffect(() => {
    if (tourDetails?.itinerary && tourDetails.itinerary.length > 0) {
      // Find the minimum day number in the itinerary
      const minDay = Math.min(...tourDetails.itinerary.map(item => item.day));
      setSelectedDay(minDay);
    }
  }, [tourDetails]);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchTourById(params.id));
    }
  }, [params.id, dispatch]);

  // Helper function to find itinerary by day
  const findItineraryByDay = (day: number) => {
    return tourDetails?.itinerary?.find(item => item.day === day);
  };

  // Get sorted array of available days
  const getAvailableDays = () => {
    if (!tourDetails?.itinerary?.length) {
      return [];
    }
    return [...tourDetails.itinerary].sort((a, b) => a.day - b.day).map(item => item.day);
  };

  // Get day label (can be customized based on plan_of_action title)
  const getDayLabel = (day: number) => {
    const itineraryDay = findItineraryByDay(day);
    if (itineraryDay?.plan_of_action?.title) {
      // You could use a shortened version of the title here if desired
      return `DAY ${day}`;
    }
    return `DAY ${day}`;
  };

  // Handler to open modal
  const openChangeModal = (type: 'hotel' | 'transport') => {
    setChangeModalType(type);
    setChangeModalOpen(true);
  };

  // Handler to close modal
  const closeChangeModal = () => {
    setChangeModalOpen(false);
    setChangeModalType(null);
  };

  // Handler to open enquiry modal
  const openEnquireModal = () => {
    setIsEnquireModalOpen(true);
  };

  // Handler to close enquiry modal
  const closeEnquireModal = () => {
    setIsEnquireModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!tourDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">No tour data found</div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'itinerary':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-8">Itinerary Details</h2>
            <div className="flex gap-8">
              <div className="flex flex-col gap-2 min-w-[80px] border-dashed border-gray-300 pr-6">
                {/* Dynamic day selection based on actual itinerary data */}
                {getAvailableDays().map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-2 text-sm font-medium text-left ${
                      selectedDay === day
                        ? 'bg-orange-500 text-white rounded-md'
                        : 'text-gray-500 hover:text-orange-500'
                    }`}
                  >
                    {getDayLabel(day)}
                  </button>
                ))}

                {getAvailableDays().length === 0 &&
                  tourDetails?.duration?.days &&
                  Array.from({ length: tourDetails.duration.days }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setSelectedDay(i + 1)}
                      className={`px-3 py-2 text-sm font-medium text-left ${
                        selectedDay === i + 1
                          ? 'bg-orange-500 text-white rounded-md'
                          : 'text-gray-500 hover:text-orange-500'
                      }`}
                    >
                      DAY {i + 1}
                    </button>
                  ))}
              </div>

              <div className="flex-1">
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
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Image on the left */}
                      <div className="w-72 h-48 rounded-lg overflow-hidden border flex-shrink-0">
                        <Image
                          src={
                            findItineraryByDay(selectedDay)?.plan_of_action?.image_url ||
                            tourDetails?.imageUrls?.[
                              selectedDay % tourDetails?.imageUrls?.length
                            ] ||
                            '/placeholder-image.jpg'
                          }
                          alt={`Day ${selectedDay} Location`}
                          width={288}
                          height={192}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Title and description stacked on the right */}
                      <div className="flex-1 flex flex-col">
                        <h4
                          className="text-lg font-medium mb-3"
                          style={{
                            color: theme.colors.heavyMetal,
                            fontFamily: theme.typography.fontFamily.bold,
                          }}
                        >
                          {findItineraryByDay(selectedDay)?.plan_of_action?.title ||
                            `Day ${selectedDay} Activities`}
                        </h4>

                        <p
                          className="text-sm leading-relaxed flex-1"
                          style={{
                            color: theme.colors.heavyMetal + '90',
                            fontFamily: theme.typography.fontFamily.regular,
                          }}
                        >
                          {findItineraryByDay(selectedDay)?.plan_of_action?.description ||
                            `Activities and description for Day ${selectedDay}. This will be replaced with actual content for each day of the tour.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {(findItineraryByDay(selectedDay)?.hotel_ids?.length ||
                  selectedDay < (tourDetails?.duration?.days || 0)) && (
                  <div className="mt-6">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <h3
                        className="text-sm font-medium p-4 border-b"
                        style={{
                          color: theme.colors.heavyMetal,
                          fontFamily: theme.typography.fontFamily.bold,
                        }}
                      >
                        HOTEL INFORMATION
                        <button
                          className="float-right text-sm font-medium"
                          style={{ color: theme.colors.carrotOrange }}
                          onClick={() => openChangeModal('hotel')}
                        >
                          Change
                        </button>
                      </h3>
                      <div className="p-6">
                        <p className="text-sm mb-4" style={{ color: theme.colors.heavyMetal }}>
                          1 night stay in{' '}
                          {findItineraryByDay(selectedDay)?.accommodation?.location ||
                            'Hotel Location'}
                        </p>
                        <div className="flex gap-6">
                          <div className="w-72 h-48 rounded-lg overflow-hidden border">
                            <Image
                              src={
                                findItineraryByDay(selectedDay)?.accommodation?.image ||
                                tourDetails?.imageUrls?.[0] ||
                                '/placeholder-hotel.jpg'
                              }
                              alt="Hotel"
                              width={288}
                              height={192}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <h3
                                className="text-xl font-medium"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                {findItineraryByDay(selectedDay)?.accommodation?.name ||
                                  'Hotel Name'}
                              </h3>
                              <div className="flex items-center gap-1">
                                <FiStar
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.carrotOrange }}
                                />
                                <span
                                  className="text-sm"
                                  style={{ color: theme.colors.heavyMetal }}
                                >
                                  {findItineraryByDay(selectedDay)?.accommodation?.rating || 4.5}{' '}
                                  Ratings
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-6">
                              <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                <FiUsers
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.heavyMetal + '60' }}
                                />
                                {findItineraryByDay(selectedDay)?.accommodation?.capacity || '2-3'}{' '}
                                Guests
                              </div>
                              <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                <FiHome
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.heavyMetal + '60' }}
                                />
                                {findItineraryByDay(selectedDay)?.accommodation?.roomSize || '150'}{' '}
                                sq.ft
                              </div>
                              <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                <FiStar
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.heavyMetal + '60' }}
                                />
                                {findItineraryByDay(selectedDay)?.accommodation?.starRating || '4'}{' '}
                                Star
                              </div>
                              <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                <FiMapPin
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.heavyMetal + '60' }}
                                />
                                {findItineraryByDay(selectedDay)?.accommodation?.location ||
                                  'Location'}
                              </div>
                            </div>
                            <div>
                              <p
                                className="text-sm mb-2"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                {findItineraryByDay(selectedDay)?.accommodation?.roomType ||
                                  'Standard Room'}{' '}
                                x 1
                              </p>
                              <h4
                                className="text-sm font-medium mb-2"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                Amenities
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {findItineraryByDay(selectedDay)?.accommodation?.amenities ? (
                                  findItineraryByDay(selectedDay)?.accommodation?.amenities.map(
                                    (amenity: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                        style={{ color: theme.colors.heavyMetal }}
                                      >
                                        {amenity}
                                      </div>
                                    )
                                  )
                                ) : (
                                  <>
                                    <div
                                      className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                      style={{ color: theme.colors.heavyMetal }}
                                    >
                                      <FiCoffee
                                        className="w-4 h-4"
                                        style={{ color: theme.colors.heavyMetal + '60' }}
                                      />
                                      Only Breakfast
                                    </div>
                                    <div
                                      className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                      style={{ color: theme.colors.heavyMetal }}
                                    >
                                      Comfortable bedding and linens
                                    </div>
                                    <div
                                      className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                      style={{ color: theme.colors.heavyMetal }}
                                    >
                                      Private Bathroom
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {(findItineraryByDay(selectedDay)?.transportation_ids?.length ||
                  selectedDay === 1) && (
                  <div className="mt-6">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <h3
                        className="text-sm font-medium p-4 border-b"
                        style={{
                          color: theme.colors.heavyMetal,
                          fontFamily: theme.typography.fontFamily.bold,
                        }}
                      >
                        TRANSPORTATION INFORMATION
                        <button
                          className="float-right text-sm font-medium"
                          style={{ color: theme.colors.carrotOrange }}
                          onClick={() => openChangeModal('transport')}
                        >
                          Change
                        </button>
                      </h3>
                      <div className="p-6">
                        <p className="text-sm mb-4" style={{ color: theme.colors.heavyMetal }}>
                          {findItineraryByDay(selectedDay)?.transportation?.route ||
                            'Transport Route'}
                        </p>
                        <div className="flex gap-6">
                          <div className="w-72 h-48 rounded-lg overflow-hidden border">
                            <Image
                              src={
                                findItineraryByDay(selectedDay)?.transportation?.image ||
                                tourDetails?.imageUrls?.[0] ||
                                '/placeholder-transport.jpg'
                              }
                              alt="Transportation"
                              width={288}
                              height={192}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <h3
                                className="text-xl font-medium"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                {findItineraryByDay(selectedDay)?.transportation?.type || 'Volvo'}
                              </h3>
                              <div className="flex items-center gap-1">
                                <FiStar
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.carrotOrange }}
                                />
                                <span
                                  className="text-sm"
                                  style={{ color: theme.colors.heavyMetal }}
                                >
                                  {findItineraryByDay(selectedDay)?.transportation?.rating || 4.5}{' '}
                                  Ratings
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 mb-6">
                              <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                <FiUsers
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.heavyMetal + '60' }}
                                />
                                {findItineraryByDay(selectedDay)?.transportation?.capacity || '24'}{' '}
                                Passengers
                              </div>
                              <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                <FiTruck
                                  className="w-4 h-4"
                                  style={{ color: theme.colors.heavyMetal + '60' }}
                                />
                                {findItineraryByDay(selectedDay)?.transportation?.category ||
                                  'Public Transport'}
                              </div>
                              {findItineraryByDay(selectedDay)?.transportation?.pickupLocation && (
                                <div
                                  className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                  style={{ color: theme.colors.carrotOrange }}
                                >
                                  <FiMapPin
                                    className="w-4 h-4"
                                    style={{ color: theme.colors.carrotOrange }}
                                  />
                                  Pick up from{' '}
                                  {findItineraryByDay(selectedDay)?.transportation?.pickupLocation}
                                </div>
                              )}
                              {findItineraryByDay(selectedDay)?.transportation?.pickupTime && (
                                <div
                                  className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                  style={{ color: theme.colors.carrotOrange }}
                                >
                                  <FiClock
                                    className="w-4 h-4"
                                    style={{ color: theme.colors.carrotOrange }}
                                  />
                                  {findItineraryByDay(selectedDay)?.transportation?.pickupTime}
                                </div>
                              )}
                            </div>
                            <div>
                              <p
                                className="text-sm font-medium mb-2"
                                style={{ color: theme.colors.heavyMetal }}
                              >
                                {findItineraryByDay(selectedDay)?.transportation?.features?.[0] ||
                                  'A/C Semi Sleeper'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {findItineraryByDay(selectedDay)?.transportation?.features ? (
                                  findItineraryByDay(selectedDay)
                                    ?.transportation?.features.slice(1)
                                    .map((feature: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                        style={{ color: theme.colors.heavyMetal }}
                                      >
                                        {feature}
                                      </div>
                                    ))
                                ) : (
                                  <>
                                    <div
                                      className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                      style={{ color: theme.colors.heavyMetal }}
                                    >
                                      Reclining Chair
                                    </div>
                                    <div
                                      className="flex items-center gap-2 px-3 py-1 rounded-full border text-sm"
                                      style={{ color: theme.colors.heavyMetal }}
                                    >
                                      Water Bottle
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Inclusions & Exclusions Section */}
                {tourDetails?.inclusions && tourDetails?.inclusions?.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <h3
                        className="text-sm font-medium p-4 border-b"
                        style={{
                          color: theme.colors.heavyMetal,
                          fontFamily: theme.typography.fontFamily.bold,
                        }}
                      >
                        INCLUSIONS
                      </h3>
                      <div className="p-6">
                        <div className="space-y-4">
                          {tourDetails.inclusions.map((inclusion, index) => (
                            <div key={index} className="pb-3 last:pb-0">
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <h4
                                    className="font-medium text-sm mb-1"
                                    style={{ color: theme.colors.heavyMetal }}
                                  >
                                    {inclusion.title}:
                                  </h4>
                                  <p
                                    className="text-sm"
                                    style={{ color: theme.colors.heavyMetal + '90' }}
                                  >
                                    {inclusion.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Fallback if inclusions have missing titles/descriptions */}
                          {tourDetails.inclusions.length > 0 &&
                            !tourDetails.inclusions[0].title && (
                              <div className="pb-3">
                                <p
                                  className="text-sm"
                                  style={{ color: theme.colors.heavyMetal + '90' }}
                                >
                                  {Array.isArray(tourDetails?.inclusions)
                                    ? tourDetails.inclusions
                                        .map(inc =>
                                          typeof inc === 'string'
                                            ? inc
                                            : inc.title || inc.description || ''
                                        )
                                        .join(', ')
                                    : ''}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {tourDetails?.exclusions && tourDetails?.exclusions?.length > 0 && (
                  <div className="mt-6">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <h3
                        className="text-sm font-medium p-4 border-b"
                        style={{
                          color: theme.colors.heavyMetal,
                          fontFamily: theme.typography.fontFamily.bold,
                        }}
                      >
                        EXCLUSIONS
                      </h3>
                      <div className="p-6">
                        <div className="space-y-4">
                          {Array.isArray(tourDetails.exclusions) ? (
                            tourDetails.exclusions.map((exclusion, index) => (
                              <div key={index} className="pb-3 last:pb-0">
                                <div className="flex items-start">
                                  <div className="flex-1">
                                    {typeof exclusion === 'object' && exclusion?.title ? (
                                      <>
                                        <h4
                                          className="font-medium text-sm mb-1"
                                          style={{ color: theme.colors.heavyMetal }}
                                        >
                                          {exclusion?.title}:
                                        </h4>
                                        <p
                                          className="text-sm"
                                          style={{ color: theme.colors.heavyMetal + '90' }}
                                        >
                                          {exclusion?.description}
                                        </p>
                                      </>
                                    ) : (
                                      <p
                                        className="text-sm"
                                        style={{ color: theme.colors.heavyMetal + '90' }}
                                      >
                                        {exclusion}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p
                              className="text-sm"
                              style={{ color: theme.colors.heavyMetal + '90' }}
                            >
                              {tourDetails.exclusions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {/* Image modal component */}
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={tourDetails?.imageUrls || []}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />{' '}
      <Modal modalOpen={changeModalOpen} handleClose={closeChangeModal} className="p-0" drawer>
        {changeModalType === 'hotel' && <HotelChangeModalContent onClose={closeChangeModal} />}
        {changeModalType === 'transport' && (
          <TransportChangeModalContent onClose={closeChangeModal} />
        )}
      </Modal>
      {/* Enquire Now Modal */}
      <EnquireNowModal
        isOpen={isEnquireModalOpen}
        onClose={() => setIsEnquireModalOpen(false)}
        tourName={tourDetails?.title || 'Tour Name'}
        tourCategory={tourDetails?.theme?.name}
        tourImage={tourDetails?.imageUrls?.[0] || '/assets/images/tours/valley-of-flowers.jpg'}
        tourRating={tourDetails?.rating || 4.5}
      />
      <div className="bg-white py-2 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-orange-500">
              Home
            </Link>
            <span className="text-gray-400">--&gt;</span>
            <Link href="/tours" className="text-gray-600 hover:text-orange-500">
              Tours
            </Link>
            <span className="text-gray-400">--&gt;</span>
            <span className="text-orange-500">{tourDetails?.title || 'Tour Details'}</span>
          </nav>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-6">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden mb-3">
              <Image
                src={tourDetails?.imageUrls?.[0] || '/placeholder-image.jpg'}
                alt={tourDetails?.title || 'Tour Image'}
                fill
                className="object-cover cursor-pointer"
                onClick={() => tourDetails?.imageUrls?.length > 0 && openImageModal(0)}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {tourDetails?.imageUrls?.slice(1, 4).map((url: string, index: number) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(index + 1)}
                >
                  <Image
                    src={url}
                    alt={`${tourDetails.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                  {index === 2 && tourDetails.imageUrls.length > 4 && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                      onClick={e => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        openImageModal(3);
                      }}
                    >
                      <span className="text-white text-lg font-medium">
                        +{tourDetails.imageUrls.length - 4} images
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex justify-between items-start mb-3">
              <h1 className="text-3xl font-bold" style={{ color: theme.colors.heavyMetal }}>
                {tourDetails?.title || 'Tour Title'}
              </h1>
              <button className="p-2 rounded-full bg-orange-500 text-white">
                <FiShare2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1 bg-orange-50 text-orange-500 rounded-full text-sm border border-orange-200">
                {tourDetails?.theme?.name || 'Tour Category'}
              </span>
              <div className="flex items-center gap-2">
                <Rating value={tourDetails?.rating || 4.5} />
                <span className="text-sm text-gray-500">{tourDetails?.rating || 4.5} Ratings</span>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg">
                    <FiClock className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium text-sm">
                      {tourDetails?.duration?.nights || 0} Nights/{tourDetails?.duration?.days || 0}{' '}
                      Days
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg">
                    <FiMapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Starting From</p>
                    <p className="font-medium text-sm">
                      {tourDetails?.startingLocation || 'Delhi'}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg">
                    <FiHeart className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Best Time</p>
                    <p className="font-medium text-sm">{tourDetails?.bestTime || 'Year-round'}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg">
                    <FiUsers className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Ideal For</p>
                    <p className="font-medium text-sm">
                      {tourDetails?.idealFor || 'Friends/Couples'}
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 border flex items-center gap-2">
                  <div className="p-1.5 bg-orange-50 rounded-lg">
                    <FiHome className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cities Covering</p>
                    <p className="font-medium text-sm">{tourDetails?.city_ids?.length || '1'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tourDetails?.description || 'No description available for this tour.'}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <div className="mb-6">
              <div className="flex gap-4">
                {[
                  { name: 'Itinerary Details', key: 'itinerary' },
                  { name: 'Inclusions & Exclusions', key: 'inclusions' },
                  { name: "General FAQ's", key: 'faq' },
                  { name: 'Booking Policy', key: 'policy' },
                ].map(tab => (
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
          </div>
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-4 border shadow-sm mb-4 mt-[147px]">
              <h3
                className="text-sm font-medium p-4 -mt-4 -mx-4 mb-4 border-b"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                TRIP PRICE
              </h3>
              <div className="flex items-baseline mb-1">
                <span className="text-2xl font-bold" style={{ color: theme.colors.carrotOrange }}>
                  ₹{tourDetails?.price ? parseInt(tourDetails.price).toLocaleString() : '0'}
                </span>
                <span className="ml-2 text-xs" style={{ color: theme.colors.heavyMetal + '80' }}>
                  per person
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: theme.colors.heavyMetal + '80' }}>
                *Excluding applicable taxes
              </p>
              <button
                className="w-full py-2.5 rounded-lg font-medium transition-colors mb-3 text-sm"
                style={{
                  backgroundColor: theme.colors.carrotOrange,
                  color: theme.colors.milkWhite,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                Book Now
              </button>
              <button
                className="w-full border py-2.5 rounded-lg font-medium transition-colors text-sm"
                style={{
                  borderColor: theme.colors.carrotOrange,
                  color: theme.colors.carrotOrange,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
                onClick={openEnquireModal}
              >
                Enquire Now
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 border shadow-sm">
              <h3
                className="text-sm font-medium p-4 -mt-4 -mx-4 mb-4 border-b"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                HAVE QUESTIONS?
              </h3>
              <p className="text-xs mb-4" style={{ color: theme.colors.heavyMetal + '80' }}>
                Don't worry, our team is there to help you out
              </p>
              <button
                className="w-full border py-2.5 rounded-lg font-medium transition-colors text-sm"
                style={{
                  borderColor: theme.colors.carrotOrange,
                  color: theme.colors.carrotOrange,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg lg:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-orange-500">
                ₹{tourDetails?.price ? parseInt(tourDetails.price).toLocaleString() : '0'}
              </span>
              <span className="ml-2 text-sm text-gray-500">per person</span>
            </div>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetails;
