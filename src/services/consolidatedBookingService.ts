import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { HotelBooking, TourBooking, TransportBooking } from '@/types/booking';

export interface ConsolidatedBookingsResponse {
  hotels: {
    success: boolean;
    data: HotelBooking[];
    error?: string;
  };
  tours: {
    success: boolean;
    data: TourBooking[];
    error?: string;
  };
  transport: {
    success: boolean;
    data: TransportBooking[];
    error?: string;
  };
}

export interface BookingStatsResponse {
  total: {
    count: number;
  };
  hotels: {
    count: number;
    success: boolean;
  };
  tours: {
    count: number;
    success: boolean;
  };
  transport: {
    count: number;
    success: boolean;
  };
}

export const getAllUserBookings = async (): Promise<ApiResponse<ConsolidatedBookingsResponse>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getAllUserBookings),
    "All bookings retrieved successfully"
  );
};

export const getBookingStats = async (): Promise<ApiResponse<BookingStatsResponse>> => {
  return handleApiCall(
    async () => axios.get(endpoints.bookings.getBookingStats),
    "Booking statistics retrieved successfully"
  );
};

// Helper function to extract individual booking arrays from consolidated response
export const extractBookingsFromConsolidated = (consolidated: ConsolidatedBookingsResponse) => {
  return {
    hotels: consolidated.hotels.success ? consolidated.hotels.data : [],
    tours: consolidated.tours.success ? consolidated.tours.data : [],
    transport: consolidated.transport.success ? consolidated.transport.data : []
  };
};

// Helper function to get total booking count
export const getTotalBookingsCount = (consolidated: ConsolidatedBookingsResponse): number => {
  return (consolidated.hotels.data?.length || 0) + 
         (consolidated.tours.data?.length || 0) + 
         (consolidated.transport.data?.length || 0);
};

// Helper function to get errors from consolidated response
export const getBookingErrors = (consolidated: ConsolidatedBookingsResponse): string[] => {
  const errors: string[] = [];
  
  if (!consolidated.hotels.success && consolidated.hotels.error) {
    errors.push(`Hotel bookings: ${consolidated.hotels.error}`);
  }
  
  if (!consolidated.tours.success && consolidated.tours.error) {
    errors.push(`Tour bookings: ${consolidated.tours.error}`);
  }
  
  if (!consolidated.transport.success && consolidated.transport.error) {
    errors.push(`Transport bookings: ${consolidated.transport.error}`);
  }
  
  return errors;
};
