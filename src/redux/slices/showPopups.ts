// src/redux/features/popupSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';

// Define all possible popups in your application
export type PopupType = 
  | 'onboarding' 
  | 'signup' 
  | 'login' 
  | 'logout' 
  | 'deleteAccount'
  | 'confirmation'
  | 'ProfileCreation'

interface PopupState {
  // Simple map of which popups are open
  openPopups: Record<PopupType, boolean>;
}

const initialState: PopupState = {
  openPopups: {
    onboarding: false,
    signup: false,
    login: false,
    logout: false,
    deleteAccount: false,
    confirmation: false,
    ProfileCreation: false,
  }
};

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    // Toggle a popup on
    openPopup: (state, action: PayloadAction<PopupType>) => {
      state.openPopups[action.payload] = true;
    },
    
    // Toggle a popup off
    closePopup: (state, action: PayloadAction<PopupType>) => {
      state.openPopups[action.payload] = false;
    },
    
    // Toggle a popup (switch between open and closed)
    togglePopup: (state, action: PayloadAction<PopupType>) => {
      state.openPopups[action.payload] = !state.openPopups[action.payload];
    },
    
    // Close all popups at once
    closeAllPopups: (state) => {
      Object.keys(state.openPopups).forEach(key => {
        state.openPopups[key as PopupType] = false;
      });
    }
  },
});

export const { 
  openPopup, 
  closePopup, 
  togglePopup,
  closeAllPopups
} = popupSlice.actions;

// Simple selector to check if a popup is open
export const selectIsPopupOpen = (state: RootState, type: PopupType) => 
  state.popup.openPopups[type];

export default popupSlice.reducer;