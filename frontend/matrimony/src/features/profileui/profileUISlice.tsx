// features/profile/profileUiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const profileUiSlice = createSlice({
  name: 'profileUi',
  initialState: {
    showViewPopup: false,
  },
  reducers: {
    openViewPopup: (state) => {
      state.showViewPopup = true;
    },
    closeViewPopup: (state) => {
      state.showViewPopup = false;
    },
  },
});

export const { openViewPopup, closeViewPopup } = profileUiSlice.actions;
export default profileUiSlice.reducer;
