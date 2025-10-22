// lib/api/places-of-interest.api.ts
import apiClient from '@/api/axios';

export interface State {
  id: string;
  name: string;
  placeCount: number;
  places: Place[];
}

export interface Place {
  id: string;
  name: string;
  placeSlug: string;
  stateName?: string;
}

export interface Monument {
  id: string;
  monumentName: string;
  monumentUrl: string;
  typeOfPlace: string;
  indexImage: string;
  bestTime: string;
  status: string;
  cityName?: string;
  stateName?: string;
}

export interface MonumentDetails {
  id: string;
  monumentName: string;
  cityName: string;
  stateName: string;
  description?: string;
  bestTime?: string;
  temperature?: string;
  humidity?: string;
  connectivity: {
    road?: string;
    rail?: string;
    air?: string;
  };
  timings: {
    opening?: string;
    closing?: string;
    weeklyOff?: string;
  };
  entryFees: {
    indian: {
      adult?: string;
      child?: string;
      camera?: string;
      videoCamera?: string;
    };
    foreign: {
      adult?: string;
      child?: string;
      camera?: string;
      videoCamera?: string;
    };
  };
  googleMap?: string;
  images?: {
    index?: string;
  };
  monumentUrl?: string;
  typeOfPlace?: string;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface MonumentsByPlace {
  place: {
    id: string;
    name: string;
    stateName: string;
  };
  monumentCount: number;
  monuments: Monument[];
}

// API Response type - matches your backend structure
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  payload: T; // Changed from 'data' to 'payload'
}

class PlacesOfInterestAPI {
  /**
   * Generic method to handle API calls with axios
   * Handles the response structure from your backend
   */
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint);
      const result = response.data;

      if (!result.status) {
        throw new Error(result.message || 'API request failed');
      }

      // Return the payload instead of the whole result
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
   * GET /api/places-of-interest/states
   * Get all states with their places
   */
  async getAllStatesWithPlaces(): Promise<State[]> {
    return this.fetchAPI<State[]>('/api/places-of-interest/states');
  }

  /**
   * GET /api/places-of-interest/states/:stateId/places
   * Get places by specific state
   */
  async getPlacesByState(stateId: string): Promise<{ state: any; places: Place[] }> {
    return this.fetchAPI(`/api/places-of-interest/states/${stateId}/places`);
  }

  /**
   * GET /api/places-of-interest/places/:placeId/monuments
   * Get monuments by specific place
   */
  async getMonumentsByPlace(placeId: string): Promise<MonumentsByPlace> {
    return this.fetchAPI<MonumentsByPlace>(`/api/places-of-interest/places/${placeId}/monuments`);
  }

  /**
   * GET /api/places-of-interest/monuments/:monumentId
   * Get monument details by ID
   */
  async getMonumentDetails(monumentId: string): Promise<MonumentDetails> {
    return this.fetchAPI<MonumentDetails>(`/api/places-of-interest/monuments/${monumentId}`);
  }

  /**
   * GET /api/places-of-interest/monuments/slug/:monumentUrl
   * Get monument details by slug
   */
  async getMonumentBySlug(monumentUrl: string): Promise<MonumentDetails> {
    return this.fetchAPI<MonumentDetails>(`/api/places-of-interest/monuments/slug/${monumentUrl}`);
  }

  /**
   * GET /api/places-of-interest/monuments/search
   * Search monuments by term and optional type
   */
  async searchMonuments(searchTerm: string, type?: string): Promise<Monument[]> {
    const query = type
      ? `?q=${encodeURIComponent(searchTerm)}&type=${type}`
      : `?q=${encodeURIComponent(searchTerm)}`;
    return this.fetchAPI<Monument[]>(`/api/places-of-interest/monuments/search${query}`);
  }

  /**
   * GET /api/places-of-interest/monuments/type/:typeOfPlace
   * Get monuments by type with optional limit
   */
  async getMonumentsByType(typeOfPlace: string, limit: number = 50): Promise<Monument[]> {
    return this.fetchAPI<Monument[]>(
      `/api/places-of-interest/monuments/type/${typeOfPlace}?limit=${limit}`
    );
  }

  /**
   * GET /api/places-of-interest/monuments/:monumentId/nearby
   * Get nearby monuments with optional limit
   */
  async getNearbyMonuments(monumentId: string, limit: number = 5): Promise<Monument[]> {
    return this.fetchAPI<Monument[]>(
      `/api/places-of-interest/monuments/${monumentId}/nearby?limit=${limit}`
    );
  }
}

// Export singleton instance
export const placesOfInterestAPI = new PlacesOfInterestAPI();
export default PlacesOfInterestAPI;
