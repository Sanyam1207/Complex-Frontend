// src/redux/slices/categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

// Define types
interface CategoryState {
  selectedCategory: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: any[]; // Replace with your property type if available
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  shouldRefetch: boolean; // New flag to trigger refetching
}

// Async thunk for fetching properties by category
export const fetchPropertiesByCategory = createAsyncThunk(
  'category/fetchPropertiesByCategory',
  async (category: string, { rejectWithValue, getState }) => {
    try {
      // Get the current state to access filter values and location
      const state = getState() as RootState;
      const filterState = state.filter;
      const locationState = state.location; // Get location state
      
      // Map the category values to the actual property types used in your backend
      const categoryToPropertyTypeMap: Record<string, string[]> = {
        privateRoom: ['Private room in Apartment', 'Private room in House'],
        apartments: ['Apartment / Condo'],
        houses: ['House / Townhouse'],
        sharing: ['Shared Room in House', 'Shared Room in Apartment'],
        basement: ['Basement'],
      };

      // Get the property types for the selected category
      const propertyTypes = categoryToPropertyTypeMap[category] || [];
      
      // Build the query string
      const queryParams = new URLSearchParams();
      
      // IMPORTANT: Always include property types to strictly filter by category
      if (propertyTypes.length > 0) {
        // Make sure to append each property type as a separate parameter
        // This ensures the backend receives it as an array
        propertyTypes.forEach(type => {
          queryParams.append('propertyType', type);
        });
        
        console.log('Property types in query:', propertyTypes);
      } else {
        console.warn('No property types found for category:', category);
      }
      
      // Add location filter if it exists
      if (locationState.selectedLocation) {
        queryParams.append('location', locationState.selectedLocation);
      }
      
      // Add price range filters
      if (filterState.minValue && filterState.minValue.trim() !== '') {
        queryParams.append('minPrice', filterState.minValue);
      }
      
      if (filterState.maxValue && filterState.maxValue.trim() !== '') {
        queryParams.append('maxPrice', filterState.maxValue);
      }
      
      // Add bedroom and bathroom filters
      if (filterState.bedrooms && filterState.bedrooms.trim() !== '') {
        // Extract the number from "1 Bedroom" or "2 Bedrooms"
        const bedroomCount = filterState.bedrooms.split(' ')[0];
        queryParams.append('bedrooms', bedroomCount);
      }
      
      if (filterState.bathrooms && filterState.bathrooms.trim() !== '') {
        // Extract the number from "1 Bathroom" or "2 Bathrooms"
        const bathroomCount = filterState.bathrooms.split(' ')[0];
        queryParams.append('bathrooms', bathroomCount);
      }
      
      // Add amenities filters
      if (filterState.selectedFilters.length > 0) {
        // Map UI filter names to backend filter names if needed
        const filterMapping: Record<string, string> = {
          'Parking': 'Parking',
          'Pet friendly': 'Pet Friendly',
          'Couple': 'coupleFriendly'
        };
        
        // Filter out 'Couple' as it's handled separately
        const amenitiesFilters = filterState.selectedFilters.filter(filter => filter !== 'Couple');
        
        // Create amenities string for backend
        if (amenitiesFilters.length > 0) {
          const amenities = amenitiesFilters
            .map(filter => filterMapping[filter] || filter)
            .join(',');
          
          queryParams.append('amenities', amenities);
        }
        
        // Handle couple friendly separately
        if (filterState.selectedFilters.includes('Couple')) {
          queryParams.append('coupleFriendly', 'true');
        }
      }
      
      // Add stay duration filter
      if (filterState.selectedStayDuration) {
        if (filterState.selectedStayDuration === 'lt6') {
          queryParams.append('leaseDuration', 'Month-To-Month / Flexible,6 Months');
        } else if (filterState.selectedStayDuration === 'gt6') {
          queryParams.append('leaseDuration', '12 Months');
        }
      }
      
      // Add sort parameter
      const sortMapping: Record<string, string> = {
        'price': 'monthlyPrice',
        'newest': '-createdAt',
        'relevant': 'relevance'
      };
      
      if (filterState.selectedSort && sortMapping[filterState.selectedSort]) {
        queryParams.append('sort', sortMapping[filterState.selectedSort]);
      }

      // Make the API request with all filters
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/rentals?${queryParams.toString()}`;
      console.log('Fetching properties with URL:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.success) {
        return responseData.data;
      } else {
        return rejectWithValue(responseData.message || 'Failed to fetch properties');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState: CategoryState = {
  selectedCategory: "privateRoom",
  properties: [],
  status: 'idle',
  error: null,
  shouldRefetch: false
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
      state.shouldRefetch = true;
    },
    clearPropertyData: (state) => {
      state.properties = [];
    },
    // New action to trigger refetching when filters are applied
    applyFilters: (state) => {
      state.shouldRefetch = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertiesByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPropertiesByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.properties = action.payload;
        state.error = null;
        state.shouldRefetch = false; // Reset the flag after fetching
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .addCase(fetchPropertiesByCategory.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload;
        state.shouldRefetch = false; // Reset the flag after fetching
      });
  },
});

export const { setSelectedCategory, clearPropertyData, applyFilters } = categorySlice.actions;
export default categorySlice.reducer;