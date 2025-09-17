'use client';
import React,{ useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import BookingConfirmationModal from '@/components/booking/BookingConfirmationModal';
import ErrorModal from '@/components/ErrorModal';
import NavBar from '@/components/navbar/NavBar';
import {
  HotelInfoCard,
  DateSelection,
  RoomDetailsSection, 
  PriceSummary,
  AmenitiesModal,
  GuestInformationSection,
} from './components';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { createHotelBooking } from '@/services/bookingService';
import { getHotelById } from '@/services/hotelService';

import { Hotel } from '@/types/hotel';
import { RoomDetails, GuestInformation, BookingDetails } from '@/types/booking';
import { useBookingCalculations } from '@/app/hooks/useBookingCalculation';
import { formatDateForAPI } from '@/utils/dateUtils';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, any>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Breadcrumb Component
const Breadcrumb: React.FC<{ hotelDetails: Hotel | null }> = ({ hotelDetails }) => (
  <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm overflow-x-auto">
      <Link href="/" className="text-gray-600 hover:text-[#FF8B02] whitespace-nowrap">
        Home
      </Link>
      <span className="text-gray-400 flex-shrink-0">→</span>
      <Link href="/hotels" className="text-gray-600 hover:text-[#FF8B02] whitespace-nowrap">
        Hotels
      </Link>
      <span className="text-gray-400 flex-shrink-0">→</span>
      {hotelDetails?.id && (
        <>
          <Link
            href={`/hotels/${hotelDetails.id}`}
            className="text-gray-600 hover:text-[#FF8B02] truncate"
          >
            {hotelDetails.name}
          </Link>
          <span className="text-gray-400 flex-shrink-0">→</span>
        </>
      )}
      <span className="text-[#FF8B02] font-medium whitespace-nowrap">Booking</span>
    </div>
  </div>
);

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center p-4">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8B02]"></div>
      <p className="mt-4 text-gray-600 text-sm sm:text-base text-center">
        Loading your booking details...
      </p>
    </div>
  </div>
);

// Error Component
const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen bg-white">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
        <Link href="/hotels" className="text-[#FF8B02] font-medium hover:underline">
          Go back to Hotels
        </Link>
      </div>
    </div>
  </div>
);

// Custom hooks
const useBookingData = () => {
  const [selectedRooms, setSelectedRooms] = useState<{ [key: string]: RoomDetails } | null>(null);
  const [hotelDetails, setHotelDetails] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roomsData = localStorage.getItem('selectedRooms');
        const hotelId = localStorage.getItem('selectedHotelId');

        if (!roomsData || !hotelId) {
          setError('No booking information found. Please select a hotel and rooms first.');
          return;
        }

        const parsedRooms = JSON.parse(roomsData);
        const response = await getHotelById(hotelId);

        if (response.success && response.data) {
          const hotelData = response.data as Hotel;
          setHotelDetails(hotelData);

          const enhancedRooms: { [key: string]: RoomDetails } = {};
          Object.entries(parsedRooms).forEach(([roomType, details]: [string, any]) => {
            const hotelRoom = hotelData.rooms?.find((r: any) => r.roomType === roomType);
            enhancedRooms[roomType] = {
              ...details,
              maxOccupancy: hotelRoom?.maxOccupancy,
              amenities: hotelRoom?.amenities,
              mealsIncluded: hotelRoom?.mealsIncluded,
              imageUrls: hotelRoom?.imageUrls,
              taxRate: hotelRoom?.taxRate,
              priceWithTax: hotelRoom?.priceWithTax,
            };
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

  return { selectedRooms, setSelectedRooms, hotelDetails, loading, error };
};

const useDateSelection = () => {
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [numberOfNights, setNumberOfNights] = useState(1);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      setNumberOfNights(Math.max(1, nights));
    }
  }, [checkInDate, checkOutDate]);

  return {
    checkInDate,
    checkOutDate,
    numberOfNights,
    setCheckInDate,
    setCheckOutDate,
  };
};

