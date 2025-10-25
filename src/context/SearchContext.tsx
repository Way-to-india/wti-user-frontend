'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getCities } from '@/services/cityService';
import { getThemes } from '@/services/tourService';
import { getLocations } from '@/services/hotelService';

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

export interface SearchState {
  cities: SearchCity[];
  themes: SearchTheme[];
  locations: string[];
  citiesLoading: boolean;
  themesLoading: boolean;
  locationsLoading: boolean;
  citiesError: string | null;
  themesError: string | null;
  locationsError: string | null;
  citiesCachedAt: number | null;
  themesCachedAt: number | null;
  locationsCachedAt: number | null;
  searchHistory: SearchHistoryItem[];
  popularSearches: PopularSearch[];
}

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

const CACHE_DURATION = 5 * 60 * 1000;

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
        citiesLoading: false,
      };
    case 'SET_CITIES_ERROR':
      return {
        ...state,
        citiesError: action.payload,
        citiesLoading: false,
      };
    case 'SET_THEMES_LOADING':
      return { ...state, themesLoading: action.payload };
    case 'SET_THEMES':
      return {
        ...state,
        themes: action.payload.themes,
        themesCachedAt: action.payload.timestamp,
        themesError: null,
        themesLoading: false,
      };
    case 'SET_THEMES_ERROR':
      return {
        ...state,
        themesError: action.payload,
        themesLoading: false,
      };
    case 'SET_LOCATIONS_LOADING':
      return { ...state, locationsLoading: action.payload };
    case 'SET_LOCATIONS':
      return {
        ...state,
        locations: action.payload.locations,
        locationsCachedAt: action.payload.timestamp,
        locationsError: null,
        locationsLoading: false,
      };
    case 'SET_LOCATIONS_ERROR':
      return {
        ...state,
        locationsError: action.payload,
        locationsLoading: false,
      };
    case 'ADD_SEARCH_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory].slice(0, 50);
      return { ...state, searchHistory: newHistory };
    case 'UPDATE_POPULAR_SEARCHES':
      return { ...state, popularSearches: action.payload };
    default:
      return state;
  }
}

export const normalizeSearchParams = (
  searchParams: URLSearchParams,
  type: 'hotels' | 'tours' | 'transport'
) => {
  const normalized: Record<string, string> = {};

  if (type === 'hotels') {
    normalized.cityId =
      searchParams.get('cityId') || searchParams.get('city') || searchParams.get('location') || '';
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
    normalized.guests =
      searchParams.get('guests') ||
      searchParams.get('travelers') ||
      searchParams.get('numberOfTravelers') ||
      '1';
    normalized.duration = searchParams.get('duration') || searchParams.get('durationDays') || '';
  } else if (type === 'transport') {
    normalized.startCityId =
      searchParams.get('startCityId') ||
      searchParams.get('fromCity') ||
      searchParams.get('city') ||
      '';
    normalized.toCityId = searchParams.get('toCityId') || searchParams.get('toCity') || '';
    normalized.departureDate =
      searchParams.get('departureDate') || searchParams.get('startDate') || '';
    normalized.returnDate = searchParams.get('returnDate') || searchParams.get('endDate') || '';
    normalized.passengers =
      searchParams.get('passengers') ||
      searchParams.get('guests') ||
      searchParams.get('numberOfPassengers') ||
      '1';
    normalized.tripType = searchParams.get('tripType') || 'one-way';
  }

  return normalized;
};

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
  normalizeSearchParams: (
    searchParams: URLSearchParams,
    type: 'hotels' | 'tours' | 'transport'
  ) => Record<string, string>;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const isCacheValid = (cachedAt: number | null): boolean => {
  if (!cachedAt) return false;
  return Date.now() - cachedAt < CACHE_DURATION;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const fetchCities = useCallback(async () => {
    if (isCacheValid(state.citiesCachedAt) && state.cities.length > 0) {
      return;
    }

    dispatch({ type: 'SET_CITIES_LOADING', payload: true });

    try {
      const response = await getCities();

      if (response.success && response.data) {
        const formattedCities: SearchCity[] = response.data.map((city: any) => ({
          id: city.id,
          name: city.name,
          label: city.name,
          stateId: city.stateId,
        }));

        dispatch({
          type: 'SET_CITIES',
          payload: { cities: formattedCities, timestamp: Date.now() },
        });
      } else {
        console.error('Cities API failed:', response);
        dispatch({ type: 'SET_CITIES_ERROR', payload: 'Failed to fetch cities' });
      }
    } catch (error) {
      console.error('Cities fetch error:', error);
      dispatch({
        type: 'SET_CITIES_ERROR',
        payload: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [state.citiesCachedAt, state.cities.length]);

  const fetchThemes = useCallback(async () => {
    if (isCacheValid(state.themesCachedAt) && state.themes.length > 0) {
      return;
    }

    dispatch({ type: 'SET_THEMES_LOADING', payload: true });

    try {
      const response = await getThemes();

      if (response.success && response.data) {
        const formattedThemes: SearchTheme[] = response.data.map((theme: any) => ({
          id: theme.id,
          name: theme.name,
          label: theme.label || theme.name,
          description: theme.description,
        }));

        dispatch({
          type: 'SET_THEMES',
          payload: { themes: formattedThemes, timestamp: Date.now() },
        });
      } else {
        console.error('Themes API failed:', response);
        dispatch({ type: 'SET_THEMES_ERROR', payload: 'Failed to fetch themes' });
      }
    } catch (error) {
      console.error('Themes fetch error:', error);
      dispatch({
        type: 'SET_THEMES_ERROR',
        payload: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [state.themesCachedAt, state.themes.length]);

  const fetchLocations = useCallback(async () => {
    if (isCacheValid(state.locationsCachedAt) && state.locations.length > 0) {
      return;
    }

    dispatch({ type: 'SET_LOCATIONS_LOADING', payload: true });

    try {
      const response = await getLocations();
      if (response.success && response.data) {
        dispatch({
          type: 'SET_LOCATIONS',
          payload: { locations: response.data, timestamp: Date.now() },
        });
      } else {
        dispatch({ type: 'SET_LOCATIONS_ERROR', payload: 'Failed to fetch locations' });
      }
    } catch (error) {
      dispatch({
        type: 'SET_LOCATIONS_ERROR',
        payload: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [state.locationsCachedAt, state.locations.length]);

  const addSearchHistory = useCallback((item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
    const historyItem: SearchHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };

    dispatch({ type: 'ADD_SEARCH_HISTORY', payload: historyItem });
  }, []);

  const getCachedCities = useCallback(() => state.cities, [state.cities]);
  const getCachedThemes = useCallback(() => state.themes, [state.themes]);
  const getCachedLocations = useCallback(() => state.locations, [state.locations]);

  const clearCache = useCallback(() => {
    dispatch({ type: 'SET_CITIES', payload: { cities: [], timestamp: 0 } });
    dispatch({ type: 'SET_THEMES', payload: { themes: [], timestamp: 0 } });
    dispatch({ type: 'SET_LOCATIONS', payload: { locations: [], timestamp: 0 } });
  }, []);

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

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};

export const useSearch = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;