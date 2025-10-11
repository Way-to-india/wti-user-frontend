'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';

import DynamicCard from '../../components/common/DynamicCard';
import DynamicListingPage from '../../components/common/DynamicListingPage';
import DynamicSearchTab, { LocationOption } from '../../components/common/DynamicSearchTab';

import { fetchHotels, fetchLocations, setCurrentPage } from '../redux/hotelsSlice';
import { AppDispatch, RootState } from '../redux/store';

interface SearchParams {
  location?: LocationOption;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

interface FilterParams {
  starRatings: string[];
  amenities: string[];
  destinations: string[];
  priceRange: [number, number];
}

interface HotelFetchParams {
  page: number;
  cityId?: string | null; 
  starRating?: number;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

const PRICE_RANGE = {
  MIN: 1000,
  MAX: 50000,
} as const;

const STAR_RATING_OPTIONS = [
  { id: '3', label: '3 Stars & Above' },
  { id: '4', label: '4 Stars & Above' },
  { id: '5', label: '5 Stars' },
] as const;

const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'Free WiFi' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'parking', label: 'Free Parking' },
  { id: 'breakfast', label: 'Breakfast Included' },
  { id: 'gym', label: 'Fitness Center' },
  { id: 'spa', label: 'Spa' },
] as const;

const BREADCRUMBS = [
  { href: '/', text: 'Home' },
  { href: '/hotels', text: 'Hotels' },
] as const;

const HotelsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();

  const {
    hotels,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    locations,
    selectedLocation,
    selectedRating,
    selectedPriceRange,
  } = useSelector((state: RootState) => state.hotels);

  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  // 🔎 Initialize data based on query params
  useEffect(() => {
    const initializeData = async () => {
      try {
        await dispatch(fetchLocations()).unwrap();
        const cityId = searchParams?.get('cityId') || 
                       searchParams?.get('city') || 
                       searchParams?.get('location') || 
                       undefined;
        const checkIn = searchParams?.get('checkIn') || undefined;
        const checkOut = searchParams?.get('checkOut') || undefined;
        
        // Handle different guest parameter formats
        const totalGuests = searchParams?.get('guests')
          ? parseInt(searchParams.get('guests') as string, 10)
          : undefined;
        
        const adults = searchParams?.get('adults')
          ? parseInt(searchParams.get('adults') as string, 10)
          : undefined;
        
        const seniorAdults = searchParams?.get('seniorAdults')
          ? parseInt(searchParams.get('seniorAdults') as string, 10)
          : undefined;
        
        const children = searchParams?.get('children')
          ? parseInt(searchParams.get('children') as string, 10)
          : undefined;

        // Use the detailed guest breakdown if available, otherwise use total
        const guestCount = adults ? (adults + (seniorAdults || 0) + (children || 0)) : totalGuests;

        const fetchParams: HotelFetchParams = {
          page: 1,
          cityId,
          checkIn,
          checkOut,
          guests: guestCount,
        };

        // Only fetch if we have meaningful search parameters
        if (cityId || checkIn || checkOut || guestCount) {
          await dispatch(fetchHotels(fetchParams)).unwrap();
        } else {
          // Fetch default hotels if no search parameters
          await dispatch(fetchHotels({ page: 1 })).unwrap();
        }
      } catch (error) {
        console.error('Failed to initialize hotels page data:', error);
        // Try to fetch default hotels on error
        try {
          await dispatch(fetchHotels({ page: 1 })).unwrap();
        } catch (fallbackError) {
          console.error('Failed to fetch fallback hotels:', fallbackError);
        }
      }
    };

    initializeData();
  }, [dispatch, searchParams]);

  const locationOptions = useMemo(
    (): LocationOption[] =>
      locations.map(location => ({
        id: location,
        label: location,
      })),
    [locations]
  );

  const selectedLocationObj = useMemo((): LocationOption | null => {
    if (!selectedLocation) return null;
    return locationOptions.find(location => location.id === selectedLocation) || null;
  }, [selectedLocation, locationOptions]);

  const filterOptions = useMemo(
    () => ({
      starRatings: [...STAR_RATING_OPTIONS],
      amenities: [...AMENITY_OPTIONS],
      destinations: locationOptions,
      priceRange: {
        min: PRICE_RANGE.MIN,
        max: PRICE_RANGE.MAX,
      },
    }),
    [locationOptions]
  );

  const initialFilterState = useMemo(
    () => ({
      selectedStarRatings: selectedRating ? [selectedRating.toString()] : [],
      selectedAmenities: [],
      selectedDestinations: selectedLocation ? [selectedLocation] : [],
      priceRange: selectedPriceRange || ([PRICE_RANGE.MIN, PRICE_RANGE.MAX] as [number, number]),
    }),
    [selectedRating, selectedLocation, selectedPriceRange]
  );

  const handlePageChange = useCallback(
    async (event: React.ChangeEvent<unknown>, page: number) => {
      try {
        dispatch(setCurrentPage(page));

        const [minPrice, maxPrice] = selectedPriceRange ? selectedPriceRange.split('-').map(Number) : [undefined, undefined];
        
        await dispatch(fetchHotels({
          page,
          cityId: selectedLocation,
          starRating: selectedRating || undefined,
          minPrice,
          maxPrice,
        })).unwrap();
      } catch (error) {
        console.error('Failed to fetch hotels for page:', page, error);
      }
    },
    [dispatch, selectedLocation, selectedRating, selectedPriceRange]
  );

  const handleFilterChange = useCallback(
    async (filters: FilterParams) => {
      try {
        setIsFiltering(true);

        const locationId = filters.destinations.length > 0 ? filters.destinations[0] : undefined;
        const starRating =
          filters.starRatings.length > 0 ? parseInt(filters.starRatings[0]) : undefined;
        const [minPrice, maxPrice] = filters.priceRange;

        await dispatch(fetchHotels({
          page: 1,
          cityId: locationId,
          starRating,
          minPrice,
          maxPrice,
        })).unwrap();
      } catch (error) {
        console.error('Failed to apply filters:', error);
      } finally {
        setIsFiltering(false);
      }
    },
    [dispatch]
  );

  const handleSearch = useCallback(
    async (params: SearchParams) => {
      try {
        setIsSearching(true);

        await dispatch(fetchHotels({
          page: 1,
          cityId: params.location?.id,
          checkIn: params.checkIn,
          checkOut: params.checkOut,
          guests: params.guests,
        })).unwrap();
      } catch (error) {
        console.error('Failed to search hotels:', error);
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch]
  );

  const handleLocationChange = useCallback(
    async (location: LocationOption | null) => {
      if (!location) return;

      try {
        setIsSearching(true);

        await dispatch(fetchHotels({
          page: 1,
          cityId: location.id,
        })).unwrap();
      } catch (error) {
        console.error('Failed to fetch hotels for location:', location.label, error);
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch]
  );

  const hotelsGrid = useMemo(
    () => (
      <Grid container spacing={3}>
        {hotels.map(hotel => (
          <Grid item xs={12} sm={6} lg={4} key={hotel.id}>
            <DynamicCard
              id={hotel.id}
              type="hotel"
              imageUrls={hotel.imageUrls || []}
              title={hotel.name}
              description={hotel.description}
              price={hotel.price}
              rating={hotel.userRating} 
              location={hotel.location as any}
            />
          </Grid>
        ))}
      </Grid>
    ),
    [hotels]
  );

  const searchComponent = useMemo(
    () => (
      <DynamicSearchTab
        type="hotel"
        locations={locationOptions}
        selectedLocation={selectedLocationObj}
        onSearch={handleSearch}
        onLocationChange={handleLocationChange}
        dateRangeLabel="Check-in / Check-out"
      />
    ),
    [locationOptions, selectedLocationObj, handleSearch, handleLocationChange]
  );

  return (
    <DynamicListingPage
      type="hotel"
      title="Find Your Perfect Stay"
      searchComponent={searchComponent}
      totalItems={totalItems}
      filterOptions={filterOptions}
      onFilterChange={handleFilterChange}
      initialFilterState={initialFilterState}
      breadcrumbs={[...BREADCRUMBS]}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      loading={loading}
      isSearching={isSearching}
      isFiltering={isFiltering}
      error={error || undefined}
    >
      {hotelsGrid}
    </DynamicListingPage>
  );
};

export default HotelsPage;