const useGuestManagement = (selectedRooms: { [key: string]: RoomDetails } | null) => {
  const [guestInfo, setGuestInfo] = useState<GuestInformation[]>([]);
  const [totalGuests, setTotalGuests] = useState(0);

  useEffect(() => {
    if (selectedRooms) {
      const maxGuests = Object.values(selectedRooms).reduce(
        (total, room) => total + (room.maxOccupancy || 2) * room.count,
        0
      );
      setTotalGuests(maxGuests);

      const minGuests = Object.values(selectedRooms).reduce((total, room) => total + room.count, 0);

      if (guestInfo.length < minGuests) {
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
        setGuestInfo(prev => [...prev, ...newGuestInfo]);
      }
    }
  }, [selectedRooms]);

  const handleGuestInfoChange = (index: number, field: keyof GuestInformation, value: string) => {
    const newGuestInfo = [...guestInfo];
    newGuestInfo[index] = { ...newGuestInfo[index], [field]: value };
    setGuestInfo(newGuestInfo);
  };

  const addGuest = () => {
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
  };

  const removeGuest = (index: number) => {
    const newGuestInfo = [...guestInfo];
    newGuestInfo.splice(index, 1);
    setGuestInfo(newGuestInfo);
  };

  return {
    guestInfo,
    totalGuests,
    handleGuestInfoChange,
    addGuest,
    removeGuest,
  };
};

