/** URLs for the application */

/** General Page Unauthenticated Routes or URL Page Links */
const GeneralNonAuthRoutes = {
  landingPage: "/",
  login: "/login",
  signUp: "/sign-up",
};

/** General Page Authenticated Routes or URL Page Links */
const GeneralAuthRoutes = {
  admin: "/admin",
  profile: "/profile",
  logout: "/logout",
};

/** Hotel Detail Page Unauthenticated Routes or URL Page Links */
const HoteldetailsNonAuthRoutes = {
  hotelDetails: "/hotel-details",
  hotelModel: "/hotel-model",
  hotelCheckout: "/hotel-checkout",
};

/** Places of Interest Page Unauthenticated Routes or URL Page Links */
const PlacesOfInterestNonAuthRoutes = {
  placesOfInterest: "/places-of-interest",
};

/** Travel Guide Page Unauthenticated Routes or URL Page Links */
const TravelGuideNonAuthRoutes = {
  travelGuide: "/travel-guide",
  singlePlace: "/travel-guide/",
};

const protectedRoutes = [...Object.values(GeneralAuthRoutes)];

export {
  GeneralNonAuthRoutes,
  GeneralAuthRoutes,
  HoteldetailsNonAuthRoutes,
  TravelGuideNonAuthRoutes,
  PlacesOfInterestNonAuthRoutes,
  protectedRoutes,
};
