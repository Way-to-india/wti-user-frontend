import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { CreateHotelBookingRequest, HotelBooking, BookingStatus } from '@/types/booking';

export const createHotelBooking = async (bookingData: CreateHotelBookingRequest): Promise<ApiResponse<HotelBooking>> => {
  console.log('Creating hotel booking with data:', bookingData);
  return handleApiCall(
    async () => axios.post(endpoints.bookings.createHotelBooking, bookingData),
    "Hotel booking created successfully"
  );
};

export const getUserHotelBookings = async (): Promise<ApiResponse<HotelBooking[]>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getUserHotelBookings),
    "Hotel bookings retrieved successfully"
  );
};

export const getHotelBooking = async (bookingId: string): Promise<ApiResponse<HotelBooking>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getHotelBooking(bookingId)),
    "Hotel booking retrieved successfully"
  );
};

export const updateBookingStatus = async (bookingId: string, status: BookingStatus): Promise<ApiResponse<any>> => {
  return handleApiCall(
    async () => axios.patch(endpoints.bookings.updateHotelBookingStatus(bookingId), { status }),
    "Hotel booking status updated successfully"
  );
};

export const cancelHotelBooking = async (bookingId: string, cancellationReason?: string): Promise<ApiResponse<any>> => {
  return handleApiCall(
    async () => axios.patch(endpoints.bookings.cancelHotelBooking(bookingId), { cancellationReason }),
    "Hotel booking cancelled successfully"
  );
};
