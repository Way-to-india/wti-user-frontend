export interface Transport {
  id: string;
  title: string;
  description: string;
  price: number;
  taxRate?: number;
  priceWithTax?: number;
  imageUrl?: string;
  imageUrls?: string[];
  amenities?: string[];
  type?: string;
  startCityId: string;
  city_ids?: string[]; // Array of city IDs
  toCity?: string; // For backward compatibility
  duration?: string; // For display purposes
  rating?: number;
  vehicleType?: string;
  vehicleModel?: string;
  rentalCompany?: string;
  rentalType?: string;
  seatCount?: number;
  isActive?: boolean;
  availableVehicles?: number;
  fuelType?: string;
  transmission?: string;
  features?: string[];
  currency?: string;
  basePrice?: number;
  minPassengers?: number;
  maxPassengers?: number;
  // Fixed structure to match backend
  rentalDetails?: {
    title: string;
    description: string;
  };
  rentalRules?: {
    title: string;
    description: string;
  };
  itinerary?: {
    day: number;
    cityId: string;
  }[];
  // For resolved references
  startCity?: {
    id: string;
    name: string;
    label?: string;
  };
  cities?: {
    id: string;
    name: string;
    label?: string;
  }[];
}
