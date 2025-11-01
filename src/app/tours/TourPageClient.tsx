'use client';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { AppDispatch, RootState } from '../redux/store';
import {
  fetchCities,
  fetchThemes,
  setCurrentPage,
  setSelectedCity,
  setSelectedTheme,
  setSelectedDuration,
} from '../redux/toursSlice';
import ToursLayout from '@/components/tours/ToursLayout';
import { useToursData } from '@/hooks/useTourData';
import { useToursSearch } from '@/hooks/useTourSearch';

type ToursPageClientProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function ToursPageClient({ searchParams }: ToursPageClientProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname() ?? '/tours';

  const {
    tours,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    themes,
    selectedTheme,
    cities,
    selectedCity,
    selectedDuration,
    selectedPriceRange,
  } = useSelector((state: RootState) => state.tours);

  const { fetchToursWithRetry, retryCount, isRetrying } = useToursData();
  const { handleSearch, handleFilterChange, isSearching, isFiltering } = useToursSearch({
    dispatch,
    router,
    pathname,
    fetchToursWithRetry
  });

  // Initialize page data
  useEffect(() => {
    const initializeToursPage = async () => {
      try {
        // Fetch themes and cities
        await Promise.all([
          dispatch(fetchThemes()).unwrap(),
          dispatch(fetchCities()).unwrap(),
        ]);

        // Parse URL parameters
        const themeId = typeof searchParams?.themeId === 'string' ? searchParams.themeId : null;
        const cityId = typeof searchParams?.cityId === 'string' ? searchParams.cityId : null;
        const durationParam = typeof searchParams?.duration === 'string' ? searchParams.duration : null;
        const pageParam = typeof searchParams?.page === 'string' ? searchParams.page : null;

        const duration = durationParam ? parseInt(durationParam) : null;
        const page = pageParam ? parseInt(pageParam) : 1;

        // Update Redux state
        dispatch(setSelectedTheme(themeId));
        dispatch(setSelectedCity(cityId));
        dispatch(setSelectedDuration(duration));
        dispatch(setCurrentPage(page));

        // Fetch tours
        await fetchToursWithRetry({
          page,
          themeId,
          cityId,
          duration,
        });
      } catch (error) {
        console.error('Failed to initialize tours page:', error);
      }
    };

    initializeToursPage();
  }, [searchParams]);

  const handlePageChange = async (event: React.ChangeEvent<unknown>, page: number) => {
    try {
      dispatch(setCurrentPage(page));

      const params = new URLSearchParams();
      if (selectedTheme) params.set('themeId', selectedTheme);
      if (selectedCity) params.set('cityId', selectedCity);
      if (selectedDuration) params.set('duration', selectedDuration.toString());
      params.set('page', page.toString());

      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      await fetchToursWithRetry({
        page,
        themeId: selectedTheme,
        cityId: selectedCity,
        duration: selectedDuration,
      });
    } catch (error) {
      console.error('Page change failed:', error);
    }
  };

  return (
    <ToursLayout
      tours={tours}
      loading={loading}
      error={error}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      themes={themes}
      selectedTheme={selectedTheme}
      cities={cities}
      selectedCity={selectedCity}
      selectedDuration={selectedDuration}
      selectedPriceRange={selectedPriceRange}
      isSearching={isSearching}
      isFiltering={isFiltering}
      retryCount={retryCount}
      isRetrying={isRetrying}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onPageChange={handlePageChange}
    />
  );
}