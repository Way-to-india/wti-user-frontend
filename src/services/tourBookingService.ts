import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { CreateTourBookingRequest, TourBooking, BookingStatus } from '@/types/booking';

export const createTourBooking = async (bookingData: CreateTourBookingRequest): Promise<ApiResponse<TourBooking>> => {
  console.log('Creating tour booking with data:', bookingData);
  return handleApiCall(
    async () => axios.post(endpoints.bookings.createTourBooking, bookingData),
    "Tour booking created successfully"
  );
};

export const getUserTourBookings = async (): Promise<ApiResponse<TourBooking[]>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getUserTourBookings),
    "Tour bookings retrieved successfully"
  );
};

export const getTourBooking = async (bookingId: string): Promise<ApiResponse<TourBooking>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getTourBooking(bookingId)),
    "Tour booking retrieved successfully"
  );
};

export const updateTourBookingStatus = async (bookingId: string, status: BookingStatus): Promise<ApiResponse<any>> => {
  return handleApiCall(
    async () => axios.patch(endpoints.bookings.updateTourBookingStatus(bookingId), { status }),
    "Tour booking status updated successfully"
  );
};

export const cancelTourBooking = async (bookingId: string, cancellationReason?: string): Promise<ApiResponse<any>> => {
  return handleApiCall(
    async () => axios.patch(endpoints.bookings.cancelTourBooking(bookingId), { cancellationReason }),
    "Tour booking cancelled successfully"
  );
};

// Helper functions for tour booking calculations
export const calculateTourBookingTotal = (
  basePrice: number,
  numberOfTravelers: number,
  taxRate: number = 18
): { totalAmount: number; taxAmount: number; finalAmount: number } => {
  const totalAmount = basePrice * numberOfTravelers;
  const taxAmount = Math.round(totalAmount * (taxRate / 100));
  const finalAmount = totalAmount + taxAmount;
  
  return {
    totalAmount,
    taxAmount,
    finalAmount
  };
};

export const validateTourBookingData = (data: CreateTourBookingRequest): string[] => {
  const errors: string[] = [];
  
  if (!data.tourId) {
    errors.push('Tour selection is required');
  }
  
  if (!data.tourDate) {
    errors.push('Tour date is required');
  } else {
    const tourDate = new Date(data.tourDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (tourDate <= today) {
      errors.push('Tour date must be in the future');
    }
  }
  
  if (!data.numberOfTravelers || data.numberOfTravelers < 1) {
    errors.push('At least one traveler is required');
  }
  
  if (!data.travelerNames || data.travelerNames.length === 0) {
    errors.push('Traveler names are required');
  } else if (data.travelerNames.length !== data.numberOfTravelers) {
    errors.push('Number of traveler names must match number of travelers');
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
