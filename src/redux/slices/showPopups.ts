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
  | 'forgotPassword'

interface PopupState {
  // Simple map of which popups are open
  openPopups: Record<PopupType, boolean>;
  // Store return URL for login redirects
  returnUrl: string | null;
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
    forgotPassword: false,
  },
  returnUrl: null,
};

// Payload type for opening popup with optional return URL
interface OpenPopupPayload {
  popupType: PopupType;
  returnUrl?: string;
}

const popupSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    // Toggle a popup on - now supports both old and new payload formats
    openPopup: (state, action: PayloadAction<PopupType | OpenPopupPayload>) => {
      // Handle both old format (just PopupType) and new format (with returnUrl)
      if (typeof action.payload === 'string') {
        // Old format: just the popup type
        state.openPopups[action.payload] = true;
      } else {
        // New format: object with popupType and optional returnUrl
        const { popupType, returnUrl } = action.payload;
        state.openPopups[popupType] = true;
        
        // Store return URL only for login popup
        if (popupType === 'login' && returnUrl) {
          state.returnUrl = returnUrl;
        }
      }
    },
    
    // Toggle a popup off
    closePopup: (state, action: PayloadAction<PopupType>) => {
      state.openPopups[action.payload] = false;
      
      // Clear return URL when closing login popup
      if (action.payload === 'login') {
        state.returnUrl = null;
      }
    },
    
    // Toggle a popup (switch between open and closed)
    togglePopup: (state, action: PayloadAction<PopupType>) => {
      state.openPopups[action.payload] = !state.openPopups[action.payload];
      
      // Clear return URL when closing login popup
      if (action.payload === 'login' && !state.openPopups[action.payload]) {
        state.returnUrl = null;
      }
    },
    
    // Close all popups at once
    closeAllPopups: (state) => {
      Object.keys(state.openPopups).forEach(key => {
        state.openPopups[key as PopupType] = false;
      });
      // Clear return URL when closing all popups
      state.returnUrl = null;
    },
    
    // Set return URL manually (optional utility)
    setReturnUrl: (state, action: PayloadAction<string | null>) => {
      state.returnUrl = action.payload;
    },
  },
});

export const { 
  openPopup, 
  closePopup, 
  togglePopup,
  closeAllPopups,
  setReturnUrl
} = popupSlice.actions;

// Simple selector to check if a popup is open
export const selectIsPopupOpen = (state: RootState, type: PopupType) => 
  state.popup.openPopups[type];

// Selector to get the return URL
export const selectReturnUrl = (state: RootState) => state.popup.returnUrl;

export default popupSlice.reducer;