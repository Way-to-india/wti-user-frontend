import { useState } from 'react';
import { AppDispatch } from '@/app/redux/store';
import {
  setSelectedCity,
  setSelectedTheme,
  setSelectedDuration,
  setSelectedPriceRange,
  setCurrentPage,
} from '@/app/redux/toursSlice';

type UseToursSearchProps = {
  dispatch: AppDispatch;
  router: any;
  pathname: string;
  fetchToursWithRetry: (params: any) => Promise<void>;
};

export const useToursSearch = ({
  dispatch,
  router,
  pathname,
  fetchToursWithRetry,
}: UseToursSearchProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const buildQueryString = (filters: any) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    if (filters.themeId) params.set('themeId', filters.themeId);
    if (filters.cityId) params.set('cityId', filters.cityId);
    if (filters.duration) params.set('duration', filters.duration.toString());
    return params.toString();
  };

  const handleSearch = async (searchParams: any) => {
    setIsSearching(true);
    try {
      const themeId = searchParams.selectedType || null;
      const cityId = searchParams.location?.id || null;
      const duration = searchParams.durationDays || null;

      dispatch(setSelectedTheme(themeId));
      dispatch(setSelectedCity(cityId));
      dispatch(setSelectedDuration(duration));

      const queryString = buildQueryString({ themeId, cityId, duration });
      router.push(`${pathname}?${queryString}`, { scroll: false });

      await fetchToursWithRetry({
        page: 1,
        themeId,
        cityId,
        duration,
      });

      dispatch(setCurrentPage(1));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFilterChange = async (filters: {
    themes: string[];
    destinations: string[];
    durations: string[];
    priceRange: [number, number];
  }) => {
    const themeId = filters.themes.length > 0 ? filters.themes[0] : null;
    const cityId = filters.destinations.length > 0 ? filters.destinations[0] : null;
    const duration = filters.durations.length > 0 ? parseInt(filters.durations[0]) : null;

    dispatch(setSelectedTheme(themeId));
    dispatch(setSelectedCity(cityId));
    dispatch(setSelectedDuration(duration));
    dispatch(setSelectedPriceRange(filters.priceRange));

    setIsFiltering(true);

    try {
      const queryString = buildQueryString({ themeId, cityId, duration });
      router.push(`${pathname}?${queryString}`, { scroll: false });

      await fetchToursWithRetry({
        page: 1,
        themeId,
        cityId,
        duration,
      });

      dispatch(setCurrentPage(1));
    } catch (error) {
      console.error('Filter change failed:', error);
    } finally {
      setIsFiltering(false);
    }
  };

  return { handleSearch, handleFilterChange, isSearching, isFiltering };
};
