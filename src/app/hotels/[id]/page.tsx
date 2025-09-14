'use client';

import placeholderImage from '@/assets/images/destination.png';
import NavBar from '@/components/navbar/NavBar';
import ImageModal from '@/components/TripDetails/ImageModal';
import { useTheme } from '@/context/ThemeContext';
import { getCityById, getHotelById, getSimilarHotels } from '@/services/hotelService';
import { Hotel, Room } from '@/types/hotel';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FiMapPin, FiShare2, FiStar, FiUsers } from 'react-icons/fi';

interface City {
  id: string;
  city_id: number;
  city_name: string;
  state_id: number;
  image_urls?: string[];
  description?: string;
}

interface CustomHotel extends Hotel {}

interface PropertyRule {
  type: string;
  description: string;
  isMandatory: boolean;
}

interface SimilarHotel {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrls: string[];
  userRating?: number;
}

interface HotelDetailsProps {
  params: {
    id: string;
  };
}

const HotelDetails: React.FC<HotelDetailsProps> = ({ params }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('rooms');
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
  const [cityDetails, setCityDetails] = useState<City | null>(null);
  const [similarHotels, setSimilarHotels] = useState<SimilarHotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create refs for sections
  const locationSectionRef = React.useRef<HTMLDivElement>(null);
  // New state for tracking selected rooms and guests
  const [selectedRooms, setSelectedRooms] = useState<{
    [key: string]: { price: number; count: number; taxRate?: number; priceWithTax?: number };
  }>({});
  const [selectedGuestCount, setSelectedGuestCount] = useState<number>(2);

  // New state for showing all amenities
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const handleRoomCountChange = (
    roomId: string,
    action: 'increment' | 'decrement',
    price: number,
    taxRate?: number,
    priceWithTax?: number
  ) => {
    setSelectedRooms(prev => {
      const currentRoom = prev[roomId] || { price, count: 0 };
      let newCount = currentRoom.count;

      if (action === 'increment' && newCount < 5) {
        newCount++;
      } else if (action === 'decrement' && newCount > 0) {
        newCount--;
      }

      if (newCount === 0) {
        const { [roomId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [roomId]: {
          price,
          count: newCount,
          taxRate,
          priceWithTax,
        },
      };
    });
  };
  // Calculate total price based on selected rooms
  const calculateTotalPrice = () => {
    return Object.values(selectedRooms).reduce((total, room) => {
      return total + room.price * room.count;
    }, 0);
  };

  // Calculate tax amount based on selected rooms
  const calculateTaxAmount = () => {
    return Object.entries(selectedRooms).reduce((total, [roomType, details]) => {
      const taxRate = details.taxRate !== undefined ? details.taxRate : 10;
      return total + details.price * details.count * (taxRate / 100);
    }, 0);
  };

  // Calculate total with tax
  const calculateTotalWithTax = () => {
    return calculateTotalPrice() + calculateTaxAmount();
  };

  // Handle room selection
  const handleRoomSelection = (
    roomType: string,
    count: number,
    price: number,
    taxRate?: number,
    priceWithTax?: number
  ) => {
    setSelectedRooms(prev => {
      if (count === 0) {
        const newSelection = { ...prev };
        delete newSelection[roomType];
        return newSelection;
      } else {
        return {
          ...prev,
          [roomType]: {
            price,
            count,
            taxRate,
            priceWithTax,
          },
        };
      }
    });
  };

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const response = await getHotelById(params.id);

        if (response.success && response.data) {
          const hotel = response.data;
          setHotelDetails(hotel); // Fetch city information if cityId is available
          if (hotel.location?.address?.cityId) {
            try {
              const cityResponse = await getCityById(String(hotel.location.address.cityId));
              if (cityResponse.success && cityResponse.data) {
                setCityDetails(cityResponse.data);
              }
            } catch (cityErr) {
              console.error('Error fetching city details:', cityErr);
              // Don't set error state here, it's not critical for the page
            }

            // Fetch similar hotels in the same city
            try {
              const similarHotelsResponse = await getSimilarHotels(
                String(hotel.location.address.cityId),
                params.id
              );
              console.log('Similar hotels response in component:', similarHotelsResponse);

              if (similarHotelsResponse.success && similarHotelsResponse.data) {
                // Extract hotel array from response
                const hotelsArray = Array.isArray(similarHotelsResponse.data)
                  ? similarHotelsResponse.data
                  : similarHotelsResponse.data.hotels || [];

                if (hotelsArray.length > 0) {
                  console.log('Found similar hotels:', hotelsArray.length);

                  // Map the API response to ensure it matches the SimilarHotel interface
                  const mappedSimilarHotels = hotelsArray.map((hotelData: any) => ({
                    id: hotelData.id || '',
                    name: hotelData.name || '',
                    description:
                      hotelData.description ||
                      'Enjoy a peaceful stay in a well-appointed space with modern amenities.',
                    category: hotelData.category || '4 Star',
                    price: hotelData.price || 2500,
                    imageUrls: hotelData.imageUrls || [placeholderImage.src],
                    userRating: hotelData.userRating || 4.5,
                  }));

                  console.log('Mapped similar hotels:', mappedSimilarHotels);
                  setSimilarHotels(mappedSimilarHotels);
                } else {
                  console.log('No similar hotels found in data');
                  setSimilarHotels([]);
                }
              } else {
                console.log('No success or data in similarHotelsResponse');
                setSimilarHotels([]);
              }
            } catch (similarErr) {
              console.error('Error fetching similar hotels:', similarErr);
              setSimilarHotels([]);
            }
          } else {
            setSimilarHotels([]);
          }
        } else {
          setError('Failed to fetch hotel details');
        }
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Error fetching hotel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [params.id]);

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'location' && locationSectionRef.current) {
      locationSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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

  // Get hotel images or use placeholders
  const hotelImages =
    hotelDetails.imageUrls && hotelDetails.imageUrls.length > 0
      ? hotelDetails.imageUrls
      : Array(4).fill(placeholderImage.src);

  // Get available amenities with icons
  const amenitiesWithIcons = [
    { name: 'Gym', icon: '🏋️‍♂️' },
    { name: 'Swimming Pool', icon: '🏊‍♂️' },
    { name: 'Spa', icon: '💆‍♀️' },
    { name: 'Bar', icon: '🍸' },
    { name: 'Cafe', icon: '☕' },
    { name: 'Shuttle Service', icon: '🚐' },
    { name: 'CCTV', icon: '📹' },
    { name: 'Entertainment', icon: '🎭' },
  ];

  const getFormattedMeals = (mealsIncluded: Room['mealsIncluded']) => {
    const meals = [];
    if (mealsIncluded?.breakfast) meals.push('Breakfast');
    if (mealsIncluded?.lunch) meals.push('Lunch');
    if (mealsIncluded?.dinner) meals.push('Dinner');

    return meals.length > 0 ? meals.join(', ') : 'No meals';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Navigation */}
      <NavBar />
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={hotelImages}
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      {/* Breadcrumb Navigation - Matching Figma design */}
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
        {/* Main Content - 50/50 split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side: Images Section */}
          <div className="space-y-3">
            {/* Main large image */}
            <div
              className="relative w-full h-[350px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openImageModal(0)}
            >
              <Image src={hotelImages[0]} alt={hotelDetails.name} fill className="object-cover" />
            </div>

            {/* Three smaller images row */}
            <div className="grid grid-cols-3 gap-3">
              {hotelImages.slice(1, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => openImageModal(index + 1)}
                >
                  <Image
                    src={image}
                    alt={`${hotelDetails.name} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                  {/* Display +X more indicator on the last visible image if there are more images */}
                  {index === 2 && hotelImages.length > 4 && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        openImageModal(index + 1);
                      }}
                    >
                      <span className="text-white font-medium text-lg">
                        +{hotelImages.length - 4} more
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side: Hotel Details Section */}
          <div>
            {/* Hotel Title and Rating */}
            <div className="flex flex-col mb-4">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-[#FF8B02]">{hotelDetails.name}</h1>
                <button className="p-3 bg-[#FF8B02] rounded-md text-white hover:bg-[#e67f00]">
                  <FiShare2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                  {hotelDetails.category || '5 Star Hotel'}
                </div>
                <div className="flex items-center">
                  <div className="flex text-[#FF8B02]">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < (hotelDetails.userRating || 4.5)
                              ? 'text-[#FF8B02]'
                              : 'text-gray-300'
                          }
                          size={16}
                        />
                      ))}
                  </div>
                  <span className="text-sm ml-2">{hotelDetails.userRating || 4.5} Ratings</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-gray-700 text-base">
                {hotelDetails.description ||
                  'Lavish rooms, multiple dining spots, an outdoor swimming pool and a host of amenities await you for a delightful stay at this luxurious property.'}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h2 className="text-xl font-bold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {(
                  hotelDetails.amenities || [
                    'Gym',
                    'Swimming Pool',
                    'Spa',
                    'Bar',
                    'Cafe',
                    'Shuttle Service',
                    'CCTV',
                    'Entertainment',
                  ]
                )
                  .slice(0, 6)
                  .map((amenity, index) => {
                    const amenityWithIcon = amenitiesWithIcons.find(
                      a => a.name.toLowerCase() === amenity.toLowerCase()
                    ) || { name: amenity, icon: '✓' };
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 bg-white"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#FF8B0226] flex items-center justify-center text-[#FF8B02]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-check"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm">{amenityWithIcon.name}</span>
                      </div>
                    );
                  })}
                {hotelDetails.amenities && hotelDetails.amenities.length > 6 && (
                  <div
                    className="flex items-center justify-center border border-gray-200 rounded-lg p-2 bg-white text-[#FF8B02] text-sm cursor-pointer"
                    onClick={() => setShowAllAmenities(true)}
                  >
                    +{hotelDetails.amenities.length - 6} more
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mt-8">
          <div className="flex overflow-x-auto">
            {['rooms', 'location', 'property rules', 'similar properties'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap
                  ${
                    activeTab === tab
                      ? 'border-b-2 border-[#FF8B02] text-[#FF8B02]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="py-6">
          {activeTab === 'rooms' && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Rooms ({hotelDetails.rooms?.length || 0} types)
              </h2>

              <div className="flex flex-col md:flex-row">
                {/* Room cards in left column - takes up more width */}
                <div className="w-full md:w-3/4 pr-0 md:pr-6 space-y-8">
                  {/* Room Cards */}
                  {hotelDetails.rooms && hotelDetails.rooms.length > 0 ? (
                    hotelDetails.rooms.map((room, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                        style={{ fontFamily: theme.typography.fontFamily.regular }}
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Left column: Room Image and Price */}
                          <div className="w-full md:w-1/3 flex flex-col">
                            {/* Room Image */}
                            <div className="relative h-[200px]">
                              <Image
                                src={room.imageUrls?.[0] || placeholderImage}
                                alt={room.roomType}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Price Below Image */}
                            <div className="p-4 bg-white">
                              {' '}
                              <div className="mb-2">
                                <p className="text-xs text-gray-500">Price per room for 1 night</p>
                                <p className="text-xs text-gray-500">(excluding tax)</p>
                                <p className="text-xl font-bold">₹{room.price}</p>
                                {room.taxRate && (
                                  <div className="mt-1">
                                    <p className="text-xs text-gray-500">Tax: {room.taxRate}%</p>
                                    {room.priceWithTax && (
                                      <p className="text-sm font-semibold text-gray-700">
                                        ₹{room.priceWithTax} with tax
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right column: Room Details */}
                          <div className="w-full md:w-2/3 p-6">
                            <div className="mb-4">
                              {' '}
                              <h3
                                className="text-xl font-semibold"
                                style={{
                                  color: theme.colors.heavyMetal,
                                  fontFamily: theme.typography.fontFamily.bold,
                                }}
                              >
                                {room.roomType}
                              </h3>
                              {/* Room properties */}
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700">
                                  <FiUsers className="h-4 w-4" />
                                  {room.maxOccupancy} Guests
                                </span>
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700">
                                  {room.mealsIncluded?.breakfast
                                    ? 'Breakfast Included'
                                    : 'No Meals'}
                                </span>
                              </div>
                            </div>

                            {/* Room amenities */}
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Room Amenities
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities.slice(0, 5).map((amenity, i) => (
                                  <div key={i} className="inline-flex items-center gap-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 text-gray-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    <span className="text-sm text-gray-600">{amenity}</span>
                                  </div>
                                ))}
                                {room.amenities.length > 5 && (
                                  <span className="text-[#FF8B02] text-sm font-medium cursor-pointer hover:underline">
                                    +{room.amenities.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Room selection controls */}
                            <div className="flex justify-end mt-4">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  {' '}
                                  <button
                                    className="p-1 rounded-l border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    onClick={() =>
                                      handleRoomCountChange(
                                        room.roomType,
                                        'decrement',
                                        room.price,
                                        room.taxRate,
                                        room.priceWithTax
                                      )
                                    }
                                    disabled={!selectedRooms[room.roomType]?.count}
                                  >
                                    -
                                  </button>
                                  <span className="px-3 py-1 border-t border-b border-gray-300 bg-white min-w-[40px] text-center">
                                    {selectedRooms[room.roomType]?.count || 0}
                                  </span>
                                  <button
                                    className="p-1 rounded-r border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    onClick={() =>
                                      handleRoomCountChange(
                                        room.roomType,
                                        'increment',
                                        room.price,
                                        room.taxRate,
                                        room.priceWithTax
                                      )
                                    }
                                    disabled={(selectedRooms[room.roomType]?.count || 0) >= 4}
                                  >
                                    +
                                  </button>
                                </div>{' '}
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    handleRoomSelection(
                                      room.roomType,
                                      1,
                                      room.price,
                                      room.taxRate,
                                      room.priceWithTax
                                    )
                                  }
                                  className="py-2 px-4"
                                  sx={{
                                    bgcolor: selectedRooms[room.roomType]
                                      ? '#DDFFD7'
                                      : theme.colors.carrotOrange,
                                    color: selectedRooms[room.roomType] ? '#31A31C' : 'white',
                                    fontFamily: theme.typography.fontFamily.regular,
                                    '&:hover': {
                                      bgcolor: selectedRooms[room.roomType] ? '#C5F6BA' : '#E67E02',
                                    },
                                  }}
                                >
                                  {selectedRooms[room.roomType] ? 'Selected' : 'Select room'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No rooms available</p>
                    </div>
                  )}
                </div>

                {/* Sticky Price Summary Card on right side */}
                <div className="w-full md:w-1/4 mt-8 md:mt-0">
                  <div className="sticky top-8 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="flex flex-col h-full">
                      {/* Price Card Header */}
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Summary</h3>
                        <p className="text-sm font-medium text-gray-700">Selected Rooms</p>
                        <p className="text-xs text-gray-500">Estimated for entire stay</p>
                      </div>
                      {/* Total Price Card Body */}{' '}
                      <div className="p-4">
                        <div className="text-sm font-semibold text-gray-500 mb-3">TOTAL PRICE</div>
                        <p
                          className="text-2xl font-bold mb-1"
                          style={{
                            color: theme.colors.carrotOrange,
                            fontFamily: theme.typography.fontFamily.bold,
                          }}
                        >
                          ₹{calculateTotalPrice()}
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ fontFamily: theme.typography.fontFamily.regular }}
                        >
                          for selected rooms
                        </p>

                        {/* Display estimated taxes */}
                        {Object.keys(selectedRooms).length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 flex justify-between">
                              <span>Estimated taxes & fees:</span>
                              <span className="font-medium">
                                +₹{calculateTaxAmount().toFixed(2)}
                              </span>
                            </p>
                            <p
                              className="text-sm font-medium mt-1 flex justify-between"
                              style={{ color: theme.colors.carrotOrange }}
                            >
                              <span>Total with taxes:</span>
                              <span>₹{calculateTotalWithTax().toFixed(2)}</span>
                            </p>
                          </div>
                        )}

                        <div className="border-t border-gray-200 mt-2 pt-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 font-medium">ROOMS</label>
                              <div className="relative">
                                <div className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 text-sm">
                                  {Object.values(selectedRooms).reduce(
                                    (total, roomSelection) => total + roomSelection.count,
                                    0
                                  ) || 0}{' '}
                                  Room(s) Selected
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Selected Rooms Summary */}
                          <div className="space-y-2">
                            {Object.entries(selectedRooms).map(([roomType, details]) => (
                              <div
                                key={roomType}
                                className="flex justify-between items-center text-sm"
                              >
                                <span className="text-gray-600">{roomType}</span>
                                <span className="font-medium">x{details.count}</span>
                              </div>
                            ))}
                          </div>

                          {Object.keys(selectedRooms).length > 0 && (
                            <Button
                              variant="contained"
                              fullWidth
                              className="mt-4"
                              sx={{
                                bgcolor: theme.colors.carrotOrange,
                                fontFamily: theme.typography.fontFamily.bold,
                                '&:hover': {
                                  bgcolor: '#E67E02',
                                },
                              }}
                              onClick={() => {
                                if (typeof window !== 'undefined') {
                                  // Include tax information in the localStorage data
                                  const bookingData = {
                                    selectedRooms,
                                    taxAmount: calculateTaxAmount(),
                                    totalWithTax: calculateTotalWithTax(),
                                  };
                                  localStorage.setItem(
                                    'selectedRooms',
                                    JSON.stringify(selectedRooms)
                                  );
                                  localStorage.setItem('selectedHotelId', params.id);
                                  localStorage.setItem(
                                    'bookingTaxInfo',
                                    JSON.stringify({
                                      taxAmount: calculateTaxAmount(),
                                      totalWithTax: calculateTotalWithTax(),
                                    })
                                  );
                                  window.location.href = '/hotels/booking';
                                }
                              }}
                            >
                              Proceed to Book
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location section directly below the rooms */}
              <div ref={locationSectionRef} className="mt-12 pb-8 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Location</h2>

                {/* Key landmarks first, above the map */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Key Landmarks</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">
                        •
                      </span>
                      <span className="text-gray-700">Ram Jhula (2.3 km)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">
                        •
                      </span>
                      <span className="text-gray-700">Laxman Jhula (3.1 km)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">
                        •
                      </span>
                      <span className="text-gray-700">Triveni Ghat (1.5 km)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">
                        •
                      </span>
                      <span className="text-gray-700">Parmarth Niketan (2.0 km)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF8B02] font-bold text-lg leading-none mt-0.5">
                        •
                      </span>
                      <span className="text-gray-700">Neelkanth Mahadev (25 km)</span>
                    </div>
                  </div>
                </div>

                {/* Google Maps with actual location data from API */}
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  {hotelDetails?.location?.latitude && hotelDetails?.location?.longitude ? (
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${hotelDetails.location.longitude}!3d${hotelDetails.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU4JzM0LjUiTiA4McKwMjYnMDcuMSJF!5e0!3m2!1sen!2sin!4v1651234567890!5m2!1sen!2sin`}
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Hotel Location Map"
                    />
                  ) : (
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.679887290066!2d78.26712281492047!3d30.1207903217773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909173705d25cbb%3A0xe0b9f0651edcacf2!2sRishikesh%2C%20Uttarakhand%2C%20India!5e0!3m2!1sen!2sus!4v1621505126389!5m2!1sen!2sus"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Hotel Location Map"
                    />
                  )}
                </div>

                {/* Hotel Address */}
                <div className="mt-4 flex items-center gap-2 text-gray-700">
                  <FiMapPin className="text-[#FF8B02]" />
                  <p>
                    {hotelDetails?.location?.address?.addressLine1 ||
                      'National Highway 58, Rishikesh, Uttarakhand, India'}
                  </p>
                </div>
              </div>

              {/* Property Rules Section */}
              <div className="mt-12 pb-8 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Property Rules</h2>

                {/* Property Rules Tabs - Dynamic based on available property rules */}
                <div className="mb-6 overflow-x-auto">
                  <div className="flex min-w-max">
                    {hotelDetails.propertyRules && hotelDetails.propertyRules.length > 0 ? (
                      hotelDetails.propertyRules.map((rule, index) => (
                        <button
                          key={rule.type}
                          className={`px-6 py-3 whitespace-nowrap uppercase ${
                            index === 0
                              ? 'bg-[#FF8B02] text-white font-medium rounded-t-lg'
                              : 'text-gray-600 hover:text-[#FF8B02]'
                          }`}
                        >
                          {rule.type.replace(/_/g, ' ')}
                        </button>
                      ))
                    ) : (
                      // Default tabs if no propertyRules from API
                      <button className="px-6 py-3 bg-[#FF8B02] text-white font-medium rounded-t-lg">
                        RESTRICTIONS
                      </button>
                    )}
                  </div>
                </div>

                {/* Property Rules Content - Dynamic from API data */}
                <div className="space-y-4 text-gray-700">
                  {hotelDetails.propertyRules && hotelDetails.propertyRules.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-4">
                      {hotelDetails.propertyRules.map((rule, idx) => (
                        <li key={idx} className="flex items-baseline">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-3 mt-2 shrink-0"></span>
                          <span>{rule.description}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    // Default rules if no propertyRules from API
                    <ul className="list-disc pl-5 space-y-4">
                      <li className="flex items-baseline">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-3 mt-2 shrink-0"></span>
                        <span>Check In: 2 PM</span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-3 mt-2 shrink-0"></span>
                        <span>Check Out: 11 AM</span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-3 mt-2 shrink-0"></span>
                        <span>Pets are not allowed</span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-3 mt-2 shrink-0"></span>
                        <span>
                          Optional : Airport shuttle fee: INR 2500 per vehicle (one-way, maximum
                          occupancy 4)|Rollaway bed fee: INR 300.0 per night
                        </span>
                      </li>
                      <li className="flex items-baseline">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-3 mt-2 shrink-0"></span>
                        <span>
                          Extra-person charges may apply and vary depending on property policy
                        </span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Similar Hotels Section */}
              <div className="mt-12 pb-8 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Hotels</h2>

                {/* Search bar and navigation controls */}
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-full max-w-xs">
                    <input
                      type="text"
                      placeholder="Search for a hotel"
                      className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF8B02]"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous">
                      <svg
                        className="w-6 h-6 text-[#FF8B02]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a 1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Next">
                      <svg
                        className="w-6 h-6 text-[#FF8B02]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Hotel Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
                  {similarHotels && similarHotels.length > 0 ? (
                    similarHotels.map(hotel => (
                      <div
                        key={hotel.id}
                        className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col"
                      >
                        <div className="relative h-48">
                          <Image
                            src={hotel.imageUrls?.[0] || placeholderImage.src}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{hotel.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs">
                              {hotel.category || '4 Star'}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs flex items-center">
                              <FiMapPin size={10} className="mr-1" />{' '}
                              {cityDetails?.city_name || 'Rishikesh'}
                            </span>
                          </div>

                          <div className="flex items-center mb-2">
                            <div className="flex text-[#FF8B02]">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={
                                      i < (hotel.userRating || 4.5)
                                        ? 'text-[#FF8B02]'
                                        : 'text-gray-300'
                                    }
                                    size={14}
                                  />
                                ))}
                            </div>
                            <span className="text-xs ml-1 text-gray-600">
                              {hotel.userRating || 4.5} Ratings
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">3 room types</p>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                            Enjoy a peaceful night's sleep in a well-appointed space featuring
                            modern amenities.
                          </p>

                          <div className="flex justify-between items-center mt-auto">
                            <div>
                              <p className="text-xs text-gray-500">Starting from</p>
                              <p className="text-[#FF8B02] font-semibold">
                                ₹{hotel.price || 2500} per night
                              </p>
                            </div>
                            <Link href={`/hotels/${hotel.id}`}>
                              <span className="inline-block bg-[#FF8B02] text-white px-4 py-2 rounded hover:bg-[#e67f00] text-sm">
                                View Rooms
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                      <p>No similar hotels found</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Other tabs content remains unchanged */}
          {activeTab !== 'rooms' && (
            <div className="text-center p-8">
              <p>Content for {activeTab} tab will go here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for all amenities */}
      {showAllAmenities && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">All Amenities</h2>
            <ul className="space-y-2">
              {hotelDetails.amenities.map((amenity, index) => (
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

export default HotelDetails;
