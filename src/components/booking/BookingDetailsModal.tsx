'use client';

import React, { useState } from 'react';
import { HotelBooking, BookingStatus } from '@/types/booking';
import { formatDateForDisplay, calculateNights, convertFirestoreTimestamp } from '@/utils/dateUtils';
import { FiX, FiUser, FiClock, FiMail, FiPhone, FiCalendar, FiMessageSquare, FiMapPin, FiHome } from 'react-icons/fi';
import { BsCashStack } from 'react-icons/bs';
import Image from 'next/image';
import placeholderImage from '@/assets/images/destination.png';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: HotelBooking;
  onCancelBooking: (bookingId: string) => Promise<void>;
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  onCancelBooking
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;
  
  // Convert Firestore timestamps to Date objects
  const checkInDate = convertFirestoreTimestamp(booking.checkInDate);
  const checkOutDate = convertFirestoreTimestamp(booking.checkOutDate);
  const createdAt = convertFirestoreTimestamp(booking.createdAt);
  const updatedAt = convertFirestoreTimestamp(booking.updatedAt);

  // Calculate nights between check-in and check-out
  const nights = calculateNights(checkInDate, checkOutDate);
  
  // Check if the booking can be cancelled (only confirmed and future bookings)
  const canBeCancelled = booking.status === BookingStatus.CONFIRMED && 
    checkInDate > new Date();
  
  // Get status display information
  const getStatusInfo = (status: BookingStatus) => {
    switch(status) {
      case BookingStatus.CONFIRMED:
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: 'Confirmed'
        };
      case BookingStatus.CANCELLED:
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: 'Cancelled'
        };
      case BookingStatus.COMPLETED:
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          text: 'Completed'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: 'Pending'
        };
    }
  };

  const statusInfo = getStatusInfo(booking.status);
  
  const handleCancelClick = () => {
    setShowCancelConfirm(true);
  };
  
  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancelBooking(booking.id);
      setShowCancelConfirm(false);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Booking ID and Status */}
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div>
              <p className="text-gray-500 text-sm mb-1">Booking ID</p>
              <p className="text-gray-800 font-medium">{booking.id}</p>
            </div>
            <div className="mt-2 md:mt-0">
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <span className={`${statusInfo.bgColor} ${statusInfo.color} px-3 py-1 rounded-full text-sm font-medium`}>
                {statusInfo.text}
              </span>
            </div>
          </div>
          
          {/* Hotel Details Section (new) */}
          {(booking.hotelName || booking.hotelImageUrls) && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hotel Details</h3>
              <div className="flex flex-col md:flex-row gap-4">
                {booking.hotelImageUrls && booking.hotelImageUrls.length > 0 && (
                  <div className="w-full md:w-1/3 relative h-40 rounded-lg overflow-hidden">
                    <Image
                      src={booking.hotelImageUrls[0]}
                      alt={booking.hotelName || "Hotel"}
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback to placeholder image if hotel image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = placeholderImage.src;
                      }}
                    />
                  </div>
                )}
                <div className="w-full md:w-2/3">
                  {booking.hotelName && (
                    <div className="mb-2">
                      <p className="text-gray-500 text-sm">Hotel Name</p>
                      <p className="text-gray-800 font-medium">
                        {booking.hotelName}
                        {booking.hotelCategory && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            {booking.hotelCategory}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {(booking.cityName || (booking.hotelLocation?.address?.city?.name)) && (
                    <div className="flex items-start mb-2">
                      <FiMapPin className="mt-1 mr-2 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-sm">Location</p>
                        <p className="text-gray-800">{booking.cityName || booking.hotelLocation?.address?.city?.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Booking Details Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Stay Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <FiCalendar className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-sm">Check-in</p>
                  <p className="text-gray-800">{formatDateForDisplay(checkInDate, true)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiCalendar className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-sm">Check-out</p>
                  <p className="text-gray-800">{formatDateForDisplay(checkOutDate, true)}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiClock className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-sm">Duration</p>
                  <p className="text-gray-800">{nights} {nights === 1 ? 'Night' : 'Nights'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FiUser className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-sm">Guests</p>
                  <p className="text-gray-800">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Person' : 'People'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Room Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Room Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">{booking.roomType}</p>
              <div className="flex items-center mb-2">
                <FiUser className="mr-2 text-gray-500" />
                <span className="text-gray-700">For {booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
              </div>
              <div className="flex items-center">
                <BsCashStack className="mr-2 text-gray-500" />
                <span className="text-gray-700">₹{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Guest Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Guest Information</h3>
            <div className="space-y-4">
              {booking.guestNames.map((guest, index) => (
                <div key={index} className="flex items-start">
                  <FiUser className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">{index === 0 ? 'Primary Guest' : `Guest ${index + 1}`}</p>
                    <p className="text-gray-800">{guest}</p>
                  </div>
                </div>
              ))}
              
              {booking.contactEmail && (
                <div className="flex items-start">
                  <FiMail className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Email</p>
                    <p className="text-gray-800">{booking.contactEmail}</p>
                  </div>
                </div>
              )}
              
              {booking.contactPhone && (
                <div className="flex items-start">
                  <FiPhone className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Phone</p>
                    <p className="text-gray-800">{booking.contactPhone}</p>
                  </div>
                </div>
              )}
              
              {booking.specialRequests && (
                <div className="flex items-start">
                  <FiMessageSquare className="mt-1 mr-3 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-sm">Special Requests</p>
                    <p className="text-gray-800">{booking.specialRequests}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-gray-800 font-medium">₹{booking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Booking Date Information */}
          <div className="text-sm text-gray-500 mb-6">
            <p>Booked on: {formatDateForDisplay(createdAt)}</p>
            {updatedAt.getTime() !== createdAt.getTime() && (
              <p>Last updated: {formatDateForDisplay(updatedAt)}</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="border-t pt-6">
            {canBeCancelled && !showCancelConfirm && (
              <button
                onClick={handleCancelClick}
                className="w-full bg-white text-red-600 border border-red-600 py-2 rounded hover:bg-red-50 transition-colors font-medium"
              >
                Cancel this Booking
              </button>
            )}
            
            {showCancelConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="text-red-800 font-semibold mb-2">Are you sure you want to cancel?</h4>
                <p className="text-red-700 text-sm mb-4">This action cannot be undone. Your booking will be cancelled permanently.</p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleConfirmCancel}
                    className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm font-medium"
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
                    disabled={isCancelling}
                  >
                    No, Keep Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
