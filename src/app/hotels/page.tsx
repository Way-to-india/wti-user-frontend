'use client';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicCard from '../../components/common/DynamicCard';
import DynamicListingPage from '../../components/common/DynamicListingPage';
import DynamicSearchTab, { LocationOption } from '../../components/common/DynamicSearchTab';
import { fetchHotels, fetchLocations, setCurrentPage } from '../redux/hotelsSlice';
import { AppDispatch, RootState } from '../redux/store';

const HotelsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
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

  // Add separate loading states for different operations
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    dispatch(fetchLocations());
    dispatch(fetchHotels({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(
      fetchHotels({
        page,
        cityId: selectedLocation,
        starRating: selectedRating,
        minPrice: selectedPriceRange ? selectedPriceRange[0] : undefined,
        maxPrice: selectedPriceRange ? selectedPriceRange[1] : undefined,
      })
    );
  };

  const handleFilterChange = (filters: {
    starRatings: string[];
    amenities: string[];
    destinations: string[];
    priceRange: [number, number];
  }) => {
    const locationId = filters.destinations.length > 0 ? filters.destinations[0] : null;
    const starRating = filters.starRatings.length > 0 ? parseInt(filters.starRatings[0]) : null;
    const priceRange = filters.priceRange;

    setIsFiltering(true);

    dispatch(
      fetchHotels({
        page: 1,
        cityId: locationId,
        starRating,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      })
    ).finally(() => {
      setIsFiltering(false);
    });
  };

  // Function to handle search from DynamicSearchTab
  const handleSearch = (searchParams: any) => {
    setIsSearching(true);

    dispatch(
      fetchHotels({
        page: 1,
        cityId: searchParams.location?.id || null,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        guests: searchParams.guests,
      })
    ).finally(() => {
      setIsSearching(false);
    });
  };

  // Function to handle location change in the search tab
  const handleLocationChange = (location: LocationOption | null) => {
    if (location) {
      setIsSearching(true);

      dispatch(
        fetchHotels({
          page: 1,
          cityId: location.id,
        })
      ).finally(() => {
        setIsSearching(false);
      });
    }
  };

  // Convert location data to the format expected by DynamicFilterSidebar
  const filterOptions = {
    starRatings: [
      { id: '3', label: '3 Stars & Above' },
      { id: '4', label: '4 Stars & Above' },
      { id: '5', label: '5 Stars' },
    ],
    amenities: [
      { id: 'wifi', label: 'Free WiFi' },
      { id: 'pool', label: 'Swimming Pool' },
      { id: 'parking', label: 'Free Parking' },
      { id: 'breakfast', label: 'Breakfast Included' },
      { id: 'gym', label: 'Fitness Center' },
      { id: 'spa', label: 'Spa' },
    ],
    destinations: locations.map(location => ({
      id: location,
      label: location,
    })),
    priceRange: {
      min: 1000,
      max: 50000,
    },
  };

  // Format locations for the search tab
  const locationOptions = locations.map(location => ({
    id: location,
    label: location,
  }));

  // Get the currently selected location as an object
  const selectedLocationObj = selectedLocation
    ? locationOptions.find(location => location.id === selectedLocation) || null
    : null;

  // Initial filter state based on current selections
  const initialFilterState = {
    selectedStarRatings: selectedRating ? [selectedRating.toString()] : [],
    selectedAmenities: [],
    selectedDestinations: selectedLocation ? [selectedLocation] : [],
    priceRange: selectedPriceRange || [1000, 50000],
  };

  // Define breadcrumbs for the page
  const breadcrumbs = [
    { href: '/', text: 'Home' },
    { href: '/hotels', text: 'Hotels' },
  ];

  // Prepare the hotels grid for DynamicListingPage children
  const hotelsGrid = (
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
            rating={hotel.rating}
            location={hotel.location}
            starRating={hotel.starRating}
            priceUnit="per night"
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <DynamicListingPage
      type="hotel"
      title="Find Your Perfect Stay"
      searchComponent={
        <DynamicSearchTab
          type="hotel"
          locations={locationOptions}
          selectedLocation={selectedLocationObj}
          onSearch={handleSearch}
          onLocationChange={handleLocationChange}
          includeGuests={true}
          dateRangeLabel="Check-in / Check-out"
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
    >
      {hotelsGrid}
    </DynamicListingPage>
  );
};

export default HotelsPage;
