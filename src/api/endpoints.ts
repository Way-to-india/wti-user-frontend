const API_BASE = '/api';
const endpoints = {
  auth: {
    login: `${API_BASE}/auth/login`,
    signup: `${API_BASE}/auth/signup`,
    refreshToken: `${API_BASE}/auth/refresh-token`,
  },
  user: {
    create : `${API_BASE}/user/user-routes/create`,
    profileById: (id: string | number) => `${API_BASE}/user/user-routes/${id}`,
    updateProfile: `${API_BASE}/user/user-routes/update`,
  },
  tours: {
    getTours: `${API_BASE}/tour`,
    getTourById: (id: string) => `${API_BASE}/tour/${id}`,
    submitEnquiry: `${API_BASE}/tour/enquiry`,
  },
  cities: {
    getAll: `${API_BASE}/city`,
    getById: (id: string) => `${API_BASE}/city/${id}`,
  },
  themes: {
    getAll: `${API_BASE}/theme`,
    getById: (id: string) => `${API_BASE}/theme/${id}`,
  },
  hotels: {
    getAll: `${API_BASE}/hotels`,
    getById: (id: string) => `${API_BASE}/hotels/${id}`,
    getLocations: `${API_BASE}/hotels/locations`,
    getAmenities: `${API_BASE}/hotels/amenities`,
  },
  // New endpoints for blog, deals, transport, and air charter
  blog: {
    getAll: `${API_BASE}/blog`,
    getById: (id: string) => `${API_BASE}/blog/${id}`,
    getFeatured: `${API_BASE}/blog/featured`,
    getBySlug: (slug: string) => `${API_BASE}/blog/slug/${slug}`,
  },
  deals: {
    getAll: `${API_BASE}/deals`,
    getById: (id: string) => `${API_BASE}/deals/${id}`,
  },
  transport: {
    getAll: `${API_BASE}/transport`,
    getById: (id: string) => `${API_BASE}/transport/${id}`,
    getByType: (type: string) => `${API_BASE}/transport/type/${type}`,
  },
  airCharter: {
    getAll: `${API_BASE}/air-charter`,
    getById: (id: string) => `${API_BASE}/air-charter/${id}`,
  },
  inspiration: {
    getAll: `${API_BASE}/inspiration`,
    getByTheme: (themeId: string) => `${API_BASE}/inspiration/theme/${themeId}`,
  },
  bookings: {
    createHotelBooking: `${API_BASE}/bookings/hotel`,
    getUserHotelBookings: `${API_BASE}/bookings/hotel`,
    getHotelBooking: (bookingId: string) => `${API_BASE}/bookings/hotel/${bookingId}`,
    updateBookingStatus: (bookingId: string) => `${API_BASE}/bookings/hotel/${bookingId}/status`,
  },
};

export default endpoints;
