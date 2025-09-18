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
  Tooltip
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
  FiInfo
} from 'react-icons/fi';

import NavBar from '@/components/navbar/NavBar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// Services
import { getUserHotelBookings } from '@/services/bookingService';
import { getUserTourBookings } from '@/services/tourBookingService';
import { getUserTransportBookings } from '@/services/transportBookingService';
import { cancelAnyBooking, canCancelBooking, getBookingStatusDisplay, getBookingStatusColor } from '@/services/unifiedBookingService';

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
      <p className="mt-4 text-gray-600 text-sm text-center">
        Loading your bookings...
      </p>
    </div>
  </div>
);

const EmptyState: React.FC<{ type: string; onNavigate: () => void }> = ({ type, onNavigate }) => (
  <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
    <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold mb-2 text-gray-800">
      No {type} Bookings Found
    </h3>
    <p className="text-gray-600 mb-6">
      You haven't made any {type.toLowerCase()} bookings yet.
    </p>
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
  const upcomingCount = bookings.filter(b => 
    ['confirmed', 'pending'].includes(b.status.toLowerCase()) && b.date > new Date()
  ).length;
  
  const completedCount = bookings.filter(b => 
    b.status.toLowerCase() === 'completed' || 
    (['confirmed'].includes(b.status.toLowerCase()) && b.date < new Date())
  ).length;
  
  const cancelledCount = bookings.filter(b => 
    b.status.toLowerCase() === 'cancelled'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-sm font-medium">Upcoming</p>
            <p className="text-2xl font-bold text-blue-800">{upcomingCount}</p>
          </div>
          <FiCalendar className="text-blue-500 text-2xl" />
        </div>
      </div>
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-600 text-sm font-medium">Completed</p>
            <p className="text-2xl font-bold text-green-800">{completedCount}</p>
          </div>
          <FiClock className="text-green-500 text-2xl" />
        </div>
      </div>
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-600 text-sm font-medium">Cancelled</p>
            <p className="text-2xl font-bold text-red-800">{cancelledCount}</p>
          </div>
          <FiX className="text-red-500 text-2xl" />
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
      case 'hotel': return '🏨';
      case 'tour': return '🗺️';
      case 'transport': return '🚗';
      default: return '📋';
    }
  };

  const canCancel = canCancelBooking(booking.status, booking.date);

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getTypeIcon(booking.type)}</span>
            <div>
              <h3 className="font-semibold text-gray-800 line-clamp-1">{booking.title}</h3>
              <p className="text-sm text-gray-500 capitalize">{booking.type} Booking</p>
            </div>
          </div>
          <Chip 
            label={getBookingStatusDisplay(booking.status)} 
            color={getBookingStatusColor(booking.status) as any} 
            size="small" 
          />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FiCalendar className="mr-2" />
            <span>
              {booking.date.toLocaleDateString()}
              {booking.endDate && ` - ${booking.endDate.toLocaleDateString()}`}
            </span>
          </div>
          
          {booking.location && (
            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="mr-2" />
              <span className="line-clamp-1">{booking.location}</span>
            </div>
          )}
          
          {(booking.guests || booking.travelers || booking.passengers) && (
            <div className="flex items-center text-sm text-gray-600">
              <FiUsers className="mr-2" />
              <span>
                {booking.guests && `${booking.guests} Guest${booking.guests > 1 ? 's' : ''}`}
                {booking.travelers && `${booking.travelers} Traveler${booking.travelers > 1 ? 's' : ''}`}
                {booking.passengers && `${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-[#FF8B02]">₹{booking.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <FiEye className="inline mr-1" /> View Details
          </button>
          {canCancel && onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <span>{booking.title}</span>
        <IconButton onClick={onClose} size="small">
          <FiX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Booking Type</p>
              <p className="capitalize">{booking.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <Chip label={booking.status} size="small" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p>{booking.date.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount</p>
              <p className="font-semibold text-[#FF8B02]">₹{booking.amount.toLocaleString()}</p>
            </div>
          </div>
          
          {booking.location && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Location</p>
              <p>{booking.location}</p>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">Booking Details</p>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(booking.originalBooking, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        {onCancel && ['pending', 'confirmed'].includes(booking.status.toLowerCase()) && booking.date > new Date() && (
          <Button onClick={onCancel} color="error">
            Cancel Booking
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
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
    transport: []
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
        location: `${booking.cityName || ''}, ${booking.cityLabel || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || undefined,
        guests: booking.numberOfGuests,
        imageUrl: booking.hotelImageUrls?.[0],
        originalBooking: booking
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
        location: booking.tourStartCity?.name,
        travelers: booking.numberOfTravelers,
        imageUrl: booking.tourImageUrls?.[0],
        originalBooking: booking
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
        originalBooking: booking
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
          getUserTransportBookings()
        ]);

        const newBookings: AllBookings = {
          hotels: hotelResponse.status === 'fulfilled' && hotelResponse.value.success 
            ? hotelResponse.value.data || [] 
            : [],
          tours: tourResponse.status === 'fulfilled' && tourResponse.value.success 
            ? tourResponse.value.data || [] 
            : [],
          transport: transportResponse.status === 'fulfilled' && transportResponse.value.success 
            ? transportResponse.value.data || [] 
            : []
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
        cancellationReason: 'Cancelled by user'
      });

      if (response.success) {
        setSnackbar({
          open: true,
          message: `${booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} booking cancelled successfully.`,
          severity: 'success'
        });
        
        // Refresh the bookings to show updated status
        window.location.reload();
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to cancel booking. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setSnackbar({
        open: true,
        message: 'An error occurred while cancelling the booking. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const filterBookingsByTab = (bookings: UnifiedBooking[], tabIndex: number) => {
    switch (tabIndex) {
      case 0: return bookings; // All
      case 1: return bookings.filter(b => ['confirmed', 'pending'].includes(b.status.toLowerCase()) && b.date > new Date()); // Upcoming
      case 2: return bookings.filter(b => b.status.toLowerCase() === 'completed' || (['confirmed'].includes(b.status.toLowerCase()) && b.date < new Date())); // Past
      case 3: return bookings.filter(b => b.status.toLowerCase() === 'cancelled'); // Cancelled
      default: return bookings;
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
    <div className="min-h-screen bg-gray-50">
      <PageMetadata />
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">Manage all your travel bookings in one place</p>
          </div>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Tooltip title="Refresh bookings">
              <IconButton onClick={handleRefresh} className="bg-white">
                <FiRefreshCcw />
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
              You haven't made any bookings yet. Start exploring our tours, hotels, and transport options!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours" className="px-6 py-3 bg-[#FF8B02] text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Browse Tours
              </Link>
              <Link href="/hotels" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Browse Hotels
              </Link>
              <Link href="/transport" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                Browse Transport
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <BookingStats bookings={unifiedBookings} />

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={currentTab} 
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{
                  '& .MuiTab-root': { 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500
                  },
                  '& .Mui-selected': {
                    color: '#FF8B02 !important'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#FF8B02'
                  }
                }}
              >
                <Tab label={`All (${unifiedBookings.length})`} />
                <Tab label={`Upcoming (${filterBookingsByTab(unifiedBookings, 1).length})`} />
                <Tab label={`Past (${filterBookingsByTab(unifiedBookings, 2).length})`} />
                <Tab label={`Cancelled (${filterBookingsByTab(unifiedBookings, 3).length})`} />
              </Tabs>
            </Box>

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
