'use client';

import React, { useState } from 'react';
import { Alert, Box, CircularProgress } from '@mui/material';
import Link from 'next/link';
import NavBar from '@/components/navbar/NavBar';
import ImageModal from '@/components/TripDetails/ImageModal';
import { useHotelDetails } from '@/hooks/useHotelDetails';
import { useRoomSelection } from '@/hooks/useRoomSelection';
import { HotelHeader } from './components/HotelHeader';
import { HotelImageGallery } from './components/HotelImageGallery';
import { HotelAmenities } from './components/HotelAmenities';
import { TabNavigation } from './components/TabNavigation';
import { RoomsSection } from "./components/RoomsSection";
import { LocationSection } from './components/LocationSection';
import { PropertyRulesSection } from './components/PropertyRuleSection';
import { SimilarHotelsSection } from './components/SimilarHotelSection';

interface HotelDetailsProps {
  params: { id: string };
}

const HotelDetails: React.FC<HotelDetailsProps> = ({ params }) => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { hotelDetails, cityDetails, similarHotels, loading, error } = useHotelDetails(params.id);
  const roomSelection = useRoomSelection();

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <CircularProgress sx={{ color: '#FF8B02' }} />
        <span className="ml-2 font-medium text-gray-600">Loading hotel details...</span>
      </div>
    );
  }

  if (error || !hotelDetails) {
    return (
      <div className="min-h-screen bg-white p-8">
        <NavBar />
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Hotel not found'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Link href="/hotels" className="text-[#FF8B02] hover:underline">
            Back to Hotels
          </Link>
        </Box>
      </div>
    );
  }

  const hotelImages =
    hotelDetails.imageUrls && hotelDetails.imageUrls.length > 0 ? hotelDetails.imageUrls : [];

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={hotelImages}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-gray-600 hover:text-[#FF8B02]">
            Home
          </Link>
          <span className="text-gray-400">--&gt;</span>
          <Link href="/hotels" className="text-gray-600 hover:text-[#FF8B02]">
            Hotels
          </Link>
          <span className="text-gray-400">--&gt;</span>
          <span className="text-[#FF8B02] font-medium">{hotelDetails.name}</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HotelImageGallery
            images={hotelImages}
            hotelName={hotelDetails.name}
            onImageClick={openImageModal}
          />

          <div>
            <HotelHeader hotel={hotelDetails} />

            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 text-base">
                {hotelDetails.description ||
                  'Lavish rooms, multiple dining spots, an outdoor swimming pool and a host of amenities await you for a delightful stay at this luxurious property.'}
              </p>
            </div>

            <HotelAmenities amenities={hotelDetails.amenities || []} />
          </div>
        </div>

        <TabNavigation activeTab={activeTab} onTabClick={handleTabClick} />

        <div className="py-6">
          {activeTab === 'rooms' && (
            <RoomsSection hotel={hotelDetails} roomSelection={roomSelection} hotelId={params.id} />
          )}
          {activeTab === 'location' && <LocationSection hotel={hotelDetails} />}
          {activeTab === 'property rules' && <PropertyRulesSection hotel={hotelDetails} />}
          {activeTab === 'similar properties' && (
            <SimilarHotelsSection similarHotels={similarHotels} cityDetails={cityDetails} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
