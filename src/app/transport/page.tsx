'use client';
import { getCities } from '@/services/transportService';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DynamicCard from '../../components/common/DynamicCard';
import DynamicListingPage from '../../components/common/DynamicListingPage';
import DynamicSearchTab, { LocationOption } from '../../components/common/DynamicSearchTab';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCities, fetchTransports, setCurrentPage } from '../redux/transportSlice';

const TransportPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transports, loading, error, currentPage, totalPages, totalItems } = useSelector(
    (state: RootState) => state.transport
  );

  const [cityOptions, setCityOptions] = useState<LocationOption[]>([]);

  useEffect(() => {
    async function fetchCitiesList() {
      const response = await getCities();
      if (response.success && response.data) {
        setCityOptions(
          response.data.map((city: any) => ({
            id: city.id,
            label: city.name || city.label || '',
          }))
        );
      }
    }
    fetchCitiesList();
  }, []);

  // Add separate loading states for different operations
  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    dispatch(fetchCities());
    dispatch(fetchTransports({ page: 1 }));
  }, [dispatch]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setCurrentPage(page));
    dispatch(
      fetchTransports({
        page,
      })
    );
  };

  const handleFilterChange = (filters: {
    transportTypes: string[];
    fromDestinations: string[];
    toDestinations: string[];
    priceRange: [number, number];
  }) => {
    const startCityId = filters.fromDestinations.length > 0 ? filters.fromDestinations[0] : null;
    const toCity = filters.toDestinations.length > 0 ? filters.toDestinations[0] : null;
    const type = filters.transportTypes.length > 0 ? filters.transportTypes[0] : null;
    setIsFiltering(true);
    dispatch(
      fetchTransports({
        page: 1,
        startCityId,
        toCity,
        type,
      })
    ).finally(() => {
      setIsFiltering(false);
    });
  };

  // Function to handle search from DynamicSearchTab
  const handleSearch = (searchParams: any) => {
    setIsSearching(true);
    dispatch(
      fetchTransports({
        page: 1,
        startCityId: searchParams.location?.id || null,
      })
    ).finally(() => {
      setIsSearching(false);
    });
  };

  // Function to handle location change in the search tab (apply filter immediately)
  const handleLocationChange = (location: LocationOption | null) => {
    if (location) {
      setIsSearching(true);
      dispatch(
        fetchTransports({
          page: 1,
          startCityId: location.id,
        })
      ).finally(() => {
        setIsSearching(false);
      });
    }
  };

  // Convert city data to the format expected by DynamicFilterSidebar
  const filterOptions = {
    transportTypes: [
      { id: 'bus', label: 'Bus' },
      { id: 'train', label: 'Train' },
      { id: 'car', label: 'Private Car' },
      { id: 'flight', label: 'Flight' },
    ],
    fromDestinations: cityOptions?.map(city => ({
      id: city.id,
      label: city.label,
    })),
    toDestinations: cityOptions?.map(city => ({
      id: city.id,
      label: city.label,
    })),
    priceRange: {
      min: 500,
      max: 30000,
    },
  };

  // Initial filter state based on current selections
  const initialFilterState = {
    selectedTransportTypes: [],
    selectedFromDestinations: [],
    selectedToDestinations: [],
    priceRange: [500, 30000],
  };

  // Define breadcrumbs for the page
  const breadcrumbs = [
    { href: '/', text: 'Home' },
    { href: '/transport', text: 'Transportation' },
  ];

  // Prepare the transports grid for DynamicListingPage children
  const transportsGrid = (
    <Grid container spacing={3}>
      {transports?.map(transport => {
        // Ensure imageUrls is always an array for DynamicCard
        let imageUrls: string[] = [];
        if (Array.isArray(transport.imageUrls) && transport.imageUrls.length > 0) {
          imageUrls = transport.imageUrls as string[];
        } else if (typeof transport.imageUrl === 'string' && transport.imageUrl) {
          imageUrls = [transport.imageUrl];
        } else {
          imageUrls = ['/assets/images/destination.png'];
        }
        return (
          <Grid item xs={12} sm={6} lg={4} key={transport.id}>
            <DynamicCard
              id={transport.id}
              type="transport"
              imageUrls={imageUrls}
              title={transport?.title}
              description={transport?.description}
              price={transport?.price}
              amenities={transport?.amenities}
            />
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <DynamicListingPage
      type="transport"
      title="Find Your Transportation"
      searchComponent={
        <DynamicSearchTab
          type="transport"
          locations={cityOptions}
          onLocationChange={handleLocationChange}
          onSearch={handleSearch}
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
    >
      {transportsGrid}
    </DynamicListingPage>
  );
};

export default TransportPage;
