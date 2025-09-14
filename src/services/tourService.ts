import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { getCities as fetchCitiesFromAPI } from '@/services/cityService';

interface GetToursParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: {
    cityId?: string;
    durationDays?: number;
    themeId?: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  label: string;
}

export interface City {
  id: string;
  name: string;
  label: string;
  state_id: string;
}

// Sample fallback tour data for when API call fails
const fallbackTours = [
  {
    id: "1",
    title: "Golden Triangle Tour",
    description: "Explore Delhi, Agra and Jaipur in luxury",
    price: 15999,
    rating: 4.8,
    imageUrls: ["/assets/images/indian_building_scene.png"],
    location: "Delhi",
    duration_count: 6
  },
  {
    id: "2",
    title: "Kerala Backwaters Experience",
    description: "Serene houseboat journey through God's own country",
    price: 12599,
    rating: 4.7,
    imageUrls: ["/assets/images/destination.png"],
    location: "Kerala",
    duration_count: 5
  },
  {
    id: "3",
    title: "Rajasthan Heritage Tour",
    description: "Royal palaces, forts and cultural experiences",
    price: 18999,
    rating: 4.9,
    imageUrls: ["/assets/images/indian_building_scene.png"],
    location: "Jaipur",
    duration_count: 7
  }
];

export const getTours = async (params?: GetToursParams): Promise<ApiResponse<any>> => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params?.filters?.cityId) queryParams.append('cityId', params.filters.cityId);
  if (params?.filters?.durationDays !== undefined && params?.filters?.durationDays !== null) {
    queryParams.append('durationDays', params.filters.durationDays.toString());
  }
  if (params?.filters?.themeId) queryParams.append('themeId', params.filters.themeId);

  const url = `${endpoints.tours.getTours}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  try {
    return await handleApiCall(async () => axios.get(url), "Tours fetched successfully");
  } catch (error) {
    console.error("Error fetching tours, using fallback data:", error);
    // Return fallback data in a format similar to what the API would return
    return {
      success: true,
      message: "Fallback tours data loaded",
      data: {
        tours: fallbackTours,
        pagination: {
          totalItems: fallbackTours.length,
          currentPage: 1,
          totalPages: 1
        }
      },
      statusCode: 200,
      error: null
    };
  }
};

export const getThemes = async (): Promise<ApiResponse<Theme[]>> => {
  return handleApiCall(async () => axios.get(endpoints.themes.getAll), "Themes fetched successfully");
};

// Updated to use the centralized cityService
export const getCities = async (): Promise<ApiResponse<City[]>> => {
  try {
    const response = await fetchCitiesFromAPI();
    
    // Transform city data to match the expected format in the tours page
    if (response.success && response.data) {
      const formattedCities = response.data.map((city: any) => ({
        id: city.id,
        name: city.name,
        label: city.name, // Using name as label for consistency
        state_id: city.stateId || ''
      }));
      
      return {
        success: true,
        message: "Cities fetched successfully",
        data: formattedCities,
        statusCode: 200,
        error: null
      };
    }
    
    // If response was not successful, return an empty array
    return {
      success: false,
      message: "Failed to fetch cities",
      data: [],
      statusCode: 400,
      error: "API Error"
    };
  } catch (error) {
    console.error("Error fetching cities:", error);
    return {
      success: false,
      message: "Failed to fetch cities",
      data: [],
      statusCode: 500,
      error: "Error fetching cities"
    };
  }
};

export const getTourById = async (tourId: string): Promise<ApiResponse<any>> => {
  return handleApiCall(async () => axios.get(`${endpoints.tours.getTours}/${tourId}`), "Tour details fetched successfully");
};
