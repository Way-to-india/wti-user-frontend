'use client';
import { getCities } from '@/services/transportService';
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import DynamicCard from '../../components/common/DynamicCard';
import DynamicListingPage from '../../components/common/DynamicListingPage';
import DynamicSearchTab, { LocationOption } from '../../components/common/DynamicSearchTab';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCities, fetchTransports, setCurrentPage } from '../redux/transportSlice';

const TransportPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const { transports, loading, error, currentPage, totalPages, totalItems } = useSelector(
    (state: RootState) => state.transport
  );

  const [cityOptions, setCityOptions] = useState<LocationOption[]>([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    const initializeTransportPage = async () => {
      try {
        // Fetch cities and set city options
        const response = await getCities();
        if (response.success && response.data) {
          setCityOptions(
            response.data.map((city: any) => ({
              id: city.id,
              label: city.name || city.label || '',
            }))
          );
        }

        // Initialize Redux state
        await dispatch(fetchCities()).unwrap();

        // Parse URL parameters from search
        const startCityId = searchParams?.get('startCityId') || 
                           searchParams?.get('fromCity') ||
                           searchParams?.get('city') ||
                           null;
        
        const toCityId = searchParams?.get('toCityId') || 
                        searchParams?.get('toCity') ||
                        null;
        
        const departureDate = searchParams?.get('departureDate') || null;
        const returnDate = searchParams?.get('returnDate') || null;
        const tripType = searchParams?.get('tripType') || 'one-way';
        const guests = searchParams?.get('guests')
          ? parseInt(searchParams.get('guests') as string, 10)
          : null;

        // Prepare filters for API call
        const filters: any = {
          page: 1
        };

        if (startCityId) {
          filters.startCityId = startCityId;
        }
        
        if (toCityId) {
          filters.toCity = toCityId;
        }

        if (guests) {
          filters.guests = guests;
        }

        // Fetch transports with filters if we have search parameters
        if (startCityId || toCityId || departureDate) {
          await dispatch(fetchTransports(filters)).unwrap();
        } else {
          // Fetch default transports
          await dispatch(fetchTransports({ page: 1 })).unwrap();
        }
      } catch (error) {
        console.error('Failed to initialize transport page:', error);
        // Fallback to default fetch
        try {
          await dispatch(fetchTransports({ page: 1 })).unwrap();
        } catch (fallbackError) {
          console.error('Failed to fetch fallback transports:', fallbackError);
        }
      }
    };

    initializeTransportPage();
  }, [dispatch, searchParams]);

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
    vehicleTypes?: string[];
    rentalTypes?: string[];
    fromDestinations: string[];
    toDestinations: string[];
    priceRange: [number, number];
    seatRange?: [number, number];
  }) => {
    const startCityId = filters.fromDestinations.length > 0 ? filters.fromDestinations[0] : null;
    const toCity = filters.toDestinations.length > 0 ? filters.toDestinations[0] : null;
    const type = filters.transportTypes.length > 0 ? filters.transportTypes[0] : null;
    const vehicleType = filters.vehicleTypes && filters.vehicleTypes.length > 0 ? filters.vehicleTypes[0] : null;
    const rentalType = filters.rentalTypes && filters.rentalTypes.length > 0 ? filters.rentalTypes[0] : null;
    const [minPrice, maxPrice] = filters.priceRange;
    const [minSeats, maxSeats] = filters.seatRange || [1, 50];
    
    setIsFiltering(true);
    dispatch(
      fetchTransports({
        page: 1,
        startCityId,
        toCity,
        type,
        vehicleType,
        rentalType,
        minPrice: minPrice > 500 ? minPrice : undefined,
        maxPrice: maxPrice < 30000 ? maxPrice : undefined,
        minSeats: minSeats > 1 ? minSeats : undefined,
        maxSeats: maxSeats < 50 ? maxSeats : undefined,
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
    vehicleTypes: [
      { id: 'Car', label: 'Car' },
      { id: 'Bus', label: 'Bus' },
      { id: 'SUV', label: 'SUV' },
      { id: 'Coach', label: 'Coach' },
      { id: 'Sedan', label: 'Sedan' },
      { id: 'Compact Sedan', label: 'Compact Sedan' },
    ],
    rentalTypes: [
      { id: 'Daily', label: 'Daily' },
      { id: 'Hourly', label: 'Hourly' },
      { id: 'One-way', label: 'One-way' },
      { id: 'Multi-day', label: 'Multi-day' },
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
    seatRange: {
      min: 1,
      max: 50,
    },
  };

  // Initial filter state based on current selections
  const initialFilterState = {
    selectedTransportTypes: [],
    selectedVehicleTypes: [],
    selectedRentalTypes: [],
    selectedFromDestinations: [],
    selectedToDestinations: [],
    priceRange: [500, 30000] as [number, number],
    seatRange: [1, 50] as [number, number],
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
