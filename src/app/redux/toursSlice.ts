import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTours, getThemes, getCities, getTourById } from '@/services/tourService';
import { 
  TourCardProps, 
  Theme, 
  City, 
  TourResponse,
  ApiResponse 
} from '@/types/tour';

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
    themeId?: string | null; 
    cityId?: string | null; 
    duration?: number | null;
    priceRange?: [number, number] | null;
  },
  { rejectValue: string }
>(
  'tours/fetchTours',
  async ({ page, themeId, cityId, duration, priceRange }, { rejectWithValue, dispatch }) => {
    try {
      // Update filter state first
      // dispatch(setSelectedTheme(themeId ?? null));
      // dispatch(setSelectedCity(cityId ?? null));
      // dispatch(setSelectedDuration(duration ?? null));
      // if (priceRange) dispatch(setSelectedPriceRange(priceRange));
      // dispatch(setCurrentPage(page));

      const filters: any = {};
      if (themeId) filters.themeId = themeId;
      if (cityId) filters.cityId = cityId;
      if (duration) filters.durationDays = duration;
      if (priceRange && (priceRange[0] > 3000 || priceRange[1] < 60000)) {
        filters.minPrice = priceRange[0];
        filters.maxPrice = priceRange[1];
      }

      const response = await getTours({
        page,
        limit: 9,
        filters: Object.keys(filters).length > 0 ? filters : undefined
      });

      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch tours');
      }

      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch tours');
    }
  }
);

export const fetchThemes = createAsyncThunk<ApiResponse<Theme[]>, void, { rejectValue: string }>(
  'tours/fetchThemes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getThemes();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch themes');
    }
  }
);

export const fetchCities = createAsyncThunk<ApiResponse<City[]>, void, { rejectValue: string }>(
  'tours/fetchCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCities();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch cities');
    }
  }
);

export const fetchTourById = createAsyncThunk<
  ApiResponse<TourCardProps>,
  string,
  { rejectValue: string }
>(
  'tours/fetchTourById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTourById(id);
      if (!response.success) {
        return rejectWithValue(response.message || 'Failed to fetch tour details');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch tour details');
    }
  }
);

const toursSlice = createSlice({
  name: 'tours',
  initialState,
  reducers: {
    setSelectedTheme: (state, action: PayloadAction<string | null>) => {
      state.selectedTheme = action.payload;
      state.currentPage = 1;
    },
    setSelectedCity: (state, action: PayloadAction<string | null>) => {
      state.selectedCity = action.payload;
      state.currentPage = 1;
    },
    setSelectedDuration: (state, action: PayloadAction<number | null>) => {
      state.selectedDuration = action.payload;
      state.currentPage = 1;
    },
    setSelectedPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.selectedPriceRange = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tours
      .addCase(fetchTours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success && action.payload.data) {
          state.tours = action.payload.data.tours;
          state.totalPages = Math.ceil(action.payload.data.pagination.totalItems / 9);
          state.totalItems = action.payload.data.pagination.totalItems;
        } else {
          state.error = action.payload.message || 'Failed to fetch tours';
        }
      })
      .addCase(fetchTours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while fetching tours';
      })
      // Fetch Themes
      .addCase(fetchThemes.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.themes = action.payload.data;
        }
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch themes';
      })
      // Fetch Cities
      .addCase(fetchCities.fulfilled, (state, action) => {
        if (action.payload.success && action.payload.data) {
          state.cities = action.payload.data;
        }
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.error = action.payload || 'Failed to fetch cities';
      })
      // Fetch Tour by ID
      .addCase(fetchTourById.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      });
  },
});

export const { 
  setSelectedTheme, 
  setSelectedCity, 
  setSelectedDuration,
  setSelectedPriceRange,
  setCurrentPage
} = toursSlice.actions;

export default toursSlice.reducer; 