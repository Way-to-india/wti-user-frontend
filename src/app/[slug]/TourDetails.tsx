'use client';

import { AppDispatch, RootState } from '@/app/redux/store';
import { fetchTourById } from '@/app/redux/toursSlice';
import NavBar from '@/components/layout/navbar/NavBar';
import { CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Static imports for critical components
import TourBreadcrumb from './components/TourBreadcrumb';
import TourHeader from './components/TourHeader';
import TourImageGallery from './components/TourImageGallery';
import TourOverview from './components/TourOverview';
import TourTabs from './components/TourTabs';
import TourSidebar from './components/TourSidebar';
import MobileBookingBar from './components/MobileBookingBar';
import FAQSchemaScript from './components/FAQSchemaScript';

// Dynamic imports for non-critical components
const HotelChangeModalContent = dynamic(
  () => import('@/components/TripDetails/HotelChangeModalContent'),
  { ssr: false }
);

const ImageModal = dynamic(
  () => import('@/components/TripDetails/ImageModal'),
  { ssr: false }
);

const TransportChangeModalContent = dynamic(
  () => import('@/components/TripDetails/TransportChangeModalContent'),
  { ssr: false }
);

const EnquireNowModal = dynamic(
  () => import('@/components/tours/EnquireNowModal'),
  { ssr: false }
);

const Modal = dynamic(
  () => import('@/lib/modals/modals'),
  { ssr: false }
);

const BookingPolicy = dynamic(
  () => import('@/components/tours/BookingPolicy').then(mod => ({ default: mod.BookingPolicy })),
  { ssr: false }
);

const SimilarTours = dynamic(
  () => import('./components/SimilarTour'),
  {
    ssr: false,
    loading: () => (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        </div>
      </div>
    )
  }
);

interface TourDetailsProps {
  params: {
    id: string;
  };
}

const TourDetails: React.FC<TourDetailsProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDay, setSelectedDay] = useState(1);
  const dispatch = useDispatch<AppDispatch>();
  const { tourDetails, loading, error } = useSelector((state: RootState) => state.tours);

  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeModalType, setChangeModalType] = useState<'hotel' | 'transport' | null>(null);
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);

  // Fetch tour data
  useEffect(() => {
    if (params.id) {
      dispatch(fetchTourById(params.id));
    }
  }, [params.id, dispatch]);

  // Set initial selected day
  useEffect(() => {
    if (tourDetails?.itinerary && tourDetails.itinerary.length > 0) {
      const minDay = Math.min(...tourDetails.itinerary.map(item => item.day));
      setSelectedDay(minDay);
    }
  }, [tourDetails]);

  // Modal handlers
  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const openChangeModal = (type: 'hotel' | 'transport') => {
    setChangeModalType(type);
    setChangeModalOpen(true);
  };

  const closeChangeModal = () => {
    setChangeModalOpen(false);
    setChangeModalType(null);
  };

  const openEnquireModal = () => {
    setIsEnquireModalOpen(true);
  };

  const closeEnquireModal = () => {
    setIsEnquireModalOpen(false);
  };

  // Loading state
  if (loading || !tourDetails || tourDetails.id !== params.id) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress aria-label="Loading tour details" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FAQ Schema */}
      {tourDetails?.faqSchema && (
        <FAQSchemaScript faqSchema={tourDetails.faqSchema} />
      )}

      <NavBar />

      {/* Image Modal - Only rendered when needed */}
      {showImageModal && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          images={tourDetails?.imageUrls || []}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
        />
      )}

      {/* Change Modal - Only rendered when needed */}
      {changeModalOpen && (
        <Modal modalOpen={changeModalOpen} handleClose={closeChangeModal} className="p-0" drawer>
          {changeModalType === 'hotel' && <HotelChangeModalContent onClose={closeChangeModal} />}
          {changeModalType === 'transport' && (
            <TransportChangeModalContent onClose={closeChangeModal} />
          )}
        </Modal>
      )}

      {/* Enquire Modal - Only rendered when needed */}
      {isEnquireModalOpen && (
        <EnquireNowModal
          isOpen={isEnquireModalOpen}
          onClose={closeEnquireModal}
          tourName={tourDetails?.title || 'Tour Name'}
          tourCategory={tourDetails?.theme?.name}
          tourImage={tourDetails?.imageUrls?.[0] || '/assets/images/tours/valley-of-flowers.jpg'}
          tourRating={tourDetails?.rating || 4.5}
        />
      )}

      <TourBreadcrumb tourTitle={tourDetails?.title || 'Tour Details'} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="order-2 lg:order-1">
            <TourImageGallery
              images={tourDetails?.imageUrls || []}
              title={tourDetails?.title || 'Tour'}
              onImageClick={openImageModal}
            />
          </div>
          <div className="order-1 lg:order-2">
            <TourHeader tourDetails={tourDetails} />
            <TourOverview tourDetails={tourDetails} />
          </div>
        </section>

        {/* Content Section */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 order-1">
            <TourTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              tourDetails={tourDetails}
              onOpenChangeModal={openChangeModal}
            />
          </div>

          <aside className="lg:col-span-1 order-2" aria-label="Tour booking sidebar">
            <TourSidebar tourDetails={tourDetails} onEnquireClick={openEnquireModal} />
          </aside>
        </section>

        {/* Booking Policy - Lazy loaded */}
        <BookingPolicy
          title={tourDetails.title}
          cancellationPolicies={[]}
          termsAndConditions={[]}
        />
      </main>

      {/* Similar Tours - Lazy loaded */}
      <SimilarTours tourId={params.id} limit={6} />

      {/* Mobile Booking Bar Spacer */}
      <div className="h-20 lg:hidden" aria-hidden="true" />

      {/* Mobile Booking Bar */}
      <MobileBookingBar tourDetails={tourDetails} />
    </div>
  );
};

export default TourDetails;