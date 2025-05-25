import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type FormData = {
  [key: string]: any;
};

const initialState: FormData = {};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<FormData>) => {
      return { ...state, ...action.payload };
    },
    resetForm: () => {
      return {};
    }
  }
});

export const { updateFormData, resetForm } = formSlice.actions;
export default formSlice.reducer;
