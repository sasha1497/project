import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const otpApi = createApi({
  reducerPath: 'otpApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
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
     resetPassword: builder.mutation<any, { mobileNumber: string; password: string; confirm_password: string }>({
      query: (body) => ({
        url: 'user/reset_password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } = otpApi;
