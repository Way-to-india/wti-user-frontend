import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';

// Define the City type
export interface City {
  id: string;
  name: string;
  stateId?: string;
  stateName?: string;
  description?: string;
  imageUrl?: string;
  population?: number;
  attractions?: string[];
  // Add additional fields as needed based on your backend model
}

/**
 * Fetches all cities from the API
 */
export const getCities = async (): Promise<ApiResponse<City[]>> => {
  return handleApiCall(
    async () => axios.get(endpoints.cities.getAll),
    "Cities fetched successfully"
  );
};

/**
 * Fetches a specific city by ID
 */
export const getCityById = async (cityId: string): Promise<ApiResponse<City>> => {
  return handleApiCall(
    async () => axios.get(endpoints.cities.getById(cityId)),
    "City details fetched successfully"
  );
};