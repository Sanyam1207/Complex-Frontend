// src/redux/slices/locationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { applyFilters } from "./categorySlice";

// Define location state interface
interface LocationState {
  selectedLocation: string | null;
  recentSearches: string[];
}

const initialState: LocationState = {
  selectedLocation: null,
  recentSearches: []
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      const location = action.payload;
      
      // Set the selected location
      state.selectedLocation = location;
      
      // Add to recent searches if not already present (and not "Current Location")
      if (location !== "Current Location" && !state.recentSearches.includes(location)) {
        // Keep only the 5 most recent searches
        state.recentSearches = [location, ...state.recentSearches.slice(0, 4)];
      }
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = null;
    }
  }
});

// Export action creators
export const { setSelectedLocation, clearSelectedLocation } = locationSlice.actions;

// Create middleware for handling side effects when location changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const locationMiddleware = (store: any) => (next: any) => (action: any) => {
  // First pass the action
  const result = next(action);
  
  // After a location change, we should trigger a refetch of properties
  if (setSelectedLocation.match(action) || clearSelectedLocation.match(action)) {
    store.dispatch(applyFilters());
  }
  
  return result;
};

export default locationSlice.reducer;