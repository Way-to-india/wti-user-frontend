import { cancelTourBooking } from './tourBookingService';
import { updateBookingStatus } from './bookingService';
import { cancelTransportBooking } from './transportBookingService';
import { BookingStatus } from '@/types/booking';
import { ApiResponse } from '@/types/apiResponse';

export type BookingType = 'hotel' | 'tour' | 'transport';

export interface UnifiedCancelRequest {
  bookingId: string;
  bookingType: BookingType;
  cancellationReason?: string;
}

/**
 * Cancel any type of booking using the appropriate service
 */
export const cancelAnyBooking = async (request: UnifiedCancelRequest): Promise<ApiResponse<any>> => {
  const { bookingId, bookingType, cancellationReason } = request;

  try {
    switch (bookingType) {
      case 'hotel':
        // Hotel bookings use the general booking service
        return await updateBookingStatus(bookingId, BookingStatus.CANCELLED);
        
      case 'tour':
        // Tour bookings have their own cancellation endpoint
        return await cancelTourBooking(bookingId, cancellationReason);
        
      case 'transport':
        // Transport bookings have their own cancellation endpoint
        return await cancelTransportBooking(bookingId, cancellationReason);
        
      default:
        return {
          success: false,
          message: `Unsupported booking type: ${bookingType}`,
          data: null,
          error: 'Invalid booking type'
        };
    }
  } catch (error) {
    console.error(`Error cancelling ${bookingType} booking:`, error);
    return {
      success: false,
      message: `Failed to cancel ${bookingType} booking`,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Update booking status for any type of booking
 */
export const updateAnyBookingStatus = async (
  bookingId: string, 
  bookingType: BookingType, 
  status: BookingStatus
): Promise<ApiResponse<any>> => {
  try {
    switch (bookingType) {
      case 'hotel':
        return await updateBookingStatus(bookingId, status);
        
      case 'tour':
        // Import dynamically to avoid circular dependencies
        const { updateTourBookingStatus } = await import('./tourBookingService');
        return await updateTourBookingStatus(bookingId, status);
        
      case 'transport':
        const { updateTransportBookingStatus } = await import('./transportBookingService');
        return await updateTransportBookingStatus(bookingId, status);
        
      default:
        return {
          success: false,
          message: `Unsupported booking type: ${bookingType}`,
          data: null,
          error: 'Invalid booking type'
        };
    }
  } catch (error) {
    console.error(`Error updating ${bookingType} booking status:`, error);
    return {
      success: false,
      message: `Failed to update ${bookingType} booking status`,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Helper function to determine if a booking can be cancelled
 */
export const canCancelBooking = (status: string, date: Date): boolean => {
  const normalizedStatus = status.toLowerCase();
  const now = new Date();
  
  // Only allow cancellation for pending or confirmed bookings that are in the future
  return ['pending', 'confirmed'].includes(normalizedStatus) && date > now;
};

/**
 * Helper function to get user-friendly status display
 */
export const getBookingStatusDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
    // Legacy status mappings
    active: 'Confirmed',
    inactive: 'Cancelled'
  };
  
  return statusMap[status.toLowerCase()] || status;
};

/**
 * Helper function to get status color for UI components
 */
export const getBookingStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'cancelled':
      return 'error';
    case 'completed':
      return 'info';
    default:
      return 'default';
  }
};
