import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { CreateTransportBookingRequest, TransportBooking, BookingStatus } from '@/types/booking';

export const createTransportBooking = async (bookingData: CreateTransportBookingRequest): Promise<ApiResponse<TransportBooking>> => {
  console.log('Creating transport booking with data:', bookingData);
  return handleApiCall(
    async () => axios.post(endpoints.bookings.createTransportBooking, bookingData),
    "Transport booking created successfully"
  );
};

export const getUserTransportBookings = async (): Promise<ApiResponse<TransportBooking[]>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getUserTransportBookings),
    "Transport bookings retrieved successfully"
  );
};

export const getTransportBooking = async (bookingId: string): Promise<ApiResponse<TransportBooking>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getTransportBooking(bookingId)),
    "Transport booking retrieved successfully"
  );
};

export const updateTransportBookingStatus = async (bookingId: string, status: BookingStatus): Promise<ApiResponse<any>> => {
  return handleApiCall(
    async () => axios.patch(endpoints.bookings.updateTransportBookingStatus(bookingId), { status }),
    "Transport booking status updated successfully"
  );
};

export const cancelTransportBooking = async (bookingId: string, cancellationReason?: string): Promise<ApiResponse<any>> => {
  return handleApiCall(
    async () => axios.patch(endpoints.bookings.cancelTransportBooking(bookingId), { cancellationReason }),
    "Transport booking cancelled successfully"
  );
};

// Helper functions for transport booking calculations
export const calculateTransportBookingTotal = (
  dailyPrice: number,
  numberOfDays: number,
  taxRate: number = 18
): { totalAmount: number; taxAmount: number; finalAmount: number } => {
  const totalAmount = dailyPrice * numberOfDays;
  const taxAmount = Math.round(totalAmount * (taxRate / 100));
  const finalAmount = totalAmount + taxAmount;
  
  return {
    totalAmount,
    taxAmount,
    finalAmount
  };
};

export const calculateNumberOfDays = (startDate: Date | string, endDate: Date | string): number => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(1, diffDays);
};

export const validateTransportBookingData = (data: CreateTransportBookingRequest): string[] => {
  const errors: string[] = [];
  
  if (!data.transportId) {
    errors.push('Transport selection is required');
  }
  
  if (!data.startDate) {
    errors.push('Start date is required');
  }
  
  if (!data.endDate) {
    errors.push('End date is required');
  }
  
  if (data.startDate && data.endDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate <= today) {
      errors.push('Start date must be in the future');
    }
    
    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }
  
  if (!data.numberOfPassengers || data.numberOfPassengers < 1) {
    errors.push('At least one passenger is required');
  }
  
  if (!data.pickupLocation || data.pickupLocation.trim() === '') {
    errors.push('Pickup location is required');
  }
  
  if (!data.dropoffLocation || data.dropoffLocation.trim() === '') {
    errors.push('Drop-off location is required');
  }
  
  if (!data.passengerNames || data.passengerNames.length === 0) {
    errors.push('Passenger names are required');
  } else if (data.passengerNames.length !== data.numberOfPassengers) {
    errors.push('Number of passenger names must match number of passengers');
  }
  
  if (!data.contactEmail) {
    errors.push('Contact email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contactEmail)) {
      errors.push('Valid contact email is required');
    }
  }
  
  if (!data.contactPhone) {
    errors.push('Contact phone is required');
  }
  
  if (data.totalAmount && data.totalAmount <= 0) {
    errors.push('Valid total amount is required');
  }
  
  return errors;
};

// Helper function to format transport booking for display
export const formatTransportBookingForDisplay = (booking: TransportBooking) => {
  const startDate = typeof booking.startDate === 'string' 
    ? new Date(booking.startDate) 
    : new Date(booking.startDate._seconds * 1000);
  const endDate = typeof booking.endDate === 'string' 
    ? new Date(booking.endDate) 
    : new Date(booking.endDate._seconds * 1000);

  return {
    ...booking,
    startDate,
    endDate,
    formattedStartDate: startDate.toLocaleDateString(),
    formattedEndDate: endDate.toLocaleDateString(),
    formattedDateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    numberOfDays: calculateNumberOfDays(startDate, endDate),
  };
};
