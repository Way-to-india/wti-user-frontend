export interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ImageData {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type InputSize = 'sm' | 'md' | 'lg';
export type CardVariant = 'default' | 'outlined' | 'elevated';
