'use client';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import DynamicCard from '../../components/common/DynamicCard';
import DynamicListingPage from '../../components/common/DynamicListingPage';
import DynamicSearchTab, { LocationOption } from '../../components/common/DynamicSearchTab';
import { AppDispatch, RootState } from '../redux/store';
import {
  fetchCities,
  fetchThemes,
  fetchTours,
  setCurrentPage,
  setSelectedCity,
  setSelectedTheme,
  setSelectedDuration,
  setSelectedPriceRange,
} from '../redux/toursSlice';
import NoToursFound from './TourNotFound';

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

type ToursPageContentProps = {
  slug: string;
  searchParams?: { [key: string]: string | string[] | undefined };
};

const ToursPageContent = ({ slug, searchParams: pageSearchParams }: ToursPageContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();

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

  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  
  const fetchToursWithRetry = async (params: any, retries = 0): Promise<void> => {
    try {
      await dispatch(fetchTours(params)).unwrap();
      setRetryCount(0);
      setIsRetrying(false);
    } catch (error: any) {
      console.error(`Fetch attempt ${retries + 1} failed:`, error);

      const isTimeoutError =
        error?.message?.includes('timeout') ||
        error?.message?.includes('exceeded') ||
        error?.code === 'ECONNABORTED';

      if (retries < MAX_RETRIES && isTimeoutError) {
        setRetryCount(retries + 1);
        setIsRetrying(true);
        const delay = RETRY_DELAY * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.log(`Retrying... (${retries + 1}/${MAX_RETRIES})`);
        return fetchToursWithRetry(params, retries + 1);
      } else {
        setIsRetrying(false);
        throw error;
      }
    }
  };

  
  useEffect(() => {
    const initializeToursPage = async () => {
      try {
        await Promise.all([
          dispatch(fetchThemes()).unwrap(),
          dispatch(fetchCities()).unwrap(),
        ]);
        const themeId = typeof pageSearchParams?.themeId === 'string' ? pageSearchParams.themeId : null;
        const cityId = typeof pageSearchParams?.cityId === 'string' ? pageSearchParams.cityId : null;
        const durationParam = typeof pageSearchParams?.duration === 'string' ? parseInt(pageSearchParams.duration) : null;
        const page = typeof pageSearchParams?.page === 'string' ? parseInt(pageSearchParams.page) : 1;

        let duration = durationParam;
        const startDate = typeof pageSearchParams?.startDate === 'string' ? pageSearchParams.startDate : null;
        const endDate = typeof pageSearchParams?.endDate === 'string' ? pageSearchParams.endDate : null;

        if (startDate && endDate && !durationParam) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        
        dispatch(setSelectedTheme(themeId));
        dispatch(setSelectedCity(cityId));
        dispatch(setSelectedDuration(duration));
        dispatch(setCurrentPage(page));

        
        await fetchToursWithRetry({
          page,
          slug,
          themeId,
          cityId,
          duration,
        });
      } catch (error) {
        console.error('Failed to initialize tours page:', error);
      }
    };

    initializeToursPage();
  }, [slug, pageSearchParams, dispatch]);

  
  const buildQueryString = (filters: any) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    if (filters.themeId) params.set('themeId', filters.themeId);
    if (filters.cityId) params.set('cityId', filters.cityId);
    if (filters.duration) params.set('duration', filters.duration.toString());
    return params.toString();
  };

  
  const handlePageChange = async (event: React.ChangeEvent<unknown>, page: number) => {
    try {
      dispatch(setCurrentPage(page));
      const params = new URLSearchParams(window.location.search);
      params.set('page', page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      await fetchToursWithRetry({
        page,
        slug,
        themeId: selectedTheme,
        cityId: selectedCity,
        duration: selectedDuration,
      });
    } catch (error) {
      console.error('Page change failed:', error);
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
        slug,
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
        slug,
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

  const handleLocationChange = (location: LocationOption | null) => {
    dispatch(setSelectedCity(location?.id || null));
  };

  const handleTypeChange = (typeId: string) => {
    dispatch(setSelectedTheme(typeId));
  };

  
  const filterOptions = {
    themes: themes.map(theme => ({ id: theme.id, label: theme.label })),
    destinations: cities.map(city => ({ id: city.id, label: city.label })),
    durations: [
      { id: '3', label: 'Short (1-3 Days)' },
      { id: '7', label: 'Medium (4-7 Days)' },
      { id: '14', label: 'Long (8-14 Days)' },
      { id: '15', label: 'Extended (15+ Days)' },
    ],
    priceRange: { min: 3000, max: 60000 },
  };

  const locationOptions = cities.map(city => ({ id: city.id, label: city.label }));
  const themeOptions = themes.map(theme => ({ id: theme.id, label: theme.label }));

  const selectedLocationObj = selectedCity
    ? locationOptions.find(city => city.id === selectedCity) || null
    : null;

  const initialFilterState = {
    selectedThemes: selectedTheme ? [selectedTheme] : [],
    selectedDestinations: selectedCity ? [selectedCity] : [],
    selectedDurations: selectedDuration ? [selectedDuration.toString()] : [],
    priceRange: selectedPriceRange,
  };

  const breadcrumbs = [
    { href: '/', text: 'Home' },
    { href: '/tours', text: 'Tours' },
    ...(slug
      ? [
        {
          href: `/tours/${slug}`,
          text: slug
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
        },
      ]
      : []),
  ];

  const toursGrid = (
    <Grid container spacing={3}>
      {tours.length > 0 ? (
        tours.map(tour => (
          <Grid item xs={12} sm={6} lg={4} key={tour.id}>
            <DynamicCard
              id={tour.id}
              type="tour"
              imageUrls={tour.imageUrls || []}
              title={tour.title}
              description={tour.description}
              price={tour.price}
              rating={tour.rating}
            />
          </Grid>
        ))
      ) : (
        <NoToursFound message="No tours found matching your search." />
      )}
    </Grid>
  );

  return (
    <DynamicListingPage
      type="tour"
      title="Find Your Perfect Tour"
      searchComponent={
        <DynamicSearchTab
          type="tour"
          locations={locationOptions}
          selectedLocation={selectedLocationObj}
          onSearch={handleSearch}
          onLocationChange={handleLocationChange}
          onTypeChange={handleTypeChange}
          typesOptions={themeOptions}
          selectedType={selectedTheme || ''}
          typeLabel="Tour Theme"
          dateRangeLabel="Travel Dates"
        />
      }
      totalItems={totalItems}
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      initialFilterState={initialFilterState}
      breadcrumbs={breadcrumbs}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      loading={loading}
      isSearching={isSearching}
      isFiltering={isFiltering}
      error={error || undefined}
      retryCount={retryCount}
      isRetrying={isRetrying}
    >
      {toursGrid}
    </DynamicListingPage>
  );
};

export default ToursPageContent;