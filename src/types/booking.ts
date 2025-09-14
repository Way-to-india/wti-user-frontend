export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  COMPLETED = "completed"
}

export interface MealsIncluded {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface RoomDetails {
  roomType: string;
  count: number;
  price: number;
  maxOccupancy?: number;
  amenities?: string[];
  mealsIncluded?: MealsIncluded;
  imageUrls?: string[];
  taxRate?: number;
  priceWithTax?: number;
}

export interface GuestInformation {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

export interface CreateHotelBookingRequest {
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  roomType: string;
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  guestNames: string[];
}

export interface HotelBooking {
  id: string;
  hotelId: string;
  checkInDate: string | { _seconds: number; _nanoseconds: number };
  checkOutDate: string | { _seconds: number; _nanoseconds: number };
  numberOfGuests: number;
  roomType: string;
  totalAmount: number;
  subtotalAmount?: number;
  taxAmount?: number;
  taxRate?: number;
  status: BookingStatus;
  createdAt: string | { _seconds: number; _nanoseconds: number };
  updatedAt: string | { _seconds: number; _nanoseconds: number };
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  guestNames: string[];
  type: string;
  // New fields from the updated API response
  hotelName?: string;
  hotelCategory?: string;
  hotelImageUrls?: string[];
  hotelLocation?: any; // Using any for now as we don't have the exact structure
  cityName?: string;
  cityLabel?: string;
}
