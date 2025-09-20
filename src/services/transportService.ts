import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { Transport } from '../app/redux/transportSlice';
import { getCities as getCitiesFromCityService } from '@/services/cityService';

// Static data for cities
const cities = [
  { id: '1', name: 'Delhi' },
  { id: '2', name: 'Dehradun' },
  { id: '3', name: 'Badrinath' },
  { id: '4', name: 'Haridwar' },
  { id: '5', name: 'Rishikesh' }
];

// Static data for transport types
export const transportTypes = [
  { id: 'bus', name: 'Bus' },
  { id: 'helicopter', name: 'Helicopter' },
  { id: 'car', name: 'Car' },
  { id: 'horse', name: 'Horse' }
];

// Static data for transports
const transports: Transport[] = [
  {
    id: "K83nzQOD7Ss7SMSft94O",
    title: "Airport Transfer - Luxury",
    description: "Luxury sedan service for airport pickups and drop-offs",
    rentalCompany: "India Premium Transport",
    rentalType: "One-way",
    vehicleModel: "Honda Accord",
    vehicleType: "Sedan",
    seatCount: 4,
    rentalDetails: {
      title: "Service Details",
      description: "Premium airport transfer service with flight tracking, 60 minutes of waiting time, meet and greet at the airport arrival hall."
    },
    rentalRules: {
      title: "Service Policy",
      description: "Free cancellation up to 12 hours before scheduled pickup. Fixed price with no hidden charges."
    },
    imageUrls: [
      "https://images.pexels.com/photos/1209774/pexels-photo-1209774.jpeg",
      "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg"
    ],
    price: 1800,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "2p3bIqXT9oFqW6sXDD9X",
      name: "Mumbai",
      label: "Mumbai"
    },
    cities: [
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      }
    ]
  },
  {
    id: "qhaj2J020gYbeQxEO0s8",
    title: "City Taxi Service - Premium",
    description: "Comfortable air-conditioned taxi service for city exploration with professional drivers",
    rentalCompany: "IndiaWheels",
    rentalType: "Hourly",
    vehicleModel: "Toyota Innova",
    vehicleType: "SUV",
    seatCount: 7,
    rentalDetails: {
      title: "Service Details",
      description: "Includes AC, bottled water, WiFi, and professional chauffeur. Available for 4, 8, or 12-hour bookings."
    },
    rentalRules: {
      title: "Rental Policy",
      description: "Extra charges apply for additional hours. Cancellation allowed up to 24 hours before scheduled pickup with full refund."
    },
    imageUrls: [
      "https://images.pexels.com/photos/4090544/pexels-photo-4090544.jpeg",
      "https://images.pexels.com/photos/4090550/pexels-photo-4090550.jpeg"
    ],
    price: 2500,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "2p3bIqXT9oFqW6sXDD9X",
      name: "Mumbai",
      label: "Mumbai"
    },
    cities: [
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      },
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      }
    ]
  },
  {
    id: "vjcqNFCs11mxl1KGKPy5",
    title: "Golden Triangle Tour Bus",
    description: "Luxury bus service for touring Delhi, Agra, and Jaipur (Golden Triangle)",
    rentalCompany: "Heritage India Tours",
    rentalType: "Multi-day",
    vehicleModel: "Volvo B11R",
    vehicleType: "Coach",
    seatCount: 32,
    rentalDetails: {
      title: "Service Features",
      description: "Luxury coach with reclining seats, onboard restroom, WiFi, personal entertainment systems, guide services, and daily refreshments."
    },
    rentalRules: {
      title: "Tour Policy",
      description: "Price includes all tolls, driver accommodation, and parking fees. Cancellation allowed up to 7 days prior with 85% refund."
    },
    imageUrls: [
      "https://images.pexels.com/photos/6447229/pexels-photo-6447229.jpeg",
      "https://images.pexels.com/photos/6447561/pexels-photo-6447561.jpeg"
    ],
    price: 12000,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "AAZn0QGDbpgQJ020kr21",
      name: "Kolkata",
      label: "Kolkata"
    },
    cities: [
      {
        id: "AAZn0QGDbpgQJ020kr21",
        name: "Kolkata",
        label: "Kolkata"
      },
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      },
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      }
    ]
  },
  {
    id: "UTmbqkAHPhbZfcBWhFvK",
    title: "Private Car with Driver - Economy",
    description: "Affordable private car service with experienced local driver",
    rentalCompany: "Travel Easy India",
    rentalType: "Daily",
    vehicleModel: "Maruti Swift Dzire",
    vehicleType: "Compact Sedan",
    seatCount: 4,
    rentalDetails: {
      title: "Service Details",
      description: "Air-conditioned car with local driver who knows the best routes and attractions. Available for 8 hours daily with 80km limit."
    },
    rentalRules: {
      title: "Rental Terms",
      description: "Additional charges for extra hours/kilometers. Fuel, driver meals, and accommodation included in multi-day bookings."
    },
    imageUrls: [
      "https://images.pexels.com/photos/804130/pexels-photo-804130.jpeg",
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"
    ],
    price: 1500,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "AAZn0QGDbpgQJ020kr21",
      name: "Kolkata",
      label: "Kolkata"
    },
    cities: [
      {
        id: "AAZn0QGDbpgQJ020kr21",
        name: "Kolkata",
        label: "Kolkata"
      }
    ]
  }
];

