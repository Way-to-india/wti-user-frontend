'use client';

import React from 'react';
import { HotelBooking, BookingStatus } from '@/types/booking';
import { formatDateForDisplay, convertFirestoreTimestamp } from '@/utils/dateUtils';
import { FiCalendar, FiClock, FiUser, FiHome, FiMapPin } from 'react-icons/fi';
import { BsCashStack } from 'react-icons/bs';
import Image from 'next/image';
import placeholderImage from '@/assets/images/destination.png';

interface BookingCardProps {
  booking: HotelBooking;
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
  // Convert Firestore timestamps to Date objects
  const checkInDate = convertFirestoreTimestamp(booking.checkInDate);
  
  // Calculate if check-in date is within 3 days
  const isUpcoming = checkInDate <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image area with hotel image if available, otherwise placeholder */}
      <div className="relative h-48 w-full bg-gray-200">
        <Image
          src={booking.hotelImageUrls && booking.hotelImageUrls.length > 0 ? booking.hotelImageUrls[0] : placeholderImage}
          alt={booking.hotelName || "Hotel"}
          fill
          style={{ objectFit: 'cover' }}
          onError={(e) => {
            // Fallback to placeholder image if hotel image fails to load
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage.src;
          }}
        />
        
        {/* Status badge */}
        <div className={`absolute top-4 right-4 ${statusInfo.color} px-3 py-1 rounded-full text-xs font-medium`}>
          {statusInfo.text}
        </div>
        
        {/* Upcoming badge */}
        {isUpcoming && booking.status === BookingStatus.CONFIRMED && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Upcoming
          </div>
        )}
      </div>
      
      {/* Content area */}
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-1">Booking ID: {booking.id.substring(0, 8)}...</div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {booking.hotelName || 'Hotel Booking'}
          {booking.hotelCategory && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              {booking.hotelCategory}
            </span>
          )}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FiCalendar className="mr-2 flex-shrink-0" />
            <span>
              {formatDateForDisplay(convertFirestoreTimestamp(booking.checkInDate))} - 
              {formatDateForDisplay(convertFirestoreTimestamp(booking.checkOutDate))}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FiUser className="mr-2 flex-shrink-0" />
            <span>{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <FiHome className="mr-2 flex-shrink-0" />
            <span>{booking.roomType}</span>
          </div>
          
          {(booking.cityName || (booking.hotelLocation?.address?.city?.name)) && (
            <div className="flex items-center text-gray-600">
              <FiMapPin className="mr-2 flex-shrink-0" />
              <span>{booking.cityName || booking.hotelLocation?.address?.city?.name}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <BsCashStack className="mr-2 flex-shrink-0" />
            <span>₹{booking.totalAmount.toLocaleString()}</span>
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
