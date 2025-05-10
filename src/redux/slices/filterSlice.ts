// src/store/slices/filterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for certain filter fields for type safety.
export type StayDuration = "lt6" | "gt6" | null;
export type SortOption = "price" | "newest" | "relevant";

// Define the interface for your filter slice state.
export interface FilterState {
  selectedStayDuration: StayDuration;
  selectedFilters: string[];
  bedrooms: string;
  bathrooms: string;
  minValue: string; // you can also use number if you prefer, but inputs are usually handled as strings
  maxValue: string;
  selectedSort: SortOption;
}

// Set the initial state based on your component's default values.
const initialState: FilterState = {
  selectedStayDuration: null,
  selectedFilters: [],
  bedrooms: "",
  bathrooms: "",
  minValue: "0",
  maxValue: "",
  selectedSort: "price",
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // Set or update the stay duration
    setSelectedStayDuration: (state, action: PayloadAction<StayDuration>) => {
      state.selectedStayDuration = action.payload;
    },
    // Replace the whole selectedFilters array
    setSelectedFilters: (state, action: PayloadAction<string[]>) => {
      state.selectedFilters = action.payload;
    },
    // Toggle a popular filter (adds if it doesn't exist; removes if it does)
    toggleSelectedFilter: (state, action: PayloadAction<string>) => {
      const filter = action.payload;
      if (state.selectedFilters.includes(filter)) {
        state.selectedFilters = state.selectedFilters.filter((f) => f !== filter);
      } else {
        state.selectedFilters.push(filter);
      }
    },
    // Set the number of bedrooms
    setBedrooms: (state, action: PayloadAction<string>) => {
      state.bedrooms = action.payload;
    },
    // Set the number of bathrooms
    setBathrooms: (state, action: PayloadAction<string>) => {
      state.bathrooms = action.payload;
    },
    // Set the minimum price value
    setMinValue: (state, action: PayloadAction<string>) => {
      state.minValue = action.payload;
    },
    // Set the maximum price value
    setMaxValue: (state, action: PayloadAction<string>) => {
      state.maxValue = action.payload;
    },
    // Set the selected sort option
    setSelectedSort: (state, action: PayloadAction<SortOption>) => {
      state.selectedSort = action.payload;
    },
    // Reset all filter values to their initial states
    resetFilters: (state) => {
      state.selectedStayDuration = null;
      state.selectedFilters = [];
      state.bedrooms = "";
      state.bathrooms = "";
      state.minValue = "";
      state.maxValue = "";
      state.selectedSort = "price";
    },
  },
});

// Export the action creators.
export const {
  setSelectedStayDuration,
  setSelectedFilters,
  toggleSelectedFilter,
  setBedrooms,
  setBathrooms,
  setMinValue,
  setMaxValue,
  setSelectedSort,
  resetFilters,
} = filterSlice.actions;

// Export the reducer to be included in your store.
export default filterSlice.reducer;
