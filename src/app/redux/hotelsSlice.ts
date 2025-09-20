import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HotelCardProps, HotelFilters, HotelResponse } from '@/types/hotel';
import { ApiResponse } from '@/types/apiResponse';
import { getHotels, getHotelById, getLocations, getAmenities } from '@/services/hotelService';

interface HotelsState {
  hotels: HotelCardProps[];
  hotelDetails: HotelCardProps | null;
  locations: string[];
  amenities: string[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedLocation: string | null;
  selectedPriceRange: string | null;
  selectedRating: number | null;
  selectedAmenities: string[];
}

const initialState: HotelsState = {
  hotels: [],
  hotelDetails: null,
  locations: [],
  amenities: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  selectedLocation: null,
  selectedPriceRange: null,
  selectedRating: null,
  selectedAmenities: [],
};

export const fetchHotels = createAsyncThunk<
  ApiResponse<HotelResponse>,
  {
    page: number;
    cityId?: string | null;
    starRating?: number;
    minPrice?: number;
    maxPrice?: number;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    filters?: HotelFilters;
  },
  { rejectValue: string }
>(
  'hotels/fetchHotels',
  async ({ page, cityId, starRating, minPrice, maxPrice, checkIn, checkOut, guests, filters }, { rejectWithValue, dispatch }) => {
    try {
      // Update filter state first
      if (cityId) dispatch(setSelectedLocation(cityId));
      if (starRating) dispatch(setSelectedRating(starRating));
      if (minPrice && maxPrice) dispatch(setSelectedPriceRange(`${minPrice}-${maxPrice}`));
      
      // Handle legacy filters format
      if (filters) {
        if (filters.location) dispatch(setSelectedLocation(filters.location));
        if (filters.priceRange) dispatch(setSelectedPriceRange(filters.priceRange));
        if (filters.rating) dispatch(setSelectedRating(filters.rating));
        if (filters.amenities) dispatch(setSelectedAmenities(filters.amenities));
      }
      dispatch(setCurrentPage(page));

      // Build filters object for API call
      const apiFilters: HotelFilters = {};
      
      if (cityId) apiFilters.cityId = cityId;
      if (starRating) apiFilters.rating = starRating;
      if (minPrice) apiFilters.minPrice = minPrice;
      if (maxPrice) apiFilters.maxPrice = maxPrice;
      // if (checkIn) apiFilters.checkIn = checkIn;
      // if (checkOut) apiFilters.checkOut = checkOut;
      // if (guests) apiFilters.guests = guests;
      
      // Merge with additional filters if provided
      const finalFilters = { ...apiFilters, ...filters };

      const response = await getHotels({
        page,
        limit: 9,
        filters: Object.keys(finalFilters).length > 0 ? finalFilters : undefined
      });

      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch hotels');
      }

      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch hotels');
    }
  }
);

export const fetchHotelById = createAsyncThunk<
  ApiResponse<HotelCardProps>,
  string,
  { rejectValue: string }
>(
  'hotels/fetchHotelById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getHotelById(id);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch hotel details');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch hotel details');
    }
  }
);

export const fetchLocations = createAsyncThunk<ApiResponse<string[]>, void, { rejectValue: string }>(
  'hotels/fetchLocations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLocations();
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch locations');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch locations');
    }
  }
);

export const fetchAmenities = createAsyncThunk<ApiResponse<string[]>, void, { rejectValue: string }>(
  'hotels/fetchAmenities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAmenities();
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch amenities');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch amenities');
    }
  }
);

const hotelsSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<string | null>) => {
      state.selectedLocation = action.payload;
      state.currentPage = 1;
    },
    setSelectedPriceRange: (state, action: PayloadAction<string | null>) => {
      state.selectedPriceRange = action.payload;
      state.currentPage = 1;
    },
    setSelectedRating: (state, action: PayloadAction<number | null>) => {
      state.selectedRating = action.payload;
      state.currentPage = 1;
    },
    setSelectedAmenities: (state, action: PayloadAction<string[]>) => {
      state.selectedAmenities = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.hotels = action.payload.data.hotels;
          state.totalPages = Math.ceil(action.payload.data.pagination.totalItems / 9);
          state.totalItems = action.payload.data.pagination.totalItems;
        } else {
          state.error = action.payload.message || 'Failed to fetch hotels';
        }
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching hotels';
      })
      // Fetch Hotel by ID
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.hotelDetails = action.payload.data;
        } else {
          state.error = action.payload.message || 'Failed to fetch hotel details';
        }
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching hotel details';
      })
      // Fetch Locations
      .addCase(fetchLocations.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.locations = action.payload.data;
        }
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch locations';
      })
      // Fetch Amenities
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.amenities = action.payload.data;
        }
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch amenities';
      });
  },
});

export const {
  setSelectedLocation,
  setSelectedPriceRange,
  setSelectedRating,
  setSelectedAmenities,
  setCurrentPage,
} = hotelsSlice.actions;

export default hotelsSlice.reducer; 