'use client';

import React from 'react';
import { HotelBooking, TourBooking, TransportBooking, BookingStatus, AnyBooking } from '@/types/booking';
import { formatDateForDisplay, convertFirestoreTimestamp } from '@/utils/dateUtils';
import { FiCalendar, FiClock, FiUser, FiHome, FiMapPin, FiTruck } from 'react-icons/fi';
import { BsCashStack } from 'react-icons/bs';
import { MdTour } from 'react-icons/md';
import Image from 'next/image';
import placeholderImage from '@/assets/images/destination.png';
import placeholderTransport from '@/assets/images/placeholder-transport.png';

interface BookingCardProps {
  booking: AnyBooking;
  onViewDetails: () => void;
  onCancelBooking: () => void;
  showCancelButton: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onViewDetails,
  onCancelBooking,
  showCancelButton
}) => {
  // Determine booking type and get appropriate data
  const isHotelBooking = 'hotelId' in booking;
  const isTourBooking = 'tourId' in booking;
  const isTransportBooking = 'transportId' in booking;
  
  // Convert Firestore timestamps to Date objects based on booking type
  let primaryDate: Date;
  let secondaryDate: Date | null = null;
  
  if (isHotelBooking) {
    primaryDate = convertFirestoreTimestamp((booking as HotelBooking).checkInDate);
    secondaryDate = convertFirestoreTimestamp((booking as HotelBooking).checkOutDate);
  } else if (isTourBooking) {
    primaryDate = convertFirestoreTimestamp((booking as TourBooking).tourDate);
  } else if (isTransportBooking) {
    primaryDate = convertFirestoreTimestamp((booking as TransportBooking).startDate);
    secondaryDate = convertFirestoreTimestamp((booking as TransportBooking).endDate);
  } else {
    primaryDate = new Date();
  }
  
  // Calculate if primary date is within 3 days
  const isUpcoming = primaryDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  
  // Get status color and badge text
  const getStatusInfo = (status: string) => {
    const statusLower = status.toLowerCase();
    
    switch(statusLower) {
      case BookingStatus.CONFIRMED.toLowerCase():
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Confirmed'
        };
      case BookingStatus.CANCELLED.toLowerCase():
        return {
          color: 'bg-red-100 text-red-800',
          text: 'Cancelled'
        };
      case BookingStatus.COMPLETED.toLowerCase():
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'Completed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Pending'
        };
    }
  };
  
  const statusInfo = getStatusInfo(booking.status);
  
  // Get booking-specific data
  const getBookingImage = () => {
    if (isHotelBooking) {
      const hotelBooking = booking as HotelBooking;
      return hotelBooking.hotelImageUrls && hotelBooking.hotelImageUrls.length > 0 
        ? hotelBooking.hotelImageUrls[0] 
        : placeholderImage;
    } else if (isTourBooking) {
      const tourBooking = booking as TourBooking;
      return tourBooking.tourImageUrls && tourBooking.tourImageUrls.length > 0 
        ? tourBooking.tourImageUrls[0] 
        : placeholderImage;
    } else if (isTransportBooking) {
      const transportBooking = booking as TransportBooking;
      return transportBooking.transportImageUrls && transportBooking.transportImageUrls.length > 0 
        ? transportBooking.transportImageUrls[0] 
        : placeholderTransport;
    }
    return placeholderImage;
  };
  
  const getBookingTitle = () => {
    if (isHotelBooking) {
      const hotelBooking = booking as HotelBooking;
      return hotelBooking.hotelName || 'Hotel Booking';
    } else if (isTourBooking) {
      const tourBooking = booking as TourBooking;
      return tourBooking.tourTitle || 'Tour Booking';
    } else if (isTransportBooking) {
      const transportBooking = booking as TransportBooking;
      return transportBooking.transportTitle || 'Transport Booking';
    }
    return 'Booking';
  };
  
  const getBookingSubtitle = () => {
    if (isHotelBooking) {
      const hotelBooking = booking as HotelBooking;
      return hotelBooking.hotelCategory;
    } else if (isTourBooking) {
      const tourBooking = booking as TourBooking;
      return tourBooking.tourDuration 
        ? `${tourBooking.tourDuration.days} Days / ${tourBooking.tourDuration.nights} Nights`
        : undefined;
    } else if (isTransportBooking) {
      const transportBooking = booking as TransportBooking;
      return `${transportBooking.transportVehicleType} - ${transportBooking.transportVehicleModel}`;
    }
    return undefined;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image area with appropriate image based on booking type */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={getBookingImage()}
          alt={getBookingTitle()}
          fill
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            // Fallback to appropriate placeholder image
            const target = e.target as HTMLImageElement;
            target.src = isTransportBooking ? placeholderTransport.src : placeholderImage.src;
          }}
        />
        
        {/* Status badge */}
        <div className={`absolute top-4 right-4 ${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium`}>
          {statusInfo.text}
        </div>
        
        {/* Booking type badge */}
        <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          {isHotelBooking && <FiHome className="h-3 w-3" />}
          {isTourBooking && <MdTour className="h-3 w-3" />}
          {isTransportBooking && <FiTruck className="h-3 w-3" />}
          {isHotelBooking && 'Hotel'}
          {isTourBooking && 'Tour'}
          {isTransportBooking && 'Transport'}
        </div>
        
        {/* Upcoming badge */}
        {isUpcoming && booking.status === BookingStatus.CONFIRMED && (
          <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Upcoming
          </div>
        )}
      </div>
      
      {/* Content area */}
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-1">Booking ID: {booking.id.substring(0, 8)}...</div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {getBookingTitle()}
          {getBookingSubtitle() && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {getBookingSubtitle()}
            </span>
          )}
        </h3>
        
        <div className="space-y-2 mb-4">
          {/* Date information */}
          <div className="flex items-center text-gray-600">
            <FiCalendar className="mr-2 flex-shrink-0" />
            <span>
              {isHotelBooking && (
                `${formatDateForDisplay(primaryDate)} - ${formatDateForDisplay(secondaryDate!)}`
              )}
              {isTourBooking && formatDateForDisplay(primaryDate)}
              {isTransportBooking && (
                `${formatDateForDisplay(primaryDate)} - ${formatDateForDisplay(secondaryDate!)}`
              )}
            </span>
          </div>
          
          {/* Traveler/Guest/Passenger information */}
          <div className="flex items-center text-gray-600">
            <FiUser className="mr-2 flex-shrink-0" />
            <span>
              {isHotelBooking && `${(booking as HotelBooking).numberOfGuests} ${(booking as HotelBooking).numberOfGuests === 1 ? 'Guest' : 'Guests'}`}
              {isTourBooking && `${(booking as TourBooking).numberOfTravelers} ${(booking as TourBooking).numberOfTravelers === 1 ? 'Traveler' : 'Travelers'}`}
              {isTransportBooking && `${(booking as TransportBooking).numberOfPassengers} ${(booking as TransportBooking).numberOfPassengers === 1 ? 'Passenger' : 'Passengers'}`}
            </span>
          </div>
          
          {/* Type-specific information */}
          {isHotelBooking && (
            <div className="flex items-center text-gray-600">
              <FiHome className="mr-2 flex-shrink-0" />
              <span>{(booking as HotelBooking).roomType}</span>
            </div>
          )}
          
          {isTransportBooking && (
            <div className="flex items-center text-gray-600">
              <FiTruck className="mr-2 flex-shrink-0" />
              <span>
                {(booking as TransportBooking).pickupLocation} → {(booking as TransportBooking).dropoffLocation}
              </span>
            </div>
          )}
          
          {/* Location information */}
          {isHotelBooking && ((booking as HotelBooking).cityName || ((booking as HotelBooking).hotelLocation?.address?.city?.name)) && (
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-2 flex-shrink-0" />
              <span>{(booking as HotelBooking).cityName || (booking as HotelBooking).hotelLocation?.address?.city?.name}</span>
            </div>
          )}
          
          {isTourBooking && (booking as TourBooking).tourStartCity && (
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-2 flex-shrink-0" />
              <span>{(booking as TourBooking).tourStartCity}</span>
            </div>
          )}
          
          {/* Price information */}
          <div className="flex items-center text-gray-600">
            <BsCashStack className="mr-2 flex-shrink-0" />
            <span>₹{(booking.finalAmount || booking.totalAmount).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onViewDetails}
            className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          
          {showCancelButton && booking.status === BookingStatus.CONFIRMED && (
            <button
              onClick={onCancelBooking}
              className="flex-1 bg-white text-red-600 border border-red-600 py-2 rounded hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
