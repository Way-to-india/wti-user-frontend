'use client';
import BookingConfirmationModal from '@/components/booking/BookingConfirmationModal';
import GuestInformationForm from '@/components/booking/GuestInformationForm';
import ErrorModal from '@/components/ErrorModal';
import NavBar from '@/components/navbar/NavBar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { createHotelBooking } from '@/services/bookingService';
import { getHotelById } from '@/services/hotelService';
import { Hotel } from '@/types/hotel';
import { formatDateForAPI } from '@/utils/dateUtils';
import { addDays } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiUsers } from 'react-icons/fi';

interface MealsIncluded {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface RoomDetails {
  roomType: string;
  count: number;
  price: number;
  maxOccupancy?: number;
  amenities?: string[];
  mealsIncluded?: MealsIncluded;
  imageUrls?: string[];
  taxRate?: number;
  priceWithTax?: number;
}

interface GuestInformation {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export default function BookingPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, token } = useAuth();
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: RoomDetails } | null>(null);
  const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [numberOfNights, setNumberOfNights] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState<GuestInformation[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });
  const [bookingDetails, setBookingDetails] = useState<{
    bookingId?: string;
    hotelName?: string;
    checkInDate?: Date | string;
    checkOutDate?: Date | string;
    totalAmount?: number;
    subtotalAmount?: number;
    taxAmount?: number;
  }>({});
  const [showAmenitiesModal, setShowAmenitiesModal] = useState<{
    show: boolean;
    roomType: string;
    amenities: string[];
  }>({
    show: false,
    roomType: '',
    amenities: [],
  });

  // Calculate number of nights when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setNumberOfNights(Math.max(1, nights));
    }
  }, [checkInDate, checkOutDate]);

  // Fetch hotel and room data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roomsData = localStorage.getItem('selectedRooms');
        const hotelId = localStorage.getItem('selectedHotelId');
        const taxInfoData = localStorage.getItem('bookingTaxInfo');

        if (!roomsData || !hotelId) {
          setError('No booking information found. Please select a hotel and rooms first.');
          return;
        }

        const parsedRooms = JSON.parse(roomsData);
        setSelectedRooms(parsedRooms);

        // Parse stored tax information if available
        if (taxInfoData) {
          try {
            const taxInfo = JSON.parse(taxInfoData);
            console.log('Retrieved tax information:', taxInfo);
          } catch (err) {
            console.error('Error parsing tax information:', err);
          }
        }

        const response = await getHotelById(hotelId);
        if (response.success && response.data) {
          const hotelData = response.data as Hotel;
          setHotelDetails(hotelData);

          const enhancedRooms: { [key: string]: RoomDetails } = {};
          Object.entries(parsedRooms).forEach(([roomType, details]: [string, any]) => {
            const hotelRoom = hotelData.rooms?.find((r: any) => r.roomType === roomType);
            if (hotelRoom) {
              enhancedRooms[roomType] = {
                ...details,
                maxOccupancy: hotelRoom.maxOccupancy,
                amenities: hotelRoom.amenities,
                mealsIncluded: hotelRoom.mealsIncluded,
                imageUrls: hotelRoom.imageUrls,
                taxRate: hotelRoom.taxRate,
                priceWithTax: hotelRoom.priceWithTax,
              };
            } else {
              enhancedRooms[roomType] = {
                ...details,
              };
            }
          });

          setSelectedRooms(enhancedRooms);
        } else {
          setError('Failed to fetch hotel details. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('An error occurred while loading your booking. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total price (without tax)
  const calculateTotalPrice = () => {
    if (!selectedRooms || Object.keys(selectedRooms).length === 0) return 0;
    return Object.values(selectedRooms).reduce(
      (total, room) => total + room.price * room.count * numberOfNights,
      0
    );
  };

  // Calculate tax amount based on each room's tax rate
  const calculateTaxAmount = () => {
    if (!selectedRooms || Object.keys(selectedRooms).length === 0) return 0;

    return Object.values(selectedRooms).reduce((totalTax, room) => {
      // Use room's tax rate if available, default to 10% if not specified
      const taxRate = room.taxRate !== undefined ? room.taxRate : 10;
      const roomPrice = room.price * room.count * numberOfNights;
      return totalTax + roomPrice * (taxRate / 100);
    }, 0);
  };

  // Calculate total price with tax
  const calculateTotalWithTax = () => {
    return calculateTotalPrice() + calculateTaxAmount();
  };

  // Calculate average tax rate across all selected rooms
  const calculateAverageTaxRate = () => {
    if (!selectedRooms || Object.keys(selectedRooms).length === 0) return 0;

    const totalRoomCount = Object.values(selectedRooms).reduce(
      (count, room) => count + room.count,
      0
    );
    const weightedTaxRateSum = Object.values(selectedRooms).reduce((sum, room) => {
      const taxRate = room.taxRate !== undefined ? room.taxRate : 10;
      return sum + taxRate * room.count;
    }, 0);

    return Math.round((weightedTaxRateSum / totalRoomCount) * 10) / 10; // Round to 1 decimal place
  };

  const handleGuestInfoChange = (index: number, field: keyof GuestInformation, value: string) => {
    const newGuestInfo = [...guestInfo];
    newGuestInfo[index] = {
      ...newGuestInfo[index],
      [field]: value,
    };
    setGuestInfo(newGuestInfo);
  };

  // Add validation before proceeding to checkout
  const handleProceedToCheckout = async () => {
    if (!checkInDate || !checkOutDate) {
      alert('Please select check-in and check-out dates');
      return;
    }

    if (!selectedRooms || Object.keys(selectedRooms).length === 0) {
      alert('Please select at least one room to proceed');
      return;
    }

    // Validate first guest's required information
    const primaryGuest = guestInfo[0];
    if (
      !primaryGuest?.firstName ||
      !primaryGuest?.lastName ||
      !primaryGuest?.email ||
      !primaryGuest?.phone
    ) {
      alert('Please fill in all required information for the primary guest');
      return;
    }

    // Validate names for all guests
    const incompleteGuests = guestInfo.some(guest => !guest.firstName || !guest.lastName);
    if (incompleteGuests) {
      alert('Please fill in names for all guests');
      return;
    }

    // Check if user is logged in
    if (!user || !token) {
      alert('Please log in to continue with booking');
      router.push('/auth/login');
      return;
    }

    try {
      setIsBooking(true);

      // Calculate total number of guests
      const totalNumberOfGuests = guestInfo.length;

      // Get room type (if multiple rooms, just use the main room type)
      const mainRoomType = Object.keys(selectedRooms)[0];

      // Create guest names array
      const guestNames = guestInfo.map(g => `${g.firstName} ${g.lastName}`);

      // Create booking data
      const bookingData = {
        hotelId: hotelDetails?.id || '',
        checkInDate: formatDateForAPI(checkInDate),
        checkOutDate: formatDateForAPI(checkOutDate),
        numberOfGuests: totalNumberOfGuests,
        roomType: mainRoomType,
        totalAmount: Math.round(calculateTotalWithTax()),
        // These are optional fields that the backend will ignore if not needed
        subtotalAmount: Math.round(calculateTotalPrice()),
        taxAmount: Math.round(calculateTaxAmount()),
        taxRate: calculateAverageTaxRate(),
        specialRequests: guestInfo[0].specialRequests || '',
        contactPhone: guestInfo[0].phone,
        contactEmail: guestInfo[0].email,
        guestNames: guestNames,
      };

      // Call the booking API
      const response = await createHotelBooking(bookingData);

      console.log('Booking API response:', response);

      if (response.success) {
        // Set booking details for the confirmation modal
        setBookingDetails({
          bookingId: response.data?.id || 'N/A',
          hotelName: hotelDetails?.name,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          subtotalAmount: calculateTotalPrice(),
          taxAmount: calculateTaxAmount(),
          totalAmount: Math.round(calculateTotalWithTax()),
        });

        // Show success modal
        setBookingSuccess(true);

        // Clear booking data from localStorage since it's now completed
        localStorage.removeItem('selectedRooms');
        localStorage.removeItem('selectedHotelId');
        localStorage.removeItem('bookingTaxInfo');
      } else {
        setBookingError({
          show: true,
          message: response.message || 'Failed to complete booking. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingError({
        show: true,
        message: 'There was an error processing your booking. Please try again later.',
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Update guest count and initialize minimum guest forms when selected rooms change
  useEffect(() => {
    if (selectedRooms) {
      // Calculate maximum possible guests based on room occupancy
      const maxGuests = Object.values(selectedRooms).reduce(
        (total, room) => total + (room.maxOccupancy || 2) * room.count,
        0
      );
      setTotalGuests(maxGuests);

      // Calculate minimum required guest forms (one per room)
      const minGuests = Object.values(selectedRooms).reduce((total, room) => total + room.count, 0);

      // Initialize guest info array with minimum required forms if needed
      if (guestInfo.length < minGuests) {
        const newGuestInfo = Array(minGuests)
          .fill(null)
          .map(() => ({
            title: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialRequests: '',
          }));
        setGuestInfo(newGuestInfo);
      }
    }
  }, [selectedRooms]);

  // Recalculate guest requirements when rooms change
  useEffect(() => {
    if (selectedRooms) {
      // If no rooms are selected, show a warning and redirect
      if (Object.keys(selectedRooms).length === 0) {
        alert(
          'You have removed all rooms from your booking. You will be redirected to the hotel page.'
        );
        router.push('/hotels');
        return;
      }

      // Calculate maximum possible guests based on room occupancy
      const maxGuests = Object.values(selectedRooms).reduce(
        (total, room) => total + (room.maxOccupancy || 2) * room.count,
        0
      );
      setTotalGuests(maxGuests);

      // Calculate minimum required guest forms (one per room)
      const minGuests = Object.values(selectedRooms).reduce((total, room) => total + room.count, 0);

      // Update guest info array based on new room selection
      // If we have more guest forms than needed, trim the array
      if (guestInfo.length > maxGuests) {
        setGuestInfo(guestInfo.slice(0, maxGuests));
      }
      // If we have fewer forms than the minimum required, add more
      else if (guestInfo.length < minGuests) {
        const newGuestInfo = Array(minGuests - guestInfo.length)
          .fill(null)
          .map(() => ({
            title: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialRequests: '',
          }));
        setGuestInfo([...guestInfo, ...newGuestInfo]);
      }
    }
  }, [selectedRooms, guestInfo.length, router]);

  // Handle room operations (increment, decrement, delete)
  const handleRoomOperation = (
    roomType: string,
    operation: 'increment' | 'decrement' | 'delete'
  ) => {
    if (!selectedRooms) return;

    let updatedRooms = { ...selectedRooms };

    switch (operation) {
      case 'increment':
        // Limit to maximum 5 rooms of each type
        if (updatedRooms[roomType].count >= 5) {
          alert('Maximum 5 rooms of each type can be booked at once');
          return;
        }
        updatedRooms = {
          ...updatedRooms,
          [roomType]: {
            ...updatedRooms[roomType],
            count: updatedRooms[roomType].count + 1,
          },
        };
        break;

      case 'decrement':
        if (updatedRooms[roomType].count <= 1) return;
        updatedRooms = {
          ...updatedRooms,
          [roomType]: {
            ...updatedRooms[roomType],
            count: updatedRooms[roomType].count - 1,
          },
        };
        break;

      case 'delete':
        // Remove the room type completely
        delete updatedRooms[roomType];
        break;
    }

    // Update state and localStorage
    setSelectedRooms(updatedRooms);
    localStorage.setItem('selectedRooms', JSON.stringify(updatedRooms));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Image src="/loading-spinner.svg" alt="Loading" width={50} height={50} />
          <p className="mt-4 text-gray-600">Loading your booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4" style={{ color: theme.colors.heavyMetal }}>
              Oops! Something went wrong.
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/hotels" className="text-[#FF8B02] font-medium hover:underline">
              Go back to Hotels
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false);
          router.push('/'); // Redirect to home page after booking
        }}
        bookingDetails={bookingDetails}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={bookingError.show}
        onClose={() => setBookingError({ show: false, message: '' })}
        title="Booking Failed"
        message={bookingError.message}
      />

      {/* Amenities Modal */}
      {showAmenitiesModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                {showAmenitiesModal.roomType} Amenities
              </h3>
              <button
                onClick={() => setShowAmenitiesModal({ show: false, roomType: '', amenities: [] })}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {showAmenitiesModal.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border-b border-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#FF8B02]"
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
                  <span style={{ fontFamily: theme.typography.fontFamily.regular }}>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
          {hotelDetails?.id && (
            <>
              <Link
                href={`/hotels/${hotelDetails.id}`}
                className="text-gray-600 hover:text-[#FF8B02]"
              >
                {hotelDetails.name}
              </Link>
              <span className="text-gray-400">--&gt;</span>
            </>
          )}
          <span className="text-[#FF8B02] font-medium">Booking</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Hotel and Guest Information */}
          <div className="w-full lg:w-2/3">
            {/* Hotel Info Card */}
            {hotelDetails && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2
                      className="text-xl font-semibold mb-2"
                      style={{ color: theme.colors.heavyMetal }}
                    >
                      {hotelDetails.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      {hotelDetails.location?.address?.addressLine1}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {hotelDetails.category || '5 Star Hotel'}
                      </span>
                    </div>
                  </div>
                  {hotelDetails.imageUrls?.[0] && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                      <Image
                        src={hotelDetails.imageUrls[0]}
                        alt={hotelDetails.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Date Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.h5,
                  fontWeight: theme.typography.fontWeight.bold,
                }}
              >
                Select Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm text-gray-600 mb-2 block"
                    style={{ fontFamily: theme.typography.fontFamily.regular }}
                  >
                    Check-in
                  </label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={date => setCheckInDate(date)}
                    minDate={new Date()}
                    placeholderText="Select check-in date"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    wrapperClassName="react-datepicker__wrapper"
                  />
                </div>
                <div>
                  <label
                    className="text-sm text-gray-600 mb-2 block"
                    style={{ fontFamily: theme.typography.fontFamily.regular }}
                  >
                    Check-out
                  </label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={date => setCheckOutDate(date)}
                    minDate={checkInDate ? addDays(checkInDate, 1) : new Date()}
                    placeholderText="Select check-out date"
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    wrapperClassName="react-datepicker__wrapper"
                  />
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.h5,
                  fontWeight: theme.typography.fontWeight.bold,
                }}
              >
                Room Details
              </h2>
              <div className="space-y-4">
                {selectedRooms &&
                  Object.entries(selectedRooms).map(([roomType, details]) => (
                    <div
                      key={roomType}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Room image */}
                        {details.imageUrls && details.imageUrls[0] && (
                          <div className="w-full md:w-1/4 relative">
                            <div className="h-[120px] md:h-[140px] relative">
                              <Image
                                src={details.imageUrls[0]}
                                alt={roomType}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {/* Room details */}
                        <div
                          className={`w-full ${
                            details.imageUrls && details.imageUrls[0] ? 'md:w-3/4' : 'md:w-full'
                          } p-4`}
                        >
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3
                                className="font-medium text-gray-800"
                                style={{
                                  fontFamily: theme.typography.fontFamily.bold,
                                  fontSize: theme.typography.fontSize.body,
                                }}
                              >
                                {roomType} <span className="text-[#FF8B02]">₹{details.price}</span>
                                <span className="text-xs text-gray-500">/night</span>
                              </h3>

                              {/* Room amenities */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                                  <FiUsers className="h-3 w-3" />
                                  {details.maxOccupancy || 2} Guests
                                </span>

                                {details.mealsIncluded && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700">
                                    {details.mealsIncluded.breakfast
                                      ? 'Breakfast Included'
                                      : 'No Meals'}
                                  </span>
                                )}
                              </div>

                              {/* Amenities */}
                              {details.amenities && details.amenities.length > 0 && (
                                <div className="mt-2">
                                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                                    {details.amenities.slice(0, 3).map((amenity, i) => (
                                      <div key={i} className="inline-flex items-center gap-1">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-3 w-3 text-[#FF8B02]"
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
                                        <span className="text-xs text-gray-600">{amenity}</span>
                                      </div>
                                    ))}
                                    {details.amenities.length > 3 && (
                                      <span
                                        className="text-[#FF8B02] text-xs cursor-pointer hover:underline"
                                        onClick={() =>
                                          setShowAmenitiesModal({
                                            show: true,
                                            roomType: roomType,
                                            amenities: details.amenities || [],
                                          })
                                        }
                                      >
                                        +{details.amenities.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="text-right mt-3 md:mt-0">
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center border border-gray-300 rounded">
                                    <button
                                      type="button"
                                      className={`px-2 py-1 text-sm bg-gray-100 border-r border-gray-300 hover:bg-gray-200 transition-colors ${
                                        details.count <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                      onClick={() => handleRoomOperation(roomType, 'decrement')}
                                      disabled={details.count <= 1}
                                      title={
                                        details.count <= 1
                                          ? 'Minimum 1 room required'
                                          : 'Remove one room'
                                      }
                                    >
                                      -
                                    </button>
                                    <span className="px-3 py-1 text-sm">{details.count}</span>
                                    <button
                                      type="button"
                                      className={`px-2 py-1 text-sm bg-gray-100 border-l border-gray-300 hover:bg-gray-200 transition-colors ${
                                        details.count >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                                      }`}
                                      onClick={() => handleRoomOperation(roomType, 'increment')}
                                      disabled={details.count >= 5}
                                      title={
                                        details.count >= 5
                                          ? 'Maximum 5 rooms of each type'
                                          : 'Add one more room'
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    type="button"
                                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                                    onClick={() => handleRoomOperation(roomType, 'delete')}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Remove
                                  </button>
                                </div>
                                <p
                                  className="text-sm font-medium"
                                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                                >
                                  {details.count} room(s) × ₹{details.price} per night
                                </p>
                                {details.taxRate !== undefined && (
                                  <p
                                    className="text-xs text-gray-500"
                                    style={{ fontFamily: theme.typography.fontFamily.regular }}
                                  >
                                    Including {details.taxRate}% tax
                                  </p>
                                )}
                                <p
                                  className="font-medium text-lg mt-1"
                                  style={{ fontFamily: theme.typography.fontFamily.bold }}
                                >
                                  ₹{details.price * details.count * numberOfNights}
                                </p>
                                <p
                                  className="text-xs text-gray-500"
                                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                                >
                                  for {numberOfNights} night(s)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: theme.colors.heavyMetal,
                    fontFamily: theme.typography.fontFamily.bold,
                    fontSize: theme.typography.fontSize.h5,
                    fontWeight: theme.typography.fontWeight.bold,
                  }}
                >
                  Guest Information
                </h2>
                {guestInfo.length < totalGuests && (
                  <button
                    onClick={() => {
                      setGuestInfo([
                        ...guestInfo,
                        {
                          title: '',
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          specialRequests: '',
                        },
                      ]);
                    }}
                    className="text-sm bg-[#FF8B02] text-white px-4 py-2 rounded-lg hover:bg-[#E67E02] transition-colors"
                    style={{
                      fontFamily: theme.typography.fontFamily.regular,
                      fontSize: theme.typography.fontSize.small,
                    }}
                  >
                    Add Guest
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {guestInfo.map((guest, index) => (
                  <GuestInformationForm
                    key={index}
                    guestNumber={index + 1}
                    guestInfo={guest}
                    onChange={(field, value) =>
                      handleGuestInfoChange(index, field as keyof GuestInformation, value)
                    }
                    isPrimary={index === 0}
                    isRemovable={index !== 0}
                    onRemove={
                      index !== 0
                        ? () => {
                            // Calculate minimum required guests (one per room)
                            const minGuests = selectedRooms
                              ? Object.values(selectedRooms).reduce(
                                  (total, room) => total + room.count,
                                  0
                                )
                              : 1;

                            // Only allow removal if we have more than minimum required guests
                            if (guestInfo.length > minGuests) {
                              const newGuestInfo = [...guestInfo];
                              newGuestInfo.splice(index, 1);
                              setGuestInfo(newGuestInfo);
                            } else {
                              alert(
                                'Cannot remove guest. You need at least one guest per room booked. Consider reducing your room count first if you need fewer guests.'
                              );
                            }
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: theme.colors.heavyMetal,
                    fontFamily: theme.typography.fontFamily.bold,
                    fontSize: theme.typography.fontSize.h5,
                    fontWeight: theme.typography.fontWeight.bold,
                  }}
                >
                  Price Summary
                </h2>
                <div className="space-y-4">
                  {selectedRooms &&
                    Object.entries(selectedRooms).map(([roomType, details]) => (
                      <div
                        key={roomType}
                        className="flex flex-col gap-1 border-b border-gray-100 pb-3"
                        style={{ fontFamily: theme.typography.fontFamily.regular }}
                      >
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">
                            {roomType} ({details.count} × {numberOfNights} nights)
                          </span>
                          <span>₹{details.price * details.count * numberOfNights}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Tax ({details.taxRate !== undefined ? details.taxRate : 10}%)</span>
                          <span>
                            ₹
                            {Math.round(
                              details.price *
                                details.count *
                                numberOfNights *
                                ((details.taxRate !== undefined ? details.taxRate : 10) / 100)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs font-medium text-gray-700">
                          <span>Total with tax</span>
                          <span>
                            ₹
                            {Math.round(
                              details.price *
                                details.count *
                                numberOfNights *
                                (1 + (details.taxRate !== undefined ? details.taxRate : 10) / 100)
                            )}
                          </span>
                        </div>
                      </div>
                    ))}

                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div
                      className="flex justify-between text-sm mb-2"
                      style={{ fontFamily: theme.typography.fontFamily.regular }}
                    >
                      <span>Room Charges</span>
                      <span>₹{calculateTotalPrice()}</span>
                    </div>
                    <div
                      className="flex justify-between text-sm mb-3"
                      style={{ fontFamily: theme.typography.fontFamily.regular }}
                    >
                      <span>Taxes & Fees ({calculateAverageTaxRate()}% avg.)</span>
                      <span>₹{Math.round(calculateTaxAmount())}</span>
                    </div>
                    <div
                      className="flex justify-between font-semibold text-[#FF8B02]"
                      style={{ fontFamily: theme.typography.fontFamily.bold }}
                    >
                      <span>Total Amount</span>
                      <span>₹{Math.round(calculateTotalWithTax())}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleProceedToCheckout}
                    disabled={isBooking}
                    className={`w-full bg-[#FF8B02] text-white py-3 rounded-lg font-medium hover:bg-[#E67E02] transition-colors mt-4 ${
                      isBooking ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    style={{
                      fontFamily: theme.typography.fontFamily.bold,
                      fontSize: theme.typography.fontSize.body,
                      fontWeight: theme.typography.fontWeight.bold,
                    }}
                  >
                    {isBooking ? 'Processing Booking...' : 'Proceed to Checkout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
