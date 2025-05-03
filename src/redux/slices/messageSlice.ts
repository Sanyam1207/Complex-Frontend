// src/store/slices/candidateFilterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for certain filter fields for type safety
export type Gender = "male" | "female" | "any";
export type SortOption = "star" | "";

// Define the interface for your filter slice state
export interface CandidateFilterState {
  gender: Gender;
  languages: string[];
  sortBy: SortOption;
  resultsCount: number;
  isFilterApplied: boolean;
}

// Set the initial state based on your component's default values
const initialState: CandidateFilterState = {
  gender: "any",
  languages: ["English"],
  sortBy: "",
  resultsCount: 27,
  isFilterApplied: false
};

export const candidateFilterSlice = createSlice({
  name: "candidateFilter",
  initialState,
  reducers: {
    // Set or update the gender filter
    setGender: (state, action: PayloadAction<Gender>) => {
      state.gender = action.payload;
    },
    
    // Toggle a language in the languages array
    toggleLanguage: (state, action: PayloadAction<string>) => {
      const language = action.payload;
      if (state.languages.includes(language)) {
        state.languages = state.languages.filter(lang => lang !== language);
      } else {
        state.languages.push(language);
      }
    },
    
    // Set the sorting option
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    
    // Set the results count (could be updated from an API call)
    setResultsCount: (state, action: PayloadAction<number>) => {
      state.resultsCount = action.payload;
    },
    
    // Mark filters as applied when the user clicks "View results"
    applyFilters: (state) => {
      state.isFilterApplied = true;
    },
    
    // Reset all filter values to their initial state
    resetFilters: (state) => {
      state.gender = "any";
      state.languages = ["English"];
      state.sortBy = "";
      state.isFilterApplied = false;
      // We might want to keep the resultsCount as is or reset it depending on your app's logic
    }
  },
});

// Export the action creators
export const {
  setGender,
  toggleLanguage,
  setSortBy,
  setResultsCount,
  applyFilters,
  resetFilters,
} = candidateFilterSlice.actions;

// Export the reducer to be included in your store
export default candidateFilterSlice.reducer;