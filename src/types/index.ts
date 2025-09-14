import { DocumentReference } from 'firebase/firestore';

export interface City {
  id: string;
  label: string;
  name: string;
  state_id: DocumentReference | null;
  country_id: DocumentReference | null;
}

export interface Theme {
  id: string;
  label: string;
  name: string;
  description: string;
}

export interface Duration {
  days: number;
  nights: number;
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  duration: Duration;
  isActive: boolean;
  startCityId: DocumentReference | null;
  city_ids: DocumentReference[];
  theme_ids: DocumentReference[];
  imageUrls: string[];
  isQMS: boolean;
  isHBS: boolean;
  isTHBS: boolean;
  // Additional properties as needed
}

export interface TourFilters {
  cityId: string | null;
  themeId: string | null;
  durationDays: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  startDate: string | null;
  endDate: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
  error: string | null;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}
