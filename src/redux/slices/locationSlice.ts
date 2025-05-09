// redux/slices/locationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  selectedLocation: string;
  recentSearches: string[];
}

// Initialize from localStorage if available
const getInitialRecentSearches = (): string[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('recentLocationSearches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse recent searches from localStorage', e);
      }
    }
  }
  return [];
};

const initialState: LocationState = {
  selectedLocation: '',
  recentSearches: getInitialRecentSearches(),
};

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload;
      
      // Add to recent searches if not already there and not empty
      if (action.payload && !state.recentSearches.includes(action.payload)) {
        state.recentSearches = [
          action.payload, 
          ...state.recentSearches.filter(location => location !== action.payload).slice(0, 4)
        ];
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('recentLocationSearches', JSON.stringify(state.recentSearches));
        }
      }
    },
    clearSelectedLocation: (state) => {
      state.selectedLocation = '';
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('recentLocationSearches');
      }
    },
  },
});

export const { 
  setSelectedLocation, 
  clearSelectedLocation,
  clearRecentSearches
} = locationSlice.actions;

export default locationSlice.reducer;