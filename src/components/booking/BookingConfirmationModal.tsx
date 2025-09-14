'use client';

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { formatDateForDisplay } from '@/utils/dateUtils';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: {
    bookingId?: string;
    hotelName?: string;
    checkInDate?: Date | string;
    checkOutDate?: Date | string;
    totalAmount?: number;
    taxAmount?: number;
    subtotalAmount?: number;
  };
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  bookingDetails
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiCheck className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
          <p className="text-gray-600 text-center mt-2">
            Your hotel booking has been successfully confirmed.
          </p>
        </div>

        <div className="space-y-4">
          {bookingDetails.bookingId && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Booking ID:</span>
              <span className="text-gray-800">{bookingDetails.bookingId}</span>
            </div>
          )}

          {bookingDetails.hotelName && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Hotel:</span>
              <span className="text-gray-800">{bookingDetails.hotelName}</span>
            </div>
          )}

          {bookingDetails.checkInDate && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Check-in:</span>
              <span className="text-gray-800">{formatDateForDisplay(bookingDetails.checkInDate)}</span>
            </div>
          )}

          {bookingDetails.checkOutDate && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Check-out:</span>
              <span className="text-gray-800">{formatDateForDisplay(bookingDetails.checkOutDate)}</span>
            </div>
          )}

          {bookingDetails.subtotalAmount && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Room Charges:</span>
              <span className="text-gray-800">₹{bookingDetails.subtotalAmount.toLocaleString()}</span>
            </div>
          )}

          {bookingDetails.taxAmount && (
            <div className="flex justify-between">
              <span className="text-gray-600 font-medium">Taxes & Fees:</span>
              <span className="text-gray-800">₹{bookingDetails.taxAmount.toLocaleString()}</span>
            </div>
          )}

          {bookingDetails.totalAmount && (
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-800">Total Amount:</span>
              <span className="text-gray-800">₹{bookingDetails.totalAmount.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 mt-6 pt-6">
          <p className="text-gray-600 text-sm mb-4">
            A confirmation email has been sent to your registered email address with all the details.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/my-bookings'}
              className="w-full bg-orange-500 text-white font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              View All My Bookings
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
