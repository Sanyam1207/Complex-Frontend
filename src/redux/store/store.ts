import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from '../slices/categorySlice'
import filterReducer from '../slices/filterSlice'
import popupReducer from '../slices/showPopups'
import candidateFilterReducer from '../slices/messageSlice';
// Import any slice reducers here:


export const store = configureStore({
  reducer: {
    category: categoryReducer,
    filter: filterReducer,
    popup: popupReducer, // Add this line to include the popup reducer
    // ...other slices if you have them,
    candidateFilter: candidateFilterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
