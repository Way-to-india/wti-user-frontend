export interface HotelCardProps {
  id: string;
  name: string;
  description: string;
  location: string;
  pincode?: string;
  rating: number;
  price: string;
  imageUrl: string;
  amenities: string[];
  isActive: boolean;
}

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

export interface HotelDetails extends HotelCardProps {
  imageUrls: string[];
  roomTypes: RoomType[];
  policies: HotelPolicy[];
}

export interface HotelFilters {
  location?: string;
  priceRange?: string;
  rating?: number;
  amenities?: string[];
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface HotelResponse {
  hotels: HotelCardProps[];
  pagination: PaginationData;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 