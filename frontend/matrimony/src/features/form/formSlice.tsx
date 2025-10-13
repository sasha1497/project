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
    },
    setTokens: (state, action) => {
      state = action.payload;
      localStorage.setItem('token', action.payload);
    },
      setUse: (state, action: PayloadAction<any>) => {
      state.authUser = action.payload; // save full user object
      localStorage.setItem('authUser', JSON.stringify(action.payload));
    },
  }
});

export const { updateFormData, resetForm, setTokens, setUse } = formSlice.actions;
export default formSlice.reducer;
