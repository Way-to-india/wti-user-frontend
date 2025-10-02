'use client';

import { AppDispatch, RootState } from '@/app/redux/store';
import { fetchTourById } from '@/app/redux/toursSlice';
import HotelChangeModalContent from '@/components/TripDetails/HotelChangeModalContent';
import ImageModal from '@/components/TripDetails/ImageModal';
import TransportChangeModalContent from '@/components/TripDetails/TransportChangeModalContent';
import NavBar from '@/components/layout/navbar/NavBar';

import EnquireNowModal from '@/components/tours/EnquireNowModal';
import Modal from '@/lib/modals/modals';
import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TourBreadcrumb from './components/TourBreadcrumb';
import TourHeader from './components/TourHeader';
import TourImageGallery from './components/TourImageGallery';
import TourOverview from './components/TourOverview';
import TourTabs from './components/TourTabs';
import TourSidebar from './components/TourSidebar';
import MobileBookingBar from './components/MobileBookingBar';
import { BookingPolicy } from '@/components/tours/BookingPolicy';

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

  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [changeModalType, setChangeModalType] = useState<'hotel' | 'transport' | null>(null);
  const [isEnquireModalOpen, setIsEnquireModalOpen] = useState(false);

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  useEffect(() => {
    if (tourDetails?.itinerary && tourDetails.itinerary.length > 0) {
      const minDay = Math.min(...tourDetails.itinerary.map(item => item.day));
      setSelectedDay(minDay);
    }
  }, [tourDetails]);

  useEffect(() => {
    const abortController = new AbortController();
    if (params.id) {
      dispatch(fetchTourById(params.id));
    }
    return () => {
      abortController.abort();
    };
  }, [params.id]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={tourDetails?.imageUrls || []}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      <Modal modalOpen={changeModalOpen} handleClose={closeChangeModal} className="p-0" drawer>
        {changeModalType === 'hotel' && <HotelChangeModalContent onClose={closeChangeModal} />}
        {changeModalType === 'transport' && (
          <TransportChangeModalContent onClose={closeChangeModal} />
        )}
      </Modal>

      <EnquireNowModal
        isOpen={isEnquireModalOpen}
        onClose={closeEnquireModal}
        tourName={tourDetails?.title || 'Tour Name'}
        tourCategory={tourDetails?.theme?.name}
        tourImage={tourDetails?.imageUrls?.[0] || '/assets/images/tours/valley-of-flowers.jpg'}
        tourRating={tourDetails?.rating || 4.5}
      />

      <TourBreadcrumb tourTitle={tourDetails?.title || 'Tour Details'} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <TourTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              tourDetails={tourDetails}
              onOpenChangeModal={openChangeModal}
            />
          </div>
          <div className="lg:col-span-1 order-1 lg:order-2">
            <TourSidebar tourDetails={tourDetails} onEnquireClick={openEnquireModal} />
          </div>
        </div>
        <BookingPolicy cancellationPolicies={[]} termsAndConditions={[]} />
      </div>

      <div className="h-20 lg:hidden"></div>

      <MobileBookingBar tourDetails={tourDetails} />
    </div>
  );
};

export default TourDetails;
