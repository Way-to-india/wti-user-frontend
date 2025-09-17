'use client';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import DynamicCard from '../../components/common/DynamicCard';
import DynamicListingPage from '../../components/common/DynamicListingPage';
import DynamicSearchTab, { LocationOption } from '../../components/common/DynamicSearchTab';
import ToursSkeleton from '../../components/tours/ToursSkeleton';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCities, fetchThemes, fetchTours, setCurrentPage } from '../redux/toursSlice';

const ToursPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

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
  } = useSelector((state: RootState) => state.tours);

  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    dispatch(fetchThemes());
    dispatch(fetchCities());

    const themeId = searchParams?.get('themeId') || null;
    const cityId = searchParams?.get('cityId') || null;
    const duration = searchParams?.get('duration')
      ? parseInt(searchParams.get('duration') as string)
      : null;

    dispatch(fetchTours({ page: 1, themeId, cityId, duration }));
  }, [dispatch, searchParams]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(
      fetchTours({
        page,
        themeId: selectedTheme,
        cityId: selectedCity,
        duration: selectedDuration,
      })
    );
  };

  const handleFilterChange = (filters: {
    themes: string[];
    destinations: string[];
    durations: string[];
    priceRange: [number, number];
  }) => {
    const themeId = filters.themes.length > 0 ? filters.themes[0] : null;
    const cityId = filters.destinations.length > 0 ? filters.destinations[0] : null;
    const duration = filters.durations.length > 0 ? parseInt(filters.durations[0]) : null;

    setIsFiltering(true);
    dispatch(fetchTours({ page: 1, themeId, cityId, duration })).finally(() =>
      setIsFiltering(false)
    );
  };

  const handleSearch = (searchParams: any) => {
    setIsSearching(true);
    dispatch(
      fetchTours({
        page: 1,
        themeId: selectedTheme,
        cityId: searchParams.location?.id || null,
        duration: searchParams.durationDays,
      })
    ).finally(() => setIsSearching(false));
  };

  const handleLocationChange = (location: LocationOption | null) => {
    if (location) {
      setIsSearching(true);
      dispatch(
        fetchTours({
          page: 1,
          themeId: selectedTheme,
          cityId: location.id,
          duration: selectedDuration,
        })
      ).finally(() => setIsSearching(false));
    }
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
    priceRange: [3000, 60000],
  };

  const breadcrumbs = [
    { href: '/', text: 'Home' },
    { href: '/tours', text: 'Tours' },
  ];

  const toursGrid = (
    <Grid container spacing={3}>
      {tours.map(tour => (
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
      ))}
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
      error={error}
      loadingComponent={
        <Grid container spacing={3}>
          {[...Array(9)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <ToursSkeleton />
            </Grid>
          ))}
        </Grid>
      }
    >
      {toursGrid}
    </DynamicListingPage>
  );
};

export default ToursPage;
