import apiClient from '@/api/axios';

// Types
export interface State {
  id: string;
  name: string;
  cityCount: number;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  citySlug: string;
  stateName?: string;
}

export interface CityDetails {
  id: string;
  city: string;
  state: string;
  citySlug: string;
  stateSlug: string;
  introduction?: string;
  facts?: string;
  foodAndDining?: string;
  shopping?: string;
  nearbyPlaces?: string;
  placesToSeeTop?: string;
  placesToSeeBottom?: string;
  gettingAround?: string;
  historyCulture?: string;
  otherDetails?: string;
  bestTimeToVisit?: string;
  hotelDetails?: string;
  cityImage?: string;
  isActive: boolean;
}

// Updated API Response type (matches your backend)
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  payload: T;
}

class TravelGuideAPI {
  /**
   * Generic method to handle API calls with axios
   * Automatically handles the response structure from your backend
   */
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      const result = response.data;

      if (!result.status) {
        throw new Error(result.message || 'API request failed');
      }

      return result.payload;
    } catch (error: any) {
      if (error.response) {
        const serverError = error.response.data;
        throw new Error(serverError.message || 'Server error occurred');
      } else if (error.request) {
        throw new Error('Network error - please check your connection');
      } else {
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  /**
   * GET /api/travel-guide/states
   * Get all states with their cities
   */
  async getAllStatesWithCities(): Promise<State[]> {
    return this.fetchAPI<State[]>('/api/travel-guide/states');
  }

  /**
   * GET /api/travel-guide/states/:stateId/cities
   * Get cities by specific state
   */
  async getCitiesByState(stateId: string): Promise<{ state: State; cities: City[] }> {
    return this.fetchAPI(`/api/travel-guide/states/${stateId}/cities`);
  }

  /**
   * GET /api/travel-guide/cities/:cityId
   * Get detailed city information by ID
   */
  async getCityDetails(cityId: string): Promise<CityDetails> {
    return this.fetchAPI<CityDetails>(`/api/travel-guide/cities/${cityId}`);
  }

  /**
   * GET /api/travel-guide/cities/slug/:citySlug
   * Get city details by slug
   */
  async getCityDetailsBySlug(citySlug: string, stateSlug?: string): Promise<CityDetails> {
    const query = stateSlug ? `?stateSlug=${stateSlug}` : '';
    return this.fetchAPI<CityDetails>(`/api/travel-guide/cities/slug/${citySlug}${query}`);
  }

  /**
   * GET /api/travel-guide/cities/search
   * Search cities by name
   */
  async searchCities(query: string): Promise<City[]> {
    return this.fetchAPI<City[]>(`/api/travel-guide/cities/search?q=${encodeURIComponent(query)}`);
  }
}

// Export singleton instance
export const travelGuideAPI = new TravelGuideAPI();
export default TravelGuideAPI;
