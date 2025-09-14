import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  selectedTab: 0, // Default tab index
};

// Create a slice of the state for tabs
const tabSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload; // Set selected tab index
    },
  },
});

// Export actions
export const { setSelectedTab } = tabSlice.actions;

// Export the reducer
export default tabSlice.reducer;
