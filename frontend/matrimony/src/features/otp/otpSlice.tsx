import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OtpState {
  mobileNumber: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: OtpState = {
  mobileNumber: null,
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
};

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    setOtpLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOtpSent: (state, action: PayloadAction<string>) => {
      state.mobileNumber = action.payload;
      state.otpSent = true;
      state.error = null;
    },
    setOtpVerified: (state) => {
      state.otpVerified = true;
      state.error = null;
    },
    setOtpError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetOtp: (state) => {
      state.mobileNumber = null;
      state.otpSent = false;
      state.otpVerified = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setOtpLoading,
  setOtpSent,
  setOtpVerified,
  setOtpError,
  resetOtp,
} = otpSlice.actions;

export default otpSlice.reducer;
