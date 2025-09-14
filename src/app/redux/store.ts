import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tabReducer from "./tabSlice";
import toursReducer from "./toursSlice";
import hotelsReducer from "./hotelsSlice";
import transportReducer from "./transportSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tabs: tabReducer,
    tours: toursReducer,
    hotels: hotelsReducer,
    transport: transportReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
