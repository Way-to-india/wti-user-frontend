'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import {
  Snackbar,
  Alert,
  AlertColor,
  Tabs,
  Tab,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiClock,
  FiX,
  FiEye,
  FiFilter,
  FiSearch,
  FiDownload,
  FiRefreshCcw,
  FiPlus,
  FiInfo,
} from 'react-icons/fi';

import NavBar from '@/components/layout/navbar/NavBar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// Services
import { getUserHotelBookings } from '@/services/bookingService';
import { getUserTourBookings } from '@/services/tourBookingService';
import { getUserTransportBookings } from '@/services/transportBookingService';
import {
  cancelAnyBooking,
  canCancelBooking,
  getBookingStatusDisplay,
  getBookingStatusColor,
} from '@/services/unifiedBookingService';

// Types
import { HotelBooking, TourBooking, TransportBooking, BookingStatus } from '@/types/booking';
import { convertFirestoreTimestamp } from '@/utils/dateUtils';

// Types for unified booking interface
type AllBookings = {
  hotels: HotelBooking[];
  tours: TourBooking[];
  transport: TransportBooking[];
};

type UnifiedBooking = {
  id: string;
  type: 'hotel' | 'tour' | 'transport';
  title: string;
  status: string;
  date: Date;
  endDate?: Date;
  amount: number;
  location?: string;
  imageUrl?: string;
  guests?: number;
  travelers?: number;
  passengers?: number;
  originalBooking: HotelBooking | TourBooking | TransportBooking;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function PageMetadata() {
  return (
    <Head>
      <title>My Bookings | Way to India</title>
      <meta
        name="description"
        content="View and manage all your bookings with Way to India. Check your tours, hotels, and transport reservations all in one place."
      />
      <meta
        name="keywords"
        content="bookings, travel bookings, tour bookings, hotel bookings, transport bookings, India travel, Way to India, my reservations"
      />
    </Head>
  );
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-64">
    <div className="flex flex-col items-center">
      <CircularProgress sx={{ color: '#FF8B02' }} />
      <p className="mt-4 text-gray-600 text-sm text-center">Loading your bookings...</p>
    </div>
  </div>
);

const EmptyState: React.FC<{ type: string; onNavigate: () => void }> = ({ type, onNavigate }) => (
  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
    <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold mb-2 text-gray-800">No {type} Bookings Found</h3>
    <p className="text-gray-600 mb-6">You haven't made any {type.toLowerCase()} bookings yet.</p>
    <button
      onClick={onNavigate}
      className="px-6 py-3 bg-[#FF8B02] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
    >
      <FiPlus className="inline mr-2" />
      Book {type}
    </button>
  </div>
);

const BookingStats: React.FC<{ bookings: UnifiedBooking[] }> = ({ bookings }) => {
  const upcomingCount = bookings.filter(
    b => ['confirmed', 'pending'].includes(b.status.toLowerCase()) && b.date > new Date()
  ).length;

  const completedCount = bookings.filter(
    b =>
      b.status.toLowerCase() === 'completed' ||
      (['confirmed'].includes(b.status.toLowerCase()) && b.date < new Date())
  ).length;

  const cancelledCount = bookings.filter(b => b.status.toLowerCase() === 'cancelled').length;

  const totalCount = bookings.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-gray-800">{totalCount}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-blue-700">{upcomingCount}</p>
            <p className="text-xs text-blue-500 mt-1">Future trips</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <FiCalendar className="text-blue-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-700">{completedCount}</p>
            <p className="text-xs text-green-500 mt-1">Successful trips</p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
            <FiClock className="text-green-600 text-xl" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-all duration-200 border-l-4 border-l-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-600 text-sm font-medium mb-1">Cancelled</p>
            <p className="text-3xl font-bold text-red-700">{cancelledCount}</p>
            <p className="text-xs text-red-500 mt-1">Refunded trips</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
            <FiX className="text-red-600 text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingCard: React.FC<{
  booking: UnifiedBooking;
  onViewDetails: () => void;
  onCancel?: () => void;
}> = ({ booking, onViewDetails, onCancel }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return {
          icon: '🏨',
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          color: 'text-blue-600',
        };
      case 'tour':
        return {
          icon: '🗺️',
          bg: 'bg-green-50',
          iconBg: 'bg-green-100',
          color: 'text-green-600',
        };
      case 'transport':
        return {
          icon: '🚗',
          bg: 'bg-purple-50',
          iconBg: 'bg-purple-100',
          color: 'text-purple-600',
        };
      default:
        return {
          icon: '📋',
          bg: 'bg-gray-50',
          iconBg: 'bg-gray-100',
          color: 'text-gray-600',
        };
    }
  };

  const typeInfo = getTypeIcon(booking.type);
  const canCancel = canCancelBooking(booking.status, booking.date);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden group">
      {/* Header with image or gradient */}
      <div
        className={`h-32 ${typeInfo.bg} bg-gradient-to-br from-white/20 to-transparent relative overflow-hidden`}
      >
        {booking.imageUrl ? (
          <img
            src={booking.imageUrl}
            alt={booking.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className={`w-16 h-16 ${typeInfo.iconBg} rounded-full flex items-center justify-center text-2xl shadow-sm`}
            >
              {typeInfo.icon}
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Chip
            label={getBookingStatusDisplay(booking.status)}
            color={getBookingStatusColor(booking.status) as any}
            size="small"
            className="shadow-sm font-medium"
          />
        </div>

        {/* Type badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-3 py-1 ${typeInfo.iconBg} ${typeInfo.color} text-xs font-semibold rounded-full capitalize shadow-sm`}
          >
            {booking.type} Booking
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <div className="mb-4">
          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 mb-1">{booking.title}</h3>
          <p className="text-sm text-gray-500">Booking ID: {booking.id.slice(-8).toUpperCase()}</p>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600">
            <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center mr-3">
              <FiCalendar className="text-orange-600 text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {booking.date.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                {booking.endDate && (
                  <span className="text-gray-500">
                    {' - '}
                    {booking.endDate.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </p>
              {booking.endDate && (
                <p className="text-xs text-gray-500">
                  {Math.ceil(
                    (booking.endDate.getTime() - booking.date.getTime()) / (1000 * 60 * 60 * 24)
                  )}{' '}
                  days
                </p>
              )}
            </div>
          </div>

          {booking.location && (
            <div className="flex items-center text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mr-3">
                <FiMapPin className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{booking.location}</p>
              </div>
            </div>
          )}

          {(booking.guests || booking.travelers || booking.passengers) && (
            <div className="flex items-center text-gray-600">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mr-3">
                <FiUsers className="text-green-600 text-sm" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {booking.guests && `${booking.guests} Guest${booking.guests > 1 ? 's' : ''}`}
                  {booking.travelers &&
                    `${booking.travelers} Traveler${booking.travelers > 1 ? 's' : ''}`}
                  {booking.passengers &&
                    `${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-bold text-[#FF8B02]">
              ₹{booking.amount.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF8B02] to-[#FF9922] text-white rounded-xl hover:from-[#E67A02] hover:to-[#E68A22] transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <FiEye className="inline mr-2" /> View Details
          </button>
          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all duration-200 text-sm font-semibold border border-red-100 hover:border-red-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingDetailsModal: React.FC<{
  booking: UnifiedBooking | null;
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
}> = ({ booking, open, onClose, onCancel }) => {
  if (!booking) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return { icon: '🏨', bg: 'bg-blue-50', color: 'text-blue-600' };
      case 'tour':
        return { icon: '🗺️', bg: 'bg-green-50', color: 'text-green-600' };
      case 'transport':
        return { icon: '🚗', bg: 'bg-purple-50', color: 'text-purple-600' };
      default:
        return { icon: '📋', bg: 'bg-gray-50', color: 'text-gray-600' };
    }
  };

  const typeInfo = getTypeIcon(booking.type);
  const originalBooking = booking.originalBooking as any;

  const renderBookingSpecificDetails = () => {
    if (booking.type === 'hotel') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">Hotel Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Hotel Name</p>
                <p className="font-medium">{originalBooking.hotelName || 'Not available'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{originalBooking.hotelCategory || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Room Type</p>
                <p className="font-medium">{originalBooking.roomType || 'Standard Room'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">Booking Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Check-in</p>
                <p className="font-medium">
                  {booking.date.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Check-out</p>
                <p className="font-medium">
                  {booking.endDate?.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">
                  {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                </p>
              </div>
              {originalBooking.guestNames && (
                <div>
                  <p className="text-sm text-gray-500">Guest Names</p>
                  <p className="font-medium">{originalBooking.guestNames.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (booking.type === 'tour') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">Tour Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Tour Name</p>
                <p className="font-medium">{originalBooking.tourTitle || 'Tour Package'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">{originalBooking.tourDuration || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Start City</p>
                <p className="font-medium">
                  {originalBooking.tourStartCity?.name || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">Booking Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Tour Date</p>
                <p className="font-medium">
                  {booking.date.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Travelers</p>
                <p className="font-medium">
                  {booking.travelers} {booking.travelers === 1 ? 'Traveler' : 'Travelers'}
                </p>
              </div>
              {originalBooking.travelerNames && (
                <div>
                  <p className="text-sm text-gray-500">Traveler Names</p>
                  <p className="font-medium">{originalBooking.travelerNames.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (booking.type === 'transport') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">Transport Information</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">
                  {originalBooking.transportTitle || 'Transport Service'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicle Type</p>
                <p className="font-medium">
                  {originalBooking.transportVehicleType || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Seat Capacity</p>
                <p className="font-medium">
                  {originalBooking.transportSeatCount || 'Not specified'} seats
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 border-b pb-2">Journey Details</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">
                  {booking.date.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">
                  {booking.endDate?.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passengers</p>
                <p className="font-medium">
                  {booking.passengers} {booking.passengers === 1 ? 'Passenger' : 'Passengers'}
                </p>
              </div>
              {originalBooking.passengerNames && (
                <div>
                  <p className="text-sm text-gray-500">Passenger Names</p>
                  <p className="font-medium">{originalBooking.passengerNames.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <div className="relative">
        {/* Header */}
        <div className={`${typeInfo.bg} px-6 py-4 border-b`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 ${typeInfo.bg} rounded-full flex items-center justify-center text-xl border-2 border-white shadow-sm`}
              >
                {typeInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{booking.title}</h2>
                <p className={`text-sm ${typeInfo.color} font-medium capitalize`}>
                  {booking.type} Booking
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Chip
                label={getBookingStatusDisplay(booking.status)}
                color={getBookingStatusColor(booking.status) as any}
                size="medium"
                className="font-medium"
              />
              <IconButton
                onClick={onClose}
                size="small"
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX />
              </IconButton>
            </div>
          </div>
        </div>

        <DialogContent className="p-6">
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiCalendar className="mx-auto text-2xl text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">Booking Date</p>
                <p className="font-semibold">
                  {booking.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiMapPin className="mx-auto text-2xl text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold text-xs">{booking.location || 'Not specified'}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FiUsers className="mx-auto text-2xl text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">People</p>
                <p className="font-semibold">
                  {booking.guests || booking.travelers || booking.passengers || 0}
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <span className="block text-2xl text-orange-600 mb-2">₹</span>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-bold text-[#FF8B02]">
                  ₹{booking.amount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="border-t pt-6">{renderBookingSpecificDetails()}</div>

            {/* Contact Information */}
            {(originalBooking.contactEmail || originalBooking.contactPhone) && (
              <div className="bg-blue-50 p-4 rounded-lg border-t">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {originalBooking.contactEmail && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{originalBooking.contactEmail}</p>
                    </div>
                  )}
                  {originalBooking.contactPhone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{originalBooking.contactPhone}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Special Requests */}
            {originalBooking.specialRequests && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                <p className="text-gray-700">{originalBooking.specialRequests}</p>
              </div>
            )}

            {/* Booking ID */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
              Booking ID: <span className="font-mono font-medium">{booking.id}</span>
            </div>
          </div>
        </DialogContent>

        <DialogActions className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex space-x-3 w-full">
            {onCancel &&
              ['pending', 'confirmed'].includes(booking.status.toLowerCase()) &&
              booking.date > new Date() && (
                <Button
                  onClick={onCancel}
                  variant="outlined"
                  color="error"
                  className="flex-1"
                  startIcon={<FiX />}
                >
                  Cancel Booking
                </Button>
              )}
            <Button
              onClick={onClose}
              variant="contained"
              className="flex-1 bg-[#FF8B02] hover:bg-[#E67A02]"
            >
              Close
            </Button>
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const theme = useTheme();

  const [allBookings, setAllBookings] = useState<AllBookings>({
    hotels: [],
    tours: [],
    transport: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<UnifiedBooking | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: '', severity: 'info' });

  // Convert bookings to unified format
  const convertToUnified = (bookings: AllBookings): UnifiedBooking[] => {
    const unified: UnifiedBooking[] = [];

    // Hotel bookings
    bookings.hotels.forEach(booking => {
      unified.push({
        id: booking.id,
        type: 'hotel',
        title: booking.hotelName || 'Hotel Booking',
        status: booking.status,
        date: convertFirestoreTimestamp(booking.checkInDate),
        endDate: convertFirestoreTimestamp(booking.checkOutDate),
        amount: booking.finalAmount || booking.totalAmount,
        location:
          `${booking.cityName || ''}, ${booking.cityLabel || ''}`
            .trim()
            .replace(/^,\s*|,\s*$/g, '') || undefined,
        guests: booking.numberOfGuests,
        imageUrl: booking.hotelImageUrls?.[0],
        originalBooking: booking,
      });
    });

    // Tour bookings
    bookings.tours.forEach(booking => {
      unified.push({
        id: booking.id,
        type: 'tour',
        title: booking.tourTitle || 'Tour Booking',
        status: booking.status,
        date: convertFirestoreTimestamp(booking.tourDate),
        amount: booking.finalAmount || booking.totalAmount,
        location:
          typeof booking.tourStartCity === 'string'
            ? booking.tourStartCity
            : booking.tourStartCity?.name,
        travelers: booking.numberOfTravelers,
        imageUrl: booking.tourImageUrls?.[0],
        originalBooking: booking,
      });
    });

    // Transport bookings
    bookings.transport.forEach(booking => {
      unified.push({
        id: booking.id,
        type: 'transport',
        title: booking.transportTitle || 'Transport Booking',
        status: booking.status,
        date: convertFirestoreTimestamp(booking.startDate),
        endDate: convertFirestoreTimestamp(booking.endDate),
        amount: booking.finalAmount || booking.totalAmount,
        location: `${booking.pickupLocation} → ${booking.dropoffLocation}`,
        passengers: booking.numberOfPassengers,
        imageUrl: booking.transportImageUrls?.[0],
        originalBooking: booking,
      });
    });

    return unified.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const unifiedBookings = convertToUnified(allBookings);

  useEffect(() => {
    const fetchAllBookings = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [hotelResponse, tourResponse, transportResponse] = await Promise.allSettled([
          getUserHotelBookings(),
          getUserTourBookings(),
          getUserTransportBookings(),
        ]);

        const newBookings: AllBookings = {
          hotels:
            hotelResponse.status === 'fulfilled' && hotelResponse.value.success
              ? hotelResponse.value.data || []
              : [],
          tours:
            tourResponse.status === 'fulfilled' && tourResponse.value.success
              ? tourResponse.value.data || []
              : [],
          transport:
            transportResponse.status === 'fulfilled' && transportResponse.value.success
              ? transportResponse.value.data || []
              : [],
        };

        setAllBookings(newBookings);

        // Log any errors
        if (hotelResponse.status === 'rejected') {
          console.warn('Failed to fetch hotel bookings:', hotelResponse.reason);
        }
        if (tourResponse.status === 'rejected') {
          console.warn('Failed to fetch tour bookings:', tourResponse.reason);
        }
        if (transportResponse.status === 'rejected') {
          console.warn('Failed to fetch transport bookings:', transportResponse.reason);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to load your bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [token]);

  const handleViewDetails = (booking: UnifiedBooking) => {
    setSelectedBooking(booking);
    setDetailsModalOpen(true);
  };

  const handleCancelBooking = async (booking: UnifiedBooking) => {
    try {
      const response = await cancelAnyBooking({
        bookingId: booking.id,
        bookingType: booking.type,
        cancellationReason: 'Cancelled by user',
      });

      if (response.success) {
        setSnackbar({
          open: true,
          message: `${
            booking.type.charAt(0).toUpperCase() + booking.type.slice(1)
          } booking cancelled successfully.`,
          severity: 'success',
        });

        // Refresh the bookings to show updated status
        window.location.reload();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to cancel booking. Please try again.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while cancelling the booking. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const filterBookingsByTab = (bookings: UnifiedBooking[], tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return bookings; // All
      case 1:
        return bookings.filter(
          b => ['confirmed', 'pending'].includes(b.status.toLowerCase()) && b.date > new Date()
        ); // Upcoming
      case 2:
        return bookings.filter(
          b =>
            b.status.toLowerCase() === 'completed' ||
            (['confirmed'].includes(b.status.toLowerCase()) && b.date < new Date())
        ); // Past
      case 3:
        return bookings.filter(b => b.status.toLowerCase() === 'cancelled'); // Cancelled
      default:
        return bookings;
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-16 text-center">
          <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Please Log In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your bookings.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-[#FF8B02] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-orange-50/30">
      <PageMetadata />
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-orange-600 bg-clip-text text-transparent mb-2">
              My Bookings
            </h1>
            <p className="text-lg text-gray-600">Manage all your travel bookings in one place</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Tooltip title="Refresh bookings">
              <IconButton
                onClick={handleRefresh}
                className="bg-white shadow-sm border hover:shadow-md transition-shadow"
              >
                <FiRefreshCcw className="text-orange-600" />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <strong className="font-semibold">Error:</strong> {error}
          </div>
        ) : unifiedBookings.length === 0 ? (
          <div className="text-center py-16">
            <FiInfo className="mx-auto text-6xl text-gray-400 mb-6" />
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">No Bookings Found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't made any bookings yet. Start exploring our tours, hotels, and transport
              options!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tours"
                className="px-6 py-3 bg-[#FF8B02] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
              >
                Browse Tours
              </Link>
              <Link
                href="/hotels"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Browse Hotels
              </Link>
              <Link
                href="/transport"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Browse Transport
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <BookingStats bookings={unifiedBookings} />

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={currentTab}
                  onChange={(e, newValue) => setCurrentTab(newValue)}
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      minHeight: '60px',
                      padding: '12px 24px',
                    },
                    '& .Mui-selected': {
                      color: '#FF8B02 !important',
                      backgroundColor: 'rgba(255, 139, 2, 0.08)',
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#FF8B02',
                      height: '3px',
                    },
                    '& .MuiTabs-flexContainer': {
                      background: 'linear-gradient(90deg, #fafafa 0%, #ffffff 100%)',
                    },
                  }}
                >
                  <Tab
                    label={
                      <div className="flex items-center space-x-2">
                        <span>📊</span>
                        <span>All ({unifiedBookings.length})</span>
                      </div>
                    }
                  />
                  <Tab
                    label={
                      <div className="flex items-center space-x-2">
                        <span>🕰️</span>
                        <span>Upcoming ({filterBookingsByTab(unifiedBookings, 1).length})</span>
                      </div>
                    }
                  />
                  <Tab
                    label={
                      <div className="flex items-center space-x-2">
                        <span>✅</span>
                        <span>Past ({filterBookingsByTab(unifiedBookings, 2).length})</span>
                      </div>
                    }
                  />
                  <Tab
                    label={
                      <div className="flex items-center space-x-2">
                        <span>❌</span>
                        <span>Cancelled ({filterBookingsByTab(unifiedBookings, 3).length})</span>
                      </div>
                    }
                  />
                </Tabs>
              </Box>
            </div>

            {/* Tab Panels */}
            {[0, 1, 2, 3].map(tabIndex => {
              const filteredBookings = filterBookingsByTab(unifiedBookings, tabIndex);
              return (
                <TabPanel key={tabIndex} value={currentTab} index={tabIndex}>
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">
                        No {['', 'upcoming', 'past', 'cancelled'][tabIndex]} bookings found
                      </h3>
                      <p className="text-gray-600">
                        {tabIndex === 1 && "You don't have any upcoming bookings."}
                        {tabIndex === 2 && "You don't have any past bookings."}
                        {tabIndex === 3 && "You don't have any cancelled bookings."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredBookings.map(booking => (
                        <BookingCard
                          key={`${booking.type}-${booking.id}`}
                          booking={booking}
                          onViewDetails={() => handleViewDetails(booking)}
                          onCancel={() => handleCancelBooking(booking)}
                        />
                      ))}
                    </div>
                  )}
                </TabPanel>
              );
            })}
          </>
        )}
      </div>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedBooking(null);
        }}
        onCancel={() => selectedBooking && handleCancelBooking(selectedBooking)}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
