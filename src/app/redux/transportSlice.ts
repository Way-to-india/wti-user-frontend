import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getTransports, getCities, getTransportTypes, getTransportById } from '@/services/transportService';

// Types
export interface City {
  id: string;
  name: string;
  label?: string;
  state_id?: any;
  country_id?: any;
}

export interface Transport {
  id: string;
  title: string;
  description: string;
  price: number;
  taxRate?: number;
  priceWithTax?: number;
  imageUrl?: string;
  imageUrls?: string[];
  amenities?: string[];
  type?: string;
  duration?: string;
  rating?: number;
  vehicleType?: string;
  vehicleModel?: string;
  rentalCompany?: string;
  rentalType?: string;
  seatCount?: number;
  isActive?: boolean;
  availableVehicles?: number;
  fuelType?: string;
  transmission?: string;
  features?: string[];
  rentalDetails?: {
    title: string;
    description: string;
  };
  rentalRules?: {
    title: string;
    description: string;
  };
  itinerary?: {
    day: number;
    cityId: string;
  }[];
  startCity?: City;
  cities?: City[];
}

interface TransportState {
  transports: Transport[];
  cities: City[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedType: string | null;
  startCityId: string | null;
  toCity: string | null;
  transportDetails: Transport | null;
}

// Static data
const dummyTransports: Transport[] = [
  {
    id: "K83nzQOD7Ss7SMSft94O",
    title: "Airport Transfer - Luxury",
    description: "Luxury sedan service for airport pickups and drop-offs",
    rentalCompany: "India Premium Transport",
    rentalType: "One-way",
    vehicleModel: "Honda Accord",
    vehicleType: "Sedan",
    seatCount: 4,
    rentalDetails: {
      title: "Service Details",
      description: "Premium airport transfer service with flight tracking, 60 minutes of waiting time, meet and greet at the airport arrival hall."
    },
    rentalRules: {
      title: "Service Policy",
      description: "Free cancellation up to 12 hours before scheduled pickup. Fixed price with no hidden charges."
    },
    imageUrls: [
      "https://images.pexels.com/photos/1209774/pexels-photo-1209774.jpeg",
      "https://images.pexels.com/photos/2036544/pexels-photo-2036544.jpeg"
    ],
    price: 1800,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "2p3bIqXT9oFqW6sXDD9X",
      name: "Mumbai",
      label: "Mumbai"
    },
    cities: [
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      }
    ]
  },
  {
    id: "qhaj2J020gYbeQxEO0s8",
    title: "City Taxi Service - Premium",
    description: "Comfortable air-conditioned taxi service for city exploration with professional drivers",
    rentalCompany: "IndiaWheels",
    rentalType: "Hourly",
    vehicleModel: "Toyota Innova",
    vehicleType: "SUV",
    seatCount: 7,
    rentalDetails: {
      title: "Service Details",
      description: "Includes AC, bottled water, WiFi, and professional chauffeur. Available for 4, 8, or 12-hour bookings."
    },
    rentalRules: {
      title: "Rental Policy",
      description: "Extra charges apply for additional hours. Cancellation allowed up to 24 hours before scheduled pickup with full refund."
    },
    imageUrls: [
      "https://images.pexels.com/photos/4090544/pexels-photo-4090544.jpeg",
      "https://images.pexels.com/photos/4090550/pexels-photo-4090550.jpeg"
    ],
    price: 2500,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "2p3bIqXT9oFqW6sXDD9X",
      name: "Mumbai",
      label: "Mumbai"
    },
    cities: [
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      },
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      }
    ]
  },
  {
    id: "vjcqNFCs11mxl1KGKPy5",
    title: "Golden Triangle Tour Bus",
    description: "Luxury bus service for touring Delhi, Agra, and Jaipur (Golden Triangle)",
    rentalCompany: "Heritage India Tours",
    rentalType: "Multi-day",
    vehicleModel: "Volvo B11R",
    vehicleType: "Coach",
    seatCount: 32,
    rentalDetails: {
      title: "Service Features",
      description: "Luxury coach with reclining seats, onboard restroom, WiFi, personal entertainment systems, guide services, and daily refreshments."
    },
    rentalRules: {
      title: "Tour Policy",
      description: "Price includes all tolls, driver accommodation, and parking fees. Cancellation allowed up to 7 days prior with 85% refund."
    },
    imageUrls: [
      "https://images.pexels.com/photos/6447229/pexels-photo-6447229.jpeg",
      "https://images.pexels.com/photos/6447561/pexels-photo-6447561.jpeg"
    ],
    price: 12000,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "AAZn0QGDbpgQJ020kr21",
      name: "Kolkata",
      label: "Kolkata"
    },
    cities: [
      {
        id: "AAZn0QGDbpgQJ020kr21",
        name: "Kolkata",
        label: "Kolkata"
      },
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      },
      {
        id: "2p3bIqXT9oFqW6sXDD9X",
        name: "Mumbai",
        label: "Mumbai"
      }
    ]
  },
  {
    id: "UTmbqkAHPhbZfcBWhFvK",
    title: "Private Car with Driver - Economy",
    description: "Affordable private car service with experienced local driver",
    rentalCompany: "Travel Easy India",
    rentalType: "Daily",
    vehicleModel: "Maruti Swift Dzire",
    vehicleType: "Compact Sedan",
    seatCount: 4,
    rentalDetails: {
      title: "Service Details",
      description: "Air-conditioned car with local driver who knows the best routes and attractions. Available for 8 hours daily with 80km limit."
    },
    rentalRules: {
      title: "Rental Terms",
      description: "Additional charges for extra hours/kilometers. Fuel, driver meals, and accommodation included in multi-day bookings."
    },
    imageUrls: [
      "https://images.pexels.com/photos/804130/pexels-photo-804130.jpeg",
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"
    ],
    price: 1500,
    rating: 4.5,
    amenities: [],
    startCity: {
      id: "AAZn0QGDbpgQJ020kr21",
      name: "Kolkata",
      label: "Kolkata"
    },
    cities: [
      {
        id: "AAZn0QGDbpgQJ020kr21",
        name: "Kolkata",
        label: "Kolkata"
      }
    ]
  }
];

