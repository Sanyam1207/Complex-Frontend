import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from '../slices/categorySlice'
// Import any slice reducers here:


export const store = configureStore({
  reducer: {
    category: categoryReducer,
    // ...other slices if you have them
  },
});

// Infer the `RootState` and `AppDispatch` types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
