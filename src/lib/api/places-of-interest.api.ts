import apiClient from '@/api/axios';

export interface State {
  id: string;
  slug: string;
  name: string;
  monumentCount: number;
  cityCount: number;
  createdAt: string;
  updatedAt: string;
  cities?: City[];
}

export interface City {
  id: string;
  slug: string;
  name: string;
  state: string;
  stateId: string;
  stateSlug: string;
  monumentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Monument {
  id: string;
  slug: string;
  monumentName: string;
  cityId: string;
  city: string;
  citySlug: string;
  state: string;
  stateSlug: string;
  typeofPlace: string;
  description?: string;
  besttime?: string;
  rating?: number;
  totalRatings?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonumentDetails extends Monument {
  openingtime?: string;
  clossingtime?: string;
  weeklyoff?: string | null;
  entryFees?: {
    indianAdult: number;
    foreignAdult: number;
    indianChild: number;
    foreignChild: number;
    indianCamera: number;
    foreignCamera: number;
    indianVideoCamera: number;
    foreignVideoCamera: number;
  };
  weather?: {
    temperature: string;
    humiditySummer: number;
    humidityWinter: number;
    humidityMonsoon: number;
  };
  connectivity?: {
    road: string;
    rail: string;
    air: string;
  };
  location?: {
    googleMapUrl: string;
    latitude: number;
    longitude: number;
  };
  website?: string | null;
  phone?: string | null;
}

export interface Category {
  slug: string;
  name: string;
  monumentCount: number;
}

export interface Statistics {
  totalStates: number;
  totalCities: number;
  totalMonuments: number;
  totalCategories: number;
}

export interface HomepageData {
  statistics: Statistics;
  states: State[];
  categories: Category[];
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  payload: T;
  statusCode: number;
  timestamp: string;
}

class PlacesOfInterestAPI {
  private baseURL = '/api/places-of-interest';

  private async fetchAPI<T>(endpoint: string): Promise<T> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(`${this.baseURL}${endpoint}`);
      const result = response.data;

      if (!result.status) {
        throw new Error(result.message || 'API request failed');
      }
      return result.payload;
    } catch (error: any) {
      console.error('API Error:', error);
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

  async getHomepageData(): Promise<HomepageData> {
    return this.fetchAPI<HomepageData>('/homepage');
  }

  async getAllStates(): Promise<State[]> {
    return this.fetchAPI<State[]>('/states');
  }

  async getStateBySlug(stateSlug: string): Promise<{ state: State; cities: City[] }> {
    return this.fetchAPI(`/states/${stateSlug}`);
  }

  async getCitiesByState(stateSlug: string): Promise<City[]> {
    return this.fetchAPI<City[]>(`/states/${stateSlug}/cities`);
  }

  async getCityBySlug(citySlug: string): Promise<City> {
    return this.fetchAPI<City>(`/cities/${citySlug}`);
  }

  async getCityDetails(
    stateSlug: string,
    citySlug: string
  ): Promise<{ city: City; monuments: Monument[] }> {
    return this.fetchAPI(`/states/${stateSlug}/cities/${citySlug}`);
  }

  async getMonumentsByCity(
    stateSlug: string,
    citySlug: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    cityName: string;
    citySlug: string;
    stateName: string;
    stateSlug: string;
    monuments: Monument[];
    count: number;
    total: number;
    hasMore: boolean;
  }> {
    return this.fetchAPI(
      `/states/${stateSlug}/cities/${citySlug}/monuments?limit=${limit}&offset=${offset}`
    );
  }

  async getMonumentBySlug(monumentSlug: string): Promise<MonumentDetails> {
    return this.fetchAPI<MonumentDetails>(`/monuments/${monumentSlug}`);
  }

  async getNearbyMonuments(monumentSlug: string, limit: number = 5): Promise<Monument[]> {
    return this.fetchAPI<Monument[]>(`/monuments/${monumentSlug}/nearby?limit=${limit}`);
  }

  async getAllCategories(): Promise<Category[]> {
    return this.fetchAPI<Category[]>('/categories');
  }

  async getMonumentsByCategory(
    categorySlug: string,
    limit: number = 50,
    offset: number = 0,
    stateFilter?: string
  ): Promise<{
    category: Category;
    monuments: Monument[];
    count: number;
    total: number;
    hasMore: boolean;
  }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (stateFilter) params.append('state', stateFilter);

    return this.fetchAPI(`/categories/${categorySlug}?${params.toString()}`);
  }

  async searchMonuments(
    searchTerm: string,
    categoryFilter?: string,
    stateFilter?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ monuments: Monument[]; count: number; total: number; hasMore: boolean }> {
    const params = new URLSearchParams({
      q: searchTerm,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    if (categoryFilter) params.append('category', categoryFilter);
    if (stateFilter) params.append('state', stateFilter);

    return this.fetchAPI(`/search?${params.toString()}`);
  }

  async getStatistics(): Promise<Statistics> {
    return this.fetchAPI<Statistics>('/stats');
  }
}

export const placesOfInterestAPI = new PlacesOfInterestAPI();
export default placesOfInterestAPI;
