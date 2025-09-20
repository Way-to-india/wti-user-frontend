'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Snackbar, Alert, AlertColor } from '@mui/material';

import BookingConfirmationModal from '@/components/booking/BookingConfirmationModal';
import ErrorModal from '@/components/ErrorModal';
import TravelerInformationForm from '@/components/booking/TravelerInformationForm';
import NavBar from '@/components/layout/navbar/NavBar';

import { TravelerInformation } from '@/components/booking/TravelerInformationForm';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  createTourBooking,
  calculateTourBookingTotal,
  validateTourBookingData,
} from '@/services/tourBookingService';
import { getTourById } from '@/services/tourService';

import { TourCardProps } from '@/types/tour';
import { BookingDetails } from '@/types/booking';
import { formatDateForAPI } from '@/utils/dateUtils';

interface TourBookingPageProps {
  params: {
    id: string;
  };
}

const Breadcrumb: React.FC<{ tourDetails: TourCardProps | null }> = ({ tourDetails }) => (
  <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm overflow-x-auto">
      <Link href="/" className="text-gray-600 hover:text-[#FF8B02] whitespace-nowrap">
        Home
      </Link>
      <span className="text-gray-400 flex-shrink-0">→</span>
      <Link href="/tours" className="text-gray-600 hover:text-[#FF8B02] whitespace-nowrap">
        Tours
      </Link>
      <span className="text-gray-400 flex-shrink-0">→</span>
      {tourDetails?.id && (
        <>
          <Link
            href={`/tours/${tourDetails.id}`}
            className="text-gray-600 hover:text-[#FF8B02] truncate"
          >
            {tourDetails.title}
          </Link>
          <span className="text-gray-400 flex-shrink-0">→</span>
        </>
      )}
      <span className="text-[#FF8B02] font-medium whitespace-nowrap">Booking</span>
    </div>
  </div>
);

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

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="min-h-screen bg-white">
    <NavBar />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-4 text-sm sm:text-base">{error}</p>
        <Link href="/tours" className="text-[#FF8B02] font-medium hover:underline">
          Go back to Tours
        </Link>
      </div>
    </div>
  </div>
);

