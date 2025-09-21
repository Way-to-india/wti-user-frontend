export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// Alias for different booking types - all use the same status values
export const TourBookingStatus = BookingStatus;
export const TransportBookingStatus = BookingStatus;
export const HotelBookingStatus = BookingStatus;

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
  finalAmount: number;
  status: BookingStatus | string;
  createdAt: string | { _seconds: number; _nanoseconds: number };
  updatedAt: string | { _seconds: number; _nanoseconds: number };
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  guestNames: string[];
  type: string;
  numberOfNights?: number;
  paymentId?: string;
  cancellationReason?: string;
  isReviewEligible?: boolean;
  reviewId?: string;
  // Enriched fields from API
  hotelName?: string;
  hotelCategory?: string;
  hotelImageUrls?: string[];
  hotelLocation?: any;
  hotelDescription?: string;
  cityName?: string;
  cityLabel?: string;
}

// Note: Duplicate interfaces removed - using the ones defined above

export interface BookingDetails {
  bookingId?: string;
  hotelName?: string;
  tourTitle?: string;
  transportTitle?: string;
  checkInDate?: Date | string;
  checkOutDate?: Date | string;
  startDate?: Date | string;
  endDate?: Date | string;
  tourDate?: Date | string;
  totalAmount?: number;
  subtotalAmount?: number;
  taxAmount?: number;
}

// Tour Booking Types
export interface CreateTourBookingRequest {
  tourId: string;
  tourDate: string | Date;
  numberOfTravelers: number;
  totalAmount: number;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  travelerNames: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dietaryRequirements?: string;
  accommodationRequests?: string;
}

export interface TourBooking {
  id: string;
  tourId: string;
  tourDate: string | { _seconds: number; _nanoseconds: number };
  numberOfTravelers: number;
  totalAmount: number;
  taxAmount?: number;
  finalAmount: number;
  status: BookingStatus | string;
  createdAt: string | { _seconds: number; _nanoseconds: number };
  updatedAt: string | { _seconds: number; _nanoseconds: number };
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  travelerNames: string[];
  type: string;
  paymentId?: string;
  cancellationReason?: string;
  isReviewEligible: boolean;
  reviewId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dietaryRequirements?: string;
  accommodationRequests?: string;
  // Enriched data from API
  tourTitle?: string;
  tourDescription?: string;
  tourDuration?: { days: number; nights: number };
  tourImageUrls?: string[];
  tourStartCity?: { name?: string; label?: string } | string;
  tourThemes?: any[];
  tourInclusions?: any[];
  tourExclusions?: any[];
  tourItinerary?: any[];
  tourFaqs?: any[];
  tourLanguages?: any[];
  tourCancellationPolicy?: any;
}

// Transport Booking Types
export interface CreateTransportBookingRequest {
  transportId: string;
  startDate: string | Date;
  endDate: string | Date;
  numberOfPassengers: number;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  passengerNames: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  drivenByOwner?: boolean;
  withDriver?: boolean;
}

export interface TransportBooking {
  id: string;
  transportId: string;
  startDate: string | { _seconds: number; _nanoseconds: number };
  endDate: string | { _seconds: number; _nanoseconds: number };
  numberOfPassengers: number;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  taxAmount?: number;
  finalAmount: number;
  status: BookingStatus | string;
  createdAt: string | { _seconds: number; _nanoseconds: number };
  updatedAt: string | { _seconds: number; _nanoseconds: number };
  specialRequests?: string;
  contactPhone?: string;
  contactEmail?: string;
  passengerNames: string[];
  type: string;
  numberOfDays: number;
  paymentId?: string;
  cancellationReason?: string;
  isReviewEligible: boolean;
  reviewId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  drivenByOwner?: boolean;
  withDriver?: boolean;
  // Enriched data from API
  transportTitle?: string;
  transportDescription?: string;
  transportVehicleType?: string;
  transportVehicleModel?: string;
  transportSeatCount?: number;
  transportImageUrls?: string[];
  transportRentalCompany?: string;
  transportRentalType?: string;
  transportRentalDetails?: any;
  transportRentalRules?: any;
}

// Generic booking type for unified handling
export type AnyBooking = HotelBooking | TourBooking | TransportBooking;

// Traveler/Passenger information
export interface TravelerInformation {
  title: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  idType?: 'passport' | 'aadhar' | 'driving_license' | 'voter_id';
  idNumber?: string;
}

export interface PassengerInformation extends TravelerInformation {
  seatPreference?: string;
}