// Main BookingPage Component
export default function BookingPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user, token } = useAuth();

  // Custom hooks
  const { selectedRooms, setSelectedRooms, hotelDetails, loading, error } = useBookingData();
  const { checkInDate, checkOutDate, numberOfNights, setCheckInDate, setCheckOutDate } =
    useDateSelection();
  const { guestInfo, totalGuests, handleGuestInfoChange, addGuest, removeGuest } =
    useGuestManagement(selectedRooms);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Modal states
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});
  const [showAmenitiesModal, setShowAmenitiesModal] = useState<{
    show: boolean;
    roomType: string;
    amenities: string[];
  }>({
    show: false,
    roomType: '',
    amenities: [],
  });

  // Room operations handler
  const handleRoomOperation = (
    roomType: string,
    operation: 'increment' | 'decrement' | 'delete'
  ) => {
    if (!selectedRooms) return;

    let updatedRooms = { ...selectedRooms };

    switch (operation) {
      case 'increment':
        if (updatedRooms[roomType].count >= 5) {
          setSnackbar({
            open: true,
            message: 'Maximum 5 rooms of each type can be booked at once',
            severity: 'warning',
          });
          return;
        }
        updatedRooms[roomType] = {
          ...updatedRooms[roomType],
          count: updatedRooms[roomType].count + 1,
        };
        break;

      case 'decrement':
        if (updatedRooms[roomType].count <= 1) return;
        updatedRooms[roomType] = {
          ...updatedRooms[roomType],
          count: updatedRooms[roomType].count - 1,
        };
        break;

      case 'delete':
        delete updatedRooms[roomType];
        break;
    }

    // Check if all rooms are deleted
    if (Object.keys(updatedRooms).length === 0) {
      setSnackbar({
        open: true,
        message: 'You have removed all rooms. Redirecting...',
        severity: 'info',
      });
      router.push('/hotels');
      return;
    }

    setSelectedRooms(updatedRooms);
    localStorage.setItem('selectedRooms', JSON.stringify(updatedRooms));
  };

  // Show amenities modal handler
  const handleShowAmenities = (roomType: string, amenities: string[]) => {
    setShowAmenitiesModal({
      show: true,
      roomType,
      amenities,
    });
  };

  // Booking validation and processing
  const validateBooking = () => {
    if (!checkInDate || !checkOutDate) {
      setSnackbar({
        open: true,
        message: 'Please select check-in and check-out dates',
        severity: 'error',
      });
      return false;
    }

    if (!selectedRooms || Object.keys(selectedRooms).length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one room to proceed',
        severity: 'error',
      });
      return false;
    }

    const primaryGuest = guestInfo[0];
    if (
      !primaryGuest?.firstName ||
      !primaryGuest?.lastName ||
      !primaryGuest?.email ||
      !primaryGuest?.phone
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required information for the primary guest',
        severity: 'error',
      });
      return false;
    }

    const incompleteGuests = guestInfo.some(guest => !guest.firstName || !guest.lastName);
    if (incompleteGuests) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required information for the primary guest',
        severity: 'error',
      });
      return false;
    }

    if (!user || !token) {
      setSnackbar({
        open: true,
        message: 'Please log in to continue with booking',
        severity: 'error',
      });
      router.push('/auth/login');
      return false;
    }

    return true;
  };

  const { totalPrice, taxAmount, totalWithTax } = useBookingCalculations(
    selectedRooms,
    numberOfNights
  );

  const handleProceedToCheckout = async () => {
    if (!validateBooking()) return;

    try {
      setIsBooking(true);

      const mainRoomType = Object.keys(selectedRooms!)[0];
      const guestNames = guestInfo.map(g => `${g.firstName} ${g.lastName}`);

      const bookingData = {
        hotelId: hotelDetails?.id || '',
        checkInDate: formatDateForAPI(checkInDate!),
        checkOutDate: formatDateForAPI(checkOutDate!),
        numberOfGuests: guestInfo.length,
        roomType: mainRoomType,
        totalAmount: Math.round(totalWithTax),
        subtotalAmount: Math.round(totalPrice),
        taxAmount: Math.round(taxAmount),
        specialRequests: guestInfo[0].specialRequests || '',
        contactPhone: guestInfo[0].phone,
        contactEmail: guestInfo[0].email,
        guestNames: guestNames,
      };

      const response = await createHotelBooking(bookingData);

      if (response.success) {
        setBookingDetails({
          bookingId: response.data?.id || 'N/A',
          hotelName: hotelDetails?.name,
          checkInDate: checkInDate!,
          checkOutDate: checkOutDate!,
          subtotalAmount: totalPrice,
          taxAmount: taxAmount,
          totalAmount: Math.round(totalWithTax),
        });

        setBookingSuccess(true);

        // Clear booking data
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

  // Loading and error states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Modals */}
      <BookingConfirmationModal
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false);
          router.push('/');
        }}
        bookingDetails={bookingDetails}
      />

      <ErrorModal
        isOpen={bookingError.show}
        onClose={() => setBookingError({ show: false, message: '' })}
        title="Booking Failed"
        message={bookingError.message}
      />

      <AmenitiesModal
        isOpen={showAmenitiesModal.show}
        roomType={showAmenitiesModal.roomType}
        amenities={showAmenitiesModal.amenities}
        onClose={() => setShowAmenitiesModal({ show: false, roomType: '', amenities: [] })}
      />

      {/* Breadcrumb */}
      <Breadcrumb hotelDetails={hotelDetails} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="w-full xl:w-2/3 space-y-6 sm:space-y-8">
            {/* Hotel Info */}
            {hotelDetails && <HotelInfoCard hotel={hotelDetails} />}

            {/* Date Selection */}
            <DateSelection
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onCheckInChange={setCheckInDate}
              onCheckOutChange={setCheckOutDate}
            />

            {/* Room Details */}
            <RoomDetailsSection
              selectedRooms={selectedRooms}
              numberOfNights={numberOfNights}
              onRoomOperation={handleRoomOperation}
              onShowAmenities={handleShowAmenities}
            />

            {/* Guest Information */}
            <GuestInformationSection
              guestInfo={guestInfo}
              selectedRooms={selectedRooms}
              totalGuests={totalGuests}
              onGuestInfoChange={handleGuestInfoChange}
              onAddGuest={addGuest}
              onRemoveGuest={removeGuest}
            />
          </div>

          {/* Right Column - Price Summary */}
          <div className="w-full xl:w-1/3">
            <div className="sticky top-4 sm:top-8">
              <PriceSummary
                selectedRooms={selectedRooms}
                numberOfNights={numberOfNights}
                isBooking={isBooking}
                onProceedToCheckout={handleProceedToCheckout}
              />
            </div>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
