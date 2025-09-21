'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getCities } from '@/services/cityService';
import { getThemes } from '@/services/tourService';
import { getLocations } from '@/services/hotelService';

// Types
export interface SearchCity {
  id: string;
  name: string;
  label: string;
  stateId?: string;
}

export interface SearchTheme {
  id: string;
  name: string;
  label: string;
  description?: string;
}

export interface SearchLocation {
  id: string;
  name: string;
  label: string;
}

export interface SearchState {
  // Data cache
  cities: SearchCity[];
  themes: SearchTheme[];
  locations: string[];
  
  // Loading states
  citiesLoading: boolean;
  themesLoading: boolean;
  locationsLoading: boolean;
  
  // Error states
  citiesError: string | null;
  themesError: string | null;
  locationsError: string | null;
  
  // Cache timestamps
  citiesCachedAt: number | null;
  themesCachedAt: number | null;
  locationsCachedAt: number | null;
  
  // Search history and analytics
  searchHistory: SearchHistoryItem[];
  popularSearches: PopularSearch[];
}

export interface SearchHistoryItem {
  id: string;
  type: 'hotels' | 'tours' | 'transport';
  query: string;
  timestamp: number;
  filters: Record<string, any>;
}

export interface PopularSearch {
  query: string;
  count: number;
  type: 'hotels' | 'tours' | 'transport';
}

// Action types
type SearchAction =
  | { type: 'SET_CITIES_LOADING'; payload: boolean }
  | { type: 'SET_CITIES'; payload: { cities: SearchCity[]; timestamp: number } }
  | { type: 'SET_CITIES_ERROR'; payload: string | null }
  | { type: 'SET_THEMES_LOADING'; payload: boolean }
  | { type: 'SET_THEMES'; payload: { themes: SearchTheme[]; timestamp: number } }
  | { type: 'SET_THEMES_ERROR'; payload: string | null }
  | { type: 'SET_LOCATIONS_LOADING'; payload: boolean }
  | { type: 'SET_LOCATIONS'; payload: { locations: string[]; timestamp: number } }
  | { type: 'SET_LOCATIONS_ERROR'; payload: string | null }
  | { type: 'ADD_SEARCH_HISTORY'; payload: SearchHistoryItem }
  | { type: 'UPDATE_POPULAR_SEARCHES'; payload: PopularSearch[] };

// Initial state
const initialState: SearchState = {
  cities: [],
  themes: [],
  locations: [],
  citiesLoading: false,
  themesLoading: false,
  locationsLoading: false,
  citiesError: null,
  themesError: null,
  locationsError: null,
  citiesCachedAt: null,
  themesCachedAt: null,
  locationsCachedAt: null,
  searchHistory: [],
  popularSearches: [],
};

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Reducer
function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_CITIES_LOADING':
      return { ...state, citiesLoading: action.payload };
    case 'SET_CITIES':
      return { 
        ...state, 
        cities: action.payload.cities, 
        citiesCachedAt: action.payload.timestamp,
        citiesError: null,
        citiesLoading: false
      };
    case 'SET_CITIES_ERROR':
      return { 
        ...state, 
        citiesError: action.payload,
        citiesLoading: false
      };
    case 'SET_THEMES_LOADING':
      return { ...state, themesLoading: action.payload };
    case 'SET_THEMES':
      return { 
        ...state, 
        themes: action.payload.themes, 
        themesCachedAt: action.payload.timestamp,
        themesError: null,
        themesLoading: false
      };
    case 'SET_THEMES_ERROR':
      return { 
        ...state, 
        themesError: action.payload,
        themesLoading: false
      };
    case 'SET_LOCATIONS_LOADING':
      return { ...state, locationsLoading: action.payload };
    case 'SET_LOCATIONS':
      return { 
        ...state, 
        locations: action.payload.locations, 
        locationsCachedAt: action.payload.timestamp,
        locationsError: null,
        locationsLoading: false
      };
    case 'SET_LOCATIONS_ERROR':
      return { 
        ...state, 
        locationsError: action.payload,
        locationsLoading: false
      };
    case 'ADD_SEARCH_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory].slice(0, 50); // Keep last 50 searches
      return { ...state, searchHistory: newHistory };
    case 'UPDATE_POPULAR_SEARCHES':
      return { ...state, popularSearches: action.payload };
    default:
      return state;
  }
}

