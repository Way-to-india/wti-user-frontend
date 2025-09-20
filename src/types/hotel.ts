interface FirestoreReference {
  _firestore: {
    projectId: string;
  };
  _path: {
    segments: string[];
  };
  _converter: Record<string, unknown>;
}

// types/hotel.ts - Enhanced types
export interface City {
  id: string;
  city_id: number;
  city_name: string;
  state_id: number;
  image_urls?: string[];
  description?: string;
}

export interface SimilarHotel {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrls: string[];
  userRating?: number;
}

export interface SelectedRoom {
  price: number;
  count: number;
  taxRate?: number;
  priceWithTax?: number;
}

interface Address {
  addressLine1: string;
  addressLine2?: string;
  cityId: FirestoreReference | string;
  stateId: FirestoreReference | string;
  countryId: FirestoreReference | string;
  pinCode: string;
}

interface Location {
  latitude: number;
  longitude: number;
  address: Address;
}

export interface MealsIncluded {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface Room {
  roomType: string;
  maxOccupancy: number;
  mealsIncluded: MealsIncluded;
  price: number;
  taxRate?: number;
  priceWithTax?: number;
  isAvailable: boolean;
  amenities: string[];
  imageUrls: string[];
}

interface PropertyRule {
  type: string;
  description: string;
  isMandatory: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  category: string;
  amenities: string[];
  rooms: Room[];
  price: number;
  imageUrls: string[];
  isAvailable: boolean;
  location: Location;
  propertyRules: PropertyRule[];
  isQMS: boolean;
  isHBS: boolean;
  isTHBS: boolean;
  userRating?: number;
}

export type HotelCardProps = Hotel;

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: string;
  capacity: number;
  amenities: string[];
}

export interface HotelPolicy {
  title: string;
  description: string;
}

export interface HotelFilters {
  cityId?: string;
  category?: string;
  amenityIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string; // Keep for backward compatibility
  rating?: number;
  amenities?: string[]; // Keep for backward compatibility
  location?: string; // Keep for backward compatibility
}

export interface HotelPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface HotelResponse {
  hotels: HotelCardProps[];
  pagination: HotelPagination;
}

