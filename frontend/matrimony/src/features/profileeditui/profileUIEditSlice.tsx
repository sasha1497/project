// src/features/profile/profileUIEditSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileUIState {
  isEditPopupOpen: boolean;
  selectedProfileId: string | null;
}

const initialState: ProfileUIState = {
  isEditPopupOpen: false,
  selectedProfileId: null,
};

const profileUIEditSlice = createSlice({
  name: "profileUI",
  initialState,
  reducers: {
    openEditPopup: (state, action: PayloadAction<string>) => {
      state.isEditPopupOpen = true;
      state.selectedProfileId = action.payload;
    },
    closeEditPopup: (state) => {
      state.isEditPopupOpen = false;
      state.selectedProfileId = null;
    },
  },
});

export const { openEditPopup, closeEditPopup } = profileUIEditSlice.actions;
export default profileUIEditSlice.reducer;