// Utility function to normalize search parameters
export const normalizeSearchParams = (searchParams: URLSearchParams, type: 'hotels' | 'tours' | 'transport') => {
  const normalized: Record<string, string> = {};
  
  // Common normalization
  if (type === 'hotels') {
    normalized.cityId = searchParams.get('cityId') || searchParams.get('city') || searchParams.get('location') || '';
    normalized.checkIn = searchParams.get('checkIn') || '';
    normalized.checkOut = searchParams.get('checkOut') || '';
    normalized.guests = searchParams.get('guests') || searchParams.get('numberOfGuests') || '1';
    normalized.adults = searchParams.get('adults') || '1';
    normalized.children = searchParams.get('children') || '0';
    normalized.seniorAdults = searchParams.get('seniorAdults') || '0';
  } else if (type === 'tours') {
    normalized.cityId = searchParams.get('cityId') || searchParams.get('city') || '';
    normalized.themeId = searchParams.get('themeId') || searchParams.get('theme') || '';
    normalized.startDate = searchParams.get('startDate') || searchParams.get('checkIn') || '';
    normalized.endDate = searchParams.get('endDate') || searchParams.get('checkOut') || '';
    normalized.guests = searchParams.get('guests') || searchParams.get('travelers') || searchParams.get('numberOfTravelers') || '1';
    normalized.duration = searchParams.get('duration') || searchParams.get('durationDays') || '';
  } else if (type === 'transport') {
    normalized.startCityId = searchParams.get('startCityId') || searchParams.get('fromCity') || searchParams.get('city') || '';
    normalized.toCityId = searchParams.get('toCityId') || searchParams.get('toCity') || '';
    normalized.departureDate = searchParams.get('departureDate') || searchParams.get('startDate') || '';
    normalized.returnDate = searchParams.get('returnDate') || searchParams.get('endDate') || '';
    normalized.passengers = searchParams.get('passengers') || searchParams.get('guests') || searchParams.get('numberOfPassengers') || '1';
    normalized.tripType = searchParams.get('tripType') || 'one-way';
  }
  
  return normalized;
};