interface TransportResponse {
  transports: Transport[];
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function getTransports(params?: any): Promise<ApiResponse<TransportResponse>> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  // Enhanced filtering parameters
  if (params?.startCityId) queryParams.append('startCityId', params.startCityId);
  if (params?.vehicleType) queryParams.append('vehicleType', params.vehicleType);
  if (params?.rentalType) queryParams.append('rentalType', params.rentalType);
  if (params?.minPrice !== undefined && params?.minPrice !== null) {
    queryParams.append('minPrice', params.minPrice.toString());
  }
  if (params?.maxPrice !== undefined && params?.maxPrice !== null) {
    queryParams.append('maxPrice', params.maxPrice.toString());
  }
  if (params?.minSeats !== undefined && params?.minSeats !== null) {
    queryParams.append('minSeats', params.minSeats.toString());
  }
  if (params?.maxSeats !== undefined && params?.maxSeats !== null) {
    queryParams.append('maxSeats', params.maxSeats.toString());
  }
  
  // Backward compatibility parameters
  if (params?.type) queryParams.append('type', params.type);
  if (params?.toCity) queryParams.append('toCity', params.toCity);

  const url = `${endpoints.transport.getAll}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    const response = await handleApiCall<TransportResponse>(async () => axios.get(url), "Transports fetched successfully");
    // Ensure the response data has the correct structure
    if (response.success && response.data) {
      return {
        ...response,
        data: {
          transports: response.data.transports || [],
          pagination: response.data.pagination || {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false
          }
        }
      };
    }
    return response;
  } catch (error) {
    console.error("Error fetching transports, using fallback data:", error);
    return {
      success: true,
      message: "Fallback transports data loaded",
      data: {
        transports: transports,
        pagination: {
          totalItems: transports.length,
          currentPage: 1,
          totalPages: 1,
          itemsPerPage: 10,
          hasNextPage: false,
          hasPrevPage: false
        }
      },
      statusCode: 200,
      error: null
    };
  }
}

export async function getCities() {
  // Use the centralized city service for real city data
  return await getCitiesFromCityService();
}

export async function getTransportTypes() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    success: true,
    data: transportTypes
  };
}

export async function getTransportById(id: string): Promise<ApiResponse<any>> {
  return handleApiCall(async () => axios.get(endpoints.transport.getById(id)), "Transport details fetched successfully");
}

export async function getCitiesForTransport() {
  try {
    const response = await getCities();
    
    if (response.success && response.data) {
      return response.data.map(city => ({
        id: city.id,
        label: city.name
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching cities for transport:', error);
    return [];
  }
} 