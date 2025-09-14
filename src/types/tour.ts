export interface TourCardProps {
  id?: string;
  imageUrls: string[];
  title: string;
  description?: string;
  price: string;
  rating?: number;
  inclusions?: Inclusion[];
  exclusions?: string[];
  duration?: Duration;
  itinerary?: ItineraryDay[];
  theme?: Theme;
  themes?: Theme[];
  theme_ids?: any[];
  city_ids?: any[];
  startingLocation?: string;
  startCityId?: any;
  bestTime?: string;
  idealFor?: string;
  citiesCovering?: string[];
  faqs?: FAQ[];
  cancellationPolicies?: CancellationPolicy[];
  termsAndConditions?: string[];
  isActive?: boolean;
  isQMS?: boolean;
  isHBS?: boolean;
  isTHBS?: boolean;
}

interface Duration {
  days: number;
  nights: number;
}

export interface Inclusion {
  title: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  plan_of_action: PlanOfAction;
  hotel_ids?: number[];
  transportation_ids?: number[];
  accommodation?: Accommodation; // For frontend display
  transportation?: Transportation; // For frontend display
}

export interface PlanOfAction {
  title: string;
  description: string;
  image_url: string;
}

export interface Accommodation {
  name: string;
  location: string;
  image?: string;
  rating?: number;
  capacity?: string;
  roomSize?: string;
  starRating?: string; 
  roomType?: string;
  amenities?: string[];
}

export interface Transportation {
  type: string;
  route: string;
  image?: string;
  rating?: number;
  capacity?: string;
  category?: string;
  pickupLocation?: string;
  pickupTime?: string;
  features?: string[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface CancellationPolicy {
  daysBeforeDeparture: string;
  refundPercentage: string;
}

export interface Theme {
  id: string;
  label: string;
  name: string;
  description: string;
}

export interface City {
  id: string;
  name: string;
  state_id: string;
  label: string;
}

export interface TourFilters {
  themeId?: string;
  cityId?: string;
  durationDays?: number;
}

export interface TourPagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface TourResponse {
  tours: TourCardProps[];
  pagination: TourPagination;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T | null;
}