const TourInfoCard: React.FC<{ tour: TourCardProps }> = ({ tour }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <div className="flex gap-4">
      {tour.imageUrls && tour.imageUrls.length > 0 && (
        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <img src={tour.imageUrls[0]} alt={tour.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{tour.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          {tour.duration && (
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {tour.duration.days} Days / {tour.duration.nights} Nights
            </span>
          )}
          {tour.startingLocation && (
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {tour.startingLocation}
            </span>
          )}
          <span className="text-[#FF8B02] font-semibold">
            ₹{typeof tour.price === 'number' ? tour.price : tour.price}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const DateSelection: React.FC<{
  tourDate: Date | null;
  onTourDateChange: (date: Date | null) => void;
}> = ({ tourDate, onTourDateChange }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Tour Date</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tour Date *</label>
        <input
          type="date"
          value={tourDate ? tourDate.toISOString().split('T')[0] : ''}
          onChange={e => onTourDateChange(e.target.value ? new Date(e.target.value) : null)}
          min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#FF8B02] focus:border-[#FF8B02] outline-none"
          required
        />
      </div>
    </div>
  </div>
);

const TravelersSelection: React.FC<{
  numberOfTravelers: number;
  onNumberChange: (count: number) => void;
}> = ({ numberOfTravelers, onNumberChange }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Number of Travelers</h3>
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => onNumberChange(Math.max(1, numberOfTravelers - 1))}
        disabled={numberOfTravelers <= 1}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      <span className="text-lg font-semibold text-gray-800 min-w-[3rem] text-center">
        {numberOfTravelers}
      </span>
      <button
        type="button"
        onClick={() => onNumberChange(Math.min(20, numberOfTravelers + 1))}
        disabled={numberOfTravelers >= 20}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
    <p className="text-sm text-gray-600 mt-2">Maximum 20 travelers allowed per booking</p>
  </div>
);

const PriceSummary: React.FC<{
  basePrice: number;
  numberOfTravelers: number;
  isBooking: boolean;
  onProceedToCheckout: () => void;
}> = ({ basePrice, numberOfTravelers, isBooking, onProceedToCheckout }) => {
  const { totalAmount, taxAmount, finalAmount } = calculateTourBookingTotal(
    basePrice,
    numberOfTravelers
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Base Price × {numberOfTravelers} travelers</span>
          <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Taxes & Fees (18%)</span>
          <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-semibold text-lg">
          <span>Total Amount</span>
          <span className="text-[#FF8B02]">₹{finalAmount.toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={onProceedToCheckout}
        disabled={isBooking}
        className="w-full bg-[#FF8B02] text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isBooking ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Confirm Booking'
        )}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        By clicking "Confirm Booking", you agree to our terms and conditions
      </p>
    </div>
  );
};

export default function TourBookingPage({ params }: TourBookingPageProps) {
  const theme = useTheme();
  const router = useRouter();
  const { user, token } = useAuth();

  const [tourDetails, setTourDetails] = useState<TourCardProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tourDate, setTourDate] = useState<Date | null>(null);
  const [numberOfTravelers, setNumberOfTravelers] = useState(1);
  const [travelers, setTravelers] = useState<TravelerInformation[]>([
    {
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: '',
    },
  ]);

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

  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        setLoading(true);
        const response = await getTourById(params.id);

        if (response.success && response.data) {
          setTourDetails(response.data);
        } else {
          setError('Failed to load tour details. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setError('An error occurred while loading the tour. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetails();
  }, [params.id]);

  useEffect(() => {
    if (travelers.length < numberOfTravelers) {
      const newTravelers = [...travelers];
      for (let i = travelers.length; i < numberOfTravelers; i++) {
        newTravelers.push({
          title: '',
          firstName: '',
          lastName: '',
          age: undefined,
          gender: undefined,
        });
      }
      setTravelers(newTravelers);
    } else if (travelers.length > numberOfTravelers) {
      setTravelers(travelers.slice(0, numberOfTravelers));
    }
  }, [numberOfTravelers, travelers.length]);

  const handleTravelerChange = (
    index: number,
    field: keyof TravelerInformation,
    value: string | number
  ) => {
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [field]: value,
    };
    setTravelers(updatedTravelers);
  };

  const handleAddTraveler = () => {
    setNumberOfTravelers(prev => Math.min(20, prev + 1));
  };

  const handleRemoveTraveler = (index: number) => {
    if (numberOfTravelers > 1) {
      setNumberOfTravelers(prev => prev - 1);
    }
  };

  const validateBooking = () => {
    if (!tourDate) {
      setSnackbar({
        open: true,
        message: 'Please select a tour date',
        severity: 'error',
      });
      return false;
    }

    const primaryTraveler = travelers[0];
    if (
      !primaryTraveler?.firstName ||
      !primaryTraveler?.lastName ||
      !primaryTraveler?.email ||
      !primaryTraveler?.phone
    ) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required information for the primary contact',
        severity: 'error',
      });
      return false;
    }

    const incompleteTravelers = travelers.some(
      traveler => !traveler.firstName || !traveler.lastName
    );
    if (incompleteTravelers) {
      setSnackbar({
        open: true,
        message: 'Please fill in first and last names for all travelers',
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

  const handleProceedToCheckout = async () => {
    if (!validateBooking() || !tourDetails) return;

    try {
      setIsBooking(true);

      const basePrice = typeof tourDetails.price === 'string' 
        ? parseFloat(tourDetails.price.replace(/[^0-9.-]+/g, ''))
        : parseFloat(tourDetails.price);
      const { finalAmount } = calculateTourBookingTotal(basePrice, numberOfTravelers);
      const travelerNames = travelers.map(t => `${t.firstName} ${t.lastName}`);

      const bookingData = {
        tourId: tourDetails.id || params.id,
        tourDate: formatDateForAPI(tourDate!),
        numberOfTravelers,
        totalAmount: finalAmount,
        specialRequests: travelers[0].specialRequests || '',
        contactPhone: travelers[0].phone || '',
        contactEmail: travelers[0].email || '',
        travelerNames,
        emergencyContactName: travelers[0].firstName + ' ' + travelers[0].lastName,
        emergencyContactPhone: travelers[0].phone,
      };

      const validationErrors = validateTourBookingData(bookingData);
      if (validationErrors.length > 0) {
        setSnackbar({
          open: true,
          message: validationErrors[0],
          severity: 'error',
        });
        return;
      }

      const response = await createTourBooking(bookingData);

      if (response.success) {
        setBookingDetails({
          bookingId: response.data?.id || 'N/A',
          tourTitle: tourDetails.title,
          tourDate: tourDate!,
          totalAmount: finalAmount,
        });

        setBookingSuccess(true);
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} />;
  if (!tourDetails) return <ErrorState error="Tour not found" />;

  const basePrice = typeof tourDetails.price === 'string' 
    ? parseFloat(tourDetails.price.replace(/[^0-9.-]+/g, ''))
    : parseFloat(tourDetails.price);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      {/* Modals */}
      <BookingConfirmationModal
        isOpen={bookingSuccess}
        onClose={() => {
          setBookingSuccess(false);
          router.push('/my-bookings');
        }}
        bookingDetails={bookingDetails}
      />

      <ErrorModal
        isOpen={bookingError.show}
        onClose={() => setBookingError({ show: false, message: '' })}
        title="Booking Failed"
        message={bookingError.message}
      />

      {/* Breadcrumb */}
      <Breadcrumb tourDetails={tourDetails} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="w-full xl:w-2/3 space-y-6 sm:space-y-8">
            {/* Tour Info */}
            <TourInfoCard tour={tourDetails} />

            {/* Date Selection */}
            <DateSelection tourDate={tourDate} onTourDateChange={setTourDate} />

            {/* Travelers Selection */}
            <TravelersSelection
              numberOfTravelers={numberOfTravelers}
              onNumberChange={setNumberOfTravelers}
            />

            {/* Traveler Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Traveler Information</h3>
              {travelers.map((traveler, index) => (
                <TravelerInformationForm
                  key={index}
                  travelerNumber={index + 1}
                  travelerInfo={traveler}
                  onChange={(field, value) => handleTravelerChange(index, field, value)}
                  isPrimary={index === 0}
                  isRemovable={index > 0}
                  onRemove={() => handleRemoveTraveler(index)}
                  showContactFields={index === 0}
                />
              ))}

              {numberOfTravelers < 20 && (
                <button
                  type="button"
                  onClick={handleAddTraveler}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 text-center text-gray-500 hover:text-[#FF8B02] hover:border-[#FF8B02] transition-colors"
                >
                  <svg
                    className="mx-auto h-8 w-8 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Another Traveler
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="w-full xl:w-1/3">
            <PriceSummary
              basePrice={basePrice}
              numberOfTravelers={numberOfTravelers}
              isBooking={isBooking}
              onProceedToCheckout={handleProceedToCheckout}
            />
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
