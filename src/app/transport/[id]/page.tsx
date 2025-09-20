'use client';

import placeholderImage from '@/assets/images/destination.png';
import NavBar from '@/components/layout/navbar/NavBar';

import ImageModal from '@/components/TripDetails/ImageModal';
import { useTheme } from '@/context/ThemeContext';
import { getTransportById } from '@/services/transportService';
import { Transport } from '@/types/transport';
import { Alert, Box, CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiShare2, FiStar } from 'react-icons/fi';

interface TransportDetailsProps {
  params: {
    id: string;
  };
}

const transportTabs = [
  { id: 'details', label: 'Rental Details' },
  { id: 'rules', label: 'Rental Rules' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'similar', label: 'Similar Cars to rent' },
];

const TransportDetails: React.FC<TransportDetailsProps> = ({ params }) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transportDetails, setTransportDetails] = useState<Transport | null>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const detailsSectionRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const router = useRouter();

  // Function to handle opening the image modal
  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  // Function to handle booking button click
  const handleBookClick = () => {
    router.push(`/transport/${params.id}/booking`);
  };

  useEffect(() => {
    const fetchTransportData = async () => {
      try {
        setLoading(true);
        const response = await getTransportById(params.id);

        if (response.success && response.data) {
          setTransportDetails(response.data);
        } else {
          setError('Failed to fetch transport details');
        }
      } catch (err) {
        console.error('Error fetching transport details:', err);
        setError('Error fetching transport details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransportData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <CircularProgress sx={{ color: '#FF8B02' }} />
        <span className="ml-2 font-medium text-gray-600">Loading transport details...</span>
      </div>
    );
  }

  if (error || !transportDetails) {
    return (
      <div className="min-h-screen bg-white p-8">
        <NavBar />
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || 'Transport not found'}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Link href="/transport" className="text-[#FF8B02] hover:underline">
            Back to Transport
          </Link>
        </Box>
      </div>
    );
  }

  // Get transport images or use placeholders
  const transportImages =
    transportDetails.imageUrls && transportDetails.imageUrls.length > 0
      ? transportDetails.imageUrls
      : transportDetails.imageUrl
      ? [transportDetails.imageUrl]
      : Array(4).fill(placeholderImage.src);

  // Amenities
  const amenities = transportDetails?.amenities || [
    'AC',
    'WiFi',
    'Entertainment System',
    'Comfortable Seating',
    'Water Bottle',
    'First Aid',
    'GPS',
    'Music System',
    'Charger',
    'Luggage Space',
    'Safety Kit',
    'Guide',
  ];

  // Price
  const price = transportDetails?.price || transportDetails?.basePrice || 0;
  const currency = transportDetails?.currency || '₹';

  // Tab content
  const renderTabContent = () => {
    // Backward compatibility: rentalDetails/rentalRules may be array or object
    const rentalDetails = Array.isArray(transportDetails?.rentalDetails)
      ? transportDetails?.rentalDetails[0]
      : transportDetails?.rentalDetails;
    const rentalRules = Array.isArray(transportDetails?.rentalRules)
      ? transportDetails?.rentalRules[0]
      : transportDetails?.rentalRules;
    // Use .type for title (interface only guarantees .type and .description)
    const rentalDetailsTitle = rentalDetails?.type || 'Rental Details';
    const rentalRulesTitle = rentalRules?.type || 'Rental Rules';
    if (activeTab === 'details') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{rentalDetailsTitle}</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>{rentalDetails?.description || 'No details available.'}</li>
            </ul>
          </div>
        </div>
      );
    }
    if (activeTab === 'rules') {
      return (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{rentalRulesTitle}</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>{rentalRules?.description || 'No rules available.'}</li>
          </ul>
        </div>
      );
    }
    if (activeTab === 'reviews') {
      return (
        <div className="text-center p-8 text-gray-500">
          No reviews yet. Be the first to review this vehicle!
        </div>
      );
    }
    if (activeTab === 'similar') {
      return (
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Cars to Rent</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder similar cars */}
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col"
              >
                <div className="relative h-48">
                  <Image src={transportImages[0]} alt="Similar Car" fill className="object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Car Model {i}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs">
                      SUV
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs flex items-center">
                      <FiMapPin size={10} className="mr-1" />{' '}
                      {(transportDetails &&
                        'startCity' in transportDetails &&
                        (transportDetails as any).startCity?.name) ||
                        'City'}
                    </span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="flex text-[#FF8B02]">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <FiStar
                            key={i}
                            className={i < 4 ? 'text-[#FF8B02]' : 'text-gray-300'}
                            size={14}
                          />
                        ))}
                    </div>
                    <span className="text-xs ml-1 text-gray-600">4.0 Ratings</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">5 seats</p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                    Comfortable and reliable car for your journey.
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-[#FF8B02] font-semibold">₹1500 per hour</p>
                    </div>
                    <button className="inline-block bg-[#FF8B02] text-white px-4 py-2 rounded hover:bg-[#e67f00] text-sm">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Navigation */}
      <NavBar />
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={transportImages}
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
          <Link href="/transport" className="text-gray-600 hover:text-[#FF8B02]">
            Transport
          </Link>
          <span className="text-gray-400">--&gt;</span>
          <span className="text-[#FF8B02] font-medium">{transportDetails?.title}</span>
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Content - 50/50 split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Images Section */}
          <div className="space-y-3">
            {/* Main large image */}
            <div
              className="relative w-full h-[350px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openImageModal(0)}
            >
              <Image
                src={transportImages[0]}
                alt={transportDetails?.title || ''}
                fill
                className="object-cover"
              />
            </div>

            {/* Three smaller images row */}
            <div className="grid grid-cols-3 gap-3">
              {transportImages.slice(1, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => openImageModal(index + 1)}
                >
                  <Image
                    src={image}
                    alt={`${transportDetails?.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                  {/* Display +X more indicator on the last visible image if there are more images */}
                  {index === 2 && transportImages.length > 4 && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        openImageModal(index + 1);
                      }}
                    >
                      <span className="text-white font-medium text-lg">
                        +{transportImages.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Details Section */}
          <div>
            {/* Transport Title and Rating */}
            <div className="flex flex-col mb-4">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-[#FF8B02]">{transportDetails?.title}</h1>
                <button className="p-3 bg-[#FF8B02] rounded-md text-white hover:bg-[#e67f00]">
                  <FiShare2 size={20} />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                  {transportDetails?.vehicleType || transportDetails?.type || 'Standard Vehicle'}
                </div>
                <div className="flex items-center">
                  <div className="flex text-[#FF8B02]">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < (transportDetails?.rating || 4.5)
                              ? 'text-[#FF8B02]'
                              : 'text-gray-300'
                          }
                          size={16}
                        />
                      ))}
                  </div>
                  <span className="text-sm ml-2">{transportDetails?.rating || 4.5} Ratings</span>
                </div>
              </div>
            </div>
            {/* Trip Overview Section */}
            <div className="mb-6">
              <h2
                className="text-2xl font-bold mb-3"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                Trip Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Rental Company */}
                <div
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-white"
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  <span className="text-xl" style={{ color: theme.colors.carrotOrange }}>
                    {/* icon */}
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="7" width="14" height="10" rx="2" />
                      <path d="M16 3v4M8 3v4" />
                    </svg>
                  </span>
                  <div>
                    <div
                      className="text-xs"
                      style={{
                        color: theme.colors.heavyMetal + '99',
                        fontFamily: theme.typography.fontFamily.regular,
                      }}
                    >
                      Rental Company
                    </div>
                    <div
                      className="font-bold"
                      style={{
                        color: theme.colors.heavyMetal,
                        fontFamily: theme.typography.fontFamily.bold,
                      }}
                    >
                      {transportDetails?.rentalCompany || '-'}
                    </div>
                  </div>
                </div>
                {/* Rental Type */}
                <div
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-white"
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  <span className="text-xl" style={{ color: theme.colors.carrotOrange }}>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 13V7a2 2 0 0 0-2-2h-1V3a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2H2a2 2 0 0 0-2 2v6" />
                      <rect x="2" y="7" width="16" height="6" rx="2" />
                    </svg>
                  </span>
                  <div>
                    <div
                      className="text-xs"
                      style={{
                        color: theme.colors.heavyMetal + '99',
                        fontFamily: theme.typography.fontFamily.regular,
                      }}
                    >
                      Rental Type
                    </div>
                    <div
                      className="font-bold"
                      style={{
                        color: theme.colors.heavyMetal,
                        fontFamily: theme.typography.fontFamily.bold,
                      }}
                    >
                      {transportDetails?.rentalType || '-'}
                    </div>
                  </div>
                </div>
                {/* Vehicle Model */}
                <div
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-white"
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  <span className="text-xl" style={{ color: theme.colors.carrotOrange }}>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="7" width="14" height="10" rx="2" />
                      <path d="M8 3v4M16 3v4" />
                    </svg>
                  </span>
                  <div>
                    <div
                      className="text-xs"
                      style={{
                        color: theme.colors.heavyMetal + '99',
                        fontFamily: theme.typography.fontFamily.regular,
                      }}
                    >
                      Vehicle Model
                    </div>
                    <div
                      className="font-bold"
                      style={{
                        color: theme.colors.heavyMetal,
                        fontFamily: theme.typography.fontFamily.bold,
                      }}
                    >
                      {transportDetails?.vehicleModel || '-'}
                    </div>
                  </div>
                </div>
                {/* Vehicle Type */}
                <div
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-white"
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  <span className="text-xl" style={{ color: theme.colors.carrotOrange }}>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="7" width="14" height="10" rx="2" />
                      <path d="M8 3v4M16 3v4" />
                    </svg>
                  </span>
                  <div>
                    <div
                      className="text-xs"
                      style={{
                        color: theme.colors.heavyMetal + '99',
                        fontFamily: theme.typography.fontFamily.regular,
                      }}
                    >
                      Vehicle Type
                    </div>
                    <div
                      className="font-bold"
                      style={{
                        color: theme.colors.heavyMetal,
                        fontFamily: theme.typography.fontFamily.bold,
                      }}
                    >
                      {transportDetails?.vehicleType || '-'}
                    </div>
                  </div>
                </div>
                {/* Seat count */}
                <div
                  className="border border-gray-200 rounded-lg p-4 flex items-center gap-3 bg-white"
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  <span className="text-xl" style={{ color: theme.colors.carrotOrange }}>
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                  </span>
                  <div>
                    <div
                      className="text-xs"
                      style={{
                        color: theme.colors.heavyMetal + '99',
                        fontFamily: theme.typography.fontFamily.regular,
                      }}
                    >
                      Seat count
                    </div>
                    <div
                      className="font-bold"
                      style={{
                        color: theme.colors.heavyMetal,
                        fontFamily: theme.typography.fontFamily.bold,
                      }}
                    >
                      {transportDetails?.seatCount ? `${transportDetails.seatCount} people` : '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Description Section */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 text-base">
                {transportDetails?.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mt-8">
          <div className="flex overflow-x-auto">
            {transportTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'border-b-2 border-[#FF8B02] text-[#FF8B02]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs and Trip Price side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Tabs Content */}
          <div className="lg:col-span-9">
            <div className="py-6">{renderTabContent()}</div>
          </div>
          {/* Trip Price Card */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-4 border shadow-sm mb-4 lg:sticky lg:top-24">
              <h3
                className="text-sm font-medium p-4 -mt-4 -mx-4 mb-4 border-b"
                style={{ color: '#222B45', fontWeight: 700 }}
              >
                TRIP PRICE
              </h3>
              <div className="flex items-baseline mb-1">
                <span className="text-2xl font-bold" style={{ color: '#FF8B02' }}>
                  {currency} {price}
                </span>
                <span className="ml-2 text-xs" style={{ color: '#222B4580' }}>
                  per hour
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: '#222B4580' }}>
                *Excluding applicable taxes
              </p>
              <button
                className="w-full py-2.5 rounded-lg font-medium transition-colors mb-1 text-sm bg-[#FF8B02] text-white hover:bg-[#e67f00]"
                style={{ fontWeight: 700 }}
                onClick={handleBookClick}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for all amenities */}
      {showAllAmenities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">All Amenities</h2>
            <ul className="space-y-2">
              {amenities.map((amenity, index) => (
                <li key={index} className="text-gray-700">
                  {amenity}
                </li>
              ))}
            </ul>
            <div className="mt-6 text-right">
              <button
                className="px-4 py-2 bg-[#FF8B02] text-white rounded-lg hover:bg-[#e67f00]"
                onClick={() => setShowAllAmenities(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportDetails;
