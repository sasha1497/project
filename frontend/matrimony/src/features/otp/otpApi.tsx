import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const otpApi = createApi({
  reducerPath: 'otpApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL, // from .env
  }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation<any, { mobileNumber: string }>({
      query: (body) => ({
        url: 'user/send_otp',
        method: 'POST',
        body,
      }),
    }),
    verifyOtp: builder.mutation<any, { mobileNumber: string; otp: string }>({
      query: (body) => ({
        url: 'user/verify_otp',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } = otpApi;
