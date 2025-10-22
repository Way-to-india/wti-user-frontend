import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTours, getThemes, getCities, getTourById } from '@/services/tourService';
import { TourCardProps, Theme, City, TourResponse, ApiResponse } from '@/types/tour';

interface ToursState {
  tours: TourCardProps[];
  themes: Theme[];
  cities: City[];
  tourDetails: TourCardProps | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedTheme: string | null;
  selectedCity: string | null;
  selectedDuration: number | null;
  selectedPriceRange: [number, number];
}

const initialState: ToursState = {
  tours: [],
  themes: [],
  cities: [],
  tourDetails: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  selectedTheme: null,
  selectedCity: null,
  selectedDuration: null,
  selectedPriceRange: [3000, 60000],
};

export const fetchTours = createAsyncThunk<
  ApiResponse<TourResponse>,
  {
    page: number;
    slug?: string;
    themeId?: string | null;
    cityId?: string | null;
    duration?: number | null;
    minPrice?: number;
    maxPrice?: number;
  },
  { rejectValue: string }
>(
  'tours/fetchTours',
  async ({ page, slug, themeId, cityId, duration, minPrice, maxPrice }, { rejectWithValue }) => {
    try {
      console.log('fetchTours called with:', {
        page,
        slug,
        themeId,
        cityId,
        duration,
        minPrice,
        maxPrice,
      });

      const filters: any = {};

      if (themeId && themeId !== 'null') {
        filters.themeId = themeId;
      }

      if (cityId && cityId !== 'null') {
        filters.cityId = cityId;
      }

      if (duration && duration > 0) {
        filters.durationDays = duration;
      }

      if (minPrice !== undefined && minPrice > 3000) {
        filters.minPrice = minPrice;
      }

      if (maxPrice !== undefined && maxPrice < 60000) {
        filters.maxPrice = maxPrice;
      }

      console.log('Applying filters:', filters);

      const response = await getTours({
        page,
        limit: 9,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
      });

      console.log('API Response:', response);

      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch tours');
      }

      return response;
    } catch (error: any) {
      console.error('fetchTours error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch tours');
    }
  }
);

export const fetchThemes = createAsyncThunk<ApiResponse<Theme[]>, void, { rejectValue: string }>(
  'tours/fetchThemes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getThemes() as any;
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch themes');
      }
      return response;
    } catch (error: any) {
      console.error('fetchThemes error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch themes');
    }
  }
);

export const fetchCities = createAsyncThunk<ApiResponse<City[]>, void, { rejectValue: string }>(
  'tours/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCities();
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch cities');
      }
      return response;
    } catch (error: any) {
      console.error('fetchCities error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch cities');
    }
  }
);

export const fetchTourById = createAsyncThunk<
  ApiResponse<TourCardProps>,
  string,
  { rejectValue: string }
>('tours/fetchTourById', async (id, { rejectWithValue }) => {
  try {
    const response = await getTourById(id);
    if (!response.success) {
      return rejectWithValue(response.message || 'Failed to fetch tour details');
    }
    return response;
  } catch (error: any) {
    console.error('fetchTourById error:', error);
    return rejectWithValue(error?.message || 'Failed to fetch tour details');
  }
});

const toursSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    
    setSelectedTheme: (state, action: PayloadAction<string | null>) => {
      state.selectedTheme = action.payload;
    },

    setSelectedCity: (state, action: PayloadAction<string | null>) => {
      state.selectedCity = action.payload;
    },

    setSelectedDuration: (state, action: PayloadAction<number | null>) => {
      state.selectedDuration = action.payload;
    },

    setSelectedPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.selectedPriceRange = action.payload;
    },

    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    clearFilters: state => {
      state.selectedTheme = null;
      state.selectedCity = null;
      state.selectedDuration = null;
      state.selectedPriceRange = [3000, 60000];
      state.currentPage = 1;
    },

    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder

      .addCase(fetchTours.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.tours = action.payload.data.tours;
          state.totalPages = action.payload.data.pagination.totalPages;
          state.totalItems = action.payload.data.pagination.totalItems;
          state.currentPage = action.payload.data.pagination.currentPage;
        } else {
          state.error = action.payload.message || 'Failed to fetch tours';
          state.tours = [];
          state.totalPages = 1;
          state.totalItems = 0;
        }
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching tours';
        state.tours = [];
        state.totalPages = 1;
        state.totalItems = 0;
      })

      .addCase(fetchThemes.pending, state => {})
      .addCase(fetchThemes.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.themes = action.payload.data;
        }
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        console.error('Failed to fetch themes:', action.payload);
        state.themes = [];
      })

      .addCase(fetchCities.pending, state => {})
      .addCase(fetchCities.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.cities = action.payload.data;
        }
      })
      .addCase(fetchCities.rejected, (state, action) => {
        console.error('Failed to fetch cities:', action.payload);
        state.cities = [];
      })

      .addCase(fetchTourById.pending, state => {
        state.loading = true;
        state.error = null;
        state.tourDetails = null;
      })
      .addCase(fetchTourById.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.tourDetails = action.payload.data;
        } else {
          state.error = action.payload.message || 'Failed to fetch tour details';
        }
      })
      .addCase(fetchTourById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching tour details';
        state.tourDetails = null;
      });
  },
});

export const {
  setSelectedTheme,
  setSelectedCity,
  setSelectedDuration,
  setSelectedPriceRange,
  setCurrentPage,
  clearFilters,
  clearError,
} = toursSlice.actions;

export default toursSlice.reducer;
