export interface Transport {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageUrls?: string[];
  amenities?: string[];
  type?: string;
  startCityId: string;
  toCity: string;
  duration?: string;
  rating?: number;
  vehicleType?: string;
  vehicleModel?: string;
  rentalCompany?: string;
  rentalType?: string;
  seatCount?: number;
  currency?: string;
  basePrice?: number;
  minPassengers?: number;
  maxPassengers?: number;
  rentalDetails?: {
    type: string;
    description: string;
  }[];
  rentalRules?: {
    type: string;
    description: string;
  }[];
}
