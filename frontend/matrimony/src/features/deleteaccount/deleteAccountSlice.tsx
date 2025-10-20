// src/features/deleteaccount/deleteAccountSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeleteAccountState {
  isDeleting: boolean;
  success: boolean;
  error: string | null;
}

const initialState: DeleteAccountState = {
  isDeleting: false,
  success: false,
  error: null,
};

const deleteAccountSlice = createSlice({
  name: "deleteAccount",
  initialState,
  reducers: {
    startDelete: (state) => {
      state.isDeleting = true;
      state.success = false;
      state.error = null;
    },
    deleteSuccess: (state) => {
      state.isDeleting = false;
      state.success = true;
    },
    deleteFailure: (state, action: PayloadAction<string>) => {
      state.isDeleting = false;
      state.error = action.payload;
    },
    resetDeleteState: () => initialState,
  },
});

export const { startDelete, deleteSuccess, deleteFailure, resetDeleteState } = deleteAccountSlice.actions;
export default deleteAccountSlice.reducer;