// Context
interface SearchContextType {
  state: SearchState;
  fetchCities: () => Promise<void>;
  fetchThemes: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  addSearchHistory: (item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => void;
  getCachedCities: () => SearchCity[];
  getCachedThemes: () => SearchTheme[];
  getCachedLocations: () => string[];
  clearCache: () => void;
  normalizeSearchParams: (searchParams: URLSearchParams, type: 'hotels' | 'tours' | 'transport') => Record<string, string>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Helper function to check if cache is valid
const isCacheValid = (cachedAt: number | null): boolean => {
  if (!cachedAt) return false;
  return Date.now() - cachedAt < CACHE_DURATION;
};

// Provider component
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Fetch cities with caching
  const fetchCities = useCallback(async () => {
    console.log('=== SEARCH CONTEXT: Fetching Cities ===');
    console.log('Current cities cache:', state.cities);
    console.log('Cities cached at:', state.citiesCachedAt);
    console.log('Cache valid:', isCacheValid(state.citiesCachedAt));
    
    // Check if cache is valid
    if (isCacheValid(state.citiesCachedAt) && state.cities.length > 0) {
      console.log('Using cached cities data');
      return;
    }

    console.log('Fetching fresh cities data from API...');
    dispatch({ type: 'SET_CITIES_LOADING', payload: true });
    
    try {
      const response = await getCities();
      console.log('Cities API response:', response);
      
      if (response.success && response.data) {
        const formattedCities: SearchCity[] = response.data.map((city: any) => ({
          id: city.id,
          name: city.name,
          label: city.name,
          stateId: city.stateId
        }));
        
        console.log('Formatted cities:', formattedCities);
        
        dispatch({ 
          type: 'SET_CITIES', 
          payload: { cities: formattedCities, timestamp: Date.now() } 
        });
      } else {
        console.error('Cities API failed:', response);
        dispatch({ type: 'SET_CITIES_ERROR', payload: 'Failed to fetch cities' });
      }
    } catch (error) {
      console.error('Cities fetch error:', error);
      dispatch({ 
        type: 'SET_CITIES_ERROR', 
        payload: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, [state.citiesCachedAt, state.cities.length]);

  // Fetch themes with caching
  const fetchThemes = useCallback(async () => {
    console.log('=== SEARCH CONTEXT: Fetching Themes ===');
    console.log('Current themes cache:', state.themes);
    console.log('Themes cached at:', state.themesCachedAt);
    console.log('Cache valid:', isCacheValid(state.themesCachedAt));
    
    // Check if cache is valid
    if (isCacheValid(state.themesCachedAt) && state.themes.length > 0) {
      console.log('Using cached themes data');
      return;
    }

    console.log('Fetching fresh themes data from API...');
    dispatch({ type: 'SET_THEMES_LOADING', payload: true });
    
    try {
      const response = await getThemes();
      console.log('Themes API response:', response);
      
      if (response.success && response.data) {
        const formattedThemes: SearchTheme[] = response.data.map((theme: any) => ({
          id: theme.id,
          name: theme.name,
          label: theme.label || theme.name,
          description: theme.description
        }));
        
        console.log('Formatted themes:', formattedThemes);
        
        dispatch({ 
          type: 'SET_THEMES', 
          payload: { themes: formattedThemes, timestamp: Date.now() } 
        });
      } else {
        console.error('Themes API failed:', response);
        dispatch({ type: 'SET_THEMES_ERROR', payload: 'Failed to fetch themes' });
      }
    } catch (error) {
      console.error('Themes fetch error:', error);
      dispatch({ 
        type: 'SET_THEMES_ERROR', 
        payload: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, [state.themesCachedAt, state.themes.length]);

  // Fetch locations with caching
  const fetchLocations = useCallback(async () => {
    // Check if cache is valid
    if (isCacheValid(state.locationsCachedAt) && state.locations.length > 0) {
      return;
    }

    dispatch({ type: 'SET_LOCATIONS_LOADING', payload: true });
    
    try {
      const response = await getLocations();
      if (response.success && response.data) {
        dispatch({ 
          type: 'SET_LOCATIONS', 
          payload: { locations: response.data, timestamp: Date.now() } 
        });
      } else {
        dispatch({ type: 'SET_LOCATIONS_ERROR', payload: 'Failed to fetch locations' });
      }
    } catch (error) {
      dispatch({ 
        type: 'SET_LOCATIONS_ERROR', 
        payload: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, [state.locationsCachedAt, state.locations.length]);

  // Add search to history
  const addSearchHistory = useCallback((item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
    const historyItem: SearchHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };
    
    dispatch({ type: 'ADD_SEARCH_HISTORY', payload: historyItem });
  }, []);

  // Get cached data (returns cached data even if expired)
  const getCachedCities = useCallback(() => state.cities, [state.cities]);
  const getCachedThemes = useCallback(() => state.themes, [state.themes]);
  const getCachedLocations = useCallback(() => state.locations, [state.locations]);

  // Clear all cache
  const clearCache = useCallback(() => {
    dispatch({ type: 'SET_CITIES', payload: { cities: [], timestamp: 0 } });
    dispatch({ type: 'SET_THEMES', payload: { themes: [], timestamp: 0 } });
    dispatch({ type: 'SET_LOCATIONS', payload: { locations: [], timestamp: 0 } });
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchCities();
    fetchThemes();
    fetchLocations();
  }, [fetchCities, fetchThemes, fetchLocations]);

  const contextValue: SearchContextType = {
    state,
    fetchCities,
    fetchThemes,
    fetchLocations,
    addSearchHistory,
    getCachedCities,
    getCachedThemes,
    getCachedLocations,
    clearCache,
    normalizeSearchParams,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use search context
export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;
