const API_BASE = '/api';
const endpoints = {
  auth: {
    login: `${API_BASE}/auth/login`,
    signup: `${API_BASE}/auth/signup`,
    refreshToken: `${API_BASE}/auth/refresh-token`,
  },
  user: {
    create : `${API_BASE}/user/user-routes/create`,
    profileById: (id: string | number) => `${API_BASE}/user/user-routes/profile/${id}`,
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
    // Hotel Bookings
    createHotelBooking: `${API_BASE}/user/booking/hotel`,
    getUserHotelBookings: `${API_BASE}/user/booking/hotel`,
    getHotelBooking: (bookingId: string) => `${API_BASE}/user/booking/hotel/${bookingId}`,
    updateHotelBookingStatus: (bookingId: string) => `${API_BASE}/user/booking/hotel/${bookingId}/status`,
    cancelHotelBooking: (bookingId: string) => `${API_BASE}/user/booking/hotel/${bookingId}/cancel`,
    
    // Tour Bookings  
    createTourBooking: `${API_BASE}/user/tour-booking`,
    getUserTourBookings: `${API_BASE}/user/tour-booking`,
    getTourBooking: (bookingId: string) => `${API_BASE}/user/tour-booking/${bookingId}`,
    updateTourBookingStatus: (bookingId: string) => `${API_BASE}/user/tour-booking/${bookingId}/status`,
    cancelTourBooking: (bookingId: string) => `${API_BASE}/user/tour-booking/${bookingId}/cancel`,
    
    // Transport Bookings
    createTransportBooking: `${API_BASE}/user/transport-booking`,
    getUserTransportBookings: `${API_BASE}/user/transport-booking`,
    getTransportBooking: (bookingId: string) => `${API_BASE}/user/transport-booking/${bookingId}`,
    updateTransportBookingStatus: (bookingId: string) => `${API_BASE}/user/transport-booking/${bookingId}/status`,
    cancelTransportBooking: (bookingId: string) => `${API_BASE}/user/transport-booking/${bookingId}/cancel`,
    
    // Consolidated bookings
    getAllUserBookings: `${API_BASE}/user/bookings`,
    getBookingStats: `${API_BASE}/user/bookings/stats`,
    
    updateBookingStatus: (bookingId: string) => `${API_BASE}/booking/${bookingId}/status`,
  },
};

export default endpoints;
