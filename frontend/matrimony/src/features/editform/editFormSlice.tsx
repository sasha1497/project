import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditFormState {
  isEditing: boolean;
  success: boolean;
  error: string | null;
}

const initialState: EditFormState = {
  isEditing: false,
  success: false,
  error: null,
};

const editFormSlice = createSlice({
  name: "editForm",
  initialState,
  reducers: {
    startEdit: (state) => {
      state.isEditing = true;
      state.success = false;
      state.error = null;
    },
    editSuccess: (state) => {
      state.isEditing = false;
      state.success = true;
    },
    editFailure: (state, action: PayloadAction<string>) => {
      state.isEditing = false;
      state.error = action.payload;
    },
    resetEditState: () => initialState,
  },
});

export const { startEdit, editSuccess, editFailure, resetEditState } = editFormSlice.actions;
export default editFormSlice.reducer;
