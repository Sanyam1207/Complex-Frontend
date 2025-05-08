// src/redux/slices/filterModalSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface FilterModalState {
  isOpen: boolean;
}

const initialState: FilterModalState = {
  isOpen: false,
};

export const filterModalSlice = createSlice({
  name: 'filterModal',
  initialState,
  reducers: {
    openFilterModal: (state) => {
      state.isOpen = true;
    },
    closeFilterModal: (state) => {
      state.isOpen = false;
    },
    toggleFilterModal: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openFilterModal, closeFilterModal, toggleFilterModal } = filterModalSlice.actions;

export default filterModalSlice.reducer;