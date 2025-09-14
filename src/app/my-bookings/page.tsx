'use client';
import NavBar from '@/components/navbar/NavBar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { getUserHotelBookings, updateBookingStatus } from '@/services/bookingService';
import { BookingStatus, HotelBooking } from '@/types/booking';
import { convertFirestoreTimestamp } from '@/utils/dateUtils';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import BookingCard from '../../components/booking/BookingCard';
import BookingDetailsModal from '../../components/booking/BookingDetailsModal';

// SEO Metadata Component
function PageMetadata() {
  return (
    <Head>
      <title>My Bookings | Way to India</title>
      <meta
        name="description"
        content="View and manage your hotel bookings with Way to India. Check your upcoming stays, past bookings, and cancel reservations if needed."
      />
      <meta
        name="keywords"
        content="hotel bookings, travel bookings, India travel, Way to India, my reservations"
      />
    </Head>
  );
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const theme = useTheme();
  const [authLoading, setAuthLoading] = useState(false);
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<HotelBooking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // useEffect(() => {
  //   // If user is not authenticated and auth is not loading, redirect to login
  //   if (!authLoading && !user) {
  //     router.push("/auth");
  //   }
  // }, [user, authLoading, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await getUserHotelBookings();

        if (response.success && response.data) {
          // Sort bookings by creation date (newest first)
          const sortedBookings = [...response.data].sort((a, b) => {
            const aDate = convertFirestoreTimestamp(a.createdAt);
            const bDate = convertFirestoreTimestamp(b.createdAt);
            return bDate.getTime() - aDate.getTime();
          });
          setBookings(sortedBookings);
        } else {
          setError('Failed to fetch your bookings. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('An error occurred while loading your bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    }
  }, [token]);

  const handleViewDetails = (booking: HotelBooking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const response = await updateBookingStatus(bookingId, BookingStatus.CANCELLED);

      if (response.success) {
        // Update local state to reflect the cancellation
        setBookings(
          bookings.map(booking =>
            booking.id === bookingId ? { ...booking, status: BookingStatus.CANCELLED } : booking
          )
        );
      } else {
        setError('Failed to cancel booking. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError('An error occurred while cancelling your booking. Please try again.');
    }
  };

  // Group bookings by status
  const upcomingBookings = bookings.filter(booking => {
    const checkInDate = convertFirestoreTimestamp(booking.checkInDate);
    // Case insensitive comparison
    return (
      booking.status.toLowerCase() === BookingStatus.CONFIRMED.toLowerCase() &&
      checkInDate > new Date()
    );
  });

  const pastBookings = bookings.filter(booking => {
    const checkOutDate = convertFirestoreTimestamp(booking.checkOutDate);
    return (
      booking.status.toLowerCase() === BookingStatus.COMPLETED.toLowerCase() ||
      (booking.status.toLowerCase() === BookingStatus.CONFIRMED.toLowerCase() &&
        checkOutDate < new Date())
    );
  });

  const cancelledBookings = bookings.filter(
    booking => booking.status.toLowerCase() === BookingStatus.CANCELLED.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageMetadata />
      <NavBar />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
              style={{ borderColor: theme.colors.carrotOrange }}
            ></div>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <FiInfo className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3
              className="text-lg font-semibold mb-2"
              style={{
                color: theme.colors.heavyMetal,
                fontFamily: theme.typography.fontFamily.bold,
              }}
            >
              No Bookings Found
            </h3>
            <p
              className="text-gray-600 mb-4"
              style={{ fontFamily: theme.typography.fontFamily.regular }}
            >
              You haven't made any hotel bookings yet.
            </p>
            <button
              onClick={() => router.push('/hotels')}
              className="px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              style={{
                backgroundColor: theme.colors.carrotOrange,
                color: theme.colors.milkWhite,
                fontFamily: theme.typography.fontFamily.bold,
              }}
            >
              Browse Hotels
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Bookings */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                Upcoming Bookings
              </h2>
              {upcomingBookings.length === 0 ? (
                <p
                  className="text-gray-600 italic"
                  style={{ fontFamily: theme.typography.fontFamily.light }}
                >
                  No upcoming bookings
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => handleViewDetails(booking)}
                      onCancelBooking={() => handleCancelBooking(booking.id)}
                      showCancelButton={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Past Bookings */}
            <div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.bold,
                }}
              >
                Past Bookings
              </h2>
              {pastBookings.length === 0 ? (
                <p
                  className="text-gray-600 italic"
                  style={{ fontFamily: theme.typography.fontFamily.light }}
                >
                  No past bookings
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => handleViewDetails(booking)}
                      onCancelBooking={() => {}}
                      showCancelButton={false}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Cancelled Bookings */}
            {cancelledBookings.length > 0 && (
              <div>
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{
                    color: theme.colors.heavyMetal,
                    fontFamily: theme.typography.fontFamily.bold,
                  }}
                >
                  Cancelled Bookings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cancelledBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onViewDetails={() => handleViewDetails(booking)}
                      onCancelBooking={() => {}}
                      showCancelButton={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          booking={selectedBooking}
          onCancelBooking={handleCancelBooking}
        />
      )}
    </div>
  );
}