// Sample transport details for development
const sampleTransportDetails: Transport = {
  id: '1',
  title: 'Luxury Bus to Badrinath',
  description: 'Comfortable and luxurious bus service to Badrinath with all modern amenities',
  price: 5000,
  imageUrls: [
    'https://chardhamtravel.com/images/cars/chardham-car-rental.jpg',
    'https://chardhamtravel.com/images/cars/chardham-car-rental.jpg',
    'https://chardhamtravel.com/images/cars/chardham-car-rental.jpg',
    'https://chardhamtravel.com/images/cars/chardham-car-rental.jpg',
    'https://chardhamtravel.com/images/cars/chardham-car-rental.jpg',
    'https://chardhamtravel.com/images/cars/chardham-car-rental.jpg',
  ],
  vehicleType: 'Bus',
  vehicleModel: 'Volvo B11R',
  rentalCompany: 'Luxury Tours Inc.',
  rentalType: 'Full Day',
  seatCount: 45,
  rating: 4.5,
  amenities: ['AC', 'WiFi', 'Entertainment System', 'Reclining Seats'],
  type: 'Luxury Bus',
  duration: '2 days',
  rentalDetails: {
    title: 'Service Details',
    description: 'Premium bus service with all amenities.'
  },
  rentalRules: {
    title: 'Service Policy',
    description: 'Free cancellation up to 12 hours before scheduled pickup.'
    },
  startCity: {
    id: 'delhi',
    name: 'Delhi',
    label: 'Delhi',
  },
  cities: [
    { id: 'delhi', name: 'Delhi', label: 'Delhi' },
    { id: 'badrinath', name: 'Badrinath', label: 'Badrinath' }
  ]
};

const initialState: TransportState = {
  transports: [],
  cities: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  selectedType: null,
  startCityId: null,
  toCity: null,
  transportDetails: null,
};

interface FetchTransportsParams {
  page?: number;
  type?: string | null;
  startCityId?: string | null;
  toCity?: string | null;
  vehicleType?: string | null;
  rentalType?: string | null;
  minPrice?: number;
  maxPrice?: number;
  minSeats?: number;
  maxSeats?: number;
}

// Async thunks
export const fetchTransports = createAsyncThunk(
  'transports/fetchTransports',
  async (params: FetchTransportsParams) => {
    const response = await getTransports(params);
    if (!response.success) {
      throw new Error('Failed to fetch transports');
    }
    return response.data;
  }
);

export const fetchCities = createAsyncThunk(
  'transports/fetchCities',
  async () => {
    const response = await getCities();
    if (!response.success) {
      throw new Error('Failed to fetch cities');
    }
    return response.data;
  }
);

export const fetchTransportDetails = createAsyncThunk(
  'transports/fetchTransportDetails',
  async (id: string) => {
    // TODO: Replace with actual API call when ready
    const response = await getTransportById(id);
    if (!response.success) {
      throw new Error('Failed to fetch transport details');
    }
    return response.data;
    
    // Using sample data for development
    // return sampleTransportDetails;
  }
);

const transportSlice = createSlice({
  name: 'transports',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSelectedType: (state, action: PayloadAction<string | null>) => {
      state.selectedType = action.payload;
    },
    setFromCity: (state, action: PayloadAction<string | null>) => {
      state.startCityId = action.payload;
    },
    setToCity: (state, action: PayloadAction<string | null>) => {
      state.toCity = action.payload;
    },
    clearTransportDetails: (state) => {
      state.transportDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransports.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.transports = action.payload.transports;
          state.totalItems = action.payload.pagination.totalItems;
          state.totalPages = action.payload.pagination.totalPages;
        }
      })
      .addCase(fetchTransports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transports';
      })
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload || [];
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cities';
      })
      .addCase(fetchTransportDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransportDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.transportDetails = action.payload;
      })
      .addCase(fetchTransportDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transport details';
      });
  }
});

export const { setCurrentPage, setSelectedType, setFromCity, setToCity, clearTransportDetails } = transportSlice.actions;
export default transportSlice.reducer;