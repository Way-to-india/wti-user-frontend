import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { HotelCardProps, HotelFilters, HotelResponse } from '@/types/hotel';
import { getCities as fetchCitiesFromAPI } from '@/services/cityService';

interface GetHotelsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: HotelFilters;
}

export const getHotels = async (params?: GetHotelsParams): Promise<ApiResponse<HotelResponse>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  
  if (params?.filters) {
    if (params.filters.cityId) queryParams.append('cityId', params.filters.cityId);
    if (params.filters.category) queryParams.append('category', params.filters.category);
    if (params.filters.minPrice !== undefined && params.filters.minPrice !== null) {
      queryParams.append('minPrice', params.filters.minPrice.toString());
    }
    if (params.filters.maxPrice !== undefined && params.filters.maxPrice !== null) {
      queryParams.append('maxPrice', params.filters.maxPrice.toString());
    }
    if (params.filters.amenityIds?.length) {
      queryParams.append('amenityIds', params.filters.amenityIds.join(','));
    }
    
    // Backward compatibility filters
    if (params.filters.location) queryParams.append('location', params.filters.location);
    if (params.filters.priceRange) queryParams.append('priceRange', params.filters.priceRange);
    if (params.filters.rating) queryParams.append('rating', params.filters.rating.toString());
    if (params.filters.amenities?.length) {
      params.filters.amenities.forEach(amenity => {
        queryParams.append('amenities', amenity);
      });
    }
  }

  const url = `${endpoints.hotels.getAll}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  return handleApiCall(async () => axios.get(url), "Hotels fetched successfully");
};

export const getHotelById = async (hotelId: string): Promise<ApiResponse<HotelCardProps>> => {
  return handleApiCall(
    async () => axios.get(endpoints.hotels.getById(hotelId)), 
    "Hotel details fetched successfully"
  );
};

export const getLocations = async (): Promise<ApiResponse<string[]>> => {
  const response = await fetchCitiesFromAPI();
  
  if (response.success && response.data) {
    // Extract only city names for the hotel locations
    const cityNames = response.data.map(city => city.name);
    return {
      ...response,
      data: cityNames
    };
  }
  
  // Fall back to the original API endpoint if the city service fails
  return handleApiCall(
    async () => axios.get(endpoints.hotels.getLocations), 
    "Hotel locations fetched successfully"
  );
};

export const getAmenities = async (): Promise<ApiResponse<string[]>> => {
  return handleApiCall(
    async () => axios.get(endpoints.hotels.getAmenities), 
    "Hotel amenities fetched successfully"
  );
};

// Added function to fetch city information for enhancing hotel details
export const getCityById = async (cityId: string): Promise<ApiResponse<any>> => {
  return handleApiCall(
    async () => axios.get(endpoints.cities.getById(cityId.toString())),
    "City details fetched successfully"
  );
};

// Function to get similar hotels in the same city
export const getSimilarHotels = async (cityId: string, currentHotelId: string, limit: number = 4): Promise<ApiResponse<HotelResponse>> => {
  const queryParams = new URLSearchParams();
  queryParams.append('cityId', cityId);
  queryParams.append('limit', (limit + 1).toString()); // Request one extra to account for filtering out current hotel
  
  const url = `${endpoints.hotels.getAll}?${queryParams.toString()}`;
  console.log('Requesting similar hotels with URL:', url);
  
  return handleApiCall(
    async () => {
      const response = await axios.get(url);
      console.log('Raw similar hotels API response:', JSON.stringify(response.data));
      
      // The API returns hotels in a nested structure as response.data.hotels
      if (response.data && response.data.data && response.data.data.hotels) {
        // Filter out the current hotel from similar hotels
        response.data.data = response.data.data.hotels.filter(
          (hotel: any) => hotel.id && hotel.id.toString() !== currentHotelId.toString()
        );
        
        console.log('Filtered similar hotels:', response.data.data);
        
        // Ensure we have the correct limit
        if (response.data.data.length > limit) {
          response.data.data = response.data.data.slice(0, limit);
        }
      }
      return response;
    }, 
    "Similar hotels fetched successfully"
  );
};